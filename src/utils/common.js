const MONTH_NAMES = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`];

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomItem = (items) => {
  return items[getRandomNumber(0, items.length)];
};

const getRandomBoolean = (number) => {
  return Math.random() > number;
};

const getPadded = (dateTime) => {
  return dateTime.toString().padStart(2, `0`);
};

const getMonthName = (date) => MONTH_NAMES[date.getMonth()];

const getDuration = (start, end) => {
  return end - start;
};

const getFormattedDate = (date) => {
  const newDate = new Date(Number(date));
  return ({
    day: getPadded(newDate.getDate()),
    month: getPadded(newDate.getMonth() + 1),
    monthName: getMonthName(newDate),
    year: newDate.getFullYear().toString().slice(2),
    fullYear: newDate.getFullYear(),
    hours: getPadded(newDate.getHours()),
    minutes: getPadded(newDate.getMinutes()),
  });
};

const getFormattedDuration = (duration) => {
  const minutes = duration / 1000 / 60;
  if (minutes >= 60) {
    const hours = parseInt(minutes / 60, 10);
    const minutesLeft = minutes - (hours * 60);
    if (minutesLeft === 0) {
      return `${hours}H`;
    }
    return `${hours}H ${getPadded(Math.round(minutesLeft))}M`;
  }
  return `${getPadded(Math.round(minutes))}M`;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

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


export {getRandomNumber, getRandomItem, getRandomBoolean, getFormattedDate, getDuration, getFormattedDuration, capitalizeFirstLetter, getTripDays, getPointPrice};
