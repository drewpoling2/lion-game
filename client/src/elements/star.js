import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';

const SPEED = 0.05;
const STARS_INTERVAL_MIN = 1000;
const STARS_INTERVAL_MAX = 1300;
const worldElem = document.querySelector('[data-world]');

let nextStarTime;
export function setupStar() {
  nextStarTime = STARS_INTERVAL_MIN;
  document.querySelectorAll('[data-star]').forEach((star) => {
    star.remove();
  });
}

export function updateStar(delta, speedScale) {
  document.querySelectorAll('[data-star]').forEach((star) => {
    incrementCustomProperty(star, '--left', delta * speedScale * SPEED * -1);
    if (getCustomProperty(star, '--left') <= -100) {
      star.remove();
    }
  });

  if (nextStarTime <= 0) {
    createStars();
    nextStarTime =
      randomNumberBetween(STARS_INTERVAL_MIN, STARS_INTERVAL_MAX) / speedScale;
  }
  nextStarTime -= delta;
}

export function getStarRects() {
  return [...document.querySelectorAll('[data-star]')].map((star) => {
    return {
      id: star.id,
      rect: star.getBoundingClientRect(),
      star: star.dataset.star,
    };
  });
}

function createStars() {
  const star = document.createElement('div');
  star.dataset.star = true;
  star.textContent = 'star';
  star.classList.add('star', 'bouncing-item');
  star.id = Math.random().toString(16).slice(2);
  setCustomProperty(star, '--left', 100);
  worldElem.append(star);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
