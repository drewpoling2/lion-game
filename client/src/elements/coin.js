import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';

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
    incrementCustomProperty(coin, '--left', delta * speedScale * SPEED * -1);
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
  { type: 'gold-coin', weight: 0.6, points: 46 },
  { type: 'green-gem', weight: 0.1, points: 325 },
  { type: 'red-coin', weight: 0.3, points: 82 },
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
  element.dataset.points = selectedCollectable.points;
  element.classList.add(selectedCollectable.type, 'collectable');
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
