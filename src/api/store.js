export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storePointsKey = key;
    this._storeOffersKey = `offers`;
    this._storeDestinationsKey = `destinations`;
  }

  getPoints() {
    try {
      return JSON.parse(this._storage.getItem(this._storePointsKey)) || {};
    } catch (err) {
      return {};
    }
  }

  getDestinations() {
    try {
      return JSON.parse(this._storage.getItem(this._storeDestinationsKey)) || {};
    } catch (err) {
      return {};
    }
  }

  getOffers() {
    try {
      return JSON.parse(this._storage.getItem(this._storeOffersKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getPoints();

    this._storage.setItem(
        this._storePointsKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  setItems(items) {
    this._storage.setItem(
        this._storePointsKey,
        JSON.stringify(items)
    );
  }

  setDestinations(destinations) {
    this._storage.setItem(this._storeDestinationsKey, JSON.stringify(destinations));
  }

  setOffers(offers) {
    this._storage.setItem(this._storeOffersKey, JSON.stringify(offers));
  }

  removeItem(key) {
    const store = this.getPoints();
    delete store[key];
    this._storage.setItem(
        this._storePointsKey,
        JSON.stringify(store));
  }
}
