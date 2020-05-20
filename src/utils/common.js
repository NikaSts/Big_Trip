import moment from "moment";


// DATE AND TIME
const formatToISOString = (timestamp) => {
  const date = getDateOfString(timestamp);
  return date.toISOString();
};

const getDateOfString = (date) => {
  return new Date(Number(date));
};

const formatDate = (date) => {
  return moment(Number(date)).format(`MMM DD`);
};

const formatTime = (time) => {
  return moment(time).format(`hh:mm`);
};

const formatDateAndTime = (timestamp) => {
  return moment(timestamp).format(`DD/MM/YY HH:mm`);
};

const convertStrDateToTimestamp = (StrDate) => {
  return moment(StrDate, `DD/MM/YY HH:mm`).valueOf();
};


// DURATION
const getDuration = (start, end) => {
  return end - start;
};

const getFormattedDuration = (start, end) => {
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

const getDurationInHours = (duration) => {
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

const getTripDays = (points) => {
  const groups = points.reduce(getDayPoints, {});

  return Object.keys(groups).map((date) => {
    return {
      date,
      points: groups[date],
    };
  });
};

const getPointPrice = (point) => {
  const cb = (offerPriceSum, offer) => {
    if (offer.isChecked) {
      offerPriceSum += offer.price;
    }
    return offerPriceSum;
  };

  return point.basePrice + point.offers.reduce(cb, 0);
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getTypeById = (attributeValue, prefix) => {
  return attributeValue.substring(prefix.length);
};


export {formatToISOString, getDateOfString, formatDate, formatTime, formatDateAndTime, convertStrDateToTimestamp, getDuration, getFormattedDuration, getDurationInHours, getTripDays, getPointPrice, capitalizeFirstLetter, getTypeById};
