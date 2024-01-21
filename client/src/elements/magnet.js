import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';

const SPEED = 0.05;
const MAGNET_INTERVAL_MIN = 1000;
const MAGNET_INTERVAL_MAX = 1300;
const worldElem = document.querySelector('[data-world]');

let nextMagnetTime;
export function setupMagnet() {
  nextMagnetTime = MAGNET_INTERVAL_MIN;
  document.querySelectorAll('[data-magnet]').forEach((magnet) => {
    magnet.remove();
  });
}

export function updateMagnet(delta, speedScale) {
  document.querySelectorAll('[data-magnet]').forEach((magnet) => {
    incrementCustomProperty(magnet, '--left', delta * speedScale * SPEED * -1);
    if (getCustomProperty(magnet, '--left') <= -100) {
      magnet.remove();
    }
  });

  if (nextMagnetTime <= 0) {
    createMagnet();
    nextMagnetTime =
      randomNumberBetween(MAGNET_INTERVAL_MIN, MAGNET_INTERVAL_MAX) /
      speedScale;
  }
  nextMagnetTime -= delta;
}

export function getMagnetRects() {
  return [...document.querySelectorAll('[data-magnet]')].map((magnet) => {
    return {
      id: magnet.id,
      rect: magnet.getBoundingClientRect(),
      magnet: magnet.dataset.magnet,
    };
  });
}

function createMagnet() {
  const magnet = document.createElement('div');
  magnet.dataset.magnet = true;
  magnet.textContent = 'magnet';
  magnet.classList.add('magnet', 'bouncing-item');
  magnet.id = Math.random().toString(16).slice(2);
  setCustomProperty(magnet, '--left', 100);
  worldElem.append(magnet);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
