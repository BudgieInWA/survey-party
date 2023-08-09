import { LatLng } from 'leaflet';

const initialLocation = new LatLng(-31.956, 115.861); // Perth

const randomLocation = () => {
  initialLocation.lat += (Math.random() - 0.5) * 0.01;
  initialLocation.lng += (Math.random() - 0.5) * 0.01;
  return initialLocation.clone();
};

/** Gets the current device location after asking for permission. @returns {Promise<LatLng>} */
const currentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(new LatLng(position.coords.latitude, position.coords.longitude)),
      reject
    );
  });
};

const bestEffortLocation = () => currentLocation().catch(async () => randomLocation());

export default bestEffortLocation;