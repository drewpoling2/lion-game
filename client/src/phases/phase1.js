import StateSingleton from '../game-state';
import { phases } from './phase-properties';
const {
  getPhaseTimerInterval,
  getCurrentPhase,
  setCurrentPhase,
  setPhaseTimerInterval,
  updateState,
  setIsFlagCreated,
} = StateSingleton;

export function updatePhase1(timer) {
  updateState({
    isCactusRunning: true,
    isCoinRunning: true,
    isPlatformRunning: true,
    isGroundEnemyRunning: true,
  });

  if (timer > getPhaseTimerInterval()) {
    console.log(`Phase ${getCurrentPhase()} complete`);
    setIsFlagCreated(false);
    setCurrentPhase('bonus');
    // Set the timer interval for the new phase
    setPhaseTimerInterval(getPhaseTimerInterval() + phases['bonus'].totalTime);
  }
}
