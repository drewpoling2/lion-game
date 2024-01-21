import StateSingleton from '../game-state';
import { phases } from './phase-properties';

const {
  getPhaseTimerInterval,
  setCurrentPhase,
  setPhaseTimerInterval,
  getCurrentPhase,
  updateState,
  setIsFlagCreated,
} = StateSingleton;

export function updatePhase2(timer) {
  updateState({
    isPlatformRunning: true,
    isCactusRunning: true,
  });
  if (timer > getPhaseTimerInterval()) {
    setCurrentPhase('bonus');
    setIsFlagCreated(false);
    console.log(`Phase ${getCurrentPhase()} complete`);
    setPhaseTimerInterval(phases['2'].totalTime);
  }
}
