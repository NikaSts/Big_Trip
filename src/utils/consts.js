
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

export const SHOW_OFFERS = 3;

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

export const AUTHORIZATION = `Basic p1f65Kle370!uswCX8m`;
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

export const ChartVariables = {
  BAR_THICKNESS: 44,
  MIN_BAR_LENGTH: 50,
  AXES_Y_FONT_SIZE: 13,
  AXES_Y_PADDING: 5,
  LABELS_FONT_SIZE: 13,
  TITLE_FONT_SIZE: 23,
  LAYOUT_PADDING_LEFT: 50,
};

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

export const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

export const BORDER_STYLE = `2px solid red`;

export const ButtonText = {
  SAVE: `Save`,
  DELETE: `Delete`,
  SAVING: `Saving...`,
  DELETING: `Deleting...`,
};

export const ONE_ITEM = 1;

export const Code = {
  SUCCESS: 200,
  REDIRECT: 300,
};
