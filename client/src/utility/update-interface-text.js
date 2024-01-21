import { incrementCustomProperty } from '../utility/updateCustomProperty.js';
import InterfaceTextElemsSingleton from '../interface-text-elems-state.js';
const { getInterfaceTextElemsState } = InterfaceTextElemsSingleton;
const SPEED = 0.04;
export function updateInterfaceText(delta, speedScale) {
  const interfaceTextElems = getInterfaceTextElemsState();

  interfaceTextElems.forEach((text) => {
    incrementCustomProperty(text, '--left', delta * speedScale * SPEED * -1);
  });
}
