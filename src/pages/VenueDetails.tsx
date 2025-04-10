import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchVenueById } from "../api/venues";

interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    country: string;
  };
}

function VenueDetails() {
  const { id } = useParams<{ id: string }>(); // Get venue ID from URL
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVenue = async () => {
      if (!id) return;
      const venueData = await fetchVenueById(id);
      setVenue(venueData);
      setLoading(false);
    };
    loadVenue();
  }, [id]);

  if (loading) {
    return <div>Loading venue details...</div>;
  }

  if (!venue) {
    return <div>Venue not found</div>;
  }

  return (
    <div>
      <h1>{venue.name}</h1>
      <p>{venue.description}</p>
      <p>Price: ${venue.price}</p>
      <p>
        Location: {venue.location.address}, {venue.location.city},{" "}
        {venue.location.country}
      </p>
      <a href="/">Back to Home</a>
    </div>
  );
}

export default VenueDetails;
