import StateSingleton from './game-state';

const {
  setIsStarColliding,
  setIsMagnetColliding,
  setIsHeartColliding,
  setIsLeafColliding,
} = StateSingleton;

// state.js
const ItemDropStateSingleton = (function () {
  //default state
  let state = {
    // star: { weight: 8, colliderSetter: setIsStarColliding },
    magnet: { weight: 8, colliderSetter: setIsMagnetColliding },
    // heart: { weight: 8, colliderSetter: setIsHeartColliding },
    // leaf: { weight: 8, colliderSetter: setIsLeafColliding },
    // empty: { weight: 8 },
  };

  let normalizedItemDropState = {};

  return {
    getItemDropState: function () {
      return state;
    },
    getNormalizedItemDropState: function () {
      return normalizedItemDropState;
    },
    setNormalizedItemDropState: function (newState) {
      normalizedItemDropState = newState;
    },
    updateState: function (newValues) {
      Object.assign(state, newValues);
    },
  };
})();

export default ItemDropStateSingleton;
