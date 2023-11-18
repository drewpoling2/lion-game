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
})({"../updateCustomProperty.js":[function(require,module,exports) {
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
},{}],"../ground.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupGround = setupGround;
exports.updateGround = updateGround;
var _updateCustomProperty = require("./updateCustomProperty.js");
var SPEED = 0.05;
var groundElems = document.querySelectorAll('[data-ground]');
function setupGround() {
  (0, _updateCustomProperty.setCustomProperty)(groundElems[0], '--left', 0);
  (0, _updateCustomProperty.setCustomProperty)(groundElems[1], '--left', 300);
}
function updateGround(delta, speedScale) {
  groundElems.forEach(function (ground) {
    (0, _updateCustomProperty.incrementCustomProperty)(ground, '--left', delta * speedScale * SPEED * -1);
    if ((0, _updateCustomProperty.getCustomProperty)(ground, '--left') <= -300) {
      (0, _updateCustomProperty.incrementCustomProperty)(ground, '--left', 600);
    }
  });
}
},{"./updateCustomProperty.js":"../updateCustomProperty.js"}],"../../imgs/dino-stationary.png":[function(require,module,exports) {
module.exports = "/dino-stationary.b0d5952a.png";
},{}],"../../imgs/dino-lose.png":[function(require,module,exports) {
module.exports = "/dino-lose.eb76e184.png";
},{}],"../../imgs/dino-run-0.png":[function(require,module,exports) {
module.exports = "/dino-run-0.d9f7febe.png";
},{}],"../../imgs/dino-run-1.png":[function(require,module,exports) {
module.exports = "/dino-run-1.f1b02321.png";
},{}],"../dino.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDinoRect = getDinoRect;
exports.setDinoLose = setDinoLose;
exports.setupDino = setupDino;
exports.updateDino = updateDino;
var _updateCustomProperty = require("./updateCustomProperty.js");
var _dinoStationary = _interopRequireDefault(require("../imgs/dino-stationary.png"));
var _dinoLose = _interopRequireDefault(require("../imgs/dino-lose.png"));
var _dinoRun = _interopRequireDefault(require("../imgs/dino-run-0.png"));
var _dinoRun2 = _interopRequireDefault(require("../imgs/dino-run-1.png"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var dinoElem = document.querySelector('[data-dino]');
var JUMP_SPEED = 0.45;
var GRAVITY = 0.0015;
var DINO_FRAME_COUNT = 2;
var FRAME_TIME = 100;
var isJumping;
var dinoFrame;
var currentFrameTime;
var yVelocity;
function setupDino() {
  isJumping = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  (0, _updateCustomProperty.setCustomProperty)(dinoElem, '--bottom', 0);
  document.removeEventListener('keydown', onJump);
  document.addEventListener('keydown', onJump);
}
function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}
function getDinoRect() {
  return dinoElem.getBoundingClientRect();
}
function setDinoLose() {
  dinoElem.src = _dinoLose.default;
}
function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = _dinoStationary.default;
    return;
  }
  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
    dinoElem.src = dinoFrame === 1 ? _dinoRun2.default : _dinoRun.default;
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}
function handleJump(delta) {
  if (!isJumping) return;
  (0, _updateCustomProperty.incrementCustomProperty)(dinoElem, '--bottom', yVelocity * delta);
  if ((0, _updateCustomProperty.getCustomProperty)(dinoElem, '--bottom') <= 0) {
    (0, _updateCustomProperty.setCustomProperty)(dinoElem, '--bottom', 0);
    isJumping = false;
  }
  yVelocity -= GRAVITY * delta;
}
function onJump(e) {
  if (e.code !== 'Space' || isJumping) return;
  yVelocity = JUMP_SPEED;
  isJumping = true;
}
},{"./updateCustomProperty.js":"../updateCustomProperty.js","../imgs/dino-stationary.png":"../../imgs/dino-stationary.png","../imgs/dino-lose.png":"../../imgs/dino-lose.png","../imgs/dino-run-0.png":"../../imgs/dino-run-0.png","../imgs/dino-run-1.png":"../../imgs/dino-run-1.png"}],"../../imgs/cactus.png":[function(require,module,exports) {
module.exports = "/cactus.168e3f29.png";
},{}],"../cactus.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCactusRects = getCactusRects;
exports.setupCactus = setupCactus;
exports.updateCactus = updateCactus;
var _updateCustomProperty = require("./updateCustomProperty.js");
var _cactus = _interopRequireDefault(require("../imgs/cactus.png"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var SPEED = 0.05;
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
function updateCactus(delta, speedScale) {
  document.querySelectorAll('[data-cactus]').forEach(function (cactus) {
    (0, _updateCustomProperty.incrementCustomProperty)(cactus, '--left', delta * speedScale * SPEED * -1);
    if ((0, _updateCustomProperty.getCustomProperty)(cactus, '--left') <= -100) {
      cactus.remove();
    }
  });
  if (nextCactusTime <= 0) {
    createCactus();
    nextCactusTime = randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) / speedScale;
  }
  nextCactusTime -= delta;
}
function getCactusRects() {
  return _toConsumableArray(document.querySelectorAll('[data-cactus]')).map(function (cactus) {
    return cactus.getBoundingClientRect();
  });
}
function createCactus() {
  var cactus = document.createElement('img');
  cactus.dataset.cactus = true;
  cactus.src = _cactus.default;
  cactus.classList.add('cactus');
  (0, _updateCustomProperty.setCustomProperty)(cactus, '--left', 100);
  worldElem.append(cactus);
}
function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
},{"./updateCustomProperty.js":"../updateCustomProperty.js","../imgs/cactus.png":"../../imgs/cactus.png"}],"../script.js":[function(require,module,exports) {
"use strict";

var _ground = require("./ground.js");
var _dino = require("./dino.js");
var _cactus = require("./cactus.js");
var WORLD_WIDTH = 100;
var WORLD_HEIGHT = 30;
var SPEED_SCALE_INCREASE = 0.00001;
var worldElem = document.querySelector('[data-world]');
var scoreElem = document.querySelector('[data-score]');
var highScoreElem = document.querySelector('[data-high-score]');
var startScreenElem = document.querySelector('[data-start-screen]');
var endScreenElem = document.querySelector('[data-game-over-screen]');
setPixelToWorldScale();
window.addEventListener('resize', setPixelToWorldScale);
document.addEventListener('keydown', handleStart, {
  once: true
});
var lastTime;
var speedScale;
var score;
var highScore = localStorage.getItem('lion-high-score');
highScoreElem.textContent = highScore;
function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  var delta = time - lastTime;
  (0, _ground.updateGround)(delta, speedScale);
  (0, _dino.updateDino)(delta, speedScale);
  (0, _cactus.updateCactus)(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  if (checkLose()) return handleLose();
  lastTime = time;
  window.requestAnimationFrame(update);
}
function checkLose() {
  var dinoRect = (0, _dino.getDinoRect)();
  return (0, _cactus.getCactusRects)().some(function (rect) {
    return isCollision(rect, dinoRect);
  });
}
function isCollision(rect1, rect2) {
  return rect1.left < rect2.right && rect1.top < rect2.bottom && rect1.right > rect2.left && rect1.bottom > rect2.top;
}
function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}
function updateScore(delta) {
  score += delta * 0.01;
  scoreElem.textContent = Math.floor(score).toString().padStart(6, 0);
}
function updateHighScore(highScore, score) {
  if (score > highScore) {
    highScore = Math.floor(score).toString().padStart(6, 0);
    highScoreElem.textContent = highScore;
    localStorage.setItem('lion-high-score', highScore);
  }
}
function handleStart() {
  lastTime = null;
  speedScale = 0.9;
  score = 0;
  (0, _ground.setupGround)();
  (0, _dino.setupDino)();
  (0, _cactus.setupCactus)();
  startScreenElem.classList.add('hide');
  endScreenElem.classList.add('hide');
  window.requestAnimationFrame(update);
}
function handleLose() {
  updateHighScore(highScore, score);
  (0, _dino.setDinoLose)();
  setTimeout(function () {
    document.addEventListener('keydown', handleStart, {
      once: true
    });
    endScreenElem.classList.remove('hide');
  }, 100);
}
function setPixelToWorldScale() {
  var worldToPixelScale;
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }
  worldElem.style.width = "".concat(WORLD_WIDTH * worldToPixelScale, "px");
  worldElem.style.height = "".concat(WORLD_HEIGHT * worldToPixelScale, "px");
}
},{"./ground.js":"../ground.js","./dino.js":"../dino.js","./cactus.js":"../cactus.js"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65017" + '/');
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
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../script.js"], null)
//# sourceMappingURL=/script.76d4bba4.js.map