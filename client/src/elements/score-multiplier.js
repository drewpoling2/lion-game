import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';

const SPEED = 0.05;
const MULTIPLIER_INTERVAL_MIN = 500;
const MULTIPLIER_INTERVAL_MAX = 1000;
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
        multiplier: multiplier.dataset.multiplier,
      };
    }
  );
}

function getRandomKeyWeighted(obj) {
  const keys = Object.keys(obj);
  const probabilities = [0.7, 0.2, 0.1]; // Adjust probabilities as needed
  const randomValue = Math.random();
  let cumulativeProbability = 0;

  for (let i = 0; i < keys.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomValue <= cumulativeProbability) {
      return keys[i];
    }
  }

  // Default case (fallback)
  return keys[keys.length - 1];
}

function createMultipliers() {
  const multiplier = document.createElement('div');
  multiplier.dataset.multiplier =
    multiplierRatios[getRandomKeyWeighted(multiplierRatios)];
  multiplier.textContent = multiplier.dataset.multiplier;
  multiplier.classList.add('multiplier', 'floating-item');
  multiplier.id = Math.random().toString(16).slice(2);
  setCustomProperty(multiplier, '--left', 100);
  worldElem.append(multiplier);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const multiplierRatios = {
  x2: 2,
  x5: 5,
  x10: 10,
};
