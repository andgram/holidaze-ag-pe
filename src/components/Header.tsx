import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = (
    <>
      {user && token ? (
        <>
          <Link
            to="/profile"
            className="px-4 py-2 rounded-lg text-lg block w-full text-left md:inline-block md:w-auto"
          >
            Profile
          </Link>
          <Link
            to="/add-venue"
            className="px-4 py-2 rounded-lg text-lg block w-full text-left md:inline-block md:w-auto"
          >
            Add Venue
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-white text-lg w-full text-left md:inline-block md:w-auto"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg text-lg block w-full text-left"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg text-lg block w-full text-left"
          >
            Register
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="bg-primary text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-gray-400 transition-all">
            Holidaze
          </Link>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex space-x-8">{navLinks}</div>

        {/* Burger button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-2 px-6 pb-4 bg-primarydark">
          {navLinks}
        </div>
      )}
    </header>
  );
}

export default Header;
