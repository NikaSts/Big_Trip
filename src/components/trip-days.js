import {createEventTemplate} from './event';

const createTripDaysTemplate = (tripDays) => {
  const days = tripDays.slice();

  return (
    `<ul class="trip-days">
  ${days.map((day, index) => {
      const {date, events} = day;
      const eventsToShow = events
          .sort((a, b) => a.startDate - b.startDate)
          .map((event) => createEventTemplate(event));

      return (
        `<li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">${index + 1}</span>
            <time class="day__date" datetime="2019-03-18">${date}</time>
          </div>

          <ul class="trip-events__list">
          ${eventsToShow}
          </ul>
        </li>`);
    })
    }
</ul>`
  );
};

export {createTripDaysTemplate};
