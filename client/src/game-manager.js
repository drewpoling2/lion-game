import { updateGround, setupGround } from './elements/ground.js';
import {
  updateGroundLayerTwo,
  setupGroundLayerTwo,
} from './elements/groundLayerTwo';
import {
  updateGroundLayerTwoTwo,
  setupGroundLayerTwoTwo,
} from './elements/groundLayerTwoTwo';
import {
  updateGroundLayerThree,
  setupGroundLayerThree,
} from './elements/groundLayerThree';
import {
  updateDino,
  setupDino,
  getDinoRect,
  setDinoLose,
  handleIdle,
} from './elements/player-controller.js';
import {
  updateCactus,
  setupCactus,
  getCactusRects,
} from './elements/cactus.js';
import {
  updateGroundEnemy,
  setupGroundEnemy,
  getGroundEnemyRects,
} from './elements/ground-enemy';
import { updateBird, setupBird, getBirdRects } from './elements/bird.js';
import {
  updatePlatform,
  setupPlatform,
  getPlatformRects,
} from './elements/platform.js';
import { createLeaderboard, getSuffix } from './elements/leaderboard.js';
import { soundController } from './utility/sound-controller.js';
import {
  getAllHighScoreUsers,
  handleNewHighScore,
  handleSortAndDeleteLastEntry,
} from './apis.js';
import { validateInput } from './utility/validate-input.js';
import {
  setupMultiplier,
  updateMultiplier,
  getMultiplierRects,
} from './elements/score-multiplier.js';
import {
  setupMagnet,
  getMagnetRects,
  updateMagnet,
} from './elements/magnet.js';
import { getHeartRects } from './elements/heart.js';
import { getLeafRects } from './elements/leaf.js';
import { getFlagRects, updateFlag } from './elements/flag.js';
import { setupStar, updateStar, getStarRects } from './elements/star.js';
import { setupCoin, updateCoin, getCoinRects } from './elements/coin.js';
import muteImg from './public/imgs/icons/Speaker-Off.png';
import unmuteImg from './public/imgs/icons/Speaker-On.png';
import pauseImg from './public/imgs/icons/Pause.png';
import playImg from './public/imgs/icons/Play.png';
import glasses from './public/imgs/buffs/glasses.png';
import redoImg from './public/imgs/icons/Redo.png';
import foregroundImg from './public/imgs/backgrounds/Foreground-Trees.png';
import { createBuffs, createStarterBuffs } from './elements/buff.js';
import StateSingleton from './game-state.js';
import {
  worldElem,
  scoreElem,
  highScoreElem,
  startScreenElem,
  endScreenElem,
  gameOverTextElem,
  gameOverIconElem,
  leaderboardElem,
  scoreMultiplierElem,
  scoreNewHighScoreElem,
  scoreErrorMessageElem,
  multiplierTimerElem,
  tickerElem,
  tickerElem2,
  tickerElem3,
  livesElem,
  dinoElem,
  scrollableTableElem,
  currentMultiplierElem,
  plusPointsElem,
  tickerContainerElem,
  loadingTextElem,
  submitNewScoreFormElem,
  interfaceComboContainer,
  currentMultiplierScoreElem,
  currentComboScoreContainer,
  timerProgress,
  currentGameTimerElem,
  gameLoadingScreenElem,
  gameLoadingTextElem,
  gameNotificationElem,
  pausedScreenElem,
} from './elements-refs';
import { toggleElemOff, toggleElemOn } from './utility/toggle-element.js';
import { snow } from './elements/particle-systems.js';
import { phases } from './phases/phase-properties.js';
import { updatePhase1 } from './phases/phase1.js';
import { updatePhase2 } from './phases/phase2.js';
import { updateBonusPhase } from './phases/bonus-phase.js';
import { setupBonusLayer, updateBonusLayer } from './elements/bonus-layer.js';
import { updateInterfaceText } from './utility/update-interface-text.js';
import InterfaceTextElemsSingleton from './interface-text-elems-state.js';
import { getCherryRects } from './elements/cherry';
const { removeInterfaceTextElem, addInterfaceTextElem } =
  InterfaceTextElemsSingleton;
const {
  setMultiplierRatio,
  getMultiplierRatio,
  getTimerInterval,
  setTimerInterval,
  setMultiplierTimer,
  getMultiplierTimer,
  getSpeedScale,
  getSpeedScaleIncrease,
  getStarDuration,
  getPlayerImmunity,
  setPlayerImmunity,
  getHasStar,
  setHasStar,
  getGravityFallAdjustment,
  setGravityFallAdjustment,
  getSelectedStarter,
  setSelectedStarter,
  getCurrentPhase,
  setJumpCountLimit,
  getLeafDuration,
  setHasLeaf,
  setCherryPoints,
  getCherryPoints,
} = StateSingleton;
const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 45;
export let SPEED_SCALE_INCREASE = 0.00001;

let showLeaderboard = false;

// const playAgainButtonElem = document.querySelector('[data-play-again]');

// playAgainButtonElem.addEventListener('click', function () {
//   handleStart(); // Add any other actions you want to perform on button click
// });
setPixelToWorldScale();
createLeaderboard(leaderboardElem);
snow.init();
window.addEventListener('resize', setPixelToWorldScale);
document.addEventListener('keydown', handleStart, { once: true });
document.addEventListener('touchstart', handleStart, { once: true });
let lastTime;
let score;
let idleIntervalId;
let collisionOccurred = false; // Flag to track collision
let milestone = 100000;
//init highScore elem
highScoreElem.textContent = localStorage.getItem('lion-high-score')
  ? localStorage.getItem('lion-high-score')
  : Math.floor('0').toString().padStart(6, 0);
let hasBeatenScore = false;
let isPaused = false;
let immunityDuration = 2000; // Example: 2000 milliseconds (2 seconds)
scrollableTableElem.classList.add('hide-element');
scrollableTableElem.style.display = 'none';
worldElem.setAttribute('transition-style', 'in:circle:center');
tickerContainerElem.classList.add('hide-element');
tickerContainerElem.classList.remove('show-element');
const pauseIconButton = document.getElementById('pause-icon-button');

const shareContainer = document.getElementById('share-container');
const shareButton = document.getElementById('shareButton');

shareContainer.addEventListener('mouseenter', () => {
  shareButton.classList.add('transparent-background');
});

shareContainer.addEventListener('mouseleave', () => {
  shareButton.classList.remove('transparent-background');
});

// function typeLoadingText(elem) {
//   setTimeout(() => {
//     typeLettersWithoutSpaces(0, '...Oh no', elem, 100);
//   }, 400);
//   setTimeout(() => {
//     // Set white-space CSS style to allow line breaks
//     elem.style.whiteSpace = 'pre-line';
//     // Add a line break before the second line
//     elem.textContent += '\n';
//     typeLettersWithoutSpaces(0, 'Gotta get to class!', elem, 100);
//   }, 3000);
// }

// typeLoadingText(gameLoadingTextElem);

function copyCurrentLink() {
  var input = document.createElement('input');
  input.value = window.location.href;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);

  // Change the button text to "Copied!"
  document.getElementById('copy-link-button').textContent = 'Copied!';

  // Change it back to "Copy link" after a delay (e.g., 2 seconds)
  setTimeout(function () {
    document.getElementById('copy-link-button').textContent = 'Copy link';
  }, 2000);
}

if (document.getElementById('copy-link-button')) {
  document
    .getElementById('copy-link-button')
    .addEventListener('click', copyCurrentLink);
}

const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', function () {
  togglePause();
  if (pausedScreenElem.style.display === 'flex') {
    pausedScreenElem.style.display = 'none';
  } else {
    pausedScreenElem.style.display = 'flex';
  }
  pauseButton.blur();
});

let immunityTimeout;

// Function to set player immunity
function setTimedPlayerImmunity(duration) {
  setPlayerImmunity(true);
  // Clear any existing timeout
  clearTimeout(immunityTimeout);

  // Set a new timeout
  immunityTimeout = setTimeout(
    () => {
      setPlayerImmunity(false);
    },
    duration ? duration : immunityDuration
  );

  // Check if getHasStar is true, and cancel the timeout if needed
  if (getHasStar()) {
    clearTimeout(immunityTimeout);
  }
}

idleIntervalId = setInterval(handleIdle, 300);

function updateElements() {}

let deltaAdjustment = 1;
let currentSpeedScale = getSpeedScale();
let isUpdatedSpeedScale = false;
let decelerationFactor = 0.95; // Adjust the deceleration factor as needed

function deleteLetters(index, elem, timeout) {
  const text = elem.textContent;
  if (index >= 0) {
    elem.textContent = text.substring(0, index);
    setTimeout(() => {
      deleteLetters(index - 1, elem, timeout);
    }, timeout); // Use the provided timeout
  } else {
  }
}

export function updateNotification(
  notification,
  deleteLettersDelay = 3000,
  typeLettersDelay = 1000
) {
  const timeout = 125;
  setTimeout(() => {
    typeLettersWithoutSpaces(0, notification, gameNotificationElem, 100);
    // After a delay, start deleting the letters in reverse order

    setTimeout(() => {
      deleteLetters(
        gameNotificationElem.textContent.length - 1,
        gameNotificationElem,
        timeout
      );
    }, deleteLettersDelay);
  }, typeLettersDelay);
}

function checkCollisions() {
  if (checkLose()) return handleLose();
  checkMultiplierCollision();
  checkCoinCollision();
  checkStarCollision();
  checkCherryCollision();
  checkHeartCollision();
  checkMagnetCollision();
  checkLeafCollision();
}

const phaseUpdateFunctions = {
  1: updatePhase1,
  bonus: updateBonusPhase,
  2: updatePhase2,
};

function update(time) {
  if (isPaused) {
    // Do nothing if the game is paused
    return;
  }

  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }

  let baseDelta = 15;
  // let delta = time - lastTime;
  let delta = baseDelta;
  if (collisionOccurred && !getPlayerImmunity()) {
    setTimedPlayerImmunity();
    togglePause();
    setTimeout(() => {
      collisionOccurred = false; // Reset the collision flag after the delay
      togglePause();
    }, 400);
    return; // Pause the update during the delay
  }

  const updateFunction = phaseUpdateFunctions[getCurrentPhase()];
  if (updateFunction) {
    updateFunction(timer, delta, currentSpeedScale);
  }
  updateGroundLayerTwoTwo(delta, currentSpeedScale);
  updateBonusLayer(delta, currentSpeedScale);
  updateGround(delta, currentSpeedScale);
  updateGroundLayerThree(delta, currentSpeedScale);
  updateGroundLayerTwo(delta, currentSpeedScale);
  // updateCactus(delta, currentSpeedScale);
  // updateBird(delta, currentSpeedScale);
  // updateGroundEnemy(delta, currentSpeedScale);
  updatePlatform(delta, currentSpeedScale);
  // updateFlag(delta, currentSpeedScale);
  updateInterfaceText(delta, currentSpeedScale);
  // updateMultiplier(delta, currentSpeedScale);
  // updateMagnet(delta, currentSpeedScale);
  // updateCoin(delta, currentSpeedScale);
  updateDino(
    delta,
    currentSpeedScale,
    getGravityFallAdjustment(),
    getSelectedStarter()
  );
  updateSpeedScale(delta);
  updateScore(delta);

  checkCollisions();
  lastTime = time;
  window.requestAnimationFrame(update);
}

function createOneUpText(element) {
  soundController.beatScore.play();
  const newElement = document.createElement('div');
  newElement.classList.add('one-up', 'sans');
  newElement.style.position = 'absolute';
  element.appendChild(newElement);
  newElement.textContent = '1UP';
  newElement.addEventListener('animationend', () => {
    newElement.remove();
  });
  return true;
}

let currentComboScore = 0; // Initialize the current combo score variable

function resetMultiplier() {
  toggleElemOff(interfaceComboContainer);
  toggleElemOff(currentComboScoreContainer);
  clearInterval(getTimerInterval());
  setTimerInterval(null);
  currentComboScore = 0;
  timerProgress.style.width = '100%'; // Set the progress bar to full width
  setMultiplierTimer(5000);
  currentMultiplierElem.textContent = 'x1';
  currentMultiplierScoreElem.textContent = '0';
  setMultiplierRatio(1);
}

function startMultiplierTimer() {
  clearInterval(getTimerInterval());
  setMultiplierTimer(5000);
  const timerInterval = setInterval(() => {
    setMultiplierTimer(getMultiplierTimer() - 100); // Subtract 100 milliseconds (adjust as needed)
    const progressValue = (getMultiplierTimer() / 5000) * 100; // Calculate progress value

    if (getMultiplierTimer() <= 0) {
      resetMultiplier();
    } else {
      timerProgress.style.width = `${progressValue}%`;
    }
  }, 100); // Update every 100 milliseconds
  setTimerInterval(timerInterval);
}

function checkMultiplierCollision() {
  const dinoRect = getDinoRect();
  getMultiplierRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      // soundController.beatScore.play();
      document.getElementById(element.id).remove();
      let currentMultiplierRatio = getMultiplierRatio();
      // Multiply the existing multiplier by the newly collided multiplier
      if (currentMultiplierRatio === 1) {
        currentMultiplierRatio += parseInt(element.multiplier) - 1;
        setMultiplierRatio(currentMultiplierRatio);
      } else {
        currentMultiplierRatio += parseInt(element.multiplier);
        setMultiplierRatio(currentMultiplierRatio);
      }
      updateMultiplierInterface();
      return true;
    }
  });
}

export function updateMultiplierInterface() {
  toggleElemOn(interfaceComboContainer);
  toggleElemOn(currentComboScoreContainer);
  clearInterval(getTimerInterval());
  startMultiplierTimer();
  currentMultiplierElem.textContent = `x${getMultiplierRatio()}`;
}

const duration = 1000;
const updateInterval = 50;

function randomArc(element) {
  // Set random horizontal movement values
  const randomXEnd = Math.random() * 100 - 50; // Adjust the range based on your preference
  document.documentElement.style.setProperty(
    '--random-x-end',
    randomXEnd + 'px'
  );
}

function calculateFontSize(points) {
  return Math.min(12 + points * 0.01, 36);
}

let goldCoinCounter = 0;
let redGemMultiplier = 1;

function checkCoinCollision() {
  const dinoRect = getDinoRect();
  getCoinRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      const coinElement = document.getElementById(element.id);
      if (
        coinElement.dataset.type === 'gold-coin' &&
        goldCoinCounter < 14 &&
        getSelectedStarter() === 'Glasses'
      ) {
        // Increment the counter and update the value of the next red gem
        goldCoinCounter++;
        redGemMultiplier = goldCoinCounter;

        // Check if glasses buff div exists, otherwise create it
        const glassesBuffDiv = document.querySelector(
          '.top-hud-right .glasses-buff'
        );

        if (!glassesBuffDiv) {
          createGlassesBuffDiv(glasses);
        }

        // Update the glasses buff div with the current counter
        updateGlassesBuffDiv(goldCoinCounter);
      }
      // Create a pickup text element
      const newElement = document.createElement('div');
      addPickupText(newElement, coinElement);
      coinElement.remove();
      setTimeout(() => {
        newElement.remove();
      }, 600);

      // Remove the coin and update points
      soundController.pickupCoin.play();
      return true;
    }
  });
}

function createOneUpTextAtPosition(position) {
  soundController.beatScore.play();
  const newElement = document.createElement('div');
  newElement.classList.add('one-up', 'moving-interface-text');
  newElement.style.position = 'absolute';
  newElement.dataset.interfaceText = true;
  // Set the position based on the provided coordinates
  newElement.style.top = `${position.y - 100}px`;
  worldElem.appendChild(newElement);
  newElement.textContent = '1UP';

  // Store the created element in the array
  addInterfaceTextElem(newElement);

  // Listen for the animationend event to remove the element
  newElement.addEventListener('animationend', () => {
    newElement.remove();
    removeInterfaceTextElem(newElement);
  });

  return true;
}

function checkHeartCollision() {
  const dinoRect = getDinoRect();
  getHeartRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      const collisionPosition = { x: dinoRect.x, y: dinoRect.y };

      let currentLives = parseInt(livesElem.textContent, 10);
      currentLives += 1;
      livesElem.textContent = currentLives;
      const heartElement = document.getElementById(element.id);
      createOneUpTextAtPosition(collisionPosition);
      heartElement.remove();
      // // Add a class to dinoElem

      // // Set a timeout to remove the class after the star duration
      // setTimeout(() => {

      //   // Remove the class from dinoElem after the star duration
      // }, 100);

      return true;
    }
  });
}

function checkLeafCollision() {
  const dinoRect = getDinoRect();
  getLeafRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      const leaf = document.getElementById(element.id);
      setHasLeaf(true);
      setJumpCountLimit(4);
      leaf.remove();
      setTimeout(() => {
        setHasLeaf(false);
        setJumpCountLimit(1);
      }, getLeafDuration());
      return true;
    }
  });
}

function checkCherryCollision() {
  const dinoRect = getDinoRect();
  getCherryRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      const cherryElement = document.getElementById(element.id);
      // Create a pickup text element
      const newElement = document.createElement('div');
      if (!(getCherryPoints() >= 8000)) {
        if (cherryElement.dataset.points != getCherryPoints()) {
          cherryElement.dataset.points = getCherryPoints();
        }
        setCherryPoints(getCherryPoints() * 2);
      }
      addPickupText(newElement, cherryElement);
      cherryElement.remove();
      return true;
    }
  });
}

function checkStarCollision() {
  const dinoRect = getDinoRect();
  getStarRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      const starElement = document.getElementById(element.id);
      starElement.remove();
      setHasStar(true);
      // Add a class to dinoElem
      dinoElem.classList.add('star-invincible');

      // Set a timeout to remove the class after the star duration
      setTimeout(() => {
        setHasStar(false);
        setPlayerImmunity(false);
        // Remove the class from dinoElem after the star duration
        dinoElem.classList.remove('star-invincible');
      }, getStarDuration());
      setTimedPlayerImmunity(getStarDuration());

      return true;
    }
  });
}

function checkMagnetCollision() {
  const dinoRect = getDinoRect();
  getMagnetRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      const magnetElement = document.getElementById(element.id);
      magnetElement.remove();
      document.querySelectorAll('[data-coin]').forEach((coin) => {
        coin.dataset.locked = 'true';
        coin.dataset.isMagnetLocked = 'true';
        coin.dataset.isLocking === 'false';
      });
      return true;
    }
  });
}

// setTimeout(() => {
//   collisionOccurred = false;
//   dinoElem.classList.remove('flash-animation');
//   dinoElem.classList.add('flash-light-animation');
// }, 400);
// setTimeout(() => {
//   collisionOccurred = false;
//   dinoElem.classList.remove('flash-light-animation');
// }, 1600);

// Function to create glasses buff div
function createGlassesBuffDiv(imgSrc) {
  const topHudRightDiv = document.querySelector('.top-hud-right');
  const glassesBuffDiv = document.createElement('div');
  glassesBuffDiv.id = 'glasses-buff-container';
  glassesBuffDiv.classList.add('glasses-buff', 'hide-element');
  topHudRightDiv.appendChild(glassesBuffDiv);
  // Create an img element with the specified src
  const imgElement = document.createElement('img');
  imgElement.classList.add('buff-icon', 'w-full');
  imgElement.src = imgSrc; // Set the src attribute with the provided imgSrc

  const buffStackDiv = document.createElement('div');
  buffStackDiv.classList.add(
    'glasses-buff-stacks',
    'buff-stacks',
    'power-up-rank'
  );
  buffStackDiv.id = `glasses-buff`;
  buffStackDiv.textContent = '0';
  // Append the img element to the bordered div
  const borderedDiv = document.createElement('div');
  borderedDiv.classList.add(
    'bordered-buff-div',
    'relative',
    'small-border-inset'
  );
  borderedDiv.appendChild(imgElement);
  borderedDiv.appendChild(buffStackDiv);
  // Append the bordered div to the glasses buff div
  glassesBuffDiv.appendChild(borderedDiv);

  // Append the glasses buff div to the top hud
}

// Function to update glasses buff div with the current counter
function updateGlassesBuffDiv(counter) {
  const glassesBuffStackDiv = document.getElementById('glasses-buff');
  if (glassesBuffStackDiv) {
    if (glassesBuffStackDiv.textContent === '0') {
      const glassesBuffDiv = document.getElementById('glasses-buff-container');
      glassesBuffDiv.classList.remove('hide-element');
      glassesBuffDiv.classList.add('show-element');
    }
    glassesBuffStackDiv.textContent = counter;
  }
}

const lastMultiplierScore = document.querySelector(
  '[data-last-multiplier-score]'
);

function addPickupText(text, pickupElement) {
  text.classList.add('plus-points', 'sans');
  text.style.position = 'absolute';
  text.style.left = pickupElement.offsetLeft + 'px';
  text.style.top = pickupElement.offsetTop - 70 + 'px';
  randomArc(text);
  pickupElement.parentNode.insertBefore(text, pickupElement);
  let pickupPoints, points;
  let currentMultiplierRatio = getMultiplierRatio();
  //case when glasses are starter
  if (pickupElement.dataset.type === 'red-gem' && redGemMultiplier !== 1) {
    pickupPoints = pickupElement?.dataset?.points * redGemMultiplier;
    points = pickupPoints * currentMultiplierRatio;
    redGemMultiplier = 1;
    goldCoinCounter = 0;
    const glassesBuffStackDiv = document.getElementById('glasses-buff');
    glassesBuffStackDiv.textContent = goldCoinCounter;

    if (glassesBuffStackDiv) {
      const glassesBuffDiv = document.getElementById('glasses-buff-container');
      if (glassesBuffDiv.classList.contains('show-element')) {
        glassesBuffDiv.classList.remove('show-element');
        glassesBuffDiv.classList.add('hide-element');
      } // Set the number of stacks
    }
  }
  //case when coins are starter
  else if (
    getSelectedStarter() === 'Coins' &&
    pickupElement.dataset.type === 'gold-coin'
  ) {
    pickupPoints = Math.round(pickupElement?.dataset?.points / 2);
    points = pickupPoints * currentMultiplierRatio;
  } else {
    pickupPoints = pickupElement?.dataset?.points;
    points = pickupPoints * currentMultiplierRatio;
  }
  updateScoreWithPoints(points);
  const fontSize = calculateFontSize(points);
  text.style.fontSize = fontSize + 'px';
  text.textContent = `+${points}`;
  // Add a div inside the lastMultiplierScore
  const innerDiv = document.createElement('div');
  innerDiv.textContent = `+${pickupPoints}x${currentMultiplierRatio}`;
  innerDiv.classList.add('inner-plus-points', 'sans');

  // Check if there is an existing innerDiv, remove it if present
  const existingInnerDiv =
    lastMultiplierScore.querySelector('.inner-plus-points');
  if (existingInnerDiv) {
    existingInnerDiv.remove();
  }

  // Append the new innerDiv inside lastMultiplierScore
  lastMultiplierScore.appendChild(innerDiv);

  if (innerDiv) {
    // Remove the new innerDiv after 1 second
    setTimeout(() => {
      innerDiv.remove();
    }, 1000);
  }
}

let scoreSinceMilestone = 0;

export function updateScoreWithPoints(delta) {
  const initialScore = score;
  const increments = Math.ceil(duration / updateInterval);
  const incrementAmount = delta / increments;
  let currentMultiplierRatio = getMultiplierRatio();
  const intervalId = setInterval(() => {
    score += incrementAmount;
    scoreSinceMilestone += incrementAmount;
    scoreElem.textContent = Math.floor(score).toString().padStart(6, 0);

    if (currentMultiplierRatio > 1) {
      currentComboScore += incrementAmount;
      currentMultiplierScoreElem.textContent = Math.floor(currentComboScore)
        .toString()
        .padStart(1, 0);
    }
    if (score >= initialScore + delta) {
      // Stop the interval when the target score is reached
      clearInterval(intervalId);
    }
  }, updateInterval);
}

function checkLose() {
  //init dino rect
  const dinoRect = getDinoRect();

  const cactusRects = getCactusRects();
  const birdRects = getBirdRects();
  const groundEnemyRects = getGroundEnemyRects();
  const allEnemyRects = [...cactusRects, ...birdRects, ...groundEnemyRects];

  //init enemy and player collision state
  const isEnemyAndPlayerCollision = allEnemyRects.some((rect) =>
    isCollision(rect, dinoRect)
  );

  //if no lives remain then lose
  if (livesElem.textContent === '0') {
    worldElem.setAttribute('transition-style', 'out:circle:hesitate');
    worldElem.classList.remove('stop-time'); // Add the class to stop time
    return true;
  } //check if enemy and player are in colliding
  else if (isEnemyAndPlayerCollision && !getPlayerImmunity() && !getHasStar()) {
    //check if player is not in previous collision state
    if (!collisionOccurred) {
      // decrement lives elem by 1
      soundController.takeDamage.play();
      let currentLives = parseInt(livesElem.textContent, 10);
      if (!isNaN(currentLives)) {
        currentLives -= 1;
        livesElem.textContent = currentLives;
      }
      resetMultiplier();
      //switch player collision state to true
      collisionOccurred = true;
      //set player to flash
      dinoElem.classList.add('flash-animation');
      //set world update pause
      worldElem.classList.add('stop-time'); // Add the class to stop time
      //set timeout for world update pause

      // // Set a timeout to reset player collision state and player flash
      setTimeout(() => {
        dinoElem.classList.remove('flash-animation');
        dinoElem.classList.add('flash-light-animation');
      }, 400);
      setTimeout(() => {
        collisionOccurred = false;
        dinoElem.classList.remove('flash-light-animation');
      }, 1600);
    }
  } else if (isEnemyAndPlayerCollision && getPlayerImmunity()) {
  }
}

const muteButton = document.getElementById('muteButton');
let soundControllerMuted = false;
const muteIconButton = document.getElementById('mute-icon-button');
//mute/unmute function
muteButton.addEventListener('click', function () {
  if (!soundControllerMuted) {
    Object.keys(soundController).forEach(function (key) {
      soundController[key].mute(true);
    });
    muteIconButton.src = muteImg;
    soundControllerMuted = true;
    muteButton.blur();
  } else {
    Object.keys(soundController).forEach(function (key) {
      soundController[key].mute(false);
    });
    muteIconButton.src = unmuteImg;
    soundControllerMuted = false;
    muteButton.blur();
  }
});

export function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function updateSpeedScale(delta) {
  currentSpeedScale += delta * getSpeedScaleIncrease();
}

// Assuming you have the necessary elements in your HTML
const levelBarElem = document.getElementById('levelBar');
const levelDisplayElem = document.getElementById('levelDisplay');

function calculateNextMilestone(currentMilestone) {
  // You can customize the growth rate based on your requirements
  const growthRate = 2; // Adjust this as needed
  return Math.floor(currentMilestone * growthRate);
}

function handleLevelUp() {
  scoreSinceMilestone = 0;
  // Increment the level
  const currentLevel = parseInt(levelDisplayElem.textContent, 10);
  levelDisplayElem.textContent = currentLevel + 1;
  if (getSelectedStarter() === 'Text book') {
    currentPassives.forEach((item) => {
      const currentItem = collectableOptions.find(
        (curItem) => curItem.type === item.type
      );

      item.lastValue = currentItem.points;
      item.effect(incrementAdjustment);
    });
  }
  if (currentLevel === 1) {
    createStarterBuffs();
  } else {
    createBuffs();
  }
  // Reset the progress bar to 0
  levelBarElem.value = 0;
  // Update the milestone for the next level
  milestone = calculateNextMilestone(milestone);
}

function updateScore(delta) {
  score += delta * 0.01;
  scoreSinceMilestone += delta * 0.01;
  scoreElem.textContent = Math.floor(score).toString().padStart(6, '0');

  // Update the level bar
  let progress = (scoreSinceMilestone / milestone) * 100;
  levelBarElem.value = progress;

  if (
    score > highScoreElem.textContent &&
    !hasBeatenScore &&
    highScoreElem.textContent !== '000000'
  ) {
    soundController.beatScore.play();
    hasBeatenScore = true;
  }

  if (scoreSinceMilestone >= milestone) {
    handleLevelUp();
  }
}

function handleCheckIfHighScore(score) {
  if (score > highScoreElem.textContent) {
    highScoreElem.textContent = Math.floor(score).toString().padStart(6, 0);
    localStorage.setItem('lion-high-score', highScoreElem.textContent);
  }
  if (handleCheckLeaderboardHighScore(score)) {
    return true;
  }
}

function setUpElements() {
  setupGroundElements();
  setupObstacles();
  setupCharacters();
  setupPowerUps();
  setupPlatform();
}

function setupGroundElements() {
  setupGround();
  setupGroundLayerTwo();
  setupGroundLayerThree();
  setupBonusLayer();
}

function setupObstacles() {
  setupCactus();
  setupBird();
  setupGroundEnemy();
}

function setupCharacters() {
  setupDino();
}

function setupPowerUps() {
  setupMultiplier();
  setupCoin();
  setupMagnet();
}

function handleStart() {
  updateNotification(`stage ${getCurrentPhase()}!`);
  clearInterval(idleIntervalId); // Clear the interval
  worldElem.setAttribute('transition-style', 'in:circle:center');
  lastTime = null;
  hasBeatenScore = false;
  score = 0;
  startTimer();
  setMultiplierRatio(1);
  let currentMultiplierRatio = getMultiplierRatio();
  setUpElements();
  dinoElem.classList.remove('leap');
  currentMultiplierElem.textContent = `x${currentMultiplierRatio}`;
  livesElem.textContent = 10;
  startScreenElem.classList.add('hide');
  endScreenElem.classList.add('hide');
  gameOverIconElem.classList.add('hide-element');
  // Get the container element where the ticker items will be appended
  const tickerData = [
    {
      username: 'bap1',
      score: 'start',
    },
    { username: 'b4p2', score: '323451' },
    { username: 'fgp3', score: '331451' },
    { username: 'agf4', score: '131451' },
    {
      username: 'bap5',
      score: '353451',
    },
    { username: 'b4p6', score: '323451' },
    { username: 'fgp', score: '331451' },
    {
      username: 'bap7',
      score: '353451',
    },
    { username: 'b4p8', score: '323451' },
    { username: 'fgp9', score: '331451' },
    { username: 'agf10', score: '131451' },
    {
      username: 'bap11',
      score: '353451',
    },
    { username: 'b4p12', score: '323451' },
    { username: 'fgp13', score: 'end' },
  ];
  tickerData.forEach((item, index) => {
    const tickerItem = document.createElement('div');
    tickerItem.classList.add('ticker__item');
    tickerItem.innerHTML = `${item.username} - ${item.score}`;
    const tickerDivider = document.createElement('div');
    tickerDivider.classList.add('ticker-divider');
    tickerElem.appendChild(tickerItem);
    // Add a divider after each item, except for the last one
    if (index < tickerData.length - 1) {
      tickerElem.appendChild(tickerDivider);
    }
  });
  tickerData.forEach((item, index) => {
    const tickerItem = document.createElement('div');
    tickerItem.classList.add('ticker__item');
    tickerItem.innerHTML = `${item.username} - ${item.score}`;
    const tickerDivider = document.createElement('div');
    tickerDivider.classList.add('ticker-divider');
    tickerElem2.appendChild(tickerItem);
    // Add a divider after each item, except for the last one
    if (index < tickerData.length - 1) {
      tickerElem2.appendChild(tickerDivider);
    }
  });
  tickerData.forEach((item, index) => {
    const tickerItem = document.createElement('div');
    tickerItem.classList.add('ticker__item');
    tickerItem.innerHTML = `${item.username} - ${item.score}`;
    const tickerDivider = document.createElement('div');
    tickerDivider.classList.add('ticker-divider');
    tickerElem3.appendChild(tickerItem);
    // Add a divider after each item, except for the last one
    if (index < tickerData.length - 1) {
      tickerElem3.appendChild(tickerDivider);
    }
  });
  // tickerContainerElem.classList.add('hide-element');
  // tickerContainerElem.classList.remove('show-element');

  window.requestAnimationFrame(update);
}

let timer = 0;
let intervalId;

function updateTimer() {
  timer++;
  currentGameTimerElem.textContent = formatTime(timer);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function startTimer() {
  intervalId = setInterval(updateTimer, 1000); // Update the timer every second
}

function stopTimer() {
  clearInterval(intervalId);
}

// Function to toggle the pause state
export function togglePause() {
  isPaused = !isPaused;
  // const body = document.body;
  if (isPaused) {
    // body.classList.add('pause-animation');
    pauseIconButton.src = playImg;
    stopTimer(); // Pause the timer
    snow.togglePause();
  } else {
    // body.classList.remove('pause-animation');
    pauseIconButton.src = pauseImg;
    snow.togglePause();
    startTimer(); // Start the timer or resume from where it left off
    window.requestAnimationFrame(update);
  }
}

function revealAchievementForm(index, score) {
  gameOverIconElem.classList.add('hide-element');
  const rank = index + 2;
  scoreNewHighScoreElem.textContent = Math.round(score);
  const achievementRankElem = document.getElementById('achievement-rank-text');
  achievementRankElem.textContent = `${rank}${getSuffix(rank)}`;
  const achievementBlockElem = document.getElementById('achievement-block');
  const lionGameAchievementTitleElem = document.getElementById(
    'achievement-title-block'
  );
  const achievementInstructionsBlockElem = document.getElementById(
    'achievement-instructions-block'
  );
  const achievementFormElem = document.getElementById('achievement-form-block');
  const newHighScoreInput = document.getElementById('newHighScoreInput');
  submitNewScoreFormElem.classList.remove('hide-form');
  submitNewScoreFormElem.classList.add('show-form');
  setTimeout(() => {
    lionGameAchievementTitleElem.classList.remove('fade-out-text');
    lionGameAchievementTitleElem.classList.add('fade-in-text');
  }, 2000);
  setTimeout(() => {
    typeLettersWithoutSpaces(0, 'Achievement', achievementBlockElem, 100);
  }, 4050);
  setTimeout(() => {
    typeLettersWithoutSpaces(
      0,
      'New high score, enter your username!',
      achievementInstructionsBlockElem,
      100
    );
  }, 8050);
  setTimeout(() => {
    newHighScoreInput.focus();
    achievementFormElem.classList.remove('fade-out-text');
    achievementFormElem.classList.remove('fade-in-text');
  }, 12050);
}

async function handleCheckLeaderboardHighScore(score) {
  try {
    await getAllHighScoreUsers().then((data) => {
      //sort all the data in ascending order
      const sortedData = data.users.sort((a, b) => {
        return parseInt(b.score, 10) - parseInt(a.score, 10);
      });
      //check the last highest score compared to the leaderboard
      const lastHigherScore = sortedData
        .reverse()
        .find((user) => parseInt(user.score, 10) > parseInt(score, 10));
      //find the index of the last highest score
      const index = sortedData.reverse().indexOf(lastHigherScore);
      //if the index is not data.length-1 then the score is not higher than any on the leaderboard
      if (index !== sortedData.length - 1) {
        // const rank = index !== 0 ? index + 2 : index; will need to add condition for the highest score
        revealAchievementForm(index, score);
        return true;
      } else {
        setTimeout(() => {
          document.addEventListener('keydown', handleStart, { once: true });
          document.addEventListener('touchstart', handleStart, {
            once: true,
          });
          endScreenElem.classList.remove('hide');
        }, 100);
        setTimeout(() => {
          typeLetters(0);
        }, 1500);
        return;
      }
    });
  } catch (error) {
    console.log(error);
  }
}

//trim any extra spaces in score
function trimmedOutExtraSpacesScore(score) {
  return score.replace(/\s+/g, ' ').trim();
}

//submit new score to leaderboard
async function handleSubmitNewScore() {
  const userInput = document.getElementById('newHighScoreInput').value;
  //check for validation errors and update error message accordingly
  if (!validateInput() || !userInput) {
    scoreErrorMessageElem.textContent = 'Enter a valid name!';
    scoreErrorMessageElem.classList.remove('hide');
    return;
  }

  const res = await handleNewHighScore(
    userInput,
    trimmedOutExtraSpacesScore(scoreNewHighScoreElem.textContent)
  );

  //check if user already exists from res and update error message accordingly, else submit new score
  if (res === 'user already exists') {
    scoreErrorMessageElem.textContent = res;
    scoreErrorMessageElem.classList.remove('hide');
    return;
  } else {
    submitNewScoreFormElem.classList.add('fade-out-text');
    scrollableTableElem.style.display = 'flex';
    showLeaderboard = !showLeaderboard;
    const leaderboardContent = document.getElementById('leaderboard-content');
    leaderboardContent.classList.remove('flicker-opacity-off');
    loading = true;
    runTypeLetters();
    showLeaderboard = !showLeaderboard;
    worldElem.setAttribute('transition-style', '');
    stopLoading();
    scrollableTableElem.setAttribute('transition-style', 'in:wipe:left');
    scrollableTableElem.classList.add('show-element');
    leaderboardContent.classList.add('translateX-right-to-left');
    scrollableTableElem.classList.remove('hide-element');
    setTimeout(() => {
      showLeaderboard = true;
      scrollableTableElem.classList.remove('hide-element');
      scrollableTableElem.classList.add('show-element');
      scoreErrorMessageElem.classList.add('hide');
    }, 3000);
  }
}

document.addEventListener('click', function (event) {
  const shareContainer = document.getElementById('share-container');
  const shareButton = document.getElementById('shareButton');

  if (
    !shareContainer.contains(event.target) &&
    !shareButton.contains(event.target)
  ) {
    shareContainer.classList.remove('show-share-container');
  }
});

function handleOpenShareContainer() {
  const shareContainer = document.getElementById('share-container');
  shareContainer.classList.add('show-share-container');
}

if (document.getElementById('submit-button')) {
  document
    .getElementById('submit-button')
    .addEventListener('click', handleSubmitNewScore);
}

let currentPage = 'leaderboard-page';

function handleOpenWiki() {
  underlineCurrentPageButton('wiki-page');
}
function handleOpenControls() {
  underlineCurrentPageButton('controls-page');
}
function handleOpenLeaderboard() {
  underlineCurrentPageButton('leaderboard-page');
}

function underlineCurrentPageButton(page) {
  const oldPage = document.getElementById(currentPage);
  oldPage.classList.add('hide-page');
  oldPage.classList.remove('show-page');
  const currentButton = document.getElementById(pageButtons[currentPage]);
  currentButton.classList.remove('sidebar-button-selected');
  currentPage = page;
  const newPage = document.getElementById(currentPage);
  newPage.classList.add('show-page');
  newPage.classList.remove('hide-page');
  const newButton = document.getElementById(pageButtons[newPage.id]);
  newButton.classList.add('sidebar-button-selected');
}

document
  .getElementById('closeLeaderboard')
  .addEventListener('click', handleToggleLeaderboard);

document
  .getElementById('toggleLeaderboard')
  .addEventListener('click', handleToggleLeaderboard);

document
  .getElementById('shareButton')
  .addEventListener('click', handleOpenShareContainer);

document
  .getElementById('show-wiki-page-button')
  .addEventListener('click', handleOpenWiki);

document
  .getElementById('show-controls-page-button')
  .addEventListener('click', handleOpenControls);

document
  .getElementById('show-leaderboard-page-button')
  .addEventListener('click', handleOpenLeaderboard);

const pageButtons = {
  'wiki-page': 'show-wiki-page-button',
  'leaderboard-page': 'show-leaderboard-page-button',
  'controls-page': 'show-controls-page-button',
};

underlineCurrentPageButton('leaderboard-page');

let loading;
function stopLoading() {
  loading = false;
}

function handleToggleLeaderboard() {
  const leaderboardContent = document.getElementById('leaderboard-content');
  if (showLeaderboard !== null && showLeaderboard === false) {
    leaderboardContent.classList.remove('flicker-opacity-off');
    loading = true;
    runTypeLetters();
    showLeaderboard = !showLeaderboard;
    worldElem.setAttribute('transition-style', 'out:wipe:right');
    const randomTimeout = Math.random() * (2800 - 1500) + 1500; // Random timeout between 1500ms and 2800ms
    setTimeout(() => {
      stopLoading();
      scrollableTableElem.setAttribute('transition-style', 'in:wipe:left');
      scrollableTableElem.classList.add('show-element');
      leaderboardContent.classList.add('translateX-right-to-left');
      scrollableTableElem.classList.remove('hide-element');
    }, randomTimeout);
  } else {
    handleStart();
    loading = true;
    runTypeLetters();
    showLeaderboard = !showLeaderboard;
    scrollableTableElem.setAttribute('transition-style', 'out:wipe:right');
    leaderboardContent.classList.add('flicker-opacity-off');
    setTimeout(() => {
      stopLoading();
      scrollableTableElem.style.display = 'none';
      worldElem.setAttribute('transition-style', 'in:wipe:left');
      scrollableTableElem.classList.remove('show-element');
      scrollableTableElem.classList.add('hide-element');
    }, 1500);
  }
}

function runTypeLetters() {
  if (!loading) {
    return;
  }
  loadingTextElem.textContent = '';
  typeLettersAny(0, '...', loadingTextElem, 120);
  const rerunDelay = 2700;
  setTimeout(runTypeLetters, rerunDelay);
}

function handleLose() {
  gameOverTextElem.textContent = '';
  // tickerContainerElem.classList.add('show-element');
  // tickerContainerElem.classList.remove('hide-element');
  soundController.die.play();
  setDinoLose();
  handleCheckIfHighScore(score);
}

function setPixelToWorldScale() {
  let worldToPixelScale;
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}

function handleOrientationChange() {
  var blackScreen = document.getElementById('blackScreen');

  if ((isMobile() && window.orientation === 0) || window.orientation === 180) {
    // Portrait orientation on mobile
    blackScreen.style.display = 'flex';
  } else {
    // Hide black screen in other cases
    blackScreen.style.display = 'none';
  }
}

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

// Initial check
handleOrientationChange();

// Listen for orientation changes
window.addEventListener('orientationchange', handleOrientationChange);

const textToType = 'Game Over';

function typeLetters(index) {
  if (index < textToType.length) {
    gameOverTextElem.textContent += textToType.charAt(index);
    setTimeout(() => typeLetters(index + 1), 200); // Adjust the delay as needed
  } else {
    gameOverIconElem.classList.remove('hide-element');
    gameOverIconElem.classList.add('show-element');
  }
}

function typeLettersAny(index, text, elem, timeout) {
  if (index < text.length) {
    elem.innerHTML += `<span>${text.charAt(index)}</span>`;
    setTimeout(() => {
      Array.from(elem.children).forEach((span, index) => {
        setTimeout(() => {
          span.classList.add('wavy');
        }, index * 80);
      });
      typeLettersAny(index + 1, text, elem, timeout);
    }, 250); // Adjust the delay as needed
  } else {
    elem.classList.remove('hide-element');
    elem.classList.add('show-element');
  }
}

function typeLettersWithoutSpaces(index, text, elem, timeout) {
  if (index < text.length) {
    elem.textContent += text.charAt(index);
    setTimeout(() => {
      typeLettersWithoutSpaces(index + 1, text, elem, timeout);
    }, timeout); // Use the provided timeout
  } else {
    elem.classList.remove('hide-element');
    elem.classList.add('show-element');
  }
}

export let collectableOptions = [
  { type: 'gold-coin', weight: 0.3, points: 31 },
  { type: 'red-gem', weight: 0.1, points: 85 },
  { type: 'silver-coin', weight: 0.6, points: 16 },
  { type: 'cherry', weight: 0, points: 1000 },
];

//buff-effects

function filetMignonEffect() {
  const rank = 1;

  let currentLives = parseInt(livesElem.textContent, 10);
  currentLives += rank;
  livesElem.textContent = currentLives;
  const playerContainer = document.querySelector('.player-container');
  createOneUpText(playerContainer);
}

function trustyPocketWatchEffect() {
  const startRank = 0.4;
  const endRank = 0.95;
  const updateInterval = 1000; // Update every second

  let currentRank = startRank;
  const intervalId = setInterval(() => {
    // Increment the current rank
    currentRank += 0.1; // Adjust the increment as needed

    // Ensure the current rank does not exceed the end rank
    currentRank = Math.min(currentRank, endRank);

    // Update the deltaAdjustment based on the current rank
    deltaAdjustment = currentRank;

    if (currentRank >= endRank) {
      // Stop the interval when the end rank is reached
      clearInterval(intervalId);
      deltaAdjustment = endRank;
    }
  }, updateInterval);
}

function getRandomCollectable() {
  const randomValue = Math.random();
  let cumulativeProbability = 0;

  for (const option of collectableOptions) {
    cumulativeProbability += option.weight;
    if (randomValue <= cumulativeProbability) {
      return option;
    }
  }

  // Default case (fallback)
  return collectableOptions[collectableOptions.length - 1];
}

function sackOfCoinsEffect() {
  let totalPoints = 0;
  let currentMultiplierRatio = getMultiplierRatio();

  for (let i = 0; i < 25; i++) {
    const randomCollectable = getRandomCollectable();
    totalPoints += randomCollectable.points * currentMultiplierRatio;
  }

  updateScoreWithPoints(totalPoints);

  // Add totalPoints to the score (adjust as needed)
  // Example: score += totalPoints;
  console.log(`Collected ${totalPoints} points from 25 random coins.`);
}

function momsCookiesEffect() {
  updateScoreWithPoints(milestone);
}

function reduceByPercentage(value, percentage) {
  return value * (1 - percentage);
}

function slowFallEffect() {
  const reductionPercentage = 0.3; // Adjust the percentage as needed
  setGravityFallAdjustment(
    reduceByPercentage(getGravityFallAdjustment(), reductionPercentage)
  );
}

function increaseByPercentage(value, percentage) {
  const multiplier = 1 + percentage / 100;
  return value * multiplier;
}

function reverseAndReIncrement(finalValue, incrementFactor, reIncrementFactor) {
  // Reverse the increment by incrementFactor
  const decreasedValue = finalValue / incrementFactor;
  // Re-increment the reversed value by reIncrementFactor
  const reIncrementedValue = decreasedValue * reIncrementFactor;
  return reIncrementedValue;
}

let incrementAdjustment = 1.016;

function applyIncrementEffect(
  collectable,
  incrementAdjustment,
  newIncrementAdjustment,
  effectMultiplier
) {
  if (incrementAdjustment) {
    const lastCollectable = currentPassives.find(
      (item) => item.type === collectable.type
    );
    // Increment the points by passive increase
    collectable.points = reverseAndReIncrement(
      lastCollectable.lastValue,
      effectMultiplier,
      newIncrementAdjustment
    );
  } else {
    collectable.points *= effectMultiplier;
  }

  collectable.points = Math.round(collectable.points);
}

function silverFeatherEffect(incrementAdjustment) {
  let newIncrementAdjustment;
  const silverFeatherIncrement = 1.2;
  const silverCoin = collectableOptions.find(
    (item) => item.type === 'silver-coin'
  );
  const hasSilverFeatherEffect = currentPassives.some(
    (passive) => passive.effect === silverFeatherEffect
  );
  if (!hasSilverFeatherEffect) {
    handleAddToCurrentPassives(
      silverFeatherEffect,
      'silver-coin',
      silverCoin.points
    );
  } else {
    newIncrementAdjustment = silverFeatherIncrement * incrementAdjustment;
  }
  applyIncrementEffect(
    silverCoin,
    incrementAdjustment,
    newIncrementAdjustment,
    silverFeatherIncrement
  );
}

function amuletEffect(incrementAdjustment) {
  let newIncrementAdjustment;
  const amuletIncrement = 1.2;
  const goldCoin = collectableOptions.find((item) => item.type === 'gold-coin');
  // Check if amuletEffect is already in currentPassives
  const hasAmuletEffect = currentPassives.some(
    (passive) => passive.effect === amuletEffect
  );
  // If not, add it
  if (!hasAmuletEffect) {
    handleAddToCurrentPassives(amuletEffect, 'gold-coin', goldCoin.points);
  } else {
    newIncrementAdjustment = amuletIncrement * incrementAdjustment;
  }
  applyIncrementEffect(
    goldCoin,
    incrementAdjustment,
    newIncrementAdjustment,
    amuletIncrement
  );
}

export {
  amuletEffect,
  silverFeatherEffect,
  momsCookiesEffect,
  filetMignonEffect,
  trustyPocketWatchEffect,
  sackOfCoinsEffect,
  slowFallEffect,
};

//starters
let selectedStarter;
let currentPassives = [];

function handleAddToCurrentPassives(effect, type, lastValue) {
  if (getSelectedStarter() === 'Text book') {
    currentPassives.push({
      effect: effect,
      lastValue: lastValue,
      type: type,
    });
  }
}

function booksSmartEffect() {
  if (currentPassives !== []) {
    currentPassives.forEach((ability) => {
      console.log(
        `${ability.name} - Level ${ability.level}, Value ${ability.value}`
      );
    });
  }
  setSelectedStarter('Text book');
}

function glassesEffect() {
  setSelectedStarter('Glasses');
}

function coinsEffect() {
  setSelectedStarter('Coins');
}

export { booksSmartEffect, glassesEffect, coinsEffect };
