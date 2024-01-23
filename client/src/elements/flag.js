import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from '../utility/updateCustomProperty.js';
import StateSingleton from '../game-state';
import { worldElem, dinoElem } from '../elements-refs.js';
import { isCollision, updateNotification } from '../game-manager.js';
import { getDinoRect } from './player-controller.js';
const {
  getGroundSpeed,
  getCurrentPhase,
  getIsFlagCreated,
  setIsFlagCreated,
  updateState,
} = StateSingleton;

let hasAlreadyPassedFlag;

export function updateFlag(delta, speedScale) {
  document.querySelectorAll('[data-flag]').forEach((flag) => {
    const flagRect = flag.getBoundingClientRect();
    const collision = isCollision(getDinoRect(), flagRect);
    const flagLeft = parseFloat(getComputedStyle(flag).left);
    const dinoLeft = parseFloat(getComputedStyle(dinoElem).left);
    const passedFlag = dinoLeft > flagLeft;

    if (collision) {
      flag.classList.remove('flag-animation');
      flag.classList.add('flag-empty');
    }

    if (passedFlag && !hasAlreadyPassedFlag) {
      updateState({
        isGroundLayer2Running: false,
      });
      updateNotification(`${getCurrentPhase()}!`, 2000, 0);
      hasAlreadyPassedFlag = true;
    }
    incrementCustomProperty(
      flag,
      '--left',
      delta * speedScale * getGroundSpeed() * -1
    );
    if (getCustomProperty(flag, '--left') <= -100) {
      flag.remove();
    }
  });

  if (getCurrentPhase() === 'bonus' && getIsFlagCreated() === false) {
    createFlag();
    setIsFlagCreated(true);
  }
}

export function getFlagRects() {
  return [...document.querySelectorAll('[data-flag]')].map((flag) => {
    return {
      id: flag.id,
      rect: flag.getBoundingClientRect(),
      flag: flag.dataset.flag,
    };
  });
}

function createFlag() {
  hasAlreadyPassedFlag = false;
  const flag = document.createElement('div');
  flag.dataset.flag = true;
  flag.classList.add('flag', 'flag-animation');
  flag.id = Math.random().toString(16).slice(2);
  setCustomProperty(flag, '--left', 100);
  worldElem.append(flag);
}
