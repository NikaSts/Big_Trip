
export const Type = {
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

export const TypeGroup = {
  TRANSFER: `transfer`,
  ACTIVITY: `activity`,
};

export const pointGroupToType = {
  [TypeGroup.TRANSFER]: [Type.TAXI, Type.BUS, Type.TRAIN, Type.FLIGHT, Type.SHIP, Type.TRANSPORT, Type.DRIVE],
  [TypeGroup.ACTIVITY]: [Type.SIGHTSEEING, Type.CHECK_IN, Type.RESTAURANT],
};

export const State = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADD: `add`,
};

export const EmptyPoint = {
  id: String(Date.now() + Math.random()),
  type: `taxi`,
  offers: [],
  basePrice: 0,
  destination: {
    name: ``,
    description: ``,
    pictures: [],
  },
  startDate: Date.now(),
  endDate: Date.now(),
  isFavorite: false,
};

export const AUTHORIZATION = `Basic pf65Kle370!uswCX8m`;
export const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

export const HIDDEN_CLASS = `visually-hidden`;

export const FILTER_ID_PREFIX = `filter-`;
export const SORT_ID_PREFIX = `sort-`;

export const MenuControl = {
  TABLE: `Table`,
  STATS: `Stats`,
};
export const MENU_CONTROLS = [MenuControl.TABLE, MenuControl.STATS];

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const BAR_HEIGHT = 55;

export const iconMap = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'ship': `🚢`,
  'transport': `🚊`,
  'drive': `🚗`,
  'flight': `✈️`,
  'check-in': `🏨`,
  'sightseeing': `🏛️`,
  'restaurant': `🍽️`
};

export const SHAKE_ANIMATION_TIMEOUT = 600;

export const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};
