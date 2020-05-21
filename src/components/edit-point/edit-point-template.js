import {createPointTypeTemplate} from './point-type-template';
import {createDestinationTemplate} from './destination-template';
import {createAvailableOfferTemplate} from './offer-template';
import {TypeGroup, pointGroupToType} from '../../utils/consts';
import {capitalizeFirstLetter} from '../../utils/common';
import {State} from '../../controllers/point-controller';


const createEditPointTemplate = (options = {}, state, availableOffers, destinations) => {
  const {type, startDate, endDate, offers, destination, isFavorite, basePrice} = options;
  const capitalizedType = capitalizeFirstLetter(type);

  const isValidDestination = !!destination.name;
  const cityName = destinations.map((city) => city.name);
  const isNew = state === State.ADD;
  const hasOffers = offers.length > 0;
  const offersToShow = hasOffers ? createAvailableOfferTemplate(offers) : ``;

  const transferGroup = pointGroupToType[TypeGroup.TRANSFER].includes(type);
  const transferTypes = createPointTypeTemplate(pointGroupToType[TypeGroup.TRANSFER], options);
  const activityTypes = createPointTypeTemplate(pointGroupToType[TypeGroup.ACTIVITY], options);

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" min="10" required>
          <datalist id="destination-list-1">
          ${cityName.map((city) =>
      `<option value=${city}></option>`
    ).join(` `)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" required>
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
          ${offersToShow}

          </div>
        </section>
      ${isValidDestination ? createDestinationTemplate(destination) : ``}
      </section>
    </form>`
  );
};

export {createEditPointTemplate};
