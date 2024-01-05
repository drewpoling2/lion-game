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
const modalContent = document.querySelector('.modal-content');
const buffOptionsContainer = document.querySelector('.buff-options');
const modal = document.getElementById('level-up-modal');

function getRandomBuffWeighted(buffs) {
  const keys = Object.keys(buffs);
  const probabilities = keys.map((key) => buffs[key].weight);
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
    // Find the first available power-up div without a power-up
    const lastEmptyPowerUp = Array.from(powerUpDivs).find(
      (powerUpDiv) => !powerUpDiv.querySelector('img')
    );

    if (lastEmptyPowerUp) {
      // Implement logic to apply the selected buff
      console.log(`Applying ${buffName}`);
      buffs[buffName].effect();

      // Add the icon to the power-up div
      const icon = document.createElement('img');
      icon.src = buffs[buffName].icon;
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
  // Close the modal
  modal.style.display = 'none';
  buffOptionsContainer.innerHTML = '';
  togglePause();
}

function applySackOfCoins() {
  alwaysBuffs['Sack of Coins'].effect();
  // Close the modal
  modal.style.display = 'none';
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
  // Close the modal
  modal.style.display = 'none';
  buffOptionsContainer.innerHTML = '';
  togglePause();
}

export function createStarterBuffs() {
  togglePause();
  // Show the modal
  const modal = document.getElementById('level-up-modal');
  modal.style.display = 'flex';

  // Keep track of selected buffs
  const selectedBuffs = new Set();

  // Generate 3 unique buffs
  while (selectedBuffs.size < 4) {
    const randomBuffKey = getRandomBuffWeighted(starterBuffs);

    // Check if the buff is not already selected
    if (!selectedBuffs.has(randomBuffKey)) {
      selectedBuffs.add(randomBuffKey);

      // Create buff container (use a div as a clickable area)
      const buffContainer = document.createElement('div');
      buffContainer.classList.add('buff-container');
      buffContainer.addEventListener('click', () =>
        applyStarterBuff(randomBuffKey)
      );

      // Create flex container for icon and title
      const flexContainer = document.createElement('div');
      flexContainer.classList.add('flex-row', 'items-center');

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
      title.style.color = getColorForRarity(rarity);

      // Append icon to icon wrapper
      iconWrapper.appendChild(icon);

      // Append icon wrapper and title to flex container
      flexContainer.appendChild(iconWrapper);
      flexContainer.appendChild(title);

      // Create description
      const description = document.createElement('p');
      description.classList.add('buff-description', 'body');
      description.textContent = starterBuffs[randomBuffKey].description;

      // Append flex container and description to buff container
      buffContainer.appendChild(flexContainer);
      buffContainer.appendChild(description);

      // Append buff container to modal content
      buffOptionsContainer.appendChild(buffContainer);
    }
  }
}

export function createBuffs() {
  togglePause();
  // Show the modal
  const modal = document.getElementById('level-up-modal');
  modal.style.display = 'flex';

  // Keep track of selected buffs
  const selectedBuffs = new Set();

  // Generate 3 unique buffs
  while (selectedBuffs.size < 3) {
    const randomBuffKey = getRandomBuffWeighted(buffs);

    // Check if the buff is not already selected
    if (!selectedBuffs.has(randomBuffKey)) {
      selectedBuffs.add(randomBuffKey);

      // Create buff container (use a div as a clickable area)
      const buffContainer = document.createElement('div');
      buffContainer.classList.add('buff-container');
      buffContainer.addEventListener('click', () => applyBuff(randomBuffKey));

      // Create flex container for icon and title
      const flexContainer = document.createElement('div');
      flexContainer.classList.add('flex-row', 'items-center');

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
      title.style.color = getColorForRarity(rarity);

      // Append icon to icon wrapper
      iconWrapper.appendChild(icon);

      // Append icon wrapper and title to flex container
      flexContainer.appendChild(iconWrapper);
      flexContainer.appendChild(title);

      // Create description
      const description = document.createElement('p');
      description.classList.add('buff-description', 'body');
      description.textContent = buffs[randomBuffKey].description;

      // Append flex container and description to buff container
      buffContainer.appendChild(flexContainer);
      buffContainer.appendChild(description);

      // Append buff container to modal content
      buffOptionsContainer.appendChild(buffContainer);
    }
  }

  // Add the "Sack of Coins" power-up as the 4th option
  const sackOfCoinsContainer = document.createElement('div');
  sackOfCoinsContainer.classList.add('buff-container');
  sackOfCoinsContainer.addEventListener('click', () => applySackOfCoins());

  const sackOfCoinsFlexContainer = document.createElement('div');
  sackOfCoinsFlexContainer.classList.add('flex-row', 'items-center');

  const sackOfCoinsIconWrapper = document.createElement('div');
  sackOfCoinsIconWrapper.classList.add('buff-icon-wrapper');

  const sackOfCoinsIcon = document.createElement('img');
  sackOfCoinsIcon.classList.add('buff-icon');
  sackOfCoinsIcon.src = alwaysBuffs['Sack of Coins'].icon;
  sackOfCoinsIcon.alt = 'Sack of Coins Icon';

  const sackOfCoinsTitle = document.createElement('div');
  sackOfCoinsTitle.classList.add('buff-title', 'uppercase');
  sackOfCoinsTitle.textContent = 'Sack of Coins';

  // Determine rarity and set title color
  const rarity = assignRarity(alwaysBuffs['Sack of Coins']);
  sackOfCoinsTitle.style.color = getColorForRarity(rarity);

  // Append icon to icon wrapper
  sackOfCoinsIconWrapper.appendChild(sackOfCoinsIcon);

  // Append icon wrapper and title to flex container
  sackOfCoinsFlexContainer.appendChild(sackOfCoinsIconWrapper);
  sackOfCoinsFlexContainer.appendChild(sackOfCoinsTitle);

  // Create description
  const sackOfCoinsDescription = document.createElement('p');
  sackOfCoinsDescription.classList.add('buff-description', 'body');
  sackOfCoinsDescription.textContent = alwaysBuffs['Sack of Coins'].description;

  // Append flex container and description to buff container
  sackOfCoinsContainer.appendChild(sackOfCoinsFlexContainer);
  sackOfCoinsContainer.appendChild(sackOfCoinsDescription);

  // Append sack of coins container to modal content
  buffOptionsContainer.appendChild(sackOfCoinsContainer);
}

function getColorForRarity(rarity) {
  switch (rarity) {
    case 'Legendary':
      return '#FFDB5D'; // Adjust the color as needed
    case 'Epic':
      return '#EA59E4'; // Adjust the color as needed
    case 'Rare':
      return '#3199F9'; // Adjust the color as needed
    case 'Uncommon':
      return '#61E955'; // Adjust the color as needed
    case 'Common':
      return 'white'; // Adjust the color as needed
    default:
      return 'black'; // Default color
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

const alwaysBuffs = {
  'Sack of Coins': {
    description: 'Miners fortune. Gain 25 random coins toward your score.',
    weight: 1,
    icon: pouch,
    effect: sackOfCoinsEffect,
  },
};

const buffs = {
  'Filet Mignon': {
    description: 'Enjoy a tasty meal. Gain 1 life',
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
    weight: 0.4,
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
  'Book Smart': {
    description: 'Every time you get a level, your passives scale by %.',
    weight: 0.009,
    icon: book,
    effect: booksSmartEffect,
  },
  'Starter 2': {
    description:
      'You spawn 1 gold coin above you when you jump, but your all gold coins you pick up are worth 50% less',
    weight: 0.009,
    icon: coins,
    effect: coinsEffect,
  },
  'Starter 3': {
    description: 'Every time you get a level, your passives scale by %.',
    weight: 0.009,
    icon: book,
    effect: booksSmartEffect,
  },
  Glasses: {
    description:
      'Every gold coin you pick up increases the next red gem score by 1x stacks up to 14. Getting a red gem resets this back to 1x.',
    weight: 0.009,
    icon: glasses,
    effect: glassesEffect,
  },
};
