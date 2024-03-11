import {
  createColumnOfCoins,
  createArrowOfCoins,
  createDiagonalOfCoins,
} from '../elements/coin-group';

export const generatedBonusPhases = {
  1: {
    isCoinsRunning: false,
    isPlatformRunning: false,
    isCactusRunning: true,
    isBirdRunning: false,
    isGroundEnemyRunning: false,
    isCrateRunning: false,
  },
  2: {
    isCoinsRunning: false,
    isPlatformRunning: false,
    isCactusRunning: false,
    isBirdRunning: true,
    isGroundEnemyRunning: false,
    isCrateRunning: false,
  },
  3: {
    isCoinsRunning: false,
    isPlatformRunning: false,
    isCactusRunning: false,
    isBirdRunning: false,
    isGroundEnemyRunning: true,
    isCrateRunning: false,
  },
  4: {
    isCoinsRunning: false,
    isPlatformRunning: false,
    isCactusRunning: true,
    isBirdRunning: false,
    isGroundEnemyRunning: false,
    isCrateRunning: true,
  },
};

export const coinBatcher = {
  1: {
    loops: [
      { function: createArrowOfCoins },
      { function: createDiagonalOfCoins },

      // { function: createColumnOfCoins },
      // { function: createArrowOfCoins },
    ],
  },
  2: {
    loops: [
      { function: createArrowOfCoins },

      // { function: createDiagonalOfCoins },
      // { function: createColumnOfCoins },
    ],
  },
  3: {
    loops: [
      // { function: createArrowOfCoins },

      { function: createDiagonalOfCoins },

      // { function: createColumnOfCoins },
      // { function: createDiagonalOfCoins },
    ],
  },
  4: {
    loops: [
      { function: createColumnOfCoins },
      // { function: createDiagonalOfCoins },

      // { function: createArrowOfCoins },
      // { function: createDiagonalOfCoins },
    ],
  },
};

export let bonusCollectableOptions = [
  { type: 'gold-coin', weight: 20, points: 31 },
  { type: 'silver-coin', weight: 60, points: 16 },
  { type: 'green-gem', weight: 1, points: 250 },
  { type: 'red-gem', weight: 0.75, points: 500 },
  { type: 'blue-gem', weight: 0.5, points: 1000 },
];
