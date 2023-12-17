import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';
import cactusImg from '../public/imgs/cactus.png';

const cactiPositions = [];

const SPEED = 0.05;
const CACTUS_INTERVAL_MIN = 500;
const CACTUS_INTERVAL_MAX = 2000;
const worldElem = document.querySelector('[data-world]');

let nextCactusTime;
export function setupCactus() {
  nextCactusTime = CACTUS_INTERVAL_MIN;
  document.querySelectorAll('[data-cactus]').forEach((cactus) => {
    cactus.remove();
  });
}

function isPositionOccupied(position) {
  return cactiPositions.includes(position);
}

function generateRandomCacti() {
  const minCacti = 1;
  const maxCacti = 3; // Adjust the range as needed

  const numberOfCacti = randomNumberBetween(minCacti, maxCacti);

  for (let i = 0; i < numberOfCacti; i++) {
    let newPosition;

    do {
      newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
    } while (isPositionOccupied(newPosition));

    cactiPositions.push(newPosition);
    createCactus(newPosition);
  }

  // Clear cacti positions for the next round (optional)
  cactiPositions.length = 0;
}

export function updateCactus(delta, speedScale) {
  document.querySelectorAll('[data-cactus]').forEach((cactus) => {
    incrementCustomProperty(cactus, '--left', delta * speedScale * SPEED * -1);
    if (getCustomProperty(cactus, '--left') <= -100) {
      cactus.remove();
    }
  });

  if (nextCactusTime <= 0) {
    generateRandomCacti();
    nextCactusTime =
      randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) /
      speedScale;
  }
  nextCactusTime -= delta;
}

export function getCactusRects() {
  return [...document.querySelectorAll('[data-cactus]')].map((cactus) => {
    return cactus.getBoundingClientRect();
  });
}

function createCactus(newPosition) {
  const cactus = document.createElement('img');
  cactus.dataset.cactus = true;
  cactus.src = cactusImg;
  cactus.classList.add('cactus', 'game-element');
  setCustomProperty(cactus, '--left', newPosition);
  setCustomProperty(cactus, 'height', `${randomNumberBetween(13, 17)}%`);

  worldElem.append(cactus);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
