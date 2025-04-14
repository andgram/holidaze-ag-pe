import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchVenueById, editVenue } from "../api/api";
import Header from "../components/Header";

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
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <Header />
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold text-center mb-6">Edit Venue</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-lg font-medium mb-2">
              Venue Name
            </label>
            <input
              name="name"
              id="name"
              placeholder="Venue Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="price" className="text-lg font-medium mb-2">
              Price
            </label>
            <input
              name="price"
              id="price"
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col mt-6">
          <label htmlFor="description" className="text-lg font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
          <div className="flex flex-col">
            <label htmlFor="maxGuests" className="text-lg font-medium mb-2">
              Maximum Guests
            </label>
            <input
              name="maxGuests"
              id="maxGuests"
              placeholder="Maximum Guests"
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              min="1"
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-lg font-medium">Media</label>
          <button
            type="button"
            onClick={() => setShowMedia(!showMedia)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {showMedia ? "Hide Image" : "Add Image"}
          </button>

          {showMedia && (
            <div className="mt-4">
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={mediaAlt}
                onChange={(e) => setMediaAlt(e.target.value)}
                placeholder="Image description"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="font-medium text-lg">Facilities</p>
          <div className="space-y-4 mt-4">
            <p className="text-sm text-gray-600">
              If not selected, options will default to "Not
              included/allowed/available".
            </p>
            <div>
              <label htmlFor="wifi" className="flex items-center">
                <input
                  type="checkbox"
                  name="wifi"
                  id="wifi"
                  checked={wifi}
                  onChange={(e) => setWifi(e.target.checked)}
                  className="mr-2"
                />
                Wifi <span className="text-sm text-gray-600">(Optional)</span>
              </label>
            </div>
            <div>
              <label htmlFor="parking" className="flex items-center">
                <input
                  type="checkbox"
                  name="parking"
                  id="parking"
                  checked={parking}
                  onChange={(e) => setParking(e.target.checked)}
                  className="mr-2"
                />
                Parking{" "}
                <span className="text-sm text-gray-600">(Optional)</span>
              </label>
            </div>
            <div>
              <label htmlFor="breakfast" className="flex items-center">
                <input
                  type="checkbox"
                  name="breakfast"
                  id="breakfast"
                  checked={breakfast}
                  onChange={(e) => setBreakfast(e.target.checked)}
                  className="mr-2"
                />
                Breakfast{" "}
                <span className="text-sm text-gray-600">(Optional)</span>
              </label>
            </div>
            <div>
              <label htmlFor="pets" className="flex items-center">
                <input
                  type="checkbox"
                  name="pets"
                  id="pets"
                  checked={pets}
                  onChange={(e) => setPets(e.target.checked)}
                  className="mr-2"
                />
                Pets Allowed{" "}
                <span className="text-sm text-gray-600">(Optional)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowLocation(!showLocation)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {showLocation
              ? "Hide Additional Information"
              : "Add Additional Information"}
          </button>

          {showLocation && (
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col">
                  <label htmlFor="address" className="text-lg font-medium mb-2">
                    Address
                  </label>
                  <input
                    name="address"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="city" className="text-lg font-medium mb-2">
                    City
                  </label>
                  <input
                    name="city"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="zip" className="text-lg font-medium mb-2">
                    Zip
                  </label>
                  <input
                    name="zip"
                    id="zip"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="country" className="text-lg font-medium mb-2">
                    Country
                  </label>
                  <input
                    name="country"
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Update Venue
        </button>

        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default EditVenue;
