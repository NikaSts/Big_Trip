import AbstractComponent from './abstract-component';


const MenuControl = {
  TABLE: `Table`,
  STATS: `Stats`,
};

const MENU_CONTROLS = [MenuControl.TABLE, MenuControl.STATS];

const createMenuMarkup = (control, isActive) => {
  return (
    `<a class="trip-tabs__btn${isActive ? ` trip-tabs__btn--active` : ``}" href="#" data-menu-control="${control}">${control}</a>`
  );
};

const menuMarkup = (menuControls) => {
  return menuControls.map((control, index) => createMenuMarkup(control, index === 0)).join(`\n`);
};

const createMenuTemplate = (menuControls) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${menuMarkup(menuControls)}
    </nav>`
  );
};

export default class MenuComponent extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate(MENU_CONTROLS);
  }

  onMenuControlsClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const target = evt.target;
      if (target.tagName !== `A`) {
        return;
      }
      this._setActiveMenuControl(target);
      const activeControl = target.textContent;
      handler(activeControl);
    });
  }

  _setActiveMenuControl(activeControl) {
    this.getElement().querySelectorAll(`A`).forEach((control) => control.classList.remove(`trip-tabs__btn--active`));
    activeControl.classList.add(`trip-tabs__btn--active`);
  }

}

export {MenuControl};
