import {getRandomNumber, getRandomItem, getRandomBoolean} from '../utils';

const CITY_NAMES = [`Rome`, `Amsterdam`, `Paris`, `Geneva`, `Moscow`, `Chamonix`];
const FULL_DAY = 24 * 60 * 60 * 1000; // 24 hours
const MIN_DAY_COUNT = -3;
const MAX_DAY_COUNT = 4;
const MIN_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_DURATION = 23 * 60 * 60 * 1000; // 23 hours
const MIN_PRICE = 10;
const MAX_PRICE = 50;
const DESCRIPTION_TEXTS = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus.`];

const Type = {
  TAXI: `taxi`,
  BUS: `bus`,
  TRAIN: `train`,
  FLIGHT: `flight`,
  SHIP: `ship`,
  TRANSPORT: `transport`,
  DRIVE: `drive`,
  SIGHTSEEING: `sightseeing`,
  CHECK_IN: `check-in`,
  RESTAURANT: `restaurant`,
};

const EVENT_TYPES = [Type.TAXI, Type.BUS, Type.TRAIN, Type.FLIGHT, Type.SHIP, Type.TRANSPORT, Type.DRIVE, Type.SIGHTSEEING, Type.CHECK_IN, Type.RESTAURANT];

const pointTypeToOffers = {
  [Type.TAXI]: [`Order Uber`],
  [Type.BUS]: [`Choose seats`, `Book tickets`],
  [Type.TRAIN]: [`Choose seats`, `Book tickets`, `Switch to comfort class`],
  [Type.FLIGHT]: [`Choose seats`, `Book tickets`, `Switch to comfort class`, `Add luggage`, `Add meal`],
  [Type.SHIP]: [`Book tickets`, `Switch to comfort class`],
  [Type.TRANSPORT]: [`Choose seats`, `Book tickets`, `Switch to comfort class`, `Add luggage`, `Add meal`, `Travel by train`],
  [Type.DRIVE]: [`Rent a car`],
  [Type.SIGHTSEEING]: [`Book tickets`, `Lunch in city`],
  [Type.CHECK_IN]: [`Add breakfast`],
  [Type.RESTAURANT]: [`Lunch in city`],
};

const eventGroupToType = {
  'transfer': [Type.TAXI, Type.BUS, Type.TRAIN, Type.FLIGHT, Type.SHIP, Type.TRANSPORT, Type.DRIVE],
  'activity': [Type.SIGHTSEEING, Type.CHECK_IN, Type.RESTAURANT],
};

const getRandomDate = (from, to) => {
  return Date.now() + (getRandomNumber(from, to) * FULL_DAY);
};

const getDescriptionText = () => {
  const texts = [];
  const count = getRandomNumber(1, 6);
  for (let i = 0; i < count; i++) {
    texts.push(getRandomItem(DESCRIPTION_TEXTS));
  }
  return texts.join(` `);
};

const getPhotos = () => {
  const photos = [];
  const count = getRandomNumber(2, 8);
  for (let i = 0; i < count; i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.floor(Math.random() * 100)}`);
  }
  return photos;
};

const getDestinationInfo = () => CITY_NAMES.map((city) => {
  return {
    name: city,
    description: getDescriptionText(),
    photos: getPhotos(),
  };
});

const destinations = getDestinationInfo();

const getRandomPrice = () => {
  const randomNumber = getRandomNumber(5, 200);
  return randomNumber - (randomNumber % 5);
};

const generateOffers = (type) => {
  const availableOffers = pointTypeToOffers[type];

  return availableOffers.map((offer) => {
    return {
      title: offer,
      price: getRandomPrice(),
      isChecked: getRandomBoolean(),
    };
  });
};

const generateEvent = () => {
  const type = getRandomItem(EVENT_TYPES);
  const startDate = getRandomDate(MIN_DAY_COUNT, MAX_DAY_COUNT) + getRandomNumber(MIN_DURATION, MAX_DURATION);
  const duration = getRandomNumber(MIN_DURATION, MAX_DURATION);
  const endDate = startDate + duration;

  return ({
    type,
    startDate,
    endDate,
    basePrice: getRandomNumber(MIN_PRICE, MAX_PRICE) + `0`,
    offers: getRandomBoolean() ? generateOffers(type) : null,
    destination: destinations[getRandomNumber(0, CITY_NAMES.length)],
  });
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {eventGroupToType, EVENT_TYPES, generateEvents};
