import {
  setCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';
import { worldElem } from '../elements-refs';
import InterfaceTextElemsSingleton from '../interface-text-elems-state';

const { addInterfaceTextElem } = InterfaceTextElemsSingleton;

export function createPickUpParticles(particleName, parent) {
  const element = document.createElement('div');
  addInterfaceTextElem(element);
  element.classList.add(`${particleName}-particles`);
  element.id = Math.random().toString(16).slice(2);
  setCustomProperty(
    element,
    '--bottom',
    getCustomProperty(parent, '--bottom') + Math.floor(Math.random() * 5)
  );
  setCustomProperty(element, '--left', getCustomProperty(parent, '--left') - 2);
  worldElem.appendChild(element);

  // Add an event listener to the animated element
  element.addEventListener('animationend', () => {
    element.remove();
  });
}
