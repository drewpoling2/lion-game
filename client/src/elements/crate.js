import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';
import crate1Img from '../public/imgs/Crate/Crate-1.png';
import crate2Img from '../public/imgs/Crate/Crate-2.png';
import { getDinoRect } from './player-controller';
import { normalizeWeights, getRandomWeighted } from './platform';
import { addCratePointsText, updateMultiplierInterface } from '../game-manager';
import StateSingleton from '../game-state';
import ItemDropStateSingleton from '../item-drop-state';
import InterfaceTextElemsSingleton from '../interface-text-elems-state';
import { createCrateItemsAboveCrate } from '../utility/crate-items';
import { worldElem } from '../elements-refs';
import { moveItemToPlayer } from './coin';
const {
  getIsCrateRunning,
  getGroundSpeed,
  getMultiplierRatio,
  setMultiplierRatio,
} = StateSingleton;
const {
  getItemDropState,
  setNormalizedItemDropState,
  getNormalizedItemDropState,
} = ItemDropStateSingleton;

const SPEED = getGroundSpeed();
const crate_INTERVAL_MIN = 1000;
const crate_INTERVAL_MAX = 1500;

let nextCrateTime;
export function setupCrate() {
  nextCrateTime = crate_INTERVAL_MIN;
  document.querySelectorAll('[data-crate]').forEach((crate) => {
    crate.remove();
  });
}

export function isCrateCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

const { addInterfaceTextElem, removeInterfaceTextElem } =
  InterfaceTextElemsSingleton;

export function createCratePoofParticles(parent) {
  const element = document.createElement('div');
  addInterfaceTextElem(element);
  element.classList.add(`crate-poof-particles`);
  element.id = Math.random().toString(16).slice(2);
  setCustomProperty(
    element,
    '--bottom',
    getCustomProperty(parent, '--bottom') + 5
  );
  worldElem.appendChild(element);

  element.addEventListener('animationend', () => {
    removeInterfaceTextElem(element);
    element.remove();
  });
}

export function updateCrate(delta, speedScale) {
  const dinoRect = getDinoRect();

  document
    .querySelectorAll('[data-crate-container]')
    .forEach((crateContainer) => {
      // Get positions of the dinosaur and crate
      const crateContainerRect = crateContainer.getBoundingClientRect();
      const collision = isCrateCollision(dinoRect, crateContainerRect);
      if (collision && !crateContainer.dataset.didCollide) {
        const crate = crateContainer.querySelector('img');
        crate.src = crate2Img;
        crateContainer.dataset.didCollide = true;
        createCrateItemsAboveCrate(
          getRandomWeighted(getNormalizedItemDropState()),
          crateContainer
        );
        createCratePoofParticles(crateContainer);
        const newElement = document.createElement('div');
        addCratePointsText(newElement, crateContainer);
        let currentMultiplierRatio = getMultiplierRatio();
        setMultiplierRatio((currentMultiplierRatio += 1));
        updateMultiplierInterface();
      }
      incrementCustomProperty(
        crateContainer,
        '--left',
        delta * speedScale * SPEED * -1
      );
      if (getCustomProperty(crateContainer, '--left') <= -100) {
        crateContainer.remove();
      }
    });

  const crateItems = document.querySelectorAll('[data-crate-item]');
  // if any crate items exist then move them to player
  if (crateItems.length > 0) {
    crateItems.forEach((crateItem) => {
      incrementCustomProperty(
        crateItem,
        '--left',
        delta * speedScale * SPEED * -1
      );
      if (crateItem.dataset.itemLocked) {
        const crateItemRect = crateItem.getBoundingClientRect();
        // Calculate distance
        const distance = Math.sqrt(
          Math.pow(dinoRect.x - crateItemRect.x, 2) +
            Math.pow(dinoRect.y - crateItemRect.y, 2)
        );
        moveItemToPlayer(
          dinoRect,
          crateItem,
          crateItemRect,
          distance,
          delta,
          0.15
        );
      }
    });
  }
  if (nextCrateTime <= 0 && getIsCrateRunning()) {
    createCrate();
    nextCrateTime =
      randomNumberBetween(crate_INTERVAL_MIN, crate_INTERVAL_MAX) / speedScale;
  }
  nextCrateTime -= delta;
}

export function getCrateRects() {
  return [...document.querySelectorAll('[data-crate]')].map((crate) => {
    return crate.getBoundingClientRect();
  });
}

setNormalizedItemDropState(normalizeWeights(getItemDropState()));
function createCrate() {
  const crate = document.createElement('img');
  const parentContainer = document.createElement('div');
  parentContainer.dataset.crateContainer = true;
  parentContainer.classList.add('crate-parent-container');

  crate.src = crate1Img;
  crate.dataset.crate = true;
  crate.classList.add('crate', 'game-element');
  crate.id = `crate-${Math.random()}`;
  parentContainer.append(crate);
  setCustomProperty(parentContainer, '--left', 100);
  worldElem.append(parentContainer);
}
export function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
