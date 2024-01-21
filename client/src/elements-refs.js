// sharedElements.js
const worldElem = document.querySelector('[data-world]');
const scoreElem = document.querySelector('[data-score]');
const highScoreElem = document.querySelector('[data-high-score]');
const startScreenElem = document.querySelector('[data-start-screen]');
const endScreenElem = document.querySelector('[data-game-over-screen]');
const gameOverTextElem = document.querySelector('[data-game-over-text]');
const gameOverIconElem = document.getElementById('game-over-icon');
const leaderboardElem = document.querySelector('[data-leaderboard-body]');
const scoreMultiplierElem = document.querySelector('[data-score-multiplier]');
const scoreNewHighScoreElem = document.querySelector(
  '[data-score-new-high-score]'
);
const scoreErrorMessageElem = document.querySelector(
  '[data-score-error-message]'
);
const multiplierTimerElem = document.querySelector('[data-multiplier-timer]');
const tickerElem = document.querySelector('[data-ticker]');
const tickerElem2 = document.querySelector('[data-ticker2]');
const tickerElem3 = document.querySelector('[data-ticker3]');
const livesElem = document.querySelector('[data-lives]');
const dinoElem = document.querySelector('[data-dino]');
const scrollableTableElem = document.querySelector('[data-scrollable-table]');
const currentMultiplierElem = document.querySelector(
  '[data-current-multiplier]'
);
const plusPointsElem = document.querySelector('[data-plus-points]');
const tickerContainerElem = document.querySelector('[data-ticker-container]');
const loadingTextElem = document.querySelector('[data-loading-text]');
const submitNewScoreFormElem = document.querySelector(
  '[data-submit-new-score-form]'
);
const interfaceComboContainer = document.getElementById(
  'interface-combo-container'
);
const currentMultiplierScoreElem = document.querySelector(
  '[data-current-multiplier-score]'
);
const currentComboScoreContainer = document.getElementById(
  'current-combo-score-container'
);
const timerProgress = document.getElementById('timerProgress');
const currentGameTimerElem = document.querySelector(
  '[data-current-game-timer]'
);

const gameLoadingScreenElem = document.querySelector(
  '[data-game-loading-screen]'
);

const gameLoadingTextElem = document.querySelector('[data-game-loading-text]');
const gameNotificationElem = document.querySelector(
  '[data-notification-screen]'
);
const pausedScreenElem = document.querySelector('[data-paused-screen]');
export {
  pausedScreenElem,
  gameNotificationElem,
  gameLoadingTextElem,
  gameLoadingScreenElem,
  currentGameTimerElem,
  timerProgress,
  worldElem,
  scoreElem,
  highScoreElem,
  startScreenElem,
  endScreenElem,
  gameOverTextElem,
  gameOverIconElem,
  leaderboardElem,
  scoreMultiplierElem,
  scoreNewHighScoreElem,
  scoreErrorMessageElem,
  multiplierTimerElem,
  tickerElem,
  tickerElem2,
  tickerElem3,
  livesElem,
  dinoElem,
  scrollableTableElem,
  currentMultiplierElem,
  plusPointsElem,
  tickerContainerElem,
  loadingTextElem,
  submitNewScoreFormElem,
  interfaceComboContainer,
  currentMultiplierScoreElem,
  currentComboScoreContainer,
};
