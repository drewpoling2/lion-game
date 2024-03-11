import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from '../utility/updateCustomProperty.js';
import StateSingleton from '../game-state';
import {
  worldElem,
  dinoElem,
  bonusElem,
  currentGameTimerElem,
  scoreElem,
} from '../elements-refs.js';
import { handleWin, isCollision, updateNotification } from '../game-manager.js';
import { getDinoRect } from './player-controller.js';
import starImg from '../public/imgs/icons/Star.png';

const {
  getGroundSpeed,
  getIsCastleCreated,
  setIsCastleCreated,
  getIsWon,
  updateState,
} = StateSingleton;

export function setupCastle() {
  document.querySelectorAll('[data-castle]').forEach((castle) => {
    castle.remove();
  });
}

// const digitZero = generateDigitWithStars(10);
// const digitContainer = document.getElementById('digitContainer');
// digitContainer.innerHTML = digitZero;

export function updateCastle(delta, speedScale) {
  document.querySelectorAll('[data-castle]').forEach((castle) => {
    const castleRect = castle.getBoundingClientRect();
    const collision = isCollision(getDinoRect(), castleRect);
    const castleLeft = parseFloat(getComputedStyle(castle).left);
    const dinoLeft = parseFloat(getComputedStyle(dinoElem).left);
    const passedCastle = dinoLeft > castleLeft;

    if (collision && !getIsWon()) {
      handleWin();
    }

    incrementCustomProperty(
      castle,
      '--left',
      delta * speedScale * getGroundSpeed() * -1
    );

    if (getCustomProperty(castle, '--left') <= -100) {
      castle.remove();
    }
  });

  if (!getIsCastleCreated()) {
    createCastle();
    setIsCastleCreated(true);
  }
}

export function getCastleRects() {
  return [...document.querySelectorAll('[data-castle]')].map((castle) => {
    return {
      id: castle.id,
      rect: castle.getBoundingClientRect(),
      castle: castle.dataset.castle,
    };
  });
}

function createCastle() {
  const castle = document.createElement('div');
  castle.dataset.castle = true;
  castle.classList.add('castle', 'castle-animation');
  castle.id = Math.random().toString(16).slice(2);
  castle.textContent = 'castle';
  setCustomProperty(castle, '--left', 100);
  worldElem.append(castle);
  updateState({ ...initialState });
}

const initialState = {
  isCoinsRunning: false,
  isPlatformRunning: false,
  isCactusRunning: false,
  isBirdRunning: false,
  isGroundEnemyRunning: false,
  isCrateRunning: false,
  isBonusRunning: false,
  isCastleRunning: false,
};
