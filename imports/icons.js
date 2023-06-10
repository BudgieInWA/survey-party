import { DivIcon } from 'leaflet';

const size = 45;

const icons = {};

export default (text) => {
  if (!(text in icons)) {
    icons[text] = new DivIcon({
      html: text,
      iconSize: [size, size],
      className: 'emoji-icon',
    })
  }
  return icons[text];
}
