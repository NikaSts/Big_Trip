import {getFormattedDate} from '../utils/common';
import AbstractComponent from './abstract-component';
import {getTripDays} from '../utils/common';


const createTripInfoTemplate = (points) => {
  const totalPrice = points.reduce((basePriceSum, point) => {
    return basePriceSum + point.basePrice + point.offers.reduce((offerPriceSum, offer) => {
      if (offer.isChecked) {
        offerPriceSum += offer.price;
      }
      return offerPriceSum;
    }, 0);
  }, 0);

  const tripDays = getTripDays(points).sort((a, b) => a.date - b.date);
  const firstTripDate = getFormattedDate(tripDays[0].date);
  const [lastTripDay] = tripDays.slice(-1);
  const lastTripDate = getFormattedDate(lastTripDay.date);

  const firstVisitedCity = tripDays[0].points[0].destination.name;
  const [lastTripDayPoint] = lastTripDay.points.slice(-1);
  const lastVisitedCity = lastTripDayPoint.destination.name;

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${firstVisitedCity} &mdash; Chamonix &mdash; ${lastVisitedCity}</h1>

        <p class="trip-info__dates">${firstTripDate.monthName} ${firstTripDate.day}&nbsp;&mdash;&nbsp;${lastTripDate.monthName} ${lastTripDate.day}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`
  );
};

export default class TripInfoComponent extends AbstractComponent {
  constructor(days) {
    super();
    this._days = days;
  }

  getTemplate() {
    return createTripInfoTemplate(this._days);
  }
}
