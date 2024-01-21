import StateSingleton from '../game-state';
import { updateNotification } from '../game-manager';
import { phases } from './phase-properties';
const {
  getPhaseTimerInterval,
  setCurrentPhase,
  setPhaseTimerInterval,
  getLastPhase,
  setLastPhase,
  updateState,
  getCurrentPhase,
} = StateSingleton;
export function updateBonusPhase(timer) {
  updateState({
    isCactusRunning: false,
  });
  if (timer > getPhaseTimerInterval()) {
    const incrementPhase = getLastPhase() + 2;
    setLastPhase(getLastPhase() + 1);
    console.log(`Phase bonus complete`);
    // Transition to the next phase
    setCurrentPhase(incrementPhase);
    updateNotification(`stage ${getCurrentPhase()}!`);
    updateState({
      isGroundLayer2Running: true,
    });
    // Set the timer interval for the new phase
    setPhaseTimerInterval(
      getPhaseTimerInterval() + phases[`${incrementPhase}`].totalTime
    );
  }
}
