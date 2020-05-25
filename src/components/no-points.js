import AbstractComponent from './abstract';


const createNoPointsTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class NoPointsComponent extends AbstractComponent {
  getTemplate() {
    return createNoPointsTemplate();
  }
}
