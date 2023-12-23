import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';
import tree1 from '../public/imgs/trees/Bush-Tree.png';
import tree2 from '../public/imgs/trees/Round-Tree.png';
import tree3 from '../public/imgs/trees/Pine-Tree.png';
import snowball from '../public/imgs/Obstacles/Snowball-Small.png';
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

// Array of possible cactus images with associated weights
const cactusImages = [
  { src: tree1, weight: 5 },
  { src: tree2, weight: 1 },
  { src: tree3, weight: 2 },
  { src: snowball, weight: 3 },
  // Add more image sources with corresponding weights
];

function createCactus(newPosition) {
  // Calculate the total weight
  const totalWeight = cactusImages.reduce(
    (sum, image) => sum + image.weight,
    0
  );

  // Generate a random number between 0 and totalWeight
  const randomWeight = Math.random() * totalWeight;

  // Select a random cactus image based on the weighted probabilities
  let cumulativeWeight = 0;
  let selectedImage;
  for (const image of cactusImages) {
    cumulativeWeight += image.weight;
    if (randomWeight <= cumulativeWeight) {
      selectedImage = image;
      break;
    }
  }
  const cactus = document.createElement('img');
  cactus.dataset.cactus = true;
  cactus.src = selectedImage.src;
  cactus.classList.add('cactus', 'game-element');
  setCustomProperty(cactus, '--left', newPosition);
  setCustomProperty(cactus, 'height', `${randomNumberBetween(13, 17)}%`);

  worldElem.append(cactus);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
