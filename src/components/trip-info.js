import {formatDate} from '../utils/funcs';
import AbstractComponent from './abstract-component';
import {getPointPrice} from '../utils/funcs';


const createInfoMainMarkup = (points) => {
  const [firstTripPoint] = points.slice(0, 1);
  const firstTripDate = formatDate(firstTripPoint.startDate);
  const firstVisitedCity = firstTripPoint.destination.name;

  const [lastTripPoint] = points.sort((a, b) => a.endDate - b.endDate).slice(-1);
  const lastTripDate = formatDate(lastTripPoint.endDate);
  const lastVisitedCity = lastTripPoint.destination.name;

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${firstVisitedCity} &mdash; Chamonix &mdash; ${lastVisitedCity}</h1>

      <p class="trip-info__dates">${firstTripDate}&nbsp;&mdash;&nbsp;${lastTripDate}</p>
    </div>`
  );
};

const createTripInfoTemplate = (points) => {
  const isNoPoints = points.length === 0;

  const totalPrice = points.reduce((basePriceSum, point) => {
    return basePriceSum + getPointPrice(point);
  }, 0);

  return (
    `<section class="trip-main__trip-info  trip-info">
      ${!isNoPoints ? createInfoMainMarkup(points) : ``}
    <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`
  );
};

export default class TripInfoComponent extends AbstractComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;

  }

  getTemplate() {
    const points = this._pointsModel.getPointsAll();
    return createTripInfoTemplate(points);
  }
}
