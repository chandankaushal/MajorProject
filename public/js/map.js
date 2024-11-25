mapboxgl.accessToken = mapboxKey;

const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  style: "mapbox://styles/mapbox/navigation-day-v1",
  zoom: 12, // starting zoom
});

// create the popup
const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  "<h4>You will be living here</h4>s"
);
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(popup)
  .addTo(map);
