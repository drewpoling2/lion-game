import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from '../utility/updateCustomProperty.js';

const SPEED = 0.007;
const groundLayerThreeElems = document.querySelectorAll(
  '[data-ground-layer-three]'
);

export function setupGroundLayerThree() {
  setCustomProperty(groundLayerThreeElems[0], '--left', 0);
  setCustomProperty(groundLayerThreeElems[1], '--left', 300);
}

export function updateGroundLayerThree(delta, speedScale) {
  groundLayerThreeElems.forEach((ground) => {
    incrementCustomProperty(ground, '--left', delta * speedScale * SPEED * -1);

    if (getCustomProperty(ground, '--left') <= -300) {
      incrementCustomProperty(ground, '--left', 600);
    }
  });
}
