import API from './api/api';
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import PointsModel from './models/points-model';
import MenuComponent from './components/menu';
import LoadingComponent from './components/loading';
import TripInfoComponent from './components/trip-info';
import StatisticsComponent from './components/statistics';

import TripController from './controllers/trip-controller';
import FilterController from './controllers/filter-controller';

import {renderComponent, Position, removeComponent} from './utils/render';
import {END_POINT, AUTHORIZATION, STORE_POINTS_NAME, MenuControl} from './utils/consts';

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_POINTS_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const pointsModel = new PointsModel();

const tripContainer = document.querySelector(`.trip-events`);
const tripDetails = document.querySelector(`.trip-main`);
const tripControls = tripDetails.querySelector(`.trip-controls`);
const tripViewTitle = tripControls.querySelector(`h2`);
const addButton = document.querySelector(`.trip-main__event-add-btn`);

const tripInfoComponent = new TripInfoComponent(pointsModel);
const menuComponent = new MenuComponent();
const statisticsComponent = new StatisticsComponent(pointsModel);
const loadingComponent = new LoadingComponent();
const filterController = new FilterController(tripControls, pointsModel);
const tripController = new TripController(tripContainer, pointsModel, apiWithProvider);

const renderUI = () => {
  removeComponent(loadingComponent);
  renderComponent(tripDetails, tripInfoComponent, Position.AFTERBEGIN);
  filterController.render();
  tripController.render();
  renderComponent(tripContainer, statisticsComponent, Position.AFTEREND);
  statisticsComponent.hide();

  pointsModel.setDataChangeHandler(() => {
    tripInfoComponent.rerender();
  });

  menuComponent.setMenuControlsClickHandler((menuControl) => {
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

  addButton.addEventListener(`click`, () => {
    filterController.setDefaults();
    filterController.rerender();
    tripController.createPoint();
  });
};

const init = () => {
  renderComponent(tripViewTitle, menuComponent, Position.AFTEREND);
  renderComponent(tripContainer, loadingComponent);
  Promise.all([apiWithProvider.getPoints(), apiWithProvider.getOffers(), apiWithProvider.getDestinations()])
    .then(([points, offers, destinations]) => {
      pointsModel.setPoints(points);
      pointsModel.setOffers(offers);
      pointsModel.setDestinations(destinations);

      renderUI();
    });

  window.addEventListener(`online`, () => {
    document.title = document.title.replace(` [offline]`, ``);

    apiWithProvider.sync();
  });

  window.addEventListener(`offline`, () => {
    document.title += ` [offline]`;
  });
};

init();
