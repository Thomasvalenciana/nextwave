import React, { useEffect, useState } from 'react';

//to see log, press cmmnd shit j or control shift j
// Define the types for your restaurant data
interface Restaurant {
  name: string;
  address: string;
  rating: number;
}

const MapComponent: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const radius = 150000; // Set your desired radius in meters
          const type = 'restaurant'; // Specify that you're looking for restaurants
  
          const apiKey = 'AIzaSyDvsTyOT5uX43q0nWmtD9c09GFv7aKNU4k'; // Place your API key securely
          const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;
  
          console.log('Fetch URL:', url); // Log the URL before fetching
  
          try {
            const response = await fetch(url);
            console.log('Response:', response); // Log the response
  
            if (!response.ok) {
              const errorData = await response.json(); // Get any error details
              console.error('Error data:', errorData); // Log error data
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const restaurantsList: Restaurant[] = data.results.map((place: any) => ({
              name: place.name,
              address: place.vicinity,
              rating: place.rating,
            }));
            setRestaurants(restaurantsList);
          } catch (error) {
            setError('Failed to fetch restaurants');
            console.error(error);
          }
        },
        (error) => {
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setError('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              setError('The request to get user location timed out.');
              break;
            //case error.UNKNOWN_ERROR:
            default:
              setError('An unknown error occurred while accessing location.');
              break;
          }
          console.error('Geolocation error:', error);
        }
      );
    };
  
    fetchRestaurants();
  }, []);
  
  
  

  return (
    <div>
      <h1>Nearby Restaurants</h1>
      {error && <p>{error}</p>}
      <ul>
        {restaurants.map((restaurant, index) => (
          <li key={index}>
            <h2>{restaurant.name}</h2>
            <p>{restaurant.address}</p>
            <p>Rating: {restaurant.rating}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MapComponent;
