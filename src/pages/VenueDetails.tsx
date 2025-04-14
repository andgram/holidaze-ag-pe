import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchVenueById, deleteVenue, createBooking } from "../api/api";
import Header from "../components/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
}

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
  bookings?: Booking[];
  _count?: { bookings: number }; // Added to match API
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
    if (!token) {
      setBookingError("Please log in to make a booking");
      navigate("/login");
      return;
    }
    if (!id) {
      setBookingError("Venue ID is missing");
      return;
    }
    if (!dateFrom) {
      setBookingError("Please select a start date");
      return;
    }
    if (!dateTo) {
      setBookingError("Please select an end date");
      return;
    }
    if (guests < 1) {
      setBookingError("Please select at least 1 guest");
      return;
    }
    if (venue?.maxGuests && guests > venue.maxGuests) {
      setBookingError(`Guests cannot exceed ${venue.maxGuests}`);
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
      setBookingError("Failed to create booking - check console for API error");
    }
  };

  if (loading) return <div className="text-center p-4">Loading venue...</div>;
  if (!venue) return <div className="text-center p-4">Venue not found</div>;

  const isOwner = user?.name === venue.owner.name;

  // Safely handle bookings
  const upcomingBookings = (venue.bookings || []).filter((booking) => {
    const today = new Date();
    const dateTo = new Date(booking.dateTo);
    return dateTo >= today;
  });

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <Header />
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800">{venue.name}</h1>
        <p className="text-gray-600 mt-2">{venue.description}</p>
        <p className="mt-4 text-xl font-medium text-gray-800">
          Price: ${venue.price} per night
        </p>
        <p className="text-gray-700">Max Guests: {venue.maxGuests}</p>
        {venue.media.length > 0 && (
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt}
            className="mt-4 max-w-full h-auto rounded-lg shadow-md"
          />
        )}
        <ul className="mt-4 space-y-2">
          <li className="text-gray-700">
            Wifi: {venue.meta.wifi ? "Yes" : "No"}
          </li>
          <li className="text-gray-700">
            Parking: {venue.meta.parking ? "Yes" : "No"}
          </li>
          <li className="text-gray-700">
            Breakfast: {venue.meta.breakfast ? "Yes" : "No"}
          </li>
          <li className="text-gray-700">
            Pets: {venue.meta.pets ? "Yes" : "No"}
          </li>
        </ul>

        {isOwner && token ? (
          <div className="mt-6">
            <button
              onClick={() => navigate(`/edit-venue/${venue.id}`)}
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit Venue
            </button>
            <button
              onClick={handleDelete}
              className="w-full mt-4 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Venue
            </button>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            <h2 className="mt-6 text-2xl font-semibold">Upcoming Bookings</h2>
            <p>Booking count: {venue._count?.bookings ?? "Unknown"}</p>
            {upcomingBookings.length === 0 ? (
              <p className="text-gray-600 mt-4">No upcoming bookings found.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {upcomingBookings.map((booking) => (
                  <li key={booking.id} className="border-b pb-4">
                    <p className="text-gray-700">
                      From: {new Date(booking.dateFrom).toLocaleDateString()} -
                      To: {new Date(booking.dateTo).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">Guests: {booking.guests}</p>
                    <p className="text-gray-500">
                      Booked on:{" "}
                      {new Date(booking.created).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : token ? (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Book This Venue</h2>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <DatePicker
                selected={dateFrom}
                onChange={(date: Date | null) => setDateFrom(date)}
                selectsStart
                startDate={dateFrom}
                endDate={dateTo}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select start date"
                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <DatePicker
                selected={dateTo}
                onChange={(date: Date | null) => setDateTo(date)}
                selectsEnd
                startDate={dateFrom}
                endDate={dateTo}
                minDate={dateFrom || new Date()}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select end date"
                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Number of Guests (max {venue.maxGuests})
              </label>
              <input
                type="number"
                value={guests}
                onChange={(e) =>
                  setGuests(
                    Math.max(
                      1,
                      Math.min(
                        venue.maxGuests || Infinity,
                        Number(e.target.value)
                      )
                    )
                  )
                }
                min="1"
                max={venue.maxGuests}
                required
                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleBooking}
              className="w-full mt-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Book Now
            </button>
            {bookingError && (
              <p className="text-red-500 mt-4 text-center">{bookingError}</p>
            )}
          </div>
        ) : (
          <div className="mt-6 text-center">
            <p>
              Please{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                log in
              </Link>{" "}
              to book this venue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VenueDetails;
