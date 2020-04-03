import {createMenuTemplate} from './components/menu';
import {createFiltersTemplate} from './components/filters';
import {createTripInfoTemplate} from './components/trip-info';
import {createTripCostTemplate} from './components/trip-cost';
import {createDayListTemplate} from './components/trip-days';
import {createDayTemplate} from './components/day';
import {createSortTemplate} from './components/sort';
import {createEditEventTemplate} from './components/edit-event';
import {createEventTypeTemplate} from './components/event-type';
import {createAvailableOfferTemplate} from './components/available-offer';
import {createEventTemplate} from './components/event';

const EVENT_COUNT = 3;

const renderComponent = (container, template, position = `beforeend`) => {
  return container.insertAdjacentHTML(position, template);
};

const tripDetails = document.querySelector(`.trip-main`);
renderComponent(tripDetails, createTripInfoTemplate(), `afterbegin`);

const tripInfo = document.querySelector(`.trip-info`);
renderComponent(tripInfo, createTripCostTemplate());

const tripControls = document.querySelector(`.trip-controls`);
const tripViewTitle = tripControls.querySelector(`h2`);
renderComponent(tripViewTitle, createMenuTemplate(), `afterend`);
renderComponent(tripControls, createFiltersTemplate());

const pageMain = document.querySelector(`.page-main`);
const tripEvents = pageMain.querySelector(`.trip-events`);
renderComponent(tripEvents, createSortTemplate());
renderComponent(tripEvents, createEditEventTemplate());

const eventTypeGroup = document.querySelector(`.event__type-group`);
renderComponent(eventTypeGroup, createEventTypeTemplate());
const availableOffers = document.querySelector(`.event__available-offers`);
renderComponent(availableOffers, createAvailableOfferTemplate());

renderComponent(tripEvents, createDayListTemplate());

const tripDays = tripEvents.querySelector(`.trip-days`);
renderComponent(tripDays, createDayTemplate());

const eventList = tripDays.querySelector(`.trip-events__list`);
for (let i = 0; i < EVENT_COUNT; i += 1) {
  renderComponent(eventList, createEventTemplate());
}
