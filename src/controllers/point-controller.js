import {replaceComponent, removeComponent} from '../utils/render';
import {formatToISOString, getPointOffers} from '../utils/common';
import PointComponent from '../components/point';
import EditPointComponent from '../components/edit-point/edit-point';
import PointAdapter from '../models/points-adapter';


const State = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADD: `add`,
};

const EmptyPoint = {
  id: String(Date.now() + Math.random()),
  type: `taxi`,
  offers: [],
  basePrice: 0,
  destination: {
    name: ``,
    description: ``,
    pictures: [],
  },
  startDate: Date.now(),
  endDate: Date.now(),
  isFavorite: false,
};

const parseFormData = (id, formData, availableOffers, destinations) => {
  const pointType = formData.get(`event-type`);
  const cityName = formData.get(`event-destination`);
  const destinationData = destinations.find((destination) => destination.name === cityName);
  const checkedOffers = formData.getAll(`event-offer-1`);
  const offers = getPointOffers(availableOffers[pointType], checkedOffers);

  return new PointAdapter({
    id,
    "type": pointType,
    "startDate": formatToISOString(formData.get(`event-start-time`)),
    "endDate": formatToISOString(formData.get(`event-end-time`)),
    "base_price": formData.get(`event-price`),
    "is_favorite": formData.get(`event-favorite`),
    offers,
    "destination": destinationData,
  });
};


export default class PointController {
  constructor(onDataChange, onViewChange, pointsModel) {
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._pointsModel = pointsModel;

    this._availableOffers = pointsModel.getOffers();
    this._destinations = pointsModel.getDestinations();

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
      this._pointComponent = new PointComponent(this._point);
      this._editPointComponent = new EditPointComponent(this._point, this._state, this._pointsModel);
    }

    this._pointComponent.setEditButtonClickHandler(() => {
      this._openEditForm();
    });

    this._editPointComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._editPointComponent.getData();
      const data = parseFormData(this._point.id, formData, this._availableOffers, this._destinations);
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
      const newPoint = PointAdapter.clone(this._point);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._onDataChange(this, this._point, newPoint, this._state, true);
    });

    if (state === State.ADD) {
      document.addEventListener(`keydown`, this._onEscKeyDown);
      this._editPointComponent.applyFlatpickr();
      return this._editPointComponent;
    }
    return this._pointComponent;
  }

  destroy() {
    removeComponent(this._editPointComponent);
    removeComponent(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._editPointComponent.removeFlatpickr();
  }

  setDefaultView() {
    if (this._state !== State.DEFAULT) {
      if (this._state === State.ADD) {
        this._onDataChange(this, EmptyPoint, null, this._state);
      }
      this._editPointComponent.reset();
      this._closeEditForm();
    }
  }

  _openEditForm() {
    this._editPointComponent.applyFlatpickr();
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._onViewChange();
    replaceComponent(this._pointComponent, this._editPointComponent);
    this._state = State.EDIT;
  }

  _closeEditForm() {
    this._editPointComponent.removeFlatpickr();
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
