import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      <h1>Holidaze</h1>
      <nav>
        <Link to="/">Home</Link> | <Link to="/venues">Venues</Link> |{" "}
        {user ? (
          <>
            <span>Welcome, {user.name}</span> |{" "}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
