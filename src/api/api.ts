const API_BASE_URL = 'https://v2.api.noroff.dev';
const API_AUTH_LOGIN = `${API_BASE_URL}/auth/login`;
const API_KEY = '2b649e70-e399-47a8-9012-aca6a0c1de0d'; // Your Noroff API key

const headers = (token?: string) => {
  const headersObj = new Headers();
  headersObj.append('Content-Type', 'application/json');
  headersObj.append('X-Noroff-API-Key', API_KEY); // Always include API key
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
      headers: headers(), // No token needed for login
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
      headers: headers(token), // Include both API key and token
      body: JSON.stringify({
        venueId,
        dateFrom,
        dateTo,
        guests,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.log('Booking error response:', errorData);
      throw new Error('Failed to create booking');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    return null;
  }
};