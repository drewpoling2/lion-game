// state.js
const ItemDropStateSingleton = (function () {
  //default state
  let state = {
    star: { weight: 8 },
    // magnet: { weight: 4 },
    // heart: { weight: 12 },
    // leaf: { weight: 12 },
    // cherry: { weight: 12 },
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
