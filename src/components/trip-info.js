const createTripInfoTemplate = (tripDays) => {
  const firstTripDay = tripDays[0].date;
  const lastTripDay = tripDays[tripDays.length - 1].date;
  const firstVisitedCity = tripDays[0].events[0].destination.name;
  // const lastVisitedCity = tripDays[tripDays.length - 1].events[events.length - 1].destination.name; // ПОЧЕМУ НЕ РАБОТАЕТ???
  const lastVisitedCity = tripDays[tripDays.length - 1].events[0].destination.name;

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${firstVisitedCity} &mdash; Chamonix &mdash; ${lastVisitedCity}</h1>

        <p class="trip-info__dates">${firstTripDay}&nbsp;&mdash;&nbsp;${lastTripDay}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
      </p>
    </section>`
  );
};

export {createTripInfoTemplate};
