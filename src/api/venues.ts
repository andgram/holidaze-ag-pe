export const fetchVenues = async () => {
  try {
    const response = await fetch('https://v2.api.noroff.dev/holidaze/venues');
    if (!response.ok) {
      throw new Error('Failed to fetch venues');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching venues:', error);
    return [];
  }
};

export const fetchVenueById = async (id: string) => {
  try {
    const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch venue ${id}`);
    }
    const data = await response.json();
    return data.data; // Single venue object
  } catch (error) {
    console.error(`Error fetching venue ${id}:`, error);
    return null;
  }
};