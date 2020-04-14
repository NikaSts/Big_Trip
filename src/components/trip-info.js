const createTripInfoTemplate = (tripDays) => {
  const firstTripDate = tripDays[0].date;
  const lastTripDate = tripDays[tripDays.length - 1].date;
  const firstVisitedCity = tripDays[0].points[0].destination.name;
  const [lastTripDay] = tripDays.slice(-1);
  const [lastTripDayPoint] = lastTripDay.points.slice(-1);
  const lastVisitedCity = lastTripDayPoint.destination.name;

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${firstVisitedCity} &mdash; Chamonix &mdash; ${lastVisitedCity}</h1>

        <p class="trip-info__dates">${firstTripDate}&nbsp;&mdash;&nbsp;${lastTripDate}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
      </p>
    </section>`
  );
};

export {createTripInfoTemplate};
