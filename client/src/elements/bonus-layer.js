import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from '../utility/updateCustomProperty.js';
import StateSingleton from '../game-state.js';
const { getIsGroundLayer2Running, getGroundSpeed } = StateSingleton;
const SPEED = getGroundSpeed();
const bonusLayerElems = document.querySelectorAll('[data-bonus-layer]');

export function setupBonusLayer() {
  setCustomProperty(bonusLayerElems[0], '--left', 100);
  setCustomProperty(bonusLayerElems[1], '--left', 281);
}

let isBonusLayerMovedBack = false;
let isBonusLayerSetup = true;
export function updateBonusLayer(delta, speedScale) {
  if (!getIsGroundLayer2Running()) {
    isBonusLayerSetup = false;
    bonusLayerElems.forEach((bonus) => {
      incrementCustomProperty(bonus, '--left', delta * speedScale * SPEED * -1);
      if (getCustomProperty(bonus, '--left') <= -281) {
        incrementCustomProperty(bonus, '--left', 362);
      }
    });
  } else if (
    getIsGroundLayer2Running() &&
    !isBonusLayerMovedBack &&
    !isBonusLayerSetup
  ) {
    setCustomProperty(bonusLayerElems[0], '--left', -77);
    setCustomProperty(bonusLayerElems[1], '--left', -77);
    isBonusLayerMovedBack = true;
  } else if (
    getIsGroundLayer2Running() &&
    isBonusLayerMovedBack &&
    !isBonusLayerSetup
  ) {
    bonusLayerElems.forEach((bonus) => {
      incrementCustomProperty(bonus, '--left', delta * speedScale * SPEED * -1);

      if (getCustomProperty(bonus, '--left') <= -281) {
        setCustomProperty(bonusLayerElems[0], '--left', 100);
        setCustomProperty(bonusLayerElems[1], '--left', 281);
        isBonusLayerSetup = true;
      }
    });
  } else return;
}
