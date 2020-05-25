import {formatDate, getPointPrice} from '../utils/funcs';
import AbstractSmartComponent from './abstract-smart';
import {ONE_ITEM} from '../utils/consts';


const createInfoMainMarkup = (points) => {
  points.sort((a, b) => a.startDate - b.startDate);
  const [firstTripPoint] = points.slice(0, ONE_ITEM);
  const firstTripDate = formatDate(firstTripPoint.startDate);
  const firstVisitedCity = firstTripPoint.destination.name;

  const [lastTripPoint] = points.sort((a, b) => a.endDate - b.endDate).slice(-ONE_ITEM);
  const lastTripDate = formatDate(lastTripPoint.endDate);
  const lastVisitedCity = lastTripPoint.destination.name;

  const cities = points.map((point) => point.destination.name);

  const showVisitedCities = () => {
    let visitedCities = cities.map((city) => city).join(` &mdash; `);
    if (cities.length > 3) {
      visitedCities = `${firstVisitedCity} &mdash; . . . &mdash; ${lastVisitedCity}`;
    }
    return visitedCities;
  };

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${showVisitedCities()}</h1>

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

export default class TripInfoComponent extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;
  }

  getTemplate() {
    const points = this._pointsModel.getPointsAll();
    return createTripInfoTemplate(points);
  }

  recoveryListeners() { }
}
