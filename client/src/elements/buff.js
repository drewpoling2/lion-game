import filet from '../public/imgs/buffs/filet.png';
import luckyMittens from '../public/imgs/buffs/lucky-mittens.png';
import trustyPocketWatch from '../public/imgs/buffs/trusty-pocket-watch.png';
import watermelon from '../public/imgs/buffs/watermelon.png';
import suspiciouslyPlainChest from '../public/imgs/buffs/suspiciously-plain-chest.png';
import emotionalSupportWaterBottle from '../public/imgs/buffs/emotional-support-water-bottle.png';
import pouch from '../public/imgs/buffs/pouch.png';
import momsCookies from '../public/imgs/buffs/moms-cookies.png';
import feather from '../public/imgs/buffs/feather.png';
import cape from '../public/imgs/buffs/cape.png';
import amulet from '../public/imgs/buffs/amulet.png';
import book from '../public/imgs/buffs/book.png';
import glasses from '../public/imgs/buffs/glasses.png';
import coins from '../public/imgs/buffs/coins.png';
import star from '../public/imgs/icons/Star.png';
import {
  filetMignonEffect,
  trustyPocketWatchEffect,
  momsCookiesEffect,
  silverFeatherEffect,
  amuletEffect,
  booksSmartEffect,
  sackOfCoinsEffect,
  slowFallEffect,
  togglePause,
  glassesEffect,
  coinsEffect,
} from '../game-manager';
import { confetti } from './particle-systems';
const buffOptionsContainer = document.querySelector('.buff-options');
const modal = document.getElementById('level-up-modal');

function normalizeWeights(buffs) {
  const keys = Object.keys(buffs);
  const weights = keys.map((key) => buffs[key].weight);
  const sumOfWeights = weights.reduce((sum, weight) => sum + weight, 0);

  const normalizedWeights = {};
  keys.forEach((key, index) => {
    normalizedWeights[key] = weights[index] / sumOfWeights;
  });

  return normalizedWeights;
}

function getRandomBuffWeighted(buffs) {
  const keys = Object.keys(buffs);
  const probabilities = keys.map((key) => buffs[key]);
  const randomValue = Math.random();
  let cumulativeProbability = 0;

  for (let i = 0; i < keys.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomValue <= cumulativeProbability) {
      return keys[i];
    }
  }

  // Default case (fallback)
  return keys[keys.length - 1];
}

function applyBuff(buffName) {
  const powerUpDivContainer = document.querySelector(
    '.power-up-grid-container'
  );
  powerUpDivContainer.classList.remove('hide-element');
  // Get all power-up divs
  const powerUpDivs = document.querySelectorAll('.power-up');

  // Check if the user already has the selected power-up
  const existingPowerUp = Array.from(powerUpDivs).find(
    (powerUpDiv) =>
      powerUpDiv.querySelector('img') &&
      powerUpDiv.querySelector('img').alt.includes(buffName)
  );

  if (existingPowerUp) {
    // User already has the power-up, increment the rank
    const existingRank = existingPowerUp.querySelector('.power-up-rank');
    const existingRankValue = parseInt(existingRank.textContent);
    existingRank.textContent = `${existingRankValue + 1}`;

    // Implement logic to apply the selected buff (if needed)
    console.log(`Applying ${buffName}`);
    buffs[buffName].effect();
  } else {
    // <!-- <div class="power-up small-border-inset"></div> -->

    const newPowerUpDiv = document.createElement('div');
    newPowerUpDiv;
    newPowerUpDiv.classList.add('power-up', 'small-border-inset');
    powerUpDivContainer.appendChild(newPowerUpDiv);
    // Implement logic to apply the selected buff
    console.log(`Applying ${buffName}`);
    buffs[buffName].effect();

    // Add the icon to the power-up div
    const icon = document.createElement('img');
    icon.src = buffs[buffName].icon;
    icon.alt = `${buffName}`;
    icon.classList.add('w-full');
    newPowerUpDiv.appendChild(icon);

    // Add the rank to the power-up div
    const rank = document.createElement('div');
    rank.classList.add('power-up-rank', 'sans');
    rank.textContent = '1';
    newPowerUpDiv.appendChild(rank);
  }
  confetti.destroy();
  // Close the modal
  modal.style.display = 'none';
  modal.classList.remove('show-modal');
  buffOptionsContainer.innerHTML = '';
  togglePause();
}

function applySackOfCoins() {
  alwaysBuffs['Coin purse'].effect();
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
  const existingPowerUp = Array.from(powerUpDivs).find(
    (powerUpDiv) =>
      powerUpDiv.querySelector('img') &&
      powerUpDiv.querySelector('img').alt.includes(buffName)
  );

  if (existingPowerUp) {
    // User already has the power-up, increment the rank
    const existingRank = existingPowerUp.querySelector('.power-up-rank');
    const existingRankValue = parseInt(existingRank.textContent);
    existingRank.textContent = `${existingRankValue + 1}`;

    // Implement logic to apply the selected buff (if needed)
    console.log(`Applying ${buffName}`);
    starterBuffs[buffName].effect();
  } else {
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

      // Add the rank to the power-up div
      const rank = document.createElement('div');
      rank.classList.add('power-up-rank', 'sans');
      rank.textContent = '1';
      lastEmptyPowerUp.appendChild(rank);
    }
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

  // Keep track of selected buffs
  const selectedBuffs = new Set();

  // Generate 3 unique buffs
  while (selectedBuffs.size < 4) {
    const randomBuffKey = getRandomBuffWeighted(normalizedStarterBuffWeights);

    // Check if the buff is not already selected
    if (!selectedBuffs.has(randomBuffKey)) {
      selectedBuffs.add(randomBuffKey);

      // Create buff container (use a div as a clickable area)
      const buffContainer = document.createElement('div');
      buffContainer.classList.add('buff-container', 'starter-buff');
      buffContainer.addEventListener('click', () =>
        applyStarterBuff(randomBuffKey)
      );

      // Create flex container for icon and title
      const flexContainer = document.createElement('div');
      flexContainer.classList.add('flex-col', 'items-center');

      // Create div to wrap the icon
      const iconWrapper = document.createElement('div');
      iconWrapper.classList.add('buff-icon-wrapper');

      // Create icon (adjust the path accordingly)
      const icon = document.createElement('img');
      icon.classList.add('buff-icon');
      icon.src = starterBuffs[randomBuffKey].icon;
      icon.alt = `${randomBuffKey} Icon`;

      // Create title
      const title = document.createElement('div');
      title.classList.add('buff-title', 'uppercase');
      title.textContent = randomBuffKey;

      // Determine rarity and set title color
      const rarity = assignRarity(starterBuffs[randomBuffKey]);
      createStarIcons(rarity, flexContainer);
      // Append icon wrapper and title to flex container
      flexContainer.appendChild(title);
      // Append icon to icon wrapper
      iconWrapper.appendChild(icon);
      flexContainer.appendChild(iconWrapper);

      // Create description
      const description = document.createElement('p');
      description.classList.add('buff-description', 'body');
      description.textContent = starterBuffs[randomBuffKey].description;

      // Get all power-up divs
      const powerUpDivs = document.querySelectorAll('.starter-power-up');

      // Check if the user already has the selected power-up
      const existingPowerUp = Array.from(powerUpDivs).find(
        (powerUpDiv) =>
          powerUpDiv.querySelector('img') &&
          powerUpDiv.querySelector('img').alt.includes(randomBuffKey)
      );

      const abilityRank = document.createElement('div');
      abilityRank.classList.add('buff-modal-rank');

      if (existingPowerUp) {
        // User already has the power-up, increment the rank
        const existingRank = existingPowerUp.querySelector('.power-up-rank');
        const existingRankValue = parseInt(existingRank.textContent);
        abilityRank.textContent = `Rank ${existingRankValue + 1}`;
      } else {
        abilityRank.textContent = `Rank 1`;
      }

      const buffContainerTop = document.createElement('div');
      buffContainerTop.classList.add('flex-col');

      // Append flex container and description to buff container
      buffContainerTop.appendChild(flexContainer);
      buffContainerTop.appendChild(description);
      buffContainer.appendChild(buffContainerTop);
      buffContainer.appendChild(abilityRank);

      // Append buff container to modal content
      buffOptionsContainer.appendChild(buffContainer);
    }
  }
  confetti.init();
}

export function createBuffs() {
  togglePause();
  // Show the modal
  const modal = document.getElementById('level-up-modal');
  modal.style.display = 'flex';
  modal.classList.add('show-modal');
  // Keep track of selected buffs
  const selectedBuffs = new Set();

  // Generate 3 unique buffs
  while (selectedBuffs.size < 3) {
    const randomBuffKey = getRandomBuffWeighted(normalizedBuffWeights);

    // Check if the buff is not already selected
    if (!selectedBuffs.has(randomBuffKey)) {
      selectedBuffs.add(randomBuffKey);

      // Create buff container (use a div as a clickable area)
      const buffContainer = document.createElement('div');
      buffContainer.classList.add('buff-container');
      buffContainer.addEventListener('click', () => applyBuff(randomBuffKey));

      // Create flex container for icon and title
      const flexContainer = document.createElement('div');
      flexContainer.classList.add('flex-col', 'items-center');

      // Create div to wrap the icon
      const iconWrapper = document.createElement('div');
      iconWrapper.classList.add('buff-icon-wrapper');

      // Create icon (adjust the path accordingly)
      const icon = document.createElement('img');
      icon.classList.add('buff-icon');
      icon.src = buffs[randomBuffKey].icon;
      icon.alt = `${randomBuffKey} Icon`;

      // Create title
      const title = document.createElement('div');
      title.classList.add('buff-title', 'uppercase');
      title.textContent = randomBuffKey;

      // Determine rarity and set title color
      const rarity = assignRarity(buffs[randomBuffKey]);
      createStarIcons(rarity, flexContainer);
      // Append icon wrapper and title to flex container
      flexContainer.appendChild(title);
      // Append icon to icon wrapper
      iconWrapper.appendChild(icon);
      flexContainer.appendChild(iconWrapper);

      // Create description
      const description = document.createElement('p');
      description.classList.add('buff-description', 'body');
      description.textContent = buffs[randomBuffKey].description;

      // Get all power-up divs
      const powerUpDivs = document.querySelectorAll('.power-up');

      // Check if the user already has the selected power-up
      const existingPowerUp = Array.from(powerUpDivs).find(
        (powerUpDiv) =>
          powerUpDiv.querySelector('img') &&
          powerUpDiv.querySelector('img').alt.includes(randomBuffKey)
      );

      const abilityRank = document.createElement('div');
      abilityRank.classList.add('buff-modal-rank');

      if (existingPowerUp) {
        // User already has the power-up, increment the rank
        const existingRank = existingPowerUp.querySelector('.power-up-rank');
        const existingRankValue = parseInt(existingRank.textContent);
        abilityRank.textContent = `Rank ${existingRankValue + 1}`;
      } else {
        abilityRank.textContent = `Rank 1`;
      }

      const buffContainerTop = document.createElement('div');
      buffContainerTop.classList.add('flex-col');

      // Append flex container and description to buff container
      buffContainerTop.appendChild(flexContainer);
      buffContainerTop.appendChild(description);
      buffContainer.appendChild(buffContainerTop);
      buffContainer.appendChild(abilityRank);

      // Append buff container to modal content
      buffOptionsContainer.appendChild(buffContainer);
    }
  }
  confetti.init();

  // Add the "Coin purse" power-up as the 4th option
  const sackOfCoinsContainer = document.createElement('div');
  sackOfCoinsContainer.classList.add('buff-container');
  sackOfCoinsContainer.addEventListener('click', () => applySackOfCoins());

  const sackOfCoinsFlexContainer = document.createElement('div');
  sackOfCoinsFlexContainer.classList.add('flex-col', 'items-center');

  const sackOfCoinsIconWrapper = document.createElement('div');
  sackOfCoinsIconWrapper.classList.add('buff-icon-wrapper');

  const sackOfCoinsIcon = document.createElement('img');
  sackOfCoinsIcon.classList.add('buff-icon');
  sackOfCoinsIcon.src = alwaysBuffs['Coin purse'].icon;
  sackOfCoinsIcon.alt = 'Coin purse Icon';

  const sackOfCoinsTitle = document.createElement('div');
  sackOfCoinsTitle.classList.add('buff-title', 'uppercase');
  sackOfCoinsTitle.textContent = 'Coin purse';

  // Determine rarity and set title color
  const rarity = assignRarity(alwaysBuffs['Coin purse']);
  createStarIcons(rarity, sackOfCoinsFlexContainer);
  // Append icon to icon wrapper
  sackOfCoinsIconWrapper.appendChild(sackOfCoinsIcon);

  // Append icon wrapper and title to flex container
  sackOfCoinsFlexContainer.appendChild(sackOfCoinsTitle);
  sackOfCoinsFlexContainer.appendChild(sackOfCoinsIconWrapper);

  // Create description
  const sackOfCoinsDescription = document.createElement('p');
  sackOfCoinsDescription.classList.add('buff-description', 'body');
  sackOfCoinsDescription.textContent = alwaysBuffs['Coin purse'].description;

  const sackOfCoinsContainerTop = document.createElement('div');
  sackOfCoinsContainerTop.classList.add('flex-col');

  // Append flex container and description to buff container
  sackOfCoinsContainerTop.appendChild(sackOfCoinsFlexContainer);
  sackOfCoinsContainerTop.appendChild(sackOfCoinsDescription);
  sackOfCoinsContainer.appendChild(sackOfCoinsContainerTop);

  // Append Coin purse container to modal content
  buffOptionsContainer.appendChild(sackOfCoinsContainer);
}

function getStarsForRarity(rarity) {
  switch (rarity) {
    case 'Legendary':
      return 5; // Adjust the color as needed
    case 'Epic':
      return 4; // Adjust the color as needed
    case 'Rare':
      return 3; // Adjust the color as needed
    case 'Uncommon':
      return 2; // Adjust the color as needed
    case 'Common':
      return 1; // Adjust the color as needed
    default:
      return 1; // Default color
  }
}

function assignRarity(buff) {
  const weight = buff.weight;

  if (weight >= 0 && weight < 0.01) {
    return 'Legendary';
  } else if (weight >= 0.01 && weight < 0.2) {
    return 'Epic';
  } else if (weight >= 0.2 && weight < 0.4) {
    return 'Rare';
  } else if (weight >= 0.4 && weight < 0.6) {
    return 'Uncommon';
  } else if (weight >= 0.6 && weight <= 1.0) {
    return 'Common';
  } else {
    // Handle weights outside the defined ranges
    return 'Unknown Rarity';
  }
}

function createStarIcons(rarity, parent) {
  const starCount = getStarsForRarity(rarity);
  const starIconContainer = document.createElement('div');
  starIconContainer.classList.add('flex-row', 'items-center');
  for (let i = 0; i < starCount; i++) {
    const starIcon = document.createElement('img');
    starIcon.classList.add('star-icon');
    starIcon.src = star;
    starIconContainer.appendChild(starIcon);
  }
  if (starCount === 0) {
    const starIcon = document.createElement('img');
    starIcon.classList.add('star-icon', 'hide-elem');
    starIcon.src = star;
    starIconContainer.appendChild(starIcon);
  }
  parent.appendChild(starIconContainer);
}

const alwaysBuffs = {
  'Coin purse': {
    description: 'Gain 25 random coins toward your score.',
    weight: 1,
    icon: pouch,
    effect: sackOfCoinsEffect,
  },
};

const buffs = {
  Filet: {
    description: 'Enjoy a meal. Gain 1 life',
    weight: 0.2,
    icon: filet,
    effect: filetMignonEffect,
  },
  'Silver Feather': {
    description: 'Silver coins are now worth 20% more (base value)',
    weight: 0.4,
    icon: feather,
    effect: silverFeatherEffect,
  },
  Amulet: {
    description: 'Gold coins are now worth 20% more (base value)',
    weight: 0.6,
    icon: amulet,
    effect: amuletEffect,
  },
  'Moms Cookies': {
    description: 'Mom sends her love. Gain 1 level.',
    weight: 0.6,
    icon: momsCookies,
    effect: momsCookiesEffect,
  },
  'Slow Fall': {
    description: 'Slow falling speed by 5%',
    weight: 0.4,
    icon: cape,
    effect: slowFallEffect,
  },
  'Suspiciously Plain Chest': {
    description: 'buff 4 description',
    weight: 0.4,
    icon: suspiciouslyPlainChest,
    effect: filetMignonEffect,
  },
  'Trusty Pocket Watch': {
    description:
      'Slow time briefly by 60%, rapidly increasing to a permanent 5%',
    weight: 0.8,
    icon: trustyPocketWatch,
    effect: trustyPocketWatchEffect,
  },
  'Emotional Support Water Bottle': {
    description: 'buff 1 description',
    weight: 0.2,
    icon: emotionalSupportWaterBottle,
    effect: filetMignonEffect,
  },
  Watermelon: {
    description:
      'Every time you pick up a silver coin, the next Red gem pick up value increases by 2x. Stacks up to 50 times.',
    weight: 0.5,
    icon: watermelon,
    effect: filetMignonEffect,
  },
  'Lucky Mittens': {
    description: 'buff 3 description',
    weight: 0.3,
    icon: luckyMittens,
    effect: filetMignonEffect,
  },
};

const starterBuffs = {
  'Text book': {
    description: 'Every time you get a level, your passives scale by %.',
    weight: 0.1,
    icon: book,
    effect: booksSmartEffect,
  },
  'Starter 2': {
    description:
      'You spawn 1 gold coin above you when you jump, but all gold coins you pick up are worth 50% less',
    weight: 0.6,
    icon: coins,
    effect: coinsEffect,
  },
  'Starter 3': {
    description: 'Every time you get a level, your passives scale by %.',
    weight: 0.4,
    icon: book,
    effect: booksSmartEffect,
  },
  Glasses: {
    description:
      'Gold coins increase the next red gem by .5x, stacks up to 28. Getting a red gem resets stacks',
    weight: 0.8,
    icon: glasses,
    effect: glassesEffect,
  },
  Glasses2: {
    description:
      'Gold coins increase the next red gem by .5x, stacks up to 28. Getting a red gem resets stacks',
    weight: 0.1,
    icon: glasses,
    effect: glassesEffect,
  },
  Glasses3: {
    description:
      'Gold coins increase the next red gem by .5x, stacks up to 28. Getting a red gem resets stacks',
    weight: 0.1,
    icon: glasses,
    effect: glassesEffect,
  },
};

// Example usage:
const normalizedStarterBuffWeights = normalizeWeights(starterBuffs);
const normalizedBuffWeights = normalizeWeights(buffs);
