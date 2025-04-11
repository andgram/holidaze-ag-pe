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
  const [showOptional, setShowOptional] = useState(false); // New toggle state
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
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username (letters, numbers, underscores only):
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email (must be @stud.noroff.no):
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password (min 8 characters):
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <button type="button" onClick={() => setShowOptional(!showOptional)}>
            {showOptional ? "Hide Optional Fields" : "Show Optional Fields"}
          </button>
        </div>
        {showOptional && (
          <>
            <div>
              <label>
                Bio (optional, max 160 characters):
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={160}
                />
              </label>
            </div>
            <div>
              <label>
                Avatar URL (optional):
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </label>
            </div>
            {avatarUrl && (
              <div>
                <label>
                  Avatar Alt Text (optional, max 120 characters):
                  <input
                    type="text"
                    value={avatarAlt}
                    onChange={(e) => setAvatarAlt(e.target.value)}
                    maxLength={120}
                  />
                </label>
              </div>
            )}
            <div>
              <label>
                Banner URL (optional):
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                />
              </label>
            </div>
            {bannerUrl && (
              <div>
                <label>
                  Banner Alt Text (optional, max 120 characters):
                  <input
                    type="text"
                    value={bannerAlt}
                    onChange={(e) => setBannerAlt(e.target.value)}
                    maxLength={120}
                  />
                </label>
              </div>
            )}
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
          </>
        )}
        <button type="submit">Register</button>
        {error && <p>{error}</p>}
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
