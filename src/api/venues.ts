export const fetchVenues = async () => {
    try {
      const response = await fetch('https://v2.api.noroff.dev/holidaze/venues');
      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }
      const data = await response.json();
      return data.data; // API returns { data: [...] }
    } catch (error) {
      console.error('Error fetching venues:', error);
      return [];
    }
  };