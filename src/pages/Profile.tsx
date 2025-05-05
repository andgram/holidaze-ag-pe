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
      address ? address : undefined,
      city ? city : undefined,
      zip ? zip : undefined,
      country ? country : undefined
    );

    if (venue) {
      navigate(`/venues/${id}`);
    } else {
      setError("Failed to update venue");
    }
  };

  if (loading) return <div>Loading venue...</div>;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/create-edit-bg.jpg')`,
      }}
    >
      <div className="max-w-4xl mx-auto p-8 bg-secondary shadow-md rounded-xl my-12">
        <form onSubmit={handleSubmit}>
          <h2 className="text-3xl font-semibold text-center text-text mb-10">
            Edit Venue
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-lg font-medium text-text mb-2"
              >
                Venue Name
              </label>
              <input
                name="name"
                id="name"
                placeholder="Venue Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border border-secondary p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="price"
                className="text-lg font-medium text-text mb-2"
              >
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
                className="border border-secondary p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="flex flex-col mt-6">
            <label
              htmlFor="description"
              className="text-lg font-medium text-text mb-2"
            >
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
              className="border border-secondary p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
            <div className="flex flex-col">
              <label
                htmlFor="maxGuests"
                className="text-lg font-medium text-text mb-2"
              >
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
                className="border border-secondary p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-lg font-medium text-text">Media</label>
            <div className="mt-4">
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full p-3 border border-secondary rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent mb-4"
              />
              <input
                type="text"
                value={mediaAlt}
                onChange={(e) => setMediaAlt(e.target.value)}
                placeholder="Image description"
                className="w-full p-3 border border-secondary rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="font-medium text-lg text-text">Facilities</p>
            <div className="space-y-4 mt-4">
              <p className="text-sm text-text opacity-60">
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
                    className="mr-2 accent-accent"
                  />
                  Wifi{" "}
                  <span className="text-sm text-text opacity-60">
                    (Optional)
                  </span>
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
                    className="mr-2 accent-accent"
                  />
                  Parking{" "}
                  <span className="text-sm text-text opacity-60">
                    (Optional)
                  </span>
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
                    className="mr-2 accent-accent"
                  />
                  Breakfast{" "}
                  <span className="text-sm text-text opacity-60">
                    (Optional)
                  </span>
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
                    className="mr-2 accent-accent"
                  />
                  Pets Allowed{" "}
                  <span className="text-sm text-text opacity-60">
                    (Optional)
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="mt-6 w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-accenthover transition"
            >
              Update Venue
            </button>
          </div>

          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default EditVenue;
