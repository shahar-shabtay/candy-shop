async function initMap() {
    // Define the initial map properties
    var mapProp = {
        center: new google.maps.LatLng(32.090232, 34.781800),
        zoom: 13
    };

    // Create a new map instance
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    // Fetch candy shop locations from your API
    try {
        const response = await fetch('/nearMe/getStores');
        const candyShops = await response.json();

        // Loop through the fetched candy shops and place markers on the map
        candyShops.forEach(shop => {
            const [lat, lng] = shop.coordinates;

            const marker = new google.maps.Marker({
                position: { lat, lng },
                map: map,
                title: shop.name
            });

            const infowindow = new google.maps.InfoWindow({
                content: `<h3>${shop.name}</h3><p>${shop.address.city}, ${shop.address.street}, ${shop.address.number}</p>`
            });

            marker.addListener("click", () => {
                infowindow.open(map, marker);
            });
        });

    } catch (error) {
        console.error('Error fetching candy shop locations:', error);
    }
}

window.initMap = initMap;
