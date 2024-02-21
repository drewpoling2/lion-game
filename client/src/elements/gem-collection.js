import redGem from '../public/imgs/red-gem/red-gem.png';
import blueGem from '../public/imgs/blue-gem/blue-gem.png';
import greenGem from '../public/imgs/green-gem/green-gem.png';

export function applyGem(gemName) {
  // Get all power-up divs
  const powerUpDivs = document.querySelectorAll('.power-up');

  // Check if the user already has the selected power-up
  const existingPowerUp = Array.from(powerUpDivs).find(
    (powerUpDiv) =>
      powerUpDiv.querySelector('img') &&
      powerUpDiv.querySelector('img').alt.includes(gemName)
  );

  if (existingPowerUp) {
    // User already has the power-up, increment the rank
    const existingRank = existingPowerUp.querySelector('.power-up-rank');
    const existingRankValue = parseInt(existingRank.textContent);
    existingRank.textContent = `${existingRankValue + 1}`;
  } else {
    // Find the first available power-up div without a power-up
    const lastEmptyPowerUp = Array.from(powerUpDivs).find(
      (powerUpDiv) => !powerUpDiv.querySelector('img')
    );

    if (lastEmptyPowerUp) {
      // Add the icon to the power-up div
      const icon = document.createElement('img');
      lastEmptyPowerUp.classList.remove('dim');
      icon.src = collectableGems[gemName].icon;
      icon.alt = `${gemName}`;
      icon.classList.add('w-full');
      lastEmptyPowerUp.appendChild(icon);

      // Add the rank to the power-up div
      const rank = document.createElement('div');
      rank.classList.add('power-up-rank', 'sans');
      rank.textContent = '1';
      lastEmptyPowerUp.appendChild(rank);
    }
  }
}

const collectableGems = {
  'red-gem': {
    icon: redGem,
  },
  'blue-gem': {
    icon: blueGem,
  },
  'green-gem': {
    icon: greenGem,
  },
};
