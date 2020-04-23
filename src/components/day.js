import {getFormattedDate} from '../utils/common';
import AbstractComponent from './abstract-component';


const createDayTemplate = (tripDay, index) => {
  const isIndexValid = (index !== null);
  const {date} = tripDay;
  const tripDate = getFormattedDate(date);
  const day = tripDate.day;
  const month = tripDate.month;
  const monthName = tripDate.monthName;
  const year = tripDate.fullYear;

  return (
    `<li class="trip-days__item day">
      <div class="day__info">

        ${isIndexValid ?
      `<span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${year}-${month}-${day}">${monthName} ${day}</time>` : ``}

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
}
