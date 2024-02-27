import { snackBarElem, snackBarIconElem, worldElem } from '../elements-refs';
import {
  incrementCustomProperty,
  getCustomProperty,
  setCustomProperty,
} from '../utility/updateCustomProperty';
import StateSingleton from '../game-state';
import { getDinoRect } from './player-controller';
import star from '../public/imgs/items/star/Star-1.png';
import heart from '../public/imgs/items/heart/Heart-1.png';
import leaf from '../public/imgs/items/leaf/Leaf-1.png';
import cherry from '../public/imgs/items/cherry/Cherry-1.png';
import { moveItemToPlayer } from './coin';
const { getGroundSpeed } = StateSingleton;
const images = [star, heart, leaf, cherry]; // Array of image URLs
const imageVariables = { star, heart, leaf, cherry }; // Mapping object for image variables

let currentIndex = 0; // Initial index of the image
const SPEED = getGroundSpeed();

// Function to find the index of elementName in the images array
function findIndexByElementName(elementName) {
  return images.findIndex((image) => image === imageVariables[elementName]);
}

// Function to update the image source
function updateImage(icon) {
  icon.src = images[currentIndex];
  currentIndex = (currentIndex + 1) % images.length; // Move to the next image in the array
}
// Function to start the slot machine animation
export function startSlotMachine(elementName) {
  console.log(elementName);
  const icon = document.createElement('img');
  snackBarIconElem.appendChild(icon);
  icon.classList.add('w-full', 'snackbar-img');
  const animationDuration = 900; // Total duration of the animation in milliseconds
  const initialInterval = 200; // Initial interval between image changes in milliseconds
  const slowdownIntervalStep = 10; // Step size for adjusting the interval duration during slowdown
  let startTime = Date.now(); // Start time of the animation

  const interval = setInterval(() => {
    const currentTime = Date.now(); // Current time
    const elapsedTime = currentTime - startTime; // Elapsed time since the animation started
    const remainingTime = animationDuration - elapsedTime; // Remaining time until the end of the animation

    updateImage(icon);

    if (remainingTime <= 0) {
      // Stop the animation when the total duration is reached
      clearInterval(interval);
    } else if (currentIndex === images.length - 1) {
      // If the target image is reached, apply the slowdown effect
      let slowdownInterval = initialInterval;

      // Gradually decrease the interval duration to create a slowdown effect
      const slowdownIntervalId = setInterval(() => {
        updateImage(icon);
        slowdownInterval += slowdownIntervalStep;

        if (slowdownInterval >= remainingTime) {
          // Stop the slowdown effect when the interval duration exceeds the remaining time
          clearInterval(slowdownIntervalId);
          const index = findIndexByElementName(elementName);
          icon.src = images[index];

          icon.classList.add('flash-color');

          setTimeout(() => {
            snackBarElem.classList.add('hide-element');
            snackBarIconElem.innerHTML = ''; // Remove all children
            createNotificationItem(elementName, snackBarElem);
          }, 2000);
        }
      }, slowdownInterval);
    }
  }, initialInterval); // Use the initial interval as the interval time
}

// Start the slot machine animation

export function createNotificationItem(elementName, parent) {
  const element = document.createElement('div');
  element.dataset.notificationItem = true;
  element.dataset[`${elementName}`] = true;
  element.classList.add(
    `${elementName}-collectable-item-translate`,
    'collectable-crate-item'
  );
  element.style.top = 'unset';
  element.id = Math.random().toString(16).slice(2);

  setCustomProperty(element, '--bottom', getCustomProperty(parent, '--bottom'));
  setCustomProperty(element, '--left', getCustomProperty(parent, '--left'));
  worldElem.appendChild(element);
  element.dataset.itemLocked = true;
}

export function updateNotificationItem(delta, speedScale) {
  const dinoRect = getDinoRect();

  const crateItems = document.querySelectorAll('[data-notification-item]');
  // if any crate items exist then move them to player
  if (crateItems.length > 0) {
    crateItems.forEach((crateItem) => {
      incrementCustomProperty(
        crateItem,
        '--left',
        delta * speedScale * SPEED * -1
      );
      if (crateItem.dataset.itemLocked) {
        const crateItemRect = crateItem.getBoundingClientRect();
        // Calculate distance
        const distance = Math.sqrt(
          Math.pow(dinoRect.x - crateItemRect.x, 2) +
            Math.pow(dinoRect.y - crateItemRect.y, 2)
        );
        moveItemToPlayer(dinoRect, crateItem, crateItemRect, distance, delta);
      }
    });
  }
}
