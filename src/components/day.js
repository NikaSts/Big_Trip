import {getFormattedDate, createElement} from '../utils';

const createDayTemplate = (tripDay) => {
  const {date} = tripDay;
  const tripDate = getFormattedDate(date);
  const day = tripDate.day;
  const month = tripDate.month;
  const monthName = tripDate.monthName;
  const year = tripDate.fullYear;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter"></span>
        <time class="day__date" datetime="${year}-${month}-${day}">${monthName} ${day}</time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`);
};

export default class DayComponent {
  constructor(day) {
    this._day = day;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._day);
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
