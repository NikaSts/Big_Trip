import SortComponent from '../components/sort';
import TripDaysComponent from '../components/trip-days';
import DayComponent from '../components/day';
import PointComponent from '../components/point';
import NoPointsComponent from '../components/no-points';
import EditPointComponent from '../components/edit-point';
import {renderComponent, replaceComponent} from '../utils/render';


const renderPoint = (container, point) => {
  const openEditForm = () => {
    replaceComponent(pointComponent, editPointComponent);
  };

  const closeEditForm = () => {
    replaceComponent(editPointComponent, pointComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closeEditForm();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const pointComponent = new PointComponent(point);
  pointComponent.setEditButtonClickHandler(() => {
    openEditForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const editPointComponent = new EditPointComponent(point);
  editPointComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    closeEditForm();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  renderComponent(container, pointComponent);
};

const renderDay = (container, day, index) => {
  const tripDay = new DayComponent(day, index);
  const pointsList = tripDay.getElement().querySelector(`.trip-events__list`);
  day.points.sort((a, b) => a.startDate - b.startDate)
    .forEach((point) => renderPoint(pointsList, point));
  renderComponent(container, tripDay);
};


export default class TripContainerController {
  constructor(container) {
    this._container = container;

    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();
  }

  render(days) {
    if (days.length === 0) {
      renderComponent(this._container, this._noPointsComponent);
      return;
    }

    renderComponent(this._container, this._sortComponent);

    days.sort((a, b) => a.date - b.date)
    .forEach((day, index) => renderDay(this._tripDaysComponent.getElement(), day, index));
    renderComponent(this._container, this._tripDaysComponent);
  }
}
