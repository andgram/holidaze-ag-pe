import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createVenue, fetchProfile } from "../api/api";

function AddVenue() {
  const { user, token } = useAuth();
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
    const checkAccess = async () => {
      if (!token || !user?.name) {
        navigate("/login");
        return;
      }
      try {
        const profile = await fetchProfile(token, user.name);
        if (!profile.venueManager) {
          navigate("/profile", {
            state: {
              message:
                "Access denied: You must be a venue manager to create a venue.",
            },
          });
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        navigate("/login");
      }
    };
    checkAccess();
  }, [token, user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const venue = await createVenue(
      token!,
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
      navigate("/profile");
    } else {
      setError("Failed to create venue");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('/create-edit-bg.jpg')` }}
    >
      <div className="max-w-4xl mx-auto p-8 bg-secondary shadow-md rounded-xl my-12">
        <form onSubmit={handleSubmit}>
          <h2 className="text-3xl font-semibold text-center text-text mb-10">
            Create a Venue
          </h2>

          {/* --- Form fields below --- */}
          {/* Venue Name */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-lg font-medium text-text mb-2"
              >
                Venue Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col">
              <label
                htmlFor="price"
                className="text-lg font-medium text-text mb-2"
              >
                Price
              </label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                required
                className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col mt-6">
            <label
              htmlFor="description"
              className="text-lg font-medium text-text mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Max Guests */}
          <div className="flex flex-col mt-6">
            <label
              htmlFor="maxGuests"
              className="text-lg font-medium text-text mb-2"
            >
              Maximum Guests
            </label>
            <input
              id="maxGuests"
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              min="1"
              required
              className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Facilities */}
          <div className="mt-6">
            <p className="font-medium text-lg text-text">Facilities</p>
            <div className="space-y-2 mt-2">
              {[
                { label: "Wifi", state: wifi, setState: setWifi },
                { label: "Parking", state: parking, setState: setParking },
                {
                  label: "Breakfast",
                  state: breakfast,
                  setState: setBreakfast,
                },
                { label: "Pets Allowed", state: pets, setState: setPets },
              ].map(({ label, state, setState }) => (
                <label key={label} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={state}
                    onChange={(e) => setState(e.target.checked)}
                    className="mr-2"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Media Toggle */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowMedia(!showMedia)}
              className="bg-primary text-white px-4 py-1 rounded-xl hover:bg-accenthover transition"
            >
              {showMedia ? "Remove Image" : "Add Image"}
            </button>
            {showMedia && (
              <div className="mt-4">
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Image URL"
                  className="w-full p-3 mb-2 border rounded-xl"
                />
                <input
                  type="text"
                  value={mediaAlt}
                  onChange={(e) => setMediaAlt(e.target.value)}
                  placeholder="Image description"
                  className="w-full p-3 border rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Location Toggle */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowLocation(!showLocation)}
              className="bg-primary text-white px-4 py-1 rounded-xl hover:bg-accenthover transition"
            >
              {showLocation ? "Hide Location" : "Add Location"}
            </button>
            {showLocation && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  { label: "Address", value: address, setValue: setAddress },
                  { label: "City", value: city, setValue: setCity },
                  { label: "Zip", value: zip, setValue: setZip },
                  { label: "Country", value: country, setValue: setCountry },
                ].map(({ label, value, setValue }) => (
                  <div key={label} className="flex flex-col">
                    <label className="text-lg font-medium text-text mb-2">
                      {label}
                    </label>
                    <input
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-primary text-white py-3 rounded-xl hover:bg-accenthover transition"
          >
            Create Venue
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default AddVenue;
