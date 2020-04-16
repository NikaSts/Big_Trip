import {getFormattedDate, getDuration, capitalizeFirstLetter} from '../utils';
import {pointGroupToType, TypeGroup} from '../mock/point';


const createPointTemplate = (point) => {
  const {type, startDate, endDate, destination, basePrice, offers} = point;
  const capitalizedType = capitalizeFirstLetter(type);
  const start = getFormattedDate(startDate);
  const end = getFormattedDate(endDate);
  const duration = getDuration(endDate - startDate);
  const hasOffers = offers.length > 0;
  const availableOffers = hasOffers ? offers
    .filter((offer) => offer.isChecked)
    .slice(0, 3) : ``;

  const transferGroup = pointGroupToType[TypeGroup.TRANSFER].includes(type);

  return (
    `<li class="trip-events__item">
			<div class="event">
				<div class="event__type">
					<img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
				</div>
				<h3 class="event__title">${capitalizedType} ${transferGroup ? `to` : `in`} ${destination.name}</h3>

				<div class="event__schedule">
					<p class="event__time">
						<time class="event__start-time" datetime="${start.fullYear}-${start.month}-${start.day}T${start.hours}:${start.minutes}">${start.hours}:${start.minutes}</time>
						&mdash;
						<time class="event__end-time" datetime="${end.fullYear}-${end.month}-${end.day}T${end.hours}:${end.minutes}">${end.hours}:${end.minutes}</time>
					</p>
					<p class="event__duration">${duration}</p>
				</div>

				<p class="event__price">
					&euro;&nbsp;<span class="event__price-value">${basePrice}</span>
				</p>

				<h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers${!hasOffers ? ` visually-hidden` : ``}">
        ${hasOffers ? availableOffers.map((offer) =>
      `<li class="event__offer">
						<span class="event__offer-title">${offer.title}</span>
						&plus;
						&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
					</li>`).join(` `) : ``}
				</ul>

				<button class="event__rollup-btn" type="button">
					<span class="visually-hidden">Open event</span>
				</button>
			</div>
		</li>`
  );
};

export {createPointTemplate};
