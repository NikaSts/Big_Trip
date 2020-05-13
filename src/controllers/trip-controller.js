import SortComponent from '../components/sort';
import TripDaysComponent from '../components/trip-days';
import DayComponent from '../components/day';
import NoPointsComponent from '../components/no-points';
import PointController, {State as PointControllerState, EmptyPoint} from './point-controller';
import {getTripDays} from '../utils/common';
import {SORT_TYPES, SortType} from '../utils/sort';
import {renderComponent, Position} from '../utils/render';


const HIDDEN_CLASS = `visually-hidden`;

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeSortType = SortType.DEFAULT;

    this._pointControllers = [];
    this._creatingPoint = null;

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

    this._renderPoints(points);
  }

  rerender() {
    this._cleanTripBoard();
    this._pointsModel.setFilterType();
    this._activeSortType = SortType.DEFAULT;
    this.render();
  }

  hide() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  show() {
    this._container.classList.remove(HIDDEN_CLASS);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }
    this._creatingPoint = new PointController(this._onDataChange, this._onViewChange);
    const newPoint = this._creatingPoint.render(EmptyPoint, PointControllerState.ADD);
    this._pointsModel.setFilterType();

    renderComponent(this._container, newPoint, Position.AFTERBEGIN);
    this._pointControllers.push(this._creatingPoint);
  }

  _onDataChange(pointController, oldData, newData, state, isEditing = false) {
    switch (state) {
      case PointControllerState.ADD:
        if (newData === null) {
          pointController.destroy();
        } else {
          this._pointsModel.createPoint(newData);
          pointController.render(newData, PointControllerState.DEFAULT);
        }
        this._creatingPoint = null;
        this.rerender();
        break;
      case PointControllerState.EDIT:
        if (newData === null) {
          this._pointsModel.removePoint(oldData.id);
        } else {
          const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);
          if (!isSuccess) {
            return;
          }
          if (isEditing) {
            return;
          }
          pointController.render(newData, PointControllerState.DEFAULT);
        }
        this.rerender();
        break;
      default:
        throw new Error(`Case ${state} not found`);
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _cleanTripBoard() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._tripDaysComponent.removeChildrenElements();
  }

  _onSortTypeChange(sortType) {
    this._pointsModel.setSortType(sortType);
    this._activeSortType = sortType;
    const points = this._pointsModel.getPoints();
    this._cleanTripBoard();
    this._renderPoints(points, sortType);
  }

  _onFilterTypeChange() {
    const points = this._pointsModel.getPoints();
    this._cleanTripBoard();
    this._renderPoints(points);
  }

  _renderPoints(points, sortType = SortType.DEFAULT) {
    if (sortType === SortType.DEFAULT) {
      const days = getTripDays(points);
      days.forEach((day, index) => this._tripDaysComponent.addDay(this._getDay(this._onDataChange, this._onViewChange, day, index)));
      return;
    }
    const day = {'date': 0, 'points': points};
    this._tripDaysComponent.addDay(this._getDay(this._onDataChange, this._onViewChange, day));
  }

  _getDay(onDataChange, onViewChange, day, index = null) {
    const dayComponent = new DayComponent(day, index);

    const points = day.points;
    points.forEach((point) => {
      const pointController = new PointController(onDataChange, onViewChange);
      dayComponent.addPoint(pointController.render(point, PointControllerState.DEFAULT));
      this._pointControllers.push(pointController);
    });
    return dayComponent;
  }
}
