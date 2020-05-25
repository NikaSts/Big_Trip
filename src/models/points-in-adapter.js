
export default class PointsInAdapter {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.startDate = Date.parse(data[`date_from`]);
    this.endDate = Date.parse(data[`date_to`]);
    this.basePrice = data[`base_price`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`] || [];
    this.destination = data[`destination`];
  }

  static parsePoint(data) {
    return new PointsInAdapter(data);
  }

  static parsePoints(data) {
    return data.map(PointsInAdapter.parsePoint);
  }
}
