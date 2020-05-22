import {formatToISOString} from '../utils/funcs';

export default class PointsAdapterOut {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.startDate = data[`startDate`];
    this.endDate = data[`endDate`];
    this.basePrice = data[`basePrice`];
    this.isFavorite = data[`isFavorite`];
    this.offers = data[`offers`];
    this.destination = data[`destination`];
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.type,
      "date_from": formatToISOString(this.startDate),
      "date_to": formatToISOString(this.endDate),
      "base_price": Number(this.basePrice),
      "is_favorite": Boolean(this.isFavorite),
      "offers": this.offers,
      "destination": this.destination,
    };
  }

  static clone(data) {
    return new PointsAdapterOut(data);
  }
}
