import {createMenuTemplate} from './components/menu';
import {createFiltersTemplate} from './components/filters';
import {createTripInfoTemplate} from './components/trip-info';
import {createTripDaysTemplate} from './components/trip-days';
import {createSortTemplate} from './components/sort';
import {createEditPointTemplate} from './components/edit-point';
import {generatePoints} from './mock/point';


const POINT_COUNT = 20;

const points = generatePoints(POINT_COUNT);
const editPoint = points.shift();

const renderComponent = (container, template, position = `beforeend`) => {
  return container.insertAdjacentHTML(position, template);
};

//  DEFAULT SORTING BY DAY ///
const getDayPoints = (acc, point) => {
  const date = new Date(point.startDate).setHours(0, 0, 0, 0);

  if (!acc[date]) {
    acc[date] = [];
  }
  acc[date].push(point);
  return acc;
};

const groups = points.reduce(getDayPoints, {});

const tripDays = Object.keys(groups)
  .map((date) => {
    return {
      date,
      points: groups[date],
    };
  })
  .sort((a, b) => a.points[0].startDate - b.points[0].startDate);


// HEADER TEMPLATE///
const tripDetails = document.querySelector(`.trip-main`);
renderComponent(tripDetails, createTripInfoTemplate(tripDays), `afterbegin`);
const tripControls = document.querySelector(`.trip-controls`);
const tripViewTitle = tripControls.querySelector(`h2`);
renderComponent(tripViewTitle, createMenuTemplate(), `afterend`);
renderComponent(tripControls, createFiltersTemplate());


// SORTING TEMPLATE ///
const pageMain = document.querySelector(`.page-main`);
const tripPoints = pageMain.querySelector(`.trip-events`);
renderComponent(tripPoints, createSortTemplate());

// EDIT-POINT TEMPLATE ///
renderComponent(tripPoints, createEditPointTemplate(editPoint));

// POINTS LIST TEMPLATE ///
renderComponent(tripPoints, createTripDaysTemplate(tripDays));
