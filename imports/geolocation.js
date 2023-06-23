import { LatLng } from 'leaflet';

const initialLocation = new LatLng(-31.956, 115.861); // Perth

const randomLocation = () => {
  initialLocation.lat += (Math.random() - 0.5) * 0.01;
  initialLocation.lng += (Math.random() - 0.5) * 0.01;
  return initialLocation.clone();
};

export default randomLocation;