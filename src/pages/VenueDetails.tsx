import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchVenueById, createBooking } from "../api/api";
import { useAuth } from "../context/AuthContext";

interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    country: string;
  };
}

interface Booking {
  id: string;
  venueId: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
}

function VenueDetails() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadVenue = async () => {
      if (!id) return;
      const venueData = await fetchVenueById(id);
      setVenue(venueData);
      setLoading(false);
    };
    loadVenue();
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!token) {
      navigate("/login");
      return;
    }

    setBookingStatus("Creating booking...");
    const booking = await createBooking(id, dateFrom, dateTo, guests, token);
    if (booking) {
      setBookingStatus("Booking created successfully!");
      setDateFrom("");
      setDateTo("");
      setGuests(1);
    } else {
      setBookingStatus("Failed to create booking. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading venue details...</div>;
  }

  if (!venue) {
    return <div>Venue not found</div>;
  }

  return (
    <div>
      <h1>{venue.name}</h1>
      <p>{venue.description}</p>
      <p>Price: ${venue.price}</p>
      <p>
        Location: {venue.location.address}, {venue.location.city},{" "}
        {venue.location.country}
      </p>

      <h2>Book This Venue</h2>
      <form onSubmit={handleBookingSubmit}>
        <div>
          <label>
            Check-in Date:
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Check-out Date:
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Guests:
            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              required
            />
          </label>
        </div>
        <button type="submit">Book Now</button>
      </form>
      {bookingStatus && <p>{bookingStatus}</p>}

      <a href="/">Back to Home</a>
    </div>
  );
}

export default VenueDetails;
