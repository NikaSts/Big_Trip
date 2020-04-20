import {generatePoints} from './mock/point';
import MenuComponent from './components/menu';
import FiltersComponent from './components/filters';
import TripInfoComponent from './components/trip-info';
import TripContainerController from './controllers/trip-container';
import {renderComponent, Position} from './utils/render';


const POINT_COUNT = 20;
const points = generatePoints(POINT_COUNT);

const pageMain = document.querySelector(`.page-main`);
const tripContainer = pageMain.querySelector(`.trip-events`);

const tripDetails = document.querySelector(`.trip-main`);
const tripControls = tripDetails.querySelector(`.trip-controls`);
const tripViewTitle = tripControls.querySelector(`h2`);

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


renderComponent(tripDetails, new TripInfoComponent(tripDays), Position.AFTERBEGIN);
renderComponent(tripViewTitle, new MenuComponent(), Position.AFTEREND);
renderComponent(tripControls, new FiltersComponent());

const tripContainerController = new TripContainerController(tripContainer);
tripContainerController.render(tripDays);
