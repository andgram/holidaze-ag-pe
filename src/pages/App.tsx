import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchVenues, searchVenues } from "../api/api";
import Header from "../components/Header";

interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  media: { url: string; alt: string }[];
}

function App() {
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
      fetchVenues().then((data) => setVenues(data));
    } else {
      searchVenues(searchTerm).then((data) => setVenues(data));
    }
  }, [searchTerm]);

  if (loading) return <div>Loading venues...</div>;

  return (
    <div>
      <Header />
      <section>
        <input
          type="text"
          placeholder="Search venues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>
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
