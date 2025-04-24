import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo or Title */}
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-gray-400 transition-all">
            VenueApp
          </Link>
        </div>

        {/* Links */}
        <div className="flex space-x-8">
          {user && token ? (
            <>
              <Link
                to="/profile"
                className="px-4 py-2 rounded-lg text-lg hover:bg-gray-700 transition-all"
              >
                Profile
              </Link>
              <Link
                to="/add-venue"
                className="px-4 py-2 rounded-lg text-lg hover:bg-gray-700 transition-all"
              >
                Add Venue
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-lg hover:bg-red-700 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-lg hover:bg-gray-700 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-lg hover:bg-gray-700 transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
