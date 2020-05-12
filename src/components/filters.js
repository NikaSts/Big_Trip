import AbstractComponent from './abstract-component';
import {Filter} from "../utils/filters";
import {capitalizeFirstLetter, getNameByAttribute} from '../utils/common';


const FILTER_ID_PREFIX = `filter-`;

const createFilterMarkup = (filter, activeFilter) => {
  const isChecked = filter === activeFilter;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio"
        name="trip-filter" value="${filter}"${isChecked ? ` checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${filter}">${capitalizeFirstLetter(filter)}</label>
    </div>`
  );
};

const getfiltersMarkup = (filters, activeFilter) => {
  return filters.map((filter) => createFilterMarkup(filter, activeFilter)).join(`\n`);
};

const createFiltersTemplate = (filters, activeFilter) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${getfiltersMarkup(filters, activeFilter)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FiltersComponent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
    this._activeFilter = Filter.DEFAULT;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._activeFilter);
  }

  setFilterTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterType = getNameByAttribute(evt.target.id, FILTER_ID_PREFIX);
      handler(filterType);
    });
  }
}
