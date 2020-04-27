import {replaceComponent} from '../utils/render';
import PointComponent from '../components/point';
import EditPointComponent from '../components/edit-point';


/* Для этого создадим PointController:

    В нем нужно описать конструктор и метод render

    Конструктор должен принимать container — элемент, в который контроллер будет всё отрисовывать.

    Метод render должен принимать данные одной точки маршрута. Также в него должен переехать код, который отвечает за отрисовку точки маршрута, ее замену на форму редактирования и наоборот, а также установка связанных с этим обработчиков событий. */

export default class PointController {
  constructor(container) {
    this._container = container;

  }
  render(point) {

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
    return pointComponent;

  }
}
