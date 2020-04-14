const createAvailableOfferTemplate = (offers) => {
  return offers.map((offer, index) => {
    const {title, price, isChecked} = offer;
    return (
      `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index}" type="checkbox" name="event-offer-luggage"${ isChecked ? ` checked` : ``}>
      <label class="event__offer-label" for="event-offer-luggage-${index}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
    );
  }).join(`\n`);
};

export {createAvailableOfferTemplate};
