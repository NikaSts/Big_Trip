import {Filter, getFiltredPoints} from '../utils/filters';
import {SortType, getSortedPoints} from '../utils/sort';
import {parseOffers} from '../utils/funcs';


export default class PointsModel {
  constructor() {
    this._points = [];

    this._activeFilter = Filter.DEFAULT;
    this._activeSortType = SortType.DEFAULT;

    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  getPointsAll() {
    return this._points;
  }

  getPoints() {
    const filterdPoints = getFiltredPoints(this._points, this._activeFilter);
    const sortedPoints = getSortedPoints(filterdPoints, this._activeSortType);
    return sortedPoints;
  }

  setPoints(points) {
    console.log(points);
    this._points = Array.from(points);
    this._callHandlers(this._dataChangeHandlers);
  }

  getDestinations() {
    return this._destinations;
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getOffers() {
    return this._offers;
  }

  getOffersByType(type) {
    return this._offers[type];
  }

  setOffers(offers) {
    this._offers = parseOffers(offers);
  }

  setFilterType(filterType = Filter.DEFAULT) {
    this._activeFilter = filterType;
    this._activeSortType = SortType.DEFAULT;
    this._callHandlers(this._filterChangeHandlers);
  }

  setSortType(sortType) {
    this._activeSortType = sortType;
  }

  createPoint(point) {
    this._points = [].concat(point, this._points);
    this._callHandlers(this._dataChangeHandlers);
  }

  removePoint(id) {
    const index = this._points.findIndex((point) => point.id === id);
    if (index === -1) {
      return false;
    }
    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  updatePoint(id, newData) {
    const index = this._points.findIndex((point) => point.id === id);
    if (index === -1) {
      return false;
    }
    this._points = [].concat(this._points.slice(0, index), newData, this._points.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  setFilterTypeChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
