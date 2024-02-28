import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty.js';
import { createStarParticles } from './star-particles';
import lionJumpImg1 from '../public/imgs/nittany-lion/jump-animation/Jump-1.png';
import lionJumpImg2 from '../public/imgs/nittany-lion/jump-animation/Jump-2.png';
import lionLoseImg from '../public/imgs/nittany-lion/jump-animation/Jump-1.png';
import lionRunImg1 from '../public/imgs/nittany-lion/run-cycle/Run-1.png';
import lionRunImg2 from '../public/imgs/nittany-lion/run-cycle/Run-2.png';
import lionRunImg3 from '../public/imgs/nittany-lion/run-cycle/Run-3.png';
import lionRunImg4 from '../public/imgs/nittany-lion/run-cycle/Run-4.png';
import lionIdleImg1 from '../public/imgs/nittany-lion/rest-animation/Rest-1.png';
import lionIdleImg2 from '../public/imgs/nittany-lion/rest-animation/Rest-2.png';
import lionIdleImg3 from '../public/imgs/nittany-lion/rest-animation/Rest-3.png';
import { soundController } from '../utility/sound-controller.js';
import { collectableOptions } from '../game-manager.js';
import StateSingleton from '../game-state.js';
import { createJumpParticles } from './jump-particles.js';
const { getHasLeaf, getJumpCountLimit, getGravityFallAdjustment, getHasStar } =
  StateSingleton;
const dinoElem = document.querySelector('[data-dino]');
const dinoImg = document.querySelector('.dino-img');
const JUMP_SPEED = 0.245;
const DOUBLE_JUMP_SPEED = 0.23; // Adjust this as needed
const GRAVITY = 0.0009;
const DINO_FRAME_COUNT = 4;
const FRAME_TIME = 85;
const BOTTOM_ANCHOR = 19.5;

let isJumping;
let canDoubleJump;
let jumpCount;
let dinoFrame;
let currentFrameTime;
let yVelocity;
let jumpAnimationInProgress;
let newSelectedStarter;
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
    document.removeEventListener('touchend', onJumpEnd);
    document.addEventListener('touchstart', onJump);
    document.addEventListener('touchend', onJumpEnd);
    document.addEventListener('touchstart', onDive);
  } else {
    document.removeEventListener('keydown', onJump);
    document.removeEventListener('keyup', onJumpEnd);
    document.addEventListener('keyup', onJumpEnd);
    document.addEventListener('keydown', onJump);
    document.addEventListener('keydown', onDive);
  }
}

export function updateDino(
  delta,
  speedScale,
  gravityFallAdjustment,
  selectedStarter
) {
  if (!newSelectedStarter) {
    newSelectedStarter = selectedStarter;
  }
  handleRun(delta, speedScale, newSelectedStarter);
  handleJump(delta, gravityFallAdjustment);
  handleDive(delta);
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect();
}

export function setDinoLose() {
  dinoImg.src = lionLoseImg;
  dinoImg.classList.add('leap');
  dinoImg.classList.remove('flash-animation');
  const spotlight = document.getElementById('spotlight');
  spotlight.classList.add('close-spotlight');
}

function startJump(selectedStarter) {
  if (!jumpAnimationInProgress) {
    jumpAnimationInProgress = true;
    dinoImg.src = lionJumpImg1;
    if (selectedStarter === 'Coins') {
      createCoinAboveDino();
    }

    setTimeout(function () {
      dinoImg.src = lionJumpImg2;
    }, 200); // Adjust the delay as needed
  }
}

function endJump() {
  isJumping = false;
  jumpAnimationInProgress = false;
  isFalling = false;
}

let dropOffPlatform = false;
let currentIdleImageIndex = 0;

const imagePaths = [
  lionIdleImg1,
  lionIdleImg2,
  lionIdleImg1,
  lionIdleImg2,
  lionIdleImg1,
  lionIdleImg2,
  lionIdleImg3,
  // Add more image paths as needed
];

export function handleIdle() {
  dinoImg.src = imagePaths[currentIdleImageIndex];
  currentIdleImageIndex = (currentIdleImageIndex + 1) % imagePaths.length; // Loop back to the first image when reaching the end
  // Call the updateImage function at a specific interval (e.g., every 200 milliseconds)
}

let starParticlesCreated = false;

function handleRun(delta, speedScale, selectedStarter) {
  if (getHasStar() && !starParticlesCreated) {
    // Schedule the creation of star particles after a delay
    starParticlesCreated = true; // Update the flag to indicate that star particles have been created
    setTimeout(() => {
      createStarParticles();
      starParticlesCreated = false; // Update the flag to indicate that star particles have been created
    }, 220); // Adjust the delay as needed (in milliseconds)
  }
  if (isJumping) {
    startJump(selectedStarter);
    return;
  }

  // Check if there is a collision and a current platform ID is set
  if (collisionDetected && currentPlatformId) {
    const currentPlatform = document.getElementById(currentPlatformId);
    const currentPlatformRect = currentPlatform.getBoundingClientRect();
    const dinoRect = getDinoRect();
    canDoubleJump = true;
    jumpCount = 0;
    // Check if the dino has reached the end of the current platform
    if (dinoRect.left >= currentPlatformRect.right) {
      dropOffPlatform = true;
      const currentBottom = getCustomProperty(dinoElem, '--bottom');
      yVelocity -= GRAVITY * delta - getGravityFallAdjustment() / 6; // Increase or decrease gravityAdjustment as needed
      incrementCustomProperty(dinoElem, '--bottom', yVelocity * delta);
      if (currentBottom <= BOTTOM_ANCHOR) {
        setCustomProperty(dinoElem, '--bottom', BOTTOM_ANCHOR);
        canDoubleJump = true;
        jumpCount = 0;
      }
      // Dino reached the end of the current platform, end the jump
      canDoubleJump = true;
      jumpCount = 0;

      // Reset the current platform ID
      currentPlatformId = null;
      collisionDetected = false;
    }
  }
  if (dropOffPlatform === true) {
    const currentBottom = getCustomProperty(dinoElem, '--bottom');
    yVelocity -= GRAVITY * delta - getGravityFallAdjustment() / 6; // Increase or decrease gravityAdjustment as needed
    incrementCustomProperty(dinoElem, '--bottom', yVelocity * delta);
    if (currentBottom <= BOTTOM_ANCHOR) {
      setCustomProperty(dinoElem, '--bottom', BOTTOM_ANCHOR);
      endJump();
      canDoubleJump = true;
      jumpCount = 0;
      dropOffPlatform = false;
    }
  }
  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;

    // Use a switch statement to set the image source based on the current frame
    switch (dinoFrame) {
      case 0:
        dinoImg.src = lionRunImg1;
        break;
      case 1:
        dinoImg.src = lionRunImg2;
        break;
      case 2:
        dinoImg.src = lionRunImg3;
        break;
      case 3:
        dinoImg.src = lionRunImg4;
        break;
      // Add more cases if you have more frames
    }

    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

function isCollidingWithPlatforms() {
  // Check for collision with the top surface of platforms
  const dinoRect = getDinoRect();
  const platforms = document.querySelectorAll('[data-platform]');
  platforms.forEach((platform) => {
    const platformRect = platform.getBoundingClientRect();
    if (
      dinoRect.bottom >= platformRect.top &&
      dinoRect.bottom <= platformRect.bottom &&
      dinoRect.right > platformRect.left &&
      dinoRect.left < platformRect.right
    ) {
      endJump();

      // Collision with the top surface of a platform
      dinoElem.style.bottom = platformRect.top;
      collisionDetected = true;

      currentPlatformId = platform.id;
    }
  });
}

let jumpStartTime;
let maxJumpTime = 90; // Maximum duration for the jump in milliseconds
let minJumpTime = 70; // Minimum jump time in milliseconds
let currentPlatformId; // Variable to store the ID of the current platform
let collisionDetected = false;
let isFalling = false;
function handleJump(delta, gravityFallAdjustment = 0.01) {
  if (!isJumping) return;

  // Adjusting fall speed when jumping on the way down
  if (yVelocity <= 0) {
    isFalling = true;
    // Set interval to adjust fall speed every 5 seconds (adjust the interval as needed)
    yVelocity -= getHasLeaf()
      ? GRAVITY * delta - gravityFallAdjustment / 14
      : GRAVITY * delta + gravityFallAdjustment; // Increase or decrease gravityAdjustment as needed
  } else {
    yVelocity -= GRAVITY * delta;
  }

  incrementCustomProperty(dinoElem, '--bottom', yVelocity * delta);

  const currentBottom = getCustomProperty(dinoElem, '--bottom');

  if (isFalling) {
    // Check for collision with the top surface of platforms
    isCollidingWithPlatforms();
  }

  // Check for collision with the ground or platforms
  if (currentBottom <= BOTTOM_ANCHOR) {
    setCustomProperty(dinoElem, '--bottom', BOTTOM_ANCHOR);
    canDoubleJump = true;
    jumpCount = 0;
    endJump();
  }

  if (jumpCount === 1 && canDoubleJump) {
    yVelocity = DOUBLE_JUMP_SPEED;
    canDoubleJump = false;
  }
}

//handles jump key press event
function onJump(e) {
  if (
    (e.code !== 'Space' && e.type !== 'touchstart') ||
    (isJumping && jumpCount >= getJumpCountLimit())
  )
    return;
  endJump();
  startJump(newSelectedStarter);

  // Record the timestamp when the jump key is pressed
  jumpStartTime = Date.now();
  soundController.jump.play();
  isJumping = true;
  yVelocity = JUMP_SPEED;
  jumpCount++;
  if (getHasLeaf()) {
    createJumpParticles(dinoElem);
  }
}

//handles jump key release event
function onJumpEnd(e) {
  if ((e.code !== 'Space' && e.type !== 'touchend') || isFalling) return;

  // Calculate the time the jump key has been held down
  let jumpTime = Date.now() - jumpStartTime;

  // Ensure jumpTime is not lower than minJumpTime
  jumpTime = Math.max(jumpTime, minJumpTime);

  if (maxJumpTime >= jumpTime + 5) {
    // Calculate jump strength based on jump time
    let jumpStrength = Math.min(jumpTime / maxJumpTime, 1); // Normalize between 0 and 1
    jumpStrength = Math.pow(jumpStrength, 2); // Apply a power function for smoother acceleration

    // Calculate jump velocity
    const jumpVelocity = JUMP_SPEED * jumpStrength;

    // Set the yVelocity to the calculated jump velocity
    yVelocity = jumpVelocity;
  }
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

function createCoinAboveDino() {
  const coinElement = document.createElement('div');

  let selectedCollectable = collectableOptions[0];

  coinElement.dataset.coin = true;
  coinElement.dataset.type = selectedCollectable.type;
  coinElement.dataset.locked = 'false';
  coinElement.dataset.points = selectedCollectable.points;
  coinElement.classList.add('pop-up-gold-coin', 'collectable');
  coinElement.id = Math.random().toString(16).slice(2);

  // Set the initial position of the coin above the dino
  coinElement.style.position = 'absolute';
  coinElement.style.top = dinoElem.offsetTop - 50 + 'px'; // Adjust the vertical position as needed
  coinElement.style.left = dinoElem.offsetLeft + 50 + 'px'; // Center above the dino
  // Append the coin element to the document body or another container
  const worldElem = document.querySelector('[data-world]');
  worldElem.appendChild(coinElement);
}
