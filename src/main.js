import {generatePoints} from './mock/point';
import TripContainerController from './controllers/trip-container';

const POINT_COUNT = 20;
const points = generatePoints(POINT_COUNT);


//  DEFAULT SORTING BY DAY ///
const getDayPoints = (acc, point) => {
  const date = new Date(point.startDate).setHours(0, 0, 0, 0);

  if (!acc[date]) {
    acc[date] = [];
  }
  acc[date].push(point);
  return acc;
};

const groups = points.reduce(getDayPoints, {});

const tripDays = Object.keys(groups)
  .map((date) => {
    return {
      date,
      points: groups[date],
    };
  });


const tripContainerController = new TripContainerController();
tripContainerController.render(tripDays);
