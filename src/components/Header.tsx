import React from "react";

function Header() {
  return (
    <header>
      <h1>Holidaze</h1>
      <nav>
        <a href="/">Home</a> | <a href="/venues">Venues</a> |{" "}
        <a href="/bookings">Bookings</a>
      </nav>
    </header>
  );
}

export default Header;
