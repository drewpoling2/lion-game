import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';

const multiplierPositions = [];

const SPEED = 0.05;
const MULTIPLIER_INTERVAL_MIN = 4000;
const MULTIPLIER_INTERVAL_MAX = 6000;
const worldElem = document.querySelector('[data-world]');

let nextMultiplierTime;
export function setupMultiplier() {
  nextMultiplierTime = MULTIPLIER_INTERVAL_MIN;
  document.querySelectorAll('[data-multiplier]').forEach((multiplier) => {
    multiplier.remove();
  });
}

export function updateMultiplier(delta, speedScale) {
  document.querySelectorAll('[data-multiplier]').forEach((multiplier) => {
    incrementCustomProperty(
      multiplier,
      '--left',
      delta * speedScale * SPEED * -1
    );
    if (getCustomProperty(multiplier, '--left') <= -100) {
      multiplier.remove();
    }
  });

  if (nextMultiplierTime <= 0) {
    createMultipliers();
    nextMultiplierTime =
      randomNumberBetween(MULTIPLIER_INTERVAL_MIN, MULTIPLIER_INTERVAL_MAX) /
      speedScale;
  }
  nextMultiplierTime -= delta;
}

export function getMultiplierRects() {
  return [...document.querySelectorAll('[data-multiplier]')].map(
    (multiplier) => {
      return {
        id: multiplier.id,
        rect: multiplier.getBoundingClientRect(),
      };
    }
  );
}

function createMultipliers() {
  const multiplier = document.createElement('div');
  multiplier.dataset.multiplier = true;
  multiplier.textContent = 'm';
  multiplier.classList.add('multiplier', 'floating-item');
  multiplier.id = Math.random().toString(16).slice(2);
  setCustomProperty(multiplier, '--left', 100);

  worldElem.append(multiplier);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
