import {replaceComponent} from '../utils/render';
import PointComponent from '../components/point';
import EditPointComponent from '../components/edit-point';


export default class PointController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._pointComponent = null;
    this._editPointComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }
  render(point) {
    this._pointComponent = new PointComponent(point);
    this._editPointComponent = new EditPointComponent(point);

    this._editPointComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }), this);

    });

    this._pointComponent.setEditButtonClickHandler(() => {
      this._openEditForm();
    });

    this._editPointComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._closeEditForm();
    });

    return this._pointComponent;
  }

  _openEditForm() {
    replaceComponent(this._pointComponent, this._editPointComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _closeEditForm() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    replaceComponent(this._editPointComponent, this._pointComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._closeEditForm();
    }
  }

}
