import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchUserBookings,
  fetchProfile,
  updateProfile,
  fetchUserVenues,
} from "../api/api";
import Header from "../components/Header";

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
    <div className="bg-gray-50 min-h-screen flex flex-col items-center p-6">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Welcome, {profile?.name}
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Profile Info</h2>
          <p className="text-lg">Email: {profile?.email}</p>
          <p className="text-lg">Bio: {profile?.bio || "No bio set"}</p>
          {profile?.avatar?.url && (
            <img
              src={profile.avatar.url}
              alt={profile.avatar.alt}
              className="w-24 h-24 rounded-full object-cover mt-4"
            />
          )}
          {profile?.banner?.url && (
            <img
              src={profile.banner.url}
              alt={profile.banner.alt}
              className="w-full h-48 object-cover mt-4 rounded-lg"
            />
          )}
          <p className="text-lg mt-2">
            Venue Manager: {profile?.venueManager ? "Yes" : "No"}
          </p>
          <button
            onClick={() => setEditMode(!editMode)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </section>

        {editMode && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label htmlFor="bio" className="block text-lg font-medium">
                Bio:
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label htmlFor="avatarUrl" className="block text-lg font-medium">
                Avatar URL:
              </label>
              <input
                type="url"
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label htmlFor="bannerUrl" className="block text-lg font-medium">
                Banner URL:
              </label>
              <input
                type="url"
                id="bannerUrl"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://example.com/banner.jpg"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-lg font-medium">
                Venue Manager:
              </label>
              <input
                type="checkbox"
                checked={venueManager}
                onChange={(e) => setVenueManager(e.target.checked)}
                className="h-5 w-5"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        )}
      </div>

      <section className="max-w-4xl w-full bg-white p-6 mt-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Upcoming Bookings</h2>
        {bookings.length === 0 ? (
          <p>No upcoming bookings found.</p>
        ) : (
          <ul>
            {bookings.map((booking) => (
              <li key={booking.id} className="mb-4">
                <h3 className="text-xl font-semibold">{booking.venue.name}</h3>
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

      <section className="max-w-4xl w-full bg-white p-6 mt-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Venues</h2>
        {venues.length === 0 ? (
          <p>No venues created yet.</p>
        ) : (
          <ul>
            {venues.map((venue) => (
              <li key={venue.id} className="mb-4">
                <Link
                  to={`/venues/${venue.id}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <h3 className="text-xl font-semibold">{venue.name}</h3>
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
