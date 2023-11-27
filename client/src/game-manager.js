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
const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector('[data-world]');
const scoreElem = document.querySelector('[data-score]');
const highScoreElem = document.querySelector('[data-high-score]');
const startScreenElem = document.querySelector('[data-start-screen]');
const endScreenElem = document.querySelector('[data-game-over-screen]');
const leaderboardElem = document.querySelector('[data-leaderboard-body]');
const scoreNewHighScoreElem = document.querySelector(
  '[data-score-new-high-score]'
);
const scoreErrorMessageElem = document.querySelector(
  '[data-score-error-message]'
);
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
highScoreElem.textContent = localStorage.getItem('lion-high-score')
  ? localStorage.getItem('lion-high-score')
  : Math.floor('0').toString().padStart(6, 0);
let hasBeatenScore = false;

function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;

  updateGround(delta, speedScale);
  updateDino(delta, speedScale);
  updateCactus(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  if (checkLose()) return handleLose();

  lastTime = time;
  window.requestAnimationFrame(update);
}

function checkLose() {
  const dinoRect = getDinoRect();
  return getCactusRects().some((rect) => isCollision(rect, dinoRect));
}

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
  setupGround();
  setupDino();
  setupCactus();
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
  console.log(highScoreElem.textContent);
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
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}
