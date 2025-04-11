import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchVenues, searchVenues } from "../api/api";

interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  media: { url: string; alt: string }[];
}

function App() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVenues = async () => {
      const venueData = await fetchVenues();
      setVenues(venueData);
      setLoading(false);
    };
    loadVenues();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      // Reset to full list when search is cleared
      fetchVenues().then((data) => setVenues(data));
    } else {
      // Search when there's a term
      searchVenues(searchTerm).then((data) => setVenues(data));
    }
  }, [searchTerm]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <div>Loading venues...</div>;

  return (
    <div>
      <header>
        <nav>
          <Link to="/">Home</Link>
          {user && token ? (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/add-venue">Add Venue</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
          <input
            type="text"
            placeholder="Search venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </nav>
      </header>
      <h1>All Venues</h1>
      {venues.length === 0 ? (
        <p>No venues found.</p>
      ) : (
        <ul>
          {venues.map((venue) => (
            <li key={venue.id}>
              <Link to={`/venues/${venue.id}`}>
                <h2>{venue.name}</h2>
              </Link>
              <p>{venue.description}</p>
              <p>Price: ${venue.price}</p>
              {venue.media.length > 0 && (
                <img
                  src={venue.media[0].url}
                  alt={venue.media[0].alt}
                  style={{ maxWidth: "200px" }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
