import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await loginUser(email, password);
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
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-accent text-text font-semibold rounded-lg hover:bg-accenthover transition"
          >
            Login
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
