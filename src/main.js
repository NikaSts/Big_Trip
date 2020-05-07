import {generatePoints} from './mock/points-mock';
import PointsModel from './models/points-model';
import MenuComponent from './components/menu';
import FilterController from './controllers/filter-controller';
import TripInfoComponent from './components/trip-info';
import TripController from './controllers/trip-controller';
import {renderComponent, Position} from './utils/render';


const POINT_COUNT = 6;
const points = generatePoints(POINT_COUNT);

const tripContainer = document.querySelector(`.trip-events`);
const tripDetails = document.querySelector(`.trip-main`);
const tripControls = tripDetails.querySelector(`.trip-controls`);
const tripViewTitle = tripControls.querySelector(`h2`);


const pointsModel = new PointsModel();
pointsModel.setPoints(points);

renderComponent(tripDetails, new TripInfoComponent(pointsModel), Position.AFTERBEGIN);
renderComponent(tripViewTitle, new MenuComponent(), Position.AFTEREND);

const filterController = new FilterController(tripControls, pointsModel);
filterController.render();

const tripContainerController = new TripController(tripContainer, pointsModel);
tripContainerController.render();
