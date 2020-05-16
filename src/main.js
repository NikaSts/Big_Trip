import {generatePoints} from './mock/points-mock';
import PointsModel from './models/points-model';
import MenuComponent, {MenuControl} from './components/menu';
import FilterController from './controllers/filter-controller';
import TripInfoComponent from './components/trip-info';
import TripController from './controllers/trip-controller';
import StatisticsComponent from './components/statistics';
import {renderComponent, Position} from './utils/render';


const POINT_COUNT = 20;
const points = generatePoints(POINT_COUNT);

const tripContainer = document.querySelector(`.trip-events`);
const tripDetails = document.querySelector(`.trip-main`);
const tripControls = tripDetails.querySelector(`.trip-controls`);
const tripViewTitle = tripControls.querySelector(`h2`);


const pointsModel = new PointsModel();
pointsModel.setPoints(points);

renderComponent(tripDetails, new TripInfoComponent(pointsModel), Position.AFTERBEGIN);
const menuComponent = new MenuComponent();
renderComponent(tripViewTitle, menuComponent, Position.AFTEREND);
const statisticsComponent = new StatisticsComponent(pointsModel);
renderComponent(tripContainer, statisticsComponent, Position.AFTEREND);
statisticsComponent.hide();


const filterController = new FilterController(tripControls, pointsModel);
filterController.render();

const tripController = new TripController(tripContainer, pointsModel);
tripController.render();

const addButton = document.querySelector(`.trip-main__event-add-btn`);

addButton.addEventListener(`click`, () => {
  filterController.setDefaults();
  filterController.rerender();
  tripController.createPoint();
});


menuComponent.onMenuControlsClick((menuControl) => {
  switch (menuControl) {
    case MenuControl.TABLE:
      tripController.show();
      statisticsComponent.hide();
      addButton.removeAttribute(`disabled`, `disabled`);
      break;
    case MenuControl.STATS:
      statisticsComponent.show();
      tripController.hide();
      tripController.rerender();
      addButton.setAttribute(`disabled`, `disabled`);
      break;
    default:
      throw new Error(`Case ${menuControl} not found`);
  }
});
