import StateSingleton from '../game-state';
import ItemDropStateSingleton from '../item-drop-state';
import { setCustomProperty, getCustomProperty } from './updateCustomProperty';
import { worldElem } from '../elements-refs';
const { getItemDropState } = ItemDropStateSingleton;
export function createCrateItems(elementName, parent) {
  const element = document.createElement('div');
  element.dataset[`${elementName}`] = true;
  element.classList.add(
    `${elementName}-item-cloud`,
    `${elementName}-cloud-item-asset`
  );
  element.id = Math.random().toString(16).slice(2);
  if (elementName === 'cherry') {
    element.dataset.type = 'cherry';
    element.dataset.points = StateSingleton.getCherryPoints();
  }
  parent.append(element);
}

export function createCrateItemsAboveCrate(elementName, parent) {
  const element = document.createElement('div');
  element.dataset.crateItem = true;
  element.dataset[`${elementName}`] = true;
  element.classList.add(
    `${elementName}-collectable-item-translate`,
    'collectable-crate-item'
  );
  element.style.top = 'unset';
  element.id = Math.random().toString(16).slice(2);
  if (elementName === 'cherry') {
    element.dataset.type = 'cherry';
    element.dataset.points = StateSingleton.getCherryPoints();
  }

  //removes collider for a moment so the item can track to the player without colliding instantly
  const state = getItemDropState();
  state[elementName].colliderSetter(false);

  setCustomProperty(
    element,
    '--bottom',
    getCustomProperty(parent, '--bottom') + 3
  );
  setCustomProperty(element, '--left', getCustomProperty(parent, '--left'));
  worldElem.appendChild(element);
  element.addEventListener('animationend', () => {
    state[elementName].colliderSetter(true);
    element.dataset.itemLocked = true;
    setCustomProperty(
      element,
      '--bottom',
      getCustomProperty(parent, '--bottom') + 15
    );
  });
}
