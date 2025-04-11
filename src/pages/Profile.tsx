import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Add Link
import { useAuth } from "../context/AuthContext";
import {
  fetchUserBookings,
  fetchProfile,
  updateProfile,
  fetchUserVenues,
} from "../api/api";

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

interface ProfileData {
  name: string;
  email: string;
  bio?: string;
  avatar?: { url: string; alt: string };
  banner?: { url: string; alt: string };
  venueManager: boolean;
}

interface Venue {
  id: string;
  name: string;
}

function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user?.name) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      const [bookingData, profileData, venueData] = await Promise.all([
        fetchUserBookings(token, user.name),
        fetchProfile(token, user.name),
        fetchUserVenues(token, user.name),
      ]);
      setBookings(bookingData);
      setProfile(profileData);
      setVenues(venueData);
      setBio(profileData?.bio || "");
      setAvatarUrl(profileData?.avatar?.url || "");
      setBannerUrl(profileData?.banner?.url || "");
      setVenueManager(profileData?.venueManager || false);
      setLoading(false);
    };
    loadData();
  }, [token, user, navigate]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const updatedProfile = await updateProfile(
      token!,
      user!.name,
      bio || undefined,
      avatarUrl || undefined,
      "User avatar",
      bannerUrl || undefined,
      "Profile banner",
      venueManager
    );
    if (updatedProfile) {
      setProfile(updatedProfile);
      setEditMode(false);
    } else {
      setError("Failed to update profile");
    }
  };

  if (loading) {
    return <div>Loading your profile...</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile?.name}</h1>
      <section>
        <h2>Profile Info</h2>
        <p>Email: {profile?.email}</p>
        <p>Bio: {profile?.bio || "No bio set"}</p>
        {profile?.avatar?.url && (
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt}
            style={{ maxWidth: "100px" }}
          />
        )}
        {profile?.banner?.url && (
          <img
            src={profile.banner.url}
            alt={profile.banner.alt}
            style={{ maxWidth: "200px" }}
          />
        )}
        <p>Venue Manager: {profile?.venueManager ? "Yes" : "No"}</p>
        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
        {editMode && (
          <form onSubmit={handleEditSubmit}>
            <div>
              <label>
                Bio:
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                />
              </label>
            </div>
            <div>
              <label>
                Avatar URL:
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </label>
            </div>
            <div>
              <label>
                Banner URL:
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                />
              </label>
            </div>
            <div>
              <label>
                Venue Manager:
                <input
                  type="checkbox"
                  checked={venueManager}
                  onChange={(e) => setVenueManager(e.target.checked)}
                />
              </label>
            </div>
            <button type="submit">Save Changes</button>
            {error && <p>{error}</p>}
          </form>
        )}
      </section>

      <section>
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
      </section>

      <section>
        <h2>Your Venues</h2>
        {venues.length === 0 ? (
          <p>No venues created yet.</p>
        ) : (
          <ul>
            {venues.map((venue) => (
              <li key={venue.id}>
                <Link to={`/venues/${venue.id}`}>
                  <h3>{venue.name}</h3>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Profile;
