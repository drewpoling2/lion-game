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
import { getAllHighScoreUsers } from './apis.js';
import { useState } from 'react';
const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector('[data-world]');
const scoreElem = document.querySelector('[data-score]');
const highScoreElem = document.querySelector('[data-high-score]');
const startScreenElem = document.querySelector('[data-start-screen]');
const endScreenElem = document.querySelector('[data-game-over-screen]');
const leaderboardElem = document.querySelector('[data-leaderboard-body]');
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
let highScore = localStorage.getItem('lion-high-score');
highScoreElem.textContent = highScore;

let isBeatScore;

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
  if (!isBeatScore && score > highScore) {
    console.log(highScore);
    isBeatScore = true;
  }
}

function updateHighScore(highScore, score) {
  if (score > highScore) {
    highScore = Math.floor(score).toString().padStart(6, 0);
    highScoreElem.textContent = highScore;
    localStorage.setItem('lion-high-score', highScore);
  }
}
function handleStart() {
  lastTime = null;
  speedScale = 0.9;
  score = 0;
  isBeatScore = false;
  setupGround();
  setupDino();
  setupCactus();
  startScreenElem.classList.add('hide');
  endScreenElem.classList.add('hide');
  window.requestAnimationFrame(update);
}

//not working for some reason
function handleCheckIfNewHighScore(score) {
  const users = getAllHighScoreUsers().then((data) => {
    console.log(
      data.users.findIndex((element) => {
        parseInt(score, 10) > parseInt(element.score, 10);
      })
    ),
      console.log(data.users);
  });
}

function handleLose() {
  updateHighScore(highScore, score);
  // handleCheckIfNewHighScore();
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
