import { incrementCustomProperty } from '../utility/updateCustomProperty.js';
import InterfaceTextElemsSingleton from '../interface-text-elems-state.js';
import StateSingleton from '../game-state.js';

const { getGroundSpeed } = StateSingleton;
const { getInterfaceTextElemsState } = InterfaceTextElemsSingleton;
const SPEED = getGroundSpeed() / 1.5;
export function updateInterfaceText(delta, speedScale) {
  const interfaceTextElems = getInterfaceTextElemsState();

  interfaceTextElems.forEach((text) => {
    incrementCustomProperty(text, '--left', delta * speedScale * SPEED * -1);
  });
}
