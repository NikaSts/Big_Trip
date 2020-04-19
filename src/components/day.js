import {getFormattedDate, createElement} from '../utils';

const createDayTemplate = (tripDay, index) => {
  const {date} = tripDay;
  const tripDate = getFormattedDate(date);
  const day = tripDate.day;
  const month = tripDate.month;
  const monthName = tripDate.monthName;
  const year = tripDate.fullYear;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${year}-${month}-${day}">${monthName} ${day}</time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`);
};

export default class DayComponent {
  constructor(day, index) {
    this._day = day;
    this._index = index;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._day, this._index);
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }
}
