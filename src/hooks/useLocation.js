import { useState, useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [placeName, setPlaceName] = useState(null);
  const apiKey = 'AIzaSyDLg_VU_6t6k3GdnSDUr8_ExrBfKQ3k-2I';

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ latitude, longitude, accuracy });

        // Make a request to the Google Maps Geocoding API
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  
        try {
          const response = await axios.get(url);
          const results = response.data.results;
  
          if (results.length > 0) {
            const placeName = results[0].formatted_address;
            setPlaceName(placeName);
          } else {
            console.log('No results found');
          }
        } catch (error) {
          console.log('Error fetching geolocation data:', error);
        }
      },
      (error) => {
        console.log('Error getting current position:', error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { location, placeName };
};

export default useGeolocation;
