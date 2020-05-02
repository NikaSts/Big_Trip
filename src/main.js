import {generatePoints} from './mock/point';
import MenuComponent from './components/menu';
import FiltersComponent from './components/filters';
import TripInfoComponent from './components/trip-info';
import TripController from './controllers/trip-controller';
import {renderComponent, Position} from './utils/render';


const POINT_COUNT = 20;
const points = generatePoints(POINT_COUNT);

const tripContainer = document.querySelector(`.trip-events`);
const tripDetails = document.querySelector(`.trip-main`);
const tripControls = tripDetails.querySelector(`.trip-controls`);
const tripViewTitle = tripControls.querySelector(`h2`);


renderComponent(tripDetails, new TripInfoComponent(points), Position.AFTERBEGIN);
renderComponent(tripViewTitle, new MenuComponent(), Position.AFTEREND);
renderComponent(tripControls, new FiltersComponent());

const tripContainerController = new TripController(tripContainer);
tripContainerController.render(points);
