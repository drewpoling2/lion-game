import {
  setCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';
import { worldElem } from '../elements-refs';
import InterfaceTextElemsSingleton from '../interface-text-elems-state';

const { addInterfaceTextElem, removeInterfaceTextElem } =
  InterfaceTextElemsSingleton;

export function createPoofParticles(parent) {
  const element = document.createElement('div');
  addInterfaceTextElem(element);
  element.classList.add(`poof-particles`);
  element.id = Math.random().toString(16).slice(2);
  setCustomProperty(element, '--bottom', getCustomProperty(parent, '--bottom'));
  worldElem.appendChild(element);

  element.addEventListener('animationend', () => {
    removeInterfaceTextElem(element);
    element.remove();
  });
}
