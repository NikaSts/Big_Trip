import MenuComponent from '../components/menu';
import FiltersComponent from '../components/filters';
import TripInfoComponent from '../components/trip-info';
import SortComponent from '../components/sort';
import TripDaysComponent from '../components/trip-days';
import DayComponent from '../components/day';
import PointComponent from '../components/point';
import NoPointsComponent from '../components/no-points';
import EditPointComponent from '../components/edit-point';
import {renderComponent, Position, replaceComponent} from '../utils/render';


const pageMain = document.querySelector(`.page-main`);
const tripContainer = pageMain.querySelector(`.trip-events`);

const tripDetails = document.querySelector(`.trip-main`);
const tripControls = tripDetails.querySelector(`.trip-controls`);
const tripViewTitle = tripControls.querySelector(`h2`);


const renderPoint = (container, point) => {
  const openEditForm = () => {
    replaceComponent(pointComponent, editPointComponent);
  };

  const closeEditForm = () => {
    replaceComponent(editPointComponent, pointComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closeEditForm();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const pointComponent = new PointComponent(point);
  pointComponent.setEditButtonClickHandler(() => {
    openEditForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const editPointComponent = new EditPointComponent(point);
  editPointComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    closeEditForm();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  renderComponent(container, pointComponent);
};

const renderDay = (container, day, index) => {
  const tripDay = new DayComponent(day, index);
  const pointsList = tripDay.getElement().querySelector(`.trip-events__list`);
  day.points.sort((a, b) => a.startDate - b.startDate)
    .forEach((point) => renderPoint(pointsList, point));
  renderComponent(container, tripDay);
};

const renderTripContainer = (container, days) => {
  if (days.length === 0) {
    renderComponent(container, new NoPointsComponent());
    return;
  }

  renderComponent(tripDetails, new TripInfoComponent(days), Position.AFTERBEGIN);
  renderComponent(tripViewTitle, new MenuComponent(), Position.AFTEREND);
  renderComponent(tripControls, new FiltersComponent());
  renderComponent(container, new SortComponent());
  const tripDaysList = new TripDaysComponent();

  days.sort((a, b) => a.date - b.date)
    .forEach((day, index) => renderDay(tripDaysList.getElement(), day, index));
  renderComponent(container, tripDaysList);
};


export default class TripContainerController {
  constructor(container) {
    this._container = container;
  }

  render(days) {
    renderTripContainer(tripContainer, days);
  }
}
