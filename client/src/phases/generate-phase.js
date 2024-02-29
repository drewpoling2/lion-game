import StateSingleton from '../game-state';
import { generatedPhases } from './generated-phase-properties';
const { getMostRecentPhase, setMostRecentPhase, getCurrentPhase, updateState } =
  StateSingleton;

export function updateGeneratedPhase(phaseNumber) {
  if (phaseNumber !== getMostRecentPhase()) {
    updateState({
      ...generatedPhases[phaseNumber],
    });
    setMostRecentPhase(phaseNumber);
    console.log(`Phase ${getCurrentPhase()} running`);
  }
}
