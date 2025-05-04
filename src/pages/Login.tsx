import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // State to track loading
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility toggle
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Set loading to true when submitting
    const result = await loginUser(email, password);
    setLoading(false); // Set loading to false when the request completes

    if (result) {
      login(result.token, result.user);
      navigate("/profile");
    } else {
      setError("Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/auth-bg.jpg')`,
      }}
    >
      <div className="bg-primary p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password:
            </label>
            <div className="relative">
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute top-3 right-3 text-white"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                {passwordVisible ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-text font-semibold rounded-lg hover:bg-accenthover transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-white">
          Don’t have an account?{" "}
          <Link to="/register" className="text-accent hover:text-accenthover">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
