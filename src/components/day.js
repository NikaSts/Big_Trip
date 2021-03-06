import {formatDate, formatToISOString} from '../utils/funcs';
import AbstractComponent from './abstract';
import {renderComponent} from '../utils/render';


const createDayTemplate = (tripDay, index) => {
  const isIndexValid = (index !== null);
  const {date} = tripDay;

  const isDateValid = (date !== 0);
  const dateTime = isDateValid ? formatToISOString(date) : ``;
  const tripDate = isDateValid ? formatDate(date) : ``;

  return (
    `<li class="trip-days__item day">
      <div class="day__info">

        ${isIndexValid ?
      `<span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${dateTime}">${tripDate}</time>` : ``}

      </div>
      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class DayComponent extends AbstractComponent {
  constructor(day, index) {
    super();
    this._day = day;
    this._index = index;
  }

  getTemplate() {
    return createDayTemplate(this._day, this._index);
  }
  addPoint(pointController) {
    const pointsList = this.getElement().querySelector(`.trip-events__list`);
    renderComponent(pointsList, pointController);
  }
}
