import AbstractComponent from './abstract-component';
import {capitalizeFirstLetter, getNameByAttribute} from '../utils/common';


const SORT_ID_PREFIX = `sort-`;

const createSortMarkup = (sortType, isChecked) => {
  return (
    ` <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${sortType}"${isChecked ? ` checked` : ``}>
      <label class="trip-sort__btn" for="sort-${sortType}">${capitalizeFirstLetter(sortType)}</label>
    </div>`
  );
};

const getSortMarkup = (sortTypes) => {
  return sortTypes.map((type, index) => createSortMarkup(type, index === 0)).join(`\n`);
};

const createSortTemplate = (sortTypes) => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${getSortMarkup(sortTypes)}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};


export default class SortComponent extends AbstractComponent {
  constructor(sortTypes) {
    super();
    this._sortTypes = sortTypes;
  }
  getTemplate() {
    return createSortTemplate(this._sortTypes);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const target = evt.target.closest(`input[type="radio"]`);
      if (!target || target.id === this._sortType) {
        return;
      }
      const sortType = getNameByAttribute(target.id, SORT_ID_PREFIX);
      handler(sortType);
    });
  }
}
