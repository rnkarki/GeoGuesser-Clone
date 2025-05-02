let streetView, map, userMarker, actualMarker, line;
const edmontonBounds = {
  north: 53.716,
  south: 53.380,
  west:  -113.716,
  east:  -113.278
};
let currentLatLng;

function getRandomLatLngInEdmonton() {
  const lat = Math.random() * (edmontonBounds.north - edmontonBounds.south) + edmontonBounds.south;
  const lng = Math.random() * (edmontonBounds.east  - edmontonBounds.west ) + edmontonBounds.west;
  return { lat, lng };
}

// Load a new street‑view location and reset state
function loadLocation() {
  currentLatLng = getRandomLatLngInEdmonton();

  // Update Street View position
  streetView.setPosition(currentLatLng);

  // Clear previous markers/line and distance text
  if (userMarker)    userMarker.setMap(null);
  if (actualMarker)  actualMarker.setMap(null);
  if (line)          line.setMap(null);
  document.getElementById('distance-info').innerText = '';
}

// Initialize both Street View and mini‑map
function initMap() {
  currentLatLng = getRandomLatLngInEdmonton();

  // Fullscreen Street View
  streetView = new google.maps.StreetViewPanorama(
    document.getElementById('street-view'), {
      position: currentLatLng,
      pov: { heading: 100, pitch: 0 },
      zoom: 1,
      addressControl: false,
      linksControl:    false,
      panControl:      false,
      fullscreenControl: false,
      zoomControl:       false
    }
  );

  // Mini‑map
  map = new google.maps.Map(document.getElementById('mini-map'), {
    center: { lat: 53.5461, lng: -113.4938 },
    zoom:   11,
    restriction: {
      latLngBounds: edmontonBounds,
      strictBounds: true
    }
  });
  map.addListener('click', (e) => {
    if (userMarker) userMarker.setMap(null);
    userMarker = new google.maps.Marker({
      position: e.latLng,
      map,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
  });

  // Submit Guess
  document.getElementById('submit-guess').addEventListener('click', () => {
    if (!userMarker) {
      return alert('Please place your guess on the mini‑map.');
    }

    // Show actual location marker
    if (actualMarker) actualMarker.setMap(null);
    actualMarker = new google.maps.Marker({
      position: currentLatLng,
      map,
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });

    // Draw line
    if (line) line.setMap(null);
    line = new google.maps.Polyline({
      path: [ userMarker.getPosition(), currentLatLng ],
      geodesic: true,
      strokeColor: '#FF0000',
      strokeWeight: 2,
      map
    });

    // Fit markers into view
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(userMarker.getPosition());
    bounds.extend(currentLatLng);
    map.fitBounds(bounds);

    // Compute and show distance in km
    const distKm = google.maps.geometry.spherical.computeDistanceBetween(
      userMarker.getPosition(),
      new google.maps.LatLng(currentLatLng.lat, currentLatLng.lng)
    ) / 1000;
    document.getElementById('distance-info').innerText = `Distance: ${distKm.toFixed(2)} km`;
  });

  // Next Location button handler
  document.getElementById('next-location').addEventListener('click', loadLocation);
}
