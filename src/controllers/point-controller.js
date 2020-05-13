import {replaceComponent, removeComponent} from '../utils/render';
import PointComponent from '../components/point';
import EditPointComponent from '../components/edit-point/edit-point';
import {availableOffers} from '../mock/points-mock';


const State = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADD: `add`,
};

const EmptyPoint = {
  id: String(Date.now() + Math.random()),
  type: `taxi`,
  offers: availableOffers[`taxi`],
  basePrice: 0,
  destination: {
    name: ``,
    description: ``,
    photos: [],
  },
  startDate: Date.now(),
  endDate: Date.now(),
  isFavorite: false,
};

export default class PointController {
  constructor(onDataChange, onViewChange) {
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._state = State.DEFAULT;
    this._pointComponent = null;
    this._editPointComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, state) {
    const oldPointComponent = this._pointComponent;
    const oldEditPointComponent = this._editPointComponent;
    this._point = point;
    this._state = state;

    if (!oldPointComponent &&
      !oldEditPointComponent) {
      this._pointComponent = new PointComponent(this._point, this._state);
      this._editPointComponent = new EditPointComponent(this._point);
    }

    this._pointComponent.setEditButtonClickHandler(() => {
      this.openEditForm();
    });

    this._editPointComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._editPointComponent.getData();
      this._onDataChange(this, this._point, data, this._state);
      this.setDefaultView();
    });

    this._editPointComponent.setCloseHandler(() => {
      this.setDefaultView();
    });

    this._editPointComponent.setDeleteHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._point, null, this._state);
    });

    this._editPointComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, this._point, Object.assign({}, this._point, {
        isFavorite: !point.isFavorite,
      }), this._state, true);
    });

    if (state === State.ADD) {
      document.addEventListener(`keydown`, this._onEscKeyDown);
      return this._editPointComponent;
    }
    return this._pointComponent;
  }

  setDefaultView() {
    if (this._state !== State.DEFAULT) {
      if (this._state === State.ADD) {
        this._onDataChange(this, this._point, null, this._state);
      }
      this._editPointComponent.reset();
      this._closeEditForm();
    }
  }

  destroy() {
    removeComponent(this._editPointComponent);
    removeComponent(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  openEditForm() {
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._onViewChange();
    replaceComponent(this._pointComponent, this._editPointComponent);
    this._state = State.EDIT;
  }

  _closeEditForm() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._editPointComponent.reset();
    replaceComponent(this._editPointComponent, this._pointComponent);
    this._state = State.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      if (this._state === State.ADD) {
        this._onDataChange(this, EmptyPoint, null, this._state);
      }
      this.setDefaultView();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}

export {State, EmptyPoint};
