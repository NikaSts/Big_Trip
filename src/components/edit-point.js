import AbstractSmartComponent from './abstract-smart-component';
import {createPointTypeTemplate} from './helpers/point-type';
import {createPointDetailsTemplate} from './helpers/event-details';
import {capitalizeFirstLetter, formatDateAndTime, convertDateStringToTimestamp, getNameByAttribute} from '../utils/common';
import {createAvailableOfferTemplate} from './helpers/offer';
import {TypeGroup, pointGroupToType, CITY_NAMES, generateOffers, destinations} from '../mock/points-mock';
import {State} from '../controllers/point-controller';

import flatpickr from "flatpickr";
import {encode} from "he";

import "flatpickr/dist/flatpickr.min.css";


const OFFER_NAME_PREFIX = `event-offer-`;

const createEditPointTemplate = (point, options = {}, state) => {
  const {} = point;
  const {type, startDate, endDate, offers, destination, isFavorite, basePrice} = options;

  const capitalizedType = capitalizeFirstLetter(type);
  const start = formatDateAndTime(startDate);
  const end = formatDateAndTime(endDate);

  const isValidDestination = !!destination.name;

  const isNew = state === State.ADD;
  const hasOffers = offers.length > 0;
  const availableOffers = hasOffers ? createAvailableOfferTemplate(offers) : ``;

  const transferGroup = pointGroupToType[TypeGroup.TRANSFER].includes(type);
  const transferTypes = createPointTypeTemplate(pointGroupToType[TypeGroup.TRANSFER], options);
  const activityTypes = createPointTypeTemplate(pointGroupToType[TypeGroup.ACTIVITY], options);

  return (
    `<li class="trip-events__item">
      <form class="trip-events__item  event  event--edit" action="#" method="post">
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
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${start}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${end}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isValidDestination ? `` : `disabled`}>Save</button>
          <button class="event__reset-btn" type="reset">${isNew ? `Cancel` : `Delete`}</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn ${isNew ? `visually-hidden` : ``}" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
            ${isNew ? `` :
      `<button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Close event</span>
          </button>`}

        </header>
        <section class="event__details">

          <section class="event__section  event__section--offers${!hasOffers ? ` visually-hidden` : ``}">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
            ${availableOffers}

            </div>
          </section>
        ${isValidDestination ? createPointDetailsTemplate(destination) : ``}
        </section>
      </form>
    </li>`
  );
};


const parseFormData = (formData) => {
  return {
    type: formData.get(`event-type`),
    startDate: convertDateStringToTimestamp(formData.get(`event-start-time`)),
    endDate: convertDateStringToTimestamp(formData.get(`event-end-time`)),
    basePrice: formData.get(`event-price`),
    offers: formData.getAll(`event-offer`), // .filter((offer) => offer.isChecked),
    destination: {
      name: formData.get(`event-destination`),
    }
  };
};

export default class EditPointComponent extends AbstractSmartComponent {
  constructor(point, state) {
    super();
    this._point = point;
    this._state = state;

    this._type = point.type;
    this._startDate = point.startDate;
    this._endDate = point.endDate;
    this._offers = point.offers.slice();
    this._destination = Object.assign({}, point.destination);
    this._isFavorite = point.isFavorite;
    this._basePrice = point.basePrice;

    this._deleteHandler = null;
    this._closeHandler = null;
    this._submitHandler = null;
    this._favoriteHandler = null;
    this._startPicker = null;
    this._endPicker = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditPointTemplate(this._point, {
      type: this._type,
      startDate: this._startDate,
      endDate: this._endDate,
      offers: this._offers,
      destination: this._destination,
      isFavorite: this._isFavorite,
      basePrice: this._basePrice,
    }, this._state);
  }

  getData() {
    const form = this.getElement();
    const formData = new FormData(form);
    const data = parseFormData(formData);
    return data;
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setCloseHandler(this._closeHandler);
    this.setDeleteHandler(this._deleteHandler);
    this.setFavoriteButtonClickHandler(this._favoriteHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const point = this._point;

    this._type = point.type;
    this._startDate = point.startDate;
    this._endDate = point.endDate;
    this._offers = point.offers;
    this._destination = point.destination;
    this._basePrice = point.basePrice;

    this.rerender();
  }

  removeElement() {
    if (this._startPicker || this._endPicker) {
      this._startPicker.destroy();
      this._endPicker.destroy();
      this._startPicker = null;
      this._endPicker = null;
    }
    super.removeElement();
  }

  setSubmitHandler(onFormSubmit) {
    this.getElement().addEventListener(`submit`, onFormSubmit);
    this._submitHandler = onFormSubmit;
  }

  setCloseHandler(onFormClose) {
    if (this._state !== State.ADD) {
      this.getElement().querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, onFormClose);
      this._closeHandler = onFormClose;
    }
  }

  setDeleteHandler(onFormDelete) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, onFormDelete);
    this._deleteHandler = onFormDelete;
  }

  setFavoriteButtonClickHandler(onFavoriteButtonClick) {
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, onFavoriteButtonClick);
    this._favoriteHandler = onFavoriteButtonClick;
  }

  _applyFlatpickr() {
    if (this._startPicker || this._endPicker) {
      this._startPicker.destroy();
      this._endPicker.destroy();
      this._startPicker = null;
      this._endPicker = null;
    }

    const startTimeInput = this.getElement().querySelector(`#event-start-time-1`);
    const endTimeInput = this.getElement().querySelector(`#event-end-time-1`);

    const picker = {
      altInput: true,
      allowInput: true,
      enableTime: true,
      // eslint-disable-next-line camelcase
      time_24hr: true,
      altFormat: `d/m/y H:i`,
      dateFormat: `d/m/y H:i`,
    };

    this._startPicker = flatpickr(startTimeInput, Object.assign({}, picker, {
      defaultDate: this._point.startDate || `today`,
      onClose() {
        // startTimeInput.value = this.selectedDates[0];
      }
    }));

    this._endPicker = flatpickr(endTimeInput, Object.assign({}, picker, {
      defaultDate: this._point.endDate || `today`,
      onClose() {
        // endTimeInput.value = this.selectedDates[0];
      }
    }));
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const destinationNameInput = element.querySelector(`#event-destination-1`);

    element.querySelector(`.event__type-list`)
      .addEventListener(`click`, (evt) => {
        const target = evt.target.closest(`INPUT`);
        if (!target) {
          return;
        }
        this._type = target.value;
        this._offers = generateOffers(this._type);
        this.rerender();
      });

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

    element.querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, () => {
        this._isFavorite = !this._isFavorite;
        this.rerender();
      });

    element.querySelector(`#event-start-time-1`)
      .addEventListener(`change`, () => {
        this._startDate = Number(this._startPicker.selectedDates[0]);
        this.rerender();
      });

    element.querySelector(`#event-end-time-1`)
      .addEventListener(`change`, () => {
        this._endDate = Number(this._endPicker.selectedDates[0]);
        this.rerender();
      });

    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      const sanitizedPrice = encode(evt.target.value);
      this._basePrice = Number(sanitizedPrice);
      this.rerender();
    });

    element.querySelector(`.event__available-offers`)
      .addEventListener(`click`, (evt) => {
        const target = evt.target.closest(`INPUT`);
        if (!target) {
          return;
        }
        const offerId = getNameByAttribute(target.name, OFFER_NAME_PREFIX);
        const targetOffer = this._offers.find((offer) => offer.id === offerId);
        targetOffer.isChecked = !targetOffer.isChecked;
        const index = this._offers.findIndex((offer) => offer.id === offerId);
        this._offers.splice(index, 1, targetOffer);
        this.rerender();
      });
  }
}
