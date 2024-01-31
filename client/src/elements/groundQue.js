import { createCoins } from './coin';
import { generateRandomCacti } from './cactus';

import StateSingleton from '../game-state';
const { setNextGroundSpawnType, getGroundSpawnReady, setGroundSpawnReady } =
  StateSingleton;

const spawnFunctions = {
  cactus: generateRandomCacti,
  coin: createCoins,
};

const spawnQueue = []; // Queue to store items waiting to be spawned
let spawnDelay;
let lastTypeSpawned;

export function addToSpawnQueue(spawnType) {
  // Add the spawnType to the queue
  spawnQueue.push(spawnType);
  // If no item is currently being spawned, start spawning
}

export function spawnNextItem(delta, speedScale) {
  // Check if there are items in the spawn queue
  if (spawnQueue.length > 0) {
    setGroundSpawnReady(false);
    // Get the next item from the queue
    const nextSpawnType = spawnQueue.shift();

    setNextGroundSpawnType(nextSpawnType);
    // Set the flag to indicate that an item is currently being spawned

    // Call the appropriate function based on the spawnType
    if (spawnFunctions[nextSpawnType]) {
      console.log(lastTypeSpawned, nextSpawnType);

      // Adjust the spawn delay based on the types of items in the queue
      if (
        (nextSpawnType === 'cactus' && lastTypeSpawned === 'coin') ||
        (nextSpawnType === 'coin' && lastTypeSpawned === 'cactus') ||
        (nextSpawnType === 'cactus' && lastTypeSpawned === 'cactus')
      ) {
        // If a cactus is followed by a coin or cactus followed by cactus, add a delay
        spawnDelay = 5000 / (delta * speedScale);
      } else {
        // Otherwise, use the default delay
        spawnDelay = 0;
      }

      setTimeout(() => {
        lastTypeSpawned = nextSpawnType;
        setGroundSpawnReady(true);
        spawnFunctions[nextSpawnType]();
      }, spawnDelay);
      // After the delay and spawning, call spawnNextItem to spawn the next item in the queue
    } else {
      // Handle unknown spawn types or add additional types
    }
  } else {
    return;
    // No items in the queue, reset the flag
  }
}

// Example usage:
// addToSpawnQueue('cactus');
// addToSpawnQueue('coin');

export function updateGroundQue(delta, speedScale) {
  console.log(spawnQueue);
  if (getGroundSpawnReady()) {
    spawnNextItem(delta, speedScale);
  }
}
