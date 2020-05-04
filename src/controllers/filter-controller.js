import FilterComponent from "../components/filters";
import {FILTERS, Filter} from "../utils/filters";
import {renderComponent, replaceComponent} from "../utils/render";
// import {generateFilters} from "../utils/filter";


export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = Filter.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;

    /*     const points = this._pointsModel.getPoints();
    const filters = generateFilters(points);
 */
    const oldComponent = this._filterComponent; // ////////////////////////////////////

    this._filterComponent = new FilterComponent(FILTERS);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replaceComponent(this._filterComponent, oldComponent);
    } else {
      renderComponent(container, this._filterComponent);
    }
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
