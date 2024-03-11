import {
  startSlotMachine,
  updateNotificationItem,
} from './elements/slot-machine-item.js';
import { updateGeneratedPhase } from './phases/generate-phase.js';
import {
  createColumnOfCoins,
  createArrowOfCoins,
  createDiagonalOfCoins,
} from './elements/coin-group.js';
import { createPoofParticles } from './elements/poof-particles.js';
import { createPickUpParticles } from './elements/pickup-particles.js';
import { createGemParticles } from './elements/gem-particles.js';
import { updateGround, setupGround } from './elements/ground.js';
import backpack from './public/imgs/buffs/backpack.png';
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
import { setupStar, updateStar, getStarRects } from './elements/star.js';
import {
  setupCoin,
  updateCoin,
  getCoinRects,
  createCoins,
  createSpecificCoin,
} from './elements/coin.js';
import muteImg from './public/imgs/icons/Speaker-Off.png';
import unmuteImg from './public/imgs/icons/Speaker-On.png';
import pauseImg from './public/imgs/icons/Pause.png';
import playImg from './public/imgs/icons/Play.png';
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
  // gameOverIconElem,
  leaderboardElem,
  scoreMultiplierElem,
  scoreNewHighScoreElem,
  scoreErrorMessageElem,
  multiplierTimerElem,
  livesElem,
  dinoElem,
  dinoTopElem,
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
  bonusElem,
  speedElem,
  snackBarTextElem,
  snackBarElem,
  snackBarIconElem,
  endBlueGemTextElem,
  endGreenGemTextElem,
  endRedGemTextElem,
  endGradeElem,
  endScoreElem,
  endBonusTextElem,
} from './elements-refs';
import { toggleElemOff, toggleElemOn } from './utility/toggle-element.js';
import { snow } from './elements/particle-systems.js';
import { phases } from './phases/phase-properties.js';
import { updatePhase1 } from './phases/phase1.js';
import { updatePhase2 } from './phases/phase2.js';
import { updateBonusPhase, setRandomBonusKey } from './phases/bonus-phase.js';
import { updateInterfaceText } from './utility/update-interface-text.js';
import InterfaceTextElemsSingleton from './interface-text-elems-state.js';
import { setupCrate, updateCrate } from './elements/crate.js';
import { updateGroundQue } from './elements/groundQue.js';
import { applyGem } from './elements/gem-collection.js';
import ItemDropStateSingleton from './item-drop-state.js';
import { normalizeWeights, getRandomWeighted } from './elements/platform.js';
import { getCustomProperty } from './utility/updateCustomProperty.js';
import { notifySnackBar } from './elements/snackbar.js';
import {
  bonusCollectableOptions,
  generatedBonusPhases,
} from './phases/bonus-phase-properties.js';
import { createMagnetParticles } from './elements/magnet-particles.js';
import { updateCastle, setupCastle } from './elements/castle.js';
import { setUpGrade } from './elements/grade.js';

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
  setSpeedScaleIncrease,
  getStarDuration,
  setStarDuration,
  getPlayerImmunity,
  setPlayerImmunity,
  getHasStar,
  setHasStar,
  getGravityFallAdjustment,
  setGravityFallAdjustment,
  getSelectedStarter,
  setSelectedStarter,
  getCurrentPhase,
  setCurrentPhase,
  setJumpCountLimit,
  getLeafDuration,
  setLeafDuration,
  setHasLeaf,
  getIsStarColliding,
  getIsHeartColliding,
  getIsMagnetColliding,
  getIsLeafColliding,
  getIsGroundLayer2Running,
  getCoinPickupRadius,
  setCoinPickupRadius,
  getIsBonusRunning,
  setIsBonusRunning,
  getIsCastleRunning,
  setIsCastleRunning,
  getIsWon,
  setIsWon,
  getGrade,
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
let milestone = 10005;
//init highScore elem
highScoreElem.textContent = localStorage.getItem('lion-high-score')
  ? localStorage.getItem('lion-high-score')
  : Math.floor('0').toString().padStart(7, 0);
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
  if (isPaused) pauseIconButton.src = playImg;
  else {
    pauseIconButton.src = pauseImg;
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

function checkCollisions() {
  if (checkLose()) return handleLose();
  checkMultiplierCollision();
  checkCoinCollision();
  if (getIsStarColliding()) {
    checkStarCollision();
  }

  if (getIsHeartColliding()) {
    checkHeartCollision();
  }
  if (getIsMagnetColliding()) {
    checkMagnetCollision();
  }
  if (getIsLeafColliding()) {
    checkLeafCollision();
  }
}

// const phaseUpdateFunctions = {
//   1: updatePhase1,
//   bonus: updateBonusPhase,
//   2: updatePhase2,
// };

let batchSpawned = false;
let wholeBatchSpawned = false;
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

  let baseDelta = 4;
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
  if (getCurrentPhase() === 'bonus') {
    updateBonusPhase(delta, currentSpeedScale);
  } else {
    updateGeneratedPhase(getCurrentPhase());
  }
  // if (updateFunction) {
  //   updateFunction(timer, delta, currentSpeedScale);
  // }
  updateGroundLayerTwoTwo(delta, currentSpeedScale);
  updateGround(delta, currentSpeedScale);
  updateGroundLayerThree(delta, currentSpeedScale);
  updateGroundLayerTwo(delta, currentSpeedScale);
  updateCactus(delta, currentSpeedScale);
  // updateBird(delta, currentSpeedScale);
  updateGroundEnemy(delta, currentSpeedScale);
  // updatePlatform(delta, currentSpeedScale);
  updateInterfaceText(delta, currentSpeedScale);
  // updateMagnet(delta, currentSpeedScale);
  updateCoin(delta, currentSpeedScale);
  if (getIsCastleRunning()) {
    updateCastle(delta, currentSpeedScale);
  }
  // updateCrate(delta, currentSpeedScale);
  updateNotificationItem(delta, currentSpeedScale);
  updateDino(
    delta,
    currentSpeedScale,
    getGravityFallAdjustment(),
    getSelectedStarter()
  );
  updateSpeedScale(delta);
  updateScore(delta);
  updateSpeedUI(delta);
  updateGroundQue(delta, currentSpeedScale);
  checkCollisions();
  lastTime = time;
  window.requestAnimationFrame(update);
  // if (!wholeBatchSpawned) {
  //   createColumnOfCoins(6);
  //   wholeBatchSpawned = true;
  // }
  // if (!wholeBatchSpawned) {
  //   let baseBatchDelay = 0; // Initial delay
  //   const numBatches = 3; // Number of columns to create
  //   const batchDelay = 2000; // Delay between each column creation
  //   for (let i = 0; i < numBatches; i++) {
  //     setTimeout(() => {
  //       let delay = 0; // Initial delay
  //       const numColumns = 5; // Number of columns to create
  //       const columnDelay = 300; // Delay between each column creation

  //       for (let j = 0; j < numColumns; j++) {
  //         setTimeout(() => {
  //           createColumnOfCoins(5);
  //         }, delay);
  //         delay += columnDelay; // Increment the delay for the next column
  //       }
  //     }, baseBatchDelay);
  //     baseBatchDelay += batchDelay; // Increment the delay for the next column
  //   }
  //   wholeBatchSpawned = true;
  // }
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

export function checkForCrateItem(element) {
  if (element.dataset.crateItem && !element.dataset.itemLocked) return false;
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

function checkCoinCollision() {
  const dinoRect = getDinoRect();
  getCoinRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      const coinElement = document.getElementById(element.id);

      // Create a pickup text element
      const newElement = document.createElement('div');
      if (coinElement.dataset.gem === 'true') {
        applyGem(coinElement.dataset.type);
      } else {
        addPickupText(newElement, coinElement);
      }
      if (coinElement.dataset.type) {
        createPickUpParticles(coinElement.dataset.type, coinElement);
      }

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

function createOneUpTextAtPosition(number = 1, position) {
  soundController.beatScore.play();
  const newElement = document.createElement('div');
  newElement.classList.add('one-up', 'moving-interface-text');
  newElement.style.position = 'absolute';
  newElement.dataset.interfaceText = true;
  // Set the position based on the provided coordinates
  newElement.style.top = `${position.y - 100}px`;
  worldElem.appendChild(newElement);
  newElement.textContent = `${number + 'UP'}`;

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
      if (getSelectedStarter() === 'cowbell') {
        const randomValue = Math.random();
        if (randomValue > 0.5) {
          currentLives += 2;
          createOneUpTextAtPosition(2, collisionPosition);
        } else {
          currentLives += 1;
          createOneUpTextAtPosition(1, collisionPosition);
        }
      } else {
        currentLives += 1;
        createOneUpTextAtPosition(1, collisionPosition);
      }
      livesElem.textContent = currentLives;
      const heartElement = document.getElementById(element.id);
      heartElement.remove();

      return true;
    }
  });
}

function checkLeafCollision() {
  const dinoRect = getDinoRect();
  getLeafRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      const leaf = document.getElementById(element.id);
      dinoElem.style.display = 'none';
      createPoofParticles(dinoElem);
      togglePause();
      setTimeout(() => {
        togglePause();
        dinoElem.style.display = 'block';
      }, 300);
      setHasLeaf(true);
      setJumpCountLimit(4);
      leaf.remove();
      setTimeout(() => {
        setHasLeaf(false);
        setJumpCountLimit(getSelectedStarter === 'sneakers' ? 2 : 1);
      }, getLeafDuration());
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
      console.log(getStarDuration());
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
      createMagnetParticles(dinoElem);
      let numberOfCoins;
      numberOfCoins = Math.floor(Math.random() * 5) + 3;

      if (getSelectedStarter() === 'cowbell') {
        const randomValue = Math.random();
        if (randomValue > 0.5) {
          numberOfCoins += numberOfCoins + 5;
        }
      }
      // Run createCoins the generated number of times
      for (let i = 0; i < numberOfCoins; i++) {
        createCoins();
      }
      const magnetElement = document.getElementById(element.id);
      magnetElement.remove();
      // Run createCoins 20 times
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

const lastMultiplierScore = document.querySelector(
  '[data-last-multiplier-score]'
);

function addPickupText(text, pickupElement) {
  if (!getIsGroundLayer2Running()) {
    text.classList.add('plus-points-navy', 'sans');
  } else {
    text.classList.add('plus-points', 'sans');
  }
  text.style.position = 'absolute';
  text.style.left = pickupElement.offsetLeft + 'px';
  text.style.top = pickupElement.offsetTop - 70 + 'px';
  randomArc(text);
  pickupElement.parentNode.insertBefore(text, pickupElement);
  let pickupPoints, points;
  let currentMultiplierRatio = getMultiplierRatio();

  pickupPoints = pickupElement?.dataset?.points;
  points = pickupPoints * currentMultiplierRatio;

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
    scoreElem.textContent = Math.floor(score).toString().padStart(7, 0);

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

const endPointsDuration = 5000;
const endPointsUpdateInterval = 40;

export function updateEndScoreWithPoints(delta) {
  const initialScore = score;
  const increments = Math.ceil(endPointsDuration / endPointsUpdateInterval);
  const incrementAmount = delta / increments;
  const intervalId = setInterval(() => {
    score += incrementAmount;
    scoreSinceMilestone += incrementAmount;
    endScoreElem.textContent = Math.floor(score).toString().padStart(7, 0);

    if (score >= initialScore + delta) {
      // Stop the interval when the target score is reached
      clearInterval(intervalId);
    }
  }, endPointsUpdateInterval);
}

export function updateEndGemScoreDown(
  incrementDuration,
  scoreElem,
  initialTextContent,
  initialScore
) {
  const targetScore = 0;
  const increments = Math.ceil(incrementDuration / updateInterval);
  const incrementAmount = (initialScore - targetScore) / increments;
  let currentScore = initialScore;

  const intervalId = setInterval(() => {
    currentScore -= incrementAmount;

    // Update the snackbar text
    if (currentScore <= targetScore) {
      // Stop the interval when the target score is reached
      clearInterval(intervalId);
      scoreElem.textContent = `${initialTextContent + '0'}`;
    } else {
      // Update the snackbar text with the current score
      scoreElem.textContent = `${
        initialTextContent +
        Math.floor(currentScore).toString().padStart(1, '0')
      }`;
    }
  }, updateInterval);
}

let snackBarTextScore = 0;

export function updateSnackbarText(delta, randomCollectables) {
  snackBarTextElem.style.display = 'block';

  const increments = Math.ceil(duration / updateInterval);
  const incrementAmount = delta / increments;
  const intervalId = setInterval(() => {
    snackBarTextScore += incrementAmount;
    snackBarTextElem.textContent = `+${Math.floor(snackBarTextScore)
      .toString()
      .padStart(1, 0)}`;
    const incrementDuration = 125;
    if (snackBarTextScore >= delta) {
      // Stop the interval when the target score is reached
      clearInterval(intervalId);
      setTimeout(() => {
        randomCollectables.forEach((collectable, index) => {
          setTimeout(() => {
            createSpecificCoin(collectable);
          }, index * incrementDuration);
        });
        updateSnackbarTextDown(
          delta,
          randomCollectables.length * incrementDuration
        );
      }, 2000);
    }
  }, updateInterval);
}

export function updateSnackbarTextDown(initialScore, incrementDuration) {
  snackBarTextElem.classList.add('flash-color');
  const targetScore = 0;
  const increments = Math.ceil(incrementDuration / updateInterval);
  const incrementAmount = (initialScore - targetScore) / increments;
  let currentScore = initialScore;

  const intervalId = setInterval(() => {
    currentScore -= incrementAmount;

    // Update the snackbar text
    if (currentScore <= targetScore) {
      // Stop the interval when the target score is reached
      clearInterval(intervalId);
      snackBarTextElem.textContent = '0';
      snackBarTextElem.classList.remove('flash-color');
      snackBarElem.classList.add('hide-element');
      snackBarTextElem.style.display = 'none';
      snackBarIconElem.innerHTML = ''; // Remove all children
      snackBarTextScore = 0;
    } else {
      // Update the snackbar text with the current score
      snackBarTextElem.textContent = `+${Math.floor(currentScore)
        .toString()
        .padStart(1, '0')}`;
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

const silverCoinIndex = bonusCollectableOptions.findIndex(
  (item) => item.type === 'silver-coin'
);

function updateSpeedScale(delta) {
  currentSpeedScale += delta * getSpeedScaleIncrease();
}

function slowToWinSpeedScale() {
  currentSpeedScale -= 14 * getSpeedScaleIncrease() * 200;
}

// Assuming you have the necessary elements in your HTML
const levelBarElem = document.getElementById('levelBar');
const levelDisplayElem = document.getElementById('levelDisplay');

function calculateNextMilestone(currentMilestone) {
  // You can customize the growth rate based on your requirements
  const growthRate = 2; // Adjust this as needed
  return Math.floor(currentMilestone * growthRate);
}

let levelSinceBonus = 0;

function handleLevelUp() {
  scoreSinceMilestone = 0;
  // Increment the level
  const currentLevel = parseInt(levelDisplayElem.textContent, 10);
  levelDisplayElem.textContent = currentLevel + 1;
  if (getSelectedStarter() === 'Text book') {
    applyBookSmartEffect();
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
  if (levelSinceBonus >= 0) {
    if (
      silverCoinIndex !== -1 &&
      bonusCollectableOptions[silverCoinIndex].weight >= 0
    ) {
      bonusCollectableOptions[silverCoinIndex].weight =
        bonusCollectableOptions[silverCoinIndex].weight - getCurrentPhase() - 2;
    }
    setIsBonusRunning(true);
    setRandomBonusKey(generatedBonusPhases);
    setCurrentPhase('bonus');
    levelSinceBonus = 0;
  } else {
    setCurrentPhase(getCurrentPhase() + 1);
    levelSinceBonus += 1;
  }
}

let baselineSpeed = getSpeedScale();
let lastUISpeed = null;
const conversionSpeedFactor = 50;

function convertSpeedToNormalNumber() {
  // Convert speed scale to mph relative to the baseline
  const mph = (currentSpeedScale - baselineSpeed) * conversionSpeedFactor;

  // Round mph to the nearest whole number
  const roundedMPH = Math.round(mph);
  return roundedMPH;
}

function updateSpeedUI() {
  const speed = convertSpeedToNormalNumber();
  // Only update the UI if the speed has changed since the last frame
  if (speed !== lastUISpeed) {
    speedElem.textContent = speed.toString().padStart(3, '0');
    lastUISpeed = speed;
  }
}

function updateScore(delta) {
  score += delta * 0.01;
  scoreSinceMilestone += delta * 0.01;
  scoreElem.textContent = Math.floor(score).toString().padStart(7, '0');

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
  setupCrate();
  setupCastle();
}

function setupGroundElements() {
  setupGround();
  setupGroundLayerTwo();
  setupGroundLayerThree();
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
  // gameOverIconElem.classList.add('hide-element');

  window.requestAnimationFrame(update);
}

let timer = 0;
let intervalId;

let totalGameMinLimit = 0.1;
let totalGameSecondsLimit = totalGameMinLimit * 60;

function checkIfWon() {
  if (timer >= totalGameSecondsLimit) {
    if (!getIsCastleRunning()) {
      setIsCastleRunning(true);
    }
    if (currentSpeedScale > 0.75) {
      slowToWinSpeedScale();
    }
  }
}

function updateTimer() {
  checkIfWon();
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
    stopTimer(); // Pause the timer
    snow.togglePause();
  } else {
    // body.classList.remove('pause-animation');
    snow.togglePause();
    startTimer(); // Start the timer or resume from where it left off
    window.requestAnimationFrame(update);
  }
}

function revealAchievementForm(index, score) {
  // gameOverIconElem.classList.add('hide-element');
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

let endGamePointsToIncrement = 0;

let initialGreenGemTextContent;
let initialGreenGemScoreTextContent;

let initialRedGemTextContent;
let initialRedGemScoreTextContent;

let initialBlueGemTextContent;
let initialBlueGemScoreTextContent;

function countGems() {
  const powerUpDivs = document.querySelectorAll('.power-up');
  const powerUpPoints = [];
  const grade = getGrade();

  powerUpDivs.forEach((powerUpDiv) => {
    const powerUpRankDiv = powerUpDiv.querySelector('.power-up-rank');
    if (powerUpRankDiv) {
      const rankTextContent = powerUpRankDiv.textContent.trim();
      const img = powerUpDiv.querySelector('img');
      const imgAlt = img ? img.getAttribute('alt') : 'No alt text found';
      powerUpPoints.push({ rank: rankTextContent, type: imgAlt });
    }
  });

  const multipliedPowerUpPoints = powerUpPoints.map(({ rank, type }) => {
    const collectableOption = collectableOptions.find(
      (option) => option.type === type
    );
    if (!collectableOption) {
      console.error(
        `No collectable option found for power-up with alt text: ${type}`
      );
      return { type, totalPoints: 0 };
    }
    const totalPoints = collectableOption.points * parseFloat(rank) * grade;
    return { type, totalPoints };
  });

  const displayGemPoints = (gemType) => {
    const gemPoints = multipliedPowerUpPoints.find(
      (item) => item.type === gemType
    );
    const gemRank = powerUpPoints.find((item) => item.type === gemType);
    const gemBasePoints = collectableOptions.find(
      (option) => option.type === gemType
    );
    if (gemPoints && gemPoints.totalPoints) {
      if (!isNaN(gemPoints.totalPoints)) {
        endGamePointsToIncrement += gemPoints.totalPoints;
      }
    }
    if (gemPoints && gemType === 'green-gem') {
      initialGreenGemTextContent = `${gemRank.rank} x ${gemBasePoints.points} x ${grade} = `;
      initialGreenGemScoreTextContent = gemPoints.totalPoints;
    }
    if (gemPoints && gemType === 'red-gem') {
      initialRedGemTextContent = `${gemRank.rank} x ${gemBasePoints.points} x ${grade} = `;
      initialRedGemScoreTextContent = gemPoints.totalPoints;
    }
    if (gemPoints && gemType === 'blue-gem') {
      initialBlueGemTextContent = `${gemRank.rank} x ${gemBasePoints.points} x ${grade} = `;
      initialBlueGemScoreTextContent = gemPoints.totalPoints;
    }
    return gemPoints
      ? `${gemRank.rank} x ${gemBasePoints.points} x ${grade} = ${gemPoints.totalPoints}`
      : `0 x ${gemBasePoints.points} x ${grade} = 0`;
  };

  endGreenGemTextElem.textContent = displayGemPoints('green-gem');
  endRedGemTextElem.textContent = displayGemPoints('red-gem');
  endBlueGemTextElem.textContent = displayGemPoints('blue-gem');
  endScoreElem.textContent = Math.floor(score).toString().padStart(7, 0);
  endGradeElem.textContent = grade;
}

function handleUpdateEndGameScore() {
  updateEndScoreWithPoints(endGamePointsToIncrement);
  if (initialGreenGemTextContent && initialGreenGemScoreTextContent) {
    updateEndGemScoreDown(
      endPointsDuration,
      endGreenGemTextElem,
      initialGreenGemTextContent,
      initialGreenGemScoreTextContent
    );
  }
  if (initialRedGemTextContent && initialRedGemScoreTextContent) {
    updateEndGemScoreDown(
      endPointsDuration,
      endRedGemTextElem,
      initialRedGemTextContent,
      initialRedGemScoreTextContent
    );
  }
  if (initialBlueGemTextContent && initialBlueGemScoreTextContent) {
    updateEndGemScoreDown(
      endPointsDuration,
      endBlueGemTextElem,
      initialBlueGemTextContent,
      initialBlueGemScoreTextContent
    );
  }
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

export function handleWin() {
  if (!getIsWon()) {
    setIsWon(true);
    countGems();
    worldElem.setAttribute('transition-style', 'out:circle:center');
    const gemContainer = document.querySelector('.gem-counter-flex-container');
    const endScoreContainer = document.querySelector('.end-score-text');
    // setTimeout(() => {
    //   // document.addEventListener('keydown', handleStart, { once: true });
    //   // document.addEventListener('touchstart', handleStart, {
    //   //   once: true,
    //   // });
    //   endScreenElem.classList.remove('hide');

    // }, 2000);

    const incrementDelay = 2000;

    setTimeout(() => {
      setUpGrade();
    }, 600); // Show the second element after 2000 ms

    setTimeout(() => {
      endBonusTextElem.classList.remove('hide-end-game-text');
      endBonusTextElem.classList.add('show-end-game-text');
    }, incrementDelay * 2.5); // Show the second element after 2000 ms

    setTimeout(() => {
      gemContainer.classList.remove('hide-end-game-text');
      gemContainer.classList.add('show-end-game-text');
    }, incrementDelay * 3.5); // Show the third element after 4000 ms

    setTimeout(() => {
      endScoreContainer.classList.remove('hide-end-game-text');
      endScoreContainer.classList.add('show-end-game-text');
    }, incrementDelay * 4.5); // Show the fourth element after 6000 ms

    setTimeout(() => {
      handleUpdateEndGameScore();
    }, incrementDelay * 5.5);

    return;
  }
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
    // gameOverIconElem.classList.remove('hide-element');
    // gameOverIconElem.classList.add('show-element');
  }
}

const winToType = 'You Win';

function typeWinLetters(index) {
  if (index < winToType.length) {
    gameOverTextElem.textContent += winToType.charAt(index);
    setTimeout(() => typeWinLetters(index + 1), 200); // Adjust the delay as needed
  } else {
    // gameOverIconElem.classList.remove('hide-element');
    // gameOverIconElem.classList.add('show-element');
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
  // { type: 'gold-coin', weight: 20, points: 31 },
  // { type: 'silver-coin', weight: 60, points: 16 },
  { type: 'green-gem', weight: 1, points: 250 },
  { type: 'red-gem', weight: 0.75, points: 500 },
  { type: 'blue-gem', weight: 0.5, points: 1000 },
];

function createItemAboveDino(itemName) {
  const itemElement = document.createElement('div');

  itemElement.classList.add('pop-up-item', `${itemName}-item`);
  itemElement.id = Math.random().toString(16).slice(2);
  itemElement.dataset[`${itemName}`] = true;

  // Set the initial position of the coin above the dino
  itemElement.style.position = 'absolute';
  itemElement.style.top = dinoElem.offsetTop - 50 + 'px'; // Adjust the vertical position as needed
  itemElement.style.left = dinoElem.offsetLeft + 50 + 'px'; // Center above the dino
  // Append the coin element to the document body or another container
  const worldElem = document.querySelector('[data-world]');
  worldElem.appendChild(itemElement);
}

//buff-effects
function filetMignonEffect() {
  let currentLives = parseInt(livesElem.textContent, 10);
  currentLives += 1;
  livesElem.textContent = currentLives;
  const playerContainer = document.querySelector('.player-container');
  createOneUpText(playerContainer);
}

function stopWatchEffect() {
  setSpeedScaleIncrease(getSpeedScaleIncrease() + 0.000015);
}

function coffeeEffect() {
  let result;
  //run this til you don't get empty as a result
  do {
    result = getRandomWeighted(
      ItemDropStateSingleton.getNormalizedItemDropState()
    );
  } while (result === 'empty');

  notifySnackBar();
  startSlotMachine(result);
}

function getRandomCollectable() {
  // Calculate the total weight of all collectable options
  const totalWeight = collectableOptions.reduce(
    (acc, option) => acc + option.weight,
    0
  );
  // Generate a random number between 0 and the total weight
  const randomWeight = Math.random() * totalWeight;

  let cumulativeWeight = 0;
  // Iterate through the collectable options
  for (const option of collectableOptions) {
    // Add the current option's weight to the cumulative weight
    cumulativeWeight += option.weight;
    // If the randomWeight falls within the range of the current option's weight, return this option
    if (randomWeight <= cumulativeWeight) {
      return option;
    }
  }
}

function sackOfCoinsEffect() {
  let totalPoints = 0;
  let currentMultiplierRatio = getMultiplierRatio();
  let randomCollectables = [];
  for (let i = 0; i < 13; i++) {
    const randomCollectable = getRandomCollectable();
    randomCollectables.push(randomCollectable);
    totalPoints += randomCollectable.points * currentMultiplierRatio;
  }
  notifySnackBar(backpack);
  updateSnackbarText(totalPoints, randomCollectables);
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

export { filetMignonEffect, stopWatchEffect, sackOfCoinsEffect, coffeeEffect };

//starters
let currentPassives = [];

function booksSmartEffect() {
  applyBookSmartEffect();
  setSelectedStarter('Text book');
}

function applyBookSmartEffect() {
  collectableOptions.forEach((option) => {
    option.points += 1;
  });
}

function sneakersEffect() {
  setSelectedStarter('sneakers');
  setJumpCountLimit(2);
}

function cowbellEffect() {
  setSelectedStarter('cowbell');
  setLeafDuration(getLeafDuration() * 1.5);
  setStarDuration(getStarDuration() * 1.5);
}

function mittensEffect() {
  ItemDropStateSingleton.updateState({
    empty: {
      weight: 0,
    },
  });
  const newRadius = getCoinPickupRadius() * 1.85;
  setCoinPickupRadius(newRadius);
  setSelectedStarter('mittens');
  ItemDropStateSingleton.setNormalizedItemDropState(
    normalizeWeights(ItemDropStateSingleton.getItemDropState())
  );
}

createColumnOfCoins('gold-coin', 5);

export { booksSmartEffect, sneakersEffect, cowbellEffect, mittensEffect };
