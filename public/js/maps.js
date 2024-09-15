async function initMap() {
    // Define the initial map properties
    var mapProp = {
        center: new google.maps.LatLng(32.090232, 34.781800), // Adjust to a suitable center for your candy shop locations
        zoom: 13
    };

    // Create a new map instance
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    // Fetch candy shop locations from your API or a predefined list
    // This is a placeholder; replace with your actual data source
    const candyShops = [
        { name: 'Sweet Tooth', coordinates: '32.0853, 34.7818' },
        { name: 'Candy Land', coordinates: '32.0902, 34.7850' },
        // Add more candy shop locations as needed
    ];

    // Create a marker and info window for each candy shop
    candyShops.forEach(shop => {
        const [lat, lng] = shop.coordinates.split(',').map(Number);

        var marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: shop.name // Title can be used for hover text or info window
        });

        var infowindow = new google.maps.InfoWindow({
            content: `<h3>${shop.name}</h3>`
        });

        marker.addListener("click", () => {
            infowindow.open(map, marker);
        });
    });
}

// Ensure initMap is called when the Google Maps API script loads
window.initMap = initMap;
