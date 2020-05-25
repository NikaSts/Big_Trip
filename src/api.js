import PointsInAdapter from './models/points-in-adapter';
import {Method, Code} from './utils/consts';


export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({
      url: `points`,
      method: Method.GET,
    })
      .then((response) => response.json())
      .then(PointsInAdapter.parsePoints);
  }

  getDestinations() {
    return this._load({
      url: `destinations`,
      method: Method.GET,
    })
      .then((response) => response.json());
  }

  getOffers() {
    return this._load({
      url: `offers`,
      method: Method.GET,
    })
      .then((response) => response.json());
  }

  updatePoint(id, data) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json())
      .then(PointsInAdapter.parsePoint);
  }

  createPoint(data) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json())
      .then(PointsInAdapter.parsePoint);
  }

  deletePoint(id) {
    return this._load({
      url: `points/${id}`,
      method: Method.DELETE,
    });
  }

  _load({url, method, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(this._checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  _checkStatus(response) {
    if (response.status >= Code.SUCCESS && response.status < Code.REDIRECT) {
      return response;
    }
    throw new Error(`${response.status}: ${response.statusText}`);
  }
}
