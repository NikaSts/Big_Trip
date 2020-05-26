import SortComponent from '../components/sort';
import TripDaysComponent from '../components/trip-days';
import DayComponent from '../components/day';
import NoPointsComponent from '../components/no-points';
import PointController from './point-controller';
import {getTripDays} from '../utils/funcs';
import {SORT_TYPES, SortType} from '../utils/sort';
import {renderComponent, removeComponent, Position} from '../utils/render';
import {HIDDEN_CLASS, State as PointControllerState, emptyPoint} from '../utils/consts';


export default class TripController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;

    this._activeSortType = SortType.DEFAULT;

    this._pointsAll = [];
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
    const points = this._pointsModel.getPoints();
    this._pointsAll = this._pointsModel.getPointsAll();

    this._sortComponent = new SortComponent(SORT_TYPES, this._activeSortType);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    renderComponent(this._container, this._sortComponent, Position.AFTERBEGIN);

    if (this._pointsAll.length === 0) {
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
    this._creatingPoint = new PointController(this._onDataChange, this._onViewChange, this._pointsModel, this._api);
    const newPointComponent = this._creatingPoint.render(emptyPoint, PointControllerState.ADD);
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

  _onDataChange(pointController, oldPoint, newPoint, state, isFavoriteButtonClick = false) {
    switch (state) {
      case PointControllerState.ADD:
        if (newPoint === null) {
          pointController.destroy();
        } else {
          pointController.setFormDisabled();
          this._api.createPoint(newPoint)
            .then((pointModel) => {
              this._pointsModel.createPoint(pointModel);
              pointController.render(pointModel, PointControllerState.DEFAULT);
              this.rerender();
            })
            .catch(() => {
              pointController.showLoadError();
              pointController.clearFormDisabled();
            });
        }
        this._creatingPoint = null;
        break;
      case PointControllerState.EDIT:
        if (newPoint === null) {
          pointController.setFormDisabled();
          this._api.deletePoint(oldPoint.id)
            .then(() => {
              this._pointsModel.removePoint(oldPoint.id);
              this.rerender(this._activeSortType);
            })
            .catch(() => {
              pointController.showLoadError();
              pointController.clearFormDisabled();
            });
        } else {
          pointController.setFormDisabled();
          this._api.updatePoint(oldPoint.id, newPoint)
            .then((pointModel) => {
              const isSuccess = this._pointsModel.updatePoint(oldPoint.id, pointModel);
              if (isSuccess && isFavoriteButtonClick) {
                pointController.clearFormDisabled();
                pointController.toggleIsFavorite();
              }
              if (isSuccess && !isFavoriteButtonClick) {
                pointController.render(pointModel, PointControllerState.DEFAULT);
                this.rerender(this._activeSortType);
              }
            })
            .catch(() => {
              pointController.showLoadError();
              pointController.clearFormDisabled();
            });
        }
        break;
      default:
        throw new Error(`Case ${state} not found`);
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((pointController) => pointController.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._pointsModel.setSortType(sortType);
    this._activeSortType = sortType;
    const points = this._pointsModel.getPoints();
    this._removePoints();
    this._renderPoints(points, sortType);
    if (this._creatingPoint) {
      this._creatingPoint = null;
    }
  }

  _onFilterTypeChange() {
    const points = this._pointsModel.getPoints();
    removeComponent(this._sortComponent);
    if (this._pointsAll.length !== 0) {
      renderComponent(this._container, this._sortComponent, Position.AFTERBEGIN);
      this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    }
    this._removePoints();
    this._renderPoints(points);
    if (this._creatingPoint) {
      this._creatingPoint = null;
    }
  }

  _getDay(onDataChange, onViewChange, day, index = null) {
    const dayComponent = new DayComponent(day, index);

    const points = day.points;
    points.forEach((point) => {
      const pointController = new PointController(onDataChange, onViewChange, this._pointsModel, this._api);
      dayComponent.addPoint(pointController.render(point, PointControllerState.DEFAULT));
      this._pointControllers.push(pointController);
    });
    return dayComponent;
  }
}
