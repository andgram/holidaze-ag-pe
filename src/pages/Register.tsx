import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/api";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarAlt, setAvatarAlt] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerAlt, setBannerAlt] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!name.match(/^[a-zA-Z0-9_]+$/)) {
      setError("Name must contain only letters, numbers, or underscores");
      return;
    }
    if (!email.endsWith("@stud.noroff.no")) {
      setError("Email must be a valid stud.noroff.no address");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (bio && bio.length > 160) {
      setError("Bio must be less than 160 characters");
      return;
    }
    if (avatarUrl && !isValidUrl(avatarUrl)) {
      setError("Avatar URL must be a valid URL");
      return;
    }
    if (avatarAlt && avatarAlt.length > 120) {
      setError("Avatar alt text must be less than 120 characters");
      return;
    }
    if (bannerUrl && !isValidUrl(bannerUrl)) {
      setError("Banner URL must be a valid URL");
      return;
    }
    if (bannerAlt && bannerAlt.length > 120) {
      setError("Banner alt text must be less than 120 characters");
      return;
    }

    const user = await registerUser(
      name,
      email,
      password,
      bio || undefined,
      avatarUrl || undefined,
      avatarAlt || undefined,
      bannerUrl || undefined,
      bannerAlt || undefined,
      venueManager
    );

    if (user) {
      navigate("/login");
    } else {
      setError("Failed to register user");
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username (letters, numbers, underscores only):
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email (must be @stud.noroff.no):
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password (min 8 characters):
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="text-blue-500 hover:underline w-full mt-4"
            >
              {showOptional ? "Hide Optional Fields" : "Show Optional Fields"}
            </button>
          </div>
          {showOptional && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio (optional, max 160 characters):
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={160}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Avatar URL (optional):
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {avatarUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Avatar Alt Text (optional, max 120 characters):
                  </label>
                  <input
                    type="text"
                    value={avatarAlt}
                    onChange={(e) => setAvatarAlt(e.target.value)}
                    maxLength={120}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Banner URL (optional):
                </label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {bannerUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Banner Alt Text (optional, max 120 characters):
                  </label>
                  <input
                    type="text"
                    value={bannerAlt}
                    onChange={(e) => setBannerAlt(e.target.value)}
                    maxLength={120}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Venue Manager:
                </label>
                <input
                  type="checkbox"
                  checked={venueManager}
                  onChange={(e) => setVenueManager(e.target.checked)}
                  className="mr-2 leading-tight"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full p-3 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
