import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <h1>Holidaze</h1>
      <nav>
        <Link to="/">Home</Link> | <Link to="/venues">Venues</Link> |{" "}
        <Link to="/bookings">Bookings</Link>
      </nav>
    </header>
  );
}

export default Header;
