import AbstractSmartComponent from '../abstract-smart-component';
import {createEditPointTemplate} from './edit-point-template';
import {State} from '../../controllers/point-controller';
import {getPointOffers} from '../../utils/funcs';

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";


export default class EditPointComponent extends AbstractSmartComponent {
  constructor(point, state, pointsModel) {
    super();
    this._point = point;
    this._state = state;
    this._pointsModel = pointsModel;

    this._destinations = pointsModel.getDestinations();

    this._type = point.type;
    this._startDate = point.startDate;
    this._endDate = point.endDate;

    this._offersByType = this._pointsModel.getOffersByType(this._type);
    this._checkedOffers = point.offers;

    this._destination = Object.assign({}, point.destination);
    this._isFavorite = point.isFavorite;
    this._basePrice = point.basePrice;

    this._deleteHandler = null;
    this._closeHandler = null;
    this._submitHandler = null;
    this._favoriteHandler = null;
    this._startPicker = null;
    this._endPicker = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditPointTemplate({
      type: this._type,
      startDate: this._startDate,
      endDate: this._endDate,
      offers: this._checkedOffers,
      destination: this._destination,
      isFavorite: this._isFavorite,
      basePrice: this._basePrice,
    }, this._state, this._offersByType, this._destinations);
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setCloseHandler(this._closeHandler);
    this.setDeleteHandler(this._deleteHandler);
    this.setFavoriteButtonClickHandler(this._favoriteHandler);
    this.applyFlatpickr();
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
    this._checkedOffers = point.offers;
    this._destination = point.destination;
    this._basePrice = point.basePrice;
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

  applyFlatpickr() {
    const startTimeInput = this.getElement().querySelector(`[name="event-start-time"]`);
    const endTimeInput = this.getElement().querySelector(`[name="event-end-time"]`);

    this.removeFlatpickr();

    const picker = {
      'altInput': true,
      'allowInput': true,
      'enableTime': true,
      'time_24hr': true,
      'altFormat': `d/m/y H:i`,
      'dateFormat': `u`,
    };

    this._startPicker = flatpickr(startTimeInput, Object.assign({}, picker, {
      defaultDate: this._startDate,
    }));

    this._endPicker = flatpickr(endTimeInput, Object.assign({}, picker, {
      defaultDate: this._endDate,
    }));
  }

  removeFlatpickr() {
    if (this._startPicker || this._endPicker) {
      this._startPicker.destroy();
      this._endPicker.destroy();
      this._startPicker = null;
      this._endPicker = null;
    }
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
        this._offersByType = this._pointsModel.getOffersByType(this._type);
        this.rerender();
      });

    destinationNameInput.addEventListener(`click`, (evt) => {
      evt.target.value = ``;
    });

    destinationNameInput.addEventListener(`input`, (evt) => {
      const inputValue = evt.target.value;
      const newDestination = this._destinations.find((destination) => destination.name === inputValue);
      if (inputValue === `` || !newDestination) {
        return;
      }
      this._destination = newDestination;
      this.rerender();
    });

    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      this._basePrice = Number(evt.target.value);
    });

    element.querySelector(`.event__available-offers`)
      .addEventListener(`click`, (evt) => {
        const target = evt.target.closest(`INPUT`);
        if (!target) {
          return;
        }
        target.toggleAttribute(`checked`);
        const offers = element.querySelectorAll(`.event__offer-checkbox` + `[checked=""]`);
        const checkedOffers = [...offers].map((offer) => offer.value);
        this._checkedOffers = getPointOffers(this._offersByType, checkedOffers);
        this.rerender();
      });

    element.querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, () => {
        this._isFavorite = !this._isFavorite;
        this.rerender();
      });

    element.querySelector(`[name="event-start-time"]`)
      .addEventListener(`change`, (evt) => {
        const inputValue = evt.target.value;
        this._startDate = inputValue;
      });

    element.querySelector(`[name="event-end-time"]`)
      .addEventListener(`change`, (evt) => {
        const inputValue = evt.target.value;
        this._endDate = inputValue;
      });
  }
}
