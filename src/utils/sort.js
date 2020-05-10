import {getDuration, getPointPrice} from '../utils/common';


const SortType = {
  DEFAULT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

const SORT_TYPES = [SortType.DEFAULT, SortType.TIME, SortType.PRICE];

const getSortedPoints = (points, sortType = SortType.DEFAULT) => {
  let sortedPoints = [];

  switch (sortType) {
    case SortType.DEFAULT:
      sortedPoints = points.slice().sort((a, b) => a.startDate - b.startDate);
      break;

    case SortType.TIME:
      const pointsWithDuration = points.map((point) => Object.assign({}, point, {duration: getDuration(point.startDate, point.endDate)}));
      sortedPoints = pointsWithDuration.sort((a, b) => b.duration - a.duration);
      break;

    case SortType.PRICE:
      const pointWithTotalPrice = points.map((point) => Object.assign({}, point, {total: getPointPrice(point)}));
      sortedPoints = pointWithTotalPrice.sort((a, b) => b.total - a.total);
      break;

    default:
      throw new Error(`Case ${sortType} not found`);
  }
  return sortedPoints;
};

export {SORT_TYPES, SortType, getSortedPoints};
