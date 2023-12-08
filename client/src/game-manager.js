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
const WORLD_WIDTH = 82;
const WORLD_HEIGHT = 32;
const SPEED_SCALE_INCREASE = 0.00001;

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

const livesElem = document.querySelector('[data-lives]');
const dinoElem = document.querySelector('[data-dino]');
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
    // Record the start time of the pause
    // pauseStartTime = performance.now();
  } else {
    // Calculate the total pause duration
    // pauseDuration += performance.now() - pauseStartTime;
    // isFirstFrameAfterCollision = false;

    // Trigger the next animation frame
    window.requestAnimationFrame(update);
  }
}

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

function checkMultiplierCollision() {
  const dinoRect = getDinoRect();
  getMultiplierRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      soundController.beatScore.play();
      document.getElementById(element.id).remove();
      updateScoreWithMultiplier(1000);
      return true;
    }
  });
}

const duration = 1000;
const updateInterval = 50;

function updateScoreWithMultiplier(delta) {
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

function checkCoinCollision() {
  const dinoRect = getDinoRect();
  getCoinRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      soundController.pickupCoin.play();
      document.getElementById(element.id).remove();
      updateScoreWithMultiplier(100);
      return true;
    }
  });
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
  livesElem.textContent = 2;
  setupGround();
  setupDino();
  setupCactus();
  setupMultiplier();
  setupCoin();
  startScreenElem.classList.add('hide');
  endScreenElem.classList.add('hide');
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
