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
import {
  setupCoin,
  updateCoin,
  getCoinRects,
  getCoinRectsWithOuterRadius,
} from './elements/coin.js';
import muteImg from './public/imgs/icons/Speaker-Off.png';
import unmuteImg from './public/imgs/icons/Speaker-On.png';
import pauseImg from './public/imgs/icons/Pause.png';
import playImg from './public/imgs/icons/Play.png';
import redoImg from './public/imgs/icons/Redo.png';
import foregroundImg from './public/imgs/backgrounds/Foreground-Trees.png';
const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 45;
const SPEED_SCALE_INCREASE = 0.00001;
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
const livesElem = document.querySelector('[data-lives]');
const dinoElem = document.querySelector('[data-dino]');
const scrollableTableElem = document.querySelector('[data-scrollable-table]');
const currentMultiplierElem = document.querySelector(
  '[data-current-multiplier]'
);
const plusPointsElem = document.querySelector('[data-plus-points]');
const tickerContainerElem = document.querySelector('[data-ticker-container]');
const loadingTextElem = document.querySelector('[data-loading-text]');

// const playAgainButtonElem = document.querySelector('[data-play-again]');

// playAgainButtonElem.addEventListener('click', function () {
//   handleStart(); // Add any other actions you want to perform on button click
// });
setPixelToWorldScale();
createLeaderboard(leaderboardElem);
window.addEventListener('resize', setPixelToWorldScale);
// document.addEventListener('keydown', handleStart, { once: true });
// document.addEventListener('touchstart', handleStart, { once: true });
let lastTime;
let speedScale;
let score;
let collisionOccurred = false; // Flag to track collision
let milestone = 10000;
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
// tickerContainerElem.classList.add('hide-element');
// tickerContainerElem.classList.remove('show-element');
const pauseIconButton = document.getElementById('pause-icon-button');

// Function to toggle the pause state
function togglePause() {
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
  updateGroundLayerThree(delta, speedScale);
  updateGroundLayerTwo(delta, speedScale);
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

function createOneUpText() {
  soundController.beatScore.play();

  const newElement = document.createElement('div');
  newElement.classList.add('one-up', 'sans');
  newElement.style.position = 'absolute';
  newElement.style.left = livesElem.offsetLeft + 'px';
  newElement.style.top = '20%';
  livesElem.parentNode.insertBefore(newElement, livesElem);
  newElement.textContent = '1UP';
  setTimeout(() => {
    newElement.remove();
  }, 600);
  return true;
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
  document.documentElement.style.setProperty(
    '--random-x-end',
    randomXEnd + 'px'
  );
}

function calculateFontSize(points) {
  return Math.min(20 + points * 0.08, 46);
}

function checkCoinCollision() {
  const dinoRect = getDinoRect();

  getCoinRects().some((element) => {
    if (isCollision(element.rect, dinoRect)) {
      const coinElement = document.getElementById(element.id);
      // Create a pickup text element
      console.log('picked up');
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

function addPickupText(text, pickupElement) {
  text.classList.add('plus-points', 'sans');
  text.style.position = 'absolute';
  text.style.left = pickupElement.offsetLeft + 'px';
  text.style.top = pickupElement.offsetTop - 70 + 'px';
  randomArc(text);
  pickupElement.parentNode.insertBefore(text, pickupElement);
  const points = pickupElement?.dataset?.points * multiplierRatio;
  updateScoreWithPoints(points);
  const fontSize = calculateFontSize(points);
  text.style.fontSize = fontSize + 'px';
  text.textContent = `+${points}`;
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
    worldElem.setAttribute('transition-style', 'out:circle:hesitate');
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

function calculateNextMilestone(currentMilestone) {
  // You can customize the growth rate based on your requirements
  const growthRate = 1.5; // Adjust this as needed
  return Math.floor(currentMilestone * growthRate);
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
  if (score > milestone) {
    createOneUpText();
    let currentLives = parseInt(livesElem.textContent, 10);
    currentLives += 1;
    livesElem.textContent = currentLives;
    milestone = calculateNextMilestone(milestone);
    console.log(milestone);
  }
}

function handleCheckIfHighScore(score) {
  if (score > highScoreElem.textContent) {
    highScoreElem.textContent = Math.floor(score).toString().padStart(6, 0);
    localStorage.setItem('lion-high-score', highScoreElem.textContent);
    handleCheckLeaderboardHighScore(highScoreElem.textContent);
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
  currentMultiplierElem.textContent = multiplierRatio;
  livesElem.textContent = 2;
  startScreenElem.classList.add('hide');
  endScreenElem.classList.add('hide');
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

document
  .getElementById('closeLeaderboard')
  .addEventListener('click', handleToggleLeaderboard);

document
  .getElementById('toggleLeaderboard')
  .addEventListener('click', handleToggleLeaderboard);

document
  .getElementById('shareButton')
  .addEventListener('click', handleOpenShareContainer);

let showLeaderboard = false;

let loading;
function stopLoading() {
  loading = false;
}

function handleToggleLeaderboard() {
  const leaderboardContent = document.getElementById('leaderboard-content');

  if (!showLeaderboard) {
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
    loading = true;
    runTypeLetters();
    showLeaderboard = !showLeaderboard;
    scrollableTableElem.setAttribute('transition-style', 'out:wipe:right');
    leaderboardContent.classList.add('flicker-opacity-off');
    setTimeout(() => {
      stopLoading();
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
  handleCheckIfHighScore(score);
  soundController.die.play();
  setDinoLose();
  setTimeout(() => {
    document.addEventListener('keydown', handleStart, { once: true });
    document.addEventListener('touchstart', handleStart, { once: true });
    endScreenElem.classList.remove('hide');
  }, 100);
  setTimeout(() => {
    typeLetters(0);
  }, 1500);
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
