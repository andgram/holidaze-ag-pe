import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchVenueById, editVenue } from "../api/api";

function EditVenue() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");
  const [showMedia, setShowMedia] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) {
      navigate("/login");
      return;
    }

    const loadVenue = async () => {
      const venueData = await fetchVenueById(id);
      if (venueData) {
        setName(venueData.name);
        setDescription(venueData.description);
        setPrice(String(venueData.price));
        setMaxGuests(String(venueData.maxGuests));
        setWifi(venueData.meta.wifi);
        setParking(venueData.meta.parking);
        setBreakfast(venueData.meta.breakfast);
        setPets(venueData.meta.pets);
        setMediaUrl(venueData.media[0]?.url || "");
        setMediaAlt(venueData.media[0]?.alt || "");
        setAddress(venueData.location?.address || "");
        setCity(venueData.location?.city || "");
        setZip(venueData.location?.zip || "");
        setCountry(venueData.location?.country || "");
      }
      setLoading(false);
    };
    loadVenue();
  }, [token, id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!id) return;

    const venue = await editVenue(
      token!,
      id,
      name,
      description,
      mediaUrl ? [{ url: mediaUrl, alt: mediaAlt || "Venue image" }] : [],
      Number(price),
      Number(maxGuests),
      wifi,
      parking,
      breakfast,
      pets,
      showLocation && address ? address : undefined,
      showLocation && city ? city : undefined,
      showLocation && zip ? zip : undefined,
      showLocation && country ? country : undefined
    );

    if (venue) {
      navigate(`/venues/${id}`);
    } else {
      setError("Failed to update venue");
    }
  };

  if (loading) return <div>Loading venue...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Edit Venue</h2>
        <div>
          <div>
            <label htmlFor="name">Venue Name</label>
            <input
              name="name"
              id="name"
              placeholder="Venue Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="price">Price</label>
            <input
              name="price"
              id="price"
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              required
            />
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              placeholder="Description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="maxGuests">Maximum Guests</label>
            <input
              name="maxGuests"
              id="maxGuests"
              placeholder="Maximum Guests"
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              min="1"
              required
            />
          </div>
        </div>
        <div>
          <label>Media</label>
          <button type="button" onClick={() => setShowMedia(!showMedia)}>
            {showMedia ? "Hide Image" : "Add Image"}
          </button>
          {showMedia && (
            <div>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <input
                type="text"
                value={mediaAlt}
                onChange={(e) => setMediaAlt(e.target.value)}
                placeholder="Image description"
              />
            </div>
          )}
        </div>
        <div>
          <p>Facilities</p>
          <div>
            <p>
              If not selected, options will default to "Not
              included/allowed/available".
            </p>
          </div>
          <div>
            <div>
              <label htmlFor="wifi">
                <input
                  type="checkbox"
                  name="wifi"
                  id="wifi"
                  checked={wifi}
                  onChange={(e) => setWifi(e.target.checked)}
                />
                Wifi <span>(Optional)</span>
              </label>
            </div>
            <div>
              <label htmlFor="parking">
                <input
                  type="checkbox"
                  name="parking"
                  id="parking"
                  checked={parking}
                  onChange={(e) => setParking(e.target.checked)}
                />
                Parking <span>(Optional)</span>
              </label>
            </div>
            <div>
              <label htmlFor="breakfast">
                <input
                  type="checkbox"
                  name="breakfast"
                  id="breakfast"
                  checked={breakfast}
                  onChange={(e) => setBreakfast(e.target.checked)}
                />
                Breakfast <span>(Optional)</span>
              </label>
            </div>
            <div>
              <label htmlFor="pets">
                <input
                  type="checkbox"
                  name="pets"
                  id="pets"
                  checked={pets}
                  onChange={(e) => setPets(e.target.checked)}
                />
                Pets Allowed <span>(Optional)</span>
              </label>
            </div>
          </div>
        </div>
        <div>
          <button type="button" onClick={() => setShowLocation(!showLocation)}>
            {showLocation
              ? "Hide Additional Information"
              : "Add Additional Information"}
          </button>
          {showLocation && (
            <div>
              <div>
                <label htmlFor="address">Address</label>
                <input
                  name="address"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="city">City</label>
                <input
                  name="city"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="zip">Zip</label>
                <input
                  name="zip"
                  id="zip"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="country">Country</label>
                <input
                  name="country"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        <button type="submit">Update Venue</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default EditVenue;
