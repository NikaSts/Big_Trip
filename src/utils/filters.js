const FILTERS = [Filter.EVERYTHING, Filter.FUTURE, Filter.PAST];

const Filter = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

const isPast = (date) => {
  return !!date && (date < Date.now());
};
const isFuture = (date) => {
  return !!date && (date > Date.now());
};

const filterPoints = (points) => {
  const filtredPoints = {
    [Filter.EVERYTHING]: [...points],
    [Filter.FUTURE]: [],
    [Filter.PAST]: [],
  };

  points.reduce((acc, point) => {
    if (isPast(point.endDate)) {
      acc[Filter.PAST].push(point);
    }
    if (isFuture(point.startDate)) {
      acc[Filter.FUTURE].push(point);
    }
    return acc;
  }, Object.assign({}, filtredPoints));

  return filtredPoints;
};

const getFiltredPoints = (points, filterType) => {
  const filtredPoints = filterPoints(points);
  return filtredPoints[filterType];
};

export {FILTERS, Filter, getFiltredPoints};
