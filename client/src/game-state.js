// state.js
const StateSingleton = (function () {
  //default state
  let state = {
    multiplierRatio: 1,
    timerInterval: 3,
    phaseTimerInterval: 10,
    multiplierTimer: 5000,
    currentPhase: 1,
    speedScale: 0.9,
    speedScaleIncrease: 0.000017,
    jumpCountLimit: 1,

    obstaclePoints: 5,
    lastPhase: 0,
    gravityFallAdjustment: 0.021,
    selectedStarter: null,

    //elements
    isCoinsRunning: true,
    isPlatformRunning: false,
    isCactusRunning: false,
    isBirdRunning: true,
    isGroundEnemyRunning: true,
    isCrateRunning: true,

    //world
    isGroundRunning: true,
    isGroundLayer2Running: true,
    isGroundLayer3Running: true,
    groundSpeed: 0.04,
    groundEnemySpeedFactor: 0.05,
    isFlagCreated: true,
    platformSpeed: 0.035,

    //items
    platformCoinIntervalMax: 2000,
    platformCoinIntervalMin: 1000,
    groundCoinIntervalMin: 50,
    groundCoinIntervalMax: 1000,
    cactusIntervalMin: 900,
    cactusIntervalMax: 1400,
    isMultiplierRunning: false,
    isMagnetRunning: false,
    isStarRunning: false,
    starDuration: 10000,
    playerImmunity: false,
    hasStar: false,
    hasLeaf: false,
    leafDuration: 10000,
    isMagnetItem: false,
    isStarColliding: true,
    isMagnetColliding: true,
    isLeafColliding: true,
    isHeartColliding: true,
    groundSpawnReady: true,
    nextGroundSpawnType: '',
    coinPickupRadius: 70,
  };

  return {
    getCoinPickupRadius: function () {
      return state.coinPickupRadius;
    },
    setCoinPickupRadius: function (newCoinPickupRadius) {
      state.coinPickupRadius = newCoinPickupRadius;
    },
    getGroundSpawnReady: function () {
      return state.groundSpawnReady;
    },
    setGroundSpawnReady: function (newGroundSpawnReady) {
      state.groundSpawnReady = newGroundSpawnReady;
    },
    getCactusIntervalMin: function () {
      return state.cactusIntervalMin;
    },
    setCactusIntervalMin: function (newCactusIntervalMin) {
      state.cactusIntervalMin = newCactusIntervalMin;
    },
    getCactusIntervalMax: function () {
      return state.cactusIntervalMax;
    },
    setCactusIntervalMax: function (newCactusIntervalMax) {
      state.cactusIntervalMax = newCactusIntervalMax;
    },
    getNextGroundSpawnType: function () {
      return state.nextGroundSpawnType;
    },
    setNextGroundSpawnType: function (newNextGroundSpawnType) {
      state.nextGroundSpawnType = newNextGroundSpawnType;
    },
    getPlatformCoinIntervalMin: function () {
      return state.platformCoinIntervalMin;
    },
    setPlatformCoinIntervalMax: function (newPlatformCoinIntervalMax) {
      state.platformCoinIntervalMax = newPlatformCoinIntervalMax;
    },
    getGroundCoinMinInterval: function () {
      return state.groundCoinIntervalMin;
    },
    setGroundCoinMinInterval: function (newGroundCoinMinInterval) {
      state.groundCoinIntervalMin = newGroundCoinMinInterval;
    },
    getGroundCoinMaxInterval: function () {
      return state.groundCoinIntervalMax;
    },
    setGroundCoinMaxInterval: function (newGroundCoinMaxInterval) {
      state.groundCoinIntervalMax = newGroundCoinMaxInterval;
    },
    getIsHeartColliding: function () {
      return state.isHeartColliding;
    },
    setIsHeartColliding: function (newIsHeartColliding) {
      state.isHeartColliding = newIsHeartColliding;
    },
    getIsLeafColliding: function () {
      return state.isLeafColliding;
    },
    setIsLeafColliding: function (newIsLeafColliding) {
      state.isLeafColliding = newIsLeafColliding;
    },
    getIsStarColliding: function () {
      return state.isStarColliding;
    },
    setIsStarColliding: function (newIsStarColliding) {
      state.isStarColliding = newIsStarColliding;
    },
    getIsMagnetColliding: function () {
      return state.isMagnetColliding;
    },
    setIsMagnetColliding: function (newIsMagnetColliding) {
      state.isMagnetColliding = newIsMagnetColliding;
    },
    getIsCrateRunning: function () {
      return state.isCrateRunning;
    },
    setIsCrateRunning: function (newIsCrateRunning) {
      state.isCrateRunning = newIsCrateRunning;
    },
    getIsGroundEnemyRunning: function () {
      return state.isGroundEnemyRunning;
    },
    setIsGroundEnemyRunning: function (newIsGroundEnemyRunning) {
      state.isGroundEnemyRunning = newIsGroundEnemyRunning;
    },
    getLeafDuration: function () {
      return state.leafDuration;
    },
    setLeafDuration: function (newLeafDuration) {
      state.leafDuration = newLeafDuration;
    },
    getHasLeaf: function () {
      return state.hasLeaf;
    },
    setHasLeaf: function (newHasLeaf) {
      state.hasLeaf = newHasLeaf;
    },
    getJumpCountLimit: function () {
      return state.jumpCountLimit;
    },
    setJumpCountLimit: function (newJumpCountLimit) {
      state.jumpCountLimit = newJumpCountLimit;
    },
    getPlatformSpeed: function () {
      return state.platformSpeed;
    },
    setPlatformSpeed: function (newPlatformSpeed) {
      state.platformSpeed = newPlatformSpeed;
    },
    getIsFlagCreated: function () {
      return state.isFlagCreated;
    },
    setIsFlagCreated: function (newIsFlagCreated) {
      state.isFlagCreated = newIsFlagCreated;
    },
    getGroundSpeed: function () {
      return state.groundSpeed;
    },
    setGroundSpeed: function (newGroundSpeed) {
      state.groundSpeed = newGroundSpeed;
    },
    getGroundEnemySpeedFactor: function () {
      return state.groundEnemySpeedFactor;
    },
    setGroundEnemySpeedFactor: function (newGroundEnemySpeedFactor) {
      state.groundEnemySpeedFactor = newGroundEnemySpeedFactor;
    },
    getIsMultiplierRunning: function () {
      return state.isMultiplierRunning;
    },
    setIsMultiplierRunning: function (newIsMultiplierRunning) {
      state.isMultiplierRunning = newIsMultiplierRunning;
    },
    getIsMagnetRunning: function () {
      return state.isMagnetRunning;
    },
    setIsMagnetRunning: function (newIsMagnetRunning) {
      state.isMagnetRunning = newIsMagnetRunning;
    },
    getIsStarRunning: function () {
      return state.isStarRunning;
    },
    setIsStarRunning: function (newIsStarRunning) {
      state.isStarRunning = newIsStarRunning;
    },
    getIsGroundRunning: function () {
      return state.isGroundRunning;
    },
    setIsGroundRunning: function (newIsGroundRunning) {
      state.isGroundRunning = newIsGroundRunning;
    },
    getIsGroundLayer2Running: function () {
      return state.isGroundLayer2Running;
    },
    setIsGroundLayer2Running: function (newIsGroundLayer2Running) {
      state.isGroundLayer2Running = newIsGroundLayer2Running;
    },
    getIsGroundLayer3Running: function () {
      return state.isGroundLayer3Running;
    },
    setIsGroundLayer3Running: function (newIsGroundLayer3Running) {
      state.isGroundLayer3Running = newIsGroundLayer3Running;
    },
    getIsPlatformRunning: function () {
      return state.isPlatformRunning;
    },
    setIsPlatformRunning: function (newIsPlatformRunning) {
      state.isPlatformRunning = newIsPlatformRunning;
    },
    getIsCactusRunning: function () {
      return state.isCactusRunning;
    },
    setIsCactusRunning: function (newIsCactusRunning) {
      state.isCactusRunning = newIsCactusRunning;
    },
    getIsBirdRunning: function () {
      return state.isBirdRunning;
    },
    setIsBirdRunning: function (newIsBirdRunning) {
      state.isBirdRunning = newIsBirdRunning;
    },
    getIsCoinsRunning: function () {
      return state.isCoinsRunning;
    },
    setIsCoinsRunning: function (newIsCoinsRunning) {
      state.isCoinsRunning = newIsCoinsRunning;
    },
    getSelectedStarter: function () {
      return state.selectedStarter;
    },
    setSelectedStarter: function (newSelectedStarter) {
      state.selectedStarter = newSelectedStarter;
    },
    getGravityFallAdjustment: function () {
      return state.gravityFallAdjustment;
    },
    setGravityFallAdjustment: function (newGravityFallAdjustment) {
      state.gravityFallAdjustment = newGravityFallAdjustment;
    },
    getLastPhase: function () {
      return state.lastPhase;
    },
    setLastPhase: function (newLastPhase) {
      state.lastPhase = newLastPhase;
    },
    getIsMagnetItem: function () {
      return state.isMagnetItem;
    },
    setIsMagnetItem: function (newBoolean) {
      state.isMagnetItem = newBoolean;
    },
    getObstaclePoints: function () {
      return state.obstaclePoints;
    },
    setObstaclePoints: function (newPoints) {
      state.obstaclePoints = newPoints;
    },
    getObstaclePoints: function () {
      return state.obstaclePoints;
    },
    setObstaclePoints: function (newPoints) {
      state.obstaclePoints = newPoints;
    },
    getStarDuration: function () {
      return state.starDuration;
    },
    setStarDuration: function (newDuration) {
      state.starDuration = newDuration;
    },
    getHasStar: function () {
      return state.hasStar;
    },
    setHasStar: function (newHasStar) {
      state.hasStar = newHasStar;
    },
    getPlayerImmunity: function () {
      return state.playerImmunity;
    },
    setPlayerImmunity: function (newImmunity) {
      state.playerImmunity = newImmunity;
    },
    getMultiplierRatio: function () {
      return state.multiplierRatio;
    },
    setMultiplierRatio: function (newRatio) {
      state.multiplierRatio = newRatio;
    },
    getTimerInterval: function () {
      return state.timerInterval;
    },
    setTimerInterval: function (newInterval) {
      state.timerInterval = newInterval;
    },
    getPhaseTimerInterval: function () {
      return state.phaseTimerInterval;
    },
    setPhaseTimerInterval: function (newInterval) {
      state.phaseTimerInterval = newInterval;
    },
    getMultiplierTimer: function () {
      return state.multiplierTimer;
    },
    setMultiplierTimer: function (newTimer) {
      state.multiplierTimer = newTimer;
    },
    getCurrentPhase: function () {
      return state.currentPhase;
    },
    setCurrentPhase: function (newPhase) {
      state.currentPhase = newPhase;
    },
    getSpeedScale: function () {
      return state.speedScale;
    },
    setSpeedScale: function (newSpeedScale) {
      state.speedScale = newSpeedScale;
    },
    getSpeedScaleIncrease: function () {
      return state.speedScaleIncrease;
    },
    setSpeedScaleIncrease: function (newSpeedScaleIncrease) {
      state.speedScaleIncrease = newSpeedScaleIncrease;
    },
    updateState: function (newValues) {
      Object.assign(state, newValues);
    },
  };
})();

export default StateSingleton;

// // To get the current phase
// const currentPhase = StateSingleton.getCurrentPhase();

// // To set a new phase
// StateSingleton.setCurrentPhase(2);

// // To update other properties in the state object
// StateSingleton.updateState({ someProperty: 'new value' });
