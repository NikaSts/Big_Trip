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

const POINT_TYPES = [Type.TAXI, Type.BUS, Type.TRAIN, Type.FLIGHT, Type.SHIP, Type.TRANSPORT, Type.DRIVE, Type.SIGHTSEEING, Type.CHECK_IN, Type.RESTAURANT];

const Offer = {
  LUGGAGE: {
    id: `luggage`,
    title: `Add luggage`
  },
  COMFORT: {
    id: `comfort`,
    title: `Switch to comfort class`
  },
  MEAL: {
    id: `meal`,
    title: `Add meal`,
  },
  SEATS: {
    id: `seats`,
    title: `Choose seats`,
  },
  TRAIN: {
    id: `train`,
    title: `Travel by train`,
  },
  UBER: {
    id: `uber`,
    title: `Order Uber`,
  },
  LUNCH: {
    id: `lunch`,
    title: `Lunch in city`,
  },
  CAR: {
    id: `car`,
    title: `Rent a car`,
  },
  TICKETS: {
    id: `tickets`,
    title: `Book tickets`,
  },
  BREAKFAST: {
    id: `breakfast`,
    title: `Add breakfast`,
  }
};

const pointTypeToOffers = {
  [Type.TAXI]: [Offer.UBER],
  [Type.BUS]: [Offer.SEATS, Offer.TICKETS],
  [Type.TRAIN]: [Offer.SEATS, Offer.TICKETS, Offer.COMFORT],
  [Type.FLIGHT]: [Offer.SEATS, Offer.TICKETS, Offer.COMFORT, Offer.LUGGAGE, Offer.MEAL],
  [Type.SHIP]: [Offer.TICKETS, Offer.COMFORT],
  [Type.TRANSPORT]: [Offer.SEATS, Offer.TICKETS, Offer.COMFORT, Offer.LUGGAGE, Offer.MEAL, Offer.TRAIN],
  [Type.DRIVE]: [Offer.CAR],
  [Type.SIGHTSEEING]: [Offer.TICKETS, Offer.LUNCH],
  [Type.CHECK_IN]: [Offer.BREAKFAST],
  [Type.RESTAURANT]: [Offer.LUNCH],
};

const TypeGroup = {
  TRANSFER: `transfer`,
  ACTIVITY: `activity`,
};

const pointGroupToType = {
  [TypeGroup.TRANSFER]: [Type.TAXI, Type.BUS, Type.TRAIN, Type.FLIGHT, Type.SHIP, Type.TRANSPORT, Type.DRIVE],
  [TypeGroup.ACTIVITY]: [Type.SIGHTSEEING, Type.CHECK_IN, Type.RESTAURANT],
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
      id: offer.id,
      title: offer.title,
      price: getRandomPrice(),
      isChecked: getRandomBoolean(),
    };
  });
};

const generatePoint = () => {
  const type = getRandomItem(POINT_TYPES);
  const startDate = getRandomDate(MIN_DAY_COUNT, MAX_DAY_COUNT) + getRandomNumber(MIN_DURATION, MAX_DURATION);
  const duration = getRandomNumber(MIN_DURATION, MAX_DURATION);
  const endDate = startDate + duration;

  return ({
    type,
    startDate,
    endDate,
    basePrice: getRandomNumber(MIN_PRICE, MAX_PRICE) + `0`,
    offers: getRandomBoolean() ? generateOffers(type) : [],
    destination: destinations[getRandomNumber(0, CITY_NAMES.length)],
  });
};

const generatePoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generatePoint);
};

export {TypeGroup, pointGroupToType, generatePoints, CITY_NAMES};
