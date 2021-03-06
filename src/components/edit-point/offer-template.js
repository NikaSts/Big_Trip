import {isChecked} from '../../utils/funcs';


const createAvailableOfferTemplate = (checkedOffers, offersByType) => {
  return offersByType.map((offer, index) => {
    const {title, price} = offer;
    return (
      `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}" type="checkbox" name="event-offer-1"${ isChecked(offer, checkedOffers) ? ` checked` : ``} value="${title}">
      <label class="event__offer-label" for="event-offer-${index}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
    );
  }).join(`\n`);
};

export {createAvailableOfferTemplate};
