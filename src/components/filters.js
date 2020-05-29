import AbstractComponent from './abstract';
import {capitalizeFirstLetter, getTypeById} from '../utils/funcs';
import {FILTER_ID_PREFIX} from '../utils/consts';


const createFilterMarkup = (filter) => {
  const {name, isDisabled, isChecked} = filter;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio"
        name="trip-filter" value="${name}"${isChecked && !isDisabled ? ` checked` : ``} ${isDisabled ? ` disabled` : ``}>
      <label class="trip-filters__filter-label" for="filter-${name}">${capitalizeFirstLetter(name)}</label>
    </div>`
  );
};

const getfiltersMarkup = (filters) => {
  return filters.map((filter) => createFilterMarkup(filter)).join(`\n`);
};

const createFiltersTemplate = (filters) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${getfiltersMarkup(filters)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FiltersComponent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterTypeChangeHandler(onFilterTypeChange) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterType = getTypeById(evt.target.id, FILTER_ID_PREFIX);
      onFilterTypeChange(filterType);
    });
  }
}
