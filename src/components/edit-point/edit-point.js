import AbstractSmartComponent from '../abstract-smart-component';
import {createEditPointTemplate} from './edit-point-template';
import {convertDateStringToTimestamp} from '../../utils/common';
import {availableOffers, destinations} from '../../mock/points-mock';
import {State} from '../../controllers/point-controller';

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";


const parseFormData = (formData) => {
  const pointType = formData.get(`event-type`);
  const cityName = formData.get(`event-destination`);
  const destinationData = destinations.find((destination) => destination.name === cityName);
  const checkedOffers = formData.getAll(`event-offer-1`);

  return {
    type: pointType,
    startDate: convertDateStringToTimestamp(formData.get(`event-start-time`)),
    endDate: convertDateStringToTimestamp(formData.get(`event-end-time`)),
    basePrice: formData.get(`event-price`),
    isFavorite: Boolean(formData.get(`event-favorite`)),
    offers: availableOffers[pointType].filter((offer) => checkedOffers.includes(offer.title)),
    destination: {
      name: cityName,
      description: destinationData.description,
      photos: destinationData.photos,
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
    return createEditPointTemplate({
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
        startTimeInput.value = this.selectedDates[0];
        this._startDate = Number(new Date(this.selectedDates[0]));
      }
    }));

    this._endPicker = flatpickr(endTimeInput, Object.assign({}, picker, {
      defaultDate: this._point.endDate || `today`,
      onClose() {
        endTimeInput.value = this.selectedDates[0];
        this._endDate = Number(new Date(this.selectedDates[0]));
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
        this._offers = availableOffers[this._type];
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

    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      this._basePrice = Number(evt.target.value);
    });

    element.querySelector(`.event__available-offers`)
      .addEventListener(`click`, (evt) => {
        const target = evt.target.closest(`INPUT`);
        if (!target) {
          return;
        }
        const offerType = target.id.split(`-`)[2];
        const targetOffer = this._offers.find((offer) => offer.type === offerType);
        targetOffer.isChecked = !targetOffer.isChecked;
        this.rerender();
      });
  }
}
