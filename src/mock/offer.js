const LUCKY_NUMBER = 0.3;

const offers = [
  {
    events: [`taxi`],
    title: `Order Uber`,
    price: 20,
  }, {
    events: [`Bus`, `Train`, `Flight`],
    title: `Choose seats`,
    price: 5,
  }, {
    events: [`Bus`, `Train`, `Ship`, `Transport`, `Flight`, `Sightseeing`],
    title: `Book tickets`,
    price: 40,
  }, {
    events: [`Transport`, `Flight`],
    title: `Add luggage`,
    price: 30,
  }, {
    events: [`Train`, `Ship`, `Transport`, `Flight`],
    title: `Switch to comfort class`,
    price: 100,
  }, {
    events: [`Train`, `Ship`, `Transport`, `Flight`],
    title: `Add meal`,
    price: 15,
  }, {
    events: [`Transport`],
    title: `Travel by train`,
    price: 40,
  }, {
    events: [`Drive`],
    title: `Rent a car`,
    price: 200,
  }, {
    events: [`Check-in`],
    title: `Add breakfast`,
    price: 50,
  }, {
    events: [`Sightseeing`, `Restaurant`],
    title: `Lunch in city`,
    price: 30,
  }];

const getBoolean = () => {
  return Math.random() > LUCKY_NUMBER;
};

const generateOffers = () => {
  const availableOffers = [];

  offers.forEach((offer) => {
    if (getBoolean()) {
      availableOffers.push(offer);
    }
  });
  return availableOffers;
};

export {generateOffers};
