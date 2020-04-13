import {getFormattedDate, getDuration} from '../utils';


const createEventTemplate = (event) => {
  const {type, startDate, endDate, destination, basePrice, offers} = event;

  const start = getFormattedDate(startDate);
  const end = getFormattedDate(endDate);
  const duration = getDuration(endDate - startDate);
  const availableOffers = offers.slice().filter((offer) => offer.events.includes(type.name));

  return (
    `<li class="trip-events__item">
			<div class="event">
				<div class="event__type">
					<img class="event__type-icon" width="42" height="42" src="img/icons/${type.name}.png" alt="Event type icon">
				</div>
				<h3 class="event__title">${type.name} ${type.id === `transfer` ? `to` : `in`} ${destination.name}</h3>

				<div class="event__schedule">
					<p class="event__time">
						<time class="event__start-time" datetime="${new Date(startDate)}">${start.hours}:${start.minutes}</time>
						&mdash;
						<time class="event__end-time" datetime="${new Date(endDate)}">${end.hours}:${end.minutes}</time>
					</p>
					<p class="event__duration">${duration}</p>
				</div>

				<p class="event__price">
					&euro;&nbsp;<span class="event__price-value">${basePrice}</span>
				</p>

				<h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${availableOffers ? availableOffers.map((offer) =>
      `<li class="event__offer">
						<span class="event__offer-title">${offer.title}</span>
						&plus;
						&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
						</li>`).join(`\n`) : ``}
				</ul>

				<button class="event__rollup-btn" type="button">
					<span class="visually-hidden">Open event</span>
				</button>
			</div>
		</li>`
  );
};

export {createEventTemplate};
