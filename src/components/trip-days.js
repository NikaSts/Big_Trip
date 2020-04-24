import AbstractComponent from './abstract-component';
import {renderComponent} from '../utils/render';


const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days">
    </ul>`
  );
};

export default class TripDaysComponent extends AbstractComponent {
  getTemplate() {
    return createTripDaysTemplate();
  }
  addDay(day) {
    renderComponent(this.getElement(), day);
  }
}
