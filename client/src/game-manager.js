import { updateGround, setupGround } from './elements/ground.js';
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
import { createLeaderboard } from './elements/leaderboard.js';
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
const WORLD_WIDTH = 95;
const WORLD_HEIGHT = 32;
const SPEED_SCALE_INCREASE = 0.00001;
let multiplierRatio = 1;
const worldElem = document.querySelector('[data-world]');
const scoreElem = document.querySelector('[data-score]');
const highScoreElem = document.querySelector('[data-high-score]');
const startScreenElem = document.querySelector('[data-start-screen]');
const endScreenElem = document.querySelector('[data-game-over-screen]');
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
const livesElem = document.querySelector('[data-lives]');
const dinoElem = document.querySelector('[data-dino]');
const currentMultiplierElem = document.querySelector(
  '[data-current-multiplier]'
);
const plusPointsElem = document.querySelector('[data-plus-points]');
// const playAgainButtonElem = document.querySelector('[data-play-again]');

// playAgainButtonElem.addEventListener('click', function () {
//   handleStart(); // Add any other actions you want to perform on button click
// });

setPixelToWorldScale();
// createLeaderboard(leaderboardElem);
window.addEventListener('resize', setPixelToWorldScale);
document.addEventListener('keydown', handleStart, { once: true });
document.addEventListener('touchstart', handleStart, { once: true });
let lastTime;
let speedScale;
let score;
let collisionOccurred = false; // Flag to track collision

//init highScore elem
highScoreElem.textContent = localStorage.getItem('lion-high-score')
  ? localStorage.getItem('lion-high-score')
  : Math.floor('0').toString().padStart(6, 0);
let hasBeatenScore = false;
let isPaused = false;
let playerImmunity = false;
let immunityDuration = 2000; // Example: 2000 milliseconds (2 seconds)

// Function to toggle the pause state
function togglePause() {
  isPaused = !isPaused;
  if (isPaused) {
  } else {
    window.requestAnimationFrame(update);
  }
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

  // let delta = time - lastTime;
  let delta = 8;
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
  updateDino(delta, speedScale);
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

let multiplierTimer = 5;
let timerInterval;

function startMultiplierTimer() {
  //reset the old timer
  clearInterval(timerInterval);
  multiplierTimer = 5;
  multiplierTimerElem.textContent = multiplierTimer;

  //start new interval
  timerInterval = setInterval(() => {
    multiplierTimer--;
    if (multiplierTimer === 0) {
      clearInterval(timerInterval);
      console.log('hit');
      multiplierTimerElem.textContent = '';
      // Reset the timer and multiplier when the countdown ends
      multiplierTimer = 5;
      multiplierRatio = 1;
      currentMultiplierElem.textContent = 1;
    } else {
      multiplierTimerElem.textContent = multiplierTimer;
    }
  }, 1000); // Update the timer every second (1000 milliseconds)
}

function checkMultiplierCollision() {
  const dinoRect = getDinoRect();
  getMultiplierRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      soundController.beatScore.play();
      document.getElementById(element.id).remove();
      clearInterval(timerInterval);
      startMultiplierTimer();
      // Multiply the existing multiplier by the newly collided multiplier
      multiplierRatio *= parseInt(element.multiplier);
      currentMultiplierElem.textContent = multiplierRatio;
      return true;
    }
  });
}

const duration = 1000;
const updateInterval = 50;

function randomArc(element) {
  // Set random horizontal movement values
  const randomXEnd = Math.random() * 100 - 50; // Adjust the range based on your preference
  console.log(randomXEnd);
  document.documentElement.style.setProperty(
    '--random-x-end',
    randomXEnd + 'px'
  );
}

function calculateFontSize(points) {
  return Math.min(17 + points * 0.05, 35);
}

function checkCoinCollision() {
  const dinoRect = getDinoRect();
  getCoinRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      soundController.pickupCoin.play();
      const coinElement = document.getElementById(element.id);
      const newElement = document.createElement('div');
      newElement.classList.add('plus-points', 'sans');
      newElement.style.position = 'absolute';
      newElement.style.left = coinElement.offsetLeft + 'px';
      newElement.style.top = coinElement.offsetTop - 70 + 'px';
      randomArc(newElement);
      coinElement.parentNode.insertBefore(newElement, coinElement);
      coinElement.remove();
      const points = 100 * multiplierRatio;
      updateScoreWithPoints(points);
      const fontSize = calculateFontSize(points);
      newElement.style.fontSize = fontSize + 'px';
      newElement.textContent = `+${points}`;
      setTimeout(() => {
        newElement.remove();
      }, 600);
      return true;
    }
  });
}

function updateScoreWithPoints(delta) {
  const initialScore = score;
  const increments = Math.ceil(duration / updateInterval);
  const incrementAmount = delta / increments;

  const intervalId = setInterval(() => {
    score += incrementAmount;
    scoreElem.textContent = Math.floor(score).toString().padStart(6, 0);

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
    return true;
  } //check if enemy and player are in colliding
  else if (isEnemyAndPlayerCollision && !playerImmunity) {
    //check if player is not in previous collision state
    if (!collisionOccurred) {
      // decrement lives elem by 1
      if (livesElem) {
        let currentLives = parseInt(livesElem.textContent, 10);
        if (!isNaN(currentLives)) {
          currentLives -= 1;
          livesElem.textContent = currentLives;
        }
      }
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

//mute/unmute function
muteButton.addEventListener('click', function () {
  if (!soundControllerMuted) {
    Object.keys(soundController).forEach(function (key) {
      soundController[key].mute(true);
    });
    muteButton.textContent = 'Unmute';
    soundControllerMuted = true;
    muteButton.blur();
  } else {
    Object.keys(soundController).forEach(function (key) {
      soundController[key].mute(false);
    });
    muteButton.textContent = 'Mute';
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

function updateScore(delta) {
  score += delta * 0.01;
  scoreElem.textContent = Math.floor(score).toString().padStart(6, 0);

  if (
    score > highScoreElem.textContent &&
    !hasBeatenScore &&
    highScoreElem.textContent !== '000000'
  ) {
    soundController.beatScore.play();
    hasBeatenScore = true;
  }
}

function handleCheckIfHighScore(score) {
  if (score > highScoreElem.textContent) {
    highScoreElem.textContent = Math.floor(score).toString().padStart(6, 0);
    localStorage.setItem('lion-high-score', highScoreElem.textContent);
    handleCheckLeaderboardHighScore(highScoreElem.textContent);
  }
}

function handleStart() {
  lastTime = null;
  hasBeatenScore = false;
  speedScale = 0.9;
  score = 0;
  multiplierRatio = 1;
  console.log(multiplierRatio);
  currentMultiplierElem.textContent = multiplierRatio;
  livesElem.textContent = 2;
  setupGround();
  setupDino();
  setupCactus();
  setupMultiplier();
  setupCoin();
  startScreenElem.classList.add('hide');
  endScreenElem.classList.add('hide');
  // Get the container element where the ticker items will be appended
  const tickerData = [
    {
      username: 'bap',
      score: 'start',
    },
    { username: 'b4p', score: '323451' },
    { username: 'fgp', score: '331451' },
    { username: 'agf', score: '131451' },
    {
      username: 'bap',
      score: '353451',
    },
    { username: 'b4p', score: '323451' },
    { username: 'fgp', score: '331451' },
    {
      username: 'bap',
      score: '353451',
    },
    { username: 'b4p', score: '323451' },
    { username: 'fgp', score: '331451' },
    { username: 'agf', score: '131451' },
    {
      username: 'bap',
      score: '353451',
    },
    { username: 'b4p', score: '323451' },
    { username: 'fgp', score: 'end' },
  ];
  // // Map over the data and create HTML elements for each item
  // tickerData.forEach((item, index) => {
  //   const tickerItem = document.createElement('div');
  //   tickerItem.classList.add('ticker-item');
  //   tickerItem.innerHTML = `${item.username} - ${item.score}`;
  //   const tickerDivider = document.createElement('div');
  //   tickerDivider.classList.add('ticker-divider');
  //   tickerElem.appendChild(tickerItem);
  //   // Add a divider after each item, except for the last one
  //   if (index < tickerData.length - 1) {
  //     tickerElem.appendChild(tickerDivider);
  //   }
  // });
  // tickerData.forEach((item, index) => {
  //   const tickerItem = document.createElement('div');
  //   tickerItem.classList.add('ticker-item');
  //   tickerItem.innerHTML = `${item.username} - ${item.score}`;
  //   const tickerDivider = document.createElement('div');
  //   tickerDivider.classList.add('ticker-divider');
  //   tickerElem.appendChild(tickerItem);
  //   // Add a divider after each item, except for the last one
  //   if (index < tickerData.length - 1) {
  //     tickerElem.appendChild(tickerDivider);
  //   }
  // });

  window.requestAnimationFrame(update);
}

function handleCheckLeaderboardHighScore(score) {
  const users = getAllHighScoreUsers().then((data) => {
    const sortedData = data.users.sort((a, b) => {
      return parseInt(b.score, 10) - parseInt(a.score, 10);
    });
  });
}

handleCheckLeaderboardHighScore('90013');

async function handleSubmitNewScore() {
  const userInput = document.getElementById('newHighScoreInput').value;
  //check for validation errors and update error message accordingly
  if (!validateInput() || !userInput) {
    scoreErrorMessageElem.textContent = 'Enter a valid name!';
    scoreErrorMessageElem.classList.remove('hide');
    return;
  }

  const scoreNewHighScoreElem = document.querySelector(
    '[data-score-new-high-score]'
  );
  const res = await handleNewHighScore(
    userInput,
    scoreNewHighScoreElem.textContent
  );

  //check if user already exists from res and update error message accordingly, else submit new score
  if (res === 'user already exists') {
    scoreErrorMessageElem.textContent = res;
    scoreErrorMessageElem.classList.remove('hide');
    return;
  } else {
    scoreErrorMessageElem.classList.add('hide');
  }
}

if (document.getElementById('submit-button')) {
  document
    .getElementById('submit-button')
    .addEventListener('click', handleSubmitNewScore);
}

function handleLose() {
  handleCheckIfHighScore(score);
  soundController.die.play();
  setDinoLose();
  setTimeout(() => {
    document.addEventListener('keydown', handleStart, { once: true });
    document.addEventListener('touchstart', handleStart, { once: true });
    endScreenElem.classList.remove('hide');
  }, 100);
}

function setPixelToWorldScale() {
  let worldToPixelScale;
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH / 1.25;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}
