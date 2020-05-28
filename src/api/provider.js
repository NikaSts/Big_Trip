
import PointsInAdapter from '../models/points-in-adapter';
import PointsOutAdapter from '../models/points-out-adapter';
import {createStoreStructure, isOnline, getSyncedPoints} from '../utils/funcs';


export default class Provider {
  constructor(api, store, pointsModel) {
    this._api = api;
    this._store = store;
    this._pointsModel = pointsModel;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const formattedPoints = createStoreStructure(points);
          this._store.setPoints(formattedPoints);
          return points;
        })
        .then(PointsInAdapter.parsePoints);
    }
    const storePoints = Object.values(this._store.getPoints());
    return Promise.resolve(PointsInAdapter.parsePoints(storePoints));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setDestinations(destinations);
          return destinations;
        });
    }
    return Promise.resolve(this._store.getDestinations());
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setOffers(offers);
          return offers;
        });
    }
    return Promise.resolve(this._store.getOffers());
  }

  createPoint(point) {
    if (isOnline()) {
      return this._api.createPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint);
          return newPoint;
        })
        .then(PointsInAdapter.parsePoint);
    }
    const createdPoint = PointsOutAdapter.clone(point).toRAW();
    this._store.setItem(point.id, createdPoint);
    return Promise.resolve(PointsInAdapter.parsePoint(createdPoint));
  }

  updatePoint(id, point) {
    if (isOnline()) {
      return this._api.updatePoint(id, point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint);
          return newPoint;
        })
        .then(PointsInAdapter.parsePoint);
    }
    const updatedPoint = PointsOutAdapter.clone(point).toRAW();
    this._store.setItem(id, updatedPoint);
    return Promise.resolve(PointsInAdapter.parsePoint(updatedPoint));
  }

  deletePoint(id) {
    if (isOnline()) {
      return this._api.deletePoint(id)
        .then(() => this._store.removeItem(id));
    }
    this._store.removeItem(id);
    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storedPoints = Object.values(this._store.getPoints());
      return this._api.sync(storedPoints)
        .then((response) => {
          const createdPoints = response.created;
          const updatedPoints = getSyncedPoints(response.updated);

          const points = createStoreStructure([...createdPoints, ...updatedPoints]);
          this._store.setPoints(points);

          const synchronizedPoints = PointsInAdapter.parsePoints(Object.values(points));
          this._pointsModel.setPoints(synchronizedPoints);
        });
    }
    return Promise.reject(new Error(`Sync data failed`));
  }
}
