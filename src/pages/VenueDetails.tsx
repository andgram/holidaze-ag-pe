import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchVenueById, deleteVenue } from "../api/api";
import Header from "../components/Header";

interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  media: { url: string; alt: string }[];
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  owner: { name: string };
}

function VenueDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVenue = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const venueData = await fetchVenueById(id);
      setVenue(venueData);
      setLoading(false);
    };
    loadVenue();
  }, [id]);

  const handleDelete = async () => {
    if (!token || !id) return;
    const success = await deleteVenue(token, id);
    if (success) {
      navigate("/profile");
    } else {
      setError("Failed to delete venue");
    }
  };

  if (loading) return <div>Loading venue...</div>;
  if (!venue) return <div>Venue not found</div>;

  const isOwner = user?.name === venue.owner.name;

  return (
    <div>
      <Header />
      <h1>{venue.name}</h1>
      <p>{venue.description}</p>
      <p>Price: ${venue.price} per night</p>
      <p>Max Guests: {venue.maxGuests}</p>
      {venue.media.length > 0 && (
        <img
          src={venue.media[0].url}
          alt={venue.media[0].alt}
          style={{ maxWidth: "300px" }}
        />
      )}
      <ul>
        <li>Wifi: {venue.meta.wifi ? "Yes" : "No"}</li>
        <li>Parking: {venue.meta.parking ? "Yes" : "No"}</li>
        <li>Breakfast: {venue.meta.breakfast ? "Yes" : "No"}</li>
        <li>Pets: {venue.meta.pets ? "Yes" : "No"}</li>
      </ul>
      {isOwner && token && (
        <div>
          <button onClick={() => navigate(`/edit-venue/${venue.id}`)}>
            Edit Venue
          </button>
          <button onClick={handleDelete}>Delete Venue</button>
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default VenueDetails;
