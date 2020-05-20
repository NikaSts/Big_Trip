import {formatToISOString} from '../utils/common';

export default class PointAdapter {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.startDate = Date.parse(data[`date_from`]);
    this.endDate = Date.parse(data[`date_to`]);
    this.basePrice = data[`base_price`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`] || [];
    if (this.offers.length > 0) {
      // eslint-disable-next-line no-return-assign
      this.offers.map((offer) => offer.isChecked = true);
    }
    this.destination = data[`destination`];
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.type,
      "date_from": formatToISOString(this.startDate),
      "date_to": formatToISOString(this.endDate),
      "base_price": this.basePrice,
      "is_favorite": this.isFavorite,
      "offers": this.offers,
      "destination": this.destination,
    };
  }

  static parsePoint(data) {
    return new PointAdapter(data);
  }

  static parsePoints(data) {
    return data.map(PointAdapter.parsePoint);
  }

  static clone(data) {
    return new PointAdapter(data.toRaw());
  }
}
