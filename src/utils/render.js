const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

const renderComponent = (container, component, place = Position.BEFOREEND) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case Position.BEFOREEND:
      container.append(component.getElement());
      break;
    case Position.AFTEREND:
      container.after(component.getElement());
      break;
    default:
      throw new Error(`Case ${place} not found`);
  }
};

const replaceComponent = (oldComponent, newComponent) => {
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();
  const isExistElements = !!(newElement && oldElement);

  if (isExistElements) {
    oldElement.replaceWith(newElement);
  }
};

const removeComponent = (component) => {
  component.getElement().remove();
  component.removeElement();
};


export {Position, createElement, renderComponent, replaceComponent, removeComponent};
