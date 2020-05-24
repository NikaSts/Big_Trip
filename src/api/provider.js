import PointsAdapterIn from '../models/points-adapter-in';
import PointsAdapterOut from '../models/points-adapter-out';


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    if (this._isOnline) {
      return this._api.getPoints()
              .then((points) => {
                points.forEach((point) => this._store.setItem(point.id, point));
                return points;
              });
    }
    const storePoints = Object.values(this._store.getPoints());
    return Promise.resolve(PointsAdapterIn.parsePoints(storePoints));
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setDestinations(destinations);
          return destinations;
        });
    }
    return Promise.resolve(this._store.getDestinations());
  }

  getOffers() {
    if (this._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setOffers(offers);
          return offers;
        });
    }
    return Promise.resolve(this._store.getOffers());
  }

  updatePoint(id, point) {
    if (this._isOnline()) {
      return this._api.updatePoint(id, point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint);
          return newPoint;
        });
    }
    const localPoint = PointsAdapterOut.clone(Object.assign(point, {id}));
    this._store.setItem(id, localPoint);
    return Promise.resolve(localPoint);
  }

  createPoint(point) {
    if (this._isOnline) {
      return this._api.createPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint);
          return newPoint;
        });
    }
    const localNewPoint = PointsAdapterOut.clone(Object.assign(point.id, point));
    this._store.setItem(localNewPoint.id, localNewPoint);
    return Promise.resolve(localNewPoint);
  }

  deletePoint(id) {
    if (this._isOnline) {
      return this._api.deletePoint(id)
        .then(() => this._store.removeItem(id));
    }
    this._store.removeItem(id);
    return Promise.resolve();
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
