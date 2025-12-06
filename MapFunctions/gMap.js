let map;
var center;

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
    const { Map } = await google.maps.importLibrary('maps');

    try {
        const { latitude, longitude } = await getCurrentLocation();
        center = new google.maps.LatLng(latitude, longitude);
        map = new Map(document.getElementById('map'), {
            center: center,
            zoom: 16,
            mapId: 'DEMO_MAP_ID',
        });
        nearbySearch();
    } catch (error) {
        console.error("Error getting location: ", error);
    }
}

async function getNearbySearchRequest() {
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary('places');

    return {
        fields: [
            'displayName', 'location', 'businessStatus', 'allowsDogs', 'rating', 
            'reviews', 'userRatingCount', 'priceLevel', 'primaryType', 
            'accessibilityOptions'
        ],
        locationRestriction: {
            center: center,
            radius: 1000,
        },
        includedPrimaryTypes: ['restaurant'],
        maxResultCount: 5, 
        rankPreference: SearchNearbyRankPreference.POPULARITY,
        language: 'en-US',
        region: 'us',
    };
}

export async function nearbySearch() {
    const { Place } = await google.maps.importLibrary('places');
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const request = await getNearbySearchRequest();

    const { places } = await Place.searchNearby(request);

    if (places.length) {
        const { LatLngBounds } = await google.maps.importLibrary("core");
        const bounds = new LatLngBounds();

        // Clear previous results
        const resultsContainer = document.getElementById('results');
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

            bounds.extend(place.location);

            // Create a new div for each place and add it to the results container
            if (resultsContainer) {
                const placeInfo = document.createElement('div');
                placeInfo.innerHTML = `
                    <strong>${place.displayName}</strong><br/>
                    Location: ${place.location.lat()}, ${place.location.lng()}<br/>
                    Status: ${place.businessStatus || 'Unknown'}<br/>
                    Rating: ${place.rating !== undefined ? place.rating : 'Not rated'}<br/>
                    Type: ${place.primaryType || 'N/A'}<br/>
                    Reviews: ${place.reviews || 'No reviews available'}<br/>
                    Dogs: ${place.allowsDogs}<br/>
                    UserRatingCount: ${place.userRatingCount}<br/>
                    Price Level: ${place.priceLevel}<br/>
                    Accessibility options parking: ${place.accessibilityOptions['wheelchairAccessibleParking']}<br/>
                    Accessibility options Entrance: ${place.accessibilityOptions.wheelchairAccessibleEntrance}<br/>
                    Accessibility options Restroom: ${place.accessibilityOptions.wheelchairAccessibleRestroom}<br/>
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

// // Call initMap to initialize the map
// initMap();
