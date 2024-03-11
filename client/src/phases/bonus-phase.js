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
  getCurrentPhase,
} = StateSingleton;

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

const batchDelay = 1000; // Delay between each column creation

let totalPhaseTime = Math.floor(1 + getMostRecentPhase() / 2) * batchDelay;
let nextBatchTime = 100;
let totalBatchTimeThusFar = 0;

export function resetBonusPhase() {
  nextBatchTime = 100;
  totalBatchTimeThusFar = 0;
  totalPhaseTime = Math.floor(1 + getMostRecentPhase() / 2) * batchDelay;
}

// Define a function to execute loops for a given phase
function executePhase(phase, delta, speedScale) {
  const phaseDetails = coinBatcher[phase];
  if (!phaseDetails) return; // Return if the phase details are not found
  console.log(totalPhaseTime, totalBatchTimeThusFar, nextBatchTime);
  if (nextBatchTime <= 0 && totalPhaseTime > totalBatchTimeThusFar) {
    // Generate a random index to select a loop function
    const randomIndex = Math.floor(Math.random() * phaseDetails.loops.length);
    const selectedLoop = phaseDetails.loops[randomIndex];
    selectedLoop.function(Math.floor(Math.random() * 3) + 4, getRandomCoin());

    nextBatchTime = batchDelay / speedScale;
    totalBatchTimeThusFar += batchDelay;
  }

  if (totalBatchTimeThusFar >= totalPhaseTime) {
    // Increase the current phase by 1
    setCurrentPhase(getMostRecentPhase() + 1);
    setIsBonusRunning(false);
    resetBonusPhase();
  }

  nextBatchTime -= delta;
}

export function setRandomBonusKey(generatedBonusPhases) {
  const keys = Object.keys(generatedBonusPhases);
  const randomIndex = Math.floor(Math.random() * keys.length);
  setCurrentBonusPhase(keys[randomIndex]);
}

export function updateBonusPhase(delta, speedScale) {
  updateState(generatedBonusPhases[getCurrentBonusPhase()]);
  if (getIsBonusRunning()) {
    executePhase(getCurrentBonusPhase(), delta, speedScale); // Execute loops for the current phase
  }
  // setCurrentPhase(getCurrentPhase() + 1);
  console.log(`Bonus-Phase ${getCurrentBonusPhase()} running`);
}
