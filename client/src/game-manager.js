import { updateGround, setupGround } from './elements/ground.js';
import {
  updateGroundLayerTwo,
  setupGroundLayerTwo,
} from './elements/groundLayerTwo';
import {
  updateGroundLayerThree,
  setupGroundLayerThree,
} from './elements/groundLayerThree';
import {
  updateDino,
  setupDino,
  getDinoRect,
  setDinoLose,
} from './elements/dino.js';
import {
  updateCactus,
  setupCactus,
  getCactusRects,
} from './elements/cactus.js';
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
import { setupCoin, updateCoin, getCoinRects } from './elements/coin.js';
import muteImg from './public/imgs/icons/Speaker-Off.png';
import unmuteImg from './public/imgs/icons/Speaker-On.png';
import pauseImg from './public/imgs/icons/Pause.png';
import playImg from './public/imgs/icons/Play.png';
import glasses from './public/imgs/buffs/glasses.png';
import redoImg from './public/imgs/icons/Redo.png';
import foregroundImg from './public/imgs/backgrounds/Foreground-Trees.png';
import { createBuffs, createStarterBuffs } from './elements/buff.js';
const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 45;
export let SPEED_SCALE_INCREASE = 0.00001;
let multiplierRatio = 1;
const worldElem = document.querySelector('[data-world]');
const scoreElem = document.querySelector('[data-score]');
const highScoreElem = document.querySelector('[data-high-score]');
const startScreenElem = document.querySelector('[data-start-screen]');
const endScreenElem = document.querySelector('[data-game-over-screen]');
const gameOverTextElem = document.querySelector('[data-game-over-text]');
const gameOverIconElem = document.getElementById('game-over-icon');
const leaderboardElem = document.querySelector('[data-leaderboard-body]');
const scoreMultiplierElem = document.querySelector('[data-score-multiplier]');
const scoreNewHighScoreElem = document.querySelector(
  '[data-score-new-high-score]'
);
const scoreErrorMessageElem = document.querySelector(
  '[data-score-error-message]'
);
const multiplierTimerElem = document.querySelector('[data-multiplier-timer]');
const tickerElem = document.querySelector('[data-ticker]');
const tickerElem2 = document.querySelector('[data-ticker2]');
const tickerElem3 = document.querySelector('[data-ticker3]');
export const livesElem = document.querySelector('[data-lives]');
const dinoElem = document.querySelector('[data-dino]');
const scrollableTableElem = document.querySelector('[data-scrollable-table]');
const currentMultiplierElem = document.querySelector(
  '[data-current-multiplier]'
);
const plusPointsElem = document.querySelector('[data-plus-points]');
const tickerContainerElem = document.querySelector('[data-ticker-container]');
const loadingTextElem = document.querySelector('[data-loading-text]');
const submitNewScoreFormElem = document.querySelector(
  '[data-submit-new-score-form]'
);

const interfaceComboContainer = document.getElementById(
  'interface-combo-container'
);
const currentMultiplierScoreElem = document.querySelector(
  '[data-current-multiplier-score]'
);
const currentComboScoreContainer = document.getElementById(
  'current-combo-score-container'
);
let showLeaderboard = false;

// const playAgainButtonElem = document.querySelector('[data-play-again]');

// playAgainButtonElem.addEventListener('click', function () {
//   handleStart(); // Add any other actions you want to perform on button click
// });
setPixelToWorldScale();
createLeaderboard(leaderboardElem);

window.addEventListener('resize', setPixelToWorldScale);
document.addEventListener('keydown', handleStart, { once: true });
document.addEventListener('touchstart', handleStart, { once: true });
let lastTime;
let speedScale;
let score;
let collisionOccurred = false; // Flag to track collision
let milestone = 500;
//init highScore elem
highScoreElem.textContent = localStorage.getItem('lion-high-score')
  ? localStorage.getItem('lion-high-score')
  : Math.floor('0').toString().padStart(6, 0);
let hasBeatenScore = false;
let isPaused = false;
let playerImmunity = false;
let immunityDuration = 2000; // Example: 2000 milliseconds (2 seconds)
scrollableTableElem.classList.add('hide-element');
scrollableTableElem.style.display = 'none';
worldElem.setAttribute('transition-style', 'in:circle:center');
tickerContainerElem.classList.add('hide-element');
tickerContainerElem.classList.remove('show-element');
const pauseIconButton = document.getElementById('pause-icon-button');

// Function to toggle the pause state
export function togglePause() {
  isPaused = !isPaused;
  if (isPaused) {
    pauseIconButton.src = playImg;
  } else {
    pauseIconButton.src = pauseImg;
    window.requestAnimationFrame(update);
  }
}

const shareContainer = document.getElementById('share-container');
const shareButton = document.getElementById('shareButton');

shareContainer.addEventListener('mouseenter', () => {
  shareButton.classList.add('transparent-background');
});

shareContainer.addEventListener('mouseleave', () => {
  shareButton.classList.remove('transparent-background');
});

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
  pauseButton.blur();
});

// Function to set player immunity
function setPlayerImmunity() {
  playerImmunity = true;

  // Reset player immunity after the specified duration
  setTimeout(() => {
    playerImmunity = false;
  }, immunityDuration);
}

function updateElements() {}

let deltaAdjustment = 1;

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

  let baseDelta = 5;

  // let delta = time - lastTime;
  let delta = baseDelta;
  if (collisionOccurred) {
    setPlayerImmunity();
    togglePause();
    setTimeout(() => {
      collisionOccurred = false; // Reset the collision flag after the delay
      togglePause();
    }, 400);
    return; // Pause the update during the delay
  }

  updateGround(delta, speedScale);
  updateGroundLayerThree(delta, speedScale);
  updateGroundLayerTwo(delta, speedScale);
  updateDino(delta, speedScale, gravityFallAdjustment, selectedStarter);
  updateCactus(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  updateMultiplier(delta, speedScale);
  updateCoin(delta, speedScale);
  if (checkLose()) return handleLose();
  if (checkMultiplierCollision());
  if (checkCoinCollision());
  lastTime = time;
  window.requestAnimationFrame(update);
}

function createOneUpText() {
  soundController.beatScore.play();

  const playerContainer = document.querySelector('.player-container'); // Adjust the selector accordingly

  const newElement = document.createElement('div');
  newElement.classList.add('one-up', 'sans');
  newElement.style.position = 'absolute';
  playerContainer.appendChild(newElement);
  newElement.textContent = '1UP';
  setTimeout(() => {
    // newElement.remove();
  }, 600);
  return true;
}

function toggleElemOn(elem) {
  const classList = elem.classList;
  classList.remove('hide-element');
  classList.add('show-element');
}
function toggleElemOff(elem) {
  const classList = elem.classList;
  classList.add('hide-element');
  classList.remove('show-element');
}

let timerInterval;

// Get the timer elements
const timerProgress = document.getElementById('timerProgress');

let multiplierTimer = 5000; // Set the initial time in milliseconds
let currentComboScore = 0; // Initialize the current combo score variable

function resetMultiplier() {
  toggleElemOff(interfaceComboContainer);
  toggleElemOff(currentComboScoreContainer);
  clearInterval(timerInterval);
  currentComboScore = 0;
  timerProgress.style.width = '100%'; // Set the progress bar to full width
  multiplierTimer = 5000; // Reset timer when it reaches 0
  currentMultiplierElem.textContent = 'x1';
  currentMultiplierScoreElem.textContent = '0';
  multiplierRatio = 1;
}

function startMultiplierTimer() {
  clearInterval(timerInterval);

  multiplierTimer = 5000; // Reset the timer to its initial value

  timerInterval = setInterval(() => {
    multiplierTimer -= 100; // Subtract 100 milliseconds (adjust as needed)
    const progressValue = (multiplierTimer / 5000) * 100; // Calculate progress value

    if (multiplierTimer <= 0) {
      resetMultiplier();
    } else {
      timerProgress.style.width = `${progressValue}%`;
    }
  }, 100); // Update every 100 milliseconds
}

function checkMultiplierCollision() {
  const dinoRect = getDinoRect();
  getMultiplierRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      toggleElemOn(interfaceComboContainer);
      toggleElemOn(currentComboScoreContainer);
      soundController.beatScore.play();
      document.getElementById(element.id).remove();
      clearInterval(timerInterval);
      startMultiplierTimer();
      // Multiply the existing multiplier by the newly collided multiplier
      if (multiplierRatio === 1) {
        multiplierRatio += parseInt(element.multiplier) - 1;
      } else {
        multiplierRatio += parseInt(element.multiplier);
      }
      currentMultiplierElem.textContent = `x${multiplierRatio}`;
      return true;
    }
  });
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
        selectedStarter === 'Glasses'
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

  //case when glasses are starter
  if (pickupElement.dataset.type === 'red-gem' && redGemMultiplier !== 1) {
    pickupPoints = pickupElement?.dataset?.points * redGemMultiplier;
    points = pickupPoints * multiplierRatio;
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
    selectedStarter === 'Coins' &&
    pickupElement.dataset.type === 'gold-coin'
  ) {
    pickupPoints = Math.round(pickupElement?.dataset?.points / 2);
    points = pickupPoints * multiplierRatio;
  } else {
    console.log(pickupElement.dataset.type);
    pickupPoints = pickupElement?.dataset?.points;
    points = pickupPoints * multiplierRatio;
  }
  updateScoreWithPoints(points);
  const fontSize = calculateFontSize(points);
  text.style.fontSize = fontSize + 'px';
  text.textContent = `+${points}`;
  // Add a div inside the lastMultiplierScore
  const innerDiv = document.createElement('div');
  innerDiv.textContent = `+${pickupPoints}x${multiplierRatio}`;
  innerDiv.classList.add('inner-plus-points', 'sans');

  // Check if there is an existing innerDiv, remove it if present
  const existingInnerDiv =
    lastMultiplierScore.querySelector('.inner-plus-points');
  if (existingInnerDiv) {
    lastMultiplierScore.removeChild(existingInnerDiv);
  }

  // Append the new innerDiv inside lastMultiplierScore
  lastMultiplierScore.appendChild(innerDiv);

  // Remove the new innerDiv after 1 second
  setTimeout(() => {
    lastMultiplierScore.removeChild(innerDiv);
  }, 1000);
}

let scoreSinceMilestone = 0;

function updateScoreWithPoints(delta) {
  const initialScore = score;
  const increments = Math.ceil(duration / updateInterval);
  const incrementAmount = delta / increments;

  const intervalId = setInterval(() => {
    score += incrementAmount;
    scoreSinceMilestone += incrementAmount;
    scoreElem.textContent = Math.floor(score).toString().padStart(6, 0);

    if (multiplierRatio > 1) {
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

  //init enemy and player collision state
  const isEnemyAndPlayerCollision = getCactusRects().some((rect) =>
    isCollision(rect, dinoRect)
  );

  //if no lives remain then lose
  if (livesElem.textContent === '0') {
    worldElem.setAttribute('transition-style', 'out:circle:hesitate');
    worldElem.classList.remove('stop-time'); // Add the class to stop time
    return true;
  } //check if enemy and player are in colliding
  else if (isEnemyAndPlayerCollision && !playerImmunity) {
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
        collisionOccurred = false;
        dinoElem.classList.remove('flash-animation');
        dinoElem.classList.add('flash-light-animation');
      }, 400);
      setTimeout(() => {
        collisionOccurred = false;
        dinoElem.classList.remove('flash-light-animation');
      }, 1600);
    }
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

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
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
  if (selectedStarter === 'Book Smart') {
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
  setupGround();
  setupGroundLayerTwo();
  setupGroundLayerThree();
  setupDino();
  setupCactus();
  setupMultiplier();
  setupCoin();
}

function handleStart() {
  worldElem.setAttribute('transition-style', 'in:circle:center');
  lastTime = null;
  hasBeatenScore = false;
  speedScale = 0.9;
  score = 0;
  multiplierRatio = 1;
  setUpElements();
  dinoElem.classList.remove('leap');
  currentMultiplierElem.textContent = `x${multiplierRatio}`;
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

//snow particle system
const snow = {
  el: '#snow',
  density: 12500, // higher = fewer bits
  maxHSpeed: 1, // How much do you want them to move horizontally
  minFallSpeed: 0.5,
  canvas: null,
  ctx: null,
  particles: [],
  colors: [],
  mp: 1,
  quit: false,
  init() {
    this.canvas = document.querySelector(this.el);
    this.ctx = this.canvas.getContext('2d');
    this.reset();
    requestAnimationFrame(this.render.bind(this));
    window.addEventListener('resize', this.reset.bind(this));
  },
  reset() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.particles = [];
    this.mp = Math.ceil((this.w * this.h) / this.density);
    for (let i = 0; i < this.mp; i++) {
      let size = Math.random() * 1.7 + 3;
      this.particles.push({
        x: Math.random() * this.w, //x-coordinate
        y: Math.random() * this.h, //y-coordinate
        w: size,
        h: size,
        vy: this.minFallSpeed + Math.random(), //density
        vx: Math.random() * this.maxHSpeed - this.maxHSpeed / 2,
        fill: '#ffffff',
        s: Math.random() * 0.2 - 0.1,
      });
    }
  },

  render() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.particles.forEach((p, i) => {
      p.y += p.vy;
      p.x += p.vx;
      this.ctx.fillStyle = p.fill;
      this.ctx.fillRect(p.x, p.y, p.w, p.h);
      if (p.x > this.w + 5 || p.x < -5 || p.y > this.h) {
        p.x = Math.random() * this.w;
        p.y = -10;
      }
    });
    if (this.quit) {
      return;
    }
    requestAnimationFrame(this.render.bind(this));
  },
  destroy() {
    this.quit = true;
  },
};

snow.init();

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
  { type: 'gold-coin', weight: 0.3, points: 13 },
  { type: 'red-gem', weight: 0.1, points: 45 },
  { type: 'silver-coin', weight: 0.6, points: 6 },
];

//buff-effects

function filetMignonEffect() {
  const rank = 1;

  let currentLives = parseInt(livesElem.textContent, 10);
  currentLives += rank;
  livesElem.textContent = currentLives;
  createOneUpText();
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

  for (let i = 0; i < 25; i++) {
    const randomCollectable = getRandomCollectable();
    totalPoints += randomCollectable.points;
  }

  updateScoreWithPoints(totalPoints);

  // Add totalPoints to the score (adjust as needed)
  // Example: score += totalPoints;
  console.log(`Collected ${totalPoints} points from 25 random coins.`);
}

function momsCookiesEffect() {
  updateScoreWithPoints(milestone);
}

let gravityFallAdjustment = 0.01;

function reduceByPercentage(value, percentage) {
  return value * (1 - percentage);
}

function slowFallEffect() {
  const reductionPercentage = 0.3; // Adjust the percentage as needed
  gravityFallAdjustment = reduceByPercentage(
    gravityFallAdjustment,
    reductionPercentage
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
  if (selectedStarter === 'Book Smart') {
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
  selectedStarter = 'Book Smart';
}

function glassesEffect() {
  selectedStarter = 'Glasses';
}

function coinsEffect() {
  selectedStarter = 'Coins';
}

export { booksSmartEffect, glassesEffect, coinsEffect };
