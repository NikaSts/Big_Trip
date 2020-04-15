import {createPointTemplate} from './point';
import {getFormattedDate} from '../utils';


const createTripDaysTemplate = (tripDays) => {
  return (
    `<ul class="trip-days">
  ${tripDays
      .map((tripDay, index) => {
        const {date, points} = tripDay;
        const tripDate = getFormattedDate(date);
        const day = tripDate.day;
        const month = tripDate.month;
        const monthName = tripDate.monthName;
        const year = tripDate.fullYear;
        const pointsToShow = points
          .sort((a, b) => a.startDate - b.startDate)
          .map((point) => createPointTemplate(point)).join(` `);

        return (
          `<li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">${index + 1}</span>
            <time class="day__date" datetime="${year}-${month}-${day}">${monthName} ${day}</time>
          </div>

          <ul class="trip-events__list">
          ${pointsToShow}
          </ul>
        </li>`);
      }).join(` `)
    }
</ul>`
  );
};

export {createTripDaysTemplate};
