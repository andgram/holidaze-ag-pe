const API_BASE_URL = 'https://v2.api.noroff.dev';
const API_AUTH_LOGIN = `${API_BASE_URL}/auth/login`;
const API_KEY = '2b649e70-e399-47a8-9012-aca6a0c1de0d';

const headers = (token?: string) => {
  const headersObj = new Headers();
  headersObj.append('Content-Type', 'application/json');
  headersObj.append('X-Noroff-API-Key', API_KEY);
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
    const response = await fetch(`${API_BASE_URL}/holidaze/venues/${id}?_owner=true`, {
      headers: headers(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch venue ${id}`);
    }
    const data = await response.json();
    console.log('Venue API response:', data.data); // Debug owner field
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
      headers: headers(),
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
      headers: headers(token),
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

export const fetchUserBookings = async (token: string, profileName: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/holidaze/profiles/${profileName}/bookings?_venue=true`,
      {
        headers: headers(token),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    const data = await response.json();
    console.log('Bookings API response (first item):', data.data[0]);
    return data.data.filter((booking: any) => new Date(booking.dateTo) >= new Date());
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

export const fetchProfile = async (token: string, profileName: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/profiles/${profileName}`, {
      headers: headers(token),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    const data = await response.json();
    console.log('Profile API response:', data.data);
    return data.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const updateProfile = async (
  token: string,
  profileName: string,
  bio?: string,
  avatarUrl?: string,
  avatarAlt?: string,
  bannerUrl?: string,
  bannerAlt?: string,
  venueManager?: boolean
) => {
  try {
    const body: any = {};
    if (bio !== undefined) body.bio = bio;
    if (avatarUrl) body.avatar = { url: avatarUrl, alt: avatarAlt || 'User avatar' };
    if (bannerUrl) body.banner = { url: bannerUrl, alt: bannerAlt || 'Profile banner' };
    if (venueManager !== undefined) body.venueManager = venueManager;

    if (Object.keys(body).length === 0) {
      throw new Error('At least one field must be provided to update');
    }

    const response = await fetch(`${API_BASE_URL}/holidaze/profiles/${profileName}`, {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || 'Failed to update profile');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
};

export const createVenue = async (
  token: string,
  name: string,
  description: string,
  media: { url: string; alt: string }[],
  price: number,
  maxGuests: number,
  wifi: boolean,
  parking: boolean,
  breakfast: boolean,
  pets: boolean,
  address?: string,
  city?: string,
  zip?: string,
  country?: string
) => {
  try {
    const body: any = {
      name,
      description,
      media: media.length > 0 ? media : undefined,
      price,
      maxGuests,
      meta: { wifi, parking, breakfast, pets },
    };
    if (address || city || zip || country) {
      body.location = { address, city, zip, country };
    }

    const response = await fetch(`${API_BASE_URL}/holidaze/venues`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || 'Failed to create venue');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating venue:', error);
    return null;
  }
};

export const fetchUserVenues = async (token: string, profileName: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/holidaze/profiles/${profileName}/venues`,
      {
        headers: headers(token),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch user venues');
    }
    const data = await response.json();
    console.log('User Venues API response (first item):', data.data[0]);
    return data.data;
  } catch (error) {
    console.error('Error fetching user venues:', error);
    return [];
  }
};

// ... (previous imports and functions remain unchanged)

export const deleteVenue = async (token: string, venueId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/venues/${venueId}`, {
      method: 'DELETE',
      headers: headers(token),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || 'Failed to delete venue');
    }
    return true; // DELETE returns 204 No Content on success
  } catch (error) {
    console.error('Error deleting venue:', error);
    return false;
  }
};

// Add this placeholder for editVenue - we'll flesh it out later
export const editVenue = async (
  token: string,
  venueId: string,
  name: string,
  description: string,
  media: { url: string; alt: string }[],
  price: number,
  maxGuests: number,
  wifi: boolean,
  parking: boolean,
  breakfast: boolean,
  pets: boolean,
  address?: string,
  city?: string,
  zip?: string,
  country?: string
) => {
  try {
    const body: any = {
      name,
      description,
      media: media.length > 0 ? media : undefined,
      price,
      maxGuests,
      meta: { wifi, parking, breakfast, pets },
    };
    if (address || city || zip || country) {
      body.location = { address, city, zip, country };
    }

    const response = await fetch(`${API_BASE_URL}/holidaze/venues/${venueId}`, {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || 'Failed to edit venue');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error editing venue:', error);
    return null;
  }
};