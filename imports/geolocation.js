
const initialLocation = [-31.956, 115.861]; // Perth

const randomLocation = () => {
  initialLocation[0] += (Math.random() - 0.5) * 0.03;
  initialLocation[1] += (Math.random() - 0.5) * 0.03;
  return [...initialLocation];
};

export default randomLocation;