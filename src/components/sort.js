import AbstractComponent from './abstract-component';

const SortType = {
  DEFAULT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};

const createSortTemplate = () => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>

      <div class="trip-sort__item  trip-sort__item--event" data-sort>
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" checked>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
        <label class="trip-sort__btn" for="sort-time">Time</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
        <label class="trip-sort__btn" for="sort-price">Price</label>
      </div>

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class SortComponent extends AbstractComponent {
  constructor() {
    super();
    this._sortType = SortType.DEFAULT;
  }
  getTemplate() {
    return createSortTemplate();
  }
  getSortType() {
    return this._sortType;
  }
  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      let target = evt.target.closest(`input[type="radio"]`);
      if (!target) {
        return;
      }
      if (target.id === this._sortType) {
        return;
      }
      this._sortType = target.id;
      handler(this._sortType);
    });
  }
}

export {SortType};
