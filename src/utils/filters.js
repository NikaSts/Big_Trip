const Filter = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

const FILTERS = [Filter.EVERYTHING, Filter.FUTURE, Filter.PAST];

const filtredPoints = {
  [Filter.PAST]: [],
  [Filter.FUTURE]: [],
};

const isPast = (date) => {
  return !!date && (date < Date.now());
};
const isFuture = (date) => {
  return !!date && (date > Date.now());
};


const getFiltredPoints = (points) => {
  return points.reduce((acc, point) => {
    if (isPast(point.endDate)) {
      acc[Filter.PAST].push(point);
    }
    if (isFuture(point.startDate)) {
      acc[Filter.FUTURE].push(point);
    }
    return acc;
  }, Object.assign({}, filtredPoints));
};

export {Filter, FILTERS, getFiltredPoints};
