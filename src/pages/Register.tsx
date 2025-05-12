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
  const [loading, setLoading] = useState(false); // Loading state
  const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility toggle

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!name.match(/^[a-zA-Z0-9_]+$/)) {
      setError("Name must contain only letters, numbers, or underscores");
      setLoading(false);
      return;
    }
    if (!email.endsWith("@stud.noroff.no")) {
      setError("Email must be a valid stud.noroff.no address");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }
    if (bio && bio.length > 160) {
      setError("Bio must be less than 160 characters");
      setLoading(false);
      return;
    }
    if (avatarUrl && !isValidUrl(avatarUrl)) {
      setError("Avatar URL must be a valid URL");
      setLoading(false);
      return;
    }
    if (avatarAlt && avatarAlt.length > 120) {
      setError("Avatar alt text must be less than 120 characters");
      setLoading(false);
      return;
    }
    if (bannerUrl && !isValidUrl(bannerUrl)) {
      setError("Banner URL must be a valid URL");
      setLoading(false);
      return;
    }
    if (bannerAlt && bannerAlt.length > 120) {
      setError("Banner alt text must be less than 120 characters");
      setLoading(false);
      return;
    }

    const result = await registerUser(
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

    setLoading(false);

    if (result?.success) {
      navigate("/login");
    } else {
      setError(result?.error || "Failed to register user");
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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/auth-bg.jpg')`,
      }}
    >
      <div className="absolute inset-0"></div>
      <div className="bg-primary p-8 rounded-xl shadow-md w-full max-w-sm sm:max-w-lg relative z-10">
        <h1 className="text-3xl font-semibold text-center text-white mb-6">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div>
            <label className="block text-sm font-medium text-white">
              Username (letters, numbers, underscores only):
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Email (must be @stud.noroff.no):
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Password (min 8 characters):
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 mt-2 border border-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute top-5 right-3 text-white"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                {passwordVisible ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="text-accent hover:text-accenthover w-full mt-4"
            >
              {showOptional ? "Hide Optional Fields" : "Show Optional Fields"}
            </button>
          </div>

          {showOptional && (
            <>
              <div>
                <label className="block text-sm font-medium text-white">
                  Bio (optional, max 160 characters):
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={160}
                  className="w-full p-3 mt-2 border border-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  Avatar URL (optional):
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full p-3 mt-2 border border-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              {avatarUrl && (
                <div>
                  <label className="block text-sm font-medium text-white">
                    Avatar Alt Text (optional, max 120 characters):
                  </label>
                  <input
                    type="text"
                    value={avatarAlt}
                    onChange={(e) => setAvatarAlt(e.target.value)}
                    maxLength={120}
                    className="w-full p-3 mt-2 border border-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-white">
                  Banner URL (optional):
                </label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full p-3 mt-2 border border-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              {bannerUrl && (
                <div>
                  <label className="block text-sm font-medium text-white">
                    Banner Alt Text (optional, max 120 characters):
                  </label>
                  <input
                    type="text"
                    value={bannerAlt}
                    onChange={(e) => setBannerAlt(e.target.value)}
                    maxLength={120}
                    className="w-full p-3 mt-2 border border-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-white">
                  Venue Manager:
                </label>
                <input
                  type="checkbox"
                  checked={venueManager}
                  onChange={(e) => setVenueManager(e.target.checked)}
                  className="mr-2 leading-tight accent-accent"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 mt-4 bg-accent text-text rounded-lg font-semibold hover:bg-accenthover transition focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </form>
        <p className="text-center mt-4 text-sm text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:text-accenthover">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
