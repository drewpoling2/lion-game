// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../utility/updateCustomProperty.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCustomProperty = getCustomProperty;
exports.incrementCustomProperty = incrementCustomProperty;
exports.setCustomProperty = setCustomProperty;
function getCustomProperty(elem, prop) {
  return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
}
function setCustomProperty(elem, prop, value) {
  elem.style.setProperty(prop, value);
}
function incrementCustomProperty(elem, prop, inc) {
  setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc);
}
},{}],"../elements/ground.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupGround = setupGround;
exports.updateGround = updateGround;
var _updateCustomProperty = require("../utility/updateCustomProperty.js");
var SPEED = 0.04;
var groundElems = document.querySelectorAll('[data-ground]');
function setupGround() {
  (0, _updateCustomProperty.setCustomProperty)(groundElems[0], '--left', 0);
  (0, _updateCustomProperty.setCustomProperty)(groundElems[1], '--left', 250);
}
function updateGround(delta, speedScale) {
  groundElems.forEach(function (ground) {
    (0, _updateCustomProperty.incrementCustomProperty)(ground, '--left', delta * speedScale * SPEED * -1);
    if ((0, _updateCustomProperty.getCustomProperty)(ground, '--left') <= -250) {
      (0, _updateCustomProperty.incrementCustomProperty)(ground, '--left', 500);
    }
  });
}
},{"../utility/updateCustomProperty.js":"../utility/updateCustomProperty.js"}],"../game-state.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
// state.js
var StateSingleton = function (_ref) {
  //default state
  var state = {
    multiplierRatio: 1,
    timerInterval: 3,
    phaseTimerInterval: 10,
    multiplierTimer: 5000,
    currentPhase: 1,
    speedScale: 0.9,
    speedScaleIncrease: 0.000015,
    jumpCountLimit: 1,
    cherryPoints: 1000,
    obstaclePoints: 5,
    lastPhase: 0,
    gravityFallAdjustment: 0.021,
    selectedStarter: null,
    //elements
    isCoinsRunning: true,
    isPlatformRunning: false,
    isCactusRunning: false,
    isBirdRunning: true,
    isGroundEnemyRunning: true,
    //world
    isGroundRunning: true,
    isGroundLayer2Running: true,
    isGroundLayer3Running: true,
    groundSpeed: 0.04,
    groundEnemySpeedFactor: 0.05,
    isFlagCreated: true,
    platformSpeed: 0.05,
    //items
    isMultiplierRunning: false,
    isMagnetRunning: false,
    isStarRunning: false,
    starDuration: 10000,
    playerImmunity: false,
    hasStar: false,
    hasLeaf: false,
    leafDuration: 10000,
    isMagnetItem: false
  };
  return _ref = {
    getIsGroundEnemyRunning: function getIsGroundEnemyRunning() {
      return state.isGroundEnemyRunning;
    },
    setIsGroundEnemyRunning: function setIsGroundEnemyRunning(newIsGroundEnemyRunning) {
      state.isGroundEnemyRunning = newIsGroundEnemyRunning;
    },
    getCherryPoints: function getCherryPoints() {
      return state.cherryPoints;
    },
    setCherryPoints: function setCherryPoints(newCherryPoints) {
      state.cherryPoints = newCherryPoints;
    },
    getLeafDuration: function getLeafDuration() {
      return state.leafDuration;
    },
    setLeafDuration: function setLeafDuration(newLeafDuration) {
      state.leafDuration = newLeafDuration;
    },
    getHasLeaf: function getHasLeaf() {
      return state.hasLeaf;
    },
    setHasLeaf: function setHasLeaf(newHasLeaf) {
      state.hasLeaf = newHasLeaf;
    },
    getJumpCountLimit: function getJumpCountLimit() {
      return state.jumpCountLimit;
    },
    setJumpCountLimit: function setJumpCountLimit(newJumpCountLimit) {
      state.jumpCountLimit = newJumpCountLimit;
    },
    getPlatformSpeed: function getPlatformSpeed() {
      return state.platformSpeed;
    },
    setPlatformSpeed: function setPlatformSpeed(newPlatformSpeed) {
      state.platformSpeed = newPlatformSpeed;
    },
    getIsFlagCreated: function getIsFlagCreated() {
      return state.isFlagCreated;
    },
    setIsFlagCreated: function setIsFlagCreated(newIsFlagCreated) {
      state.isFlagCreated = newIsFlagCreated;
    },
    getGroundSpeed: function getGroundSpeed() {
      return state.groundSpeed;
    },
    setGroundSpeed: function setGroundSpeed(newGroundSpeed) {
      state.groundSpeed = newGroundSpeed;
    },
    getGroundEnemySpeedFactor: function getGroundEnemySpeedFactor() {
      return state.groundEnemySpeedFactor;
    },
    setGroundEnemySpeedFactor: function setGroundEnemySpeedFactor(newGroundEnemySpeedFactor) {
      state.groundEnemySpeedFactor = newGroundEnemySpeedFactor;
    },
    getIsMultiplierRunning: function getIsMultiplierRunning() {
      return state.isMultiplierRunning;
    },
    setIsMultiplierRunning: function setIsMultiplierRunning(newIsMultiplierRunning) {
      state.isMultiplierRunning = newIsMultiplierRunning;
    },
    getIsMagnetRunning: function getIsMagnetRunning() {
      return state.isMagnetRunning;
    },
    setIsMagnetRunning: function setIsMagnetRunning(newIsMagnetRunning) {
      state.isMagnetRunning = newIsMagnetRunning;
    },
    getIsStarRunning: function getIsStarRunning() {
      return state.isStarRunning;
    },
    setIsStarRunning: function setIsStarRunning(newIsStarRunning) {
      state.isStarRunning = newIsStarRunning;
    },
    getIsGroundRunning: function getIsGroundRunning() {
      return state.isGroundRunning;
    },
    setIsGroundRunning: function setIsGroundRunning(newIsGroundRunning) {
      state.isGroundRunning = newIsGroundRunning;
    },
    getIsGroundLayer2Running: function getIsGroundLayer2Running() {
      return state.isGroundLayer2Running;
    },
    setIsGroundLayer2Running: function setIsGroundLayer2Running(newIsGroundLayer2Running) {
      state.isGroundLayer2Running = newIsGroundLayer2Running;
    },
    getIsGroundLayer3Running: function getIsGroundLayer3Running() {
      return state.isGroundLayer3Running;
    },
    setIsGroundLayer3Running: function setIsGroundLayer3Running(newIsGroundLayer3Running) {
      state.isGroundLayer3Running = newIsGroundLayer3Running;
    },
    getIsPlatformRunning: function getIsPlatformRunning() {
      return state.isPlatformRunning;
    },
    setIsPlatformRunning: function setIsPlatformRunning(newIsPlatformRunning) {
      state.isPlatformRunning = newIsPlatformRunning;
    },
    getIsCactusRunning: function getIsCactusRunning() {
      return state.isCactusRunning;
    },
    setIsCactusRunning: function setIsCactusRunning(newIsCactusRunning) {
      state.isCactusRunning = newIsCactusRunning;
    },
    getIsBirdRunning: function getIsBirdRunning() {
      return state.isBirdRunning;
    },
    setIsBirdRunning: function setIsBirdRunning(newIsBirdRunning) {
      state.isBirdRunning = newIsBirdRunning;
    },
    getIsCoinsRunning: function getIsCoinsRunning() {
      return state.isCoinsRunning;
    },
    setIsCoinsRunning: function setIsCoinsRunning(newIsCoinsRunning) {
      state.isCoinsRunning = newIsCoinsRunning;
    },
    getSelectedStarter: function getSelectedStarter() {
      return state.selectedStarter;
    },
    setSelectedStarter: function setSelectedStarter(newSelectedStarter) {
      state.selectedStarter = newSelectedStarter;
    },
    getGravityFallAdjustment: function getGravityFallAdjustment() {
      return state.gravityFallAdjustment;
    },
    setGravityFallAdjustment: function setGravityFallAdjustment(newGravityFallAdjustment) {
      state.gravityFallAdjustment = newGravityFallAdjustment;
    },
    getLastPhase: function getLastPhase() {
      return state.lastPhase;
    },
    setLastPhase: function setLastPhase(newLastPhase) {
      state.lastPhase = newLastPhase;
    },
    getIsMagnetItem: function getIsMagnetItem() {
      return state.isMagnetItem;
    },
    setIsMagnetItem: function setIsMagnetItem(newBoolean) {
      state.isMagnetItem = newBoolean;
    },
    getObstaclePoints: function getObstaclePoints() {
      return state.obstaclePoints;
    },
    setObstaclePoints: function setObstaclePoints(newPoints) {
      state.obstaclePoints = newPoints;
    }
  }, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_ref, "getObstaclePoints", function getObstaclePoints() {
    return state.obstaclePoints;
  }), "setObstaclePoints", function setObstaclePoints(newPoints) {
    state.obstaclePoints = newPoints;
  }), "getStarDuration", function getStarDuration() {
    return state.starDuration;
  }), "setStarDuration", function setStarDuration(newDuration) {
    state.starDuration = newDuration;
  }), "getHasStar", function getHasStar() {
    return state.hasStar;
  }), "setHasStar", function setHasStar(newHasStar) {
    state.hasStar = newHasStar;
  }), "getPlayerImmunity", function getPlayerImmunity() {
    return state.playerImmunity;
  }), "setPlayerImmunity", function setPlayerImmunity(newImmunity) {
    state.playerImmunity = newImmunity;
  }), "getMultiplierRatio", function getMultiplierRatio() {
    return state.multiplierRatio;
  }), "setMultiplierRatio", function setMultiplierRatio(newRatio) {
    state.multiplierRatio = newRatio;
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_ref, "getTimerInterval", function getTimerInterval() {
    return state.timerInterval;
  }), "setTimerInterval", function setTimerInterval(newInterval) {
    state.timerInterval = newInterval;
  }), "getPhaseTimerInterval", function getPhaseTimerInterval() {
    return state.phaseTimerInterval;
  }), "setPhaseTimerInterval", function setPhaseTimerInterval(newInterval) {
    state.phaseTimerInterval = newInterval;
  }), "getMultiplierTimer", function getMultiplierTimer() {
    return state.multiplierTimer;
  }), "setMultiplierTimer", function setMultiplierTimer(newTimer) {
    state.multiplierTimer = newTimer;
  }), "getCurrentPhase", function getCurrentPhase() {
    return state.currentPhase;
  }), "setCurrentPhase", function setCurrentPhase(newPhase) {
    state.currentPhase = newPhase;
  }), "getSpeedScale", function getSpeedScale() {
    return state.speedScale;
  }), "setSpeedScale", function setSpeedScale(newSpeedScale) {
    state.speedScale = newSpeedScale;
  }), _defineProperty(_defineProperty(_defineProperty(_ref, "getSpeedScaleIncrease", function getSpeedScaleIncrease() {
    return state.speedScaleIncrease;
  }), "setSpeedScaleIncrease", function setSpeedScaleIncrease(newSpeedScaleIncrease) {
    state.speedScaleIncrease = newSpeedScaleIncrease;
  }), "updateState", function updateState(newValues) {
    Object.assign(state, newValues);
  });
}();
var _default = exports.default = StateSingleton; // // To get the current phase
// const currentPhase = StateSingleton.getCurrentPhase();
// // To set a new phase
// StateSingleton.setCurrentPhase(2);
// // To update other properties in the state object
// StateSingleton.updateState({ someProperty: 'new value' });
},{}],"../elements/groundLayerTwo.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupGroundLayerTwo = setupGroundLayerTwo;
exports.updateGroundLayerTwo = updateGroundLayerTwo;
var _updateCustomProperty = require("../utility/updateCustomProperty.js");
var _gameState = _interopRequireDefault(require("../game-state.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var getIsGroundLayer2Running = _gameState.default.getIsGroundLayer2Running;
var SPEED = 0.02;
var groundLayerTwoElems = document.querySelectorAll('[data-ground-layer-two]');
function setupGroundLayerTwo() {
  (0, _updateCustomProperty.setCustomProperty)(groundLayerTwoElems[0], '--left', 0);
  (0, _updateCustomProperty.setCustomProperty)(groundLayerTwoElems[1], '--left', 220);
}
function updateGroundLayerTwo(delta, speedScale) {
  groundLayerTwoElems.forEach(function (ground) {
    (0, _updateCustomProperty.incrementCustomProperty)(ground, '--left', delta * speedScale * SPEED * -1);
    if ((0, _updateCustomProperty.getCustomProperty)(ground, '--left') <= -220) {
      if (!getIsGroundLayer2Running()) {
        (0, _updateCustomProperty.incrementCustomProperty)(ground, '--left', 439);
      } else {
        (0, _updateCustomProperty.incrementCustomProperty)(ground, '--left', 439);
      }
    }
  });
}
},{"../utility/updateCustomProperty.js":"../utility/updateCustomProperty.js","../game-state.js":"../game-state.js"}],"../elements/groundLayerTwoTwo.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupGroundLayerTwoTwo = setupGroundLayerTwoTwo;
exports.updateGroundLayerTwoTwo = updateGroundLayerTwoTwo;
var _updateCustomProperty = require("../utility/updateCustomProperty.js");
var _gameState = _interopRequireDefault(require("../game-state.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var getIsGroundLayer2Running = _gameState.default.getIsGroundLayer2Running;
var SPEED = 0.017;
var groundLayerTwoElems = document.querySelectorAll('[data-ground-layer-two-two]');
function setupGroundLayerTwoTwo() {
  (0, _updateCustomProperty.setCustomProperty)(groundLayerTwoElems[0], '--left', 0);
  (0, _updateCustomProperty.setCustomProperty)(groundLayerTwoElems[1], '--left', 220);
}
function updateGroundLayerTwoTwo(delta, speedScale) {
  groundLayerTwoElems.forEach(function (ground) {
    (0, _updateCustomProperty.incrementCustomProperty)(ground, '--left', delta * speedScale * SPEED * -1);
    if ((0, _updateCustomProperty.getCustomProperty)(ground, '--left') <= -220) {
      if (!getIsGroundLayer2Running()) {
        (0, _updateCustomProperty.incrementCustomProperty)(ground, '--left', 400);
      } else {
        (0, _updateCustomProperty.incrementCustomProperty)(ground, '--left', 520);
        ground.style.zIndex = '-1';
      }
    }
  });
}
},{"../utility/updateCustomProperty.js":"../utility/updateCustomProperty.js","../game-state.js":"../game-state.js"}],"../elements/groundLayerThree.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupGroundLayerThree = setupGroundLayerThree;
exports.updateGroundLayerThree = updateGroundLayerThree;
var _updateCustomProperty = require("../utility/updateCustomProperty.js");
var SPEED = 0.007;
var groundLayerThreeElems = document.querySelectorAll('[data-ground-layer-three]');
function setupGroundLayerThree() {
  (0, _updateCustomProperty.setCustomProperty)(groundLayerThreeElems[0], '--left', 0);
  (0, _updateCustomProperty.setCustomProperty)(groundLayerThreeElems[1], '--left', 200);
}
function updateGroundLayerThree(delta, speedScale) {
  groundLayerThreeElems.forEach(function (ground) {
    (0, _updateCustomProperty.incrementCustomProperty)(ground, '--left', delta * speedScale * SPEED * -1);
    if ((0, _updateCustomProperty.getCustomProperty)(ground, '--left') <= -200) {
      (0, _updateCustomProperty.incrementCustomProperty)(ground, '--left', 400);
    }
  });
}
},{"../utility/updateCustomProperty.js":"../utility/updateCustomProperty.js"}],"imgs/nittany-lion/jump-animation/Jump-1.png":[function(require,module,exports) {
module.exports = "/Jump-1.75f1a3cd.png";
},{}],"imgs/nittany-lion/jump-animation/Jump-2.png":[function(require,module,exports) {
module.exports = "/Jump-2.6da28d8f.png";
},{}],"imgs/nittany-lion/run-cycle/Run-1.png":[function(require,module,exports) {
module.exports = "/Run-1.46a06f1c.png";
},{}],"imgs/nittany-lion/run-cycle/Run-2.png":[function(require,module,exports) {
module.exports = "/Run-2.3a155b76.png";
},{}],"imgs/nittany-lion/run-cycle/Run-3.png":[function(require,module,exports) {
module.exports = "/Run-3.ae5640e0.png";
},{}],"imgs/nittany-lion/run-cycle/Run-4.png":[function(require,module,exports) {
module.exports = "/Run-4.920d82db.png";
},{}],"imgs/nittany-lion/rest-animation/Rest-1.png":[function(require,module,exports) {
module.exports = "/Rest-1.d9294cd3.png";
},{}],"imgs/nittany-lion/rest-animation/Rest-2.png":[function(require,module,exports) {
module.exports = "/Rest-2.7e0465ba.png";
},{}],"imgs/nittany-lion/rest-animation/Rest-3.png":[function(require,module,exports) {
module.exports = "/Rest-3.edfe9fe2.png";
},{}],"../node_modules/howler/dist/howler.js":[function(require,module,exports) {
var define;
var global = arguments[3];
/*!
 *  howler.js v2.2.4
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Create the global controller. All contained methods and properties apply
   * to all sounds that are currently playing or will be in the future.
   */
  var HowlerGlobal = function() {
    this.init();
  };
  HowlerGlobal.prototype = {
    /**
     * Initialize the global Howler object.
     * @return {Howler}
     */
    init: function() {
      var self = this || Howler;

      // Create a global ID counter.
      self._counter = 1000;

      // Pool of unlocked HTML5 Audio objects.
      self._html5AudioPool = [];
      self.html5PoolSize = 10;

      // Internal properties.
      self._codecs = {};
      self._howls = [];
      self._muted = false;
      self._volume = 1;
      self._canPlayEvent = 'canplaythrough';
      self._navigator = (typeof window !== 'undefined' && window.navigator) ? window.navigator : null;

      // Public properties.
      self.masterGain = null;
      self.noAudio = false;
      self.usingWebAudio = true;
      self.autoSuspend = true;
      self.ctx = null;

      // Set to false to disable the auto audio unlocker.
      self.autoUnlock = true;

      // Setup the various state values for global tracking.
      self._setup();

      return self;
    },

    /**
     * Get/set the global volume for all sounds.
     * @param  {Float} vol Volume from 0.0 to 1.0.
     * @return {Howler/Float}     Returns self or current volume.
     */
    volume: function(vol) {
      var self = this || Howler;
      vol = parseFloat(vol);

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        self._volume = vol;

        // Don't update any of the nodes if we are muted.
        if (self._muted) {
          return self;
        }

        // When using Web Audio, we just need to adjust the master gain.
        if (self.usingWebAudio) {
          self.masterGain.gain.setValueAtTime(vol, Howler.ctx.currentTime);
        }

        // Loop through and change volume for all HTML5 audio nodes.
        for (var i=0; i<self._howls.length; i++) {
          if (!self._howls[i]._webAudio) {
            // Get all of the sounds in this Howl group.
            var ids = self._howls[i]._getSoundIds();

            // Loop through all sounds and change the volumes.
            for (var j=0; j<ids.length; j++) {
              var sound = self._howls[i]._soundById(ids[j]);

              if (sound && sound._node) {
                sound._node.volume = sound._volume * vol;
              }
            }
          }
        }

        return self;
      }

      return self._volume;
    },

    /**
     * Handle muting and unmuting globally.
     * @param  {Boolean} muted Is muted or not.
     */
    mute: function(muted) {
      var self = this || Howler;

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      self._muted = muted;

      // With Web Audio, we just need to mute the master gain.
      if (self.usingWebAudio) {
        self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler.ctx.currentTime);
      }

      // Loop through and mute all HTML5 Audio nodes.
      for (var i=0; i<self._howls.length; i++) {
        if (!self._howls[i]._webAudio) {
          // Get all of the sounds in this Howl group.
          var ids = self._howls[i]._getSoundIds();

          // Loop through all sounds and mark the audio node as muted.
          for (var j=0; j<ids.length; j++) {
            var sound = self._howls[i]._soundById(ids[j]);

            if (sound && sound._node) {
              sound._node.muted = (muted) ? true : sound._muted;
            }
          }
        }
      }

      return self;
    },

    /**
     * Handle stopping all sounds globally.
     */
    stop: function() {
      var self = this || Howler;

      // Loop through all Howls and stop them.
      for (var i=0; i<self._howls.length; i++) {
        self._howls[i].stop();
      }

      return self;
    },

    /**
     * Unload and destroy all currently loaded Howl objects.
     * @return {Howler}
     */
    unload: function() {
      var self = this || Howler;

      for (var i=self._howls.length-1; i>=0; i--) {
        self._howls[i].unload();
      }

      // Create a new AudioContext to make sure it is fully reset.
      if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== 'undefined') {
        self.ctx.close();
        self.ctx = null;
        setupAudioContext();
      }

      return self;
    },

    /**
     * Check for codec support of specific extension.
     * @param  {String} ext Audio file extention.
     * @return {Boolean}
     */
    codecs: function(ext) {
      return (this || Howler)._codecs[ext.replace(/^x-/, '')];
    },

    /**
     * Setup various state values for global tracking.
     * @return {Howler}
     */
    _setup: function() {
      var self = this || Howler;

      // Keeps track of the suspend/resume state of the AudioContext.
      self.state = self.ctx ? self.ctx.state || 'suspended' : 'suspended';

      // Automatically begin the 30-second suspend process
      self._autoSuspend();

      // Check if audio is available.
      if (!self.usingWebAudio) {
        // No audio is available on this system if noAudio is set to true.
        if (typeof Audio !== 'undefined') {
          try {
            var test = new Audio();

            // Check if the canplaythrough event is available.
            if (typeof test.oncanplaythrough === 'undefined') {
              self._canPlayEvent = 'canplay';
            }
          } catch(e) {
            self.noAudio = true;
          }
        } else {
          self.noAudio = true;
        }
      }

      // Test to make sure audio isn't disabled in Internet Explorer.
      try {
        var test = new Audio();
        if (test.muted) {
          self.noAudio = true;
        }
      } catch (e) {}

      // Check for supported codecs.
      if (!self.noAudio) {
        self._setupCodecs();
      }

      return self;
    },

    /**
     * Check for browser support for various codecs and cache the results.
     * @return {Howler}
     */
    _setupCodecs: function() {
      var self = this || Howler;
      var audioTest = null;

      // Must wrap in a try/catch because IE11 in server mode throws an error.
      try {
        audioTest = (typeof Audio !== 'undefined') ? new Audio() : null;
      } catch (err) {
        return self;
      }

      if (!audioTest || typeof audioTest.canPlayType !== 'function') {
        return self;
      }

      var mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');

      // Opera version <33 has mixed MP3 support, so we need to check for and block it.
      var ua = self._navigator ? self._navigator.userAgent : '';
      var checkOpera = ua.match(/OPR\/(\d+)/g);
      var isOldOpera = (checkOpera && parseInt(checkOpera[0].split('/')[1], 10) < 33);
      var checkSafari = ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1;
      var safariVersion = ua.match(/Version\/(.*?) /);
      var isOldSafari = (checkSafari && safariVersion && parseInt(safariVersion[1], 10) < 15);

      self._codecs = {
        mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, ''))),
        mpeg: !!mpegTest,
        opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
        ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        wav: !!(audioTest.canPlayType('audio/wav; codecs="1"') || audioTest.canPlayType('audio/wav')).replace(/^no$/, ''),
        aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, ''),
        caf: !!audioTest.canPlayType('audio/x-caf;').replace(/^no$/, ''),
        m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        m4b: !!(audioTest.canPlayType('audio/x-m4b;') || audioTest.canPlayType('audio/m4b;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        mp4: !!(audioTest.canPlayType('audio/x-mp4;') || audioTest.canPlayType('audio/mp4;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        weba: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')),
        webm: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')),
        dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ''),
        flac: !!(audioTest.canPlayType('audio/x-flac;') || audioTest.canPlayType('audio/flac;')).replace(/^no$/, '')
      };

      return self;
    },

    /**
     * Some browsers/devices will only allow audio to be played after a user interaction.
     * Attempt to automatically unlock audio on the first user interaction.
     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     * @return {Howler}
     */
    _unlockAudio: function() {
      var self = this || Howler;

      // Only run this if Web Audio is supported and it hasn't already been unlocked.
      if (self._audioUnlocked || !self.ctx) {
        return;
      }

      self._audioUnlocked = false;
      self.autoUnlock = false;

      // Some mobile devices/platforms have distortion issues when opening/closing tabs and/or web views.
      // Bugs in the browser (especially Mobile Safari) can cause the sampleRate to change from 44100 to 48000.
      // By calling Howler.unload(), we create a new AudioContext with the correct sampleRate.
      if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
        self._mobileUnloaded = true;
        self.unload();
      }

      // Scratch buffer for enabling iOS to dispose of web audio buffers correctly, as per:
      // http://stackoverflow.com/questions/24119684
      self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);

      // Call this method on touch start to create and play a buffer,
      // then check if the audio actually played to determine if
      // audio has now been unlocked on iOS, Android, etc.
      var unlock = function(e) {
        // Create a pool of unlocked HTML5 Audio objects that can
        // be used for playing sounds without user interaction. HTML5
        // Audio objects must be individually unlocked, as opposed
        // to the WebAudio API which only needs a single activation.
        // This must occur before WebAudio setup or the source.onended
        // event will not fire.
        while (self._html5AudioPool.length < self.html5PoolSize) {
          try {
            var audioNode = new Audio();

            // Mark this Audio object as unlocked to ensure it can get returned
            // to the unlocked pool when released.
            audioNode._unlocked = true;

            // Add the audio node to the pool.
            self._releaseHtml5Audio(audioNode);
          } catch (e) {
            self.noAudio = true;
            break;
          }
        }

        // Loop through any assigned audio nodes and unlock them.
        for (var i=0; i<self._howls.length; i++) {
          if (!self._howls[i]._webAudio) {
            // Get all of the sounds in this Howl group.
            var ids = self._howls[i]._getSoundIds();

            // Loop through all sounds and unlock the audio nodes.
            for (var j=0; j<ids.length; j++) {
              var sound = self._howls[i]._soundById(ids[j]);

              if (sound && sound._node && !sound._node._unlocked) {
                sound._node._unlocked = true;
                sound._node.load();
              }
            }
          }
        }

        // Fix Android can not play in suspend state.
        self._autoResume();

        // Create an empty buffer.
        var source = self.ctx.createBufferSource();
        source.buffer = self._scratchBuffer;
        source.connect(self.ctx.destination);

        // Play the empty buffer.
        if (typeof source.start === 'undefined') {
          source.noteOn(0);
        } else {
          source.start(0);
        }

        // Calling resume() on a stack initiated by user gesture is what actually unlocks the audio on Android Chrome >= 55.
        if (typeof self.ctx.resume === 'function') {
          self.ctx.resume();
        }

        // Setup a timeout to check that we are unlocked on the next event loop.
        source.onended = function() {
          source.disconnect(0);

          // Update the unlocked state and prevent this check from happening again.
          self._audioUnlocked = true;

          // Remove the touch start listener.
          document.removeEventListener('touchstart', unlock, true);
          document.removeEventListener('touchend', unlock, true);
          document.removeEventListener('click', unlock, true);
          document.removeEventListener('keydown', unlock, true);

          // Let all sounds know that audio has been unlocked.
          for (var i=0; i<self._howls.length; i++) {
            self._howls[i]._emit('unlock');
          }
        };
      };

      // Setup a touch start listener to attempt an unlock in.
      document.addEventListener('touchstart', unlock, true);
      document.addEventListener('touchend', unlock, true);
      document.addEventListener('click', unlock, true);
      document.addEventListener('keydown', unlock, true);

      return self;
    },

    /**
     * Get an unlocked HTML5 Audio object from the pool. If none are left,
     * return a new Audio object and throw a warning.
     * @return {Audio} HTML5 Audio object.
     */
    _obtainHtml5Audio: function() {
      var self = this || Howler;

      // Return the next object from the pool if one exists.
      if (self._html5AudioPool.length) {
        return self._html5AudioPool.pop();
      }

      //.Check if the audio is locked and throw a warning.
      var testPlay = new Audio().play();
      if (testPlay && typeof Promise !== 'undefined' && (testPlay instanceof Promise || typeof testPlay.then === 'function')) {
        testPlay.catch(function() {
          console.warn('HTML5 Audio pool exhausted, returning potentially locked audio object.');
        });
      }

      return new Audio();
    },

    /**
     * Return an activated HTML5 Audio object to the pool.
     * @return {Howler}
     */
    _releaseHtml5Audio: function(audio) {
      var self = this || Howler;

      // Don't add audio to the pool if we don't know if it has been unlocked.
      if (audio._unlocked) {
        self._html5AudioPool.push(audio);
      }

      return self;
    },

    /**
     * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
     * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
     * @return {Howler}
     */
    _autoSuspend: function() {
      var self = this;

      if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      // Check if any sounds are playing.
      for (var i=0; i<self._howls.length; i++) {
        if (self._howls[i]._webAudio) {
          for (var j=0; j<self._howls[i]._sounds.length; j++) {
            if (!self._howls[i]._sounds[j]._paused) {
              return self;
            }
          }
        }
      }

      if (self._suspendTimer) {
        clearTimeout(self._suspendTimer);
      }

      // If no sound has played after 30 seconds, suspend the context.
      self._suspendTimer = setTimeout(function() {
        if (!self.autoSuspend) {
          return;
        }

        self._suspendTimer = null;
        self.state = 'suspending';

        // Handle updating the state of the audio context after suspending.
        var handleSuspension = function() {
          self.state = 'suspended';

          if (self._resumeAfterSuspend) {
            delete self._resumeAfterSuspend;
            self._autoResume();
          }
        };

        // Either the state gets suspended or it is interrupted.
        // Either way, we need to update the state to suspended.
        self.ctx.suspend().then(handleSuspension, handleSuspension);
      }, 30000);

      return self;
    },

    /**
     * Automatically resume the Web Audio AudioContext when a new sound is played.
     * @return {Howler}
     */
    _autoResume: function() {
      var self = this;

      if (!self.ctx || typeof self.ctx.resume === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      if (self.state === 'running' && self.ctx.state !== 'interrupted' && self._suspendTimer) {
        clearTimeout(self._suspendTimer);
        self._suspendTimer = null;
      } else if (self.state === 'suspended' || self.state === 'running' && self.ctx.state === 'interrupted') {
        self.ctx.resume().then(function() {
          self.state = 'running';

          // Emit to all Howls that the audio has resumed.
          for (var i=0; i<self._howls.length; i++) {
            self._howls[i]._emit('resume');
          }
        });

        if (self._suspendTimer) {
          clearTimeout(self._suspendTimer);
          self._suspendTimer = null;
        }
      } else if (self.state === 'suspending') {
        self._resumeAfterSuspend = true;
      }

      return self;
    }
  };

  // Setup the global audio controller.
  var Howler = new HowlerGlobal();

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Create an audio group controller.
   * @param {Object} o Passed in properties for this group.
   */
  var Howl = function(o) {
    var self = this;

    // Throw an error if no source is provided.
    if (!o.src || o.src.length === 0) {
      console.error('An array of source files must be passed with any new Howl.');
      return;
    }

    self.init(o);
  };
  Howl.prototype = {
    /**
     * Initialize a new Howl group object.
     * @param  {Object} o Passed in properties for this group.
     * @return {Howl}
     */
    init: function(o) {
      var self = this;

      // If we don't have an AudioContext created yet, run the setup.
      if (!Howler.ctx) {
        setupAudioContext();
      }

      // Setup user-defined default properties.
      self._autoplay = o.autoplay || false;
      self._format = (typeof o.format !== 'string') ? o.format : [o.format];
      self._html5 = o.html5 || false;
      self._muted = o.mute || false;
      self._loop = o.loop || false;
      self._pool = o.pool || 5;
      self._preload = (typeof o.preload === 'boolean' || o.preload === 'metadata') ? o.preload : true;
      self._rate = o.rate || 1;
      self._sprite = o.sprite || {};
      self._src = (typeof o.src !== 'string') ? o.src : [o.src];
      self._volume = o.volume !== undefined ? o.volume : 1;
      self._xhr = {
        method: o.xhr && o.xhr.method ? o.xhr.method : 'GET',
        headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
        withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false,
      };

      // Setup all other default properties.
      self._duration = 0;
      self._state = 'unloaded';
      self._sounds = [];
      self._endTimers = {};
      self._queue = [];
      self._playLock = false;

      // Setup event listeners.
      self._onend = o.onend ? [{fn: o.onend}] : [];
      self._onfade = o.onfade ? [{fn: o.onfade}] : [];
      self._onload = o.onload ? [{fn: o.onload}] : [];
      self._onloaderror = o.onloaderror ? [{fn: o.onloaderror}] : [];
      self._onplayerror = o.onplayerror ? [{fn: o.onplayerror}] : [];
      self._onpause = o.onpause ? [{fn: o.onpause}] : [];
      self._onplay = o.onplay ? [{fn: o.onplay}] : [];
      self._onstop = o.onstop ? [{fn: o.onstop}] : [];
      self._onmute = o.onmute ? [{fn: o.onmute}] : [];
      self._onvolume = o.onvolume ? [{fn: o.onvolume}] : [];
      self._onrate = o.onrate ? [{fn: o.onrate}] : [];
      self._onseek = o.onseek ? [{fn: o.onseek}] : [];
      self._onunlock = o.onunlock ? [{fn: o.onunlock}] : [];
      self._onresume = [];

      // Web Audio or HTML5 Audio?
      self._webAudio = Howler.usingWebAudio && !self._html5;

      // Automatically try to enable audio.
      if (typeof Howler.ctx !== 'undefined' && Howler.ctx && Howler.autoUnlock) {
        Howler._unlockAudio();
      }

      // Keep track of this Howl group in the global controller.
      Howler._howls.push(self);

      // If they selected autoplay, add a play event to the load queue.
      if (self._autoplay) {
        self._queue.push({
          event: 'play',
          action: function() {
            self.play();
          }
        });
      }

      // Load the source file unless otherwise specified.
      if (self._preload && self._preload !== 'none') {
        self.load();
      }

      return self;
    },

    /**
     * Load the audio file.
     * @return {Howler}
     */
    load: function() {
      var self = this;
      var url = null;

      // If no audio is available, quit immediately.
      if (Howler.noAudio) {
        self._emit('loaderror', null, 'No audio support.');
        return;
      }

      // Make sure our source is in an array.
      if (typeof self._src === 'string') {
        self._src = [self._src];
      }

      // Loop through the sources and pick the first one that is compatible.
      for (var i=0; i<self._src.length; i++) {
        var ext, str;

        if (self._format && self._format[i]) {
          // If an extension was specified, use that instead.
          ext = self._format[i];
        } else {
          // Make sure the source is a string.
          str = self._src[i];
          if (typeof str !== 'string') {
            self._emit('loaderror', null, 'Non-string found in selected audio sources - ignoring.');
            continue;
          }

          // Extract the file extension from the URL or base64 data URI.
          ext = /^data:audio\/([^;,]+);/i.exec(str);
          if (!ext) {
            ext = /\.([^.]+)$/.exec(str.split('?', 1)[0]);
          }

          if (ext) {
            ext = ext[1].toLowerCase();
          }
        }

        // Log a warning if no extension was found.
        if (!ext) {
          console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
        }

        // Check if this extension is available.
        if (ext && Howler.codecs(ext)) {
          url = self._src[i];
          break;
        }
      }

      if (!url) {
        self._emit('loaderror', null, 'No codec support for selected audio sources.');
        return;
      }

      self._src = url;
      self._state = 'loading';

      // If the hosting page is HTTPS and the source isn't,
      // drop down to HTML5 Audio to avoid Mixed Content errors.
      if (window.location.protocol === 'https:' && url.slice(0, 5) === 'http:') {
        self._html5 = true;
        self._webAudio = false;
      }

      // Create a new sound object and add it to the pool.
      new Sound(self);

      // Load and decode the audio data for playback.
      if (self._webAudio) {
        loadBuffer(self);
      }

      return self;
    },

    /**
     * Play a sound or resume previous playback.
     * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Number}          Sound ID.
     */
    play: function(sprite, internal) {
      var self = this;
      var id = null;

      // Determine if a sprite, sound id or nothing was passed
      if (typeof sprite === 'number') {
        id = sprite;
        sprite = null;
      } else if (typeof sprite === 'string' && self._state === 'loaded' && !self._sprite[sprite]) {
        // If the passed sprite doesn't exist, do nothing.
        return null;
      } else if (typeof sprite === 'undefined') {
        // Use the default sound sprite (plays the full audio length).
        sprite = '__default';

        // Check if there is a single paused sound that isn't ended.
        // If there is, play that sound. If not, continue as usual.
        if (!self._playLock) {
          var num = 0;
          for (var i=0; i<self._sounds.length; i++) {
            if (self._sounds[i]._paused && !self._sounds[i]._ended) {
              num++;
              id = self._sounds[i]._id;
            }
          }

          if (num === 1) {
            sprite = null;
          } else {
            id = null;
          }
        }
      }

      // Get the selected node, or get one from the pool.
      var sound = id ? self._soundById(id) : self._inactiveSound();

      // If the sound doesn't exist, do nothing.
      if (!sound) {
        return null;
      }

      // Select the sprite definition.
      if (id && !sprite) {
        sprite = sound._sprite || '__default';
      }

      // If the sound hasn't loaded, we must wait to get the audio's duration.
      // We also need to wait to make sure we don't run into race conditions with
      // the order of function calls.
      if (self._state !== 'loaded') {
        // Set the sprite value on this sound.
        sound._sprite = sprite;

        // Mark this sound as not ended in case another sound is played before this one loads.
        sound._ended = false;

        // Add the sound to the queue to be played on load.
        var soundId = sound._id;
        self._queue.push({
          event: 'play',
          action: function() {
            self.play(soundId);
          }
        });

        return soundId;
      }

      // Don't play the sound if an id was passed and it is already playing.
      if (id && !sound._paused) {
        // Trigger the play event, in order to keep iterating through queue.
        if (!internal) {
          self._loadQueue('play');
        }

        return sound._id;
      }

      // Make sure the AudioContext isn't suspended, and resume it if it is.
      if (self._webAudio) {
        Howler._autoResume();
      }

      // Determine how long to play for and where to start playing.
      var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1000);
      var duration = Math.max(0, ((self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000) - seek);
      var timeout = (duration * 1000) / Math.abs(sound._rate);
      var start = self._sprite[sprite][0] / 1000;
      var stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000;
      sound._sprite = sprite;

      // Mark the sound as ended instantly so that this async playback
      // doesn't get grabbed by another call to play while this one waits to start.
      sound._ended = false;

      // Update the parameters of the sound.
      var setParams = function() {
        sound._paused = false;
        sound._seek = seek;
        sound._start = start;
        sound._stop = stop;
        sound._loop = !!(sound._loop || self._sprite[sprite][2]);
      };

      // End the sound instantly if seek is at the end.
      if (seek >= stop) {
        self._ended(sound);
        return;
      }

      // Begin the actual playback.
      var node = sound._node;
      if (self._webAudio) {
        // Fire this when the sound is ready to play to begin Web Audio playback.
        var playWebAudio = function() {
          self._playLock = false;
          setParams();
          self._refreshBuffer(sound);

          // Setup the playback params.
          var vol = (sound._muted || self._muted) ? 0 : sound._volume;
          node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
          sound._playStart = Howler.ctx.currentTime;

          // Play the sound using the supported method.
          if (typeof node.bufferSource.start === 'undefined') {
            sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
          } else {
            sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
          }

          // Start a new timer if none is present.
          if (timeout !== Infinity) {
            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
          }

          if (!internal) {
            setTimeout(function() {
              self._emit('play', sound._id);
              self._loadQueue();
            }, 0);
          }
        };

        if (Howler.state === 'running' && Howler.ctx.state !== 'interrupted') {
          playWebAudio();
        } else {
          self._playLock = true;

          // Wait for the audio context to resume before playing.
          self.once('resume', playWebAudio);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      } else {
        // Fire this when the sound is ready to play to begin HTML5 Audio playback.
        var playHtml5 = function() {
          node.currentTime = seek;
          node.muted = sound._muted || self._muted || Howler._muted || node.muted;
          node.volume = sound._volume * Howler.volume();
          node.playbackRate = sound._rate;

          // Some browsers will throw an error if this is called without user interaction.
          try {
            var play = node.play();

            // Support older browsers that don't support promises, and thus don't have this issue.
            if (play && typeof Promise !== 'undefined' && (play instanceof Promise || typeof play.then === 'function')) {
              // Implements a lock to prevent DOMException: The play() request was interrupted by a call to pause().
              self._playLock = true;

              // Set param values immediately.
              setParams();

              // Releases the lock and executes queued actions.
              play
                .then(function() {
                  self._playLock = false;
                  node._unlocked = true;
                  if (!internal) {
                    self._emit('play', sound._id);
                  } else {
                    self._loadQueue();
                  }
                })
                .catch(function() {
                  self._playLock = false;
                  self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' +
                    'on mobile devices and Chrome where playback was not within a user interaction.');

                  // Reset the ended and paused values.
                  sound._ended = true;
                  sound._paused = true;
                });
            } else if (!internal) {
              self._playLock = false;
              setParams();
              self._emit('play', sound._id);
            }

            // Setting rate before playing won't work in IE, so we set it again here.
            node.playbackRate = sound._rate;

            // If the node is still paused, then we can assume there was a playback issue.
            if (node.paused) {
              self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' +
                'on mobile devices and Chrome where playback was not within a user interaction.');
              return;
            }

            // Setup the end timer on sprites or listen for the ended event.
            if (sprite !== '__default' || sound._loop) {
              self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
            } else {
              self._endTimers[sound._id] = function() {
                // Fire ended on this audio node.
                self._ended(sound);

                // Clear this listener.
                node.removeEventListener('ended', self._endTimers[sound._id], false);
              };
              node.addEventListener('ended', self._endTimers[sound._id], false);
            }
          } catch (err) {
            self._emit('playerror', sound._id, err);
          }
        };

        // If this is streaming audio, make sure the src is set and load again.
        if (node.src === 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA') {
          node.src = self._src;
          node.load();
        }

        // Play immediately if ready, or wait for the 'canplaythrough'e vent.
        var loadedNoReadyState = (window && window.ejecta) || (!node.readyState && Howler._navigator.isCocoonJS);
        if (node.readyState >= 3 || loadedNoReadyState) {
          playHtml5();
        } else {
          self._playLock = true;
          self._state = 'loading';

          var listener = function() {
            self._state = 'loaded';
            
            // Begin playback.
            playHtml5();

            // Clear this listener.
            node.removeEventListener(Howler._canPlayEvent, listener, false);
          };
          node.addEventListener(Howler._canPlayEvent, listener, false);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      }

      return sound._id;
    },

    /**
     * Pause playback and save current position.
     * @param  {Number} id The sound ID (empty to pause all in group).
     * @return {Howl}
     */
    pause: function(id) {
      var self = this;

      // If the sound hasn't loaded or a play() promise is pending, add it to the load queue to pause when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'pause',
          action: function() {
            self.pause(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be paused.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound && !sound._paused) {
          // Reset the seek position.
          sound._seek = self.seek(ids[i]);
          sound._rateSeek = 0;
          sound._paused = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound has been created.
              if (!sound._node.bufferSource) {
                continue;
              }

              if (typeof sound._node.bufferSource.stop === 'undefined') {
                sound._node.bufferSource.noteOff(0);
              } else {
                sound._node.bufferSource.stop(0);
              }

              // Clean up the buffer source.
              self._cleanBuffer(sound._node);
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.pause();
            }
          }
        }

        // Fire the pause event, unless `true` is passed as the 2nd argument.
        if (!arguments[1]) {
          self._emit('pause', sound ? sound._id : null);
        }
      }

      return self;
    },

    /**
     * Stop playback and reset to start.
     * @param  {Number} id The sound ID (empty to stop all in group).
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Howl}
     */
    stop: function(id, internal) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to stop when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'stop',
          action: function() {
            self.stop(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be stopped.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          // Reset the seek position.
          sound._seek = sound._start || 0;
          sound._rateSeek = 0;
          sound._paused = true;
          sound._ended = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound's AudioBufferSourceNode has been created.
              if (sound._node.bufferSource) {
                if (typeof sound._node.bufferSource.stop === 'undefined') {
                  sound._node.bufferSource.noteOff(0);
                } else {
                  sound._node.bufferSource.stop(0);
                }

                // Clean up the buffer source.
                self._cleanBuffer(sound._node);
              }
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.currentTime = sound._start || 0;
              sound._node.pause();

              // If this is a live stream, stop download once the audio is stopped.
              if (sound._node.duration === Infinity) {
                self._clearSound(sound._node);
              }
            }
          }

          if (!internal) {
            self._emit('stop', sound._id);
          }
        }
      }

      return self;
    },

    /**
     * Mute/unmute a single sound or all sounds in this Howl group.
     * @param  {Boolean} muted Set to true to mute and false to unmute.
     * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
     * @return {Howl}
     */
    mute: function(muted, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to mute when capable.
      if (self._state !== 'loaded'|| self._playLock) {
        self._queue.push({
          event: 'mute',
          action: function() {
            self.mute(muted, id);
          }
        });

        return self;
      }

      // If applying mute/unmute to all sounds, update the group's value.
      if (typeof id === 'undefined') {
        if (typeof muted === 'boolean') {
          self._muted = muted;
        } else {
          return self._muted;
        }
      }

      // If no id is passed, get all ID's to be muted.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          sound._muted = muted;

          // Cancel active fade and set the volume to the end value.
          if (sound._interval) {
            self._stopFade(sound._id);
          }

          if (self._webAudio && sound._node) {
            sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler.ctx.currentTime);
          } else if (sound._node) {
            sound._node.muted = Howler._muted ? true : muted;
          }

          self._emit('mute', sound._id);
        }
      }

      return self;
    },

    /**
     * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
     *   volume() -> Returns the group's volume value.
     *   volume(id) -> Returns the sound id's current volume.
     *   volume(vol) -> Sets the volume of all sounds in this Howl group.
     *   volume(vol, id) -> Sets the volume of passed sound id.
     * @return {Howl/Number} Returns self or current volume.
     */
    volume: function() {
      var self = this;
      var args = arguments;
      var vol, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // Return the value of the groups' volume.
        return self._volume;
      } else if (args.length === 1 || args.length === 2 && typeof args[1] === 'undefined') {
        // First check if this is an ID, and if not, assume it is a new volume.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          vol = parseFloat(args[0]);
        }
      } else if (args.length >= 2) {
        vol = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the volume or return the current volume.
      var sound;
      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        // If the sound hasn't loaded, add it to the load queue to change volume when capable.
        if (self._state !== 'loaded'|| self._playLock) {
          self._queue.push({
            event: 'volume',
            action: function() {
              self.volume.apply(self, args);
            }
          });

          return self;
        }

        // Set the group volume.
        if (typeof id === 'undefined') {
          self._volume = vol;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            sound._volume = vol;

            // Stop currently running fades.
            if (!args[2]) {
              self._stopFade(id[i]);
            }

            if (self._webAudio && sound._node && !sound._muted) {
              sound._node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
            } else if (sound._node && !sound._muted) {
              sound._node.volume = vol * Howler.volume();
            }

            self._emit('volume', sound._id);
          }
        }
      } else {
        sound = id ? self._soundById(id) : self._sounds[0];
        return sound ? sound._volume : 0;
      }

      return self;
    },

    /**
     * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id (omit to fade all sounds).
     * @return {Howl}
     */
    fade: function(from, to, len, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to fade when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'fade',
          action: function() {
            self.fade(from, to, len, id);
          }
        });

        return self;
      }

      // Make sure the to/from/len values are numbers.
      from = Math.min(Math.max(0, parseFloat(from)), 1);
      to = Math.min(Math.max(0, parseFloat(to)), 1);
      len = parseFloat(len);

      // Set the volume to the start position.
      self.volume(from, id);

      // Fade the volume of one or all sounds.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        // Create a linear fade or fall back to timeouts with HTML5 Audio.
        if (sound) {
          // Stop the previous fade if no sprite is being used (otherwise, volume handles this).
          if (!id) {
            self._stopFade(ids[i]);
          }

          // If we are using Web Audio, let the native methods do the actual fade.
          if (self._webAudio && !sound._muted) {
            var currentTime = Howler.ctx.currentTime;
            var end = currentTime + (len / 1000);
            sound._volume = from;
            sound._node.gain.setValueAtTime(from, currentTime);
            sound._node.gain.linearRampToValueAtTime(to, end);
          }

          self._startFadeInterval(sound, from, to, len, ids[i], typeof id === 'undefined');
        }
      }

      return self;
    },

    /**
     * Starts the internal interval to fade a sound.
     * @param  {Object} sound Reference to sound to fade.
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id to fade.
     * @param  {Boolean} isGroup   If true, set the volume on the group.
     */
    _startFadeInterval: function(sound, from, to, len, id, isGroup) {
      var self = this;
      var vol = from;
      var diff = to - from;
      var steps = Math.abs(diff / 0.01);
      var stepLen = Math.max(4, (steps > 0) ? len / steps : len);
      var lastTick = Date.now();

      // Store the value being faded to.
      sound._fadeTo = to;

      // Update the volume value on each interval tick.
      sound._interval = setInterval(function() {
        // Update the volume based on the time since the last tick.
        var tick = (Date.now() - lastTick) / len;
        lastTick = Date.now();
        vol += diff * tick;

        // Round to within 2 decimal points.
        vol = Math.round(vol * 100) / 100;

        // Make sure the volume is in the right bounds.
        if (diff < 0) {
          vol = Math.max(to, vol);
        } else {
          vol = Math.min(to, vol);
        }

        // Change the volume.
        if (self._webAudio) {
          sound._volume = vol;
        } else {
          self.volume(vol, sound._id, true);
        }

        // Set the group's volume.
        if (isGroup) {
          self._volume = vol;
        }

        // When the fade is complete, stop it and fire event.
        if ((to < from && vol <= to) || (to > from && vol >= to)) {
          clearInterval(sound._interval);
          sound._interval = null;
          sound._fadeTo = null;
          self.volume(to, sound._id);
          self._emit('fade', sound._id);
        }
      }, stepLen);
    },

    /**
     * Internal method that stops the currently playing fade when
     * a new fade starts, volume is changed or the sound is stopped.
     * @param  {Number} id The sound id.
     * @return {Howl}
     */
    _stopFade: function(id) {
      var self = this;
      var sound = self._soundById(id);

      if (sound && sound._interval) {
        if (self._webAudio) {
          sound._node.gain.cancelScheduledValues(Howler.ctx.currentTime);
        }

        clearInterval(sound._interval);
        sound._interval = null;
        self.volume(sound._fadeTo, id);
        sound._fadeTo = null;
        self._emit('fade', id);
      }

      return self;
    },

    /**
     * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
     *   loop() -> Returns the group's loop value.
     *   loop(id) -> Returns the sound id's loop value.
     *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
     *   loop(loop, id) -> Sets the loop value of passed sound id.
     * @return {Howl/Boolean} Returns self or current loop value.
     */
    loop: function() {
      var self = this;
      var args = arguments;
      var loop, id, sound;

      // Determine the values for loop and id.
      if (args.length === 0) {
        // Return the grou's loop value.
        return self._loop;
      } else if (args.length === 1) {
        if (typeof args[0] === 'boolean') {
          loop = args[0];
          self._loop = loop;
        } else {
          // Return this sound's loop value.
          sound = self._soundById(parseInt(args[0], 10));
          return sound ? sound._loop : false;
        }
      } else if (args.length === 2) {
        loop = args[0];
        id = parseInt(args[1], 10);
      }

      // If no id is passed, get all ID's to be looped.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        sound = self._soundById(ids[i]);

        if (sound) {
          sound._loop = loop;
          if (self._webAudio && sound._node && sound._node.bufferSource) {
            sound._node.bufferSource.loop = loop;
            if (loop) {
              sound._node.bufferSource.loopStart = sound._start || 0;
              sound._node.bufferSource.loopEnd = sound._stop;

              // If playing, restart playback to ensure looping updates.
              if (self.playing(ids[i])) {
                self.pause(ids[i], true);
                self.play(ids[i], true);
              }
            }
          }
        }
      }

      return self;
    },

    /**
     * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   rate() -> Returns the first sound node's current playback rate.
     *   rate(id) -> Returns the sound id's current playback rate.
     *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
     *   rate(rate, id) -> Sets the playback rate of passed sound id.
     * @return {Howl/Number} Returns self or the current playback rate.
     */
    rate: function() {
      var self = this;
      var args = arguments;
      var rate, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current rate of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new rate value.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          rate = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        rate = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the playback rate or return the current value.
      var sound;
      if (typeof rate === 'number') {
        // If the sound hasn't loaded, add it to the load queue to change playback rate when capable.
        if (self._state !== 'loaded' || self._playLock) {
          self._queue.push({
            event: 'rate',
            action: function() {
              self.rate.apply(self, args);
            }
          });

          return self;
        }

        // Set the group rate.
        if (typeof id === 'undefined') {
          self._rate = rate;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            // Keep track of our position when the rate changed and update the playback
            // start position so we can properly adjust the seek position for time elapsed.
            if (self.playing(id[i])) {
              sound._rateSeek = self.seek(id[i]);
              sound._playStart = self._webAudio ? Howler.ctx.currentTime : sound._playStart;
            }
            sound._rate = rate;

            // Change the playback rate.
            if (self._webAudio && sound._node && sound._node.bufferSource) {
              sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler.ctx.currentTime);
            } else if (sound._node) {
              sound._node.playbackRate = rate;
            }

            // Reset the timers.
            var seek = self.seek(id[i]);
            var duration = ((self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1000) - seek;
            var timeout = (duration * 1000) / Math.abs(sound._rate);

            // Start a new end timer if sound is already playing.
            if (self._endTimers[id[i]] || !sound._paused) {
              self._clearTimer(id[i]);
              self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
            }

            self._emit('rate', sound._id);
          }
        }
      } else {
        sound = self._soundById(id);
        return sound ? sound._rate : self._rate;
      }

      return self;
    },

    /**
     * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   seek() -> Returns the first sound node's current seek position.
     *   seek(id) -> Returns the sound id's current seek position.
     *   seek(seek) -> Sets the seek position of the first sound node.
     *   seek(seek, id) -> Sets the seek position of passed sound id.
     * @return {Howl/Number} Returns self or the current seek position.
     */
    seek: function() {
      var self = this;
      var args = arguments;
      var seek, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current position of the first node.
        if (self._sounds.length) {
          id = self._sounds[0]._id;
        }
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new seek position.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else if (self._sounds.length) {
          id = self._sounds[0]._id;
          seek = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        seek = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // If there is no ID, bail out.
      if (typeof id === 'undefined') {
        return 0;
      }

      // If the sound hasn't loaded, add it to the load queue to seek when capable.
      if (typeof seek === 'number' && (self._state !== 'loaded' || self._playLock)) {
        self._queue.push({
          event: 'seek',
          action: function() {
            self.seek.apply(self, args);
          }
        });

        return self;
      }

      // Get the sound.
      var sound = self._soundById(id);

      if (sound) {
        if (typeof seek === 'number' && seek >= 0) {
          // Pause the sound and update position for restarting playback.
          var playing = self.playing(id);
          if (playing) {
            self.pause(id, true);
          }

          // Move the position of the track and cancel timer.
          sound._seek = seek;
          sound._ended = false;
          self._clearTimer(id);

          // Update the seek position for HTML5 Audio.
          if (!self._webAudio && sound._node && !isNaN(sound._node.duration)) {
            sound._node.currentTime = seek;
          }

          // Seek and emit when ready.
          var seekAndEmit = function() {
            // Restart the playback if the sound was playing.
            if (playing) {
              self.play(id, true);
            }

            self._emit('seek', id);
          };

          // Wait for the play lock to be unset before emitting (HTML5 Audio).
          if (playing && !self._webAudio) {
            var emitSeek = function() {
              if (!self._playLock) {
                seekAndEmit();
              } else {
                setTimeout(emitSeek, 0);
              }
            };
            setTimeout(emitSeek, 0);
          } else {
            seekAndEmit();
          }
        } else {
          if (self._webAudio) {
            var realTime = self.playing(id) ? Howler.ctx.currentTime - sound._playStart : 0;
            var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
            return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
          } else {
            return sound._node.currentTime;
          }
        }
      }

      return self;
    },

    /**
     * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
     * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
     * @return {Boolean} True if playing and false if not.
     */
    playing: function(id) {
      var self = this;

      // Check the passed sound ID (if any).
      if (typeof id === 'number') {
        var sound = self._soundById(id);
        return sound ? !sound._paused : false;
      }

      // Otherwise, loop through all sounds and check if any are playing.
      for (var i=0; i<self._sounds.length; i++) {
        if (!self._sounds[i]._paused) {
          return true;
        }
      }

      return false;
    },

    /**
     * Get the duration of this sound. Passing a sound id will return the sprite duration.
     * @param  {Number} id The sound id to check. If none is passed, return full source duration.
     * @return {Number} Audio duration in seconds.
     */
    duration: function(id) {
      var self = this;
      var duration = self._duration;

      // If we pass an ID, get the sound and return the sprite length.
      var sound = self._soundById(id);
      if (sound) {
        duration = self._sprite[sound._sprite][1] / 1000;
      }

      return duration;
    },

    /**
     * Returns the current loaded state of this Howl.
     * @return {String} 'unloaded', 'loading', 'loaded'
     */
    state: function() {
      return this._state;
    },

    /**
     * Unload and destroy the current Howl object.
     * This will immediately stop all sound instances attached to this group.
     */
    unload: function() {
      var self = this;

      // Stop playing any active sounds.
      var sounds = self._sounds;
      for (var i=0; i<sounds.length; i++) {
        // Stop the sound if it is currently playing.
        if (!sounds[i]._paused) {
          self.stop(sounds[i]._id);
        }

        // Remove the source or disconnect.
        if (!self._webAudio) {
          // Set the source to 0-second silence to stop any downloading (except in IE).
          self._clearSound(sounds[i]._node);

          // Remove any event listeners.
          sounds[i]._node.removeEventListener('error', sounds[i]._errorFn, false);
          sounds[i]._node.removeEventListener(Howler._canPlayEvent, sounds[i]._loadFn, false);
          sounds[i]._node.removeEventListener('ended', sounds[i]._endFn, false);

          // Release the Audio object back to the pool.
          Howler._releaseHtml5Audio(sounds[i]._node);
        }

        // Empty out all of the nodes.
        delete sounds[i]._node;

        // Make sure all timers are cleared out.
        self._clearTimer(sounds[i]._id);
      }

      // Remove the references in the global Howler object.
      var index = Howler._howls.indexOf(self);
      if (index >= 0) {
        Howler._howls.splice(index, 1);
      }

      // Delete this sound from the cache (if no other Howl is using it).
      var remCache = true;
      for (i=0; i<Howler._howls.length; i++) {
        if (Howler._howls[i]._src === self._src || self._src.indexOf(Howler._howls[i]._src) >= 0) {
          remCache = false;
          break;
        }
      }

      if (cache && remCache) {
        delete cache[self._src];
      }

      // Clear global errors.
      Howler.noAudio = false;

      // Clear out `self`.
      self._state = 'unloaded';
      self._sounds = [];
      self = null;

      return null;
    },

    /**
     * Listen to a custom event.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
     * @return {Howl}
     */
    on: function(event, fn, id, once) {
      var self = this;
      var events = self['_on' + event];

      if (typeof fn === 'function') {
        events.push(once ? {id: id, fn: fn, once: once} : {id: id, fn: fn});
      }

      return self;
    },

    /**
     * Remove a custom event. Call without parameters to remove all events.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to remove. Leave empty to remove all.
     * @param  {Number}   id    (optional) Only remove events for this sound.
     * @return {Howl}
     */
    off: function(event, fn, id) {
      var self = this;
      var events = self['_on' + event];
      var i = 0;

      // Allow passing just an event and ID.
      if (typeof fn === 'number') {
        id = fn;
        fn = null;
      }

      if (fn || id) {
        // Loop through event store and remove the passed function.
        for (i=0; i<events.length; i++) {
          var isId = (id === events[i].id);
          if (fn === events[i].fn && isId || !fn && isId) {
            events.splice(i, 1);
            break;
          }
        }
      } else if (event) {
        // Clear out all events of this type.
        self['_on' + event] = [];
      } else {
        // Clear out all events of every type.
        var keys = Object.keys(self);
        for (i=0; i<keys.length; i++) {
          if ((keys[i].indexOf('_on') === 0) && Array.isArray(self[keys[i]])) {
            self[keys[i]] = [];
          }
        }
      }

      return self;
    },

    /**
     * Listen to a custom event and remove it once fired.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @return {Howl}
     */
    once: function(event, fn, id) {
      var self = this;

      // Setup the event listener.
      self.on(event, fn, id, 1);

      return self;
    },

    /**
     * Emit all events of a specific type and pass the sound id.
     * @param  {String} event Event name.
     * @param  {Number} id    Sound ID.
     * @param  {Number} msg   Message to go with event.
     * @return {Howl}
     */
    _emit: function(event, id, msg) {
      var self = this;
      var events = self['_on' + event];

      // Loop through event store and fire all functions.
      for (var i=events.length-1; i>=0; i--) {
        // Only fire the listener if the correct ID is used.
        if (!events[i].id || events[i].id === id || event === 'load') {
          setTimeout(function(fn) {
            fn.call(this, id, msg);
          }.bind(self, events[i].fn), 0);

          // If this event was setup with `once`, remove it.
          if (events[i].once) {
            self.off(event, events[i].fn, events[i].id);
          }
        }
      }

      // Pass the event type into load queue so that it can continue stepping.
      self._loadQueue(event);

      return self;
    },

    /**
     * Queue of actions initiated before the sound has loaded.
     * These will be called in sequence, with the next only firing
     * after the previous has finished executing (even if async like play).
     * @return {Howl}
     */
    _loadQueue: function(event) {
      var self = this;

      if (self._queue.length > 0) {
        var task = self._queue[0];

        // Remove this task if a matching event was passed.
        if (task.event === event) {
          self._queue.shift();
          self._loadQueue();
        }

        // Run the task if no event type is passed.
        if (!event) {
          task.action();
        }
      }

      return self;
    },

    /**
     * Fired when playback ends at the end of the duration.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _ended: function(sound) {
      var self = this;
      var sprite = sound._sprite;

      // If we are using IE and there was network latency we may be clipping
      // audio before it completes playing. Lets check the node to make sure it
      // believes it has completed, before ending the playback.
      if (!self._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
        setTimeout(self._ended.bind(self, sound), 100);
        return self;
      }

      // Should this sound loop?
      var loop = !!(sound._loop || self._sprite[sprite][2]);

      // Fire the ended event.
      self._emit('end', sound._id);

      // Restart the playback for HTML5 Audio loop.
      if (!self._webAudio && loop) {
        self.stop(sound._id, true).play(sound._id);
      }

      // Restart this timer if on a Web Audio loop.
      if (self._webAudio && loop) {
        self._emit('play', sound._id);
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        sound._playStart = Howler.ctx.currentTime;

        var timeout = ((sound._stop - sound._start) * 1000) / Math.abs(sound._rate);
        self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
      }

      // Mark the node as paused.
      if (self._webAudio && !loop) {
        sound._paused = true;
        sound._ended = true;
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        self._clearTimer(sound._id);

        // Clean up the buffer source.
        self._cleanBuffer(sound._node);

        // Attempt to auto-suspend AudioContext if no sounds are still playing.
        Howler._autoSuspend();
      }

      // When using a sprite, end the track.
      if (!self._webAudio && !loop) {
        self.stop(sound._id, true);
      }

      return self;
    },

    /**
     * Clear the end timer for a sound playback.
     * @param  {Number} id The sound ID.
     * @return {Howl}
     */
    _clearTimer: function(id) {
      var self = this;

      if (self._endTimers[id]) {
        // Clear the timeout or remove the ended listener.
        if (typeof self._endTimers[id] !== 'function') {
          clearTimeout(self._endTimers[id]);
        } else {
          var sound = self._soundById(id);
          if (sound && sound._node) {
            sound._node.removeEventListener('ended', self._endTimers[id], false);
          }
        }

        delete self._endTimers[id];
      }

      return self;
    },

    /**
     * Return the sound identified by this ID, or return null.
     * @param  {Number} id Sound ID
     * @return {Object}    Sound object or null.
     */
    _soundById: function(id) {
      var self = this;

      // Loop through all sounds and find the one with this ID.
      for (var i=0; i<self._sounds.length; i++) {
        if (id === self._sounds[i]._id) {
          return self._sounds[i];
        }
      }

      return null;
    },

    /**
     * Return an inactive sound from the pool or create a new one.
     * @return {Sound} Sound playback object.
     */
    _inactiveSound: function() {
      var self = this;

      self._drain();

      // Find the first inactive node to recycle.
      for (var i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          return self._sounds[i].reset();
        }
      }

      // If no inactive node was found, create a new one.
      return new Sound(self);
    },

    /**
     * Drain excess inactive sounds from the pool.
     */
    _drain: function() {
      var self = this;
      var limit = self._pool;
      var cnt = 0;
      var i = 0;

      // If there are less sounds than the max pool size, we are done.
      if (self._sounds.length < limit) {
        return;
      }

      // Count the number of inactive sounds.
      for (i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          cnt++;
        }
      }

      // Remove excess inactive sounds, going in reverse order.
      for (i=self._sounds.length - 1; i>=0; i--) {
        if (cnt <= limit) {
          return;
        }

        if (self._sounds[i]._ended) {
          // Disconnect the audio source when using Web Audio.
          if (self._webAudio && self._sounds[i]._node) {
            self._sounds[i]._node.disconnect(0);
          }

          // Remove sounds until we have the pool size.
          self._sounds.splice(i, 1);
          cnt--;
        }
      }
    },

    /**
     * Get all ID's from the sounds pool.
     * @param  {Number} id Only return one ID if one is passed.
     * @return {Array}    Array of IDs.
     */
    _getSoundIds: function(id) {
      var self = this;

      if (typeof id === 'undefined') {
        var ids = [];
        for (var i=0; i<self._sounds.length; i++) {
          ids.push(self._sounds[i]._id);
        }

        return ids;
      } else {
        return [id];
      }
    },

    /**
     * Load the sound back into the buffer source.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _refreshBuffer: function(sound) {
      var self = this;

      // Setup the buffer source for playback.
      sound._node.bufferSource = Howler.ctx.createBufferSource();
      sound._node.bufferSource.buffer = cache[self._src];

      // Connect to the correct node.
      if (sound._panner) {
        sound._node.bufferSource.connect(sound._panner);
      } else {
        sound._node.bufferSource.connect(sound._node);
      }

      // Setup looping and playback rate.
      sound._node.bufferSource.loop = sound._loop;
      if (sound._loop) {
        sound._node.bufferSource.loopStart = sound._start || 0;
        sound._node.bufferSource.loopEnd = sound._stop || 0;
      }
      sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler.ctx.currentTime);

      return self;
    },

    /**
     * Prevent memory leaks by cleaning up the buffer source after playback.
     * @param  {Object} node Sound's audio node containing the buffer source.
     * @return {Howl}
     */
    _cleanBuffer: function(node) {
      var self = this;
      var isIOS = Howler._navigator && Howler._navigator.vendor.indexOf('Apple') >= 0;

      if (!node.bufferSource) {
        return self;
      }

      if (Howler._scratchBuffer && node.bufferSource) {
        node.bufferSource.onended = null;
        node.bufferSource.disconnect(0);
        if (isIOS) {
          try { node.bufferSource.buffer = Howler._scratchBuffer; } catch(e) {}
        }
      }
      node.bufferSource = null;

      return self;
    },

    /**
     * Set the source to a 0-second silence to stop any downloading (except in IE).
     * @param  {Object} node Audio node to clear.
     */
    _clearSound: function(node) {
      var checkIE = /MSIE |Trident\//.test(Howler._navigator && Howler._navigator.userAgent);
      if (!checkIE) {
        node.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      }
    }
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Setup the sound object, which each node attached to a Howl group is contained in.
   * @param {Object} howl The Howl parent group.
   */
  var Sound = function(howl) {
    this._parent = howl;
    this.init();
  };
  Sound.prototype = {
    /**
     * Initialize a new Sound object.
     * @return {Sound}
     */
    init: function() {
      var self = this;
      var parent = self._parent;

      // Setup the default parameters.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a unique ID for this sound.
      self._id = ++Howler._counter;

      // Add itself to the parent's pool.
      parent._sounds.push(self);

      // Create the new node.
      self.create();

      return self;
    },

    /**
     * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
     * @return {Sound}
     */
    create: function() {
      var self = this;
      var parent = self._parent;
      var volume = (Howler._muted || self._muted || self._parent._muted) ? 0 : self._volume;

      if (parent._webAudio) {
        // Create the gain node for controlling volume (the source will connect to this).
        self._node = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
        self._node.gain.setValueAtTime(volume, Howler.ctx.currentTime);
        self._node.paused = true;
        self._node.connect(Howler.masterGain);
      } else if (!Howler.noAudio) {
        // Get an unlocked Audio object from the pool.
        self._node = Howler._obtainHtml5Audio();

        // Listen for errors (http://dev.w3.org/html5/spec-author-view/spec.html#mediaerror).
        self._errorFn = self._errorListener.bind(self);
        self._node.addEventListener('error', self._errorFn, false);

        // Listen for 'canplaythrough' event to let us know the sound is ready.
        self._loadFn = self._loadListener.bind(self);
        self._node.addEventListener(Howler._canPlayEvent, self._loadFn, false);

        // Listen for the 'ended' event on the sound to account for edge-case where
        // a finite sound has a duration of Infinity.
        self._endFn = self._endListener.bind(self);
        self._node.addEventListener('ended', self._endFn, false);

        // Setup the new audio node.
        self._node.src = parent._src;
        self._node.preload = parent._preload === true ? 'auto' : parent._preload;
        self._node.volume = volume * Howler.volume();

        // Begin loading the source.
        self._node.load();
      }

      return self;
    },

    /**
     * Reset the parameters of this sound to the original state (for recycle).
     * @return {Sound}
     */
    reset: function() {
      var self = this;
      var parent = self._parent;

      // Reset all of the parameters of this sound.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._rateSeek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a new ID so that it isn't confused with the previous sound.
      self._id = ++Howler._counter;

      return self;
    },

    /**
     * HTML5 Audio error listener callback.
     */
    _errorListener: function() {
      var self = this;

      // Fire an error event and pass back the code.
      self._parent._emit('loaderror', self._id, self._node.error ? self._node.error.code : 0);

      // Clear the event listener.
      self._node.removeEventListener('error', self._errorFn, false);
    },

    /**
     * HTML5 Audio canplaythrough listener callback.
     */
    _loadListener: function() {
      var self = this;
      var parent = self._parent;

      // Round up the duration to account for the lower precision in HTML5 Audio.
      parent._duration = Math.ceil(self._node.duration * 10) / 10;

      // Setup a sprite if none is defined.
      if (Object.keys(parent._sprite).length === 0) {
        parent._sprite = {__default: [0, parent._duration * 1000]};
      }

      if (parent._state !== 'loaded') {
        parent._state = 'loaded';
        parent._emit('load');
        parent._loadQueue();
      }

      // Clear the event listener.
      self._node.removeEventListener(Howler._canPlayEvent, self._loadFn, false);
    },

    /**
     * HTML5 Audio ended listener callback.
     */
    _endListener: function() {
      var self = this;
      var parent = self._parent;

      // Only handle the `ended`` event if the duration is Infinity.
      if (parent._duration === Infinity) {
        // Update the parent duration to match the real audio duration.
        // Round up the duration to account for the lower precision in HTML5 Audio.
        parent._duration = Math.ceil(self._node.duration * 10) / 10;

        // Update the sprite that corresponds to the real duration.
        if (parent._sprite.__default[1] === Infinity) {
          parent._sprite.__default[1] = parent._duration * 1000;
        }

        // Run the regular ended method.
        parent._ended(self);
      }

      // Clear the event listener since the duration is now correct.
      self._node.removeEventListener('ended', self._endFn, false);
    }
  };

  /** Helper Methods **/
  /***************************************************************************/

  var cache = {};

  /**
   * Buffer a sound from URL, Data URI or cache and decode to audio source (Web Audio API).
   * @param  {Howl} self
   */
  var loadBuffer = function(self) {
    var url = self._src;

    // Check if the buffer has already been cached and use it instead.
    if (cache[url]) {
      // Set the duration from the cache.
      self._duration = cache[url].duration;

      // Load the sound into this Howl.
      loadSound(self);

      return;
    }

    if (/^data:[^;]+;base64,/.test(url)) {
      // Decode the base64 data URI without XHR, since some browsers don't support it.
      var data = atob(url.split(',')[1]);
      var dataView = new Uint8Array(data.length);
      for (var i=0; i<data.length; ++i) {
        dataView[i] = data.charCodeAt(i);
      }

      decodeAudioData(dataView.buffer, self);
    } else {
      // Load the buffer from the URL.
      var xhr = new XMLHttpRequest();
      xhr.open(self._xhr.method, url, true);
      xhr.withCredentials = self._xhr.withCredentials;
      xhr.responseType = 'arraybuffer';

      // Apply any custom headers to the request.
      if (self._xhr.headers) {
        Object.keys(self._xhr.headers).forEach(function(key) {
          xhr.setRequestHeader(key, self._xhr.headers[key]);
        });
      }

      xhr.onload = function() {
        // Make sure we get a successful response back.
        var code = (xhr.status + '')[0];
        if (code !== '0' && code !== '2' && code !== '3') {
          self._emit('loaderror', null, 'Failed loading audio file with status: ' + xhr.status + '.');
          return;
        }

        decodeAudioData(xhr.response, self);
      };
      xhr.onerror = function() {
        // If there is an error, switch to HTML5 Audio.
        if (self._webAudio) {
          self._html5 = true;
          self._webAudio = false;
          self._sounds = [];
          delete cache[url];
          self.load();
        }
      };
      safeXhrSend(xhr);
    }
  };

  /**
   * Send the XHR request wrapped in a try/catch.
   * @param  {Object} xhr XHR to send.
   */
  var safeXhrSend = function(xhr) {
    try {
      xhr.send();
    } catch (e) {
      xhr.onerror();
    }
  };

  /**
   * Decode audio data from an array buffer.
   * @param  {ArrayBuffer} arraybuffer The audio data.
   * @param  {Howl}        self
   */
  var decodeAudioData = function(arraybuffer, self) {
    // Fire a load error if something broke.
    var error = function() {
      self._emit('loaderror', null, 'Decoding audio data failed.');
    };

    // Load the sound on success.
    var success = function(buffer) {
      if (buffer && self._sounds.length > 0) {
        cache[self._src] = buffer;
        loadSound(self, buffer);
      } else {
        error();
      }
    };

    // Decode the buffer into an audio source.
    if (typeof Promise !== 'undefined' && Howler.ctx.decodeAudioData.length === 1) {
      Howler.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
    } else {
      Howler.ctx.decodeAudioData(arraybuffer, success, error);
    }
  }

  /**
   * Sound is now loaded, so finish setting everything up and fire the loaded event.
   * @param  {Howl} self
   * @param  {Object} buffer The decoded buffer sound source.
   */
  var loadSound = function(self, buffer) {
    // Set the duration.
    if (buffer && !self._duration) {
      self._duration = buffer.duration;
    }

    // Setup a sprite if none is defined.
    if (Object.keys(self._sprite).length === 0) {
      self._sprite = {__default: [0, self._duration * 1000]};
    }

    // Fire the loaded event.
    if (self._state !== 'loaded') {
      self._state = 'loaded';
      self._emit('load');
      self._loadQueue();
    }
  };

  /**
   * Setup the audio context when available, or switch to HTML5 Audio mode.
   */
  var setupAudioContext = function() {
    // If we have already detected that Web Audio isn't supported, don't run this step again.
    if (!Howler.usingWebAudio) {
      return;
    }

    // Check if we are using Web Audio and setup the AudioContext if we are.
    try {
      if (typeof AudioContext !== 'undefined') {
        Howler.ctx = new AudioContext();
      } else if (typeof webkitAudioContext !== 'undefined') {
        Howler.ctx = new webkitAudioContext();
      } else {
        Howler.usingWebAudio = false;
      }
    } catch(e) {
      Howler.usingWebAudio = false;
    }

    // If the audio context creation still failed, set using web audio to false.
    if (!Howler.ctx) {
      Howler.usingWebAudio = false;
    }

    // Check if a webview is being used on iOS8 or earlier (rather than the browser).
    // If it is, disable Web Audio as it causes crashing.
    var iOS = (/iP(hone|od|ad)/.test(Howler._navigator && Howler._navigator.platform));
    var appVersion = Howler._navigator && Howler._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    var version = appVersion ? parseInt(appVersion[1], 10) : null;
    if (iOS && version && version < 9) {
      var safari = /safari/.test(Howler._navigator && Howler._navigator.userAgent.toLowerCase());
      if (Howler._navigator && !safari) {
        Howler.usingWebAudio = false;
      }
    }

    // Create and expose the master GainNode when using Web Audio (useful for plugins or advanced usage).
    if (Howler.usingWebAudio) {
      Howler.masterGain = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
      Howler.masterGain.gain.setValueAtTime(Howler._muted ? 0 : Howler._volume, Howler.ctx.currentTime);
      Howler.masterGain.connect(Howler.ctx.destination);
    }

    // Re-run the setup on Howler.
    Howler._setup();
  };

  // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return {
        Howler: Howler,
        Howl: Howl
      };
    });
  }

  // Add support for CommonJS libraries such as browserify.
  if (typeof exports !== 'undefined') {
    exports.Howler = Howler;
    exports.Howl = Howl;
  }

  // Add to global in Node.js (for testing, etc).
  if (typeof global !== 'undefined') {
    global.HowlerGlobal = HowlerGlobal;
    global.Howler = Howler;
    global.Howl = Howl;
    global.Sound = Sound;
  } else if (typeof window !== 'undefined') {  // Define globally in case AMD is not available or unused.
    window.HowlerGlobal = HowlerGlobal;
    window.Howler = Howler;
    window.Howl = Howl;
    window.Sound = Sound;
  }
})();


/*!
 *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
 *  
 *  howler.js v2.2.4
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  // Setup default properties.
  HowlerGlobal.prototype._pos = [0, 0, 0];
  HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Helper method to update the stereo panning position of all current Howls.
   * Future Howls will not use this value unless explicitly set.
   * @param  {Number} pan A value of -1.0 is all the way left and 1.0 is all the way right.
   * @return {Howler/Number}     Self or current stereo panning value.
   */
  HowlerGlobal.prototype.stereo = function(pan) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Loop through all Howls and update their stereo panning.
    for (var i=self._howls.length-1; i>=0; i--) {
      self._howls[i].stereo(pan);
    }

    return self;
  };

  /**
   * Get/set the position of the listener in 3D cartesian space. Sounds using
   * 3D position will be relative to the listener's position.
   * @param  {Number} x The x-position of the listener.
   * @param  {Number} y The y-position of the listener.
   * @param  {Number} z The z-position of the listener.
   * @return {Howler/Array}   Self or current listener position.
   */
  HowlerGlobal.prototype.pos = function(x, y, z) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? self._pos[1] : y;
    z = (typeof z !== 'number') ? self._pos[2] : z;

    if (typeof x === 'number') {
      self._pos = [x, y, z];

      if (typeof self.ctx.listener.positionX !== 'undefined') {
        self.ctx.listener.positionX.setTargetAtTime(self._pos[0], Howler.ctx.currentTime, 0.1);
        self.ctx.listener.positionY.setTargetAtTime(self._pos[1], Howler.ctx.currentTime, 0.1);
        self.ctx.listener.positionZ.setTargetAtTime(self._pos[2], Howler.ctx.currentTime, 0.1);
      } else {
        self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
      }
    } else {
      return self._pos;
    }

    return self;
  };

  /**
   * Get/set the direction the listener is pointing in the 3D cartesian space.
   * A front and up vector must be provided. The front is the direction the
   * face of the listener is pointing, and up is the direction the top of the
   * listener is pointing. Thus, these values are expected to be at right angles
   * from each other.
   * @param  {Number} x   The x-orientation of the listener.
   * @param  {Number} y   The y-orientation of the listener.
   * @param  {Number} z   The z-orientation of the listener.
   * @param  {Number} xUp The x-orientation of the top of the listener.
   * @param  {Number} yUp The y-orientation of the top of the listener.
   * @param  {Number} zUp The z-orientation of the top of the listener.
   * @return {Howler/Array}     Returns self or the current orientation vectors.
   */
  HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    var or = self._orientation;
    y = (typeof y !== 'number') ? or[1] : y;
    z = (typeof z !== 'number') ? or[2] : z;
    xUp = (typeof xUp !== 'number') ? or[3] : xUp;
    yUp = (typeof yUp !== 'number') ? or[4] : yUp;
    zUp = (typeof zUp !== 'number') ? or[5] : zUp;

    if (typeof x === 'number') {
      self._orientation = [x, y, z, xUp, yUp, zUp];

      if (typeof self.ctx.listener.forwardX !== 'undefined') {
        self.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
      } else {
        self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
      }
    } else {
      return or;
    }

    return self;
  };

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core init.
   * @param  {Function} _super Core init method.
   * @return {Howl}
   */
  Howl.prototype.init = (function(_super) {
    return function(o) {
      var self = this;

      // Setup user-defined default properties.
      self._orientation = o.orientation || [1, 0, 0];
      self._stereo = o.stereo || null;
      self._pos = o.pos || null;
      self._pannerAttr = {
        coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : 360,
        coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : 360,
        coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : 0,
        distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : 'inverse',
        maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : 10000,
        panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : 'HRTF',
        refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : 1,
        rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : 1
      };

      // Setup event listeners.
      self._onstereo = o.onstereo ? [{fn: o.onstereo}] : [];
      self._onpos = o.onpos ? [{fn: o.onpos}] : [];
      self._onorientation = o.onorientation ? [{fn: o.onorientation}] : [];

      // Complete initilization with howler.js core's init function.
      return _super.call(this, o);
    };
  })(Howl.prototype.init);

  /**
   * Get/set the stereo panning of the audio source for this sound or all in the group.
   * @param  {Number} pan  A value of -1.0 is all the way left and 1.0 is all the way right.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Number}    Returns self or the current stereo panning value.
   */
  Howl.prototype.stereo = function(pan, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change stereo pan when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'stereo',
        action: function() {
          self.stereo(pan, id);
        }
      });

      return self;
    }

    // Check for PannerStereoNode support and fallback to PannerNode if it doesn't exist.
    var pannerType = (typeof Howler.ctx.createStereoPanner === 'undefined') ? 'spatial' : 'stereo';

    // Setup the group's stereo panning if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's stereo panning if no parameters are passed.
      if (typeof pan === 'number') {
        self._stereo = pan;
        self._pos = [pan, 0, 0];
      } else {
        return self._stereo;
      }
    }

    // Change the streo panning of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof pan === 'number') {
          sound._stereo = pan;
          sound._pos = [pan, 0, 0];

          if (sound._node) {
            // If we are falling back, make sure the panningModel is equalpower.
            sound._pannerAttr.panningModel = 'equalpower';

            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || !sound._panner.pan) {
              setupPanner(sound, pannerType);
            }

            if (pannerType === 'spatial') {
              if (typeof sound._panner.positionX !== 'undefined') {
                sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
              } else {
                sound._panner.setPosition(pan, 0, 0);
              }
            } else {
              sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
            }
          }

          self._emit('stereo', sound._id);
        } else {
          return sound._stereo;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the 3D spatial position of the audio source for this sound or group relative to the global listener.
   * @param  {Number} x  The x-position of the audio source.
   * @param  {Number} y  The y-position of the audio source.
   * @param  {Number} z  The z-position of the audio source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial position: [x, y, z].
   */
  Howl.prototype.pos = function(x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change position when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'pos',
        action: function() {
          self.pos(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? 0 : y;
    z = (typeof z !== 'number') ? -0.5 : z;

    // Setup the group's spatial position if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial position if no parameters are passed.
      if (typeof x === 'number') {
        self._pos = [x, y, z];
      } else {
        return self._pos;
      }
    }

    // Change the spatial position of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._pos = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || sound._panner.pan) {
              setupPanner(sound, 'spatial');
            }

            if (typeof sound._panner.positionX !== 'undefined') {
              sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
              sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
              sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
            } else {
              sound._panner.setPosition(x, y, z);
            }
          }

          self._emit('pos', sound._id);
        } else {
          return sound._pos;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the direction the audio source is pointing in the 3D cartesian coordinate
   * space. Depending on how direction the sound is, based on the `cone` attributes,
   * a sound pointing away from the listener can be quiet or silent.
   * @param  {Number} x  The x-orientation of the source.
   * @param  {Number} y  The y-orientation of the source.
   * @param  {Number} z  The z-orientation of the source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial orientation: [x, y, z].
   */
  Howl.prototype.orientation = function(x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change orientation when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'orientation',
        action: function() {
          self.orientation(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? self._orientation[1] : y;
    z = (typeof z !== 'number') ? self._orientation[2] : z;

    // Setup the group's spatial orientation if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial orientation if no parameters are passed.
      if (typeof x === 'number') {
        self._orientation = [x, y, z];
      } else {
        return self._orientation;
      }
    }

    // Change the spatial orientation of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._orientation = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner) {
              // Make sure we have a position to setup the node with.
              if (!sound._pos) {
                sound._pos = self._pos || [0, 0, -0.5];
              }

              setupPanner(sound, 'spatial');
            }

            if (typeof sound._panner.orientationX !== 'undefined') {
              sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
              sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
              sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
            } else {
              sound._panner.setOrientation(x, y, z);
            }
          }

          self._emit('orientation', sound._id);
        } else {
          return sound._orientation;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the panner node's attributes for a sound or group of sounds.
   * This method can optionall take 0, 1 or 2 arguments.
   *   pannerAttr() -> Returns the group's values.
   *   pannerAttr(id) -> Returns the sound id's values.
   *   pannerAttr(o) -> Set's the values of all sounds in this Howl group.
   *   pannerAttr(o, id) -> Set's the values of passed sound id.
   *
   *   Attributes:
   *     coneInnerAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
   *                      inside of which there will be no volume reduction.
   *     coneOuterAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
   *                      outside of which the volume will be reduced to a constant value of `coneOuterGain`.
   *     coneOuterGain - (0 by default) A parameter for directional audio sources, this is the gain outside of the
   *                     `coneOuterAngle`. It is a linear value in the range `[0, 1]`.
   *     distanceModel - ('inverse' by default) Determines algorithm used to reduce volume as audio moves away from
   *                     listener. Can be `linear`, `inverse` or `exponential.
   *     maxDistance - (10000 by default) The maximum distance between source and listener, after which the volume
   *                   will not be reduced any further.
   *     refDistance - (1 by default) A reference distance for reducing volume as source moves further from the listener.
   *                   This is simply a variable of the distance model and has a different effect depending on which model
   *                   is used and the scale of your coordinates. Generally, volume will be equal to 1 at this distance.
   *     rolloffFactor - (1 by default) How quickly the volume reduces as source moves from listener. This is simply a
   *                     variable of the distance model and can be in the range of `[0, 1]` with `linear` and `[0, ∞]`
   *                     with `inverse` and `exponential`.
   *     panningModel - ('HRTF' by default) Determines which spatialization algorithm is used to position audio.
   *                     Can be `HRTF` or `equalpower`.
   *
   * @return {Howl/Object} Returns self or current panner attributes.
   */
  Howl.prototype.pannerAttr = function() {
    var self = this;
    var args = arguments;
    var o, id, sound;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // Determine the values based on arguments.
    if (args.length === 0) {
      // Return the group's panner attribute values.
      return self._pannerAttr;
    } else if (args.length === 1) {
      if (typeof args[0] === 'object') {
        o = args[0];

        // Set the grou's panner attribute values.
        if (typeof id === 'undefined') {
          if (!o.pannerAttr) {
            o.pannerAttr = {
              coneInnerAngle: o.coneInnerAngle,
              coneOuterAngle: o.coneOuterAngle,
              coneOuterGain: o.coneOuterGain,
              distanceModel: o.distanceModel,
              maxDistance: o.maxDistance,
              refDistance: o.refDistance,
              rolloffFactor: o.rolloffFactor,
              panningModel: o.panningModel
            };
          }

          self._pannerAttr = {
            coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== 'undefined' ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
            coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== 'undefined' ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
            coneOuterGain: typeof o.pannerAttr.coneOuterGain !== 'undefined' ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
            distanceModel: typeof o.pannerAttr.distanceModel !== 'undefined' ? o.pannerAttr.distanceModel : self._distanceModel,
            maxDistance: typeof o.pannerAttr.maxDistance !== 'undefined' ? o.pannerAttr.maxDistance : self._maxDistance,
            refDistance: typeof o.pannerAttr.refDistance !== 'undefined' ? o.pannerAttr.refDistance : self._refDistance,
            rolloffFactor: typeof o.pannerAttr.rolloffFactor !== 'undefined' ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
            panningModel: typeof o.pannerAttr.panningModel !== 'undefined' ? o.pannerAttr.panningModel : self._panningModel
          };
        }
      } else {
        // Return this sound's panner attribute values.
        sound = self._soundById(parseInt(args[0], 10));
        return sound ? sound._pannerAttr : self._pannerAttr;
      }
    } else if (args.length === 2) {
      o = args[0];
      id = parseInt(args[1], 10);
    }

    // Update the values of the specified sounds.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      sound = self._soundById(ids[i]);

      if (sound) {
        // Merge the new values into the sound.
        var pa = sound._pannerAttr;
        pa = {
          coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : pa.coneInnerAngle,
          coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : pa.coneOuterAngle,
          coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : pa.coneOuterGain,
          distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : pa.distanceModel,
          maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : pa.maxDistance,
          refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : pa.refDistance,
          rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : pa.rolloffFactor,
          panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : pa.panningModel
        };

        // Create a new panner node if one doesn't already exist.
        var panner = sound._panner;
        if (!panner) {
          // Make sure we have a position to setup the node with.
          if (!sound._pos) {
            sound._pos = self._pos || [0, 0, -0.5];
          }

          // Create a new panner node.
          setupPanner(sound, 'spatial');
          panner = sound._panner
        }

        // Update the panner values or create a new panner if none exists.
        panner.coneInnerAngle = pa.coneInnerAngle;
        panner.coneOuterAngle = pa.coneOuterAngle;
        panner.coneOuterGain = pa.coneOuterGain;
        panner.distanceModel = pa.distanceModel;
        panner.maxDistance = pa.maxDistance;
        panner.refDistance = pa.refDistance;
        panner.rolloffFactor = pa.rolloffFactor;
        panner.panningModel = pa.panningModel;
      }
    }

    return self;
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core Sound init.
   * @param  {Function} _super Core Sound init method.
   * @return {Sound}
   */
  Sound.prototype.init = (function(_super) {
    return function() {
      var self = this;
      var parent = self._parent;

      // Setup user-defined default properties.
      self._orientation = parent._orientation;
      self._stereo = parent._stereo;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // Complete initilization with howler.js core Sound's init function.
      _super.call(this);

      // If a stereo or position was specified, set it up.
      if (self._stereo) {
        parent.stereo(self._stereo);
      } else if (self._pos) {
        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
      }
    };
  })(Sound.prototype.init);

  /**
   * Override the Sound.reset method to clean up properties from the spatial plugin.
   * @param  {Function} _super Sound reset method.
   * @return {Sound}
   */
  Sound.prototype.reset = (function(_super) {
    return function() {
      var self = this;
      var parent = self._parent;

      // Reset all spatial plugin properties on this sound.
      self._orientation = parent._orientation;
      self._stereo = parent._stereo;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // If a stereo or position was specified, set it up.
      if (self._stereo) {
        parent.stereo(self._stereo);
      } else if (self._pos) {
        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
      } else if (self._panner) {
        // Disconnect the panner.
        self._panner.disconnect(0);
        self._panner = undefined;
        parent._refreshBuffer(self);
      }

      // Complete resetting of the sound.
      return _super.call(this);
    };
  })(Sound.prototype.reset);

  /** Helper Methods **/
  /***************************************************************************/

  /**
   * Create a new panner node and save it on the sound.
   * @param  {Sound} sound Specific sound to setup panning on.
   * @param {String} type Type of panner to create: 'stereo' or 'spatial'.
   */
  var setupPanner = function(sound, type) {
    type = type || 'spatial';

    // Create the new panner node.
    if (type === 'spatial') {
      sound._panner = Howler.ctx.createPanner();
      sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
      sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
      sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
      sound._panner.distanceModel = sound._pannerAttr.distanceModel;
      sound._panner.maxDistance = sound._pannerAttr.maxDistance;
      sound._panner.refDistance = sound._pannerAttr.refDistance;
      sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
      sound._panner.panningModel = sound._pannerAttr.panningModel;

      if (typeof sound._panner.positionX !== 'undefined') {
        sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
        sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
        sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
      } else {
        sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
      }

      if (typeof sound._panner.orientationX !== 'undefined') {
        sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
        sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
        sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
      } else {
        sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
      }
    } else {
      sound._panner = Howler.ctx.createStereoPanner();
      sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
    }

    sound._panner.connect(sound._node);

    // Update the connections.
    if (!sound._paused) {
      sound._parent.pause(sound._id, true).play(sound._id, true);
    }
  };
})();

},{}],"../utility/sound-controller.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.soundController = void 0;
var _howler = require("howler");
var soundController = exports.soundController = {
  die: new _howler.Howl({
    src: ['sounds/die.wav'],
    volume: 0
  }),
  jump: new _howler.Howl({
    src: ['sounds/jump.wav'],
    volume: 0
  }),
  beatScore: new _howler.Howl({
    src: ['sounds/beatScore.wav'],
    volume: 0
  }),
  pickupCoin: new _howler.Howl({
    src: ['sounds/pickupCoin.wav'],
    volume: 0
  }),
  takeDamage: new _howler.Howl({
    src: ['sounds/takeDamage.wav'],
    volume: 0
  })
};
},{"howler":"../node_modules/howler/dist/howler.js"}],"../elements/player-controller.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDinoRect = getDinoRect;
exports.handleIdle = handleIdle;
exports.setDinoLose = setDinoLose;
exports.setupDino = setupDino;
exports.updateDino = updateDino;
var _updateCustomProperty = require("../utility/updateCustomProperty.js");
var _Jump = _interopRequireDefault(require("../public/imgs/nittany-lion/jump-animation/Jump-1.png"));
var _Jump2 = _interopRequireDefault(require("../public/imgs/nittany-lion/jump-animation/Jump-2.png"));
var _Run = _interopRequireDefault(require("../public/imgs/nittany-lion/run-cycle/Run-1.png"));
var _Run2 = _interopRequireDefault(require("../public/imgs/nittany-lion/run-cycle/Run-2.png"));
var _Run3 = _interopRequireDefault(require("../public/imgs/nittany-lion/run-cycle/Run-3.png"));
var _Run4 = _interopRequireDefault(require("../public/imgs/nittany-lion/run-cycle/Run-4.png"));
var _Rest = _interopRequireDefault(require("../public/imgs/nittany-lion/rest-animation/Rest-1.png"));
var _Rest2 = _interopRequireDefault(require("../public/imgs/nittany-lion/rest-animation/Rest-2.png"));
var _Rest3 = _interopRequireDefault(require("../public/imgs/nittany-lion/rest-animation/Rest-3.png"));
var _soundController = require("../utility/sound-controller.js");
var _gameManager = require("../game-manager.js");
var _gameState = _interopRequireDefault(require("../game-state.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var getHasLeaf = _gameState.default.getHasLeaf,
  getJumpCountLimit = _gameState.default.getJumpCountLimit,
  getGravityFallAdjustment = _gameState.default.getGravityFallAdjustment;
var dinoElem = document.querySelector('[data-dino]');
var dinoImg = document.querySelector('.dino-img');
var JUMP_SPEED = 0.245;
var DOUBLE_JUMP_SPEED = 0.23; // Adjust this as needed
var GRAVITY = 0.0009;
var DINO_FRAME_COUNT = 4;
var FRAME_TIME = 85;
var BOTTOM_ANCHOR = 19.5;
var isJumping;
var canDoubleJump;
var jumpCount;
var dinoFrame;
var currentFrameTime;
var yVelocity;
var jumpAnimationInProgress;
var newSelectedStarter;
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function setupDino() {
  isJumping = false;
  jumpAnimationInProgress = false;
  canDoubleJump = true;
  jumpCount = 0;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  (0, _updateCustomProperty.setCustomProperty)(dinoElem, '--bottom', BOTTOM_ANCHOR);

  // Function to check if the device is a mobile device
  if (isMobileDevice()) {
    document.removeEventListener('touchstart', onJump);
    document.removeEventListener('touchend', onJumpEnd);
    document.addEventListener('touchstart', onJump);
    document.addEventListener('touchend', onJumpEnd);
    document.addEventListener('touchstart', onDive);
  } else {
    document.removeEventListener('keydown', onJump);
    document.removeEventListener('keyup', onJumpEnd);
    document.addEventListener('keyup', onJumpEnd);
    document.addEventListener('keydown', onJump);
    document.addEventListener('keydown', onDive);
  }
}
function updateDino(delta, speedScale, gravityFallAdjustment, selectedStarter) {
  if (!newSelectedStarter) {
    newSelectedStarter = selectedStarter;
  }
  handleRun(delta, speedScale, newSelectedStarter);
  handleJump(delta, gravityFallAdjustment);
  handleDive(delta);
}
function getDinoRect() {
  return dinoElem.getBoundingClientRect();
}
function setDinoLose() {
  dinoImg.src = _Jump.default;
  dinoImg.classList.add('leap');
  dinoImg.classList.remove('flash-animation');
  var spotlight = document.getElementById('spotlight');
  spotlight.classList.add('close-spotlight');
}
function startJump(selectedStarter) {
  if (!jumpAnimationInProgress) {
    jumpAnimationInProgress = true;
    dinoImg.src = _Jump.default;
    if (selectedStarter === 'Coins') {
      createCoinAboveDino();
    }
    setTimeout(function () {
      dinoImg.src = _Jump2.default;
    }, 200); // Adjust the delay as needed
  }
}

function endJump() {
  isJumping = false;
  jumpAnimationInProgress = false;
  isFalling = false;
}
var dropOffPlatform = false;
var currentIdleImageIndex = 0;
var imagePaths = [_Rest.default, _Rest2.default, _Rest.default, _Rest2.default, _Rest.default, _Rest2.default, _Rest3.default
// Add more image paths as needed
];

function handleIdle() {
  dinoImg.src = imagePaths[currentIdleImageIndex];
  currentIdleImageIndex = (currentIdleImageIndex + 1) % imagePaths.length; // Loop back to the first image when reaching the end
  // Call the updateImage function at a specific interval (e.g., every 200 milliseconds)
}

function handleRun(delta, speedScale, selectedStarter) {
  if (isJumping) {
    startJump(selectedStarter);
    return;
  }

  // Check if there is a collision and a current platform ID is set
  if (collisionDetected && currentPlatformId) {
    var currentPlatform = document.getElementById(currentPlatformId);
    var currentPlatformRect = currentPlatform.getBoundingClientRect();
    var dinoRect = getDinoRect();
    canDoubleJump = true;
    jumpCount = 0;
    // Check if the dino has reached the end of the current platform
    if (dinoRect.left >= currentPlatformRect.right) {
      dropOffPlatform = true;
      var currentBottom = (0, _updateCustomProperty.getCustomProperty)(dinoElem, '--bottom');
      yVelocity -= GRAVITY * delta - getGravityFallAdjustment() / 6; // Increase or decrease gravityAdjustment as needed
      (0, _updateCustomProperty.incrementCustomProperty)(dinoElem, '--bottom', yVelocity * delta);
      if (currentBottom <= BOTTOM_ANCHOR) {
        (0, _updateCustomProperty.setCustomProperty)(dinoElem, '--bottom', BOTTOM_ANCHOR);
        canDoubleJump = true;
        jumpCount = 0;
      }
      // Dino reached the end of the current platform, end the jump
      canDoubleJump = true;
      jumpCount = 0;

      // Reset the current platform ID
      currentPlatformId = null;
      collisionDetected = false;
    }
  }
  if (dropOffPlatform === true) {
    var _currentBottom = (0, _updateCustomProperty.getCustomProperty)(dinoElem, '--bottom');
    yVelocity -= GRAVITY * delta - getGravityFallAdjustment() / 6; // Increase or decrease gravityAdjustment as needed
    (0, _updateCustomProperty.incrementCustomProperty)(dinoElem, '--bottom', yVelocity * delta);
    if (_currentBottom <= BOTTOM_ANCHOR) {
      (0, _updateCustomProperty.setCustomProperty)(dinoElem, '--bottom', BOTTOM_ANCHOR);
      endJump();
      canDoubleJump = true;
      jumpCount = 0;
      dropOffPlatform = false;
    }
  }
  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;

    // Use a switch statement to set the image source based on the current frame
    switch (dinoFrame) {
      case 0:
        dinoImg.src = _Run.default;
        break;
      case 1:
        dinoImg.src = _Run2.default;
        break;
      case 2:
        dinoImg.src = _Run3.default;
        break;
      case 3:
        dinoImg.src = _Run4.default;
        break;
      // Add more cases if you have more frames
    }

    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}
function isCollidingWithPlatforms() {
  // Check for collision with the top surface of platforms
  var dinoRect = getDinoRect();
  var platforms = document.querySelectorAll('[data-platform]');
  platforms.forEach(function (platform) {
    var platformRect = platform.getBoundingClientRect();
    if (dinoRect.bottom >= platformRect.top && dinoRect.bottom <= platformRect.bottom && dinoRect.right > platformRect.left && dinoRect.left < platformRect.right) {
      endJump();

      // Collision with the top surface of a platform
      dinoElem.style.bottom = platformRect.top;
      collisionDetected = true;
      currentPlatformId = platform.id;
    }
  });
}
var jumpStartTime;
var maxJumpTime = 90; // Maximum duration for the jump in milliseconds
var minJumpTime = 70; // Minimum jump time in milliseconds
var currentPlatformId; // Variable to store the ID of the current platform
var collisionDetected = false;
var isFalling = false;
function handleJump(delta) {
  var gravityFallAdjustment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.01;
  if (!isJumping) return;

  // Adjusting fall speed when jumping on the way down
  if (yVelocity <= 0) {
    isFalling = true;
    // Set interval to adjust fall speed every 5 seconds (adjust the interval as needed)
    yVelocity -= getHasLeaf() ? GRAVITY * delta - gravityFallAdjustment / 4 : GRAVITY * delta + gravityFallAdjustment; // Increase or decrease gravityAdjustment as needed
  } else {
    yVelocity -= GRAVITY * delta;
  }
  (0, _updateCustomProperty.incrementCustomProperty)(dinoElem, '--bottom', yVelocity * delta);
  var currentBottom = (0, _updateCustomProperty.getCustomProperty)(dinoElem, '--bottom');
  if (isFalling) {
    // Check for collision with the top surface of platforms
    isCollidingWithPlatforms();
  }

  // Check for collision with the ground or platforms
  if (currentBottom <= BOTTOM_ANCHOR) {
    (0, _updateCustomProperty.setCustomProperty)(dinoElem, '--bottom', BOTTOM_ANCHOR);
    canDoubleJump = true;
    jumpCount = 0;
    endJump();
  }
  if (jumpCount === 1 && canDoubleJump) {
    yVelocity = DOUBLE_JUMP_SPEED;
    canDoubleJump = false;
  }
}

//handles jump key press event
function onJump(e) {
  if (e.code !== 'Space' && e.type !== 'touchstart' || isJumping && jumpCount >= getJumpCountLimit()) return;
  endJump();
  startJump(newSelectedStarter);

  // Record the timestamp when the jump key is pressed
  jumpStartTime = Date.now();
  _soundController.soundController.jump.play();
  isJumping = true;
  yVelocity = JUMP_SPEED;
  jumpCount++;
}

//handles jump key release event
function onJumpEnd(e) {
  if (e.code !== 'Space' && e.type !== 'touchend' || isFalling) return;

  // Calculate the time the jump key has been held down
  var jumpTime = Date.now() - jumpStartTime;

  // Ensure jumpTime is not lower than minJumpTime
  jumpTime = Math.max(jumpTime, minJumpTime);
  if (maxJumpTime >= jumpTime + 5) {
    // Calculate jump strength based on jump time
    var jumpStrength = Math.min(jumpTime / maxJumpTime, 1); // Normalize between 0 and 1
    jumpStrength = Math.pow(jumpStrength, 2); // Apply a power function for smoother acceleration

    // Calculate jump velocity
    var jumpVelocity = JUMP_SPEED * jumpStrength;

    // Set the yVelocity to the calculated jump velocity
    yVelocity = jumpVelocity;
  }
}
var DIVE_SPEED = 0.2; // Adjust the dive speed as needed
var isDiving = false;
function handleDive(delta) {
  if (!isDiving) return;
  (0, _updateCustomProperty.incrementCustomProperty)(dinoElem, '--bottom', yVelocity * delta);
  if ((0, _updateCustomProperty.getCustomProperty)(dinoElem, '--bottom') <= BOTTOM_ANCHOR) {
    (0, _updateCustomProperty.setCustomProperty)(dinoElem, '--bottom', BOTTOM_ANCHOR);
    isDiving = false;
    jumpCount = 0;
  }
  yVelocity -= GRAVITY * delta;
}
function onDive(e) {
  if (e.code !== 'ArrowDown' && e.type !== 'touchstart' || isDiving) return;
  yVelocity = -DIVE_SPEED; // Negative value for diving down
  isDiving = true;

  // Add any additional logic you need for the dive action

  // Optional: You might want to reset isJumping and jumpCount here if needed
  isJumping = false;
  jumpCount = 0;
}
function createCoinAboveDino() {
  var coinElement = document.createElement('div');
  var selectedCollectable = _gameManager.collectableOptions[0];
  coinElement.dataset.coin = true;
  coinElement.dataset.type = selectedCollectable.type;
  coinElement.dataset.locked = 'false';
  coinElement.dataset.points = selectedCollectable.points;
  coinElement.classList.add('pop-up-gold-coin', 'collectable');
  coinElement.id = Math.random().toString(16).slice(2);

  // Set the initial position of the coin above the dino
  coinElement.style.position = 'absolute';
  coinElement.style.top = dinoElem.offsetTop - 50 + 'px'; // Adjust the vertical position as needed
  coinElement.style.left = dinoElem.offsetLeft + 50 + 'px'; // Center above the dino
  // Append the coin element to the document body or another container
  var worldElem = document.querySelector('[data-world]');
  worldElem.appendChild(coinElement);
}
},{"../utility/updateCustomProperty.js":"../utility/updateCustomProperty.js","../public/imgs/nittany-lion/jump-animation/Jump-1.png":"imgs/nittany-lion/jump-animation/Jump-1.png","../public/imgs/nittany-lion/jump-animation/Jump-2.png":"imgs/nittany-lion/jump-animation/Jump-2.png","../public/imgs/nittany-lion/run-cycle/Run-1.png":"imgs/nittany-lion/run-cycle/Run-1.png","../public/imgs/nittany-lion/run-cycle/Run-2.png":"imgs/nittany-lion/run-cycle/Run-2.png","../public/imgs/nittany-lion/run-cycle/Run-3.png":"imgs/nittany-lion/run-cycle/Run-3.png","../public/imgs/nittany-lion/run-cycle/Run-4.png":"imgs/nittany-lion/run-cycle/Run-4.png","../public/imgs/nittany-lion/rest-animation/Rest-1.png":"imgs/nittany-lion/rest-animation/Rest-1.png","../public/imgs/nittany-lion/rest-animation/Rest-2.png":"imgs/nittany-lion/rest-animation/Rest-2.png","../public/imgs/nittany-lion/rest-animation/Rest-3.png":"imgs/nittany-lion/rest-animation/Rest-3.png","../utility/sound-controller.js":"../utility/sound-controller.js","../game-manager.js":"../game-manager.js","../game-state.js":"../game-state.js"}],"imgs/obstacles/bushes/Bush-1.png":[function(require,module,exports) {
module.exports = "/Bush-1.e0cc1c5e.png";
},{}],"imgs/obstacles/rocks/Rock-1.png":[function(require,module,exports) {
module.exports = "/Rock-1.c9bd9011.png";
},{}],"imgs/obstacles/rocks/Rock-2.png":[function(require,module,exports) {
module.exports = "/Rock-2.61467632.png";
},{}],"../elements-refs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.worldElem = exports.timerProgress = exports.tickerElem3 = exports.tickerElem2 = exports.tickerElem = exports.tickerContainerElem = exports.submitNewScoreFormElem = exports.startScreenElem = exports.scrollableTableElem = exports.scoreNewHighScoreElem = exports.scoreMultiplierElem = exports.scoreErrorMessageElem = exports.scoreElem = exports.plusPointsElem = exports.pausedScreenElem = exports.multiplierTimerElem = exports.loadingTextElem = exports.livesElem = exports.leaderboardElem = exports.interfaceComboContainer = exports.highScoreElem = exports.gameOverTextElem = exports.gameOverIconElem = exports.gameNotificationElem = exports.gameLoadingTextElem = exports.gameLoadingScreenElem = exports.endScreenElem = exports.dinoElem = exports.currentMultiplierScoreElem = exports.currentMultiplierElem = exports.currentGameTimerElem = exports.currentComboScoreContainer = void 0;
// sharedElements.js
var worldElem = exports.worldElem = document.querySelector('[data-world]');
var scoreElem = exports.scoreElem = document.querySelector('[data-score]');
var highScoreElem = exports.highScoreElem = document.querySelector('[data-high-score]');
var startScreenElem = exports.startScreenElem = document.querySelector('[data-start-screen]');
var endScreenElem = exports.endScreenElem = document.querySelector('[data-game-over-screen]');
var gameOverTextElem = exports.gameOverTextElem = document.querySelector('[data-game-over-text]');
var gameOverIconElem = exports.gameOverIconElem = document.getElementById('game-over-icon');
var leaderboardElem = exports.leaderboardElem = document.querySelector('[data-leaderboard-body]');
var scoreMultiplierElem = exports.scoreMultiplierElem = document.querySelector('[data-score-multiplier]');
var scoreNewHighScoreElem = exports.scoreNewHighScoreElem = document.querySelector('[data-score-new-high-score]');
var scoreErrorMessageElem = exports.scoreErrorMessageElem = document.querySelector('[data-score-error-message]');
var multiplierTimerElem = exports.multiplierTimerElem = document.querySelector('[data-multiplier-timer]');
var tickerElem = exports.tickerElem = document.querySelector('[data-ticker]');
var tickerElem2 = exports.tickerElem2 = document.querySelector('[data-ticker2]');
var tickerElem3 = exports.tickerElem3 = document.querySelector('[data-ticker3]');
var livesElem = exports.livesElem = document.querySelector('[data-lives]');
var dinoElem = exports.dinoElem = document.querySelector('[data-dino]');
var scrollableTableElem = exports.scrollableTableElem = document.querySelector('[data-scrollable-table]');
var currentMultiplierElem = exports.currentMultiplierElem = document.querySelector('[data-current-multiplier]');
var plusPointsElem = exports.plusPointsElem = document.querySelector('[data-plus-points]');
var tickerContainerElem = exports.tickerContainerElem = document.querySelector('[data-ticker-container]');
var loadingTextElem = exports.loadingTextElem = document.querySelector('[data-loading-text]');
var submitNewScoreFormElem = exports.submitNewScoreFormElem = document.querySelector('[data-submit-new-score-form]');
var interfaceComboContainer = exports.interfaceComboContainer = document.getElementById('interface-combo-container');
var currentMultiplierScoreElem = exports.currentMultiplierScoreElem = document.querySelector('[data-current-multiplier-score]');
var currentComboScoreContainer = exports.currentComboScoreContainer = document.getElementById('current-combo-score-container');
var timerProgress = exports.timerProgress = document.getElementById('timerProgress');
var currentGameTimerElem = exports.currentGameTimerElem = document.querySelector('[data-current-game-timer]');
var gameLoadingScreenElem = exports.gameLoadingScreenElem = document.querySelector('[data-game-loading-screen]');
var gameLoadingTextElem = exports.gameLoadingTextElem = document.querySelector('[data-game-loading-text]');
var gameNotificationElem = exports.gameNotificationElem = document.querySelector('[data-notification-screen]');
var pausedScreenElem = exports.pausedScreenElem = document.querySelector('[data-paused-screen]');
},{}],"../utility/toggle-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleElemOff = toggleElemOff;
exports.toggleElemOn = toggleElemOn;
function toggleElemOn(elem) {
  var classList = elem.classList;
  classList.remove('hide-element');
  classList.add('show-element');
}
function toggleElemOff(elem) {
  var classList = elem.classList;
  classList.add('hide-element');
  classList.remove('show-element');
}
},{}],"../elements/cactus.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCactusRects = getCactusRects;
exports.setupCactus = setupCactus;
exports.updateCactus = updateCactus;
var _updateCustomProperty = require("../utility/updateCustomProperty");
var _Bush = _interopRequireDefault(require("../public/imgs/obstacles/bushes/Bush-1.png"));
var _Rock = _interopRequireDefault(require("../public/imgs/obstacles/rocks/Rock-1.png"));
var _Rock2 = _interopRequireDefault(require("../public/imgs/obstacles/rocks/Rock-2.png"));
var _playerController = require("./player-controller");
var _gameManager = require("../game-manager");
var _gameState = _interopRequireDefault(require("../game-state"));
var _elementsRefs = require("../elements-refs");
var _toggleElement = require("../utility/toggle-element");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var setMultiplierRatio = _gameState.default.setMultiplierRatio,
  getMultiplierRatio = _gameState.default.getMultiplierRatio,
  getPlayerImmunity = _gameState.default.getPlayerImmunity,
  getHasStar = _gameState.default.getHasStar,
  getObstaclePoints = _gameState.default.getObstaclePoints,
  getIsCactusRunning = _gameState.default.getIsCactusRunning;
var cactiPositions = [];
var SPEED = 0.04;
var CACTUS_INTERVAL_MIN = 500;
var CACTUS_INTERVAL_MAX = 2000;
var worldElem = document.querySelector('[data-world]');
var nextCactusTime;
function setupCactus() {
  nextCactusTime = CACTUS_INTERVAL_MIN;
  document.querySelectorAll('[data-cactus]').forEach(function (cactus) {
    cactus.remove();
  });
}
function isPositionOccupied(position) {
  return cactiPositions.includes(position);
}
var groupIdCounter = 0; // Counter to generate unique groupIds

function generateRandomCacti() {
  var minCacti = 1;
  var maxCacti = 2; // Adjust the range as needed
  var groupId; // Declare groupId outside the loop

  var numberOfCacti = randomNumberBetween(minCacti, maxCacti);
  if (numberOfCacti >= minCacti) {
    groupId = groupIdCounter++;
    for (var i = 0; i < numberOfCacti; i++) {
      var newPosition = void 0;
      do {
        newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
      } while (isPositionOccupied(newPosition));
      cactiPositions.push({
        position: newPosition,
        groupId: groupId
      });
      createCactus(newPosition, groupId);
    }
  } else {
    var _newPosition;
    do {
      _newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
    } while (isPositionOccupied(_newPosition));
    cactiPositions.push({
      position: _newPosition
    });
    createCactus(_newPosition);
  }

  // Clear cacti positions for the next round (optional)
  cactiPositions.length = 0;
}
var distanceThreshold = 200; // Adjust this threshold as needed
var cactusGroups = new Map(); // Declare cactusGroups outside the updateCactus function

function updateCactus(delta, speedScale) {
  document.querySelectorAll('[data-cactus]').forEach(function (cactus) {
    // Check if the comboIncremented flag is already set for this cactus
    var comboIncremented = cactus.dataset.comboIncremented === 'true';

    // Get positions of the dinosaur and cactus
    var dinoRect = (0, _playerController.getDinoRect)();
    var cactusRect = cactus.getBoundingClientRect();

    // Calculate distance
    var distance = Math.sqrt(Math.pow(dinoRect.x - cactusRect.x, 2) + Math.pow(dinoRect.y - cactusRect.y, 2));
    var collision = (0, _gameManager.isCollision)(dinoRect, cactusRect);

    // Check if the cactus belongs to a group
    var groupId = cactus.dataset.groupId;
    var isGrouped = groupId !== undefined;

    // Initialize groupFlags to an empty object
    var groupFlags = {};
    // Check if the dinosaur is within the threshold near the cactus
    var isDinoNearCactus = distance < distanceThreshold;

    // Check if there was a collision in the previous frame
    var hadCollision = cactus.dataset.hadCollision === 'true';

    // Check if the cactus has moved past the dinosaur
    var hasPassedDino = cactusRect.right < dinoRect.left;
    if (isGrouped) {
      // Check if this cactus belongs to a group
      if (!cactusGroups.has(groupId)) {
        // If the group does not exist, create it
        cactusGroups.set(groupId, {
          isDinoNear: false,
          hadCollision: false,
          comboIncremented: false
        });
      }

      // Update the group's flags based on individual cactuses
      groupFlags = cactusGroups.get(groupId);

      // Update the flags for this cactus in the group
      groupFlags.isDinoNear = groupFlags.isDinoNear || cactus.dataset.isDinoNear === 'true';
      groupFlags.hadCollision = groupFlags.hadCollision || hadCollision;

      // Check if the cactus has moved past the dinosaur within the group
      groupFlags.hasPassedDino = groupFlags.hasPassedDino || hasPassedDino;
    }
    if (isDinoNearCactus) {
      // If the dinosaur is within the threshold, set the flag to true
      cactus.dataset.isDinoNear = 'true';
    } else {
      // If the dinosaur is not within the threshold, set the flag to false
      cactus.dataset.isDinoNear = 'false';
    }
    if (isGrouped && groupFlags.isDinoNear && !groupFlags.hadCollision && groupFlags.hasPassedDino && !groupFlags.comboIncremented) {
      // Increment combo only if there was no collision in the previous frame
      // and the cactus group has moved past the dinosaur without a new collision
      var currentMultiplierRatio = getMultiplierRatio();
      setMultiplierRatio(currentMultiplierRatio += 1);
      (0, _gameManager.updateMultiplierInterface)();
      // const newElement = document.createElement('div');
      // newElement.classList.add('one-up');
      // newElement.style.position = 'absolute';
      // newElement.textContent = '+1x';
      // cactus.appendChild(newElement);
      // setTimeout(() => {
      //   newElement.remove();
      // }, 600);
      // Set the comboIncremented flag for the entire group
      groupFlags.comboIncremented = true;
    }
    if (!cactus.dataset.hadCollision && collision === true && !cactus.dataset.scoreUpdated) {
      if (getPlayerImmunity() && getHasStar()) {
        var text = document.createElement('div');
        text.classList.add('enemy-plus-points');
        text.style.position = 'absolute';
        text.style.left = cactus.offsetLeft + 'px';
        text.style.top = cactus.offsetTop - 70 + 'px';
        cactus.parentNode.insertBefore(text, cactus);
        var points = getMultiplierRatio() * getObstaclePoints();
        text.textContent = "+".concat(points);
        (0, _gameManager.updateScoreWithPoints)(points);
        cactus.classList.add('enemy-die');
        cactus.dataset.scoreUpdated = true;
        text.addEventListener('animationend', function () {
          text.remove();
        });
        // After the transition, remove the cactus
        cactus.addEventListener('animationend', function () {
          cactus.remove();
        });
      } else {
        cactus.dataset.hadCollision = true;
      }
    }
    (0, _updateCustomProperty.incrementCustomProperty)(cactus, '--left', delta * speedScale * SPEED * -1);
    if ((0, _updateCustomProperty.getCustomProperty)(cactus, '--left') <= -100) {
      cactus.remove();
    }
  });
  if (nextCactusTime <= 0 && getIsCactusRunning()) {
    generateRandomCacti();
    nextCactusTime = randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) / speedScale;
  }
  nextCactusTime -= delta;
}
function getCactusRects() {
  return _toConsumableArray(document.querySelectorAll('[data-cactus]')).map(function (cactus) {
    return cactus.getBoundingClientRect();
  });
}

// Array of possible cactus images with associated weights
var cactusImages = [{
  src: _Bush.default,
  weight: 5
}, {
  src: _Rock.default,
  weight: 3
}, {
  src: _Rock2.default,
  weight: 4
}
// Add more image sources with corresponding weights
];

function createCactus(newPosition, groupId) {
  // Calculate the total weight
  var totalWeight = cactusImages.reduce(function (sum, image) {
    return sum + image.weight;
  }, 0);

  // Generate a random number between 0 and totalWeight
  var randomWeight = Math.random() * totalWeight;

  // Select a random cactus image based on the weighted probabilities
  var cumulativeWeight = 0;
  var selectedImage;
  var _iterator = _createForOfIteratorHelper(cactusImages),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var image = _step.value;
      cumulativeWeight += image.weight;
      if (randomWeight <= cumulativeWeight) {
        selectedImage = image;
        break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var cactus = document.createElement('img');
  cactus.dataset.cactus = true;
  cactus.src = selectedImage.src;
  cactus.classList.add('cactus', 'game-element');
  // Randomly flip the cloud horizontally
  if (Math.random() < 0.5) {
    cactus.style.transform = 'scaleX(-1)';
  }
  // Set the groupId as a data attribute on the cactus element
  cactus.dataset.groupId = groupId;
  (0, _updateCustomProperty.setCustomProperty)(cactus, '--left', newPosition);
  (0, _updateCustomProperty.setCustomProperty)(cactus, 'height', '6.3%');
  (0, _updateCustomProperty.setCustomProperty)(cactus, '--bottom', "".concat(randomNumberBetween(15.5, 17.5)));
  worldElem.append(cactus);
}
function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
},{"../utility/updateCustomProperty":"../utility/updateCustomProperty.js","../public/imgs/obstacles/bushes/Bush-1.png":"imgs/obstacles/bushes/Bush-1.png","../public/imgs/obstacles/rocks/Rock-1.png":"imgs/obstacles/rocks/Rock-1.png","../public/imgs/obstacles/rocks/Rock-2.png":"imgs/obstacles/rocks/Rock-2.png","./player-controller":"../elements/player-controller.js","../game-manager":"../game-manager.js","../game-state":"../game-state.js","../elements-refs":"../elements-refs.js","../utility/toggle-element":"../utility/toggle-element.js"}],"imgs/cloud/Cloud-1.png":[function(require,module,exports) {
module.exports = "/Cloud-1.fd6d161e.png";
},{}],"imgs/cloud/Cloud-2.png":[function(require,module,exports) {
module.exports = "/Cloud-2.0d1d9676.png";
},{}],"../item-drop-state.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// state.js
var ItemDropStateSingleton = function () {
  //default state
  var state = {
    star: {
      weight: 8
    }
    // magnet: { weight: 4 },
    // heart: { weight: 12 },
    // leaf: { weight: 12 },
    // cherry: { weight: 12 },
    // empty: { weight: 2 },
  };

  return {
    getItemDropState: function getItemDropState() {
      return state;
    },
    updateState: function updateState(newValues) {
      Object.assign(state, newValues);
    }
  };
}();
var _default = exports.default = ItemDropStateSingleton;
},{}],"../utility/child-items.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createChildItems = createChildItems;
var _gameState = _interopRequireDefault(require("../game-state"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function createChildItems(elementName, parent) {
  var element = document.createElement('div');
  element.dataset["".concat(elementName)] = true;
  element.classList.add("".concat(elementName, "-item-cloud"), "".concat(elementName, "-cloud-item-asset"));
  element.id = Math.random().toString(16).slice(2);
  if (elementName === 'cherry') {
    element.dataset.type = 'cherry';
    element.dataset.points = _gameState.default.getCherryPoints();
  }
  parent.append(element);
}
},{"../game-state":"../game-state.js"}],"../elements/platform.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPlatformRects = getPlatformRects;
exports.getRandomWeighted = getRandomWeighted;
exports.normalizeWeights = normalizeWeights;
exports.randomNumberBetween = randomNumberBetween;
exports.setupPlatform = setupPlatform;
exports.updatePlatform = updatePlatform;
var _updateCustomProperty = require("../utility/updateCustomProperty");
var _Cloud = _interopRequireDefault(require("../public/imgs/cloud/Cloud-1.png"));
var _Cloud2 = _interopRequireDefault(require("../public/imgs/cloud/Cloud-2.png"));
var _playerController = require("./player-controller");
var _gameManager = require("../game-manager");
var _gameState = _interopRequireDefault(require("../game-state"));
var _itemDropState = _interopRequireDefault(require("../item-drop-state"));
var _childItems = require("../utility/child-items");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var getIsPlatformRunning = _gameState.default.getIsPlatformRunning,
  getPlatformSpeed = _gameState.default.getPlatformSpeed;
var getItemDropState = _itemDropState.default.getItemDropState;
var platformPositions = [];
var SPEED = 0.035;
var platform_INTERVAL_MIN = 1000;
var platform_INTERVAL_MAX = 1500;
var worldElem = document.querySelector('[data-world]');
var nextPlatformTime;
function setupPlatform() {
  nextPlatformTime = platform_INTERVAL_MIN;
  document.querySelectorAll('[data-platform]').forEach(function (platform) {
    platform.remove();
  });
}
function isPositionOccupied(position) {
  return platformPositions.includes(position);
}
function generateRandomPlatforms() {
  var minPlatforms = 1;
  var maxPlatforms = 1; // Adjust the range as needed

  var numberOfPlatforms = randomNumberBetween(minPlatforms, maxPlatforms);
  if (numberOfPlatforms >= minPlatforms) {
    for (var i = 0; i < numberOfPlatforms; i++) {
      var newPosition = void 0;
      do {
        newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
      } while (isPositionOccupied(newPosition));
      platformPositions.push({
        position: newPosition
      });
      createPlatform(newPosition);
    }
  } else {
    var _newPosition;
    do {
      _newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
    } while (isPositionOccupied(_newPosition));
    platformPositions.push({
      position: _newPosition
    });
    createPlatform(_newPosition);
  }
  platformPositions.length = 0;
}
var distanceThreshold = 200; // Adjust this threshold as needed

function updatePlatform(delta, speedScale) {
  document.querySelectorAll('[data-platform]').forEach(function (platform) {
    // Get positions of the dinosaur and platform
    var dinoRect = (0, _playerController.getDinoRect)();
    var platformRect = platform.getBoundingClientRect();

    // Calculate distance
    var distance = Math.sqrt(Math.pow(dinoRect.x - platformRect.x, 2) + Math.pow(dinoRect.y - platformRect.y, 2));
    var collision = (0, _gameManager.isCollision)(dinoRect, platformRect);

    // Check if the dinosaur is within the threshold near the platform
    var isDinoNearPlatform = distance < distanceThreshold;
    if (isDinoNearPlatform) {
      // If the dinosaur is within the threshold, set the flag to true
      platform.dataset.isDinoNear = 'true';
    } else {
      // If the dinosaur is not within the threshold, set the flag to false
      platform.dataset.isDinoNear = 'false';
    }
    if (!platform.dataset.hadCollision && collision === true) {
      platform.dataset.hadCollision = true;
    }
  });
  document.querySelectorAll('[data-platform-container]').forEach(function (platformContainer) {
    (0, _updateCustomProperty.incrementCustomProperty)(platformContainer, '--left', delta * speedScale * SPEED * -1);
    if ((0, _updateCustomProperty.getCustomProperty)(platformContainer, '--left') <= -100) {
      platformContainer.remove();
    }
  });
  if (nextPlatformTime <= 0 && getIsPlatformRunning()) {
    generateRandomPlatforms();
    nextPlatformTime = randomNumberBetween(platform_INTERVAL_MIN, platform_INTERVAL_MAX) / speedScale;
  }
  nextPlatformTime -= delta;
}
function getPlatformRects() {
  return _toConsumableArray(document.querySelectorAll('[data-platform]')).map(function (platform) {
    return platform.getBoundingClientRect();
  });
}

// Array of possible platform images with associated weights
var platformObj = {
  'item-cloud': {
    weight: 20
  },
  2: {
    weight: 1
  },
  3: {
    weight: 2
  },
  4: {
    weight: 5
  },
  5: {
    weight: 5
  }
  // Add more image sources with corresponding weights
};

function createCloud(platformElem, isFirstChild, zIndex, i) {
  var cloud = document.createElement('img');
  cloud.src = _Cloud.default;
  var cloudClass = i % 3 === 0 ? 'floating-cloud-animation-1' : i % 3 === 1 ? 'floating-cloud-animation-2' : 'floating-cloud-animation-3';
  cloud.classList.add('cloud', cloudClass);
  // Shift each cloud to the left by 30% of its width if it's not the first cloud
  if (!isFirstChild) {
    cloud.style.marginLeft = '-4px';
  }
  cloud.style.zIndex = zIndex;
  platformElem.append(cloud);
}
var normalizedPlatformItemWeights = normalizeWeights(getItemDropState());
function createItemCloud(platformElem) {
  var cloud = document.createElement('img');
  cloud.src = _Cloud2.default;
  cloud.classList.add('item-cloud');

  // Randomly flip the cloud horizontally
  if (Math.random() < 0.5) {
    cloud.style.transform = 'scaleX(-1)';
  }

  // Shift each cloud to the left by 30% of its width if it's not the first cloud
  platformElem.append(cloud);
}
function createPlatform(newPosition) {
  var numberOfClouds = getRandomWeighted(normalizedPlatformWeights);
  var platform = document.createElement('div');
  var parentContainer = document.createElement('div');
  parentContainer.dataset.platformContainer = true;
  parentContainer.classList.add('platform-parent-container');
  if (numberOfClouds !== 'item-cloud') {
    for (var i = 0; i < numberOfClouds; i++) {
      var zIndex = numberOfClouds.length - i + 2;
      createCloud(platform, i === 0, zIndex, i);
    }
  } else {
    createItemCloud(platform);
    (0, _childItems.createChildItems)(getRandomWeighted(normalizedPlatformItemWeights), parentContainer);
  }
  platform.dataset.platform = true;
  platform.classList.add('platform', 'game-element', 'flex-row');
  platform.id = "platform-".concat(Math.random());
  parentContainer.append(platform);
  (0, _updateCustomProperty.setCustomProperty)(parentContainer, '--left', newPosition);
  (0, _updateCustomProperty.setCustomProperty)(parentContainer, '--bottom', "".concat(randomNumberBetween(45, 45)));
  worldElem.append(parentContainer);
}
function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Example usage:
var normalizedPlatformWeights = normalizeWeights(platformObj);
function normalizeWeights(item) {
  var keys = Object.keys(item);
  var weights = keys.map(function (key) {
    return item[key].weight;
  });
  var sumOfWeights = weights.reduce(function (sum, weight) {
    return sum + weight;
  }, 0);
  var normalizedWeights = {};
  keys.forEach(function (key, index) {
    normalizedWeights[key] = weights[index] / sumOfWeights;
  });
  return normalizedWeights;
}
function getRandomWeighted(item) {
  var keys = Object.keys(item);
  var probabilities = keys.map(function (key) {
    return item[key];
  });
  var randomValue = Math.random();
  var cumulativeProbability = 0;
  for (var i = 0; i < keys.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomValue <= cumulativeProbability) {
      return keys[i];
    }
  }

  // Default case (fallback)
  return keys[keys.length - 1];
}
},{"../utility/updateCustomProperty":"../utility/updateCustomProperty.js","../public/imgs/cloud/Cloud-1.png":"imgs/cloud/Cloud-1.png","../public/imgs/cloud/Cloud-2.png":"imgs/cloud/Cloud-2.png","./player-controller":"../elements/player-controller.js","../game-manager":"../game-manager.js","../game-state":"../game-state.js","../item-drop-state":"../item-drop-state.js","../utility/child-items":"../utility/child-items.js"}],"../elements/ground-enemy.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGroundEnemyRects = getGroundEnemyRects;
exports.setupGroundEnemy = setupGroundEnemy;
exports.updateGroundEnemy = updateGroundEnemy;
var _updateCustomProperty = require("../utility/updateCustomProperty");
var _playerController = require("./player-controller");
var _gameManager = require("../game-manager");
var _gameState = _interopRequireDefault(require("../game-state"));
var _elementsRefs = require("../elements-refs");
var _toggleElement = require("../utility/toggle-element");
var _platform = require("./platform");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var setMultiplierRatio = _gameState.default.setMultiplierRatio,
  getMultiplierRatio = _gameState.default.getMultiplierRatio,
  getPlayerImmunity = _gameState.default.getPlayerImmunity,
  getHasStar = _gameState.default.getHasStar,
  getObstaclePoints = _gameState.default.getObstaclePoints,
  getIsGroundEnemyRunning = _gameState.default.getIsGroundEnemyRunning,
  getGroundSpeed = _gameState.default.getGroundSpeed,
  getGroundEnemySpeedFactor = _gameState.default.getGroundEnemySpeedFactor;
var enemyPositions = [];
var SPEED = getGroundSpeed() + getGroundEnemySpeedFactor();
var GROUND_ENEMY_INTERVAL_MIN = 500;
var GROUND_ENEMY_INTERVAL_MAX = 1700;
var worldElem = document.querySelector('[data-world]');
var nextGroundEnemyTime;
function setupGroundEnemy() {
  nextGroundEnemyTime = GROUND_ENEMY_INTERVAL_MIN;
  document.querySelectorAll('[data-ground-enemy]').forEach(function (groundEnemy) {
    groundEnemy.remove();
  });
}
function isPositionOccupied(position) {
  return enemyPositions.includes(position);
}
var groupIdCounter = 0; // Counter to generate unique groupIds

function generateRandomEnemy() {
  var minEnemy = 1;
  var maxEnemy = 1; // Adjust the range as needed
  var groupId; // Declare groupId outside the loop

  var numberOfEnemy = randomNumberBetween(minEnemy, maxEnemy);
  if (numberOfEnemy >= minEnemy) {
    groupId = groupIdCounter++;
    for (var i = 0; i < numberOfEnemy; i++) {
      var newPosition = void 0;
      do {
        newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
      } while (isPositionOccupied(newPosition));
      enemyPositions.push({
        position: newPosition,
        groupId: groupId
      });
      createGroundEnemy(newPosition, groupId);
    }
  } else {
    var _newPosition;
    do {
      _newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
    } while (isPositionOccupied(_newPosition));
    enemyPositions.push({
      position: _newPosition
    });
    createGroundEnemy(_newPosition);
  }

  // Clear cacti positions for the next round (optional)
  enemyPositions.length = 0;
}
var distanceThreshold = 200; // Adjust this threshold as needed
var groundEnemyGroups = new Map(); // Declare cactusGroups outside the updateCactus function

function updateGroundEnemy(delta, speedScale) {
  document.querySelectorAll('[data-ground-enemy]').forEach(function (groundEnemy) {
    // Get positions of the dinosaur and ground-enemy
    var dinoRect = (0, _playerController.getDinoRect)();
    var groundEnemyRect = groundEnemy.getBoundingClientRect();

    // Calculate distance
    var distance = Math.sqrt(Math.pow(dinoRect.x - groundEnemyRect.x, 2) + Math.pow(dinoRect.y - groundEnemyRect.y, 2));
    var collision = (0, _gameManager.isCollision)(dinoRect, groundEnemyRect);
    // Check if the groundEnemy belongs to a group
    var groupId = groundEnemy.dataset.groupId;
    var isGrouped = groupId !== undefined;

    // Initialize groupFlags to an empty object
    var groupFlags = {};

    // Check if the dinosaur is within the threshold near the bird
    var isDinoNearGroundEnemy = distance < distanceThreshold;
    // Check if there was a collision in the previous frame
    var hadCollision = groundEnemy.dataset.hadCollision === 'true';

    // Check if the groundEnemy has moved past the dinosaur
    var hasPassedDino = groundEnemyRect.right < dinoRect.left;
    if (isGrouped) {
      // Check if this groundEnemy belongs to a group
      if (!groundEnemyGroups.has(groupId)) {
        // If the group does not exist, create it
        groundEnemyGroups.set(groupId, {
          isDinoNear: false,
          hadCollision: false,
          comboIncremented: false
        });
      }

      // Update the group's flags based on individual groundEnemies
      groupFlags = groundEnemyGroups.get(groupId);

      // Update the flags for this groundEnemy in the group
      groupFlags.isDinoNear = groupFlags.isDinoNear || groundEnemy.dataset.isDinoNear === 'true';
      groupFlags.hadCollision = groupFlags.hadCollision || hadCollision;

      // Check if the groundEnemy has moved past the dinosaur within the group
      groupFlags.hasPassedDino = groupFlags.hasPassedDino || hasPassedDino;
    }
    if (isDinoNearGroundEnemy) {
      // If the dinosaur is within the threshold, set the flag to true
      groundEnemy.dataset.isDinoNear = 'true';
    } else {
      // If the dinosaur is not within the threshold, set the flag to false
      groundEnemy.dataset.isDinoNear = 'false';
    }
    if (isGrouped && groupFlags.isDinoNear && !groupFlags.hadCollision && groupFlags.hasPassedDino && !groupFlags.comboIncremented) {
      // Increment combo only if there was no collision in the previous frame
      // and the groundEnemy group has moved past the dinosaur without a new collision
      var currentMultiplierRatio = getMultiplierRatio();
      setMultiplierRatio(currentMultiplierRatio += 1);
      (0, _gameManager.updateMultiplierInterface)();
      // const newElement = document.createElement('div');
      // newElement.classList.add('one-up');
      // newElement.style.position = 'absolute';
      // newElement.textContent = '+1x';
      // groundEnemy.appendChild(newElement);
      // setTimeout(() => {
      //   newElement.remove();
      // }, 600);
      // Set the comboIncremented flag for the entire group
      groupFlags.comboIncremented = true;
    }
    if (!groundEnemy.dataset.hadCollision && collision === true && !groundEnemy.dataset.scoreUpdated) {
      if (getPlayerImmunity() && getHasStar()) {
        var text = document.createElement('div');
        text.classList.add('enemy-plus-points');
        text.style.position = 'absolute';
        text.style.left = groundEnemy.offsetLeft + 'px';
        text.style.top = groundEnemy.offsetTop - 70 + 'px';
        groundEnemy.parentNode.insertBefore(text, groundEnemy);
        var points = getMultiplierRatio() * getObstaclePoints();
        text.textContent = "+".concat(points);
        (0, _gameManager.updateScoreWithPoints)(points);
        groundEnemy.classList.add('penguin-die');
        groundEnemy.dataset.scoreUpdated = true;
        text.addEventListener('animationend', function () {
          text.remove();
        });
        // After the transition, remove the groundEnemy
        groundEnemy.addEventListener('animationend', function () {
          groundEnemy.remove();
        });
      } else {
        groundEnemy.dataset.hadCollision = true;
      }
    }
    var extraSpeedFactor = parseFloat(groundEnemy.dataset.groundEnemyExtraSpeedFactor || 0);
    (0, _updateCustomProperty.incrementCustomProperty)(groundEnemy, '--left', delta * speedScale * -1 * (SPEED + extraSpeedFactor));
    if ((0, _updateCustomProperty.getCustomProperty)(groundEnemy, '--left') <= -100) {
      groundEnemy.remove();
    }
  });
  if (nextGroundEnemyTime <= 0 && getIsGroundEnemyRunning()) {
    generateRandomEnemy();
    nextGroundEnemyTime = randomNumberBetween(GROUND_ENEMY_INTERVAL_MIN, GROUND_ENEMY_INTERVAL_MAX) / speedScale;
  }
  nextGroundEnemyTime -= delta;
}
function getGroundEnemyRects() {
  return _toConsumableArray(document.querySelectorAll('[data-ground-enemy]')).map(function (groundEnemy) {
    return groundEnemy.getBoundingClientRect();
  });
}

// Array of possible groundEnemy images with associated weights
var groundEnemyObj = {
  rollingPenguin: {
    weight: 1,
    class: 'idle-penguin',
    speedFactor: -0.05
  },
  spinningPenguin: {
    weight: 1,
    class: 'spinning-penguin',
    speedFactor: 0
  },
  walkingPenguin: {
    weight: 1,
    class: 'walking-penguin',
    speedFactor: -0.035
  }
  // Add more image sources with corresponding weights
};

var normalizedGroundEnemyWeights = (0, _platform.normalizeWeights)(groundEnemyObj);
function createGroundEnemy(newPosition, groupId) {
  var randomBuffKey = (0, _platform.getRandomWeighted)(normalizedGroundEnemyWeights);
  console.log(randomBuffKey);
  var groundEnemy = document.createElement('div');
  groundEnemy.dataset.groundEnemy = true;
  groundEnemy.dataset.groundEnemyType = randomBuffKey;
  groundEnemy.classList.add('ground-enemy', groundEnemyObj[randomBuffKey].class, 'game-element');
  if (groundEnemyObj[randomBuffKey].speedFactor) {
    groundEnemy.dataset.groundEnemyExtraSpeedFactor = groundEnemyObj[randomBuffKey].speedFactor;
  } else groundEnemy.dataset.groundEnemyExtraSpeedFactor = 0;
  (0, _updateCustomProperty.setCustomProperty)(groundEnemy, '--left', newPosition);
  (0, _updateCustomProperty.setCustomProperty)(groundEnemy, 'height', '8%');

  // Set the groupId as a data attribute on the groundEnemy element
  groundEnemy.dataset.groupId = groupId;
  worldElem.append(groundEnemy);
  if (randomBuffKey == 'rollingPenguin') {
    setTimeout(function () {
      groundEnemy.classList.remove('idle-penguin');
      groundEnemy.classList.add('dive-penguin');
    }, 1000);
    groundEnemy.addEventListener('animationend', function () {
      // Animation ends, add 'rolling-penguin' class
      groundEnemy.classList.remove('dive-penguin');
      groundEnemy.classList.add('rolling-penguin');
      groundEnemy.dataset.groundEnemyExtraSpeedFactor = 0;
    });
  }
}
function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
},{"../utility/updateCustomProperty":"../utility/updateCustomProperty.js","./player-controller":"../elements/player-controller.js","../game-manager":"../game-manager.js","../game-state":"../game-state.js","../elements-refs":"../elements-refs.js","../utility/toggle-element":"../utility/toggle-element.js","./platform":"../elements/platform.js"}],"../elements/bird.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBirdRects = getBirdRects;
exports.setupBird = setupBird;
exports.updateBird = updateBird;
var _updateCustomProperty = require("../utility/updateCustomProperty");
var _playerController = require("./player-controller");
var _gameManager = require("../game-manager");
var _gameState = _interopRequireDefault(require("../game-state"));
var _elementsRefs = require("../elements-refs");
var _toggleElement = require("../utility/toggle-element");
var _platform = require("./platform");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var setMultiplierRatio = _gameState.default.setMultiplierRatio,
  getMultiplierRatio = _gameState.default.getMultiplierRatio,
  getPlayerImmunity = _gameState.default.getPlayerImmunity,
  getHasStar = _gameState.default.getHasStar,
  getObstaclePoints = _gameState.default.getObstaclePoints,
  getIsBirdRunning = _gameState.default.getIsBirdRunning;
var cactiPositions = [];
var SPEED = 0.03;
var BIRD_INTERVAL_MIN = 500;
var BIRD_INTERVAL_MAX = 2000;
var worldElem = document.querySelector('[data-world]');
var nextBirdTime;
function setupBird() {
  nextBirdTime = BIRD_INTERVAL_MIN;
  document.querySelectorAll('[data-bird]').forEach(function (bird) {
    bird.remove();
  });
}
function isPositionOccupied(position) {
  return cactiPositions.includes(position);
}
var groupIdCounter = 0; // Counter to generate unique groupIds

function generateRandomCacti() {
  var minCacti = 1;
  var maxCacti = 1; // Adjust the range as needed
  var groupId; // Declare groupId outside the loop

  var numberOfCacti = randomNumberBetween(minCacti, maxCacti);
  if (numberOfCacti >= minCacti) {
    groupId = groupIdCounter++;
    for (var i = 0; i < numberOfCacti; i++) {
      var newPosition = void 0;
      do {
        newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
      } while (isPositionOccupied(newPosition));
      cactiPositions.push({
        position: newPosition,
        groupId: groupId
      });
      createBird(newPosition, groupId);
    }
  } else {
    var _newPosition;
    do {
      _newPosition = randomNumberBetween(95, 103); // Adjust the range of positions as needed
    } while (isPositionOccupied(_newPosition));
    cactiPositions.push({
      position: _newPosition
    });
    createBird(_newPosition);
  }

  // Clear cacti positions for the next round (optional)
  cactiPositions.length = 0;
}
var distanceThreshold = 200; // Adjust this threshold as needed
var birdGroups = new Map(); // Declare birdGroups outside the updateBird function

function updateBird(delta, speedScale) {
  document.querySelectorAll('[data-bird]').forEach(function (bird) {
    // Check if the comboIncremented flag is already set for this bird
    var comboIncremented = bird.dataset.comboIncremented === 'true';

    // Get positions of the dinosaur and bird
    var dinoRect = (0, _playerController.getDinoRect)();
    var birdRect = bird.getBoundingClientRect();

    // Calculate distance
    var distance = Math.sqrt(Math.pow(dinoRect.x - birdRect.x, 2) + Math.pow(dinoRect.y - birdRect.y, 2));
    var collision = (0, _gameManager.isCollision)(dinoRect, birdRect);

    // Check if the bird belongs to a group
    var groupId = bird.dataset.groupId;
    var isGrouped = groupId !== undefined;

    // Initialize groupFlags to an empty object
    var groupFlags = {};
    // Check if the dinosaur is within the threshold near the bird
    var isDinoNearBird = distance < distanceThreshold;

    // Check if there was a collision in the previous frame
    var hadCollision = bird.dataset.hadCollision === 'true';

    // Check if the bird has moved past the dinosaur
    var hasPassedDino = birdRect.right < dinoRect.left;
    if (isGrouped) {
      // Check if this bird belongs to a group
      if (!birdGroups.has(groupId)) {
        // If the group does not exist, create it
        birdGroups.set(groupId, {
          isDinoNear: false,
          hadCollision: false,
          comboIncremented: false
        });
      }

      // Update the group's flags based on individual birds
      groupFlags = birdGroups.get(groupId);

      // Update the flags for this bird in the group
      groupFlags.isDinoNear = groupFlags.isDinoNear || bird.dataset.isDinoNear === 'true';
      groupFlags.hadCollision = groupFlags.hadCollision || hadCollision;

      // Check if the bird has moved past the dinosaur within the group
      groupFlags.hasPassedDino = groupFlags.hasPassedDino || hasPassedDino;
    }
    if (isDinoNearBird) {
      // If the dinosaur is within the threshold, set the flag to true
      bird.dataset.isDinoNear = 'true';
    } else {
      // If the dinosaur is not within the threshold, set the flag to false
      bird.dataset.isDinoNear = 'false';
    }
    if (isGrouped && groupFlags.isDinoNear && !groupFlags.hadCollision && groupFlags.hasPassedDino && !groupFlags.comboIncremented) {
      // Increment combo only if there was no collision in the previous frame
      // and the bird group has moved past the dinosaur without a new collision
      var currentMultiplierRatio = getMultiplierRatio();
      setMultiplierRatio(currentMultiplierRatio += 1);
      (0, _gameManager.updateMultiplierInterface)();
      // const newElement = document.createElement('div');
      // newElement.classList.add('one-up');
      // newElement.style.position = 'absolute';
      // newElement.textContent = '+1x';
      // bird.appendChild(newElement);
      // setTimeout(() => {
      //   newElement.remove();
      // }, 600);
      // Set the comboIncremented flag for the entire group
      groupFlags.comboIncremented = true;
    }
    if (!bird.dataset.hadCollision && collision === true && !bird.dataset.scoreUpdated) {
      if (getPlayerImmunity() && getHasStar()) {
        var text = document.createElement('div');
        text.classList.add('enemy-plus-points');
        text.style.position = 'absolute';
        text.style.left = bird.offsetLeft + 'px';
        text.style.top = bird.offsetTop - 70 + 'px';
        bird.parentNode.insertBefore(text, bird);
        var points = getMultiplierRatio() * getObstaclePoints();
        text.textContent = "+".concat(points);
        (0, _gameManager.updateScoreWithPoints)(points);
        bird.classList.add('enemy-die');
        bird.dataset.scoreUpdated = true;
        // After the transition, remove the bird
        bird.addEventListener('animationend', function () {
          bird.remove();
        });
      } else {
        bird.dataset.hadCollision = true;
      }
    }
    (0, _updateCustomProperty.incrementCustomProperty)(bird, '--left', delta * speedScale * SPEED * -1);
    if ((0, _updateCustomProperty.getCustomProperty)(bird, '--left') <= -100) {
      bird.remove();
    }
  });
  if (nextBirdTime <= 0 && getIsBirdRunning()) {
    generateRandomCacti();
    nextBirdTime = randomNumberBetween(BIRD_INTERVAL_MIN, BIRD_INTERVAL_MAX) / speedScale;
  }
  nextBirdTime -= delta;
}
function getBirdRects() {
  return _toConsumableArray(document.querySelectorAll('[data-bird]')).map(function (bird) {
    return bird.getBoundingClientRect();
  });
}

// Array of possible bird images with associated weights
var birdObj = {
  penguin: {
    weight: 1
  }
  // Add more image sources with corresponding weights
};

var normalizedBirdWeights = (0, _platform.normalizeWeights)(birdObj);
function createBird(newPosition, groupId) {
  var bird = document.createElement('div');
  bird.dataset.bird = true;
  bird.classList.add('bird', 'flying-penguin', 'game-element');

  // Set the groupId as a data attribute on the bird element
  bird.dataset.groupId = groupId;
  (0, _updateCustomProperty.setCustomProperty)(bird, '--left', newPosition);
  (0, _updateCustomProperty.setCustomProperty)(bird, 'height', "".concat(randomNumberBetween(8, 13), "%"));
  worldElem.append(bird);
}
function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
},{"../utility/updateCustomProperty":"../utility/updateCustomProperty.js","./player-controller":"../elements/player-controller.js","../game-manager":"../game-manager.js","../game-state":"../game-state.js","../elements-refs":"../elements-refs.js","../utility/toggle-element":"../utility/toggle-element.js","./platform":"../elements/platform.js"}],"../apis.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleNewHighScore = exports.getAllHighScoreUsers = exports.checkIfNewHighScore = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
//gets all users from collection
var getAllHighScoreUsers = exports.getAllHighScoreUsers = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var response;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return fetch('http://3.12.120.102:3001/scores/users');
        case 3:
          response = _context.sent;
          if (response.ok) {
            _context.next = 6;
            break;
          }
          throw new Error("HTTP error! Status: ".concat(response.status));
        case 6:
          _context.next = 8;
          return response.json();
        case 8:
          return _context.abrupt("return", _context.sent);
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.log('getAllHighScoreUsers error', _context.t0);
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 11]]);
  }));
  return function getAllHighScoreUsers() {
    return _ref.apply(this, arguments);
  };
}();

//insertions instead of delete

//deletes entry by field
var handleDeleteEntry = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(entryField) {
    var response, errorData;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return fetch("http://3.12.120.102:3001/scores/delete-entry/".concat(entryField), {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        case 3:
          response = _context2.sent;
          if (response.ok) {
            _context2.next = 9;
            break;
          }
          _context2.next = 7;
          return response.json();
        case 7:
          errorData = _context2.sent;
          if (errorData.type === 'no user found') {
            alert('ERROR: No entry found with the specified ID');
          } else {
            alert('ERROR: Something went wrong');
          }
        case 9:
          _context2.next = 14;
          break;
        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          // Handle other errors (e.g., network issues)
          console.log('handleDeleteEntry error', _context2.t0);
        case 14:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 11]]);
  }));
  return function handleDeleteEntry(_x) {
    return _ref2.apply(this, arguments);
  };
}();

//sorts all collection data in descending order by score, and deletes last entry by username
var handleSortAndDeleteLastEntry = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return getAllHighScoreUsers().then(function (data) {
            var sortedData = data.users.sort(function (a, b) {
              return parseInt(b.score, 10) - parseInt(a.score, 10);
            });
            handleDeleteEntry(sortedData[sortedData.length - 1].username);
          });
        case 2:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function handleSortAndDeleteLastEntry() {
    return _ref3.apply(this, arguments);
  };
}();

//adds new high score
var handleNewHighScore = exports.handleNewHighScore = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(username, score) {
    var response, errorData;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return fetch('http://3.12.120.102:3001/scores/new-high', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: username,
              score: score
            })
          });
        case 3:
          response = _context4.sent;
          console.log(response);
          if (response.ok) {
            _context4.next = 17;
            break;
          }
          console.log('not ok');
          // Check if the response status is not OK (e.g., 4xx or 5xx)
          _context4.next = 9;
          return response.json();
        case 9:
          errorData = _context4.sent;
          if (!(errorData.type === 'username already exists')) {
            _context4.next = 14;
            break;
          }
          return _context4.abrupt("return", console.log('username already exists'));
        case 14:
          alert('ERROR: Something went wrong');
        case 15:
          _context4.next = 19;
          break;
        case 17:
          _context4.next = 19;
          return handleSortAndDeleteLastEntry();
        case 19:
          _context4.next = 24;
          break;
        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](0);
          // Handle other errors (e.g., network issues)
          console.log('handleNewHighScore error', _context4.t0);
        case 24:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 21]]);
  }));
  return function handleNewHighScore(_x2, _x3) {
    return _ref4.apply(this, arguments);
  };
}();
var checkIfNewHighScore = exports.checkIfNewHighScore = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(score) {
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function checkIfNewHighScore(_x4) {
    return _ref5.apply(this, arguments);
  };
}();
},{}],"../elements/leaderboard.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLeaderboard = createLeaderboard;
exports.getSuffix = getSuffix;
exports.sortLeaderboard = sortLeaderboard;
var _apis = require("../apis");
function sortLeaderboard(data) {
  return data.users.sort(function (a, b) {
    return parseInt(b.score, 10) - parseInt(a.score, 10);
  });
}
function getSuffix(number) {
  var lastDigit = number % 10;
  if (number === 11 || number === 12 || number === 13) {
    return 'th';
  } else if (lastDigit === 1) {
    return 'st';
  } else if (lastDigit === 2) {
    return 'nd';
  } else if (lastDigit === 3) {
    return 'rd';
  } else {
    return 'th';
  }
}
function createLeaderboard(leaderboardElem) {
  //for right sidebar
  var personalBestLvl = document.querySelector('[data-personal-best-lvl]');
  var personalBestCombo = document.querySelector('[data-personal-best-combo]');
  var personalBestScoreElem = document.querySelector('[data-personal-best-score]');

  // Retrieve values from local storage
  var storedPersonalBestLvl = localStorage.getItem('lion-best-lvl');
  var storedPersonalBestCombo = localStorage.getItem('lion-best-combo');
  var storedPersonalBestScore = localStorage.getItem('lion-high-score');

  // Check if values exist in local storage before updating the elements
  if (storedPersonalBestLvl !== null) {
    personalBestLvl.textContent = storedPersonalBestLvl;
  }
  if (storedPersonalBestCombo !== null) {
    personalBestCombo.textContent = storedPersonalBestCombo;
  }
  if (storedPersonalBestScore !== null) {
    personalBestScoreElem.textContent = storedPersonalBestScore;
  }
  (0, _apis.getAllHighScoreUsers)().then(function (data) {
    var sortedData = sortLeaderboard(data);

    // Map data to HTML elements and append to container
    sortedData.forEach(function (item, index) {
      var rowElement = document.createElement('tr');
      rowElement.classList.add('leaderboard-row');
      rowElement.id = "leaderboard-row-".concat(index + 1);

      // Create and append the "Rank" cell
      var rankCell = document.createElement('td');
      rankCell.classList.add('leaderboard-rank-item');
      var indexSuffix = getSuffix(index + 1);
      rankCell.textContent = "".concat(index + 1).concat(indexSuffix);
      rowElement.appendChild(rankCell);

      // Create and append the "Score" cell
      var scoreCell = document.createElement('td');
      scoreCell.classList.add('leaderboard-score-item');
      scoreCell.textContent = "".concat(item.score);
      rowElement.appendChild(scoreCell);

      // Create and append the "Name" cell
      var nameCell = document.createElement('td');
      nameCell.classList.add('leaderboard-name-item');
      nameCell.textContent = "".concat(item.username);
      rowElement.appendChild(nameCell);

      // Append the entire row to the body
      leaderboardElem.appendChild(rowElement);
    });
  });
}
},{"../apis":"../apis.js"}],"../utility/validate-input.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateInput = validateInput;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var badWordsArray = ['ass', 'fuc', 'fuk', 'fuq', 'fux', 'fck', 'coc', 'cok', 'coq', 'kox', 'koc', 'kok', 'koq', 'cac', 'cak', 'caq', 'kac', 'kak', 'kaq', 'dic', 'dik', 'diq', 'dix', 'dck', 'pns', 'psy', 'fag', 'fgt', 'ngr', 'nig', 'cnt', 'knt', 'sht', 'dsh', 'twt', 'bch', 'cum', 'clt', 'kum', 'klt', 'suc', 'suk', 'suq', 'sck', 'lic', 'lik', 'liq', 'lck', 'jiz', 'jzz', 'gay', 'gey', 'gei', 'gai', 'vag', 'vgn', 'sjv', 'fap', 'prn', 'jew', 'joo', 'gvr', 'pus', 'pis', 'pss', 'snm', 'tit', 'fku', 'fcu', 'fqu', 'hor', 'slt', 'jap', 'wap', 'wop', 'kik', 'kyk', 'kyc', 'kyq', 'dyk', 'dyq', 'dyc', 'kkk', 'jyz', 'prk', 'prc', 'prq', 'mic', 'mik', 'miq', 'myc', 'myk', 'myq', 'guc', 'guk', 'guq', 'giz', 'gzz', 'sex', 'sxx', 'sxi', 'sxe', 'sxy', 'xxx', 'wac', 'wak', 'waq', 'wck', 'pot', 'thc', 'vaj', 'vjn', 'nut', 'std', 'lsd', 'poo', 'azn', 'pcp', 'dmn', 'orl', 'anl', 'ans', 'muf', 'mff', 'phk', 'phc', 'phq', 'xtc', 'tok', 'toc', 'toq', 'mlf', 'rac', 'rak', 'raq', 'rck', 'sac', 'sak', 'saq', 'pms', 'nad', 'ndz', 'nds', 'wtf', 'sol', 'sob', 'fob', 'kys'];
function checkForBadWords(input) {
  var _iterator = _createForOfIteratorHelper(badWordsArray),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var word = _step.value;
      if (input.includes(word)) {
        return true; // bad word detected
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return false; // No bad words detected
}

function validateInput() {
  var userInput = document.getElementById('newHighScoreInput').value;
  if (checkForBadWords(userInput)) {
    return false;
  } else {
    return true;
  }
}
},{}],"../elements/score-multiplier.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMultiplierRects = getMultiplierRects;
exports.setupMultiplier = setupMultiplier;
exports.updateMultiplier = updateMultiplier;
var _updateCustomProperty = require("../utility/updateCustomProperty");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var SPEED = 0.05;
var MULTIPLIER_INTERVAL_MIN = 10000;
var MULTIPLIER_INTERVAL_MAX = 21000;
var worldElem = document.querySelector('[data-world]');
var nextMultiplierTime;
function setupMultiplier() {
  nextMultiplierTime = MULTIPLIER_INTERVAL_MIN;
  document.querySelectorAll('[data-multiplier]').forEach(function (multiplier) {
    multiplier.remove();
  });
}
function updateMultiplier(delta, speedScale) {
  document.querySelectorAll('[data-multiplier]').forEach(function (multiplier) {
    (0, _updateCustomProperty.incrementCustomProperty)(multiplier, '--left', delta * speedScale * SPEED * -1);
    if ((0, _updateCustomProperty.getCustomProperty)(multiplier, '--left') <= -100) {
      multiplier.remove();
    }
  });
  if (nextMultiplierTime <= 0) {
    createMultipliers();
    nextMultiplierTime = randomNumberBetween(MULTIPLIER_INTERVAL_MIN, MULTIPLIER_INTERVAL_MAX) / speedScale;
  }
  nextMultiplierTime -= delta;
}
function getMultiplierRects() {
  return _toConsumableArray(document.querySelectorAll('[data-multiplier]')).map(function (multiplier) {
    return {
      id: multiplier.id,
      rect: multiplier.getBoundingClientRect(),
      multiplier: multiplier.dataset.multiplier
    };
  });
}
function getRandomKeyWeighted(obj) {
  var keys = Object.keys(obj);
  var probabilities = [0.7, 0.2, 0.1]; // Adjust probabilities as needed
  var randomValue = Math.random();
  var cumulativeProbability = 0;
  for (var i = 0; i < keys.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomValue <= cumulativeProbability) {
      return keys[i];
    }
  }

  // Default case (fallback)
  return keys[keys.length - 1];
}
function createMultipliers() {
  var multiplier = document.createElement('div');
  multiplier.dataset.multiplier = multiplierRatios[getRandomKeyWeighted(multiplierRatios)];
  multiplier.textContent = multiplier.dataset.multiplier;
  multiplier.classList.add('multiplier', 'floating-item');
  multiplier.id = Math.random().toString(16).slice(2);
  (0, _updateCustomProperty.setCustomProperty)(multiplier, '--left', 100);
  worldElem.append(multiplier);
}
function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
var multiplierRatios = {
  x2: 2,
  x5: 5,
  x10: 10
};
},{"../utility/updateCustomProperty":"../utility/updateCustomProperty.js"}],"../elements/magnet.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMagnetRects = getMagnetRects;
exports.setupMagnet = setupMagnet;
exports.updateMagnet = updateMagnet;
var _updateCustomProperty = require("../utility/updateCustomProperty");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var SPEED = 0.05;
var MAGNET_INTERVAL_MIN = 1000;
var MAGNET_INTERVAL_MAX = 1300;
var worldElem = document.querySelector('[data-world]');
var nextMagnetTime;
function setupMagnet() {
  nextMagnetTime = MAGNET_INTERVAL_MIN;
  document.querySelectorAll('[data-magnet]').forEach(function (magnet) {
    magnet.remove();
  });
}
function updateMagnet(delta, speedScale) {
  document.querySelectorAll('[data-magnet]').forEach(function (magnet) {
    (0, _updateCustomProperty.incrementCustomProperty)(magnet, '--left', delta * speedScale * SPEED * -1);
    if ((0, _updateCustomProperty.getCustomProperty)(magnet, '--left') <= -100) {
      magnet.remove();
    }
  });
  if (nextMagnetTime <= 0) {
    createMagnet();
    nextMagnetTime = randomNumberBetween(MAGNET_INTERVAL_MIN, MAGNET_INTERVAL_MAX) / speedScale;
  }
  nextMagnetTime -= delta;
}
function getMagnetRects() {
  return _toConsumableArray(document.querySelectorAll('[data-magnet]')).map(function (magnet) {
    return {
      id: magnet.id,
      rect: magnet.getBoundingClientRect(),
      magnet: magnet.dataset.magnet
    };
  });
}
function createMagnet() {
  var magnet = document.createElement('div');
  magnet.dataset.magnet = true;
  magnet.textContent = 'magnet';
  magnet.classList.add('magnet', 'bouncing-item');
  magnet.id = Math.random().toString(16).slice(2);
  (0, _updateCustomProperty.setCustomProperty)(magnet, '--left', 100);
  worldElem.append(magnet);
}
function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
},{"../utility/updateCustomProperty":"../utility/updateCustomProperty.js"}],"../elements/heart.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHeartRects = getHeartRects;
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function getHeartRects() {
  return _toConsumableArray(document.querySelectorAll('[data-heart]')).map(function (heart) {
    return {
      id: heart.id,
      rect: heart.getBoundingClientRect(),
      heart: heart.dataset.heart
    };
  });
}
},{}],"../elements/leaf.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLeafRects = getLeafRects;
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function getLeafRects() {
  return _toConsumableArray(document.querySelectorAll('[data-leaf]')).map(function (leaf) {
    return {
      id: leaf.id,
      rect: leaf.getBoundingClientRect(),
      heart: leaf.dataset.leaf
    };
  });
}
},{}],"../elements/flag.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFlagRects = getFlagRects;
exports.updateFlag = updateFlag;
var _updateCustomProperty = require("../utility/updateCustomProperty.js");
var _gameState = _interopRequireDefault(require("../game-state"));
var _elementsRefs = require("../elements-refs.js");
var _gameManager = require("../game-manager.js");
var _playerController = require("./player-controller.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var getGroundSpeed = _gameState.default.getGroundSpeed,
  getCurrentPhase = _gameState.default.getCurrentPhase,
  getIsFlagCreated = _gameState.default.getIsFlagCreated,
  setIsFlagCreated = _gameState.default.setIsFlagCreated,
  updateState = _gameState.default.updateState;
var hasAlreadyPassedFlag;
function updateFlag(delta, speedScale) {
  document.querySelectorAll('[data-flag]').forEach(function (flag) {
    var flagRect = flag.getBoundingClientRect();
    var collision = (0, _gameManager.isCollision)((0, _playerController.getDinoRect)(), flagRect);
    var flagLeft = parseFloat(getComputedStyle(flag).left);
    var dinoLeft = parseFloat(getComputedStyle(_elementsRefs.dinoElem).left);
    var passedFlag = dinoLeft > flagLeft;
    if (collision) {
      flag.classList.remove('flag-animation');
      flag.classList.add('flag-empty');
    }
    if (passedFlag && !hasAlreadyPassedFlag) {
      updateState({
        isGroundLayer2Running: false
      });
      (0, _gameManager.updateNotification)("".concat(getCurrentPhase(), "!"), 2000, 0);
      hasAlreadyPassedFlag = true;
    }
    (0, _updateCustomProperty.incrementCustomProperty)(flag, '--left', delta * speedScale * getGroundSpeed() * -1);
    if ((0, _updateCustomProperty.getCustomProperty)(flag, '--left') <= -100) {
      flag.remove();
    }
  });
  if (getCurrentPhase() === 'bonus' && getIsFlagCreated() === false) {
    createFlag();
    setIsFlagCreated(true);
  }
}
function getFlagRects() {
  return _toConsumableArray(document.querySelectorAll('[data-flag]')).map(function (flag) {
    return {
      id: flag.id,
      rect: flag.getBoundingClientRect(),
      flag: flag.dataset.flag
    };
  });
}
function createFlag() {
  hasAlreadyPassedFlag = false;
  var flag = document.createElement('div');
  flag.dataset.flag = true;
  flag.classList.add('flag', 'flag-animation');
  flag.id = Math.random().toString(16).slice(2);
  (0, _updateCustomProperty.setCustomProperty)(flag, '--left', 100);
  _elementsRefs.worldElem.append(flag);
}
},{"../utility/updateCustomProperty.js":"../utility/updateCustomProperty.js","../game-state":"../game-state.js","../elements-refs.js":"../elements-refs.js","../game-manager.js":"../game-manager.js","./player-controller.js":"../elements/player-controller.js"}],"../elements/star.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStarRects = getStarRects;
exports.setupStar = setupStar;
exports.updateStar = updateStar;
var _updateCustomProperty = require("../utility/updateCustomProperty");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var SPEED = 0.05;
var STARS_INTERVAL_MIN = 1000;
var STARS_INTERVAL_MAX = 1300;
var worldElem = document.querySelector('[data-world]');
var nextStarTime;
function setupStar() {
  nextStarTime = STARS_INTERVAL_MIN;
  document.querySelectorAll('[data-star]').forEach(function (star) {
    star.remove();
  });
}
function updateStar(delta, speedScale) {
  document.querySelectorAll('[data-star]').forEach(function (star) {
    (0, _updateCustomProperty.incrementCustomProperty)(star, '--left', delta * speedScale * SPEED * -1);
    if ((0, _updateCustomProperty.getCustomProperty)(star, '--left') <= -100) {
      star.remove();
    }
  });
  if (nextStarTime <= 0) {
    createStars();
    nextStarTime = randomNumberBetween(STARS_INTERVAL_MIN, STARS_INTERVAL_MAX) / speedScale;
  }
  nextStarTime -= delta;
}
function getStarRects() {
  return _toConsumableArray(document.querySelectorAll('[data-star]')).map(function (star) {
    return {
      id: star.id,
      rect: star.getBoundingClientRect(),
      star: star.dataset.star
    };
  });
}
function createStars() {
  var star = document.createElement('div');
  star.dataset.star = true;
  star.textContent = 'star';
  star.classList.add('star', 'bouncing-item');
  star.id = Math.random().toString(16).slice(2);
  (0, _updateCustomProperty.setCustomProperty)(star, '--left', 100);
  worldElem.append(star);
}
function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
},{"../utility/updateCustomProperty":"../utility/updateCustomProperty.js"}],"../elements/coin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCoinRects = getCoinRects;
exports.setupCoin = setupCoin;
exports.updateCoin = updateCoin;
var _updateCustomProperty = require("../utility/updateCustomProperty");
var _playerController = require("./player-controller");
var _gameManager = require("../game-manager");
var _gameState = _interopRequireDefault(require("../game-state"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var getMagnetSpeedFactor = _gameState.default.getMagnetSpeedFactor,
  getIsCoinsRunning = _gameState.default.getIsCoinsRunning;
var coinPositions = [];
var SPEED = 0.05;
var COIN_INTERVAL_MIN = 75;
var COIN_INTERVAL_MAX = 400;
var worldElem = document.querySelector('[data-world]');
var nextCoinTime;
function setupCoin() {
  nextCoinTime = COIN_INTERVAL_MIN;
  document.querySelectorAll('[data-coin]').forEach(function (coin) {
    coin.remove();
  });
}
function updateCoin(delta, speedScale) {
  document.querySelectorAll('[data-coin]').forEach(function (coin) {
    // Get positions of the dinosaur and coin
    var dinoRect = (0, _playerController.getDinoRect)();
    var coinRect = coin.getBoundingClientRect();
    // Calculate distance
    var distance = Math.sqrt(Math.pow(dinoRect.x - coinRect.x, 2) + Math.pow(dinoRect.y - coinRect.y, 2));

    // If the distance is less than 40px, move the coin towards the dinosaur
    if (coin.dataset.locked === 'true' || distance < 225) {
      // Enter the locking phase
      if (coin.dataset.isLocking === 'false') {
        var angle = Math.atan2(dinoRect.y - coinRect.y, dinoRect.x - coinRect.x);
        var distanceFactor = 0.0025 * distance;
        var speed = SPEED * delta * distanceFactor;
        // Additional logic to move the coin in the opposite direction before locking
        var oppositeDirectionX = Math.cos(angle) * speed * -1 * 2;
        var oppositeDirectionY = Math.sin(angle) * speed * 2;
        (0, _updateCustomProperty.incrementCustomProperty)(coin, '--left', oppositeDirectionX);
        (0, _updateCustomProperty.incrementCustomProperty)(coin, '--bottom', oppositeDirectionY);
        setTimeout(function () {
          coin.dataset.locked = 'true';
          coin.dataset.isLocking = 'true';
        }, coin.dataset.isLockingDuration); // Adjust the timeout duration as needed
      } else {
        //lock the coin on the player
        coin.dataset.locked = 'true';
        var _angle = Math.atan2(dinoRect.y - coinRect.y, dinoRect.x - coinRect.x);
        var magneticSpeedFactor = coin.dataset.isMagnetLocked === 'true' ? coin.dataset.isMagnetSpeedFactor : 1;
        var _distanceFactor = 0.0025 * distance;
        var _speed = SPEED * delta * magneticSpeedFactor + _distanceFactor;

        // Calculate incremental movement based on angle and speed
        var deltaX = Math.cos(_angle) * _speed;
        var deltaY = Math.sin(_angle) * _speed;

        // Update coin position incrementally
        (0, _updateCustomProperty.incrementCustomProperty)(coin, '--left', deltaX);
        (0, _updateCustomProperty.incrementCustomProperty)(coin, '--bottom', deltaY * -1);
      }
    } else {
      // Move the coin to the left if not close to the dinosaur
      (0, _updateCustomProperty.incrementCustomProperty)(coin, '--left', delta * speedScale * SPEED * -1);
    }

    // Remove the coin if it goes off the screen
    if ((0, _updateCustomProperty.getCustomProperty)(coin, '--left') <= -100) {
      coin.remove();
    }
  });
  if (nextCoinTime <= 0 && getIsCoinsRunning()) {
    createCoins();
    nextCoinTime = randomNumberBetween(COIN_INTERVAL_MIN, COIN_INTERVAL_MAX) / speedScale;
  }
  nextCoinTime -= delta;
}
function getCoinRects() {
  return _toConsumableArray(document.querySelectorAll('[data-coin]')).map(function (coin) {
    return {
      id: coin.id,
      rect: coin.getBoundingClientRect()
    };
  });
}
function createCoins() {
  // Calculate the total weight
  var totalWeight = _gameManager.collectableOptions.reduce(function (sum, item) {
    return sum + item.weight;
  }, 0);

  // Generate a random number between 0 and totalWeight
  var randomWeight = Math.random() * totalWeight;

  // Select a random collectable based on the weighted probabilities
  var cumulativeWeight = 0;
  var selectedCollectable;
  var _iterator = _createForOfIteratorHelper(_gameManager.collectableOptions),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var item = _step.value;
      cumulativeWeight += item.weight;
      if (randomWeight <= cumulativeWeight) {
        selectedCollectable = item;
        break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var element = document.createElement('div');
  element.dataset.coin = true;
  element.dataset.type = selectedCollectable.type;
  element.dataset.locked = 'false';
  element.dataset.isLocking = 'false';
  element.dataset.isMagnetSpeedFactor = randomNumberBetween(1.3, 2.4);
  element.dataset.isLockingDuration = randomNumberBetween(100, 300);
  element.dataset.points = selectedCollectable.points;
  element.classList.add(selectedCollectable.type, 'collectable', 'move-bottom');
  element.id = Math.random().toString(16).slice(2);
  (0, _updateCustomProperty.setCustomProperty)(element, '--left', 100);
  var initialKeyframe = getRandomKeyframe();
  element.style.animationDelay = "-".concat(initialKeyframe, "%");
  worldElem.append(element);
}
function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function getRandomKeyframe() {
  // Return a random number between 0 and 100 (percentage)
  return Math.floor(Math.random() * 101);
}
},{"../utility/updateCustomProperty":"../utility/updateCustomProperty.js","./player-controller":"../elements/player-controller.js","../game-manager":"../game-manager.js","../game-state":"../game-state.js"}],"imgs/icons/Speaker-Off.png":[function(require,module,exports) {
module.exports = "/Speaker-Off.c6acac34.png";
},{}],"imgs/icons/Speaker-On.png":[function(require,module,exports) {
module.exports = "/Speaker-On.4eca78fe.png";
},{}],"imgs/icons/Pause.png":[function(require,module,exports) {
module.exports = "/Pause.af4380de.png";
},{}],"imgs/icons/Play.png":[function(require,module,exports) {
module.exports = "/Play.59a6ba15.png";
},{}],"imgs/buffs/glasses.png":[function(require,module,exports) {
module.exports = "/glasses.73339926.png";
},{}],"imgs/icons/Redo.png":[function(require,module,exports) {
module.exports = "/Redo.35a20d07.png";
},{}],"imgs/backgrounds/Foreground-Trees.png":[function(require,module,exports) {
module.exports = "/Foreground-Trees.1c0db94f.png";
},{}],"imgs/buffs/filet.png":[function(require,module,exports) {
module.exports = "/filet.120468c3.png";
},{}],"imgs/buffs/lucky-mittens.png":[function(require,module,exports) {
module.exports = "/lucky-mittens.430fec99.png";
},{}],"imgs/buffs/trusty-pocket-watch.png":[function(require,module,exports) {
module.exports = "/trusty-pocket-watch.4cd4b74a.png";
},{}],"imgs/buffs/watermelon.png":[function(require,module,exports) {
module.exports = "/watermelon.76a83d58.png";
},{}],"imgs/buffs/suspiciously-plain-chest.png":[function(require,module,exports) {
module.exports = "/suspiciously-plain-chest.e290c4a2.png";
},{}],"imgs/buffs/emotional-support-water-bottle.png":[function(require,module,exports) {
module.exports = "/emotional-support-water-bottle.f4b3cab8.png";
},{}],"imgs/buffs/pouch.png":[function(require,module,exports) {
module.exports = "/pouch.d2326106.png";
},{}],"imgs/buffs/moms-cookies.png":[function(require,module,exports) {
module.exports = "/moms-cookies.0c330767.png";
},{}],"imgs/buffs/feather.png":[function(require,module,exports) {
module.exports = "/feather.e53f1f5f.png";
},{}],"imgs/buffs/cape.png":[function(require,module,exports) {
module.exports = "/cape.922da988.png";
},{}],"imgs/buffs/amulet.png":[function(require,module,exports) {
module.exports = "/amulet.e627f87d.png";
},{}],"imgs/buffs/book.png":[function(require,module,exports) {
module.exports = "/book.8e749379.png";
},{}],"imgs/buffs/coins.png":[function(require,module,exports) {
module.exports = "/coins.7d15c922.png";
},{}],"imgs/icons/Star.png":[function(require,module,exports) {
module.exports = "/Star.3e18d544.png";
},{}],"../elements/particle-systems.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.snow = exports.confetti = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
//snow particle system
var snow = exports.snow = {
  el: '#snow',
  density: 12500,
  // higher = fewer bits
  maxHSpeed: 1,
  // How much do you want them to move horizontally
  minFallSpeed: 0.5,
  canvas: null,
  ctx: null,
  particles: [],
  colors: [],
  mp: 1,
  quit: false,
  paused: false,
  init: function init() {
    this.quit = false;
    this.canvas = document.querySelector(this.el);
    this.ctx = this.canvas.getContext('2d');
    this.reset();
    requestAnimationFrame(this.render.bind(this));
    window.addEventListener('resize', this.reset.bind(this));
  },
  reset: function reset() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.particles = [];
    this.mp = Math.ceil(this.w * this.h / this.density);
    for (var i = 0; i < this.mp; i++) {
      var size = Math.random() * 1.7 + 3;
      this.particles.push({
        x: Math.random() * this.w,
        //x-coordinate
        y: Math.random() * this.h,
        //y-coordinate
        w: size,
        h: size,
        vy: this.minFallSpeed + Math.random(),
        //density
        vx: Math.random() * this.maxHSpeed - this.maxHSpeed / 2,
        fill: '#ffffff',
        s: Math.random() * 0.2 - 0.1
      });
    }
  },
  render: function render() {
    var _this = this;
    if (this.paused) {
      return;
    }
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.particles.forEach(function (p, i) {
      p.y += p.vy;
      p.x += p.vx;
      _this.ctx.fillStyle = p.fill;
      _this.ctx.fillRect(p.x, p.y, p.w, p.h);
      if (p.x > _this.w + 5 || p.x < -5 || p.y > _this.h) {
        p.x = Math.random() * _this.w;
        p.y = -10;
      }
    });
    if (this.quit) {
      return;
    }
    requestAnimationFrame(this.render.bind(this));
  },
  togglePause: function togglePause() {
    this.paused = !this.paused;
    if (this.paused) {
      // Pause actions
      this.quit = true; // Stop the animation loop
      // Additional pause logic if needed
    } else {
      // Resume actions
      this.quit = false; // Resume the animation loop
      requestAnimationFrame(this.render.bind(this));
      // Additional resume logic if needed
    }
  },
  destroy: function destroy() {
    this.quit = true;
  }
};

//confetti particle system
var confetti = exports.confetti = _defineProperty(_defineProperty(_defineProperty(_defineProperty({
  el: '#confetti',
  density: 800,
  maxHSpeed: 2.1,
  // Increase max horizontal speed
  minFallSpeed: 2,
  // Increase min fall speed
  canvas: null,
  ctx: null,
  particles: [],
  colors: ['#009CDE', '#ffffff'],
  // Blue and white colors
  mp: 1,
  quit: false,
  initialFall: true,
  init: function init() {
    this.particles = [];
    this.quit = false;
    this.canvas = document.querySelector(this.el);
    this.ctx = this.canvas.getContext('2d');
    this.reset();
    requestAnimationFrame(this.render.bind(this));
    window.addEventListener('resize', this.reset.bind(this));
  }
}, "initialFall", false), "reset", function reset() {
  this.w = window.innerWidth;
  this.h = window.innerHeight;
  this.canvas.width = this.w;
  this.canvas.height = this.h;
  this.particles = [];
  // Not dense at the beginning, then regular density
  this.mp = 1500;
  for (var i = 0; i < this.mp; i++) {
    var size = 0;
    // Randomly choose between two size ranges
    if (Math.random() < 0.5) {
      size = Math.random() * 1.7 + 3; // Smaller particles
    } else {
      size = Math.random() * 2 + 4; // Bigger particles
    }

    // Randomly choose between two height ranges
    var heightMultiplier = 1;
    if (Math.random() < 0.5) {
      heightMultiplier = 2; // 2 times as high
    }

    var vy = this.initialFall ? 0 : this.minFallSpeed + Math.random();
    var y = this.initialFall ? Math.random() * this.h : Math.random() * -size * 140;
    var widthTransition = Math.random() > 0.5 ? 1 : 0.9; // Random width transition value (0 to 1)
    this.particles.push({
      x: Math.random() * this.w,
      y: y,
      w: size,
      h: size * heightMultiplier,
      vy: vy,
      vx: Math.random() * this.maxHSpeed - this.maxHSpeed / 2,
      fill: this.colors[Math.floor(Math.random() * this.colors.length)],
      s: Math.random() * 0.2 - 0.1,
      angle: Math.random() * 360,
      // Initialize the angle for rotation
      rotationSpeed: Math.random() * 1.75 - 0.25,
      // Initialize the rotation speed
      widthTransition: widthTransition
    });
    this.initialFall = false;
  }
}), "render", function render() {
  var _this2 = this;
  this.ctx.clearRect(0, 0, this.w, this.h);
  this.particles.forEach(function (p, i) {
    p.x += p.vx;
    // Apply rotation during the fall
    p.angle += p.rotationSpeed;
    p.y += p.vy; // Update the y-coordinate for falling

    // Calculate opacity based on the particle's vertical position
    var maxOpacity = 1;
    var minOpacity = 0;
    var opacityRange = maxOpacity - minOpacity;
    var normalizedY = p.y / _this2.h; // Normalize the y-coordinate
    var opacity = maxOpacity - normalizedY * opacityRange;

    // Calculate width based on width transition value
    var maxWidth = p.w;
    var minWidth = 0;
    var width = minWidth + p.widthTransition * (maxWidth - minWidth);

    // Add rotation to the particles
    _this2.ctx.save();
    _this2.ctx.translate(p.x + width / 2, p.y + p.h / 2);
    _this2.ctx.rotate(Math.PI / 180 * p.angle);
    _this2.ctx.globalAlpha = opacity;
    _this2.ctx.fillStyle = p.fill;
    _this2.ctx.fillRect(-width / 2, -p.h / 2, width, p.h);
    _this2.ctx.restore();
    if (p.x > _this2.w + 5 || p.x < -5 || p.y > _this2.h) {
      p.x = Math.random() * _this2.w;
      p.y = -10;
    }
  });
  if (this.quit) {
    return;
  }
  requestAnimationFrame(this.render.bind(this));
}), "destroy", function destroy() {
  this.quit = true;
});
},{}],"../elements/buff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBuffs = createBuffs;
exports.createStarterBuffs = createStarterBuffs;
var _filet = _interopRequireDefault(require("../public/imgs/buffs/filet.png"));
var _luckyMittens = _interopRequireDefault(require("../public/imgs/buffs/lucky-mittens.png"));
var _trustyPocketWatch = _interopRequireDefault(require("../public/imgs/buffs/trusty-pocket-watch.png"));
var _watermelon = _interopRequireDefault(require("../public/imgs/buffs/watermelon.png"));
var _suspiciouslyPlainChest = _interopRequireDefault(require("../public/imgs/buffs/suspiciously-plain-chest.png"));
var _emotionalSupportWaterBottle = _interopRequireDefault(require("../public/imgs/buffs/emotional-support-water-bottle.png"));
var _pouch = _interopRequireDefault(require("../public/imgs/buffs/pouch.png"));
var _momsCookies = _interopRequireDefault(require("../public/imgs/buffs/moms-cookies.png"));
var _feather = _interopRequireDefault(require("../public/imgs/buffs/feather.png"));
var _cape = _interopRequireDefault(require("../public/imgs/buffs/cape.png"));
var _amulet = _interopRequireDefault(require("../public/imgs/buffs/amulet.png"));
var _book = _interopRequireDefault(require("../public/imgs/buffs/book.png"));
var _glasses = _interopRequireDefault(require("../public/imgs/buffs/glasses.png"));
var _coins = _interopRequireDefault(require("../public/imgs/buffs/coins.png"));
var _Star = _interopRequireDefault(require("../public/imgs/icons/Star.png"));
var _gameManager = require("../game-manager");
var _particleSystems = require("./particle-systems");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var buffOptionsContainer = document.querySelector('.buff-options');
var modal = document.getElementById('level-up-modal');
function normalizeWeights(buffs) {
  var keys = Object.keys(buffs);
  var weights = keys.map(function (key) {
    return buffs[key].weight;
  });
  var sumOfWeights = weights.reduce(function (sum, weight) {
    return sum + weight;
  }, 0);
  var normalizedWeights = {};
  keys.forEach(function (key, index) {
    normalizedWeights[key] = weights[index] / sumOfWeights;
  });
  return normalizedWeights;
}
function getRandomBuffWeighted(buffs) {
  var keys = Object.keys(buffs);
  var probabilities = keys.map(function (key) {
    return buffs[key];
  });
  var randomValue = Math.random();
  var cumulativeProbability = 0;
  for (var i = 0; i < keys.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomValue <= cumulativeProbability) {
      return keys[i];
    }
  }

  // Default case (fallback)
  return keys[keys.length - 1];
}
function applyBuff(buffName) {
  // Get all power-up divs
  var powerUpDivs = document.querySelectorAll('.power-up');

  // Check if the user already has the selected power-up
  var existingPowerUp = Array.from(powerUpDivs).find(function (powerUpDiv) {
    return powerUpDiv.querySelector('img') && powerUpDiv.querySelector('img').alt.includes(buffName);
  });
  if (existingPowerUp) {
    // User already has the power-up, increment the rank
    var existingRank = existingPowerUp.querySelector('.power-up-rank');
    var existingRankValue = parseInt(existingRank.textContent);
    existingRank.textContent = "".concat(existingRankValue + 1);

    // Implement logic to apply the selected buff (if needed)
    console.log("Applying ".concat(buffName));
    buffs[buffName].effect();
  } else {
    // Find the first available power-up div without a power-up
    var lastEmptyPowerUp = Array.from(powerUpDivs).find(function (powerUpDiv) {
      return !powerUpDiv.querySelector('img');
    });
    if (lastEmptyPowerUp) {
      // Implement logic to apply the selected buff
      console.log("Applying ".concat(buffName));
      buffs[buffName].effect();

      // Add the icon to the power-up div
      var icon = document.createElement('img');
      icon.src = buffs[buffName].icon;
      icon.alt = "".concat(buffName);
      icon.classList.add('w-full');
      lastEmptyPowerUp.appendChild(icon);

      // Add the rank to the power-up div
      var rank = document.createElement('div');
      rank.classList.add('power-up-rank', 'sans');
      rank.textContent = '1';
      lastEmptyPowerUp.appendChild(rank);
    }
  }
  _particleSystems.confetti.destroy();
  // Close the modal
  modal.style.display = 'none';
  modal.classList.remove('show-modal');
  buffOptionsContainer.innerHTML = '';
  (0, _gameManager.togglePause)();
}
function applySackOfCoins() {
  alwaysBuffs['Coin purse'].effect();
  _particleSystems.confetti.destroy();
  // Close the modal
  modal.style.display = 'none';
  modal.classList.remove('show-modal');
  buffOptionsContainer.innerHTML = '';
  (0, _gameManager.togglePause)();
}
function applyStarterBuff(buffName) {
  // Get all power-up divs
  var powerUpDivs = document.querySelectorAll('.starter-power-up');

  // Check if the user already has the selected power-up
  var existingPowerUp = Array.from(powerUpDivs).find(function (powerUpDiv) {
    return powerUpDiv.querySelector('img') && powerUpDiv.querySelector('img').alt.includes(buffName);
  });
  if (existingPowerUp) {
    // User already has the power-up, increment the rank
    var existingRank = existingPowerUp.querySelector('.power-up-rank');
    var existingRankValue = parseInt(existingRank.textContent);
    existingRank.textContent = "".concat(existingRankValue + 1);

    // Implement logic to apply the selected buff (if needed)
    console.log("Applying ".concat(buffName));
    starterBuffs[buffName].effect();
  } else {
    // Find the first available power-up div without a power-up
    var lastEmptyPowerUp = Array.from(powerUpDivs).find(function (powerUpDiv) {
      return !powerUpDiv.querySelector('img');
    });
    if (lastEmptyPowerUp) {
      // Implement logic to apply the selected buff
      console.log("Applying ".concat(buffName));
      starterBuffs[buffName].effect();

      // Add the icon to the power-up div
      var icon = document.createElement('img');
      icon.src = starterBuffs[buffName].icon;
      icon.alt = "".concat(buffName);
      icon.classList.add('w-full');
      lastEmptyPowerUp.appendChild(icon);

      // Add the rank to the power-up div
      var rank = document.createElement('div');
      rank.classList.add('power-up-rank', 'sans');
      rank.textContent = '1';
      lastEmptyPowerUp.appendChild(rank);
    }
  }
  _particleSystems.confetti.destroy();
  // Close the modal
  modal.style.display = 'none';
  modal.classList.remove('show-modal');
  buffOptionsContainer.innerHTML = '';
  (0, _gameManager.togglePause)();
}
function createStarterBuffs() {
  (0, _gameManager.togglePause)();
  // Show the modal
  var modal = document.getElementById('level-up-modal');
  modal.style.display = 'flex';
  modal.classList.add('show-modal');

  // Keep track of selected buffs
  var selectedBuffs = new Set();

  // Generate 3 unique buffs
  var _loop = function _loop() {
    var randomBuffKey = getRandomBuffWeighted(normalizedStarterBuffWeights);

    // Check if the buff is not already selected
    if (!selectedBuffs.has(randomBuffKey)) {
      selectedBuffs.add(randomBuffKey);

      // Create buff container (use a div as a clickable area)
      var buffContainer = document.createElement('div');
      buffContainer.classList.add('buff-container', 'starter-buff');
      buffContainer.addEventListener('click', function () {
        return applyStarterBuff(randomBuffKey);
      });

      // Create flex container for icon and title
      var flexContainer = document.createElement('div');
      flexContainer.classList.add('flex-col', 'items-center');

      // Create div to wrap the icon
      var iconWrapper = document.createElement('div');
      iconWrapper.classList.add('buff-icon-wrapper');

      // Create icon (adjust the path accordingly)
      var icon = document.createElement('img');
      icon.classList.add('buff-icon');
      icon.src = starterBuffs[randomBuffKey].icon;
      icon.alt = "".concat(randomBuffKey, " Icon");

      // Create title
      var title = document.createElement('div');
      title.classList.add('buff-title', 'uppercase');
      title.textContent = randomBuffKey;

      // Determine rarity and set title color
      var rarity = assignRarity(starterBuffs[randomBuffKey]);
      createStarIcons(rarity, flexContainer);
      // Append icon wrapper and title to flex container
      flexContainer.appendChild(title);
      // Append icon to icon wrapper
      iconWrapper.appendChild(icon);
      flexContainer.appendChild(iconWrapper);

      // Create description
      var description = document.createElement('p');
      description.classList.add('buff-description', 'body');
      description.textContent = starterBuffs[randomBuffKey].description;

      // Get all power-up divs
      var powerUpDivs = document.querySelectorAll('.starter-power-up');

      // Check if the user already has the selected power-up
      var existingPowerUp = Array.from(powerUpDivs).find(function (powerUpDiv) {
        return powerUpDiv.querySelector('img') && powerUpDiv.querySelector('img').alt.includes(randomBuffKey);
      });
      var abilityRank = document.createElement('div');
      abilityRank.classList.add('buff-modal-rank');
      if (existingPowerUp) {
        // User already has the power-up, increment the rank
        var existingRank = existingPowerUp.querySelector('.power-up-rank');
        var existingRankValue = parseInt(existingRank.textContent);
        abilityRank.textContent = "Rank ".concat(existingRankValue + 1);
      } else {
        abilityRank.textContent = "Rank 1";
      }
      var buffContainerTop = document.createElement('div');
      buffContainerTop.classList.add('flex-col');

      // Append flex container and description to buff container
      buffContainerTop.appendChild(flexContainer);
      buffContainerTop.appendChild(description);
      buffContainer.appendChild(buffContainerTop);
      buffContainer.appendChild(abilityRank);

      // Append buff container to modal content
      buffOptionsContainer.appendChild(buffContainer);
    }
  };
  while (selectedBuffs.size < 4) {
    _loop();
  }
  _particleSystems.confetti.init();
}
function createBuffs() {
  (0, _gameManager.togglePause)();
  // Show the modal
  var modal = document.getElementById('level-up-modal');
  modal.style.display = 'flex';
  modal.classList.add('show-modal');
  // Keep track of selected buffs
  var selectedBuffs = new Set();

  // Generate 3 unique buffs
  var _loop2 = function _loop2() {
    var randomBuffKey = getRandomBuffWeighted(normalizedBuffWeights);

    // Check if the buff is not already selected
    if (!selectedBuffs.has(randomBuffKey)) {
      selectedBuffs.add(randomBuffKey);

      // Create buff container (use a div as a clickable area)
      var buffContainer = document.createElement('div');
      buffContainer.classList.add('buff-container');
      buffContainer.addEventListener('click', function () {
        return applyBuff(randomBuffKey);
      });

      // Create flex container for icon and title
      var flexContainer = document.createElement('div');
      flexContainer.classList.add('flex-col', 'items-center');

      // Create div to wrap the icon
      var iconWrapper = document.createElement('div');
      iconWrapper.classList.add('buff-icon-wrapper');

      // Create icon (adjust the path accordingly)
      var icon = document.createElement('img');
      icon.classList.add('buff-icon');
      icon.src = buffs[randomBuffKey].icon;
      icon.alt = "".concat(randomBuffKey, " Icon");

      // Create title
      var title = document.createElement('div');
      title.classList.add('buff-title', 'uppercase');
      title.textContent = randomBuffKey;

      // Determine rarity and set title color
      var _rarity = assignRarity(buffs[randomBuffKey]);
      createStarIcons(_rarity, flexContainer);
      // Append icon wrapper and title to flex container
      flexContainer.appendChild(title);
      // Append icon to icon wrapper
      iconWrapper.appendChild(icon);
      flexContainer.appendChild(iconWrapper);

      // Create description
      var description = document.createElement('p');
      description.classList.add('buff-description', 'body');
      description.textContent = buffs[randomBuffKey].description;

      // Get all power-up divs
      var powerUpDivs = document.querySelectorAll('.power-up');

      // Check if the user already has the selected power-up
      var existingPowerUp = Array.from(powerUpDivs).find(function (powerUpDiv) {
        return powerUpDiv.querySelector('img') && powerUpDiv.querySelector('img').alt.includes(randomBuffKey);
      });
      var abilityRank = document.createElement('div');
      abilityRank.classList.add('buff-modal-rank');
      if (existingPowerUp) {
        // User already has the power-up, increment the rank
        var existingRank = existingPowerUp.querySelector('.power-up-rank');
        var existingRankValue = parseInt(existingRank.textContent);
        abilityRank.textContent = "Rank ".concat(existingRankValue + 1);
      } else {
        abilityRank.textContent = "Rank 1";
      }
      var buffContainerTop = document.createElement('div');
      buffContainerTop.classList.add('flex-col');

      // Append flex container and description to buff container
      buffContainerTop.appendChild(flexContainer);
      buffContainerTop.appendChild(description);
      buffContainer.appendChild(buffContainerTop);
      buffContainer.appendChild(abilityRank);

      // Append buff container to modal content
      buffOptionsContainer.appendChild(buffContainer);
    }
  };
  while (selectedBuffs.size < 3) {
    _loop2();
  }
  _particleSystems.confetti.init();

  // Add the "Coin purse" power-up as the 4th option
  var sackOfCoinsContainer = document.createElement('div');
  sackOfCoinsContainer.classList.add('buff-container');
  sackOfCoinsContainer.addEventListener('click', function () {
    return applySackOfCoins();
  });
  var sackOfCoinsFlexContainer = document.createElement('div');
  sackOfCoinsFlexContainer.classList.add('flex-col', 'items-center');
  var sackOfCoinsIconWrapper = document.createElement('div');
  sackOfCoinsIconWrapper.classList.add('buff-icon-wrapper');
  var sackOfCoinsIcon = document.createElement('img');
  sackOfCoinsIcon.classList.add('buff-icon');
  sackOfCoinsIcon.src = alwaysBuffs['Coin purse'].icon;
  sackOfCoinsIcon.alt = 'Coin purse Icon';
  var sackOfCoinsTitle = document.createElement('div');
  sackOfCoinsTitle.classList.add('buff-title', 'uppercase');
  sackOfCoinsTitle.textContent = 'Coin purse';

  // Determine rarity and set title color
  var rarity = assignRarity(alwaysBuffs['Coin purse']);
  createStarIcons(rarity, sackOfCoinsFlexContainer);
  // Append icon to icon wrapper
  sackOfCoinsIconWrapper.appendChild(sackOfCoinsIcon);

  // Append icon wrapper and title to flex container
  sackOfCoinsFlexContainer.appendChild(sackOfCoinsTitle);
  sackOfCoinsFlexContainer.appendChild(sackOfCoinsIconWrapper);

  // Create description
  var sackOfCoinsDescription = document.createElement('p');
  sackOfCoinsDescription.classList.add('buff-description', 'body');
  sackOfCoinsDescription.textContent = alwaysBuffs['Coin purse'].description;
  var sackOfCoinsContainerTop = document.createElement('div');
  sackOfCoinsContainerTop.classList.add('flex-col');

  // Append flex container and description to buff container
  sackOfCoinsContainerTop.appendChild(sackOfCoinsFlexContainer);
  sackOfCoinsContainerTop.appendChild(sackOfCoinsDescription);
  sackOfCoinsContainer.appendChild(sackOfCoinsContainerTop);

  // Append Coin purse container to modal content
  buffOptionsContainer.appendChild(sackOfCoinsContainer);
}
function getStarsForRarity(rarity) {
  switch (rarity) {
    case 'Legendary':
      return 5;
    // Adjust the color as needed
    case 'Epic':
      return 4;
    // Adjust the color as needed
    case 'Rare':
      return 3;
    // Adjust the color as needed
    case 'Uncommon':
      return 2;
    // Adjust the color as needed
    case 'Common':
      return 1;
    // Adjust the color as needed
    default:
      return 1;
    // Default color
  }
}

function assignRarity(buff) {
  var weight = buff.weight;
  if (weight >= 0 && weight < 0.01) {
    return 'Legendary';
  } else if (weight >= 0.01 && weight < 0.2) {
    return 'Epic';
  } else if (weight >= 0.2 && weight < 0.4) {
    return 'Rare';
  } else if (weight >= 0.4 && weight < 0.6) {
    return 'Uncommon';
  } else if (weight >= 0.6 && weight <= 1.0) {
    return 'Common';
  } else {
    // Handle weights outside the defined ranges
    return 'Unknown Rarity';
  }
}
function createStarIcons(rarity, parent) {
  var starCount = getStarsForRarity(rarity);
  var starIconContainer = document.createElement('div');
  starIconContainer.classList.add('flex-row', 'items-center');
  for (var i = 0; i < starCount; i++) {
    var starIcon = document.createElement('img');
    starIcon.classList.add('star-icon');
    starIcon.src = _Star.default;
    starIconContainer.appendChild(starIcon);
  }
  if (starCount === 0) {
    var _starIcon = document.createElement('img');
    _starIcon.classList.add('star-icon', 'hide-elem');
    _starIcon.src = _Star.default;
    starIconContainer.appendChild(_starIcon);
  }
  parent.appendChild(starIconContainer);
}
var alwaysBuffs = {
  'Coin purse': {
    description: 'Gain 25 random coins toward your score.',
    weight: 1,
    icon: _pouch.default,
    effect: _gameManager.sackOfCoinsEffect
  }
};
var buffs = {
  Filet: {
    description: 'Enjoy a meal. Gain 1 life',
    weight: 0.2,
    icon: _filet.default,
    effect: _gameManager.filetMignonEffect
  },
  'Silver Feather': {
    description: 'Silver coins are now worth 20% more (base value)',
    weight: 0.4,
    icon: _feather.default,
    effect: _gameManager.silverFeatherEffect
  },
  Amulet: {
    description: 'Gold coins are now worth 20% more (base value)',
    weight: 0.6,
    icon: _amulet.default,
    effect: _gameManager.amuletEffect
  },
  'Moms Cookies': {
    description: 'Mom sends her love. Gain 1 level.',
    weight: 0.6,
    icon: _momsCookies.default,
    effect: _gameManager.momsCookiesEffect
  },
  'Slow Fall': {
    description: 'Slow falling speed by 5%',
    weight: 0.4,
    icon: _cape.default,
    effect: _gameManager.slowFallEffect
  },
  'Suspiciously Plain Chest': {
    description: 'buff 4 description',
    weight: 0.4,
    icon: _suspiciouslyPlainChest.default,
    effect: _gameManager.filetMignonEffect
  },
  'Trusty Pocket Watch': {
    description: 'Slow time briefly by 60%, rapidly increasing to a permanent 5%',
    weight: 0.8,
    icon: _trustyPocketWatch.default,
    effect: _gameManager.trustyPocketWatchEffect
  },
  'Emotional Support Water Bottle': {
    description: 'buff 1 description',
    weight: 0.2,
    icon: _emotionalSupportWaterBottle.default,
    effect: _gameManager.filetMignonEffect
  },
  Watermelon: {
    description: 'Every time you pick up a silver coin, the next Red gem pick up value increases by 2x. Stacks up to 50 times.',
    weight: 0.5,
    icon: _watermelon.default,
    effect: _gameManager.filetMignonEffect
  },
  'Lucky Mittens': {
    description: 'buff 3 description',
    weight: 0.3,
    icon: _luckyMittens.default,
    effect: _gameManager.filetMignonEffect
  }
};
var starterBuffs = {
  'Text book': {
    description: 'Every time you get a level, your passives scale by %.',
    weight: 0.1,
    icon: _book.default,
    effect: _gameManager.booksSmartEffect
  },
  'Starter 2': {
    description: 'You spawn 1 gold coin above you when you jump, but all gold coins you pick up are worth 50% less',
    weight: 0.6,
    icon: _coins.default,
    effect: _gameManager.coinsEffect
  },
  'Starter 3': {
    description: 'Every time you get a level, your passives scale by %.',
    weight: 0.4,
    icon: _book.default,
    effect: _gameManager.booksSmartEffect
  },
  Glasses: {
    description: 'Gold coins increase the next red gem by .5x, stacks up to 28. Getting a red gem resets stacks',
    weight: 0.8,
    icon: _glasses.default,
    effect: _gameManager.glassesEffect
  },
  Glasses2: {
    description: 'Gold coins increase the next red gem by .5x, stacks up to 28. Getting a red gem resets stacks',
    weight: 0.1,
    icon: _glasses.default,
    effect: _gameManager.glassesEffect
  },
  Glasses3: {
    description: 'Gold coins increase the next red gem by .5x, stacks up to 28. Getting a red gem resets stacks',
    weight: 0.1,
    icon: _glasses.default,
    effect: _gameManager.glassesEffect
  }
};

// Example usage:
var normalizedStarterBuffWeights = normalizeWeights(starterBuffs);
var normalizedBuffWeights = normalizeWeights(buffs);
},{"../public/imgs/buffs/filet.png":"imgs/buffs/filet.png","../public/imgs/buffs/lucky-mittens.png":"imgs/buffs/lucky-mittens.png","../public/imgs/buffs/trusty-pocket-watch.png":"imgs/buffs/trusty-pocket-watch.png","../public/imgs/buffs/watermelon.png":"imgs/buffs/watermelon.png","../public/imgs/buffs/suspiciously-plain-chest.png":"imgs/buffs/suspiciously-plain-chest.png","../public/imgs/buffs/emotional-support-water-bottle.png":"imgs/buffs/emotional-support-water-bottle.png","../public/imgs/buffs/pouch.png":"imgs/buffs/pouch.png","../public/imgs/buffs/moms-cookies.png":"imgs/buffs/moms-cookies.png","../public/imgs/buffs/feather.png":"imgs/buffs/feather.png","../public/imgs/buffs/cape.png":"imgs/buffs/cape.png","../public/imgs/buffs/amulet.png":"imgs/buffs/amulet.png","../public/imgs/buffs/book.png":"imgs/buffs/book.png","../public/imgs/buffs/glasses.png":"imgs/buffs/glasses.png","../public/imgs/buffs/coins.png":"imgs/buffs/coins.png","../public/imgs/icons/Star.png":"imgs/icons/Star.png","../game-manager":"../game-manager.js","./particle-systems":"../elements/particle-systems.js"}],"../phases/phase-properties.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.phases = void 0;
var phases = exports.phases = {
  bonus: {
    totalTime: 15,
    speedScale: 0.9
  },
  1: {
    totalTime: 60,
    speedScale: 0.9
  },
  2: {
    totalTime: 40,
    speedScale: 0.4
  }
};
},{}],"../phases/phase1.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePhase1 = updatePhase1;
var _gameState = _interopRequireDefault(require("../game-state"));
var _phaseProperties = require("./phase-properties");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var getPhaseTimerInterval = _gameState.default.getPhaseTimerInterval,
  getCurrentPhase = _gameState.default.getCurrentPhase,
  setCurrentPhase = _gameState.default.setCurrentPhase,
  setPhaseTimerInterval = _gameState.default.setPhaseTimerInterval,
  updateState = _gameState.default.updateState,
  setIsFlagCreated = _gameState.default.setIsFlagCreated;
function updatePhase1(timer) {
  updateState({
    isCactusRunning: true,
    isCoinRunning: true,
    isPlatformRunning: true,
    isGroundEnemyRunning: true
  });
  if (timer > getPhaseTimerInterval()) {
    console.log("Phase ".concat(getCurrentPhase(), " complete"));
    setIsFlagCreated(false);
    setCurrentPhase('bonus');
    // Set the timer interval for the new phase
    setPhaseTimerInterval(getPhaseTimerInterval() + _phaseProperties.phases['bonus'].totalTime);
  }
}
},{"../game-state":"../game-state.js","./phase-properties":"../phases/phase-properties.js"}],"../phases/phase2.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePhase2 = updatePhase2;
var _gameState = _interopRequireDefault(require("../game-state"));
var _phaseProperties = require("./phase-properties");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var getPhaseTimerInterval = _gameState.default.getPhaseTimerInterval,
  setCurrentPhase = _gameState.default.setCurrentPhase,
  setPhaseTimerInterval = _gameState.default.setPhaseTimerInterval,
  getCurrentPhase = _gameState.default.getCurrentPhase,
  updateState = _gameState.default.updateState,
  setIsFlagCreated = _gameState.default.setIsFlagCreated;
function updatePhase2(timer) {
  updateState({
    isPlatformRunning: true,
    isCactusRunning: true
  });
  if (timer > getPhaseTimerInterval()) {
    setCurrentPhase('bonus');
    setIsFlagCreated(false);
    console.log("Phase ".concat(getCurrentPhase(), " complete"));
    setPhaseTimerInterval(_phaseProperties.phases['2'].totalTime);
  }
}
},{"../game-state":"../game-state.js","./phase-properties":"../phases/phase-properties.js"}],"../phases/bonus-phase.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateBonusPhase = updateBonusPhase;
var _gameState = _interopRequireDefault(require("../game-state"));
var _gameManager = require("../game-manager");
var _phaseProperties = require("./phase-properties");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var getPhaseTimerInterval = _gameState.default.getPhaseTimerInterval,
  setCurrentPhase = _gameState.default.setCurrentPhase,
  setPhaseTimerInterval = _gameState.default.setPhaseTimerInterval,
  getLastPhase = _gameState.default.getLastPhase,
  setLastPhase = _gameState.default.setLastPhase,
  updateState = _gameState.default.updateState,
  getCurrentPhase = _gameState.default.getCurrentPhase;
function updateBonusPhase(timer) {
  updateState({
    isCactusRunning: false
  });
  if (timer > getPhaseTimerInterval()) {
    var incrementPhase = getLastPhase() + 2;
    setLastPhase(getLastPhase() + 1);
    console.log("Phase bonus complete");
    // Transition to the next phase
    setCurrentPhase(incrementPhase);
    (0, _gameManager.updateNotification)("stage ".concat(getCurrentPhase(), "!"));
    updateState({
      isGroundLayer2Running: true
    });
    // Set the timer interval for the new phase
    setPhaseTimerInterval(getPhaseTimerInterval() + _phaseProperties.phases["".concat(incrementPhase)].totalTime);
  }
}
},{"../game-state":"../game-state.js","../game-manager":"../game-manager.js","./phase-properties":"../phases/phase-properties.js"}],"../elements/bonus-layer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupBonusLayer = setupBonusLayer;
exports.updateBonusLayer = updateBonusLayer;
var _updateCustomProperty = require("../utility/updateCustomProperty.js");
var _gameState = _interopRequireDefault(require("../game-state.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var getIsGroundLayer2Running = _gameState.default.getIsGroundLayer2Running,
  getGroundSpeed = _gameState.default.getGroundSpeed;
var SPEED = getGroundSpeed();
var bonusLayerElems = document.querySelectorAll('[data-bonus-layer]');
function setupBonusLayer() {
  (0, _updateCustomProperty.setCustomProperty)(bonusLayerElems[0], '--left', 100);
  (0, _updateCustomProperty.setCustomProperty)(bonusLayerElems[1], '--left', 281);
}
var isBonusLayerMovedBack = false;
var isBonusLayerSetup = true;
function updateBonusLayer(delta, speedScale) {
  if (!getIsGroundLayer2Running()) {
    isBonusLayerSetup = false;
    bonusLayerElems.forEach(function (bonus) {
      (0, _updateCustomProperty.incrementCustomProperty)(bonus, '--left', delta * speedScale * SPEED * -1);
      if ((0, _updateCustomProperty.getCustomProperty)(bonus, '--left') <= -281) {
        (0, _updateCustomProperty.incrementCustomProperty)(bonus, '--left', 362);
      }
    });
  } else if (getIsGroundLayer2Running() && !isBonusLayerMovedBack && !isBonusLayerSetup) {
    (0, _updateCustomProperty.setCustomProperty)(bonusLayerElems[0], '--left', -77);
    (0, _updateCustomProperty.setCustomProperty)(bonusLayerElems[1], '--left', -77);
    isBonusLayerMovedBack = true;
  } else if (getIsGroundLayer2Running() && isBonusLayerMovedBack && !isBonusLayerSetup) {
    bonusLayerElems.forEach(function (bonus) {
      (0, _updateCustomProperty.incrementCustomProperty)(bonus, '--left', delta * speedScale * SPEED * -1);
      if ((0, _updateCustomProperty.getCustomProperty)(bonus, '--left') <= -281) {
        (0, _updateCustomProperty.setCustomProperty)(bonusLayerElems[0], '--left', 100);
        (0, _updateCustomProperty.setCustomProperty)(bonusLayerElems[1], '--left', 281);
        isBonusLayerSetup = true;
      }
    });
  } else return;
}
},{"../utility/updateCustomProperty.js":"../utility/updateCustomProperty.js","../game-state.js":"../game-state.js"}],"../interface-text-elems-state.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// state.js
var InterfaceTextElemsSingleton = function () {
  // State array to keep track of interfaceTextElems
  var interfaceTextElemsState = [];
  return {
    getInterfaceTextElemsState: function getInterfaceTextElemsState() {
      return interfaceTextElemsState;
    },
    updateState: function updateState(newValues) {
      Object.assign(state, newValues);
    },
    addInterfaceTextElem: function addInterfaceTextElem(elem) {
      interfaceTextElemsState.push(elem);
    },
    removeInterfaceTextElem: function removeInterfaceTextElem(elem) {
      var index = interfaceTextElemsState.indexOf(elem);
      if (index !== -1) {
        interfaceTextElemsState.splice(index, 1);
      }
    }
  };
}();
var _default = exports.default = InterfaceTextElemsSingleton;
},{}],"../utility/update-interface-text.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateInterfaceText = updateInterfaceText;
var _updateCustomProperty = require("../utility/updateCustomProperty.js");
var _interfaceTextElemsState = _interopRequireDefault(require("../interface-text-elems-state.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var getInterfaceTextElemsState = _interfaceTextElemsState.default.getInterfaceTextElemsState;
var SPEED = 0.04;
function updateInterfaceText(delta, speedScale) {
  var interfaceTextElems = getInterfaceTextElemsState();
  interfaceTextElems.forEach(function (text) {
    (0, _updateCustomProperty.incrementCustomProperty)(text, '--left', delta * speedScale * SPEED * -1);
  });
}
},{"../utility/updateCustomProperty.js":"../utility/updateCustomProperty.js","../interface-text-elems-state.js":"../interface-text-elems-state.js"}],"../elements/cherry.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCherryRects = getCherryRects;
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function getCherryRects() {
  return _toConsumableArray(document.querySelectorAll('[data-cherry]')).map(function (cherry) {
    return {
      id: cherry.id,
      rect: cherry.getBoundingClientRect(),
      cherry: cherry.dataset['cherry']
    };
  });
}
},{}],"../game-manager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SPEED_SCALE_INCREASE = void 0;
exports.amuletEffect = amuletEffect;
exports.booksSmartEffect = booksSmartEffect;
exports.coinsEffect = coinsEffect;
exports.collectableOptions = void 0;
exports.filetMignonEffect = filetMignonEffect;
exports.glassesEffect = glassesEffect;
exports.isCollision = isCollision;
exports.momsCookiesEffect = momsCookiesEffect;
exports.sackOfCoinsEffect = sackOfCoinsEffect;
exports.silverFeatherEffect = silverFeatherEffect;
exports.slowFallEffect = slowFallEffect;
exports.togglePause = togglePause;
exports.trustyPocketWatchEffect = trustyPocketWatchEffect;
exports.updateMultiplierInterface = updateMultiplierInterface;
exports.updateNotification = updateNotification;
exports.updateScoreWithPoints = updateScoreWithPoints;
var _ground = require("./elements/ground.js");
var _groundLayerTwo = require("./elements/groundLayerTwo");
var _groundLayerTwoTwo = require("./elements/groundLayerTwoTwo");
var _groundLayerThree = require("./elements/groundLayerThree");
var _playerController = require("./elements/player-controller.js");
var _cactus = require("./elements/cactus.js");
var _groundEnemy = require("./elements/ground-enemy");
var _bird = require("./elements/bird.js");
var _platform = require("./elements/platform.js");
var _leaderboard = require("./elements/leaderboard.js");
var _soundController = require("./utility/sound-controller.js");
var _apis = require("./apis.js");
var _validateInput = require("./utility/validate-input.js");
var _scoreMultiplier = require("./elements/score-multiplier.js");
var _magnet = require("./elements/magnet.js");
var _heart = require("./elements/heart.js");
var _leaf = require("./elements/leaf.js");
var _flag = require("./elements/flag.js");
var _star = require("./elements/star.js");
var _coin = require("./elements/coin.js");
var _SpeakerOff = _interopRequireDefault(require("./public/imgs/icons/Speaker-Off.png"));
var _SpeakerOn = _interopRequireDefault(require("./public/imgs/icons/Speaker-On.png"));
var _Pause = _interopRequireDefault(require("./public/imgs/icons/Pause.png"));
var _Play = _interopRequireDefault(require("./public/imgs/icons/Play.png"));
var _glasses = _interopRequireDefault(require("./public/imgs/buffs/glasses.png"));
var _Redo = _interopRequireDefault(require("./public/imgs/icons/Redo.png"));
var _ForegroundTrees = _interopRequireDefault(require("./public/imgs/backgrounds/Foreground-Trees.png"));
var _buff = require("./elements/buff.js");
var _gameState = _interopRequireDefault(require("./game-state.js"));
var _elementsRefs = require("./elements-refs");
var _toggleElement = require("./utility/toggle-element.js");
var _particleSystems = require("./elements/particle-systems.js");
var _phaseProperties = require("./phases/phase-properties.js");
var _phase = require("./phases/phase1.js");
var _phase2 = require("./phases/phase2.js");
var _bonusPhase = require("./phases/bonus-phase.js");
var _bonusLayer = require("./elements/bonus-layer.js");
var _updateInterfaceText = require("./utility/update-interface-text.js");
var _interfaceTextElemsState = _interopRequireDefault(require("./interface-text-elems-state.js"));
var _cherry = require("./elements/cherry");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var removeInterfaceTextElem = _interfaceTextElemsState.default.removeInterfaceTextElem,
  addInterfaceTextElem = _interfaceTextElemsState.default.addInterfaceTextElem;
var setMultiplierRatio = _gameState.default.setMultiplierRatio,
  getMultiplierRatio = _gameState.default.getMultiplierRatio,
  getTimerInterval = _gameState.default.getTimerInterval,
  setTimerInterval = _gameState.default.setTimerInterval,
  setMultiplierTimer = _gameState.default.setMultiplierTimer,
  getMultiplierTimer = _gameState.default.getMultiplierTimer,
  getSpeedScale = _gameState.default.getSpeedScale,
  getSpeedScaleIncrease = _gameState.default.getSpeedScaleIncrease,
  getStarDuration = _gameState.default.getStarDuration,
  getPlayerImmunity = _gameState.default.getPlayerImmunity,
  setPlayerImmunity = _gameState.default.setPlayerImmunity,
  getHasStar = _gameState.default.getHasStar,
  setHasStar = _gameState.default.setHasStar,
  getGravityFallAdjustment = _gameState.default.getGravityFallAdjustment,
  setGravityFallAdjustment = _gameState.default.setGravityFallAdjustment,
  getSelectedStarter = _gameState.default.getSelectedStarter,
  setSelectedStarter = _gameState.default.setSelectedStarter,
  getCurrentPhase = _gameState.default.getCurrentPhase,
  setJumpCountLimit = _gameState.default.setJumpCountLimit,
  getLeafDuration = _gameState.default.getLeafDuration,
  setHasLeaf = _gameState.default.setHasLeaf,
  setCherryPoints = _gameState.default.setCherryPoints,
  getCherryPoints = _gameState.default.getCherryPoints;
var WORLD_WIDTH = 100;
var WORLD_HEIGHT = 45;
var SPEED_SCALE_INCREASE = exports.SPEED_SCALE_INCREASE = 0.00001;
var showLeaderboard = false;

// const playAgainButtonElem = document.querySelector('[data-play-again]');

// playAgainButtonElem.addEventListener('click', function () {
//   handleStart(); // Add any other actions you want to perform on button click
// });
setPixelToWorldScale();
(0, _leaderboard.createLeaderboard)(_elementsRefs.leaderboardElem);
_particleSystems.snow.init();
window.addEventListener('resize', setPixelToWorldScale);
document.addEventListener('keydown', handleStart, {
  once: true
});
document.addEventListener('touchstart', handleStart, {
  once: true
});
var lastTime;
var score;
var idleIntervalId;
var collisionOccurred = false; // Flag to track collision
var milestone = 100000;
//init highScore elem
_elementsRefs.highScoreElem.textContent = localStorage.getItem('lion-high-score') ? localStorage.getItem('lion-high-score') : Math.floor('0').toString().padStart(6, 0);
var hasBeatenScore = false;
var isPaused = false;
var immunityDuration = 2000; // Example: 2000 milliseconds (2 seconds)
_elementsRefs.scrollableTableElem.classList.add('hide-element');
_elementsRefs.scrollableTableElem.style.display = 'none';
_elementsRefs.worldElem.setAttribute('transition-style', 'in:circle:center');
_elementsRefs.tickerContainerElem.classList.add('hide-element');
_elementsRefs.tickerContainerElem.classList.remove('show-element');
var pauseIconButton = document.getElementById('pause-icon-button');
var shareContainer = document.getElementById('share-container');
var shareButton = document.getElementById('shareButton');
shareContainer.addEventListener('mouseenter', function () {
  shareButton.classList.add('transparent-background');
});
shareContainer.addEventListener('mouseleave', function () {
  shareButton.classList.remove('transparent-background');
});

// function typeLoadingText(elem) {
//   setTimeout(() => {
//     typeLettersWithoutSpaces(0, '...Oh no', elem, 100);
//   }, 400);
//   setTimeout(() => {
//     // Set white-space CSS style to allow line breaks
//     elem.style.whiteSpace = 'pre-line';
//     // Add a line break before the second line
//     elem.textContent += '\n';
//     typeLettersWithoutSpaces(0, 'Gotta get to class!', elem, 100);
//   }, 3000);
// }

// typeLoadingText(gameLoadingTextElem);

function copyCurrentLink() {
  var input = document.createElement('input');
  input.value = window.location.href;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);

  // Change the button text to "Copied!"
  document.getElementById('copy-link-button').textContent = 'Copied!';

  // Change it back to "Copy link" after a delay (e.g., 2 seconds)
  setTimeout(function () {
    document.getElementById('copy-link-button').textContent = 'Copy link';
  }, 2000);
}
if (document.getElementById('copy-link-button')) {
  document.getElementById('copy-link-button').addEventListener('click', copyCurrentLink);
}
var pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', function () {
  togglePause();
  if (_elementsRefs.pausedScreenElem.style.display === 'flex') {
    _elementsRefs.pausedScreenElem.style.display = 'none';
  } else {
    _elementsRefs.pausedScreenElem.style.display = 'flex';
  }
  pauseButton.blur();
});
var immunityTimeout;

// Function to set player immunity
function setTimedPlayerImmunity(duration) {
  setPlayerImmunity(true);
  // Clear any existing timeout
  clearTimeout(immunityTimeout);

  // Set a new timeout
  immunityTimeout = setTimeout(function () {
    setPlayerImmunity(false);
  }, duration ? duration : immunityDuration);

  // Check if getHasStar is true, and cancel the timeout if needed
  if (getHasStar()) {
    clearTimeout(immunityTimeout);
  }
}
idleIntervalId = setInterval(_playerController.handleIdle, 300);
function updateElements() {}
var deltaAdjustment = 1;
var currentSpeedScale = getSpeedScale();
var isUpdatedSpeedScale = false;
var decelerationFactor = 0.95; // Adjust the deceleration factor as needed

function deleteLetters(index, elem, timeout) {
  var text = elem.textContent;
  if (index >= 0) {
    elem.textContent = text.substring(0, index);
    setTimeout(function () {
      deleteLetters(index - 1, elem, timeout);
    }, timeout); // Use the provided timeout
  } else {}
}
function updateNotification(notification) {
  var deleteLettersDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;
  var typeLettersDelay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
  var timeout = 125;
  setTimeout(function () {
    typeLettersWithoutSpaces(0, notification, _elementsRefs.gameNotificationElem, 100);
    // After a delay, start deleting the letters in reverse order

    setTimeout(function () {
      deleteLetters(_elementsRefs.gameNotificationElem.textContent.length - 1, _elementsRefs.gameNotificationElem, timeout);
    }, deleteLettersDelay);
  }, typeLettersDelay);
}
function checkCollisions() {
  if (checkLose()) return handleLose();
  checkMultiplierCollision();
  checkCoinCollision();
  checkStarCollision();
  checkCherryCollision();
  checkHeartCollision();
  checkMagnetCollision();
  checkLeafCollision();
}
var phaseUpdateFunctions = {
  1: _phase.updatePhase1,
  bonus: _bonusPhase.updateBonusPhase,
  2: _phase2.updatePhase2
};
function update(time) {
  if (isPaused) {
    // Do nothing if the game is paused
    return;
  }
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  var baseDelta = 15;
  // let delta = time - lastTime;
  var delta = baseDelta;
  if (collisionOccurred && !getPlayerImmunity()) {
    setTimedPlayerImmunity();
    togglePause();
    setTimeout(function () {
      collisionOccurred = false; // Reset the collision flag after the delay
      togglePause();
    }, 400);
    return; // Pause the update during the delay
  }

  var updateFunction = phaseUpdateFunctions[getCurrentPhase()];
  if (updateFunction) {
    updateFunction(timer, delta, currentSpeedScale);
  }
  (0, _groundLayerTwoTwo.updateGroundLayerTwoTwo)(delta, currentSpeedScale);
  (0, _bonusLayer.updateBonusLayer)(delta, currentSpeedScale);
  (0, _ground.updateGround)(delta, currentSpeedScale);
  (0, _groundLayerThree.updateGroundLayerThree)(delta, currentSpeedScale);
  (0, _groundLayerTwo.updateGroundLayerTwo)(delta, currentSpeedScale);
  // updateCactus(delta, currentSpeedScale);
  // updateBird(delta, currentSpeedScale);
  // updateGroundEnemy(delta, currentSpeedScale);
  (0, _platform.updatePlatform)(delta, currentSpeedScale);
  // updateFlag(delta, currentSpeedScale);
  (0, _updateInterfaceText.updateInterfaceText)(delta, currentSpeedScale);
  // updateMultiplier(delta, currentSpeedScale);
  // updateMagnet(delta, currentSpeedScale);
  // updateCoin(delta, currentSpeedScale);
  (0, _playerController.updateDino)(delta, currentSpeedScale, getGravityFallAdjustment(), getSelectedStarter());
  updateSpeedScale(delta);
  updateScore(delta);
  checkCollisions();
  lastTime = time;
  window.requestAnimationFrame(update);
}
function createOneUpText(element) {
  _soundController.soundController.beatScore.play();
  var newElement = document.createElement('div');
  newElement.classList.add('one-up', 'sans');
  newElement.style.position = 'absolute';
  element.appendChild(newElement);
  newElement.textContent = '1UP';
  newElement.addEventListener('animationend', function () {
    newElement.remove();
  });
  return true;
}
var currentComboScore = 0; // Initialize the current combo score variable

function resetMultiplier() {
  (0, _toggleElement.toggleElemOff)(_elementsRefs.interfaceComboContainer);
  (0, _toggleElement.toggleElemOff)(_elementsRefs.currentComboScoreContainer);
  clearInterval(getTimerInterval());
  setTimerInterval(null);
  currentComboScore = 0;
  _elementsRefs.timerProgress.style.width = '100%'; // Set the progress bar to full width
  setMultiplierTimer(5000);
  _elementsRefs.currentMultiplierElem.textContent = 'x1';
  _elementsRefs.currentMultiplierScoreElem.textContent = '0';
  setMultiplierRatio(1);
}
function startMultiplierTimer() {
  clearInterval(getTimerInterval());
  setMultiplierTimer(5000);
  var timerInterval = setInterval(function () {
    setMultiplierTimer(getMultiplierTimer() - 100); // Subtract 100 milliseconds (adjust as needed)
    var progressValue = getMultiplierTimer() / 5000 * 100; // Calculate progress value

    if (getMultiplierTimer() <= 0) {
      resetMultiplier();
    } else {
      _elementsRefs.timerProgress.style.width = "".concat(progressValue, "%");
    }
  }, 100); // Update every 100 milliseconds
  setTimerInterval(timerInterval);
}
function checkMultiplierCollision() {
  var dinoRect = (0, _playerController.getDinoRect)();
  (0, _scoreMultiplier.getMultiplierRects)().some(function (element) {
    if (isCollision(element.rect, dinoRect)) {
      // soundController.beatScore.play();
      document.getElementById(element.id).remove();
      var currentMultiplierRatio = getMultiplierRatio();
      // Multiply the existing multiplier by the newly collided multiplier
      if (currentMultiplierRatio === 1) {
        currentMultiplierRatio += parseInt(element.multiplier) - 1;
        setMultiplierRatio(currentMultiplierRatio);
      } else {
        currentMultiplierRatio += parseInt(element.multiplier);
        setMultiplierRatio(currentMultiplierRatio);
      }
      updateMultiplierInterface();
      return true;
    }
  });
}
function updateMultiplierInterface() {
  (0, _toggleElement.toggleElemOn)(_elementsRefs.interfaceComboContainer);
  (0, _toggleElement.toggleElemOn)(_elementsRefs.currentComboScoreContainer);
  clearInterval(getTimerInterval());
  startMultiplierTimer();
  _elementsRefs.currentMultiplierElem.textContent = "x".concat(getMultiplierRatio());
}
var duration = 1000;
var updateInterval = 50;
function randomArc(element) {
  // Set random horizontal movement values
  var randomXEnd = Math.random() * 100 - 50; // Adjust the range based on your preference
  document.documentElement.style.setProperty('--random-x-end', randomXEnd + 'px');
}
function calculateFontSize(points) {
  return Math.min(12 + points * 0.01, 36);
}
var goldCoinCounter = 0;
var redGemMultiplier = 1;
function checkCoinCollision() {
  var dinoRect = (0, _playerController.getDinoRect)();
  (0, _coin.getCoinRects)().some(function (element) {
    if (isCollision(element.rect, dinoRect)) {
      var coinElement = document.getElementById(element.id);
      if (coinElement.dataset.type === 'gold-coin' && goldCoinCounter < 14 && getSelectedStarter() === 'Glasses') {
        // Increment the counter and update the value of the next red gem
        goldCoinCounter++;
        redGemMultiplier = goldCoinCounter;

        // Check if glasses buff div exists, otherwise create it
        var glassesBuffDiv = document.querySelector('.top-hud-right .glasses-buff');
        if (!glassesBuffDiv) {
          createGlassesBuffDiv(_glasses.default);
        }

        // Update the glasses buff div with the current counter
        updateGlassesBuffDiv(goldCoinCounter);
      }
      // Create a pickup text element
      var newElement = document.createElement('div');
      addPickupText(newElement, coinElement);
      coinElement.remove();
      setTimeout(function () {
        newElement.remove();
      }, 600);

      // Remove the coin and update points
      _soundController.soundController.pickupCoin.play();
      return true;
    }
  });
}
function createOneUpTextAtPosition(position) {
  _soundController.soundController.beatScore.play();
  var newElement = document.createElement('div');
  newElement.classList.add('one-up', 'moving-interface-text');
  newElement.style.position = 'absolute';
  newElement.dataset.interfaceText = true;
  // Set the position based on the provided coordinates
  newElement.style.top = "".concat(position.y - 100, "px");
  _elementsRefs.worldElem.appendChild(newElement);
  newElement.textContent = '1UP';

  // Store the created element in the array
  addInterfaceTextElem(newElement);

  // Listen for the animationend event to remove the element
  newElement.addEventListener('animationend', function () {
    newElement.remove();
    removeInterfaceTextElem(newElement);
  });
  return true;
}
function checkHeartCollision() {
  var dinoRect = (0, _playerController.getDinoRect)();
  (0, _heart.getHeartRects)().some(function (element) {
    if (isCollision(element.rect, dinoRect)) {
      var collisionPosition = {
        x: dinoRect.x,
        y: dinoRect.y
      };
      var currentLives = parseInt(_elementsRefs.livesElem.textContent, 10);
      currentLives += 1;
      _elementsRefs.livesElem.textContent = currentLives;
      var heartElement = document.getElementById(element.id);
      createOneUpTextAtPosition(collisionPosition);
      heartElement.remove();
      // // Add a class to dinoElem

      // // Set a timeout to remove the class after the star duration
      // setTimeout(() => {

      //   // Remove the class from dinoElem after the star duration
      // }, 100);

      return true;
    }
  });
}
function checkLeafCollision() {
  var dinoRect = (0, _playerController.getDinoRect)();
  (0, _leaf.getLeafRects)().some(function (element) {
    if (isCollision(element.rect, dinoRect)) {
      var leaf = document.getElementById(element.id);
      setHasLeaf(true);
      setJumpCountLimit(4);
      leaf.remove();
      setTimeout(function () {
        setHasLeaf(false);
        setJumpCountLimit(1);
      }, getLeafDuration());
      return true;
    }
  });
}
function checkCherryCollision() {
  var dinoRect = (0, _playerController.getDinoRect)();
  (0, _cherry.getCherryRects)().some(function (element) {
    if (isCollision(element.rect, dinoRect)) {
      var cherryElement = document.getElementById(element.id);
      // Create a pickup text element
      var newElement = document.createElement('div');
      if (!(getCherryPoints() >= 8000)) {
        if (cherryElement.dataset.points != getCherryPoints()) {
          cherryElement.dataset.points = getCherryPoints();
        }
        setCherryPoints(getCherryPoints() * 2);
      }
      addPickupText(newElement, cherryElement);
      cherryElement.remove();
      return true;
    }
  });
}
function checkStarCollision() {
  var dinoRect = (0, _playerController.getDinoRect)();
  (0, _star.getStarRects)().some(function (element) {
    if (isCollision(element.rect, dinoRect)) {
      var starElement = document.getElementById(element.id);
      starElement.remove();
      setHasStar(true);
      // Add a class to dinoElem
      _elementsRefs.dinoElem.classList.add('star-invincible');

      // Set a timeout to remove the class after the star duration
      setTimeout(function () {
        setHasStar(false);
        setPlayerImmunity(false);
        // Remove the class from dinoElem after the star duration
        _elementsRefs.dinoElem.classList.remove('star-invincible');
      }, getStarDuration());
      setTimedPlayerImmunity(getStarDuration());
      return true;
    }
  });
}
function checkMagnetCollision() {
  var dinoRect = (0, _playerController.getDinoRect)();
  (0, _magnet.getMagnetRects)().some(function (element) {
    if (isCollision(element.rect, dinoRect)) {
      var magnetElement = document.getElementById(element.id);
      magnetElement.remove();
      document.querySelectorAll('[data-coin]').forEach(function (coin) {
        coin.dataset.locked = 'true';
        coin.dataset.isMagnetLocked = 'true';
        coin.dataset.isLocking === 'false';
      });
      return true;
    }
  });
}

// setTimeout(() => {
//   collisionOccurred = false;
//   dinoElem.classList.remove('flash-animation');
//   dinoElem.classList.add('flash-light-animation');
// }, 400);
// setTimeout(() => {
//   collisionOccurred = false;
//   dinoElem.classList.remove('flash-light-animation');
// }, 1600);

// Function to create glasses buff div
function createGlassesBuffDiv(imgSrc) {
  var topHudRightDiv = document.querySelector('.top-hud-right');
  var glassesBuffDiv = document.createElement('div');
  glassesBuffDiv.id = 'glasses-buff-container';
  glassesBuffDiv.classList.add('glasses-buff', 'hide-element');
  topHudRightDiv.appendChild(glassesBuffDiv);
  // Create an img element with the specified src
  var imgElement = document.createElement('img');
  imgElement.classList.add('buff-icon', 'w-full');
  imgElement.src = imgSrc; // Set the src attribute with the provided imgSrc

  var buffStackDiv = document.createElement('div');
  buffStackDiv.classList.add('glasses-buff-stacks', 'buff-stacks', 'power-up-rank');
  buffStackDiv.id = "glasses-buff";
  buffStackDiv.textContent = '0';
  // Append the img element to the bordered div
  var borderedDiv = document.createElement('div');
  borderedDiv.classList.add('bordered-buff-div', 'relative', 'small-border-inset');
  borderedDiv.appendChild(imgElement);
  borderedDiv.appendChild(buffStackDiv);
  // Append the bordered div to the glasses buff div
  glassesBuffDiv.appendChild(borderedDiv);

  // Append the glasses buff div to the top hud
}

// Function to update glasses buff div with the current counter
function updateGlassesBuffDiv(counter) {
  var glassesBuffStackDiv = document.getElementById('glasses-buff');
  if (glassesBuffStackDiv) {
    if (glassesBuffStackDiv.textContent === '0') {
      var glassesBuffDiv = document.getElementById('glasses-buff-container');
      glassesBuffDiv.classList.remove('hide-element');
      glassesBuffDiv.classList.add('show-element');
    }
    glassesBuffStackDiv.textContent = counter;
  }
}
var lastMultiplierScore = document.querySelector('[data-last-multiplier-score]');
function addPickupText(text, pickupElement) {
  text.classList.add('plus-points', 'sans');
  text.style.position = 'absolute';
  text.style.left = pickupElement.offsetLeft + 'px';
  text.style.top = pickupElement.offsetTop - 70 + 'px';
  randomArc(text);
  pickupElement.parentNode.insertBefore(text, pickupElement);
  var pickupPoints, points;
  var currentMultiplierRatio = getMultiplierRatio();
  //case when glasses are starter
  if (pickupElement.dataset.type === 'red-gem' && redGemMultiplier !== 1) {
    var _pickupElement$datase;
    pickupPoints = (pickupElement === null || pickupElement === void 0 || (_pickupElement$datase = pickupElement.dataset) === null || _pickupElement$datase === void 0 ? void 0 : _pickupElement$datase.points) * redGemMultiplier;
    points = pickupPoints * currentMultiplierRatio;
    redGemMultiplier = 1;
    goldCoinCounter = 0;
    var glassesBuffStackDiv = document.getElementById('glasses-buff');
    glassesBuffStackDiv.textContent = goldCoinCounter;
    if (glassesBuffStackDiv) {
      var glassesBuffDiv = document.getElementById('glasses-buff-container');
      if (glassesBuffDiv.classList.contains('show-element')) {
        glassesBuffDiv.classList.remove('show-element');
        glassesBuffDiv.classList.add('hide-element');
      } // Set the number of stacks
    }
  }
  //case when coins are starter
  else if (getSelectedStarter() === 'Coins' && pickupElement.dataset.type === 'gold-coin') {
    var _pickupElement$datase2;
    pickupPoints = Math.round((pickupElement === null || pickupElement === void 0 || (_pickupElement$datase2 = pickupElement.dataset) === null || _pickupElement$datase2 === void 0 ? void 0 : _pickupElement$datase2.points) / 2);
    points = pickupPoints * currentMultiplierRatio;
  } else {
    var _pickupElement$datase3;
    pickupPoints = pickupElement === null || pickupElement === void 0 || (_pickupElement$datase3 = pickupElement.dataset) === null || _pickupElement$datase3 === void 0 ? void 0 : _pickupElement$datase3.points;
    points = pickupPoints * currentMultiplierRatio;
  }
  updateScoreWithPoints(points);
  var fontSize = calculateFontSize(points);
  text.style.fontSize = fontSize + 'px';
  text.textContent = "+".concat(points);
  // Add a div inside the lastMultiplierScore
  var innerDiv = document.createElement('div');
  innerDiv.textContent = "+".concat(pickupPoints, "x").concat(currentMultiplierRatio);
  innerDiv.classList.add('inner-plus-points', 'sans');

  // Check if there is an existing innerDiv, remove it if present
  var existingInnerDiv = lastMultiplierScore.querySelector('.inner-plus-points');
  if (existingInnerDiv) {
    existingInnerDiv.remove();
  }

  // Append the new innerDiv inside lastMultiplierScore
  lastMultiplierScore.appendChild(innerDiv);
  if (innerDiv) {
    // Remove the new innerDiv after 1 second
    setTimeout(function () {
      innerDiv.remove();
    }, 1000);
  }
}
var scoreSinceMilestone = 0;
function updateScoreWithPoints(delta) {
  var initialScore = score;
  var increments = Math.ceil(duration / updateInterval);
  var incrementAmount = delta / increments;
  var currentMultiplierRatio = getMultiplierRatio();
  var intervalId = setInterval(function () {
    score += incrementAmount;
    scoreSinceMilestone += incrementAmount;
    _elementsRefs.scoreElem.textContent = Math.floor(score).toString().padStart(6, 0);
    if (currentMultiplierRatio > 1) {
      currentComboScore += incrementAmount;
      _elementsRefs.currentMultiplierScoreElem.textContent = Math.floor(currentComboScore).toString().padStart(1, 0);
    }
    if (score >= initialScore + delta) {
      // Stop the interval when the target score is reached
      clearInterval(intervalId);
    }
  }, updateInterval);
}
function checkLose() {
  //init dino rect
  var dinoRect = (0, _playerController.getDinoRect)();
  var cactusRects = (0, _cactus.getCactusRects)();
  var birdRects = (0, _bird.getBirdRects)();
  var groundEnemyRects = (0, _groundEnemy.getGroundEnemyRects)();
  var allEnemyRects = [].concat(_toConsumableArray(cactusRects), _toConsumableArray(birdRects), _toConsumableArray(groundEnemyRects));

  //init enemy and player collision state
  var isEnemyAndPlayerCollision = allEnemyRects.some(function (rect) {
    return isCollision(rect, dinoRect);
  });

  //if no lives remain then lose
  if (_elementsRefs.livesElem.textContent === '0') {
    _elementsRefs.worldElem.setAttribute('transition-style', 'out:circle:hesitate');
    _elementsRefs.worldElem.classList.remove('stop-time'); // Add the class to stop time
    return true;
  } //check if enemy and player are in colliding
  else if (isEnemyAndPlayerCollision && !getPlayerImmunity() && !getHasStar()) {
    //check if player is not in previous collision state
    if (!collisionOccurred) {
      // decrement lives elem by 1
      _soundController.soundController.takeDamage.play();
      var currentLives = parseInt(_elementsRefs.livesElem.textContent, 10);
      if (!isNaN(currentLives)) {
        currentLives -= 1;
        _elementsRefs.livesElem.textContent = currentLives;
      }
      resetMultiplier();
      //switch player collision state to true
      collisionOccurred = true;
      //set player to flash
      _elementsRefs.dinoElem.classList.add('flash-animation');
      //set world update pause
      _elementsRefs.worldElem.classList.add('stop-time'); // Add the class to stop time
      //set timeout for world update pause

      // // Set a timeout to reset player collision state and player flash
      setTimeout(function () {
        _elementsRefs.dinoElem.classList.remove('flash-animation');
        _elementsRefs.dinoElem.classList.add('flash-light-animation');
      }, 400);
      setTimeout(function () {
        collisionOccurred = false;
        _elementsRefs.dinoElem.classList.remove('flash-light-animation');
      }, 1600);
    }
  } else if (isEnemyAndPlayerCollision && getPlayerImmunity()) {}
}
var muteButton = document.getElementById('muteButton');
var soundControllerMuted = false;
var muteIconButton = document.getElementById('mute-icon-button');
//mute/unmute function
muteButton.addEventListener('click', function () {
  if (!soundControllerMuted) {
    Object.keys(_soundController.soundController).forEach(function (key) {
      _soundController.soundController[key].mute(true);
    });
    muteIconButton.src = _SpeakerOff.default;
    soundControllerMuted = true;
    muteButton.blur();
  } else {
    Object.keys(_soundController.soundController).forEach(function (key) {
      _soundController.soundController[key].mute(false);
    });
    muteIconButton.src = _SpeakerOn.default;
    soundControllerMuted = false;
    muteButton.blur();
  }
});
function isCollision(rect1, rect2) {
  return rect1.left < rect2.right && rect1.top < rect2.bottom && rect1.right > rect2.left && rect1.bottom > rect2.top;
}
function updateSpeedScale(delta) {
  currentSpeedScale += delta * getSpeedScaleIncrease();
}

// Assuming you have the necessary elements in your HTML
var levelBarElem = document.getElementById('levelBar');
var levelDisplayElem = document.getElementById('levelDisplay');
function calculateNextMilestone(currentMilestone) {
  // You can customize the growth rate based on your requirements
  var growthRate = 2; // Adjust this as needed
  return Math.floor(currentMilestone * growthRate);
}
function handleLevelUp() {
  scoreSinceMilestone = 0;
  // Increment the level
  var currentLevel = parseInt(levelDisplayElem.textContent, 10);
  levelDisplayElem.textContent = currentLevel + 1;
  if (getSelectedStarter() === 'Text book') {
    currentPassives.forEach(function (item) {
      var currentItem = collectableOptions.find(function (curItem) {
        return curItem.type === item.type;
      });
      item.lastValue = currentItem.points;
      item.effect(incrementAdjustment);
    });
  }
  if (currentLevel === 1) {
    (0, _buff.createStarterBuffs)();
  } else {
    (0, _buff.createBuffs)();
  }
  // Reset the progress bar to 0
  levelBarElem.value = 0;
  // Update the milestone for the next level
  milestone = calculateNextMilestone(milestone);
}
function updateScore(delta) {
  score += delta * 0.01;
  scoreSinceMilestone += delta * 0.01;
  _elementsRefs.scoreElem.textContent = Math.floor(score).toString().padStart(6, '0');

  // Update the level bar
  var progress = scoreSinceMilestone / milestone * 100;
  levelBarElem.value = progress;
  if (score > _elementsRefs.highScoreElem.textContent && !hasBeatenScore && _elementsRefs.highScoreElem.textContent !== '000000') {
    _soundController.soundController.beatScore.play();
    hasBeatenScore = true;
  }
  if (scoreSinceMilestone >= milestone) {
    handleLevelUp();
  }
}
function handleCheckIfHighScore(score) {
  if (score > _elementsRefs.highScoreElem.textContent) {
    _elementsRefs.highScoreElem.textContent = Math.floor(score).toString().padStart(6, 0);
    localStorage.setItem('lion-high-score', _elementsRefs.highScoreElem.textContent);
  }
  if (handleCheckLeaderboardHighScore(score)) {
    return true;
  }
}
function setUpElements() {
  setupGroundElements();
  setupObstacles();
  setupCharacters();
  setupPowerUps();
  (0, _platform.setupPlatform)();
}
function setupGroundElements() {
  (0, _ground.setupGround)();
  (0, _groundLayerTwo.setupGroundLayerTwo)();
  (0, _groundLayerThree.setupGroundLayerThree)();
  (0, _bonusLayer.setupBonusLayer)();
}
function setupObstacles() {
  (0, _cactus.setupCactus)();
  (0, _bird.setupBird)();
  (0, _groundEnemy.setupGroundEnemy)();
}
function setupCharacters() {
  (0, _playerController.setupDino)();
}
function setupPowerUps() {
  (0, _scoreMultiplier.setupMultiplier)();
  (0, _coin.setupCoin)();
  (0, _magnet.setupMagnet)();
}
function handleStart() {
  updateNotification("stage ".concat(getCurrentPhase(), "!"));
  clearInterval(idleIntervalId); // Clear the interval
  _elementsRefs.worldElem.setAttribute('transition-style', 'in:circle:center');
  lastTime = null;
  hasBeatenScore = false;
  score = 0;
  startTimer();
  setMultiplierRatio(1);
  var currentMultiplierRatio = getMultiplierRatio();
  setUpElements();
  _elementsRefs.dinoElem.classList.remove('leap');
  _elementsRefs.currentMultiplierElem.textContent = "x".concat(currentMultiplierRatio);
  _elementsRefs.livesElem.textContent = 10;
  _elementsRefs.startScreenElem.classList.add('hide');
  _elementsRefs.endScreenElem.classList.add('hide');
  _elementsRefs.gameOverIconElem.classList.add('hide-element');
  // Get the container element where the ticker items will be appended
  var tickerData = [{
    username: 'bap1',
    score: 'start'
  }, {
    username: 'b4p2',
    score: '323451'
  }, {
    username: 'fgp3',
    score: '331451'
  }, {
    username: 'agf4',
    score: '131451'
  }, {
    username: 'bap5',
    score: '353451'
  }, {
    username: 'b4p6',
    score: '323451'
  }, {
    username: 'fgp',
    score: '331451'
  }, {
    username: 'bap7',
    score: '353451'
  }, {
    username: 'b4p8',
    score: '323451'
  }, {
    username: 'fgp9',
    score: '331451'
  }, {
    username: 'agf10',
    score: '131451'
  }, {
    username: 'bap11',
    score: '353451'
  }, {
    username: 'b4p12',
    score: '323451'
  }, {
    username: 'fgp13',
    score: 'end'
  }];
  tickerData.forEach(function (item, index) {
    var tickerItem = document.createElement('div');
    tickerItem.classList.add('ticker__item');
    tickerItem.innerHTML = "".concat(item.username, " - ").concat(item.score);
    var tickerDivider = document.createElement('div');
    tickerDivider.classList.add('ticker-divider');
    _elementsRefs.tickerElem.appendChild(tickerItem);
    // Add a divider after each item, except for the last one
    if (index < tickerData.length - 1) {
      _elementsRefs.tickerElem.appendChild(tickerDivider);
    }
  });
  tickerData.forEach(function (item, index) {
    var tickerItem = document.createElement('div');
    tickerItem.classList.add('ticker__item');
    tickerItem.innerHTML = "".concat(item.username, " - ").concat(item.score);
    var tickerDivider = document.createElement('div');
    tickerDivider.classList.add('ticker-divider');
    _elementsRefs.tickerElem2.appendChild(tickerItem);
    // Add a divider after each item, except for the last one
    if (index < tickerData.length - 1) {
      _elementsRefs.tickerElem2.appendChild(tickerDivider);
    }
  });
  tickerData.forEach(function (item, index) {
    var tickerItem = document.createElement('div');
    tickerItem.classList.add('ticker__item');
    tickerItem.innerHTML = "".concat(item.username, " - ").concat(item.score);
    var tickerDivider = document.createElement('div');
    tickerDivider.classList.add('ticker-divider');
    _elementsRefs.tickerElem3.appendChild(tickerItem);
    // Add a divider after each item, except for the last one
    if (index < tickerData.length - 1) {
      _elementsRefs.tickerElem3.appendChild(tickerDivider);
    }
  });
  // tickerContainerElem.classList.add('hide-element');
  // tickerContainerElem.classList.remove('show-element');

  window.requestAnimationFrame(update);
}
var timer = 0;
var intervalId;
function updateTimer() {
  timer++;
  _elementsRefs.currentGameTimerElem.textContent = formatTime(timer);
}
function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;
  return "".concat(minutes, ":").concat(remainingSeconds < 10 ? '0' : '').concat(remainingSeconds);
}
function startTimer() {
  intervalId = setInterval(updateTimer, 1000); // Update the timer every second
}

function stopTimer() {
  clearInterval(intervalId);
}

// Function to toggle the pause state
function togglePause() {
  isPaused = !isPaused;
  // const body = document.body;
  if (isPaused) {
    // body.classList.add('pause-animation');
    pauseIconButton.src = _Play.default;
    stopTimer(); // Pause the timer
    _particleSystems.snow.togglePause();
  } else {
    // body.classList.remove('pause-animation');
    pauseIconButton.src = _Pause.default;
    _particleSystems.snow.togglePause();
    startTimer(); // Start the timer or resume from where it left off
    window.requestAnimationFrame(update);
  }
}
function revealAchievementForm(index, score) {
  _elementsRefs.gameOverIconElem.classList.add('hide-element');
  var rank = index + 2;
  _elementsRefs.scoreNewHighScoreElem.textContent = Math.round(score);
  var achievementRankElem = document.getElementById('achievement-rank-text');
  achievementRankElem.textContent = "".concat(rank).concat((0, _leaderboard.getSuffix)(rank));
  var achievementBlockElem = document.getElementById('achievement-block');
  var lionGameAchievementTitleElem = document.getElementById('achievement-title-block');
  var achievementInstructionsBlockElem = document.getElementById('achievement-instructions-block');
  var achievementFormElem = document.getElementById('achievement-form-block');
  var newHighScoreInput = document.getElementById('newHighScoreInput');
  _elementsRefs.submitNewScoreFormElem.classList.remove('hide-form');
  _elementsRefs.submitNewScoreFormElem.classList.add('show-form');
  setTimeout(function () {
    lionGameAchievementTitleElem.classList.remove('fade-out-text');
    lionGameAchievementTitleElem.classList.add('fade-in-text');
  }, 2000);
  setTimeout(function () {
    typeLettersWithoutSpaces(0, 'Achievement', achievementBlockElem, 100);
  }, 4050);
  setTimeout(function () {
    typeLettersWithoutSpaces(0, 'New high score, enter your username!', achievementInstructionsBlockElem, 100);
  }, 8050);
  setTimeout(function () {
    newHighScoreInput.focus();
    achievementFormElem.classList.remove('fade-out-text');
    achievementFormElem.classList.remove('fade-in-text');
  }, 12050);
}
function handleCheckLeaderboardHighScore(_x) {
  return _handleCheckLeaderboardHighScore.apply(this, arguments);
} //trim any extra spaces in score
function _handleCheckLeaderboardHighScore() {
  _handleCheckLeaderboardHighScore = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(score) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return (0, _apis.getAllHighScoreUsers)().then(function (data) {
            //sort all the data in ascending order
            var sortedData = data.users.sort(function (a, b) {
              return parseInt(b.score, 10) - parseInt(a.score, 10);
            });
            //check the last highest score compared to the leaderboard
            var lastHigherScore = sortedData.reverse().find(function (user) {
              return parseInt(user.score, 10) > parseInt(score, 10);
            });
            //find the index of the last highest score
            var index = sortedData.reverse().indexOf(lastHigherScore);
            //if the index is not data.length-1 then the score is not higher than any on the leaderboard
            if (index !== sortedData.length - 1) {
              // const rank = index !== 0 ? index + 2 : index; will need to add condition for the highest score
              revealAchievementForm(index, score);
              return true;
            } else {
              setTimeout(function () {
                document.addEventListener('keydown', handleStart, {
                  once: true
                });
                document.addEventListener('touchstart', handleStart, {
                  once: true
                });
                _elementsRefs.endScreenElem.classList.remove('hide');
              }, 100);
              setTimeout(function () {
                typeLetters(0);
              }, 1500);
              return;
            }
          });
        case 3:
          _context.next = 8;
          break;
        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 5]]);
  }));
  return _handleCheckLeaderboardHighScore.apply(this, arguments);
}
function trimmedOutExtraSpacesScore(score) {
  return score.replace(/\s+/g, ' ').trim();
}

//submit new score to leaderboard
function handleSubmitNewScore() {
  return _handleSubmitNewScore.apply(this, arguments);
}
function _handleSubmitNewScore() {
  _handleSubmitNewScore = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var userInput, res, leaderboardContent;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          userInput = document.getElementById('newHighScoreInput').value; //check for validation errors and update error message accordingly
          if (!(!(0, _validateInput.validateInput)() || !userInput)) {
            _context2.next = 5;
            break;
          }
          _elementsRefs.scoreErrorMessageElem.textContent = 'Enter a valid name!';
          _elementsRefs.scoreErrorMessageElem.classList.remove('hide');
          return _context2.abrupt("return");
        case 5:
          _context2.next = 7;
          return (0, _apis.handleNewHighScore)(userInput, trimmedOutExtraSpacesScore(_elementsRefs.scoreNewHighScoreElem.textContent));
        case 7:
          res = _context2.sent;
          if (!(res === 'user already exists')) {
            _context2.next = 14;
            break;
          }
          _elementsRefs.scoreErrorMessageElem.textContent = res;
          _elementsRefs.scoreErrorMessageElem.classList.remove('hide');
          return _context2.abrupt("return");
        case 14:
          _elementsRefs.submitNewScoreFormElem.classList.add('fade-out-text');
          _elementsRefs.scrollableTableElem.style.display = 'flex';
          showLeaderboard = !showLeaderboard;
          leaderboardContent = document.getElementById('leaderboard-content');
          leaderboardContent.classList.remove('flicker-opacity-off');
          loading = true;
          runTypeLetters();
          showLeaderboard = !showLeaderboard;
          _elementsRefs.worldElem.setAttribute('transition-style', '');
          stopLoading();
          _elementsRefs.scrollableTableElem.setAttribute('transition-style', 'in:wipe:left');
          _elementsRefs.scrollableTableElem.classList.add('show-element');
          leaderboardContent.classList.add('translateX-right-to-left');
          _elementsRefs.scrollableTableElem.classList.remove('hide-element');
          setTimeout(function () {
            showLeaderboard = true;
            _elementsRefs.scrollableTableElem.classList.remove('hide-element');
            _elementsRefs.scrollableTableElem.classList.add('show-element');
            _elementsRefs.scoreErrorMessageElem.classList.add('hide');
          }, 3000);
        case 29:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _handleSubmitNewScore.apply(this, arguments);
}
document.addEventListener('click', function (event) {
  var shareContainer = document.getElementById('share-container');
  var shareButton = document.getElementById('shareButton');
  if (!shareContainer.contains(event.target) && !shareButton.contains(event.target)) {
    shareContainer.classList.remove('show-share-container');
  }
});
function handleOpenShareContainer() {
  var shareContainer = document.getElementById('share-container');
  shareContainer.classList.add('show-share-container');
}
if (document.getElementById('submit-button')) {
  document.getElementById('submit-button').addEventListener('click', handleSubmitNewScore);
}
var currentPage = 'leaderboard-page';
function handleOpenWiki() {
  underlineCurrentPageButton('wiki-page');
}
function handleOpenControls() {
  underlineCurrentPageButton('controls-page');
}
function handleOpenLeaderboard() {
  underlineCurrentPageButton('leaderboard-page');
}
function underlineCurrentPageButton(page) {
  var oldPage = document.getElementById(currentPage);
  oldPage.classList.add('hide-page');
  oldPage.classList.remove('show-page');
  var currentButton = document.getElementById(pageButtons[currentPage]);
  currentButton.classList.remove('sidebar-button-selected');
  currentPage = page;
  var newPage = document.getElementById(currentPage);
  newPage.classList.add('show-page');
  newPage.classList.remove('hide-page');
  var newButton = document.getElementById(pageButtons[newPage.id]);
  newButton.classList.add('sidebar-button-selected');
}
document.getElementById('closeLeaderboard').addEventListener('click', handleToggleLeaderboard);
document.getElementById('toggleLeaderboard').addEventListener('click', handleToggleLeaderboard);
document.getElementById('shareButton').addEventListener('click', handleOpenShareContainer);
document.getElementById('show-wiki-page-button').addEventListener('click', handleOpenWiki);
document.getElementById('show-controls-page-button').addEventListener('click', handleOpenControls);
document.getElementById('show-leaderboard-page-button').addEventListener('click', handleOpenLeaderboard);
var pageButtons = {
  'wiki-page': 'show-wiki-page-button',
  'leaderboard-page': 'show-leaderboard-page-button',
  'controls-page': 'show-controls-page-button'
};
underlineCurrentPageButton('leaderboard-page');
var loading;
function stopLoading() {
  loading = false;
}
function handleToggleLeaderboard() {
  var leaderboardContent = document.getElementById('leaderboard-content');
  if (showLeaderboard !== null && showLeaderboard === false) {
    leaderboardContent.classList.remove('flicker-opacity-off');
    loading = true;
    runTypeLetters();
    showLeaderboard = !showLeaderboard;
    _elementsRefs.worldElem.setAttribute('transition-style', 'out:wipe:right');
    var randomTimeout = Math.random() * (2800 - 1500) + 1500; // Random timeout between 1500ms and 2800ms
    setTimeout(function () {
      stopLoading();
      _elementsRefs.scrollableTableElem.setAttribute('transition-style', 'in:wipe:left');
      _elementsRefs.scrollableTableElem.classList.add('show-element');
      leaderboardContent.classList.add('translateX-right-to-left');
      _elementsRefs.scrollableTableElem.classList.remove('hide-element');
    }, randomTimeout);
  } else {
    handleStart();
    loading = true;
    runTypeLetters();
    showLeaderboard = !showLeaderboard;
    _elementsRefs.scrollableTableElem.setAttribute('transition-style', 'out:wipe:right');
    leaderboardContent.classList.add('flicker-opacity-off');
    setTimeout(function () {
      stopLoading();
      _elementsRefs.scrollableTableElem.style.display = 'none';
      _elementsRefs.worldElem.setAttribute('transition-style', 'in:wipe:left');
      _elementsRefs.scrollableTableElem.classList.remove('show-element');
      _elementsRefs.scrollableTableElem.classList.add('hide-element');
    }, 1500);
  }
}
function runTypeLetters() {
  if (!loading) {
    return;
  }
  _elementsRefs.loadingTextElem.textContent = '';
  typeLettersAny(0, '...', _elementsRefs.loadingTextElem, 120);
  var rerunDelay = 2700;
  setTimeout(runTypeLetters, rerunDelay);
}
function handleLose() {
  _elementsRefs.gameOverTextElem.textContent = '';
  // tickerContainerElem.classList.add('show-element');
  // tickerContainerElem.classList.remove('hide-element');
  _soundController.soundController.die.play();
  (0, _playerController.setDinoLose)();
  handleCheckIfHighScore(score);
}
function setPixelToWorldScale() {
  var worldToPixelScale;
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }
  _elementsRefs.worldElem.style.width = "".concat(WORLD_WIDTH * worldToPixelScale, "px");
  _elementsRefs.worldElem.style.height = "".concat(WORLD_HEIGHT * worldToPixelScale, "px");
}
function handleOrientationChange() {
  var blackScreen = document.getElementById('blackScreen');
  if (isMobile() && window.orientation === 0 || window.orientation === 180) {
    // Portrait orientation on mobile
    blackScreen.style.display = 'flex';
  } else {
    // Hide black screen in other cases
    blackScreen.style.display = 'none';
  }
}
function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

// Initial check
handleOrientationChange();

// Listen for orientation changes
window.addEventListener('orientationchange', handleOrientationChange);
var textToType = 'Game Over';
function typeLetters(index) {
  if (index < textToType.length) {
    _elementsRefs.gameOverTextElem.textContent += textToType.charAt(index);
    setTimeout(function () {
      return typeLetters(index + 1);
    }, 200); // Adjust the delay as needed
  } else {
    _elementsRefs.gameOverIconElem.classList.remove('hide-element');
    _elementsRefs.gameOverIconElem.classList.add('show-element');
  }
}
function typeLettersAny(index, text, elem, timeout) {
  if (index < text.length) {
    elem.innerHTML += "<span>".concat(text.charAt(index), "</span>");
    setTimeout(function () {
      Array.from(elem.children).forEach(function (span, index) {
        setTimeout(function () {
          span.classList.add('wavy');
        }, index * 80);
      });
      typeLettersAny(index + 1, text, elem, timeout);
    }, 250); // Adjust the delay as needed
  } else {
    elem.classList.remove('hide-element');
    elem.classList.add('show-element');
  }
}
function typeLettersWithoutSpaces(index, text, elem, timeout) {
  if (index < text.length) {
    elem.textContent += text.charAt(index);
    setTimeout(function () {
      typeLettersWithoutSpaces(index + 1, text, elem, timeout);
    }, timeout); // Use the provided timeout
  } else {
    elem.classList.remove('hide-element');
    elem.classList.add('show-element');
  }
}
var collectableOptions = exports.collectableOptions = [{
  type: 'gold-coin',
  weight: 0.3,
  points: 31
}, {
  type: 'red-gem',
  weight: 0.1,
  points: 85
}, {
  type: 'silver-coin',
  weight: 0.6,
  points: 16
}, {
  type: 'cherry',
  weight: 0,
  points: 1000
}];

//buff-effects

function filetMignonEffect() {
  var rank = 1;
  var currentLives = parseInt(_elementsRefs.livesElem.textContent, 10);
  currentLives += rank;
  _elementsRefs.livesElem.textContent = currentLives;
  var playerContainer = document.querySelector('.player-container');
  createOneUpText(playerContainer);
}
function trustyPocketWatchEffect() {
  var startRank = 0.4;
  var endRank = 0.95;
  var updateInterval = 1000; // Update every second

  var currentRank = startRank;
  var intervalId = setInterval(function () {
    // Increment the current rank
    currentRank += 0.1; // Adjust the increment as needed

    // Ensure the current rank does not exceed the end rank
    currentRank = Math.min(currentRank, endRank);

    // Update the deltaAdjustment based on the current rank
    deltaAdjustment = currentRank;
    if (currentRank >= endRank) {
      // Stop the interval when the end rank is reached
      clearInterval(intervalId);
      deltaAdjustment = endRank;
    }
  }, updateInterval);
}
function getRandomCollectable() {
  var randomValue = Math.random();
  var cumulativeProbability = 0;
  var _iterator = _createForOfIteratorHelper(collectableOptions),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var option = _step.value;
      cumulativeProbability += option.weight;
      if (randomValue <= cumulativeProbability) {
        return option;
      }
    }

    // Default case (fallback)
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return collectableOptions[collectableOptions.length - 1];
}
function sackOfCoinsEffect() {
  var totalPoints = 0;
  var currentMultiplierRatio = getMultiplierRatio();
  for (var i = 0; i < 25; i++) {
    var randomCollectable = getRandomCollectable();
    totalPoints += randomCollectable.points * currentMultiplierRatio;
  }
  updateScoreWithPoints(totalPoints);

  // Add totalPoints to the score (adjust as needed)
  // Example: score += totalPoints;
  console.log("Collected ".concat(totalPoints, " points from 25 random coins."));
}
function momsCookiesEffect() {
  updateScoreWithPoints(milestone);
}
function reduceByPercentage(value, percentage) {
  return value * (1 - percentage);
}
function slowFallEffect() {
  var reductionPercentage = 0.3; // Adjust the percentage as needed
  setGravityFallAdjustment(reduceByPercentage(getGravityFallAdjustment(), reductionPercentage));
}
function increaseByPercentage(value, percentage) {
  var multiplier = 1 + percentage / 100;
  return value * multiplier;
}
function reverseAndReIncrement(finalValue, incrementFactor, reIncrementFactor) {
  // Reverse the increment by incrementFactor
  var decreasedValue = finalValue / incrementFactor;
  // Re-increment the reversed value by reIncrementFactor
  var reIncrementedValue = decreasedValue * reIncrementFactor;
  return reIncrementedValue;
}
var incrementAdjustment = 1.016;
function applyIncrementEffect(collectable, incrementAdjustment, newIncrementAdjustment, effectMultiplier) {
  if (incrementAdjustment) {
    var lastCollectable = currentPassives.find(function (item) {
      return item.type === collectable.type;
    });
    // Increment the points by passive increase
    collectable.points = reverseAndReIncrement(lastCollectable.lastValue, effectMultiplier, newIncrementAdjustment);
  } else {
    collectable.points *= effectMultiplier;
  }
  collectable.points = Math.round(collectable.points);
}
function silverFeatherEffect(incrementAdjustment) {
  var newIncrementAdjustment;
  var silverFeatherIncrement = 1.2;
  var silverCoin = collectableOptions.find(function (item) {
    return item.type === 'silver-coin';
  });
  var hasSilverFeatherEffect = currentPassives.some(function (passive) {
    return passive.effect === silverFeatherEffect;
  });
  if (!hasSilverFeatherEffect) {
    handleAddToCurrentPassives(silverFeatherEffect, 'silver-coin', silverCoin.points);
  } else {
    newIncrementAdjustment = silverFeatherIncrement * incrementAdjustment;
  }
  applyIncrementEffect(silverCoin, incrementAdjustment, newIncrementAdjustment, silverFeatherIncrement);
}
function amuletEffect(incrementAdjustment) {
  var newIncrementAdjustment;
  var amuletIncrement = 1.2;
  var goldCoin = collectableOptions.find(function (item) {
    return item.type === 'gold-coin';
  });
  // Check if amuletEffect is already in currentPassives
  var hasAmuletEffect = currentPassives.some(function (passive) {
    return passive.effect === amuletEffect;
  });
  // If not, add it
  if (!hasAmuletEffect) {
    handleAddToCurrentPassives(amuletEffect, 'gold-coin', goldCoin.points);
  } else {
    newIncrementAdjustment = amuletIncrement * incrementAdjustment;
  }
  applyIncrementEffect(goldCoin, incrementAdjustment, newIncrementAdjustment, amuletIncrement);
}
//starters
var selectedStarter;
var currentPassives = [];
function handleAddToCurrentPassives(effect, type, lastValue) {
  if (getSelectedStarter() === 'Text book') {
    currentPassives.push({
      effect: effect,
      lastValue: lastValue,
      type: type
    });
  }
}
function booksSmartEffect() {
  if (currentPassives !== []) {
    currentPassives.forEach(function (ability) {
      console.log("".concat(ability.name, " - Level ").concat(ability.level, ", Value ").concat(ability.value));
    });
  }
  setSelectedStarter('Text book');
}
function glassesEffect() {
  setSelectedStarter('Glasses');
}
function coinsEffect() {
  setSelectedStarter('Coins');
}
},{"./elements/ground.js":"../elements/ground.js","./elements/groundLayerTwo":"../elements/groundLayerTwo.js","./elements/groundLayerTwoTwo":"../elements/groundLayerTwoTwo.js","./elements/groundLayerThree":"../elements/groundLayerThree.js","./elements/player-controller.js":"../elements/player-controller.js","./elements/cactus.js":"../elements/cactus.js","./elements/ground-enemy":"../elements/ground-enemy.js","./elements/bird.js":"../elements/bird.js","./elements/platform.js":"../elements/platform.js","./elements/leaderboard.js":"../elements/leaderboard.js","./utility/sound-controller.js":"../utility/sound-controller.js","./apis.js":"../apis.js","./utility/validate-input.js":"../utility/validate-input.js","./elements/score-multiplier.js":"../elements/score-multiplier.js","./elements/magnet.js":"../elements/magnet.js","./elements/heart.js":"../elements/heart.js","./elements/leaf.js":"../elements/leaf.js","./elements/flag.js":"../elements/flag.js","./elements/star.js":"../elements/star.js","./elements/coin.js":"../elements/coin.js","./public/imgs/icons/Speaker-Off.png":"imgs/icons/Speaker-Off.png","./public/imgs/icons/Speaker-On.png":"imgs/icons/Speaker-On.png","./public/imgs/icons/Pause.png":"imgs/icons/Pause.png","./public/imgs/icons/Play.png":"imgs/icons/Play.png","./public/imgs/buffs/glasses.png":"imgs/buffs/glasses.png","./public/imgs/icons/Redo.png":"imgs/icons/Redo.png","./public/imgs/backgrounds/Foreground-Trees.png":"imgs/backgrounds/Foreground-Trees.png","./elements/buff.js":"../elements/buff.js","./game-state.js":"../game-state.js","./elements-refs":"../elements-refs.js","./utility/toggle-element.js":"../utility/toggle-element.js","./elements/particle-systems.js":"../elements/particle-systems.js","./phases/phase-properties.js":"../phases/phase-properties.js","./phases/phase1.js":"../phases/phase1.js","./phases/phase2.js":"../phases/phase2.js","./phases/bonus-phase.js":"../phases/bonus-phase.js","./elements/bonus-layer.js":"../elements/bonus-layer.js","./utility/update-interface-text.js":"../utility/update-interface-text.js","./interface-text-elems-state.js":"../interface-text-elems-state.js","./elements/cherry":"../elements/cherry.js"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50788" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../game-manager.js"], null)
//# sourceMappingURL=/game-manager.e0ee197a.js.map