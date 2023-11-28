import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty.js';
import dinoStationaryImg from '../public/imgs/dino-stationary.png';
import dinoLoseImg from '../public/imgs/dino-lose.png';
import dinoRun0Img from '../public/imgs/dino-run-0.png';
import dinoRun1Img from '../public/imgs/dino-run-1.png';
import { soundController } from '../utility/sound-controller.js';

const dinoElem = document.querySelector('[data-dino]');
const JUMP_SPEED = 0.21;
const DOUBLE_JUMP_SPEED = 0.23; // Adjust this as needed
const GRAVITY = 0.00075;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;

let isJumping;
let canDoubleJump;
let jumpCount;
let dinoFrame;
let currentFrameTime;
let yVelocity;

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function setupDino() {
  isJumping = false;
  canDoubleJump = true;
  jumpCount = 0;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(dinoElem, '--bottom', 0);

  // Function to check if the device is a mobile device
  if (isMobileDevice()) {
    document.removeEventListener('touchstart', onJump);
    document.addEventListener('touchstart', onJump);
  } else {
    document.removeEventListener('keydown', onJump);
    document.addEventListener('keydown', onJump);
  }
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect();
}

export function setDinoLose() {
  dinoElem.src = dinoLoseImg;
  dinoElem.classList.remove('flash-animation');
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = dinoStationaryImg;
    return;
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
    dinoElem.src = dinoFrame === 1 ? dinoRun1Img : dinoRun0Img;
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
  if (!isJumping) return;
  incrementCustomProperty(dinoElem, '--bottom', yVelocity * delta);

  if (getCustomProperty(dinoElem, '--bottom') <= 0) {
    setCustomProperty(dinoElem, '--bottom', 0);
    isJumping = false;
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

  soundController.jump.play();
  yVelocity = JUMP_SPEED;
  isJumping = true;
  jumpCount++;
}
