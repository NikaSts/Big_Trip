import {createPointTypeTemplate} from './helpers/point-type';
import {createAvailableOfferTemplate} from './helpers/offer';
import {getFormattedDate, capitalizeFirstLetter} from '../utils/common';
import {TypeGroup, pointGroupToType, CITY_NAMES, generateOffers, destinations} from '../mock/point';
import AbstractSmartComponent from './abstract-smart-component';


const transferTypes = createPointTypeTemplate(pointGroupToType[TypeGroup.TRANSFER]);
const activityTypes = createPointTypeTemplate(pointGroupToType[TypeGroup.ACTIVITY]);

const createEditPointTemplate = (point, options = {}) => {
  const {basePrice, isFavorite} = point;
  const {type, startDate, endDate, offers, destination} = options;

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

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

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

export default class EditPointComponent extends AbstractSmartComponent {
  constructor(point) {
    super();
    this._point = point;

    this._type = point.type;
    this._startDate = point.startDate;
    this._endDate = point.endDate;
    this._offers = point.offers.slice();
    this._destination = Object.assign({}, point.destination);

    this._resetHandler = null;
    this._submitHandler = null;
    this._favoriteHandler = null;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditPointTemplate(this._point, {
      type: this._type,
      startDate: this._startDate,
      endDate: this._endDate,
      offers: this._offers,
      destination: this._destination,
    });
  }
  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setResetHandler(this._resetHandler);
    this.setFavoriteButtonClickHandler(this._favoriteHandler);
    this._subscribeOnEvents();
  }
  rerender() {
    super.rerender();
  }
  reset() {
    const point = this._point;

    this._type = point.type;
    this._startDate = point.startDate;
    this._endDate = point.endDate;
    this._offers = point.offers;
    this._destination = point.destination;

    this.rerender();
  }

  setSubmitHandler(onFormSubmit) {
    this.getElement().addEventListener(`submit`, onFormSubmit);
    this._submitHandler = onFormSubmit;
  }

  setResetHandler(onFormReset) {
    const resetButton = this.getElement().querySelector(`.event__reset-btn`);
    resetButton.addEventListener(`click`, onFormReset);
    this._resetHandler = onFormReset;
  }

  setFavoriteButtonClickHandler(onFavoriteButtonClick) {
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, onFavoriteButtonClick);
    this._favoriteHandler = onFavoriteButtonClick;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`)
    .addEventListener(`click`, (evt) => {
      const target = evt.target.closest(`LABEL`);
      if (!target) {
        return;
      }
      this._type = target.textContent.toLowerCase();
      this._offers = generateOffers(this._type);
      this.rerender();
    });

    const destinationNameInput = element.querySelector(`#event-destination-1`);

    destinationNameInput.addEventListener(`click`, (evt) => {
      evt.target.value = ``;
    });

    destinationNameInput.addEventListener(`input`, (evt) => {
      const inputValue = evt.target.value;
      const newDestination = destinations.find((destination) => destination.name === inputValue);
      if (inputValue === `` || !newDestination) {
        return;
      }
      this._destination = newDestination;
      this.rerender();
    });
  }
}
