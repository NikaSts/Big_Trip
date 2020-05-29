import moment from "moment";


// DATE AND TIME
export const formatToISOString = (timestamp) => {
  const date = new Date(Number(timestamp));
  return date.toISOString();
};

export const formatDate = (date) => {
  return moment(Number(date)).format(`MMM DD`);
};

export const formatTime = (time) => {
  return moment(time).format(`HH:mm`);
};


// DURATION
export const getDuration = (start, end) => {
  return end - start;
};

export const getFormattedDuration = (start, end) => {
  const duration = getDuration(start, end);
  const minutes = moment.duration(duration).minutes();
  const hours = moment.duration(duration).hours();
  const days = moment.duration(duration).days();
  if (days) {
    return `${days}D ${hours}H ${minutes}M`;
  }
  if (hours) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};

export const getDurationInHours = (duration) => {
  const hours = moment.duration(duration).asHours();
  return Math.round(hours);
};


// OTHER
const getDayPoints = (trip, point) => {
  const date = new Date(point.startDate).setHours(0, 0, 0, 0);

  if (!trip[date]) {
    trip[date] = [];
  }
  trip[date].push(point);
  return trip;
};

export const getTripDays = (points) => {
  const groups = points.reduce(getDayPoints, {});

  return Object.keys(groups).map((date) => {
    return {
      date,
      points: groups[date],
    };
  });
};

export const getPointPrice = (point) => {
  return point.basePrice + point.offers.reduce((offerPriceSum, offer) => {
    if (offer) {
      offerPriceSum += offer.price;
    }
    return offerPriceSum;
  }, 0);
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getTypeById = (attributeValue, prefix) => {
  return attributeValue.substring(prefix.length);
};

export const getPointOffers = (offers, checkedOffers) => {
  const pointOffers = offers.filter((offer) => checkedOffers.includes(offer.title));
  return pointOffers;
};

export const isChecked = (offer, checkedOffers) => {
  return checkedOffers.some((checkedOffer) => offer.title === checkedOffer.title);
};

export const parseOffers = (offers) => {
  return offers.reduce((parsedOffers, originalOffer) => {
    parsedOffers[originalOffer.type] = originalOffer.offers;
    return parsedOffers;
  }, {});
};

export const getSyncedPoints = (points) => {
  return points.filter(({success}) => success)
      .map(({payload}) => payload.point);
};

export const createStoreStructure = (items) => {
  return items.reduce((storeStructure, item) => {
    return Object.assign({}, storeStructure, {
      [item.id]: item,
    });
  }, {});
};

export const isOnline = () => {
  return window.navigator.onLine;
};
