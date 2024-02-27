import iceCream from '../public/imgs/buffs/icecream.png';
import mittens from '../public/imgs/buffs/mittens.png';
import stopwatch from '../public/imgs/buffs/stopwatch.png';
import book from '../public/imgs/buffs/book.png';
import sneakers from '../public/imgs/buffs/sneakers.png';
import coffee from '../public/imgs/buffs/coffee.png';
import backpack from '../public/imgs/buffs/backpack.png';
import cowbell from '../public/imgs/buffs/cowbell.png';

import {
  filetMignonEffect,
  coffeeEffect,
  stopWatchEffect,
  booksSmartEffect,
  sackOfCoinsEffect,
  togglePause,
  sneakersEffect,
  cowbellEffect,
  mittensEffect,
} from '../game-manager';
import { confetti } from './particle-systems';
const buffOptionsContainer = document.querySelector('.buff-options');
const modal = document.getElementById('level-up-modal');

function applyBuff(buffName) {
  // Implement logic to apply the selected buff
  console.log(`Applying ${buffName}`);
  buffs[buffName].effect();

  confetti.destroy();
  // Close the modal
  modal.style.display = 'none';
  modal.classList.remove('show-modal');
  buffOptionsContainer.innerHTML = '';
  togglePause();
}

function applyStarterBuff(buffName) {
  // Get all power-up divs
  const powerUpDivs = document.querySelectorAll('.starter-power-up');
  // Check if the user already has the selected power-up

  // Find the first available power-up div without a power-up
  const lastEmptyPowerUp = Array.from(powerUpDivs).find(
    (powerUpDiv) => !powerUpDiv.querySelector('img')
  );

  if (lastEmptyPowerUp) {
    lastEmptyPowerUp.classList.remove('dim');

    // Implement logic to apply the selected buff
    console.log(`Applying ${buffName}`);
    starterBuffs[buffName].effect();

    // Add the icon to the power-up div
    const icon = document.createElement('img');
    icon.src = starterBuffs[buffName].icon;
    icon.alt = `${buffName}`;
    icon.classList.add('w-full');
    lastEmptyPowerUp.appendChild(icon);
  }
  confetti.destroy();
  // Close the modal
  modal.style.display = 'none';
  modal.classList.remove('show-modal');
  buffOptionsContainer.innerHTML = '';
  togglePause();
}

export function createStarterBuffs() {
  togglePause();
  // Show the modal
  const modal = document.getElementById('level-up-modal');
  modal.style.display = 'flex';
  modal.classList.add('show-modal');

  Object.keys(starterBuffs).map((key) => {
    // Create buff container (use a div as a clickable area)
    const buffContainer = document.createElement('div');
    buffContainer.classList.add('buff-container', 'starter-buff');
    buffContainer.addEventListener('click', () => applyStarterBuff(key));

    // Create flex container for icon and title
    const flexContainer = document.createElement('div');
    flexContainer.classList.add('flex-col', 'items-center');

    // Create div to wrap the icon
    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add('buff-icon-wrapper');

    // Create icon (adjust the path accordingly)
    const icon = document.createElement('img');
    icon.classList.add('buff-icon');
    icon.src = starterBuffs[key].icon;
    icon.alt = `${key} Icon`;

    // Create title
    const title = document.createElement('div');
    title.classList.add('buff-title', 'uppercase');
    title.textContent = key;

    // Append icon wrapper and title to flex container
    flexContainer.appendChild(title);
    // Append icon to icon wrapper
    iconWrapper.appendChild(icon);
    flexContainer.appendChild(iconWrapper);

    // Create description
    const description = document.createElement('p');
    description.classList.add('buff-description', 'body');
    description.textContent = starterBuffs[key].description;

    const buffContainerTop = document.createElement('div');
    buffContainerTop.classList.add('flex-col');

    // Append flex container and description to buff container
    buffContainerTop.appendChild(flexContainer);
    buffContainerTop.appendChild(description);
    buffContainer.appendChild(buffContainerTop);

    // Append buff container to modal content
    buffOptionsContainer.appendChild(buffContainer);
  });

  confetti.init();
}

export function createBuffs() {
  togglePause();
  // Show the modal
  const modal = document.getElementById('level-up-modal');
  modal.style.display = 'flex';
  modal.classList.add('show-modal');

  Object.keys(buffs).map((key) => {
    // Create buff container (use a div as a clickable area)
    const buffContainer = document.createElement('div');
    buffContainer.classList.add('buff-container');
    buffContainer.addEventListener('click', () => applyBuff(key));

    // Create flex container for icon and title
    const flexContainer = document.createElement('div');
    flexContainer.classList.add('flex-col', 'items-center');

    // Create div to wrap the icon
    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add('buff-icon-wrapper');

    // Create icon (adjust the path accordingly)
    const icon = document.createElement('img');
    icon.classList.add('buff-icon');
    icon.src = buffs[key].icon;
    icon.alt = `${key} Icon`;

    // Create title
    const title = document.createElement('div');
    title.classList.add('buff-title', 'uppercase');
    title.textContent = key;

    // Append icon wrapper and title to flex container
    flexContainer.appendChild(title);
    // Append icon to icon wrapper
    iconWrapper.appendChild(icon);
    flexContainer.appendChild(iconWrapper);

    // Create description
    const description = document.createElement('p');
    description.classList.add('buff-description', 'body');
    description.textContent = buffs[key].description;

    const buffContainerTop = document.createElement('div');
    buffContainerTop.classList.add('flex-col');

    // Append flex container and description to buff container
    buffContainerTop.appendChild(flexContainer);
    buffContainerTop.appendChild(description);
    buffContainer.appendChild(buffContainerTop);

    // Append buff container to modal content
    buffOptionsContainer.appendChild(buffContainer);
  });

  confetti.init();
}

const buffs = {
  Stopwatch: {
    description: 'Speed up game speed.',
    weight: 1,
    icon: stopwatch,
    effect: stopWatchEffect,
  },
  'Magic Coffee': {
    description: 'Gain 1 random item.',
    weight: 1,
    icon: coffee,
    effect: coffeeEffect,
  },
  Backpack: {
    description: 'Open your backpack. Gain 15 random coins.',
    weight: 1,
    icon: backpack,
    effect: sackOfCoinsEffect,
  },
  Sundae: {
    description: 'Enjoy some ice cream. Gain 1 life.',
    weight: 1,
    icon: iceCream,
    effect: filetMignonEffect,
  },
};

const starterBuffs = {
  Cowbell: {
    description:
      'Items with duration last 50% longer, items that are instant have a 50% chance to be twice as strong.',
    weight: 1,
    icon: cowbell,
    effect: cowbellEffect,
  },
  'New Sneakers': {
    description: 'Gain the ability to jump twice',
    weight: 1,
    icon: sneakers,
    effect: sneakersEffect,
  },
  'Text book': {
    description: 'Every level up increases value of coins by 1.',
    weight: 1,
    icon: book,
    effect: booksSmartEffect,
  },
  'Lucky Mittens': {
    description:
      'Your pick up range & item drop frequency is increased by 15%.',
    weight: 1,
    icon: mittens,
    effect: mittensEffect,
  },
};
