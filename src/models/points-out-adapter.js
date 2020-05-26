import {formatToISOString} from '../utils/funcs';

export default class PointsOutAdapter {
  constructor(point) {
    this.id = point[`id`];
    this.type = point[`type`];
    this.startDate = point[`startDate`];
    this.endDate = point[`endDate`];
    this.basePrice = point[`basePrice`];
    this.isFavorite = point[`isFavorite`];
    this.offers = point[`offers`];
    this.destination = point[`destination`];
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

  static clone(point) {
    return new PointsOutAdapter(point);
  }
}
