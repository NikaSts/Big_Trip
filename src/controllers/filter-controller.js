import FilterComponent from "../components/filters";
import {FILTERS, Filter} from "../utils/filters";
import {renderComponent, removeComponent} from "../utils/render";


export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = Filter.DEFAULT;
    this._filterComponent = null;

    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
  }

  render() {
    const container = this._container;

    this._filterComponent = new FilterComponent(FILTERS, this._activeFilterType);
    this._filterComponent.setFilterTypeChangeHandler(this._onFilterTypeChange);
    renderComponent(container, this._filterComponent);
  }

  rerender() {
    removeComponent(this._filterComponent);
    this._activeFilterType = Filter.DEFAULT;
    this.render();
  }

  _onFilterTypeChange(filterType) {
    this._activeFilterType = filterType;
    this._pointsModel.setFilterType(filterType);
  }
}
