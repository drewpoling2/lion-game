import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from '../utility/updateCustomProperty.js';
import StateSingleton from '../game-state.js';
const { getIsGroundLayer2Running } = StateSingleton;
const SPEED = 0.017;
const groundLayerTwoElems = document.querySelectorAll(
  '[data-ground-layer-two-two]'
);

export function setupGroundLayerTwoTwo() {
  setCustomProperty(groundLayerTwoElems[0], '--left', 0);
  setCustomProperty(groundLayerTwoElems[1], '--left', 220);
}

export function updateGroundLayerTwoTwo(delta, speedScale) {
  groundLayerTwoElems.forEach((ground) => {
    incrementCustomProperty(ground, '--left', delta * speedScale * SPEED * -1);

    if (getCustomProperty(ground, '--left') <= -220) {
      if (!getIsGroundLayer2Running()) {
        incrementCustomProperty(ground, '--left', 400);
      } else {
        incrementCustomProperty(ground, '--left', 520);
        ground.style.zIndex = '-1';
      }
    }
  });
}
