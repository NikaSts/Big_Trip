import {EVENT_TYPES} from '../mock/event';

const createEventTypeTemplate = (identificator) => {
  const types = Object.assign(EVENT_TYPES).filter((item) => item.id === identificator);
  return types
    .map((type, index) => {
      const name = type.name.toLowerCase();
      return (
        `<div class="event__type-item">
          <input id="event-type-${name}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.name}">
          <label class="event__type-label  event__type-label--${name}" for="event-type-${name}-${index}">${type.name}</label>
        </div>`
      );
    }).join(`\n`);
};

export {createEventTypeTemplate};
