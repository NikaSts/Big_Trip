import FilterComponent from "../components/filters";
import {FILTERS} from "../utils/filters";
import {renderComponent} from "../utils/render";


export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._filterComponent = null;

    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
  }

  render() {
    const container = this._container;

    this._filterComponent = new FilterComponent(FILTERS);
    this._filterComponent.setFilterTypeChangeHandler(this._onFilterTypeChange);
    renderComponent(container, this._filterComponent);
  }

  _onFilterTypeChange(filterType) {
    this._pointsModel.setFilterType(filterType);
  }
}
