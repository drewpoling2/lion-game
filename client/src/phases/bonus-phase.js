import StateSingleton from '../game-state';
import { bonusCollectableOptions } from './bonus-phase-properties';
import { generatedBonusPhases, coinBatcher } from './bonus-phase-properties';
const {
  updateState,
  getCurrentBonusPhase,
  setCurrentBonusPhase,
  setCurrentPhase,
  getMostRecentPhase,
  getIsBonusRunning,
  setIsBonusRunning,
} = StateSingleton;

let wholeBatchSpawned = false;

function getRandomCoin() {
  // Calculate the total weight
  const totalWeight = bonusCollectableOptions.reduce(
    (sum, item) => sum + item.weight,
    0
  );

  // Generate a random number between 0 and totalWeight
  const randomWeight = Math.random() * totalWeight;

  // Select a random collectable based on the weighted probabilities
  let cumulativeWeight = 0;
  let selectedCollectable;
  for (const item of bonusCollectableOptions) {
    cumulativeWeight += item.weight;
    if (randomWeight <= cumulativeWeight) {
      selectedCollectable = item;
      break;
    }
  }
  return selectedCollectable;
}

// Define a function to execute loops for a given phase
function executePhase(phase) {
  if (!wholeBatchSpawned) {
    const batchDelay = 2750; // Delay between each column creation
    const phaseDetails = coinBatcher[phase];
    const batchLoops = Math.floor(getMostRecentPhase() / 2);
    if (!phaseDetails) return; // Return if the phase details are not found
    for (let i = 0; i < batchLoops + 2; i++) {
      setTimeout(() => {
        // Generate a random index to select a loop function
        const randomIndex = Math.floor(
          Math.random() * phaseDetails.loops.length
        );
        const selectedLoop = phaseDetails.loops[randomIndex];
        selectedLoop.function(
          Math.floor(Math.random() * 3) + 4,
          getRandomCoin()
        );
      }, i * batchDelay);
    }
    wholeBatchSpawned = true;
  }
  console.log(bonusCollectableOptions);
  // Increase the current phase by 1
  setCurrentPhase(getMostRecentPhase() + 1);
  setIsBonusRunning(false);
}

export function setRandomBonusKey(generatedBonusPhases) {
  const keys = Object.keys(generatedBonusPhases);
  const randomIndex = Math.floor(Math.random() * keys.length);
  setCurrentBonusPhase(keys[randomIndex]);
}

export function updateBonusPhase() {
  updateState(generatedBonusPhases[getCurrentBonusPhase()]);
  if (getIsBonusRunning()) {
    executePhase(getCurrentBonusPhase()); // Execute loops for the current phase
  }
  // setCurrentPhase(getCurrentPhase() + 1);
  console.log(`Bonus-Phase ${getCurrentBonusPhase()} running`);
}
