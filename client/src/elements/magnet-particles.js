import {
  setCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';
import { worldElem } from '../elements-refs';
import InterfaceTextElemsSingleton from '../interface-text-elems-state';

const { addInterfaceTextElem, removeInterfaceTextElem } =
  InterfaceTextElemsSingleton;

export function createMagnetParticles(parent) {
  const element = document.createElement('div');
  addInterfaceTextElem(element);
  element.classList.add(`magnet-particles`);
  element.id = Math.random().toString(16).slice(2);
  setCustomProperty(
    element,
    '--bottom',
    getCustomProperty(parent, '--bottom') +
      Math.floor(Math.random() * (10 - 4) + 4)
  );

  worldElem.appendChild(element);

  // Add an event listener to the animated element
  element.addEventListener('animationend', () => {
    removeInterfaceTextElem(element);
    element.remove();
  });
}
