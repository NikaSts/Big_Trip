

export default class PointsModel {
  constructor() {
    this._points = [];
    this._dataChangeHandlers = [];
  }

  getPoints() {
    return this._points; // getPointsByFilter(this._activeFilterType);
  }
  setPoints(points) {
    this._points = Array.from(points);
    this._callHandlers(this._dataChangeHandlers);
  }
  updatePoint(id, point, sortedPoints) {
    const index = sortedPoints.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }
    sortedPoints = [].concat(sortedPoints.slice(0, index), point, sortedPoints.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }
  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilter() {

  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
