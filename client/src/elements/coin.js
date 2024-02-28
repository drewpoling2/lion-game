import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';
import { getDinoRect } from './player-controller';
import { collectableOptions } from '../game-manager';
import StateSingleton from '../game-state';
import { addToSpawnQueue } from './groundQue';
import { snackBarElem, worldElem } from '../elements-refs';
const {
  getMagnetSpeedFactor,
  getIsCoinsRunning,
  getGroundSpeed,
  getPlatformSpeed,
  getGroundCoinMaxInterval,
  getGroundCoinMinInterval,
  getCoinPickupRadius,
} = StateSingleton;

const SPEED = getGroundSpeed();

let nextCoinTime;
let isCoinSpawned = true;

export function setupCoin() {
  nextCoinTime = getGroundCoinMinInterval();
  document.querySelectorAll('[data-coin]').forEach((coin) => {
    coin.remove();
  });
}

export function moveItemToPlayer(
  dinoRect,
  item,
  itemRect,
  distance,
  delta,
  extraFactor = 0
) {
  // Enter the locking phase
  if (item.dataset.isLocking === 'false') {
    const angle = Math.atan2(dinoRect.y - itemRect.y, dinoRect.x - itemRect.x);
    let distanceFactor = 0.0005 * distance;

    const speed = SPEED * delta * distanceFactor;
    // Additional logic to move the coin in the opposite direction before locking
    const oppositeDirectionX = Math.cos(angle) * speed * -1 * 2;
    const oppositeDirectionY = Math.sin(angle) * speed * 2;

    incrementCustomProperty(item, '--left', oppositeDirectionX);
    incrementCustomProperty(item, '--bottom', oppositeDirectionY);

    setTimeout(() => {
      item.dataset.locked = 'true';
      item.dataset.isLocking = 'true';
    }, item.dataset.isLockingDuration); // Adjust the timeout duration as needed
  } else {
    //lock the coin on the player
    item.dataset.locked = 'true';
    const angle = Math.atan2(dinoRect.y - itemRect.y, dinoRect.x - itemRect.x);
    let magneticSpeedFactor =
      item.dataset.isMagnetLocked === 'true'
        ? item.dataset.isMagnetSpeedFactor
        : 1;
    let distanceFactor = extraFactor + 0.0025 * distance;
    const speed = SPEED * delta * magneticSpeedFactor + distanceFactor;

    // Calculate incremental movement based on angle and speed
    const deltaX = Math.cos(angle) * speed;
    const deltaY = Math.sin(angle) * speed;

    // Update coin position incrementally
    incrementCustomProperty(item, '--left', deltaX);
    incrementCustomProperty(item, '--bottom', deltaY * -1);
  }
}

export function updateCoin(delta, speedScale) {
  document.querySelectorAll('[data-coin]').forEach((coin) => {
    // Get positions of the dinosaur and coin
    const dinoRect = getDinoRect();
    const coinRect = coin.getBoundingClientRect();
    // Calculate distance
    const distance = Math.sqrt(
      Math.pow(dinoRect.x - coinRect.x, 2) +
        Math.pow(dinoRect.y - coinRect.y, 2)
    );

    // If the distance is less than 40px, move the coin towards the dinosaur
    if (coin.dataset.locked === 'true' || distance < getCoinPickupRadius()) {
      moveItemToPlayer(dinoRect, coin, coinRect, distance, delta);
    } else {
      // Move the coin to the left if not close to the dinosaur
      if (coin.dataset.cloudChild) {
        incrementCustomProperty(
          coin,
          '--left',
          delta * speedScale * getPlatformSpeed() * -1
        );
      } else {
        incrementCustomProperty(
          coin,
          '--left',
          delta * speedScale * SPEED * -1
        );
      }
    }

    // Remove the coin if it goes off the screen
    if (getCustomProperty(coin, '--left') <= -100) {
      coin.remove();
    }
  });

  if (nextCoinTime <= 0 && getIsCoinsRunning()) {
    addToSpawnQueue('coin');
    isCoinSpawned = false;
    nextCoinTime =
      randomNumberBetween(
        getGroundCoinMinInterval(),
        getGroundCoinMaxInterval()
      ) / speedScale;
  }

  nextCoinTime -= delta;
}

export function getCoinRects() {
  return [...document.querySelectorAll('[data-coin]')].map((coin) => {
    return {
      id: coin.id,
      rect: coin.getBoundingClientRect(),
    };
  });
}

export function createCoins() {
  isCoinSpawned = true;
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
  element.dataset.type = selectedCollectable.type;
  element.dataset.locked = 'false';
  element.dataset.isLocking = 'false';
  element.dataset.isMagnetSpeedFactor = randomNumberBetween(1.3, 2.4);
  element.dataset.isLockingDuration = randomNumberBetween(100, 300);
  element.dataset.points = selectedCollectable.points;
  if (
    selectedCollectable.type === 'red-gem' ||
    selectedCollectable.type === 'blue-gem' ||
    selectedCollectable.type === 'green-gem'
  ) {
    element.dataset.gem = true;
  }
  element.classList.add(selectedCollectable.type, 'collectable', 'move-bottom');
  element.id = Math.random().toString(16).slice(2);
  setCustomProperty(element, '--left', 100);
  const initialKeyframe = getRandomKeyframe();
  element.style.animationDelay = `-${initialKeyframe}%`;
  worldElem.append(element);
}

export function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomKeyframe() {
  // Return a random number between 0 and 100 (percentage)
  return Math.floor(Math.random() * 101);
}

export function createSpecificCoin(coin, parentElem) {
  const coinElement = document.createElement('div');

  coinElement.dataset.coin = true;
  coinElement.dataset.type = coin.type;
  coinElement.dataset.locked = 'true';
  coinElement.dataset.points = coin.points;
  if (
    coin.type === 'red-gem' ||
    coin.type === 'blue-gem' ||
    coin.type === 'green-gem'
  ) {
    coinElement.dataset.gem = true;
  }
  coinElement.classList.add(coin.type, 'collectable', 'move-bottom');
  coinElement.id = Math.random().toString(16).slice(2);

  // Set the initial position of the coin above the dino
  coinElement.style.position = 'absolute';
  setCustomProperty(coinElement, '--left', 7);
  setCustomProperty(coinElement, '--bottom', 73.5);
  // Append the coin element to the document body or another container
  worldElem.appendChild(coinElement);
}
