import SortComponent, {SortType} from '../components/sort';
import TripDaysComponent from '../components/trip-days';
import DayComponent from '../components/day';
import PointComponent from '../components/point';
import NoPointsComponent from '../components/no-points';
import EditPointComponent from '../components/edit-point';
import {renderComponent, replaceComponent} from '../utils/render';
import {getTripDays, getDuration, getPointPrice} from '../utils/common';


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
  const points = day.points;
  if (index !== null) {
    points.sort((a, b) => a.startDate - b.startDate);
  }
  points.forEach((point) => renderPoint(pointsList, point));
  renderComponent(container, tripDay);
};

const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];

  switch (sortType) {
    case SortType.DEFAULT:
      sortedPoints = points.slice();
      break;

    case SortType.TIME:
      const pointsWithDuration = points.slice();
      pointsWithDuration.map((point) => Object.assign(point, {duration: getDuration(point.startDate, point.endDate)}));
      sortedPoints = pointsWithDuration.sort((a, b) => b.duration - a.duration);
      break;

    case SortType.PRICE:
      const pointWithTotalPrice = points.slice();
      pointWithTotalPrice.map((point) => Object.assign(point, {total: getPointPrice(point)}));
      sortedPoints = pointWithTotalPrice.sort((a, b) => b.total - a.total);
      break;

    default:
      throw new Error(`Case ${sortType} not found`);
  }
  return sortedPoints;
};

const renderDefaultSort = (container, days) => {
  days.forEach((day, index) => renderDay(container.getElement(), day, index));
};

const renderTypeSort = (container, points) => {
  const day = {'key': points};
  renderDay(container.getElement(), day, null);
};


export default class TripController {
  constructor(container) {
    this._container = container;
    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();
  }

  render(points) {
    if (points.length === 0) {
      renderComponent(this._container, this._noPointsComponent);
      return;
    }

    renderComponent(this._container, this._sortComponent);
    renderComponent(this._container, this._tripDaysComponent);

    const tripDays = getTripDays(points).sort((a, b) => a.date - b.date);
    renderDefaultSort(this._tripDaysComponent, tripDays);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedPoints = getSortedPoints(points, sortType);
      if (sortType === SortType.TIME || sortType === SortType.PRICE) {
        renderTypeSort(this._tripDaysComponent, sortedPoints);
        return;
      }
      renderDefaultSort(this._tripDaysComponent, tripDays);
    });
  }
}
