import {replaceComponent} from '../utils/render';
import PointComponent from '../components/point';
import EditPointComponent from '../components/edit-point';


const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};


export default class PointController {
  constructor(onDataChange, onViewChange) {
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._editPointComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point) {
    const oldPointComponent = this._pointComponent;
    const oldEditPointComponent = this._editPointComponent;

    this._pointComponent = new PointComponent(point);
    this._editPointComponent = new EditPointComponent(point);

    this._pointComponent.setEditButtonClickHandler(() => {
      this._openEditForm();
    });

    this._editPointComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._closeEditForm();
    });

    this._editPointComponent.setResetHandler(() => {
      this.setDefaultView();
    });

    this._editPointComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
    });

    if (oldPointComponent && oldEditPointComponent) {
      replaceComponent(oldPointComponent, this._pointComponent);
      replaceComponent(oldEditPointComponent, this._editPointComponent);
    }

    return this._pointComponent;
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._editPointComponent.reset();
      this._closeEditForm();
    }
  }

  _openEditForm() {
    this._onViewChange();
    replaceComponent(this._pointComponent, this._editPointComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.EDIT;
  }

  _closeEditForm() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    replaceComponent(this._editPointComponent, this._pointComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._closeEditForm();
    }
  }
}
