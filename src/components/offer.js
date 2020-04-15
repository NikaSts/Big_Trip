const createAvailableOfferTemplate = (offers) => {
  return offers.map((offer, index) => {
    const {id, title, price, isChecked} = offer;
    return (
      `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-${index}" type="checkbox" name="event-offer-${id}"${ isChecked ? ` checked` : ``}>
      <label class="event__offer-label" for="event-offer-${id}-${index}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
    );
  }).join(`\n`);
};

export {createAvailableOfferTemplate};
