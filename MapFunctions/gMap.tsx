let map: google.maps.Map;
var center: google.maps.LatLng;

export async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                resolve({ latitude, longitude });
            },
            (error) => {
                reject(error);
            }
        );
    });
}

export async function initMap() {
    const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

    try {
        const { latitude, longitude } = await getCurrentLocation();
        center = new google.maps.LatLng(latitude, longitude); // Corrected to use the global center variable
        map = new Map(document.getElementById('map') as HTMLElement, {
            center: center,
            zoom: 16,
            mapId: 'DEMO_MAP_ID',
        });
        nearbySearch();
    } catch (error) {
        console.error("Error getting location: ", error);
    }
}

export async function getNearbySearchRequest() {
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;

    return {
        fields: ['displayName', 'location', 'businessStatus', 'allowsDogs', 'rating', 'reviews', 'userRatingCount', 'priceLevel'
            ,'primaryType', 'accessibilityOptions'
        ],
        locationRestriction: {
            center: center,
            radius: 1000,
        },
        includedPrimaryTypes: ['restaurant'],
        maxResultCount: 5, //This locks down how many places can be requested. Too little?
        rankPreference: SearchNearbyRankPreference.POPULARITY,
        language: 'en-US',
        region: 'us',
    };
}

export async function nearbySearch() {
    //@ts-ignore
    const { Place } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    // Get the request object from the new function
    const request = await getNearbySearchRequest();

    //@ts-ignore
    const { places } = await Place.searchNearby(request);

    if (places.length) {
        const { LatLngBounds } = await google.maps.importLibrary("core") as google.maps.CoreLibrary;
        const bounds = new LatLngBounds();

        // Clear previous results
        const resultsContainer = document.getElementById('results'); // Make sure you have an element with this ID in your HTML
        if (resultsContainer) {
            resultsContainer.innerHTML = ''; // Clear previous results
        }

        // Loop through and get all the results.
        places.forEach((place) => {
            const markerView = new AdvancedMarkerElement({
                map,
                position: place.location,
                title: place.displayName,
            });

            bounds.extend(place.location as google.maps.LatLng);

            // Create a new div for each place and add it to the results container
            if (resultsContainer) {
                const placeInfo = document.createElement('div');
                placeInfo.innerHTML = `
                    <strong>${place.displayName}</strong><br/>
                    Location: ${place.location.lat()}, ${place.location.lng()}<br/>
                    Status: ${place.businessStatus || 'Unknown'}
                    Rating: ${place.rating !== undefined ? place.rating : 'Not rated'}<br/>
                    Type: ${place.primaryType || 'N/A'}
                    Reviews: ${place.reviews || 'No reviews available'}<br/>
                    Dogs: ${place.allowsDogs}
                    UserRatingCount: ${place.userRatingCount}
                    Price Level: ${place.priceLevel}
                    Accessibility options parking: ${place.accessibilityOptions['wheelchairAccessibleParking']}
                    Accessibility options Entrance: ${place.accessibilityOptions.wheelchairAccessibleEntrance}
                    Accessibility options Restroom: ${place.accessibilityOptions.wheelchairAccessibleRestroom}
                    Accessibility options Seating: ${place.accessibilityOptions.wheelchairAccessibleSeating}
                `;
                resultsContainer.appendChild(placeInfo);
            }
        });

        map.fitBounds(bounds);
    } else {
        const resultsContainer = document.getElementById('results');
        if (resultsContainer) {
            resultsContainer.innerHTML = 'No results found.';
        }
    }
}

initMap();
