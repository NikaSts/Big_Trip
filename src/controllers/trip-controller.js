import SortComponent, {SortType} from '../components/sort';
import TripDaysComponent from '../components/trip-days';
import DayComponent from '../components/day';
import NoPointsComponent from '../components/no-points';
import {renderComponent} from '../utils/render';
import {getTripDays, getDuration, getPointPrice} from '../utils/common';
import PointController from './point-controller';


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


export default class TripController {
  constructor(container) {
    this._container = container;
    this._points = [];
    this._pointControllers = [];
    this._sortedPoints = [];

    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();

    this._getDay = this._getDay.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
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

    this._sortedPoints = getSortedPoints(this._points);
    this._renderSortedPoints(this._sortedPoints);
  }

  _getDay(onDataChange, onViewChange, day, index = null) {
    const dayComponent = new DayComponent(day, index);
    const points = day.points;
    points.forEach((point) => {
      const pointController = new PointController(onDataChange, onViewChange);
      dayComponent.addPoint(pointController.render(point));
      this._pointControllers.push(pointController);
    });
    return dayComponent;
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._sortedPoints.findIndex((it) => it === oldData);
    if (index === -1) {
      return;
    }

    this._sortedPoints = [].concat(this._sortedPoints.slice(0, index), newData, this._sortedPoints.slice(index + 1));
    pointController.render(this._sortedPoints[index]);
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._sortedPoints = getSortedPoints(this._points, sortType);
    this._tripDaysComponent.removeChildrenElements();
    this._pointControllers = [];
    this._renderSortedPoints(this._sortedPoints, sortType);
  }

  _renderSortedPoints(points, sortType = SortType.DEFAULT) {
    if (sortType === SortType.DEFAULT) {
      const days = getTripDays(points);
      days.forEach((day, index) => this._tripDaysComponent.addDay(this._getDay(this._onDataChange, this._onViewChange, day, index)));
      return;
    }
    const day = {'points': points};
    this._tripDaysComponent.addDay(this._getDay(this._onDataChange, this._onViewChange, day));
  }
}
