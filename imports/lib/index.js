import { LatLng} from 'leaflet';

const latLngFromLocation = ({ type, coordinates: [lng, lat] }) => {
  if (type !== 'Point') throw 'expected point';

  return new LatLng(lat, lng);
}

const ll = (location) => {
  try {
    return latLngFromLocation(location);
  } catch {
    return null;
  }
}

/** @return {number[]} - [lng, lat] for storing in mongo. */
const coords = (latLng) => [latLng.lng, latLng.lat];

export { latLngFromLocation, ll, coords };