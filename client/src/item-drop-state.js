import StateSingleton from './game-state';

const {
  setIsStarColliding,
  setIsMagnetColliding,
  setIsHeartColliding,
  setIsLeafColliding,
  setIsCherryColliding,
} = StateSingleton;

// state.js
const ItemDropStateSingleton = (function () {
  //default state
  let state = {
    star: { weight: 8, colliderSetter: setIsStarColliding },
    // magnet: { weight: 4, colliderSetter: setIsMagnetColliding },
    heart: { weight: 12, colliderSetter: setIsHeartColliding },
    // leaf: { weight: 12, colliderSetter: setIsLeafColliding },
    // cherry: { weight: 12, colliderSetter: setIsCherryColliding },
    // empty: { weight: 2 },
  };

  return {
    getItemDropState: function () {
      return state;
    },
    updateState: function (newValues) {
      Object.assign(state, newValues);
    },
  };
})();

export default ItemDropStateSingleton;
