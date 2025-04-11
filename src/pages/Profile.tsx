import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchUserBookings } from "../api/api";

interface Booking {
  id: string;
  venue: {
    id: string;
    name: string;
  };
  dateFrom: string;
  dateTo: string;
  guests: number;
}

function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user?.name) {
      navigate("/login");
      return;
    }

    const loadBookings = async () => {
      const bookingData = await fetchUserBookings(token, user.name);
      setBookings(bookingData);
      setLoading(false);
    };
    loadBookings();
  }, [token, user, navigate]);

  if (loading) {
    return <div>Loading your bookings...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <h2>Your Upcoming Bookings</h2>
      {bookings.length === 0 ? (
        <p>No upcoming bookings found.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>
              <h3>{booking.venue.name || "Unknown Venue"}</h3>
              <p>
                From: {new Date(booking.dateFrom).toLocaleDateString()} - To:{" "}
                {new Date(booking.dateTo).toLocaleDateString()}
              </p>
              <p>Guests: {booking.guests}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Profile;
