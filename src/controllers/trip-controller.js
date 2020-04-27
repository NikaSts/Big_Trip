import SortComponent, {SortType} from '../components/sort';
import TripDaysComponent from '../components/trip-days';
import DayComponent from '../components/day';
import NoPointsComponent from '../components/no-points';
import {renderComponent} from '../utils/render';
import {getTripDays, getDuration, getPointPrice} from '../utils/common';
import PointController from './point-controller';


const renderDay = (onDataChange, day, index = null) => {
  const dayComponent = new DayComponent(day, index);
  const points = day.points;
  points.forEach((point) => {
    const pointController = new PointController(point, onDataChange);
    dayComponent.addPoint(pointController.render(point, onDataChange));
  });
  return dayComponent;
};

const getSortedPoints = (points, sortType = SortType.DEFAULT) => {
  let sortedPoints = [];

  switch (sortType) {
    case SortType.DEFAULT:
      sortedPoints = points.slice().sort((a, b) => a.startDate - b.startDate);
      break;

    case SortType.TIME:
      const pointsWithDuration = points.map((point) => Object.assign({}, point, {duration: getDuration(point.startDate, point.endDate)}));
      sortedPoints = pointsWithDuration.sort((a, b) => b.duration - a.duration);
      break;

    case SortType.PRICE:
      const pointWithTotalPrice = points.map((point) => Object.assign({}, point, {total: getPointPrice(point)}));
      sortedPoints = pointWithTotalPrice.sort((a, b) => b.total - a.total);
      break;

    default:
      throw new Error(`Case ${sortType} not found`);
  }
  return sortedPoints;
};

const renderDefaultSort = (list, points, onDataChange) => {
  const days = getTripDays(points);
  days.forEach((day, index) => list.addDay(renderDay(onDataChange, day, index)));
};

const renderTypeSort = (list, points, onDataChange) => {
  const day = {'points': points};
  list.addDay(renderDay(onDataChange, day));
};


export default class TripController {
  constructor(container) {
    this._container = container;
    this._points = [];
    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(points) {
    this._points = points;

    if (this._points.length === 0) {
      renderComponent(this._container, this._noPointsComponent);
      return;
    }

    renderComponent(this._container, this._sortComponent);
    renderComponent(this._container, this._tripDaysComponent);
    const sortedPoints = getSortedPoints(this._points);
    renderDefaultSort(this._tripDaysComponent, sortedPoints, this._onDataChange);
  }

  _onDataChange(oldData, newData, pointController) {
    const index = this._points.findIndex((it) => it === oldData);
    if (index === -1) {
      return;
    }
    this._points = [].concat(this._points.slice(0, index), newData, this._points.slice(index + 1));

    pointController.render(newData); // ----------------------------------------------почему не используем newData?
  }

  _onSortTypeChange(sortType) {
    const sortedPoints = getSortedPoints(this._points, sortType);

    this._tripDaysComponent.removeChildrenElements();
    if (sortType === SortType.DEFAULT) {
      renderDefaultSort(this._tripDaysComponent, sortedPoints, this._onDataChange);
      return;
    }
    renderTypeSort(this._tripDaysComponent, sortedPoints, this._onDataChange);
  }
}
