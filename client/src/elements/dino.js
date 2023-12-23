import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty.js';
import lionJumpImg1 from '../public/imgs/nittany-lion/jump-animation/Jump-1.png';
import lionJumpImg2 from '../public/imgs/nittany-lion/jump-animation/Jump-2.png';
import lionJumpImg3 from '../public/imgs/nittany-lion/jump-animation/Jump-3.png';
import lionLoseImg from '../public/imgs/nittany-lion/jump-animation/Jump-1.png';
import lionRunImg1 from '../public/imgs/nittany-lion/run-cycle/Run-1.png';
import lionRunImg2 from '../public/imgs/nittany-lion/run-cycle/Run-2.png';
import lionRunImg3 from '../public/imgs/nittany-lion/run-cycle/Run-3.png';
import lionRunImg4 from '../public/imgs/nittany-lion/run-cycle/Run-4.png';
import lionRunImg5 from '../public/imgs/nittany-lion/run-cycle/Run-5.png';
import lionRunImg6 from '../public/imgs/nittany-lion/run-cycle/Run-6.png';
import { soundController } from '../utility/sound-controller.js';

const dinoElem = document.querySelector('[data-dino]');
const JUMP_SPEED = 0.21;
const DOUBLE_JUMP_SPEED = 0.23; // Adjust this as needed
const GRAVITY = 0.00075;
const DINO_FRAME_COUNT = 6;
const JUMP_FRAME_COUNT = 3;
const FRAME_TIME = 100;
const BOTTOM_ANCHOR = 17.5;

let isJumping;
let canDoubleJump;
let jumpCount;
let dinoFrame;
let currentFrameTime;
let yVelocity;
let jumpAnimationInProgress;

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function setupDino() {
  isJumping = false;
  jumpAnimationInProgress = false;
  canDoubleJump = true;
  jumpCount = 0;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(dinoElem, '--bottom', BOTTOM_ANCHOR);

  // Function to check if the device is a mobile device
  if (isMobileDevice()) {
    document.removeEventListener('touchstart', onJump);
    document.addEventListener('touchstart', onJump);
    document.addEventListener('touchstart', onDive);
  } else {
    document.removeEventListener('keydown', onJump);
    document.addEventListener('keydown', onJump);
    document.addEventListener('keydown', onDive);
  }
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
  handleDive(delta);
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect();
}

export function setDinoLose() {
  dinoElem.src = lionLoseImg;
  dinoElem.classList.add('leap');
  dinoElem.classList.remove('flash-animation');
  const spotlight = document.getElementById('spotlight');
  spotlight.classList.add('close-spotlight');
}

function startJump() {
  if (!jumpAnimationInProgress) {
    jumpAnimationInProgress = true;
    dinoElem.src = lionJumpImg1;

    setTimeout(function () {
      dinoElem.src = lionJumpImg2;
    }, 320); // Adjust the delay as needed

    setTimeout(function () {
      dinoElem.src = lionJumpImg3;
    }, 400); // Adjust the delay as needed
  }
}

function endJump() {
  isJumping = false;
  jumpAnimationInProgress = false;
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    startJump();
    return;
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;

    // Use a switch statement to set the image source based on the current frame
    switch (dinoFrame) {
      case 0:
        dinoElem.src = lionRunImg1;
        break;
      case 1:
        dinoElem.src = lionRunImg2;
        break;
      case 2:
        dinoElem.src = lionRunImg3;
        break;
      case 3:
        dinoElem.src = lionRunImg4;
        break;
      case 4:
        dinoElem.src = lionRunImg5;
        break;
      case 5:
        dinoElem.src = lionRunImg6;
        break;
      // Add more cases if you have more frames
    }

    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
  if (!isJumping) return;
  incrementCustomProperty(dinoElem, '--bottom', yVelocity * delta);

  if (getCustomProperty(dinoElem, '--bottom') <= BOTTOM_ANCHOR) {
    setCustomProperty(dinoElem, '--bottom', BOTTOM_ANCHOR);
    endJump();
    canDoubleJump = true;
    jumpCount = 0;
  }

  if (jumpCount === 1 && canDoubleJump) {
    yVelocity = DOUBLE_JUMP_SPEED;
    canDoubleJump = false;
  }

  yVelocity -= GRAVITY * delta;
}

function onJump(e) {
  if (
    (e.code !== 'Space' && e.type !== 'touchstart') ||
    (isJumping && jumpCount >= 2)
  )
    return;
  endJump();
  startJump();
  soundController.jump.play();
  yVelocity = JUMP_SPEED;
  isJumping = true;
  jumpCount++;
}

const DIVE_SPEED = 0.2; // Adjust the dive speed as needed
let isDiving = false;

function handleDive(delta) {
  if (!isDiving) return;
  incrementCustomProperty(dinoElem, '--bottom', yVelocity * delta);

  if (getCustomProperty(dinoElem, '--bottom') <= BOTTOM_ANCHOR) {
    setCustomProperty(dinoElem, '--bottom', BOTTOM_ANCHOR);
    isDiving = false;
    jumpCount = 0;
  }
  yVelocity -= GRAVITY * delta;
}

function onDive(e) {
  if ((e.code !== 'ArrowDown' && e.type !== 'touchstart') || isDiving) return;

  yVelocity = -DIVE_SPEED; // Negative value for diving down
  isDiving = true;

  // Add any additional logic you need for the dive action

  // Optional: You might want to reset isJumping and jumpCount here if needed
  isJumping = false;
  jumpCount = 0;
}
