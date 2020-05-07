import {Filter, getFiltredPoints} from '../utils/filters';
import {SortType, getSortedPoints} from '../utils/sort';


export default class PointsModel {
  constructor() {
    this._points = [];

    this._activeFilter = Filter.EVERYTHING;
    this._activeSortType = SortType.DEFAULT;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getPoints() {
    const filterdPoints = getFiltredPoints(this._points.slice(), this._activeFilter);
    const sortedPoints = getSortedPoints(filterdPoints, this._activeSortType);
    return sortedPoints;
  }

  setPoints(points) {
    // console.log(this._points);
    this._points = Array.from(points);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterType(filterType) {
    this._activeFilter = filterType;
    this._activeSortType = SortType.DEFAULT;

    this._callHandlers(this._filterChangeHandlers);
  }

  setSortType(sortType) {
    this._activeSortType = sortType;
  }

  updatePoint(id, point) {
    const index = this._points.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }
    this._points = [].concat(this._points.slice(0, index), point, this._points.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterTypeChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
