import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchVenueById, deleteVenue, createBooking } from "../api/api";
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
  _count?: { bookings: number };
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
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadVenue = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const venueData = await fetchVenueById(id);
        setVenue(venueData);
      } catch (err) {
        console.error("Failed to load venue:", err);
        setError("Failed to load venue");
      } finally {
        setLoading(false);
      }
    };
    loadVenue();
  }, [id]);

  useEffect(() => {
    if (venue && guests > venue.maxGuests) {
      setGuests(venue.maxGuests);
    }
  }, [venue, guests]);

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
    if (bookingLoading) return;
    setBookingError(null);

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

    const isOverlapping = (venue?.bookings || []).some((booking) => {
      const existingFrom = new Date(booking.dateFrom);
      const existingTo = new Date(booking.dateTo);
      return dateFrom <= existingTo && dateTo >= existingFrom;
    });

    if (isOverlapping) {
      setBookingError("Selected dates overlap with an existing booking.");
      return;
    }

    setBookingLoading(true);
    const booking = await createBooking(
      token,
      dateFrom.toISOString(),
      dateTo.toISOString(),
      guests,
      id
    );
    setBookingLoading(false);

    if (booking) {
      setBookingSuccess("Booking successful!");
      setBookingError(null);
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } else {
      setBookingError("Failed to create booking");
    }
  };

  if (loading) return <div className="text-center p-4">Loading venue...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!venue) return <div className="text-center p-4">Venue not found</div>;

  const isOwner = user?.name === venue.owner.name;

  const upcomingBookings = (venue.bookings || []).filter((booking) => {
    const today = new Date();
    const dateTo = new Date(booking.dateTo);
    return dateTo >= today;
  });

  const bookedDateIntervals = (venue.bookings || []).map((booking) => ({
    start: new Date(booking.dateFrom),
    end: new Date(booking.dateTo),
  }));

  return (
    <div className="bg-background min-h-screen p-8">
      {bookingSuccess && (
        <div className="mb-4 p-4 bg-accent border text-text rounded">
          {bookingSuccess}
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="text-text hover:text-accenthover underline mb-4 inline-block"
        >
          ← Back to venues
        </Link>

        {venue.media.length > 0 && (
          <div className="relative h-64 mb-6">
            <img
              src={venue.media[0].url}
              alt={venue.media[0].alt}
              className="w-full h-64 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-4 rounded-xl">
              <h1 className="text-3xl font-semibold text-white">
                {venue.name}
              </h1>
              <p className="text-xl font-medium text-white mt-2">
                ${venue.price} per night
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-text mb-4">
              Description
            </h2>
            <p className="text-text">{venue.description}</p>
            <p className="text-text mt-4">Max Guests: {venue.maxGuests}</p>
            <h2 className="text-2xl font-semibold text-text mt-6 mb-4">
              Facilities
            </h2>
            <ul className="space-y-2">
              <li className="text-text">
                Wifi: {venue.meta.wifi ? "Yes" : "No"}
              </li>
              <li className="text-text">
                Parking: {venue.meta.parking ? "Yes" : "No"}
              </li>
              <li className="text-text">
                Breakfast: {venue.meta.breakfast ? "Yes" : "No"}
              </li>
              <li className="text-text">
                Pets: {venue.meta.pets ? "Yes" : "No"}
              </li>
            </ul>
          </div>

          <div className="bg-primary p-6 rounded-xl shadow-md">
            {isOwner && token ? (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Manage Venue
                </h2>
                <button
                  onClick={() => navigate(`/edit-venue/${venue.id}`)}
                  className="w-full py-3 bg-accent text-text rounded-lg font-semibold hover:bg-accenthover transition focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Edit Venue
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full mt-4 py-3 bg-text text-white rounded-lg font-semibold hover:bg-black transition focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete Venue
                </button>
                {error && (
                  <p className="text-red-500 mt-4 text-center">{error}</p>
                )}
                <h2 className="mt-6 mb-6 text-2xl font-semibold text-white">
                  Upcoming Bookings
                </h2>
                <p className="text-background">
                  Booking count: {venue._count?.bookings ?? "Unknown"}
                </p>
                {upcomingBookings.length === 0 ? (
                  <p className="text-background mt-4">
                    No upcoming bookings found.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-4">
                    {upcomingBookings.map((booking) => (
                      <li key={booking.id} className="border-b pb-4">
                        <p className="text-background">
                          From:{" "}
                          {new Date(booking.dateFrom).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}{" "}
                          - To:{" "}
                          {new Date(booking.dateTo).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </p>
                        <p className="text-background">
                          Guests: {booking.guests}
                        </p>
                        <p className="text-background">
                          Booked on:{" "}
                          {new Date(booking.created).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : token ? (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Book This Venue
                </h2>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-white">
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
                    excludeDateIntervals={bookedDateIntervals}
                    className="w-full mt-2 p-3 border border-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-white">
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
                    excludeDateIntervals={bookedDateIntervals}
                    className="w-full mt-2 p-3 border border-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-white">
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
                    className="w-full mt-2 p-3 border border-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className={`w-full mt-6 py-3 bg-accent text-text rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent ${
                    bookingLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-accenthover"
                  }`}
                >
                  {bookingLoading ? "Booking..." : "Book Now"}
                </button>
                {bookingError && (
                  <p className="text-red-500 mt-4 text-center">
                    {bookingError}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-6 text-center">
                <p className="text-white">
                  Please{" "}
                  <Link
                    to="/login"
                    className="text-accent hover:text-accenthover"
                  >
                    log in
                  </Link>{" "}
                  to book this venue.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VenueDetails;
