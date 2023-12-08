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

function createCoins() {
  const coin = document.createElement('div');
  coin.dataset.coin = true;
  coin.textContent = 'c';
  coin.classList.add('coin', 'floating-item');
  coin.id = Math.random().toString(16).slice(2);
  setCustomProperty(coin, '--left', 100);

  worldElem.append(coin);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
