import PointsAdapterIn from '../models/points-adapter-in';
import PointsAdapterOut from '../models/points-adapter-out';


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = this._createStoreStructure(points);
          this._store.setItems(items);
          return points;
        })
        .then(PointsAdapterIn.parsePoints);
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
          this._store.setItem(id, newPoint);
          return newPoint;
        })
        .then(PointsAdapterIn.parsePoint);
    }
    const localPoint = Object.assign({}, point);
    this._store.setItem(id, localPoint.toRAW());
    return Promise.resolve(PointsAdapterIn.parsePoint(localPoint));
  }

  createPoint(point) {
    if (this._isOnline()) {
      return this._api.createPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint);
          return newPoint;
        })
        .then(PointsAdapterIn.parsePoint);
    }
    const localNewPoint = PointsAdapterOut.clone(Object.assign({}, point));
    this._store.setItem(localNewPoint.id, localNewPoint);
    return Promise.resolve(PointsAdapterIn.parsePoint(localNewPoint));
  }

  deletePoint(id) {
    if (this._isOnline()) {
      return this._api.deletePoint(id)
        .then(() => this._store.removeItem(id));
    }
    this._store.removeItem(id);
    return Promise.resolve();
  }

  /*   sync() {
    if (this._isOnline()) {
      const storePoints = Object.values(this._store.getPoints());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = response.created;
          const updatedPoints = this._getSyncedPoints(response.updated);

          const items = this._createStoreStructure([...createdPoints, ...updatedPoints]);
          this._store.setItems(items);

          // return Promise.resolve(items);

          //           const points = PointsAdapterIn.parsePoints(Object.values(items));
         // this._pointsModel.setPoints(points);

        });
    }
    return Promise.reject(new Error(`Sync data failed`));
  }

  _getSyncedPoints(items) {
    return items.filter(({success}) => success)
      .map(({payload}) => payload.point);
  }
 */
  _createStoreStructure(items) {
    return items.reduce((acc, current) => {
      return Object.assign({}, acc, {
        [current.id]: current,
      });
    }, {});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}