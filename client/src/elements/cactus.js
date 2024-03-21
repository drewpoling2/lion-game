import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';
import bush1 from '../public/imgs/obstacles/bushes/Bush-1.png';
import rock1 from '../public/imgs/obstacles/rocks/Rock-1.png';
import rock2 from '../public/imgs/obstacles/rocks/Rock-2.png';
import { getDinoRect } from './player-controller';
import { isCollision, updateMultiplierInterface } from '../game-manager';
import StateSingleton from '../game-state';
import {
  currentMultiplierElem,
  interfaceComboContainer,
  currentComboScoreContainer,
} from '../elements-refs';
import { toggleElemOn } from '../utility/toggle-element';
import { updateScoreWithPoints } from '../game-manager';
import { addToSpawnQueue } from './groundQue';
const {
  setMultiplierRatio,
  getMultiplierRatio,
  getPlayerImmunity,
  getHasStar,
  getObstaclePoints,
  getIsCactusRunning,
  getCactusIntervalMax,
  getCactusIntervalMin,
  getGroundSpeed,
} = StateSingleton;
const cactiPositions = [];

const worldElem = document.querySelector('[data-world]');

let nextCactusTime;
export function setupCactus() {
  nextCactusTime = getCactusIntervalMin();
  document.querySelectorAll('[data-cactus]').forEach((cactus) => {
    cactus.remove();
  });
}

function isPositionOccupied(position) {
  return cactiPositions.includes(position);
}

let groupIdCounter = 0; // Counter to generate unique groupIds
let isCactusSpawned = true;

export function generateRandomCacti() {
  isCactusSpawned = true;
  console.log('cactus spawned');
  const minCacti = 1;
  const maxCacti = 2; // Adjust the range as needed
  let groupId; // Declare groupId outside the loop

  const numberOfCacti = randomNumberBetween(minCacti, maxCacti);

  if (numberOfCacti >= minCacti) {
    groupId = groupIdCounter++;
    for (let i = 0; i < numberOfCacti; i++) {
      let newPosition;
      do {
        newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
      } while (isPositionOccupied(newPosition));

      cactiPositions.push({
        position: newPosition,
        groupId: groupId,
      });
      createCactus(newPosition, groupId);
    }
  } else {
    let newPosition;
    do {
      newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
    } while (isPositionOccupied(newPosition));

    cactiPositions.push({
      position: newPosition,
    });
    createCactus(newPosition);
  }

  // Clear cacti positions for the next round (optional)
  cactiPositions.length = 0;
}

const distanceThreshold = 200; // Adjust this threshold as needed
let cactusGroups = new Map(); // Declare cactusGroups outside the updateCactus function

export function updateCactus(delta, speedScale) {
  document.querySelectorAll('[data-cactus]').forEach((cactus) => {
    // Check if the comboIncremented flag is already set for this cactus
    const comboIncremented = cactus.dataset.comboIncremented === 'true';

    // Get positions of the dinosaur and cactus
    const dinoRect = getDinoRect();
    const cactusRect = cactus.getBoundingClientRect();

    // Calculate distance
    const distance = Math.sqrt(
      Math.pow(dinoRect.x - cactusRect.x, 2) +
        Math.pow(dinoRect.y - cactusRect.y, 2)
    );
    const collision = isCollision(dinoRect, cactusRect);
    console.log(dinoRect);
    // Check if the cactus belongs to a group
    const groupId = cactus.dataset.groupId;
    const isGrouped = groupId !== undefined;

    // Initialize groupFlags to an empty object
    let groupFlags = {};
    // Check if the dinosaur is within the threshold near the cactus
    const isDinoNearCactus = distance < distanceThreshold;

    // Check if there was a collision in the previous frame
    const hadCollision = cactus.dataset.hadCollision === 'true';

    // Check if the cactus has moved past the dinosaur
    const hasPassedDino = cactusRect.right < dinoRect.left;

    if (isGrouped) {
      // Check if this cactus belongs to a group
      if (!cactusGroups.has(groupId)) {
        // If the group does not exist, create it
        cactusGroups.set(groupId, {
          isDinoNear: false,
          hadCollision: false,
          comboIncremented: false,
        });
      }

      // Update the group's flags based on individual cactuses
      groupFlags = cactusGroups.get(groupId);

      // Update the flags for this cactus in the group
      groupFlags.isDinoNear =
        groupFlags.isDinoNear || cactus.dataset.isDinoNear === 'true';
      groupFlags.hadCollision = groupFlags.hadCollision || hadCollision;

      // Check if the cactus has moved past the dinosaur within the group
      groupFlags.hasPassedDino = groupFlags.hasPassedDino || hasPassedDino;
    }

    if (isDinoNearCactus) {
      // If the dinosaur is within the threshold, set the flag to true
      cactus.dataset.isDinoNear = 'true';
    } else {
      // If the dinosaur is not within the threshold, set the flag to false
      cactus.dataset.isDinoNear = 'false';
    }

    if (
      isGrouped &&
      groupFlags.isDinoNear &&
      !groupFlags.hadCollision &&
      groupFlags.hasPassedDino &&
      !groupFlags.comboIncremented
    ) {
      // Increment combo only if there was no collision in the previous frame
      // and the cactus group has moved past the dinosaur without a new collision
      let currentMultiplierRatio = getMultiplierRatio();
      setMultiplierRatio((currentMultiplierRatio += 1));
      updateMultiplierInterface();
      // const newElement = document.createElement('div');
      // newElement.classList.add('one-up');
      // newElement.style.position = 'absolute';
      // newElement.textContent = '+1x';
      // cactus.appendChild(newElement);
      // setTimeout(() => {
      //   newElement.remove();
      // }, 600);
      // Set the comboIncremented flag for the entire group
      groupFlags.comboIncremented = true;
    }

    if (
      !cactus.dataset.hadCollision &&
      collision === true &&
      !cactus.dataset.scoreUpdated
    ) {
      if (getPlayerImmunity() && getHasStar()) {
        const text = document.createElement('div');
        text.classList.add('enemy-plus-points');
        text.style.position = 'absolute';
        text.style.left = cactus.offsetLeft + 'px';
        text.style.top = cactus.offsetTop - 70 + 'px';
        cactus.parentNode.insertBefore(text, cactus);
        const points = getMultiplierRatio() * getObstaclePoints();
        text.textContent = `+${points}`;
        updateScoreWithPoints(points);
        cactus.classList.add('enemy-die');
        cactus.dataset.scoreUpdated = true;
        text.addEventListener('animationend', () => {
          text.remove();
        });
        // After the transition, remove the cactus
        cactus.addEventListener('animationend', () => {
          cactus.remove();
        });
      } else {
        cactus.dataset.hadCollision = true;
      }
    }

    incrementCustomProperty(
      cactus,
      '--left',
      delta * speedScale * getGroundSpeed() * -1
    );
    if (getCustomProperty(cactus, '--left') <= -100) {
      cactus.remove();
    }
  });

  if (nextCactusTime <= 0 && getIsCactusRunning()) {
    addToSpawnQueue('cactus');
    isCactusSpawned = false;
    nextCactusTime =
      randomNumberBetween(getCactusIntervalMin(), getCactusIntervalMax()) /
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
  { src: bush1, weight: 5 },
  { src: rock1, weight: 3 },
  { src: rock2, weight: 4 },
  // Add more image sources with corresponding weights
];

function createCactus(newPosition, groupId) {
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
  // Randomly flip the cloud horizontally
  if (Math.random() < 0.5) {
    cactus.style.transform = 'scaleX(-1)';
  }
  // Set the groupId as a data attribute on the cactus element
  cactus.dataset.groupId = groupId;

  setCustomProperty(cactus, '--left', newPosition);
  setCustomProperty(cactus, 'height', '6.3%');
  setCustomProperty(cactus, '--bottom', `${randomNumberBetween(15.5, 17.5)}`);

  worldElem.append(cactus);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
