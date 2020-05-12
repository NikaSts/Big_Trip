import {capitalizeFirstLetter} from '../../utils/common';

const createPointTypeTemplate = (types, options) => {
  return types
    .map((type, index) => {
      const isChecked = type === options.type;
      const capitalizedType = capitalizeFirstLetter(type);
      return (
        `<div class="event__type-item">
          <input id="event-type-${type}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${index}">${capitalizedType}</label>
        </div>`
      );
    }).join(` `);
};

export {createPointTypeTemplate};
