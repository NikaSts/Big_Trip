import SortComponent from '../components/sort';
import TripDaysComponent from '../components/trip-days';
import DayComponent from '../components/day';
import NoPointsComponent from '../components/no-points';
import PointController, {State as PointControllerState, EmptyPoint} from './point-controller';
import {getTripDays} from '../utils/common';
import {SORT_TYPES, SortType} from '../utils/sort';
import {renderComponent, removeComponent, Position} from '../utils/render';

const HIDDEN_CLASS = `visually-hidden`;

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeSortType = SortType.DEFAULT;

    this._pointControllers = [];
    this._creatingPoint = null;

    this._noPointsComponent = new NoPointsComponent();
    this._tripDaysComponent = new TripDaysComponent();

    this._getDay = this._getDay.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);

    this._pointsModel.setFilterTypeChangeHandler(this._onFilterTypeChange);
  }

  render() {
    this._sortComponent = new SortComponent(SORT_TYPES, this._activeSortType);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    renderComponent(this._container, this._sortComponent, Position.AFTERBEGIN);

    const points = this._pointsModel.getPoints();
    if (points.length === 0) {
      this._sortComponent.hide();
      renderComponent(this._container, this._noPointsComponent);
    }
    renderComponent(this._container, this._tripDaysComponent);
    this._renderPoints(points, this._activeSortType);
  }

  rerender(sortType = SortType.DEFAULT) {
    this._removePoints();
    removeComponent(this._sortComponent);
    removeComponent(this._tripDaysComponent);
    this._activeSortType = sortType;
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
    this._onViewChange();
    this._creatingPoint = new PointController(this._onDataChange, this._onViewChange);
    const newPointComponent = this._creatingPoint.render(EmptyPoint, PointControllerState.ADD);
    this.rerender();

    removeComponent(this._noPointsComponent);
    renderComponent(this._sortComponent.getElement(), newPointComponent, Position.AFTEREND);
    this._pointControllers.push(this._creatingPoint);
  }

  _renderPoints(points, sortType = SortType.DEFAULT) {
    if (sortType === SortType.DEFAULT) {
      points.sort((a, b) => a.startDate - b.startDate);
      const days = getTripDays(points);
      days.forEach((day, index) => this._tripDaysComponent.addDay(this._getDay(this._onDataChange, this._onViewChange, day, index)));
      return;
    }
    const day = {'date': 0, 'points': points};
    this._tripDaysComponent.addDay(this._getDay(this._onDataChange, this._onViewChange, day));
  }

  _removePoints() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._tripDaysComponent.removeChildrenElements();
  }

  _onDataChange(pointController, oldData, newData, state, isEditing = false) {
    switch (state) {
      case PointControllerState.ADD:
        if (newData === null) {
          pointController.destroy();
        } else {
          this._pointsModel.createPoint(newData);
          pointController.render(newData, PointControllerState.DEFAULT);
          this.rerender();
        }
        this._creatingPoint = null;
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
        this.rerender(this._activeSortType);
        break;
      default:
        throw new Error(`Case ${state} not found`);
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    if (this._creatingPoint) {
      return;
    }
    this._pointsModel.setSortType(sortType);
    this._activeSortType = sortType;
    const points = this._pointsModel.getPoints();
    this._removePoints();
    this._renderPoints(points, sortType);
  }

  _onFilterTypeChange() {
    if (this._creatingPoint) {
      return;
    }
    const points = this._pointsModel.getPoints();
    removeComponent(this._sortComponent);
    renderComponent(this._container, this._sortComponent, Position.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._removePoints();
    this._renderPoints(points);
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
