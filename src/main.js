import {generatePoints} from './mock/point';
import PointsModel from './models/points';
import MenuComponent from './components/menu';
import FiltersComponent from './components/filters';
import TripInfoComponent from './components/trip-info';
import TripController from './controllers/trip-controller';
import {renderComponent, Position} from './utils/render';


const POINT_COUNT = 20;
const points = generatePoints(POINT_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripContainer = document.querySelector(`.trip-events`);
const tripDetails = document.querySelector(`.trip-main`);
const tripControls = tripDetails.querySelector(`.trip-controls`);
const tripViewTitle = tripControls.querySelector(`h2`);


renderComponent(tripDetails, new TripInfoComponent(pointsModel), Position.AFTERBEGIN);
renderComponent(tripViewTitle, new MenuComponent(), Position.AFTEREND);
renderComponent(tripControls, new FiltersComponent());

const tripContainerController = new TripController(tripContainer, pointsModel);
tripContainerController.render();
