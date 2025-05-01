import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [displayedVenues, setDisplayedVenues] = useState<Venue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

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
      fetchVenues().then((data) => {
        setAllVenues(data);
        setDisplayedVenues(data.slice(0, VENUES_PER_PAGE));
        setPage(1);
      });
    } else {
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

  if (loading)
    return <div className="text-center py-10 text-lg">Loading venues...</div>;

  const hasMore = displayedVenues.length < allVenues.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative w-full h-[400px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('/hero-bg.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Discover Unique Places to Stay
          </h1>
          <div className="flex justify-center max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-l-lg shadow-sm bg-white bg-opacity-90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => searchTerm.trim() && searchVenues(searchTerm)}
              className="px-4 py-4 bg-accent text-text font-semibold rounded-r-lg hover:bg-accenthover transition"
            >
              Search
            </button>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">All Venues</h2>
        {displayedVenues.length === 0 ? (
          <p className="text-center text-gray-500">No venues found.</p>
        ) : (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedVenues.map((venue) => (
                <li
                  key={venue.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/venues/${venue.id}`}>
                    {venue.media.length > 0 && (
                      <img
                        src={venue.media[0].url}
                        alt={venue.media[0].alt}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-1 text-gray-800">
                        {venue.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                        {venue.description}
                      </p>
                      <p className="text-blue-600 font-medium">
                        Price: ${venue.price}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default App;
