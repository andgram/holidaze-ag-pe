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
  const [allVenues, setAllVenues] = useState<Venue[]>([]); // Store all fetched venues
  const [displayedVenues, setDisplayedVenues] = useState<Venue[]>([]); // Venues currently shown
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Current page of 12 venues

  const VENUES_PER_PAGE = 12;

  useEffect(() => {
    const loadVenues = async () => {
      const venueData = await fetchVenues();
      setAllVenues(venueData);
      setDisplayedVenues(venueData.slice(0, VENUES_PER_PAGE));
      setLoading(false);
    };
    loadVenues();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      // Reset to full list when search is cleared
      fetchVenues().then((data) => {
        setAllVenues(data);
        setDisplayedVenues(data.slice(0, VENUES_PER_PAGE));
        setPage(1);
      });
    } else {
      // Search and reset pagination
      searchVenues(searchTerm).then((data) => {
        setAllVenues(data);
        setDisplayedVenues(data.slice(0, VENUES_PER_PAGE));
        setPage(1);
      });
    }
  }, [searchTerm]);

  const loadMore = () => {
    const nextPage = page + 1;
    const newDisplayed = allVenues.slice(0, nextPage * VENUES_PER_PAGE);
    setDisplayedVenues(newDisplayed);
    setPage(nextPage);
  };

  if (loading) return <div>Loading venues...</div>;

  const hasMore = displayedVenues.length < allVenues.length;

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
      {displayedVenues.length === 0 ? (
        <p>No venues found.</p>
      ) : (
        <>
          <ul>
            {displayedVenues.map((venue) => (
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
          {hasMore && <button onClick={loadMore}>Load More</button>}
        </>
      )}
    </div>
  );
}

export default App;
