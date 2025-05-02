let panorama;

// Edmonton bounding box
const minLat = 53.450;
const maxLat = 53.630;
const minLng = -113.600;
const maxLng = -113.300;

function getRandomCoords() {
  const lat = Math.random() * (maxLat - minLat) + minLat;
  const lng = Math.random() * (maxLng - minLng) + minLng;
  return { lat, lng };
}

function initMap() {
  const { lat, lng } = getRandomCoords();
  const position = { lat, lng };
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById('map'),
    {
      position: position,
      pov: {
        heading: 34,
        pitch: 10
      },
      zoom: 1,
      addressControl: false,
      linksControl: false,
      panControl: false,
      fullscreenControl: false,
      zoomControl: false,
      enableCloseButton: false
    }
  );
}

function loadStreetView() {
  const { lat, lng } = getRandomCoords();
  panorama.setPosition({ lat, lng });
}
