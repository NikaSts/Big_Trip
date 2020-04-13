import {getRandomNumber, getRandomItem} from '../utils';
import {generateOffers} from './offer';

const EVENT_TYPES = [{
  id: `transfer`,
  name: `Taxi`,
}, {
  id: `transfer`,
  name: `Bus`,
}, {
  id: `transfer`,
  name: `Train`,
}, {
  id: `transfer`,
  name: `Ship`,
}, {
  id: `transfer`,
  name: `Transport`,
}, {
  id: `transfer`,
  name: `Drive`,
}, {
  id: `transfer`,
  name: `Flight`,
}, {
  id: `activity`,
  name: `Check-in`,
}, {
  id: `activity`,
  name: `Sightseeing`,
}, {
  id: `activity`,
  name: `Restaurant`,
}];

const CITY_NAMES = [`Rome`, `Amsterdam`, `Paris`, `Geneva`, `Moscow`, `Chamonix`];
const FULL_DAY = 24 * 60 * 60 * 1000; // 24 hours
const MIN_DAY_COUNT = 1;
const MAX_DAY_COUNT = 6;
const MIN_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_DURATION = 23 * 60 * 60 * 1000; // 23 hours
const MIN_PRICE = 10;
const MAX_PRICE = 50;
const DESCRIPTION_TEXTS = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus.`];


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

const generateEvent = () => {
  const startDate = getRandomDate(MIN_DAY_COUNT, MAX_DAY_COUNT) + getRandomNumber(MIN_DURATION, MAX_DURATION);
  const duration = getRandomNumber(MIN_DURATION, MAX_DURATION);
  const endDate = startDate + duration;

  return ({
    type: getRandomItem(EVENT_TYPES),
    startDate,
    endDate,
    duration,
    basePrice: getRandomNumber(MIN_PRICE, MAX_PRICE) + `0`,
    offers: generateOffers(),
    destination: {
      name: getRandomItem(CITY_NAMES),
      description: getDescriptionText(),
      photos: getPhotos(),
    },
  });
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {EVENT_TYPES, generateEvents};
