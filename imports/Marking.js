import _ from 'lodash';

const markingIcons = _.mapValues({
  undefined: '❌⭕✴✳❇🔆💠',
  null: '♦♥♠♣',

  trees: '🌳🌲🌴🎄',
  flowers: '🌻🌼🌹🌺🍅',
  water: '💧🥤🚰',
  bench: '🪑🪵🛖T',
  light: '🔦',
  info: 'ℹ️',

  bus: '🚏',
  train: '🚉',

  playground: '🛝',

  drink: '🫖🍺🍷🍸',
  eat: '🍲🥖🍟',
}, str => Array.from(str));

export const markingIcon = kind => {
  const icons = markingIcons[kind];
  if (!icons.next) icons.next = 0;
  return icons[icons.next++];
};

const Marking = ({ icon, kind = icon }) => markingIcon(kind);

export default Marking;
