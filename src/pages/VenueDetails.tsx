import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchVenueById, deleteVenue, createBooking } from "../api/api";
import Header from "../components/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  media: { url: string; alt: string }[];
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  owner: { name: string };
}

function VenueDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const loadVenue = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const venueData = await fetchVenueById(id);
      setVenue(venueData);
      setLoading(false);
    };
    loadVenue();
  }, [id]);

  const handleDelete = async () => {
    if (!token || !id) return;
    const success = await deleteVenue(token, id);
    if (success) {
      navigate("/profile");
    } else {
      setError("Failed to delete venue");
    }
  };

  const handleBooking = async () => {
    if (
      !token ||
      !id ||
      !dateFrom ||
      !dateTo ||
      guests < 1 ||
      guests > (venue?.maxGuests || 0)
    ) {
      setBookingError("Please select valid dates and number of guests");
      return;
    }

    const booking = await createBooking(
      token,
      dateFrom.toISOString(),
      dateTo.toISOString(),
      guests,
      id
    );

    if (booking) {
      navigate("/profile");
    } else {
      setBookingError("Failed to create booking");
    }
  };

  if (loading) return <div>Loading venue...</div>;
  if (!venue) return <div>Venue not found</div>;

  const isOwner = user?.name === venue.owner.name;

  return (
    <div>
      <Header />
      <h1>{venue.name}</h1>
      <p>{venue.description}</p>
      <p>Price: ${venue.price} per night</p>
      <p>Max Guests: {venue.maxGuests}</p>
      {venue.media.length > 0 && (
        <img
          src={venue.media[0].url}
          alt={venue.media[0].alt}
          style={{ maxWidth: "300px" }}
        />
      )}
      <ul>
        <li>Wifi: {venue.meta.wifi ? "Yes" : "No"}</li>
        <li>Parking: {venue.meta.parking ? "Yes" : "No"}</li>
        <li>Breakfast: {venue.meta.breakfast ? "Yes" : "No"}</li>
        <li>Pets: {venue.meta.pets ? "Yes" : "No"}</li>
      </ul>

      {isOwner && token ? (
        <div>
          <button onClick={() => navigate(`/edit-venue/${venue.id}`)}>
            Edit Venue
          </button>
          <button onClick={handleDelete}>Delete Venue</button>
          {error && <p>{error}</p>}
        </div>
      ) : (
        <div>
          <h2>Book This Venue</h2>
          <div>
            <label>
              Start Date:
              <DatePicker
                selected={dateFrom}
                onChange={(date: Date | null) => setDateFrom(date)}
                selectsStart
                startDate={dateFrom}
                endDate={dateTo}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select start date"
              />
            </label>
          </div>
          <div>
            <label>
              End Date:
              <DatePicker
                selected={dateTo}
                onChange={(date: Date | null) => setDateTo(date)}
                selectsEnd
                startDate={dateFrom}
                endDate={dateTo}
                minDate={dateFrom || new Date()}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select end date"
              />
            </label>
          </div>
          <div>
            <label>
              Number of Guests (max {venue.maxGuests}):
              <input
                type="number"
                value={guests}
                onChange={(e) =>
                  setGuests(
                    Math.max(
                      1,
                      Math.min(venue.maxGuests, Number(e.target.value))
                    )
                  )
                }
                min="1"
                max={venue.maxGuests}
              />
            </label>
          </div>
          <button onClick={handleBooking}>Book Now</button>
          {bookingError && <p>{bookingError}</p>}
        </div>
      )}
    </div>
  );
}

export default VenueDetails;
