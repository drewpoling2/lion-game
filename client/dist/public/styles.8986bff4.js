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
})({"../../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }
  return bundleURL;
}
function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }
  return '/';
}
function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');
function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }
  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }
    cssTimeout = null;
  }, 50);
}
module.exports = reloadCSS;
},{"./bundle-url":"../../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../../node_modules/transition-style/transition.min.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"transition-style":"../../node_modules/transition-style/transition.min.css","./fonts/PixelArialRegular.TTF":[["PixelArialRegular.2316f966.TTF","fonts/PixelArialRegular.TTF"],"fonts/PixelArialRegular.TTF"],"./fonts/PixelArialBold.TTF":[["PixelArialBold.2db621bb.TTF","fonts/PixelArialBold.TTF"],"fonts/PixelArialBold.TTF"],"./imgs/gold-coin/Gold-Coin-1.png":[["Gold-Coin-1.a8490cc4.png","imgs/gold-coin/Gold-Coin-1.png"],"imgs/gold-coin/Gold-Coin-1.png"],"./imgs/gold-coin/Gold-Coin-2.png":[["Gold-Coin-2.b15e0a8b.png","imgs/gold-coin/Gold-Coin-2.png"],"imgs/gold-coin/Gold-Coin-2.png"],"./imgs/gold-coin/Gold-Coin-3.png":[["Gold-Coin-3.44763c14.png","imgs/gold-coin/Gold-Coin-3.png"],"imgs/gold-coin/Gold-Coin-3.png"],"./imgs/gold-coin/Gold-Coin-5.png":[["Gold-Coin-5.cd1d6297.png","imgs/gold-coin/Gold-Coin-5.png"],"imgs/gold-coin/Gold-Coin-5.png"],"./imgs/gold-coin/Gold-Coin-6.png":[["Gold-Coin-6.4f80aaee.png","imgs/gold-coin/Gold-Coin-6.png"],"imgs/gold-coin/Gold-Coin-6.png"],"./imgs/ground-enemies/penguin/Penguin-Fall-1.png":[["Penguin-Fall-1.99de7b84.png","imgs/ground-enemies/penguin/Penguin-Fall-1.png"],"imgs/ground-enemies/penguin/Penguin-Fall-1.png"],"./imgs/items/heart/Heart-1.png":[["Heart-1.6e12012a.png","imgs/items/heart/Heart-1.png"],"imgs/items/heart/Heart-1.png"],"./imgs/items/leaf/Leaf-1.png":[["Leaf-1.15ab6f5e.png","imgs/items/leaf/Leaf-1.png"],"imgs/items/leaf/Leaf-1.png"],"./imgs/Coin-1.png":[["Coin-1.b2590e0a.png","imgs/Coin-1.png"],"imgs/Coin-1.png"],"./imgs/items/star/Star-Spin-1.png":[["Star-Spin-1.7b22d5dd.png","imgs/items/star/Star-Spin-1.png"],"imgs/items/star/Star-Spin-1.png"],"./imgs/items/star/Star-Spin-2.png":[["Star-Spin-2.e51d42fc.png","imgs/items/star/Star-Spin-2.png"],"imgs/items/star/Star-Spin-2.png"],"./imgs/items/star/Star-Spin-3.png":[["Star-Spin-3.4c00cfc3.png","imgs/items/star/Star-Spin-3.png"],"imgs/items/star/Star-Spin-3.png"],"./imgs/items/star/Star-Spin-4.png":[["Star-Spin-4.bce89951.png","imgs/items/star/Star-Spin-4.png"],"imgs/items/star/Star-Spin-4.png"],"./imgs/items/star/Star-5.png":[["Star-5.54fdd16f.png","imgs/items/star/Star-5.png"],"imgs/items/star/Star-5.png"],"./imgs/items/star/Star-1.png":[["Star-1.21960be2.png","imgs/items/star/Star-1.png"],"imgs/items/star/Star-1.png"],"./imgs/items/star/Star-2.png":[["Star-2.6137c56f.png","imgs/items/star/Star-2.png"],"imgs/items/star/Star-2.png"],"./imgs/items/star/Star-3.png":[["Star-3.b1f0ecb2.png","imgs/items/star/Star-3.png"],"imgs/items/star/Star-3.png"],"./imgs/items/star/Star-4.png":[["Star-4.03288628.png","imgs/items/star/Star-4.png"],"imgs/items/star/Star-4.png"],"./imgs/silver-coin/Silver-Coin-1.png":[["Silver-Coin-1.55569516.png","imgs/silver-coin/Silver-Coin-1.png"],"imgs/silver-coin/Silver-Coin-1.png"],"./imgs/silver-coin/Silver-Coin-2.png":[["Silver-Coin-2.240a17ad.png","imgs/silver-coin/Silver-Coin-2.png"],"imgs/silver-coin/Silver-Coin-2.png"],"./imgs/silver-coin/Silver-Coin-3.png":[["Silver-Coin-3.3cc8a9a3.png","imgs/silver-coin/Silver-Coin-3.png"],"imgs/silver-coin/Silver-Coin-3.png"],"./imgs/silver-coin/Silver-Coin-5.png":[["Silver-Coin-5.4dd7a779.png","imgs/silver-coin/Silver-Coin-5.png"],"imgs/silver-coin/Silver-Coin-5.png"],"./imgs/silver-coin/Silver-Coin-6.png":[["Silver-Coin-6.42aa781f.png","imgs/silver-coin/Silver-Coin-6.png"],"imgs/silver-coin/Silver-Coin-6.png"],"./imgs/red-gem/red-gem.png":[["red-gem.00802886.png","imgs/red-gem/red-gem.png"],"imgs/red-gem/red-gem.png"],"./imgs/blue-gem/blue-gem.png":[["blue-gem.ac346ac3.png","imgs/blue-gem/blue-gem.png"],"imgs/blue-gem/blue-gem.png"],"./imgs/green-gem/green-gem.png":[["green-gem.be153e86.png","imgs/green-gem/green-gem.png"],"imgs/green-gem/green-gem.png"],"./imgs/flag/flag-animation-0.png":[["flag-animation-0.b4dfc1a9.png","imgs/flag/flag-animation-0.png"],"imgs/flag/flag-animation-0.png"],"./imgs/flag/flag-animation-1.png":[["flag-animation-1.47cb9eec.png","imgs/flag/flag-animation-1.png"],"imgs/flag/flag-animation-1.png"],"./imgs/flag/flag-animation-2.png":[["flag-animation-2.0a9fd3d1.png","imgs/flag/flag-animation-2.png"],"imgs/flag/flag-animation-2.png"],"./imgs/flag/flag-animation-3.png":[["flag-animation-3.a842b66c.png","imgs/flag/flag-animation-3.png"],"imgs/flag/flag-animation-3.png"],"./imgs/flag/flag-animation-4.png":[["flag-animation-4.62e1783a.png","imgs/flag/flag-animation-4.png"],"imgs/flag/flag-animation-4.png"],"./imgs/flag/flag-animation-5.png":[["flag-animation-5.6dc47d09.png","imgs/flag/flag-animation-5.png"],"imgs/flag/flag-animation-5.png"],"./imgs/ground-enemies/penguin/Walking-Penguin-1.png":[["Walking-Penguin-1.d110ff57.png","imgs/ground-enemies/penguin/Walking-Penguin-1.png"],"imgs/ground-enemies/penguin/Walking-Penguin-1.png"],"./imgs/ground-enemies/penguin/Walking-Penguin-2.png":[["Walking-Penguin-2.e22f9a98.png","imgs/ground-enemies/penguin/Walking-Penguin-2.png"],"imgs/ground-enemies/penguin/Walking-Penguin-2.png"],"./imgs/ground-enemies/penguin/Walking-Penguin-3.png":[["Walking-Penguin-3.482ecabb.png","imgs/ground-enemies/penguin/Walking-Penguin-3.png"],"imgs/ground-enemies/penguin/Walking-Penguin-3.png"],"./imgs/ground-enemies/penguin/Walking-Penguin-4.png":[["Walking-Penguin-4.66add5fb.png","imgs/ground-enemies/penguin/Walking-Penguin-4.png"],"imgs/ground-enemies/penguin/Walking-Penguin-4.png"],"./imgs/ground-enemies/penguin/Walking-Penguin-5.png":[["Walking-Penguin-5.793bc7e3.png","imgs/ground-enemies/penguin/Walking-Penguin-5.png"],"imgs/ground-enemies/penguin/Walking-Penguin-5.png"],"./imgs/ground-enemies/penguin/Walking-Penguin-6.png":[["Walking-Penguin-6.a0e15231.png","imgs/ground-enemies/penguin/Walking-Penguin-6.png"],"imgs/ground-enemies/penguin/Walking-Penguin-6.png"],"./imgs/ground-enemies/penguin/Sliding-Penguin-1.png":[["Sliding-Penguin-1.82dac815.png","imgs/ground-enemies/penguin/Sliding-Penguin-1.png"],"imgs/ground-enemies/penguin/Sliding-Penguin-1.png"],"./imgs/ground-enemies/penguin/Sliding-Penguin-2.png":[["Sliding-Penguin-2.2cc3d2d1.png","imgs/ground-enemies/penguin/Sliding-Penguin-2.png"],"imgs/ground-enemies/penguin/Sliding-Penguin-2.png"],"./imgs/ground-enemies/penguin/Sliding-Penguin-3.png":[["Sliding-Penguin-3.a1d961c2.png","imgs/ground-enemies/penguin/Sliding-Penguin-3.png"],"imgs/ground-enemies/penguin/Sliding-Penguin-3.png"],"./imgs/ground-enemies/penguin/Sliding-Penguin-4.png":[["Sliding-Penguin-4.11ed4842.png","imgs/ground-enemies/penguin/Sliding-Penguin-4.png"],"imgs/ground-enemies/penguin/Sliding-Penguin-4.png"],"./imgs/ground-enemies/penguin/Sliding-Penguin-5.png":[["Sliding-Penguin-5.56fe5d3a.png","imgs/ground-enemies/penguin/Sliding-Penguin-5.png"],"imgs/ground-enemies/penguin/Sliding-Penguin-5.png"],"./imgs/ground-enemies/penguin/Sliding-Penguin-6.png":[["Sliding-Penguin-6.225a5c22.png","imgs/ground-enemies/penguin/Sliding-Penguin-6.png"],"imgs/ground-enemies/penguin/Sliding-Penguin-6.png"],"./imgs/ground-enemies/penguin/Sliding-Penguin-7.png":[["Sliding-Penguin-7.9d1f221e.png","imgs/ground-enemies/penguin/Sliding-Penguin-7.png"],"imgs/ground-enemies/penguin/Sliding-Penguin-7.png"],"./imgs/air-obstacle/penguin/Flap-1.png":[["Flap-1.2d756188.png","imgs/air-obstacle/penguin/Flap-1.png"],"imgs/air-obstacle/penguin/Flap-1.png"],"./imgs/air-obstacle/penguin/Flap-2.png":[["Flap-2.703907d2.png","imgs/air-obstacle/penguin/Flap-2.png"],"imgs/air-obstacle/penguin/Flap-2.png"],"./imgs/ground-enemies/penguin/Idle-Penguin-1.png":[["Idle-Penguin-1.3f75e122.png","imgs/ground-enemies/penguin/Idle-Penguin-1.png"],"imgs/ground-enemies/penguin/Idle-Penguin-1.png"],"./imgs/ground-enemies/penguin/Idle-Penguin-2.png":[["Idle-Penguin-2.9733851b.png","imgs/ground-enemies/penguin/Idle-Penguin-2.png"],"imgs/ground-enemies/penguin/Idle-Penguin-2.png"],"./imgs/ground-enemies/penguin/Rolling-Penguin-4.png":[["Rolling-Penguin-4.8a7b8d0c.png","imgs/ground-enemies/penguin/Rolling-Penguin-4.png"],"imgs/ground-enemies/penguin/Rolling-Penguin-4.png"],"./imgs/ground-enemies/penguin/Rolling-Penguin-3.png":[["Rolling-Penguin-3.f5c8ca4b.png","imgs/ground-enemies/penguin/Rolling-Penguin-3.png"],"imgs/ground-enemies/penguin/Rolling-Penguin-3.png"],"./imgs/ground-enemies/penguin/Rolling-Penguin-2.png":[["Rolling-Penguin-2.56c3723a.png","imgs/ground-enemies/penguin/Rolling-Penguin-2.png"],"imgs/ground-enemies/penguin/Rolling-Penguin-2.png"],"./imgs/ground-enemies/penguin/Rolling-Penguin-1.png":[["Rolling-Penguin-1.614b20c1.png","imgs/ground-enemies/penguin/Rolling-Penguin-1.png"],"imgs/ground-enemies/penguin/Rolling-Penguin-1.png"],"_css_loader":"../../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53085" + '/');
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
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js"], null)
//# sourceMappingURL=/styles.8986bff4.js.map