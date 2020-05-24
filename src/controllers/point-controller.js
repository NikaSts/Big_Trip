import {replaceComponent, removeComponent} from '../utils/render';
import {getPointOffers} from '../utils/funcs';
import PointComponent from '../components/point';
import EditPointComponent from '../components/edit-point/edit-point';
import PointsAdapterOut from '../models/points-adapter-out';
import {State, EmptyPoint, BORDER_STYLE, ButtonText} from '../utils/consts';


const parseFormData = (id, formData, availableOffers, destinations) => {
  const pointType = formData.get(`event-type`);
  const cityName = formData.get(`event-destination`);
  const destinationData = destinations.find((destination) => destination.name === cityName);
  const checkedOffers = formData.getAll(`event-offer-1`);
  const offers = getPointOffers(availableOffers[pointType], checkedOffers);

  return new PointsAdapterOut({
    id,
    "type": pointType,
    "startDate": formData.get(`event-start-time`),
    "endDate": formData.get(`event-end-time`),
    "basePrice": formData.get(`event-price`),
    "isFavorite": formData.get(`event-favorite`),
    offers,
    "destination": destinationData,
  });
};


export default class PointController {
  constructor(onDataChange, onViewChange, pointsModel, api) {
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._pointsModel = pointsModel;
    this._api = api;

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
      this._changeButtonText(ButtonText.SAVING);
      this._onDataChange(this, this._point, data, this._state);
    });

    this._editPointComponent.setCloseHandler(() => {
      this.setDefaultView();
    });

    this._editPointComponent.setDeleteHandler((evt) => {
      evt.preventDefault();
      this._changeButtonText(ButtonText.SAVE, ButtonText.DELETING);
      this._onDataChange(this, this._point, null, this._state);
    });

    this._editPointComponent.setFavoriteButtonClickHandler(() => {
      const newPoint = PointsAdapterOut.clone(this._point);
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

  setFormDisabled() {
    this._editPointComponent.getElement().querySelectorAll(`form input, form fieldset, form button`)
      .forEach((element) => element.setAttribute(`disabled`, `disabled`));
  }

  clearFormDisabled() {
    this._editPointComponent.getElement().querySelectorAll(`form input, form fieldset, form button`)
      .forEach((element) => element.removeAttribute(`disabled`));
  }

  showLoadError() {
    const editForm = this._editPointComponent.getElement();
    const onAnimationEnd = () => {
      editForm.removeEventListener(`animationend`, onAnimationEnd);
      editForm.classList.remove(`shake`);
      this._changeButtonText();
    };

    editForm.classList.add(`shake`);
    editForm.style.border = BORDER_STYLE;
    editForm.addEventListener(`animationend`, onAnimationEnd);
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
    replaceComponent(this._editPointComponent, this._pointComponent);
    this._state = State.DEFAULT;
  }

  _changeButtonText(saveButtonText = ButtonText.SAVE, deleteButtonText = ButtonText.DELETE) {
    this._editPointComponent.setData({
      saveButtonText,
      deleteButtonText,
    });
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
