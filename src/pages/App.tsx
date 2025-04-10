import React, { useEffect, useState } from "react";
import { fetchVenues } from "../api/venues";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
}

function App() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVenues = async () => {
      const venueData = await fetchVenues();
      setVenues(venueData);
      setLoading(false);
    };
    loadVenues();
  }, []);

  if (loading) {
    return <div>Loading venues...</div>;
  }

  return (
    <div>
      <Header />
      <main>
        <h2>Browse Venues</h2>
        <ul>
          {venues.map((venue) => (
            <li key={venue.id}>
              <h3>
                <Link to={`/venues/${venue.id}`}>{venue.name}</Link>
              </h3>
              <p>{venue.description}</p>
              <p>Price: ${venue.price}</p>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}

export default App;
