// Geolocation utilities for automatic address detection

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface DetectedAddress {
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface LocationDetectionResult {
  success: boolean;
  coordinates?: LocationCoordinates;
  address?: DetectedAddress;
  error?: string;
}

/**
 * Get user's current location using browser geolocation API
 */
export const getCurrentLocation = (): Promise<LocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // 15 seconds timeout
      maximumAge: 300000, // Cache for 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = 'Unable to detect location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

/**
 * Convert coordinates to readable address using reverse geocoding
 * Using Nominatim (OpenStreetMap) service as it's free and doesn't require API keys
 */
export const reverseGeocode = async (coordinates: LocationCoordinates): Promise<DetectedAddress> => {
  const { latitude, longitude } = coordinates;
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding service unavailable (${response.status})`);
    }
    
    const data = await response.json();
    
    if (!data || !data.address) {
      throw new Error('No address found for your location');
    }
    
    const address = data.address;
    
    // Extract and format address components for Indian addresses
    const houseNumber = address.house_number || '';
    const road = address.road || address.street || '';
    const suburb = address.suburb || address.neighbourhood || address.quarter || '';
    const village = address.village || '';
    const town = address.town || '';
    const city = address.city || address.municipality || town || village || '';
    const state = address.state || address.region || '';
    const postcode = address.postcode || '';
    const country = address.country || 'India';
    
    // Build address line 1 from available components
    const addressLine1Parts = [houseNumber, road, suburb].filter(Boolean);
    const addressLine1 = addressLine1Parts.join(', ') || 'Address details not available';
    
    return {
      addressLine1,
      city: city || 'City not detected',
      state: state || 'State not detected',
      postalCode: postcode || '',
      country,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw new Error('Failed to convert location to address. Please enter manually.');
  }
};

/**
 * Detect location and get address in one function
 */
export const detectUserLocation = async (): Promise<LocationDetectionResult> => {
  try {
    // Get current coordinates
    const coordinates = await getCurrentLocation();
    
    // Convert to address
    const address = await reverseGeocode(coordinates);
    
    return {
      success: true,
      coordinates,
      address,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Location detection failed';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Check if geolocation is supported and available
 */
export const isGeolocationSupported = (): boolean => {
  return 'geolocation' in navigator && 'getCurrentPosition' in navigator.geolocation;
};

/**
 * Check if location permissions are granted
 */
export const checkLocationPermissions = async (): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> => {
  if (!('permissions' in navigator)) {
    return 'unsupported';
  }
  
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch (error) {
    return 'unsupported';
  }
};