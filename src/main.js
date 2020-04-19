import MenuComponent from './components/menu';
import FiltersComponent from './components/filters';
import TripInfoComponent from './components/trip-info';
import SortComponent from './components/sort';
import TripDaysComponent from './components/trip-days';
import DayComponent from './components/day';
import PointComponent from './components/point';
import NoPoints from './components/no-points';
import EditPointComponent from './components/edit-point';
import {generatePoints} from './mock/point';
import {renderComponent, Position} from './utils';


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


const pageMain = document.querySelector(`.page-main`);
const tripContainer = pageMain.querySelector(`.trip-events`);

const tripDetails = document.querySelector(`.trip-main`);
const tripControls = tripDetails.querySelector(`.trip-controls`);
const tripViewTitle = tripControls.querySelector(`h2`);

const renderPoint = (container, point) => {
  const openEditForm = () => {
    pointComponent.getElement().replaceWith(editPointComponent.getElement());
  };

  const closeEditForm = () => {
    editPointComponent.getElement().replaceWith(pointComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closeEditForm();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const pointComponent = new PointComponent(point);
  const editButton = pointComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, () => {
    openEditForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const editPointComponent = new EditPointComponent(point);
  editPointComponent.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    closeEditForm();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });
  renderComponent(container, pointComponent.getElement());
};

const renderDay = (container, day, index) => {
  const tripDay = new DayComponent(day, index);
  const pointsList = tripDay.getElement().querySelector(`.trip-events__list`);
  day.points.sort((a, b) => a.startDate - b.startDate)
    .forEach((point) => renderPoint(pointsList, point));
  renderComponent(container, tripDay.getElement());
};

const renderTripContainer = (container, days) => {
  if (tripDays.length === 0) {
    renderComponent(container, new NoPoints().getElement());
    return;
  }

  renderComponent(tripDetails, new TripInfoComponent(tripDays).getElement(), Position.AFTERBEGIN);
  renderComponent(tripViewTitle, new MenuComponent().getElement(), Position.AFTEREND);
  renderComponent(tripControls, new FiltersComponent().getElement());
  renderComponent(container, new SortComponent().getElement());
  const tripDaysList = new TripDaysComponent();

  days.sort((a, b) => a.date - b.date)
    .forEach((day, index) => renderDay(tripDaysList.getElement(), day, index));
  renderComponent(container, tripDaysList.getElement());
};

renderTripContainer(tripContainer, tripDays);
