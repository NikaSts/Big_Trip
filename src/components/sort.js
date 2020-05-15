import AbstractComponent from './abstract-component';
import {capitalizeFirstLetter, getTypeById} from '../utils/common';


const SORT_ID_PREFIX = `sort-`;

const createSortMarkup = (sortType, activeSortType) => {
  const isChecked = sortType === activeSortType;
  return (
    ` <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${sortType}"${isChecked ? ` checked` : ``}>
      <label class="trip-sort__btn" for="sort-${sortType}">${capitalizeFirstLetter(sortType)}</label>
    </div>`
  );
};

const getSortMarkup = (sortTypes, activeSortType) => {
  return sortTypes.map((type) => createSortMarkup(type, activeSortType)).join(`\n`);
};

const createSortTemplate = (sortTypes, activeSortType) => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${getSortMarkup(sortTypes, activeSortType)}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};


export default class SortComponent extends AbstractComponent {
  constructor(sortTypes, activeSortType) {
    super();
    this._sortTypes = sortTypes;
    this._activeSortType = activeSortType;
  }
  getTemplate() {
    return createSortTemplate(this._sortTypes, this._activeSortType);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const sortType = getTypeById(evt.target.id, SORT_ID_PREFIX);
      handler(sortType);
    });
  }
}
