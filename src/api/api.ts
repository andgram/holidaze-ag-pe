const API_BASE_URL = 'https://v2.api.noroff.dev';
const API_AUTH_LOGIN = `${API_BASE_URL}/auth/login`;

// Headers function adapted from your headers.js
const headers = (token?: string) => {
  const headersObj = new Headers();
  headersObj.append('Content-Type', 'application/json');
  // Add X-Noroff-API-Key if you provide it
  // const API_KEY = 'your-api-key-here'; // Uncomment and set if needed
  // if (API_KEY) headersObj.append('X-Noroff-API-Key', API_KEY);
  if (token) headersObj.append('Authorization', `Bearer ${token}`);
  return headersObj;
};

export const fetchVenues = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/venues`, {
      headers: headers(),
    });
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
    const response = await fetch(`${API_BASE_URL}/holidaze/venues/${id}`, {
      headers: headers(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch venue ${id}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching venue ${id}:`, error);
    return null;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: 'POST',
      headers: headers(), // No token yet for login
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.errors?.[0]?.message || 'Login failed';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      token: data.data.accessToken,
      user: { name: data.data.name, email: data.data.email },
    };
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
};

export const createBooking = async (
  venueId: string,
  dateFrom: string,
  dateTo: string,
  guests: number,
  token: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/bookings`, {
      method: 'POST',
      headers: headers(token), // Pass token for auth
      body: JSON.stringify({
        venueId,
        dateFrom,
        dateTo,
        guests,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create booking');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    return null;
  }
};