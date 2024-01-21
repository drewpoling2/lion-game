import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from '../utility/updateCustomProperty.js';

const SPEED = 0.04;
const groundElems = document.querySelectorAll('[data-ground]');

export function setupGround() {
  setCustomProperty(groundElems[0], '--left', 0);
  setCustomProperty(groundElems[1], '--left', 250);
}

export function updateGround(delta, speedScale) {
  groundElems.forEach((ground) => {
    incrementCustomProperty(ground, '--left', delta * speedScale * SPEED * -1);

    if (getCustomProperty(ground, '--left') <= -250) {
      incrementCustomProperty(ground, '--left', 500);
    }
  });
}
