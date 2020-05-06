import FilterComponent from "../components/filters";
import {FILTERS, Filter} from "../utils/filters";
import {renderComponent} from "../utils/render";


export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = Filter.EVERYTHING;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    const container = this._container;

    this._filterComponent = new FilterComponent(FILTERS);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);
    renderComponent(container, this._filterComponent);
  }

  _onFilterChange(filterType) {
    this._activeFilterType = filterType;
    this._pointsModel.setFilter(filterType);
  }
}
