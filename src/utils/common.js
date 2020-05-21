import moment from "moment";


// DATE AND TIME
export const formatToISOString = (timestamp) => {
  const date = getDateOfString(timestamp);
  return date.toISOString();
};

export const getDateOfString = (date) => {
  return new Date(Number(date));
};

export const formatDate = (date) => {
  return moment(Number(date)).format(`MMM DD`);
};

export const formatTime = (time) => {
  return moment(time).format(`hh:mm`);
};

export const formatDateAndTime = (timestamp) => {
  return moment(timestamp).format(`DD/MM/YY HH:mm`);
};

export const convertStrDateToTimestamp = (StrDate) => {
  return moment(StrDate, `DD/MM/YY HH:mm`).valueOf();
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
const getDayPoints = (acc, point) => {
  const date = new Date(point.startDate).setHours(0, 0, 0, 0);

  if (!acc[date]) {
    acc[date] = [];
  }
  acc[date].push(point);
  return acc;
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
  const cb = (offerPriceSum, offer) => {
    if (offer.isChecked) {
      offerPriceSum += offer.price;
    }
    return offerPriceSum;
  };

  return point.basePrice + point.offers.reduce(cb, 0);
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getTypeById = (attributeValue, prefix) => {
  return attributeValue.substring(prefix.length);
};

export const getPointOffers = (offers, checkedOffers) => {
  const pointOffers = offers.filter((offer) => checkedOffers.includes(offer.title));
  pointOffers.forEach((offer) => delete offer.isChecked);
  return pointOffers;
};

