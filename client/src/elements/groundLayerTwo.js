import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from '../utility/updateCustomProperty.js';

const SPEED = 0.022;
const groundLayerTwoElems = document.querySelectorAll(
  '[data-ground-layer-two]'
);

export function setupGroundLayerTwo() {
  setCustomProperty(groundLayerTwoElems[0], '--left', 0);
  setCustomProperty(groundLayerTwoElems[1], '--left', 300);
}

export function updateGroundLayerTwo(delta, speedScale) {
  groundLayerTwoElems.forEach((ground) => {
    incrementCustomProperty(ground, '--left', delta * speedScale * SPEED * -1);

    if (getCustomProperty(ground, '--left') <= -300) {
      incrementCustomProperty(ground, '--left', 600);
    }
  });
}
