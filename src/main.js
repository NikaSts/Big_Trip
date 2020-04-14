import {createMenuTemplate} from './components/menu';
import {createFiltersTemplate} from './components/filters';
import {createTripInfoTemplate} from './components/trip-info';
import {createTripDaysTemplate} from './components/trip-days';
import {createSortTemplate} from './components/sort';
import {createEditEventTemplate} from './components/edit-event';
import {generateEvents} from './mock/event';


const MONTH_NAMES = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`];
const EVENT_COUNT = 20;

const events = generateEvents(EVENT_COUNT);
const editEventPoint = events.shift();

const renderComponent = (container, template, position = `beforeend`) => {
  return container.insertAdjacentHTML(position, template);
};

//  DEFAULT SORTING BY DAY ///
const getDayEvents = (acc, event) => {
  const day = (new Date(event.startDate).getDate());
  const month = (new Date(event.startDate).getMonth());
  const date = `${MONTH_NAMES[month]} ${day}`;
  if (!acc[date]) {
    acc[date] = [];
  }
  acc[date].push(event);
  return acc;
};

const groups = events.reduce(getDayEvents, {});

const tripDays = Object.keys(groups)
  .map((date) => {
    return {
      date,
      events: groups[date],
    };
  })
  .sort((a, b) => a.events[0].startDate - b.events[0].startDate);


// HEADER TEMPLATE///
const tripDetails = document.querySelector(`.trip-main`);
renderComponent(tripDetails, createTripInfoTemplate(tripDays), `afterbegin`);
const tripControls = document.querySelector(`.trip-controls`);
const tripViewTitle = tripControls.querySelector(`h2`);
renderComponent(tripViewTitle, createMenuTemplate(), `afterend`);
renderComponent(tripControls, createFiltersTemplate());


// SORTING TEMPLATE ///
const pageMain = document.querySelector(`.page-main`);
const tripEvents = pageMain.querySelector(`.trip-events`);
renderComponent(tripEvents, createSortTemplate());

// EDIT-EVENT TEMPLATE ///
renderComponent(tripEvents, createEditEventTemplate(editEventPoint));

// EVENTS LIST TEMPLATE ///
renderComponent(tripEvents, createTripDaysTemplate(tripDays));
