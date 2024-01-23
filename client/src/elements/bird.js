import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';
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
import { getRandomWeighted, normalizeWeights } from './platform';
const {
  setMultiplierRatio,
  getMultiplierRatio,
  getPlayerImmunity,
  getHasStar,
  getObstaclePoints,
  getIsBirdRunning,
} = StateSingleton;
const cactiPositions = [];

const SPEED = 0.03;
const BIRD_INTERVAL_MIN = 500;
const BIRD_INTERVAL_MAX = 2000;
const worldElem = document.querySelector('[data-world]');

let nextBirdTime;
export function setupBird() {
  nextBirdTime = BIRD_INTERVAL_MIN;
  document.querySelectorAll('[data-bird]').forEach((bird) => {
    bird.remove();
  });
}

function isPositionOccupied(position) {
  return cactiPositions.includes(position);
}

let groupIdCounter = 0; // Counter to generate unique groupIds

function generateRandomCacti() {
  const minCacti = 1;
  const maxCacti = 1; // Adjust the range as needed
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
      createBird(newPosition, groupId);
    }
  } else {
    let newPosition;
    do {
      newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
    } while (isPositionOccupied(newPosition));

    cactiPositions.push({
      position: newPosition,
    });
    createBird(newPosition);
  }

  // Clear cacti positions for the next round (optional)
  cactiPositions.length = 0;
}

const distanceThreshold = 200; // Adjust this threshold as needed
let birdGroups = new Map(); // Declare birdGroups outside the updateBird function

export function updateBird(delta, speedScale) {
  document.querySelectorAll('[data-bird]').forEach((bird) => {
    // Check if the comboIncremented flag is already set for this bird
    const comboIncremented = bird.dataset.comboIncremented === 'true';

    // Get positions of the dinosaur and bird
    const dinoRect = getDinoRect();
    const birdRect = bird.getBoundingClientRect();

    // Calculate distance
    const distance = Math.sqrt(
      Math.pow(dinoRect.x - birdRect.x, 2) +
        Math.pow(dinoRect.y - birdRect.y, 2)
    );
    const collision = isCollision(dinoRect, birdRect);

    // Check if the bird belongs to a group
    const groupId = bird.dataset.groupId;
    const isGrouped = groupId !== undefined;

    // Initialize groupFlags to an empty object
    let groupFlags = {};
    // Check if the dinosaur is within the threshold near the bird
    const isDinoNearBird = distance < distanceThreshold;

    // Check if there was a collision in the previous frame
    const hadCollision = bird.dataset.hadCollision === 'true';

    // Check if the bird has moved past the dinosaur
    const hasPassedDino = birdRect.right < dinoRect.left;

    if (isGrouped) {
      // Check if this bird belongs to a group
      if (!birdGroups.has(groupId)) {
        // If the group does not exist, create it
        birdGroups.set(groupId, {
          isDinoNear: false,
          hadCollision: false,
          comboIncremented: false,
        });
      }

      // Update the group's flags based on individual birds
      groupFlags = birdGroups.get(groupId);

      // Update the flags for this bird in the group
      groupFlags.isDinoNear =
        groupFlags.isDinoNear || bird.dataset.isDinoNear === 'true';
      groupFlags.hadCollision = groupFlags.hadCollision || hadCollision;

      // Check if the bird has moved past the dinosaur within the group
      groupFlags.hasPassedDino = groupFlags.hasPassedDino || hasPassedDino;
    }

    if (isDinoNearBird) {
      // If the dinosaur is within the threshold, set the flag to true
      bird.dataset.isDinoNear = 'true';
    } else {
      // If the dinosaur is not within the threshold, set the flag to false
      bird.dataset.isDinoNear = 'false';
    }

    if (
      isGrouped &&
      groupFlags.isDinoNear &&
      !groupFlags.hadCollision &&
      groupFlags.hasPassedDino &&
      !groupFlags.comboIncremented
    ) {
      // Increment combo only if there was no collision in the previous frame
      // and the bird group has moved past the dinosaur without a new collision
      let currentMultiplierRatio = getMultiplierRatio();
      setMultiplierRatio((currentMultiplierRatio += 1));
      updateMultiplierInterface();
      // const newElement = document.createElement('div');
      // newElement.classList.add('one-up');
      // newElement.style.position = 'absolute';
      // newElement.textContent = '+1x';
      // bird.appendChild(newElement);
      // setTimeout(() => {
      //   newElement.remove();
      // }, 600);
      // Set the comboIncremented flag for the entire group
      groupFlags.comboIncremented = true;
    }

    if (
      !bird.dataset.hadCollision &&
      collision === true &&
      !bird.dataset.scoreUpdated
    ) {
      if (getPlayerImmunity() && getHasStar()) {
        const text = document.createElement('div');
        text.classList.add('enemy-plus-points');
        text.style.position = 'absolute';
        text.style.left = bird.offsetLeft + 'px';
        text.style.top = bird.offsetTop - 70 + 'px';
        bird.parentNode.insertBefore(text, bird);
        const points = getMultiplierRatio() * getObstaclePoints();
        text.textContent = `+${points}`;
        updateScoreWithPoints(points);
        bird.classList.add('enemy-die');
        bird.dataset.scoreUpdated = true;
        // After the transition, remove the bird
        bird.addEventListener('animationend', () => {
          bird.remove();
        });
      } else {
        bird.dataset.hadCollision = true;
      }
    }

    incrementCustomProperty(bird, '--left', delta * speedScale * SPEED * -1);
    if (getCustomProperty(bird, '--left') <= -100) {
      bird.remove();
    }
  });

  if (nextBirdTime <= 0 && getIsBirdRunning()) {
    generateRandomCacti();
    nextBirdTime =
      randomNumberBetween(BIRD_INTERVAL_MIN, BIRD_INTERVAL_MAX) / speedScale;
  }
  nextBirdTime -= delta;
}

export function getBirdRects() {
  return [...document.querySelectorAll('[data-bird]')].map((bird) => {
    return bird.getBoundingClientRect();
  });
}

// Array of possible bird images with associated weights
const birdObj = {
  penguin: { weight: 1 },
  // Add more image sources with corresponding weights
};

const normalizedBirdWeights = normalizeWeights(birdObj);

function createBird(newPosition, groupId) {
  const bird = document.createElement('div');
  bird.dataset.bird = true;
  bird.classList.add('bird', 'flying-penguin', 'game-element');

  // Set the groupId as a data attribute on the bird element
  bird.dataset.groupId = groupId;

  setCustomProperty(bird, '--left', newPosition);
  setCustomProperty(bird, 'height', `${randomNumberBetween(8, 13)}%`);

  worldElem.append(bird);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
