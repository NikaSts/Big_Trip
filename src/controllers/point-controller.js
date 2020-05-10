import {replaceComponent, removeComponent} from '../utils/render';
import PointComponent from '../components/point';
import EditPointComponent from '../components/edit-point';


const State = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADD: `add`,
};

const EmptyPoint = {
  type: `taxi`,
  offers: [],
  basePrice: 0,
  destination: {
    name: ``,
    description: ``,
    photos: [],
  },
  startDate: Date.now(),
  endDate: Date.now(),
  isFavorite: false,
  // isNew: true,
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
    this._state = state;

    if (!oldPointComponent &&
      !oldEditPointComponent) {
      this._pointComponent = new PointComponent(point);
      this._editPointComponent = new EditPointComponent(point, this._state);
    }

    this._pointComponent.setEditButtonClickHandler(() => {
      this.openEditForm();
    });

    this._editPointComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._editPointComponent.getData();
      this._onDataChange(this, point, data);
    });

    this._editPointComponent.setCloseHandler(() => {
      this.setDefaultView();
    });

    this._editPointComponent.setDeleteHandler(() => {
      this._onDataChange(this, point, null);
    });

    this._editPointComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
    });
    document.addEventListener(`keydown`, this._onEscKeyDown);

    if (state === State.ADD) {
      return this._editPointComponent;
    }
    return this._pointComponent;
  }

  setDefaultView() {
    if (this._state !== State.DEFAULT) {
      this._closeEditForm();
    }
  }

  destroy() {
    removeComponent(this._editPointComponent);
    removeComponent(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  openEditForm() {
    this._onViewChange();
    replaceComponent(this._pointComponent, this._editPointComponent);
    this._state = State.EDIT;
  }

  _closeEditForm() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._editPointComponent.reset();
    if (document.contains(this._editPointComponent.getElement())) {
      replaceComponent(this._editPointComponent, this._pointComponent);
    }
    this._state = State.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      if (this._state === State.ADD) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this.setDefaultView();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}

export {State, EmptyPoint};
