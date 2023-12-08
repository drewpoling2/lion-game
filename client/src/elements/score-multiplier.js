import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';

const multiplierPositions = [];

const SPEED = 0.05;
const MULTIPLIER_INTERVAL_MIN = 500;
const MULTIPLIER_INTERVAL_MAX = 2000;
const worldElem = document.querySelector('[data-world]');

let nextMultiplierTime;
export function setupMultiplier() {
  nextMultiplierTime = MULTIPLIER_INTERVAL_MIN;
  document.querySelectorAll('[data-multiplier]').forEach((multiplier) => {
    multiplier.remove();
  });
}

function isPositionOccupied(position) {
  return multiplierPositions.includes(position);
}

function generateRandomMultiplier() {
  const minMultipliers = 1;
  const maxMultipliers = 3; // Adjust the range as needed

  const numberOfMultipliers = randomNumberBetween(
    minMultipliers,
    maxMultipliers
  );

  for (let i = 0; i < numberOfMultipliers; i++) {
    let newPosition;

    do {
      newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
    } while (isPositionOccupied(newPosition));

    multiplierPositions.push(newPosition);
    createMultipliers(newPosition);
  }

  // Clear multiplier positions for the next round (optional)
  multiplierPositions.length = 0;
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
    generateRandomMultiplier();
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

function createMultipliers(newPosition) {
  const multiplier = document.createElement('img');
  multiplier.dataset.multiplier = true;
  multiplier.classList.add('multiplier');
  multiplier.id = Math.random().toString(16).slice(2);
  setCustomProperty(multiplier, '--left', newPosition);

  worldElem.append(multiplier);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
