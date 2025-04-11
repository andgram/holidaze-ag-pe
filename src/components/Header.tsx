import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      <h1>Holidaze</h1>
      <nav>
        <Link to="/">Home</Link> |{" "}
        {user ? (
          <>
            <Link to="/profile">Profile</Link> |{" "}
            <Link to="/add-venue">Add Venue</Link> |{" "}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> |{" "}
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
