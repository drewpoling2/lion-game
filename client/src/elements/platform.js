import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';
import cloud1Img from '../public/imgs/cloud/Cloud-1.png';
import cloud2Img from '../public/imgs/cloud/Cloud-2.png';
import { getDinoRect } from './player-controller';
import { isCollision, updateMultiplierInterface } from '../game-manager';
import StateSingleton from '../game-state';
import ItemDropStateSingleton from '../item-drop-state';
import { createChildItems } from '../utility/child-items';
import { collectableOptions } from '../game-manager';
import { getRandomKeyframe } from './coin';
const { getIsPlatformRunning, getPlatformSpeed, getSelectedStarter } =
  StateSingleton;
const {
  getItemDropState,
  getNormalizedItemDropState,
  setNormalizedItemDropState,
} = ItemDropStateSingleton;
const platformPositions = [];

const SPEED = getPlatformSpeed();
const platform_INTERVAL_MIN = 1000;
const platform_INTERVAL_MAX = 1500;
const worldElem = document.querySelector('[data-world]');

let nextPlatformTime;
export function setupPlatform() {
  nextPlatformTime = platform_INTERVAL_MIN;
  document.querySelectorAll('[data-platform]').forEach((platform) => {
    platform.remove();
  });
}

function isPositionOccupied(position) {
  return platformPositions.includes(position);
}

function generateRandomPlatforms() {
  const minPlatforms = 1;
  const maxPlatforms = 1; // Adjust the range as needed

  const numberOfPlatforms = randomNumberBetween(minPlatforms, maxPlatforms);

  if (numberOfPlatforms >= minPlatforms) {
    for (let i = 0; i < numberOfPlatforms; i++) {
      let newPosition;
      do {
        newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
      } while (isPositionOccupied(newPosition));

      platformPositions.push({
        position: newPosition,
      });
      createPlatform(newPosition);
    }
  } else {
    let newPosition;
    do {
      newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
    } while (isPositionOccupied(newPosition));

    platformPositions.push({
      position: newPosition,
    });
    createPlatform(newPosition);
  }

  platformPositions.length = 0;
}

const distanceThreshold = 200; // Adjust this threshold as needed

export function updatePlatform(delta, speedScale) {
  document.querySelectorAll('[data-platform]').forEach((platform) => {
    // Get positions of the dinosaur and platform
    const dinoRect = getDinoRect();
    const platformRect = platform.getBoundingClientRect();

    // Calculate distance
    const distance = Math.sqrt(
      Math.pow(dinoRect.x - platformRect.x, 2) +
        Math.pow(dinoRect.y - platformRect.y, 2)
    );
    const collision = isCollision(dinoRect, platformRect);

    // Check if the dinosaur is within the threshold near the platform
    const isDinoNearPlatform = distance < distanceThreshold;

    if (isDinoNearPlatform) {
      // If the dinosaur is within the threshold, set the flag to true
      platform.dataset.isDinoNear = 'true';
    } else {
      // If the dinosaur is not within the threshold, set the flag to false
      platform.dataset.isDinoNear = 'false';
    }

    if (!platform.dataset.hadCollision && collision === true) {
      platform.dataset.hadCollision = true;
    }
  });
  document
    .querySelectorAll('[data-platform-container]')
    .forEach((platformContainer) => {
      incrementCustomProperty(
        platformContainer,
        '--left',
        delta * speedScale * SPEED * -1
      );
      if (getCustomProperty(platformContainer, '--left') <= -100) {
        platformContainer.remove();
      }
    });

  if (nextPlatformTime <= 0 && getIsPlatformRunning()) {
    generateRandomPlatforms();
    nextPlatformTime =
      randomNumberBetween(platform_INTERVAL_MIN, platform_INTERVAL_MAX) /
      speedScale;
  }
  nextPlatformTime -= delta;
}

export function getPlatformRects() {
  return [...document.querySelectorAll('[data-platform]')].map((platform) => {
    return platform.getBoundingClientRect();
  });
}

// Array of possible platform images with associated weights
const platformObj = {
  'item-cloud': {
    weight: 20,
  },
  2: { weight: 1 },
  3: { weight: 2 },
  4: { weight: 5 },
  5: { weight: 5 },
  // Add more image sources with corresponding weights
};

function createCloud(platformElem, isFirstChild, zIndex, i) {
  const cloud = document.createElement('img');
  cloud.src = cloud1Img;
  const cloudClass =
    i % 3 === 0
      ? 'floating-cloud-animation-1'
      : i % 3 === 1
      ? 'floating-cloud-animation-2'
      : 'floating-cloud-animation-3';

  cloud.classList.add('cloud', cloudClass);
  // Shift each cloud to the left by 30% of its width if it's not the first cloud
  if (!isFirstChild) {
    cloud.style.marginLeft = '-4px';
  }
  cloud.style.zIndex = zIndex;
  platformElem.append(cloud);
}

setNormalizedItemDropState(normalizeWeights(getItemDropState()));
function createItemCloud(platformElem) {
  const cloud = document.createElement('img');
  cloud.src = cloud2Img;
  cloud.classList.add('item-cloud');

  // Randomly flip the cloud horizontally
  if (Math.random() < 0.5) {
    cloud.style.transform = 'scaleX(-1)';
  }
  // Shift each cloud to the left by 30% of its width if it's not the first cloud
  platformElem.append(cloud);
}

function createPlatform(newPosition) {
  const numberOfClouds = getRandomWeighted(normalizedPlatformWeights);
  const platform = document.createElement('div');
  const parentContainer = document.createElement('div');
  parentContainer.dataset.platformContainer = true;
  parentContainer.classList.add('platform-parent-container');
  if (numberOfClouds !== 'item-cloud') {
    for (let i = 0; i < numberOfClouds; i++) {
      const zIndex = numberOfClouds.length - i + 2;
      createCloud(platform, i === 0, zIndex, i);
    }
  } else {
    createItemCloud(platform);
    createChildItems(
      getRandomWeighted(getNormalizedItemDropState()),
      parentContainer
    );
  }
  platform.dataset.platform = true;
  platform.classList.add('platform', 'game-element', 'flex-row');
  platform.id = `platform-${Math.random()}`;
  parentContainer.append(platform);
  setCustomProperty(parentContainer, '--left', newPosition);
  setCustomProperty(
    parentContainer,
    '--bottom',
    `${randomNumberBetween(45, 45)}`
  );
  worldElem.append(parentContainer);
  createCoinsOnPlatform(parentContainer);
}

export function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Example usage:
const normalizedPlatformWeights = normalizeWeights(platformObj);

export function normalizeWeights(item) {
  const keys = Object.keys(item);
  const weights = keys.map((key) => item[key].weight);
  const sumOfWeights = weights.reduce((sum, weight) => sum + weight, 0);

  const normalizedWeights = {};
  keys.forEach((key, index) => {
    normalizedWeights[key] = weights[index] / sumOfWeights;
  });

  return normalizedWeights;
}

export function getRandomWeighted(item) {
  const keys = Object.keys(item);
  const probabilities = keys.map((key) => item[key]);
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

function createCoinsOnPlatform(parent) {
  // Calculate the total weight
  const totalWeight = collectableOptions.reduce(
    (sum, item) => sum + item.weight,
    0
  );

  // Generate a random number between 0 and totalWeight
  const randomWeight = Math.random() * totalWeight;

  // Select a random collectable based on the weighted probabilities
  let cumulativeWeight = 0;
  let selectedCollectable;
  for (const item of collectableOptions) {
    cumulativeWeight += item.weight;
    if (randomWeight <= cumulativeWeight) {
      selectedCollectable = item;
      break;
    }
  }
  const element = document.createElement('div');
  element.dataset.coin = true;
  element.dataset.cloudChild = true;
  element.dataset.type = selectedCollectable.type;
  element.dataset.locked = 'false';
  element.dataset.isLocking = 'false';
  element.dataset.isMagnetSpeedFactor = randomNumberBetween(1.3, 2.4);
  element.dataset.isLockingDuration = randomNumberBetween(100, 300);
  element.dataset.points = selectedCollectable.points;
  element.classList.add(
    selectedCollectable.type,
    'collectable',
    'move-bottom-cloud-coin'
  );
  element.id = Math.random().toString(16).slice(2);
  setCustomProperty(element, '--left', 100);
  setCustomProperty(element, '--bottom', getCustomProperty(parent, '--bottom'));
  const initialKeyframe = getRandomKeyframe();
  element.style.animationDelay = `-${initialKeyframe}%`;
  worldElem.append(element);
}
