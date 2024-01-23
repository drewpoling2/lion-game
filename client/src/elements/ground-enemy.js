import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from '../utility/updateCustomProperty';
import { getDinoRect } from './player-controller';
import { isCollision, updateMultiplierInterface } from '../game-manager';
import StateSingleton from '../game-state';
import {
  currentMultiplierElem,
  interfaceComboContainer,
  currentComboScoreContainer,
} from '../elements-refs';
import { toggleElemOn } from '../utility/toggle-element';
import { updateScoreWithPoints } from '../game-manager';
import { getRandomWeighted, normalizeWeights } from './platform';
const {
  setMultiplierRatio,
  getMultiplierRatio,
  getPlayerImmunity,
  getHasStar,
  getObstaclePoints,
  getIsGroundEnemyRunning,
  getGroundSpeed,
  getGroundEnemySpeedFactor,
} = StateSingleton;
const enemyPositions = [];

const SPEED = getGroundSpeed() + getGroundEnemySpeedFactor();
const GROUND_ENEMY_INTERVAL_MIN = 500;
const GROUND_ENEMY_INTERVAL_MAX = 1700;
const worldElem = document.querySelector('[data-world]');

let nextGroundEnemyTime;
export function setupGroundEnemy() {
  nextGroundEnemyTime = GROUND_ENEMY_INTERVAL_MIN;
  document.querySelectorAll('[data-ground-enemy]').forEach((groundEnemy) => {
    groundEnemy.remove();
  });
}

function isPositionOccupied(position) {
  return enemyPositions.includes(position);
}

let groupIdCounter = 0; // Counter to generate unique groupIds

function generateRandomEnemy() {
  const minEnemy = 1;
  const maxEnemy = 1; // Adjust the range as needed
  let groupId; // Declare groupId outside the loop

  const numberOfEnemy = randomNumberBetween(minEnemy, maxEnemy);

  if (numberOfEnemy >= minEnemy) {
    groupId = groupIdCounter++;
    for (let i = 0; i < numberOfEnemy; i++) {
      let newPosition;
      do {
        newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
      } while (isPositionOccupied(newPosition));

      enemyPositions.push({
        position: newPosition,
        groupId: groupId,
      });
      createGroundEnemy(newPosition, groupId);
    }
  } else {
    let newPosition;
    do {
      newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
    } while (isPositionOccupied(newPosition));

    enemyPositions.push({
      position: newPosition,
    });
    createGroundEnemy(newPosition);
  }

  // Clear cacti positions for the next round (optional)
  enemyPositions.length = 0;
}

const distanceThreshold = 200; // Adjust this threshold as needed
let groundEnemyGroups = new Map(); // Declare cactusGroups outside the updateCactus function

export function updateGroundEnemy(delta, speedScale) {
  document.querySelectorAll('[data-ground-enemy]').forEach((groundEnemy) => {
    // Get positions of the dinosaur and ground-enemy
    const dinoRect = getDinoRect();
    const groundEnemyRect = groundEnemy.getBoundingClientRect();

    // Calculate distance
    const distance = Math.sqrt(
      Math.pow(dinoRect.x - groundEnemyRect.x, 2) +
        Math.pow(dinoRect.y - groundEnemyRect.y, 2)
    );
    const collision = isCollision(dinoRect, groundEnemyRect);
    // Check if the groundEnemy belongs to a group
    const groupId = groundEnemy.dataset.groupId;
    const isGrouped = groupId !== undefined;

    // Initialize groupFlags to an empty object
    let groupFlags = {};

    // Check if the dinosaur is within the threshold near the bird
    const isDinoNearGroundEnemy = distance < distanceThreshold;
    // Check if there was a collision in the previous frame
    const hadCollision = groundEnemy.dataset.hadCollision === 'true';

    // Check if the groundEnemy has moved past the dinosaur
    const hasPassedDino = groundEnemyRect.right < dinoRect.left;

    if (isGrouped) {
      // Check if this groundEnemy belongs to a group
      if (!groundEnemyGroups.has(groupId)) {
        // If the group does not exist, create it
        groundEnemyGroups.set(groupId, {
          isDinoNear: false,
          hadCollision: false,
          comboIncremented: false,
        });
      }

      // Update the group's flags based on individual groundEnemies
      groupFlags = groundEnemyGroups.get(groupId);

      // Update the flags for this groundEnemy in the group
      groupFlags.isDinoNear =
        groupFlags.isDinoNear || groundEnemy.dataset.isDinoNear === 'true';
      groupFlags.hadCollision = groupFlags.hadCollision || hadCollision;

      // Check if the groundEnemy has moved past the dinosaur within the group
      groupFlags.hasPassedDino = groupFlags.hasPassedDino || hasPassedDino;
    }

    if (isDinoNearGroundEnemy) {
      // If the dinosaur is within the threshold, set the flag to true
      groundEnemy.dataset.isDinoNear = 'true';
    } else {
      // If the dinosaur is not within the threshold, set the flag to false
      groundEnemy.dataset.isDinoNear = 'false';
    }

    if (
      isGrouped &&
      groupFlags.isDinoNear &&
      !groupFlags.hadCollision &&
      groupFlags.hasPassedDino &&
      !groupFlags.comboIncremented
    ) {
      // Increment combo only if there was no collision in the previous frame
      // and the groundEnemy group has moved past the dinosaur without a new collision
      let currentMultiplierRatio = getMultiplierRatio();
      setMultiplierRatio((currentMultiplierRatio += 1));
      updateMultiplierInterface();
      // const newElement = document.createElement('div');
      // newElement.classList.add('one-up');
      // newElement.style.position = 'absolute';
      // newElement.textContent = '+1x';
      // groundEnemy.appendChild(newElement);
      // setTimeout(() => {
      //   newElement.remove();
      // }, 600);
      // Set the comboIncremented flag for the entire group
      groupFlags.comboIncremented = true;
    }

    if (
      !groundEnemy.dataset.hadCollision &&
      collision === true &&
      !groundEnemy.dataset.scoreUpdated
    ) {
      if (getPlayerImmunity() && getHasStar()) {
        const text = document.createElement('div');
        text.classList.add('enemy-plus-points');
        text.style.position = 'absolute';
        text.style.left = groundEnemy.offsetLeft + 'px';
        text.style.top = groundEnemy.offsetTop - 70 + 'px';
        groundEnemy.parentNode.insertBefore(text, groundEnemy);
        const points = getMultiplierRatio() * getObstaclePoints();
        text.textContent = `+${points}`;
        updateScoreWithPoints(points);
        groundEnemy.classList.add('penguin-die');
        groundEnemy.dataset.scoreUpdated = true;
        text.addEventListener('animationend', () => {
          text.remove();
        });
        // After the transition, remove the groundEnemy
        groundEnemy.addEventListener('animationend', () => {
          groundEnemy.remove();
        });
      } else {
        groundEnemy.dataset.hadCollision = true;
      }
    }

    const extraSpeedFactor = parseFloat(
      groundEnemy.dataset.groundEnemyExtraSpeedFactor || 0
    );

    incrementCustomProperty(
      groundEnemy,
      '--left',
      delta * speedScale * -1 * (SPEED + extraSpeedFactor)
    );
    if (getCustomProperty(groundEnemy, '--left') <= -100) {
      groundEnemy.remove();
    }
  });

  if (nextGroundEnemyTime <= 0 && getIsGroundEnemyRunning()) {
    generateRandomEnemy();
    nextGroundEnemyTime =
      randomNumberBetween(
        GROUND_ENEMY_INTERVAL_MIN,
        GROUND_ENEMY_INTERVAL_MAX
      ) / speedScale;
  }
  nextGroundEnemyTime -= delta;
}

export function getGroundEnemyRects() {
  return [...document.querySelectorAll('[data-ground-enemy]')].map(
    (groundEnemy) => {
      return groundEnemy.getBoundingClientRect();
    }
  );
}

// Array of possible groundEnemy images with associated weights
const groundEnemyObj = {
  rollingPenguin: { weight: 1, class: 'idle-penguin', speedFactor: -0.05 },
  spinningPenguin: { weight: 1, class: 'spinning-penguin', speedFactor: 0 },
  walkingPenguin: { weight: 1, class: 'walking-penguin', speedFactor: -0.035 },
  // Add more image sources with corresponding weights
};

const normalizedGroundEnemyWeights = normalizeWeights(groundEnemyObj);

function createGroundEnemy(newPosition, groupId) {
  const randomBuffKey = getRandomWeighted(normalizedGroundEnemyWeights);
  console.log(randomBuffKey);
  const groundEnemy = document.createElement('div');
  groundEnemy.dataset.groundEnemy = true;
  groundEnemy.dataset.groundEnemyType = randomBuffKey;
  groundEnemy.classList.add(
    'ground-enemy',
    groundEnemyObj[randomBuffKey].class,
    'game-element'
  );
  if (groundEnemyObj[randomBuffKey].speedFactor) {
    groundEnemy.dataset.groundEnemyExtraSpeedFactor =
      groundEnemyObj[randomBuffKey].speedFactor;
  } else groundEnemy.dataset.groundEnemyExtraSpeedFactor = 0;

  setCustomProperty(groundEnemy, '--left', newPosition);
  setCustomProperty(groundEnemy, 'height', '8%');

  // Set the groupId as a data attribute on the groundEnemy element
  groundEnemy.dataset.groupId = groupId;

  worldElem.append(groundEnemy);
  if (randomBuffKey == 'rollingPenguin') {
    setTimeout(() => {
      groundEnemy.classList.remove('idle-penguin');
      groundEnemy.classList.add('dive-penguin');
    }, 1000);
    groundEnemy.addEventListener('animationend', () => {
      // Animation ends, add 'rolling-penguin' class
      groundEnemy.classList.remove('dive-penguin');
      groundEnemy.classList.add('rolling-penguin');
      groundEnemy.dataset.groundEnemyExtraSpeedFactor = 0;
    });
  }
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
