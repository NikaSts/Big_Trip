
export default class PointsInAdapter {
  constructor(point) {
    this.id = point[`id`];
    this.type = point[`type`];
    this.startDate = Date.parse(point[`date_from`]);
    this.endDate = Date.parse(point[`date_to`]);
    this.basePrice = point[`base_price`];
    this.isFavorite = Boolean(point[`is_favorite`]);
    this.offers = point[`offers`] || [];
    this.destination = point[`destination`];
  }

  static parsePoint(point) {
    return new PointsInAdapter(point);
  }

  static parsePoints(point) {
    return point.map(PointsInAdapter.parsePoint);
  }
}
