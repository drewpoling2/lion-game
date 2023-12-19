import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';
import { getDinoRect } from './dino';

const coinPositions = [];

const SPEED = 0.05;
const COIN_INTERVAL_MIN = 75;
const COIN_INTERVAL_MAX = 1200;
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
      //lock the coin on the player
      coin.dataset.locked = 'true';
      const angle = Math.atan2(
        dinoRect.y - coinRect.y,
        dinoRect.x - coinRect.x
      );
      const speed = SPEED * delta * speedScale;

      // Calculate incremental movement based on angle and speed
      const deltaX = Math.cos(angle) * speed * 1.75;
      const deltaY = Math.sin(angle) * speed * 1.75;

      // Update coin position incrementally
      incrementCustomProperty(coin, '--left', deltaX);
      incrementCustomProperty(coin, '--bottom', deltaY * -1);
    } else {
      // Move the coin to the left if not close to the dinosaur
      incrementCustomProperty(coin, '--left', delta * speedScale * SPEED * -1);
    }

    // Remove the coin if it goes off the screen
    if (getCustomProperty(coin, '--left') <= -100) {
      coin.remove();
    }
  });

  if (nextCoinTime <= 0) {
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

const collectableOptions = [
  { type: 'gold-coin', weight: 0.3, points: 82 },
  { type: 'red-gem', weight: 0.1, points: 325 },
  { type: 'silver-coin', weight: 0.6, points: 46 },
];

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
  element.dataset.locked = 'false';
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
