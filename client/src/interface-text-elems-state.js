// state.js
const InterfaceTextElemsSingleton = (function () {
  // State array to keep track of interfaceTextElems
  let interfaceTextElemsState = [];

  return {
    getInterfaceTextElemsState: function () {
      return interfaceTextElemsState;
    },
    updateState: function (newValues) {
      Object.assign(state, newValues);
    },
    addInterfaceTextElem: function (elem) {
      interfaceTextElemsState.push(elem);
      console.log(interfaceTextElemsState);
    },
    removeInterfaceTextElem: function (elem) {
      const index = interfaceTextElemsState.indexOf(elem);
      if (index !== -1) {
        interfaceTextElemsState.splice(index, 1);
      }
    },
  };
})();

export default InterfaceTextElemsSingleton;
