import {createPointTypeTemplate} from './helpers/point-type';
import {createAvailableOfferTemplate} from './helpers/offer';
import {getFormattedDate, capitalizeFirstLetter} from '../utils/common';
import {TypeGroup, pointGroupToType, CITY_NAMES} from '../mock/point';
import AbstractComponent from './abstract-component';


const transferTypes = createPointTypeTemplate(pointGroupToType[TypeGroup.TRANSFER]);
const activityTypes = createPointTypeTemplate(pointGroupToType[TypeGroup.ACTIVITY]);

const createEditPointTemplate = (point) => {
  const {type, startDate, endDate, basePrice, destination, offers} = point;
  const capitalizedType = capitalizeFirstLetter(type);
  const start = getFormattedDate(startDate);
  const end = getFormattedDate(endDate);
  const hasOffers = offers.length > 0;
  const availableOffers = hasOffers ? createAvailableOfferTemplate(offers) : ``;

  const transferGroup = pointGroupToType[TypeGroup.TRANSFER].includes(type);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
			<header class="event__header">
				<div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${transferTypes}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${activityTypes}
            </fieldset>
          </div>

          </div>
				<div class="event__field-group  event__field-group--destination">
					<label class="event__label  event__type-output" for="event-destination-1">
						${capitalizedType} ${transferGroup ? `to` : `in`}
					</label>
					<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${CITY_NAMES.map((city) =>
      `<option value=${city}></option>`
    ).join(` `)}
					</datalist>
				</div>

				<div class="event__field-group  event__field-group--time">
					<label class="visually-hidden" for="event-start-time-1">From</label>
					<input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${start.day}/${start.month}/${start.year} ${start.hours}:${start.minutes}">
					&mdash;
					<label class="visually-hidden" for="event-end-time-1">To</label>
					<input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${end.day}/${end.month}/${end.year} ${end.hours}:${end.minutes}">
				</div>

				<div class="event__field-group  event__field-group--price">
					<label class="event__label" for="event-price-1">
						<span class="visually-hidden">Price</span>
						&euro;
					</label>
					<input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
				</div>

				<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
				<button class="event__reset-btn" type="reset">Cancel</button>
      </header>

      <section class="event__details">

				<section class="event__section  event__section--offers${!hasOffers ? ` visually-hidden` : ``}">
					<h3 class="event__section-title  event__section-title--offers">Offers</h3>

					<div class="event__available-offers">
          ${availableOffers}

          </div>
				</section>

				<section class="event__section  event__section--destination">
					<h3 class="event__section-title  event__section-title--destination">Destination</h3>
					<p class="event__destination-description">${destination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
          ${destination.photos.map((src) => (
      `<img class="event__photo" src="${src}" alt="Event photo">`
    )).join(` `)}
            </div>
					</div>
        </section>

			</section>
		</form>`
  );
};

export default class EditPointComponent extends AbstractComponent {
  constructor(point) {
    super();
    this._point = point;
  }
  getTemplate() {
    return createEditPointTemplate(this._point);
  }
  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
  }
}
