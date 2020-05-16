import AbstractComponent from './abstract-component';


const MenuControl = {
  TABLE: `Table`,
  STATS: `Stats`,
};

const MENU_CONTROLS = [MenuControl.TABLE, MenuControl.STATS];

const createMenuMarkup = (control, activeControl) => {
  const isActive = control === activeControl;
  return (
    `<a class="trip-tabs__btn${isActive ? ` trip-tabs__btn--active` : ``}" href="#" data-menu-control="${control}">${control}</a>`
  );
};

const getMenuMarkup = (menuControls, activeControl) => {
  return menuControls.map((control) => createMenuMarkup(control, activeControl)).join(`\n`);
};

const createMenuTemplate = (menuControls, activeControl) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${getMenuMarkup(menuControls, activeControl)}
    </nav>`
  );
};

export default class MenuComponent extends AbstractComponent {
  constructor() {
    super();
    this._activeControl = MenuControl.TABLE;
  }
  getTemplate() {
    return createMenuTemplate(MENU_CONTROLS, this._activeControl);
  }

  onMenuControlsClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const target = evt.target;
      if (target.tagName !== `A`) {
        return;
      }
      this._setActiveMenuControl(target);
      this._activeControl = target.textContent;
      handler(this._activeControl);
    });
  }

  _setActiveMenuControl(activeControl) {
    this.getElement().querySelectorAll(`A`).forEach((control) => control.classList.remove(`trip-tabs__btn--active`));
    activeControl.classList.add(`trip-tabs__btn--active`);
  }

}

export {MenuControl};
