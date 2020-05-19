import API from './api';
import PointsModel from './models/points-model';
import MenuComponent, {MenuControl} from './components/menu';
import FilterController from './controllers/filter-controller';
import TripInfoComponent from './components/trip-info';
import TripController from './controllers/trip-controller';
import StatisticsComponent from './components/statistics';
import {renderComponent, Position} from './utils/render';


const AUTHORIZATION = `Basic pf65JKle370ufFCX8m`;

const api = new API(AUTHORIZATION);
const pointsModel = new PointsModel();

const tripContainer = document.querySelector(`.trip-events`);
const tripDetails = document.querySelector(`.trip-main`);
const tripControls = tripDetails.querySelector(`.trip-controls`);
const tripViewTitle = tripControls.querySelector(`h2`);
const addButton = document.querySelector(`.trip-main__event-add-btn`);

const tripInfoComponent = new TripInfoComponent(pointsModel);
renderComponent(tripDetails, tripInfoComponent, Position.AFTERBEGIN);

const menuComponent = new MenuComponent();
renderComponent(tripViewTitle, menuComponent, Position.AFTEREND);

const statisticsComponent = new StatisticsComponent(pointsModel);
renderComponent(tripContainer, statisticsComponent, Position.AFTEREND);
statisticsComponent.hide();

const filterController = new FilterController(tripControls, pointsModel);
filterController.render();

const tripController = new TripController(tripContainer, pointsModel);

menuComponent.onMenuControlsClick((menuControl) => {
  switch (menuControl) {
    case MenuControl.TABLE:
      tripController.show();
      statisticsComponent.hide();
      addButton.removeAttribute(`disabled`);
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

Promise.all([api.getPoints(), api.getOffers(), api.getDestinations()])
  .then(([points, offers, destinations]) => {
    pointsModel.setPoints(points);
    pointsModel.setOffers(offers);
    pointsModel.setDestinations(destinations);

    tripController.render();
  });


addButton.addEventListener(`click`, () => {
  filterController.setDefaults();
  filterController.rerender();
  tripController.createPoint();
});
