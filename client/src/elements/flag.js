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
import { isCollision, updateNotification } from '../game-manager.js';
import { getDinoRect } from './player-controller.js';
import starImg from '../public/imgs/icons/Star.png';

const {
  getGroundSpeed,
  getCurrentPhase,
  getIsFlagCreated,
  setIsFlagCreated,
  updateState,
} = StateSingleton;

let hasAlreadyPassedFlag;

function generateDigitWithStars(digit) {
  const digits = [
    ` <img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<br>
<div class="flex justify-between digit-container-top">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
</div><br>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>`, // 0

    ` 
    <div class="flex-col items-center"><img class="digit-star" src="${starImg}"/>
<br>
  <img class="digit-star" src="${starImg}"/>
<br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
</div><br>
</div>`, // 1

    ` <img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<br>
<div class="flex justify-end digit-container-top">
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
</div><br>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>`, // 2

    ` <img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<br>
<div class="flex justify-end digit-container-top">
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-end">
  <img class="digit-star" src="${starImg}"/>
</div><br>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>`, // 3

    ` <div class="flex justify-between">
    <img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
</div>
<br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
</div><br>
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<br>
<div class="flex justify-end digit-container-top">
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-end">
<img class="digit-star" src="${starImg}"/>
</div>`, // 4

    `<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<br>
<div class="flex justify-start digit-container-top">
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-end">
  <img class="digit-star" src="${starImg}"/>
</div><br>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>`, // 5

    `<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<br>
<div class="flex justify-start digit-container-top">
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
</div><br>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>`, // 6

    `<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<br>
<div class="flex-col items-end digit-container-top">
  <img class="digit-star" src="${starImg}"/>
<br>
  <img class="digit-star" src="${starImg}"/>
  <br>
<img class="digit-star" src="${starImg}"/>
<br>
  <img class="digit-star" src="${starImg}"/>
<br>
</div>`, // 7

    ` <img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<br>
<div class="flex justify-between digit-container-top">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
</div><br>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>`, // 8

    `<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<br>
<div class="flex justify-between digit-container-top">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-end">
  <img class="digit-star" src="${starImg}"/>
</div><br>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>`, // 9

    ` <div class="flex-row" style="gap: 50px">

    <div class="flex-col items-center">
    <img class="digit-star" src="${starImg}"/>
<br>
  <img class="digit-star" src="${starImg}"/>
<br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
</div><br>
</div>

    <div><img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<br>
<div class="flex justify-between digit-container-top">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
</div><br>
<div class="flex justify-between">
  <img class="digit-star" src="${starImg}"/>
  <img class="digit-star" src="${starImg}"/>
</div><br>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/>
<img class="digit-star" src="${starImg}"/> 
</div>
    
</div>`, // 10
    // Add similar lines for other digits
  ];

  if (digit >= 0 && digit <= 10) {
    return digits[digit];
  } else {
    return 'Invalid digit';
  }
}

// const digitZero = generateDigitWithStars(10);
// const digitContainer = document.getElementById('digitContainer');
// digitContainer.innerHTML = digitZero;

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
      worldElem.classList.add('whiteout-screen');
      bonusElem.setAttribute('transition-style', 'out:circle:bottom-left');
      scoreElem.classList.add('white-out-text');
      currentGameTimerElem.classList.add('white-out-text');
      // updateNotification(`${getCurrentPhase()}!`, 2000, 0);
      hasAlreadyPassedFlag = true;

      // Example usage:
      setTimeout(() => {
        const digitZero = generateDigitWithStars(10);
        const digitContainer = document.getElementById('digitContainer');
        digitContainer.innerHTML = digitZero;
      }, 300);
      setTimeout(() => {
        digitContainer.innerHTML = '';
      }, 3800);
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
