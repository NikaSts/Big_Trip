const CACHE_PREFIX = `bigtrip-cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;
const CODE_SUCCESS = 200;
const BASIC_TYPE = `basic`;
const APP_DATA = [
  `/`,
  `/index.html`,
  `/bundle.js`,
  `/css/style.css`,
  `/img/icons/bus.png`,
  `/img/icons/check-in.png`,
  `/img/icons/drive.png`,
  `/img/icons/flight.png`,
  `/img/icons/restaurant.png`,
  `/img/icons/ship.png`,
  `/img/icons/sightseeing.png`,
  `/img/icons/taxi.png`,
  `/img/icons/train.png`,
  `/img/icons/transport.png`,
  `/img/header-bg.png`,
  `/img/header-bg@2x.png`,
  `/img/logo.png`
];

const isValid = (response) => {
  return response && response.status === CODE_SUCCESS && response.type === BASIC_TYPE;
};

const cacheResponse = (response, request) => {
  const clonedResponse = response.clone();
  caches.open(CACHE_NAME)
        .then((cache) => cache.put(request, clonedResponse));
  return response;
};


const onServiceWorkerInstall = (evt) => {
  evt.waitUntil(caches
    .open(CACHE_NAME)
    .then((cache) => cache.addAll(APP_DATA))
  );
};

const onServiceWorkerActivate = (evt) => {
  evt.waitUntil(caches
    .keys()
    .then((keys) => Promise.all(keys
                .map((key) => (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) ? caches.delete(key) : null)
                .filter((key) => key !== null))
    )
  );
};

const onServiceWorkerFetch = (evt) => {
  const {request} = evt;
  evt.respondWith(
      caches.match(request)
      .then((cachedResponse) => cachedResponse ? cachedResponse : fetch(request))
      .then((response) => isValid(response) ? cacheResponse(response, request) : response)
  );
};

self.addEventListener(`install`, onServiceWorkerInstall);
self.addEventListener(`activate`, onServiceWorkerActivate);
self.addEventListener(`fetch`, onServiceWorkerFetch);
