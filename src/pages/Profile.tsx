import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchUserBookings,
  fetchProfile,
  updateProfile,
  fetchUserVenues,
} from "../api/api";

interface Booking {
  id: string;
  venue: { id: string; name: string };
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
  const location = useLocation();
  const message = location.state?.message;
  const [visibleMessage, setVisibleMessage] = useState(message);

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

  const defaultAvatar = "/placeholder-avatar.jpg";
  const defaultBanner = "/placeholder-banner.jpg";
  const defaultApiAvatarUrl =
    "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400";

  const defaultApiBannerUrl =
    "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500";

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

      setAvatarUrl(
        profileData?.avatar?.url === defaultApiAvatarUrl
          ? ""
          : profileData?.avatar?.url || ""
      );
      setBannerUrl(
        profileData?.banner?.url === defaultApiBannerUrl
          ? ""
          : profileData?.banner?.url || ""
      );

      setVenueManager(profileData?.venueManager || false);
      setLoading(false);
    };
    loadData();
  }, [token, user, navigate]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setVisibleMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const avatarValue =
        avatarUrl.trim() === "" || avatarUrl === profile?.avatar?.url
          ? undefined
          : avatarUrl;

      const bannerValue =
        bannerUrl.trim() === "" || bannerUrl === profile?.banner?.url
          ? undefined
          : bannerUrl;

      const updatedProfile = await updateProfile(
        token!,
        user!.name,
        bio !== profile?.bio ? bio : undefined,
        avatarValue,
        bannerValue,
        venueManager !== profile?.venueManager
          ? venueManager
            ? "true"
            : "false"
          : undefined
      );

      if (updatedProfile) {
        setProfile(updatedProfile);
        setEditMode(false);
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  if (loading) {
    return <div>Loading your profile...</div>;
  }

  return (
    <div className="bg-white min-h-screen flex flex-col items-center p-6">
      {visibleMessage && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-4 w-full max-w-4xl">
          {visibleMessage}
        </div>
      )}

      <div className="max-w-4xl w-full bg-background p-6 rounded-xl">
        <div className="relative w-full h-48">
          <img
            src={
              avatarUrl
                ? avatarUrl
                : profile?.avatar?.url === defaultApiAvatarUrl
                ? defaultAvatar
                : profile?.avatar?.url || defaultAvatar
            }
            alt={profile?.avatar?.alt || "User avatar"}
            className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full object-cover"
          />

          <img
            src={
              bannerUrl
                ? bannerUrl
                : profile?.banner?.url === defaultApiBannerUrl
                ? defaultBanner
                : profile?.banner?.url || defaultBanner
            }
            alt={profile?.banner?.alt || "Profile banner"}
            className="w-full h-48 object-cover rounded-xl"
          />
        </div>
        <h1 className="text-3xl font-bold text-center text-primary mt-12 mb-6">
          Welcome, {profile?.name}
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text">
            Profile Info
          </h2>
          <p className="text-lg text-text">Email: {profile?.email}</p>
          <p className="text-lg text-text">
            Bio: {profile?.bio || "No bio set"}
          </p>
          <p className="text-lg text-text mt-2">
            Venue Manager: {profile?.venueManager ? "Yes" : "No"}
          </p>
          <button
            onClick={() => setEditMode(!editMode)}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-accenthover transition"
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </section>

        {editMode && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="bio"
                className="block text-lg font-medium text-text"
              >
                Bio (optional):
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full p-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label
                htmlFor="avatarUrl"
                className="block text-lg font-medium text-text"
              >
                Avatar URL (optional):
              </label>
              <input
                type="url"
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full p-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label
                htmlFor="bannerUrl"
                className="block text-lg font-medium text-text"
              >
                Banner URL (optional):
              </label>
              <input
                type="url"
                id="bannerUrl"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://example.com/banner.jpg"
                className="w-full p-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-text">
                Venue Manager:
              </label>
              <input
                type="checkbox"
                checked={venueManager}
                onChange={(e) => setVenueManager(e.target.checked)}
                className="h-5 w-5 accent-accent"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-accent text-text font-semibold rounded-lg hover:bg-accenthover transition"
            >
              Save Changes
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        )}
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-6 max-w-4xl w-full mt-8">
        <section className="bg-background p-6 rounded-xl flex-1">
          <h2 className="text-2xl font-semibold mb-4 text-text">
            Your Upcoming Bookings
          </h2>
          {bookings.length === 0 ? (
            <p className="text-text">No upcoming bookings found.</p>
          ) : (
            <ul>
              {bookings.map((booking) => (
                <li key={booking.id} className="mb-4">
                  <h3 className="text-xl font-semibold text-text">
                    {booking.venue.name}
                  </h3>
                  <p className="text-text">
                    From: {new Date(booking.dateFrom).toLocaleDateString()} -
                    To: {new Date(booking.dateTo).toLocaleDateString()}
                  </p>
                  <p className="text-text">Guests: {booking.guests}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-background p-6 rounded-xl flex-1 lg:mt-0 mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-text">Your Venues</h2>
          {venues.length === 0 ? (
            <p className="text-text">No venues created yet.</p>
          ) : (
            <ul>
              {venues.map((venue) => (
                <li key={venue.id} className="mb-4">
                  <Link to={`/venues/${venue.id}`} className="text-accent">
                    <h3 className="text-xl text-text underline hover:text-accenthover">
                      {venue.name}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;
