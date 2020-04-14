const LUCKY_NUMBER = 0.5;

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomItem = (items) => {
  return items[getRandomNumber(0, items.length)];
};

const getRandomBoolean = () => {
  return Math.random() > LUCKY_NUMBER;
};

const getPadded = (dateTime) => {
  return dateTime.toString().padStart(2, `0`);
};

const getFormattedDate = (date) => {
  const newDate = new Date(date);
  return ({
    day: getPadded(newDate.getDate()),
    month: getPadded(newDate.getMonth() + 1),
    year: newDate.getFullYear().toString().slice(2),
    hours: getPadded(newDate.getHours()),
    minutes: getPadded(newDate.getMinutes()),
  });
};

const getDuration = (diff) => {
  const minutes = diff / 1000 / 60;
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


export {getRandomNumber, getRandomItem, getRandomBoolean, getFormattedDate, getDuration, capitalizeFirstLetter};
