import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';
import { getDinoRect } from './player-controller';
import { collectableOptions } from '../game-manager';
import StateSingleton from '../game-state';

const { getMagnetSpeedFactor, getIsCoinsRunning } = StateSingleton;
const coinPositions = [];

const SPEED = 0.05;
const COIN_INTERVAL_MIN = 75;
const COIN_INTERVAL_MAX = 400;
const worldElem = document.querySelector('[data-world]');

let nextCoinTime;

export function setupCoin() {
  nextCoinTime = COIN_INTERVAL_MIN;
  document.querySelectorAll('[data-coin]').forEach((coin) => {
    coin.remove();
  });
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
    if (coin.dataset.locked === 'true' || distance < 225) {
      // Enter the locking phase
      if (coin.dataset.isLocking === 'false') {
        const angle = Math.atan2(
          dinoRect.y - coinRect.y,
          dinoRect.x - coinRect.x
        );
        let distanceFactor = 0.0025 * distance;

        const speed = SPEED * delta * distanceFactor;
        // Additional logic to move the coin in the opposite direction before locking
        const oppositeDirectionX = Math.cos(angle) * speed * -1 * 2;
        const oppositeDirectionY = Math.sin(angle) * speed * 2;

        incrementCustomProperty(coin, '--left', oppositeDirectionX);
        incrementCustomProperty(coin, '--bottom', oppositeDirectionY);

        setTimeout(() => {
          coin.dataset.locked = 'true';
          coin.dataset.isLocking = 'true';
        }, coin.dataset.isLockingDuration); // Adjust the timeout duration as needed
      } else {
        //lock the coin on the player
        coin.dataset.locked = 'true';
        const angle = Math.atan2(
          dinoRect.y - coinRect.y,
          dinoRect.x - coinRect.x
        );
        let magneticSpeedFactor =
          coin.dataset.isMagnetLocked === 'true'
            ? coin.dataset.isMagnetSpeedFactor
            : 1;
        let distanceFactor = 0.0025 * distance;
        const speed = SPEED * delta * magneticSpeedFactor + distanceFactor;

        // Calculate incremental movement based on angle and speed
        const deltaX = Math.cos(angle) * speed;
        const deltaY = Math.sin(angle) * speed;

        // Update coin position incrementally
        incrementCustomProperty(coin, '--left', deltaX);
        incrementCustomProperty(coin, '--bottom', deltaY * -1);
      }
    } else {
      // Move the coin to the left if not close to the dinosaur
      incrementCustomProperty(coin, '--left', delta * speedScale * SPEED * -1);
    }

    // Remove the coin if it goes off the screen
    if (getCustomProperty(coin, '--left') <= -100) {
      coin.remove();
    }
  });

  if (nextCoinTime <= 0 && getIsCoinsRunning()) {
    createCoins();
    nextCoinTime =
      randomNumberBetween(COIN_INTERVAL_MIN, COIN_INTERVAL_MAX) / speedScale;
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

function createCoins() {
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
  element.classList.add(selectedCollectable.type, 'collectable', 'move-bottom');
  element.id = Math.random().toString(16).slice(2);
  setCustomProperty(element, '--left', 100);
  const initialKeyframe = getRandomKeyframe();
  element.style.animationDelay = `-${initialKeyframe}%`;
  worldElem.append(element);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomKeyframe() {
  // Return a random number between 0 and 100 (percentage)
  return Math.floor(Math.random() * 101);
}
