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

const offer = {
  luggage: {
    id: `luggage`,
    title: `Add luggage`
  },
  comfort: {
    id: `comfort`,
    title: `Switch to comfort class`
  },
  meal: {
    id: `meal`,
    title: `Add meal`,
  },
  seats: {
    id: `seats`,
    title: `Choose seats`,
  },
  train: {
    id: `train`,
    title: `Travel by train`,
  },
  uber: {
    id: `uber`,
    title: `Order Uber`,
  },
  lunch: {
    id: `lunch`,
    title: `Lunch in city`,
  },
  car: {
    id: `car`,
    title: `Rent a car`,
  },
  tickets: {
    id: `tickets`,
    title: `Book tickets`,
  },
  breakfast: {
    id: `breakfast`,
    title: `Add breakfast`,
  }
};

const pointTypeToOffers = {
  [Type.TAXI]: [offer.uber],
  [Type.BUS]: [offer.seats, offer.tickets],
  [Type.TRAIN]: [offer.seats, offer.tickets, offer.comfort],
  [Type.FLIGHT]: [offer.seats, offer.tickets, offer.comfort, offer.luggage, offer.meal],
  [Type.SHIP]: [offer.tickets, offer.comfort],
  [Type.TRANSPORT]: [offer.seats, offer.tickets, offer.comfort, offer.luggage, offer.meal, offer.train],
  [Type.DRIVE]: [offer.car],
  [Type.SIGHTSEEING]: [offer.tickets, offer.lunch],
  [Type.CHECK_IN]: [offer.breakfast],
  [Type.RESTAURANT]: [offer.lunch],
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
  return availableOffers.map((availableOffer) => {
    return {
      id: availableOffer.id,
      title: availableOffer.title,
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
