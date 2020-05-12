const Filter = {
  DEFAULT: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

const FILTERS = [Filter.DEFAULT, Filter.FUTURE, Filter.PAST];

const isPast = (date) => {
  return !!date && (date < Date.now());
};
const isFuture = (date) => {
  return !!date && (date > Date.now());
};

const getFiltredPoints = (points, filterType) => {
  let filtredPoints = [];
  switch (filterType) {
    case Filter.PAST:
      filtredPoints = points.filter((point) => isPast(point.endDate));
      break;
    case Filter.FUTURE:
      filtredPoints = points.filter((point) => isFuture(point.startDate));
      break;
    default:
      filtredPoints = [...points];
  }
  return filtredPoints;
};

export {FILTERS, Filter, getFiltredPoints};
