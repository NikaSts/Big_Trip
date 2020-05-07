import SortComponent from '../components/sort';
import TripDaysComponent from '../components/trip-days';
import DayComponent from '../components/day';
import NoPointsComponent from '../components/no-points';
import PointController from './point-controller';
import {getTripDays} from '../utils/common';
import {SORT_TYPES, SortType} from '../utils/sort';
import {renderComponent} from '../utils/render';


export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._pointControllers = [];

    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent(SORT_TYPES);
    this._tripDaysComponent = new TripDaysComponent();

    this._getDay = this._getDay.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);

    this._pointsModel.setFilterTypeChangeHandler(this._onFilterTypeChange);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    const points = this._pointsModel.getPoints().sort((a, b) => a.startDate - b.startDate);

    if (points.length === 0) {
      renderComponent(this._container, this._noPointsComponent);
      return;
    }

    renderComponent(this._container, this._sortComponent);
    renderComponent(this._container, this._tripDaysComponent);

    this._renderSortedPoints(points);
    this._renderFiltredPoints(points);
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
    const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);
    if (!isSuccess) {
      return;
    }
    pointController.render(newData);
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _removePoints() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._tripDaysComponent.removeChildrenElements();
  }

  _onSortTypeChange(sortType) {
    this._pointsModel.setSortType(sortType);
    this._activeSortType = sortType;
    const points = this._pointsModel.getPoints();
    this._removePoints();
    this._renderSortedPoints(points, sortType);
  }

  _onFilterTypeChange(filterType) {
    this._activeSortType = SortType.DEFAULT;

    const points = this._pointsModel.getPoints();
    this._removePoints();
    this._renderFiltredPoints(points, filterType);
  }

  _renderSortedPoints(points, sortType = SortType.DEFAULT) {
    if (sortType === SortType.DEFAULT) {
      const days = getTripDays(points);
      days.forEach((day, index) => this._tripDaysComponent.addDay(this._getDay(this._onDataChange, this._onViewChange, day, index)));
      return;
    }
    const day = {'date': 0, 'points': points};
    this._tripDaysComponent.addDay(this._getDay(this._onDataChange, this._onViewChange, day));
  }

  _renderFiltredPoints(points) {
    const days = getTripDays(points);
    days.forEach((day, index) => this._tripDaysComponent.addDay(this._getDay(this._onDataChange, this._onViewChange, day, index)));
  }
}
