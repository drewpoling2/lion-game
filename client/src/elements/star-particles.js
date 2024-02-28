import {
  setCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';
import { worldElem } from '../elements-refs';
import { dinoElem } from '../elements-refs';
import InterfaceTextElemsSingleton from '../interface-text-elems-state';

const { addInterfaceTextElem } = InterfaceTextElemsSingleton;

export function createStarParticles() {
  const element = document.createElement('div');
  addInterfaceTextElem(element);
  element.classList.add(`star-particles`);
  element.id = Math.random().toString(16).slice(2);
  setCustomProperty(
    element,
    '--bottom',
    getCustomProperty(dinoElem, '--bottom') -
      Math.floor(Math.random() * (8 - 4) + 4)
  );

  worldElem.appendChild(element);

  // Add an event listener to the animated element
  element.addEventListener('animationend', () => {
    element.remove();
  });
}
