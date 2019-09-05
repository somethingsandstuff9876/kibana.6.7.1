/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"status_page": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "__REPLACE_WITH_PUBLIC_PATH__";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./optimize/bundles/status_page.entry.js","commons"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./optimize/bundles/status_page.entry.js":
/*!***********************************************!*\
  !*** ./optimize/bundles/status_page.entry.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es6.typed.array-buffer */ "./node_modules/core-js/modules/es6.typed.array-buffer.js");

__webpack_require__(/*! core-js/modules/es6.typed.int8-array */ "./node_modules/core-js/modules/es6.typed.int8-array.js");

__webpack_require__(/*! core-js/modules/es6.typed.uint8-array */ "./node_modules/core-js/modules/es6.typed.uint8-array.js");

__webpack_require__(/*! core-js/modules/es6.typed.uint8-clamped-array */ "./node_modules/core-js/modules/es6.typed.uint8-clamped-array.js");

__webpack_require__(/*! core-js/modules/es6.typed.int16-array */ "./node_modules/core-js/modules/es6.typed.int16-array.js");

__webpack_require__(/*! core-js/modules/es6.typed.uint16-array */ "./node_modules/core-js/modules/es6.typed.uint16-array.js");

__webpack_require__(/*! core-js/modules/es6.typed.int32-array */ "./node_modules/core-js/modules/es6.typed.int32-array.js");

__webpack_require__(/*! core-js/modules/es6.typed.uint32-array */ "./node_modules/core-js/modules/es6.typed.uint32-array.js");

__webpack_require__(/*! core-js/modules/es6.typed.float32-array */ "./node_modules/core-js/modules/es6.typed.float32-array.js");

__webpack_require__(/*! core-js/modules/es6.typed.float64-array */ "./node_modules/core-js/modules/es6.typed.float64-array.js");

__webpack_require__(/*! core-js/modules/es6.map */ "./node_modules/core-js/modules/es6.map.js");

__webpack_require__(/*! core-js/modules/es6.set */ "./node_modules/core-js/modules/es6.set.js");

__webpack_require__(/*! core-js/modules/es6.weak-map */ "./node_modules/core-js/modules/es6.weak-map.js");

__webpack_require__(/*! core-js/modules/es6.weak-set */ "./node_modules/core-js/modules/es6.weak-set.js");

__webpack_require__(/*! core-js/modules/es6.reflect.apply */ "./node_modules/core-js/modules/es6.reflect.apply.js");

__webpack_require__(/*! core-js/modules/es6.reflect.construct */ "./node_modules/core-js/modules/es6.reflect.construct.js");

__webpack_require__(/*! core-js/modules/es6.reflect.define-property */ "./node_modules/core-js/modules/es6.reflect.define-property.js");

__webpack_require__(/*! core-js/modules/es6.reflect.delete-property */ "./node_modules/core-js/modules/es6.reflect.delete-property.js");

__webpack_require__(/*! core-js/modules/es6.reflect.get */ "./node_modules/core-js/modules/es6.reflect.get.js");

__webpack_require__(/*! core-js/modules/es6.reflect.get-own-property-descriptor */ "./node_modules/core-js/modules/es6.reflect.get-own-property-descriptor.js");

__webpack_require__(/*! core-js/modules/es6.reflect.get-prototype-of */ "./node_modules/core-js/modules/es6.reflect.get-prototype-of.js");

__webpack_require__(/*! core-js/modules/es6.reflect.has */ "./node_modules/core-js/modules/es6.reflect.has.js");

__webpack_require__(/*! core-js/modules/es6.reflect.is-extensible */ "./node_modules/core-js/modules/es6.reflect.is-extensible.js");

__webpack_require__(/*! core-js/modules/es6.reflect.own-keys */ "./node_modules/core-js/modules/es6.reflect.own-keys.js");

__webpack_require__(/*! core-js/modules/es6.reflect.prevent-extensions */ "./node_modules/core-js/modules/es6.reflect.prevent-extensions.js");

__webpack_require__(/*! core-js/modules/es6.reflect.set */ "./node_modules/core-js/modules/es6.reflect.set.js");

__webpack_require__(/*! core-js/modules/es6.reflect.set-prototype-of */ "./node_modules/core-js/modules/es6.reflect.set-prototype-of.js");

__webpack_require__(/*! core-js/modules/es6.promise */ "./node_modules/core-js/modules/es6.promise.js");

__webpack_require__(/*! core-js/modules/es6.symbol */ "./node_modules/core-js/modules/es6.symbol.js");

__webpack_require__(/*! core-js/modules/es6.object.freeze */ "./node_modules/core-js/modules/es6.object.freeze.js");

__webpack_require__(/*! core-js/modules/es6.object.seal */ "./node_modules/core-js/modules/es6.object.seal.js");

__webpack_require__(/*! core-js/modules/es6.object.prevent-extensions */ "./node_modules/core-js/modules/es6.object.prevent-extensions.js");

__webpack_require__(/*! core-js/modules/es6.object.is-frozen */ "./node_modules/core-js/modules/es6.object.is-frozen.js");

__webpack_require__(/*! core-js/modules/es6.object.is-sealed */ "./node_modules/core-js/modules/es6.object.is-sealed.js");

__webpack_require__(/*! core-js/modules/es6.object.is-extensible */ "./node_modules/core-js/modules/es6.object.is-extensible.js");

__webpack_require__(/*! core-js/modules/es6.object.get-own-property-descriptor */ "./node_modules/core-js/modules/es6.object.get-own-property-descriptor.js");

__webpack_require__(/*! core-js/modules/es6.object.get-prototype-of */ "./node_modules/core-js/modules/es6.object.get-prototype-of.js");

__webpack_require__(/*! core-js/modules/es6.object.keys */ "./node_modules/core-js/modules/es6.object.keys.js");

__webpack_require__(/*! core-js/modules/es6.object.get-own-property-names */ "./node_modules/core-js/modules/es6.object.get-own-property-names.js");

__webpack_require__(/*! core-js/modules/es6.object.assign */ "./node_modules/core-js/modules/es6.object.assign.js");

__webpack_require__(/*! core-js/modules/es6.object.is */ "./node_modules/core-js/modules/es6.object.is.js");

__webpack_require__(/*! core-js/modules/es6.object.set-prototype-of */ "./node_modules/core-js/modules/es6.object.set-prototype-of.js");

__webpack_require__(/*! core-js/modules/es6.function.name */ "./node_modules/core-js/modules/es6.function.name.js");

__webpack_require__(/*! core-js/modules/es6.string.raw */ "./node_modules/core-js/modules/es6.string.raw.js");

__webpack_require__(/*! core-js/modules/es6.string.from-code-point */ "./node_modules/core-js/modules/es6.string.from-code-point.js");

__webpack_require__(/*! core-js/modules/es6.string.code-point-at */ "./node_modules/core-js/modules/es6.string.code-point-at.js");

__webpack_require__(/*! core-js/modules/es6.string.repeat */ "./node_modules/core-js/modules/es6.string.repeat.js");

__webpack_require__(/*! core-js/modules/es6.string.starts-with */ "./node_modules/core-js/modules/es6.string.starts-with.js");

__webpack_require__(/*! core-js/modules/es6.string.ends-with */ "./node_modules/core-js/modules/es6.string.ends-with.js");

__webpack_require__(/*! core-js/modules/es6.string.includes */ "./node_modules/core-js/modules/es6.string.includes.js");

__webpack_require__(/*! core-js/modules/es6.regexp.flags */ "./node_modules/core-js/modules/es6.regexp.flags.js");

__webpack_require__(/*! core-js/modules/es6.regexp.match */ "./node_modules/core-js/modules/es6.regexp.match.js");

__webpack_require__(/*! core-js/modules/es6.regexp.replace */ "./node_modules/core-js/modules/es6.regexp.replace.js");

__webpack_require__(/*! core-js/modules/es6.regexp.split */ "./node_modules/core-js/modules/es6.regexp.split.js");

__webpack_require__(/*! core-js/modules/es6.regexp.search */ "./node_modules/core-js/modules/es6.regexp.search.js");

__webpack_require__(/*! core-js/modules/es6.array.from */ "./node_modules/core-js/modules/es6.array.from.js");

__webpack_require__(/*! core-js/modules/es6.array.of */ "./node_modules/core-js/modules/es6.array.of.js");

__webpack_require__(/*! core-js/modules/es6.array.copy-within */ "./node_modules/core-js/modules/es6.array.copy-within.js");

__webpack_require__(/*! core-js/modules/es6.array.find */ "./node_modules/core-js/modules/es6.array.find.js");

__webpack_require__(/*! core-js/modules/es6.array.find-index */ "./node_modules/core-js/modules/es6.array.find-index.js");

__webpack_require__(/*! core-js/modules/es6.array.fill */ "./node_modules/core-js/modules/es6.array.fill.js");

__webpack_require__(/*! core-js/modules/es6.array.iterator */ "./node_modules/core-js/modules/es6.array.iterator.js");

__webpack_require__(/*! core-js/modules/es6.number.is-finite */ "./node_modules/core-js/modules/es6.number.is-finite.js");

__webpack_require__(/*! core-js/modules/es6.number.is-integer */ "./node_modules/core-js/modules/es6.number.is-integer.js");

__webpack_require__(/*! core-js/modules/es6.number.is-safe-integer */ "./node_modules/core-js/modules/es6.number.is-safe-integer.js");

__webpack_require__(/*! core-js/modules/es6.number.is-nan */ "./node_modules/core-js/modules/es6.number.is-nan.js");

__webpack_require__(/*! core-js/modules/es6.number.epsilon */ "./node_modules/core-js/modules/es6.number.epsilon.js");

__webpack_require__(/*! core-js/modules/es6.number.min-safe-integer */ "./node_modules/core-js/modules/es6.number.min-safe-integer.js");

__webpack_require__(/*! core-js/modules/es6.number.max-safe-integer */ "./node_modules/core-js/modules/es6.number.max-safe-integer.js");

__webpack_require__(/*! core-js/modules/es6.math.acosh */ "./node_modules/core-js/modules/es6.math.acosh.js");

__webpack_require__(/*! core-js/modules/es6.math.asinh */ "./node_modules/core-js/modules/es6.math.asinh.js");

__webpack_require__(/*! core-js/modules/es6.math.atanh */ "./node_modules/core-js/modules/es6.math.atanh.js");

__webpack_require__(/*! core-js/modules/es6.math.cbrt */ "./node_modules/core-js/modules/es6.math.cbrt.js");

__webpack_require__(/*! core-js/modules/es6.math.clz32 */ "./node_modules/core-js/modules/es6.math.clz32.js");

__webpack_require__(/*! core-js/modules/es6.math.cosh */ "./node_modules/core-js/modules/es6.math.cosh.js");

__webpack_require__(/*! core-js/modules/es6.math.expm1 */ "./node_modules/core-js/modules/es6.math.expm1.js");

__webpack_require__(/*! core-js/modules/es6.math.fround */ "./node_modules/core-js/modules/es6.math.fround.js");

__webpack_require__(/*! core-js/modules/es6.math.hypot */ "./node_modules/core-js/modules/es6.math.hypot.js");

__webpack_require__(/*! core-js/modules/es6.math.imul */ "./node_modules/core-js/modules/es6.math.imul.js");

__webpack_require__(/*! core-js/modules/es6.math.log1p */ "./node_modules/core-js/modules/es6.math.log1p.js");

__webpack_require__(/*! core-js/modules/es6.math.log10 */ "./node_modules/core-js/modules/es6.math.log10.js");

__webpack_require__(/*! core-js/modules/es6.math.log2 */ "./node_modules/core-js/modules/es6.math.log2.js");

__webpack_require__(/*! core-js/modules/es6.math.sign */ "./node_modules/core-js/modules/es6.math.sign.js");

__webpack_require__(/*! core-js/modules/es6.math.sinh */ "./node_modules/core-js/modules/es6.math.sinh.js");

__webpack_require__(/*! core-js/modules/es6.math.tanh */ "./node_modules/core-js/modules/es6.math.tanh.js");

__webpack_require__(/*! core-js/modules/es6.math.trunc */ "./node_modules/core-js/modules/es6.math.trunc.js");

__webpack_require__(/*! core-js/modules/es7.array.includes */ "./node_modules/core-js/modules/es7.array.includes.js");

__webpack_require__(/*! core-js/modules/es7.object.values */ "./node_modules/core-js/modules/es7.object.values.js");

__webpack_require__(/*! core-js/modules/es7.object.entries */ "./node_modules/core-js/modules/es7.object.entries.js");

__webpack_require__(/*! core-js/modules/es7.object.get-own-property-descriptors */ "./node_modules/core-js/modules/es7.object.get-own-property-descriptors.js");

__webpack_require__(/*! core-js/modules/es7.string.pad-start */ "./node_modules/core-js/modules/es7.string.pad-start.js");

__webpack_require__(/*! core-js/modules/es7.string.pad-end */ "./node_modules/core-js/modules/es7.string.pad-end.js");

__webpack_require__(/*! core-js/modules/web.timers */ "./node_modules/core-js/modules/web.timers.js");

__webpack_require__(/*! core-js/modules/web.immediate */ "./node_modules/core-js/modules/web.immediate.js");

__webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");

__webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");

__webpack_require__(/*! custom-event-polyfill */ "./node_modules/custom-event-polyfill/custom-event-polyfill.js");

__webpack_require__(/*! whatwg-fetch */ "./node_modules/whatwg-fetch/dist/fetch.umd.js");

__webpack_require__(/*! abortcontroller-polyfill */ "./node_modules/abortcontroller-polyfill/dist/umd-polyfill.js");

__webpack_require__(/*! childnode-remove-polyfill */ "./webpackShims/childnode-remove-polyfill.js");

var _i18n = __webpack_require__(/*! @kbn/i18n */ "./packages/kbn-i18n/target/web/browser.js");

var _kibanaCore__ = __webpack_require__(/*! __kibanaCore__ */ "./src/core/public/index.ts");

/**
 * Kibana entry file
 *
 * This is programmatically created and updated, do not modify
 *
 * context: {
  "env": "development",
  "sourceMaps": "#cheap-source-map",
  "kbnVersion": "6.7.3",
  "buildNum": 9007199254740991,
  "plugins": [
    "apm_oss",
    "console",
    "elasticsearch",
    "input_control_vis",
    "inspector_views",
    "interpreter",
    "kbn_doc_views",
    "kbn_vislib_vis_types",
    "kibana",
    "markdown_vis",
    "metric_vis",
    "metrics",
    "region_map",
    "state_session_storage_redirect",
    "status_page",
    "table_vis",
    "tagcloud",
    "testbed",
    "tests_bundle",
    "tile_map",
    "timelion",
    "vega"
  ]
}
 */

// import global polyfills before everything else
var injectedMetadata = JSON.parse(document.querySelector('kbn-injected-metadata').getAttribute('data'));

_i18n.i18n.load(injectedMetadata.i18n.translationsUrl).catch(function (e) {
  return e;
}).then(function (i18nError) {
  var coreSystem = new _kibanaCore__.CoreSystem({
    injectedMetadata: injectedMetadata,
    rootDomElement: document.body,
    requireLegacyFiles: function requireLegacyFiles() {
      __webpack_require__(/*! plugins/status_page/status_page */ "./src/legacy/core_plugins/status_page/public/status_page.js");
    }
  });

  var coreStartContract = coreSystem.start();

  if (i18nError) {
    coreStartContract.fatalErrors.add(i18nError);
  }
});

/***/ }),

/***/ "./src/legacy/core_plugins/status_page/public/components/metric_tiles.js":
/*!*******************************************************************************!*\
  !*** ./src/legacy/core_plugins/status_page/public/components/metric_tiles.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetricTile = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _format_number = __webpack_require__(/*! ../lib/format_number */ "./src/legacy/core_plugins/status_page/public/lib/format_number.js");

var _format_number2 = _interopRequireDefault(_format_number);

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _prop_types = __webpack_require__(/*! ../lib/prop_types */ "./src/legacy/core_plugins/status_page/public/lib/prop_types.js");

var _propTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _eui = __webpack_require__(/*! @elastic/eui */ "./node_modules/@elastic/eui/lib/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed to Elasticsearch B.V. under one or more contributor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * license agreements. See the NOTICE file distributed with
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * this work for additional information regarding copyright
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ownership. Elasticsearch B.V. licenses this file to you under
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the Apache License, Version 2.0 (the "License"); you may
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *    http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * software distributed under the License is distributed on an
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * KIND, either express or implied.  See the License for the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * specific language governing permissions and limitations
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/*
Displays a metric with the correct format.
*/
var MetricTile = exports.MetricTile = function (_Component) {
  _inherits(MetricTile, _Component);

  function MetricTile() {
    _classCallCheck(this, MetricTile);

    return _possibleConstructorReturn(this, (MetricTile.__proto__ || Object.getPrototypeOf(MetricTile)).apply(this, arguments));
  }

  _createClass(MetricTile, [{
    key: 'formattedMetric',
    value: function formattedMetric() {
      var _props$metric = this.props.metric,
          value = _props$metric.value,
          type = _props$metric.type;


      var metrics = [].concat(value);
      return metrics.map(function (metric) {
        return (0, _format_number2.default)(metric, type);
      }).join(', ');
    }
  }, {
    key: 'render',
    value: function render() {
      var name = this.props.metric.name;


      return _react2.default.createElement(_eui.EuiCard, {
        layout: 'horizontal',
        title: this.formattedMetric(),
        description: name
      });
    }
  }]);

  return MetricTile;
}(_react.Component);

/*
Wrapper component that simply maps each metric to MetricTile inside a FlexGroup
*/


MetricTile.propTypes = {
  metric: _prop_types.Metric.isRequired
};
var MetricTiles = function MetricTiles(_ref) {
  var metrics = _ref.metrics;
  return _react2.default.createElement(
    _eui.EuiFlexGrid,
    { columns: 3 },
    metrics.map(function (metric) {
      return _react2.default.createElement(
        _eui.EuiFlexItem,
        { key: metric.name },
        _react2.default.createElement(MetricTile, { metric: metric })
      );
    })
  );
};

MetricTiles.propTypes = {
  metrics: _propTypes2.default.arrayOf(_prop_types.Metric).isRequired
};

exports.default = MetricTiles;

/***/ }),

/***/ "./src/legacy/core_plugins/status_page/public/components/render.js":
/*!*************************************************************************!*\
  !*** ./src/legacy/core_plugins/status_page/public/components/render.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderStatusPage = renderStatusPage;
exports.destroyStatusPage = destroyStatusPage;

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");

var _i18n = __webpack_require__(/*! ui/i18n */ "./src/ui/public/i18n/index.tsx");

var _status_app = __webpack_require__(/*! ./status_app */ "./src/legacy/core_plugins/status_page/public/components/status_app.js");

var _status_app2 = _interopRequireDefault(_status_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var STATUS_PAGE_DOM_NODE_ID = 'createStatusPageReact';

function renderStatusPage(buildNum, buildSha) {
  var node = document.getElementById(STATUS_PAGE_DOM_NODE_ID);

  if (!node) {
    return;
  }

  (0, _reactDom.render)(_react2.default.createElement(
    _i18n.I18nContext,
    null,
    _react2.default.createElement(_status_app2.default, {
      buildNum: buildNum,
      buildSha: buildSha
    })
  ), node);
}

function destroyStatusPage() {
  var node = document.getElementById(STATUS_PAGE_DOM_NODE_ID);
  node && (0, _reactDom.unmountComponentAtNode)(node);
}

/***/ }),

/***/ "./src/legacy/core_plugins/status_page/public/components/server_status.js":
/*!********************************************************************************!*\
  !*** ./src/legacy/core_plugins/status_page/public/components/server_status.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _prop_types = __webpack_require__(/*! ../lib/prop_types */ "./src/legacy/core_plugins/status_page/public/lib/prop_types.js");

var _eui = __webpack_require__(/*! @elastic/eui */ "./node_modules/@elastic/eui/lib/index.js");

var _react3 = __webpack_require__(/*! @kbn/i18n/react */ "./packages/kbn-i18n/target/web/react/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ServerState = function ServerState(_ref) {
  var name = _ref.name,
      serverState = _ref.serverState;
  return _react2.default.createElement(
    _eui.EuiFlexGroup,
    {
      alignItems: 'center',
      justifyContent: 'spaceBetween',
      style: { flexGrow: 0 }
    },
    _react2.default.createElement(
      _eui.EuiFlexItem,
      { grow: false },
      _react2.default.createElement(
        _eui.EuiTitle,
        null,
        _react2.default.createElement(
          'h2',
          null,
          _react2.default.createElement(_react3.FormattedMessage, {
            id: 'statusPage.serverStatus.statusTitle',
            defaultMessage: 'Kibana status is {kibanaStatus}',
            values: {
              kibanaStatus: _react2.default.createElement(
                _eui.EuiBadge,
                { color: serverState.uiColor },
                serverState.title
              )
            }
          })
        )
      )
    ),
    _react2.default.createElement(
      _eui.EuiFlexItem,
      { grow: false },
      _react2.default.createElement(
        _eui.EuiText,
        null,
        _react2.default.createElement(
          'p',
          null,
          name
        )
      )
    )
  );
}; /*
    * Licensed to Elasticsearch B.V. under one or more contributor
    * license agreements. See the NOTICE file distributed with
    * this work for additional information regarding copyright
    * ownership. Elasticsearch B.V. licenses this file to you under
    * the Apache License, Version 2.0 (the "License"); you may
    * not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *    http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing,
    * software distributed under the License is distributed on an
    * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    * KIND, either express or implied.  See the License for the
    * specific language governing permissions and limitations
    * under the License.
    */

ServerState.propTypes = {
  name: _propTypes2.default.string.isRequired,
  serverState: _prop_types.State.isRequired
};

exports.default = ServerState;
module.exports = exports['default'];

/***/ }),

/***/ "./src/legacy/core_plugins/status_page/public/components/status_app.js":
/*!*****************************************************************************!*\
  !*** ./src/legacy/core_plugins/status_page/public/components/status_app.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _load_status = __webpack_require__(/*! ../lib/load_status */ "./src/legacy/core_plugins/status_page/public/lib/load_status.js");

var _load_status2 = _interopRequireDefault(_load_status);

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _eui = __webpack_require__(/*! @elastic/eui */ "./node_modules/@elastic/eui/lib/index.js");

var _react3 = __webpack_require__(/*! @kbn/i18n/react */ "./packages/kbn-i18n/target/web/react/index.js");

var _metric_tiles = __webpack_require__(/*! ./metric_tiles */ "./src/legacy/core_plugins/status_page/public/components/metric_tiles.js");

var _metric_tiles2 = _interopRequireDefault(_metric_tiles);

var _status_table = __webpack_require__(/*! ./status_table */ "./src/legacy/core_plugins/status_page/public/components/status_table.js");

var _status_table2 = _interopRequireDefault(_status_table);

var _server_status = __webpack_require__(/*! ./server_status */ "./src/legacy/core_plugins/status_page/public/components/server_status.js");

var _server_status2 = _interopRequireDefault(_server_status);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed to Elasticsearch B.V. under one or more contributor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * license agreements. See the NOTICE file distributed with
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * this work for additional information regarding copyright
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ownership. Elasticsearch B.V. licenses this file to you under
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the Apache License, Version 2.0 (the "License"); you may
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *    http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * software distributed under the License is distributed on an
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * KIND, either express or implied.  See the License for the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * specific language governing permissions and limitations
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var StatusApp = function (_Component) {
  _inherits(StatusApp, _Component);

  function StatusApp() {
    _classCallCheck(this, StatusApp);

    var _this = _possibleConstructorReturn(this, (StatusApp.__proto__ || Object.getPrototypeOf(StatusApp)).call(this));

    _this.componentDidMount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var data;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _load_status2.default)();

            case 2:
              data = _context.sent;


              if (data) {
                this.setState({ loading: false, data: data });
              } else {
                this.setState({ fetchError: true, loading: false });
              }

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    _this.state = {
      loading: true,
      fetchError: false,
      data: null
    };
    return _this;
  }

  _createClass(StatusApp, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          buildNum = _props.buildNum,
          buildSha = _props.buildSha;
      var _state = this.state,
          loading = _state.loading,
          fetchError = _state.fetchError,
          data = _state.data;

      // If we're still loading, return early with a spinner

      if (loading) {
        return _react2.default.createElement(_eui.EuiLoadingSpinner, { size: 'l' });
      }

      if (fetchError) {
        return _react2.default.createElement(
          _eui.EuiText,
          { color: 'danger' },
          _react2.default.createElement(_react3.FormattedMessage, {
            id: 'statusPage.statusApp.loadingErrorText',
            defaultMessage: 'An error occurred loading the status'
          })
        );
      }

      // Extract the items needed to render each component
      var metrics = data.metrics,
          statuses = data.statuses,
          serverState = data.serverState,
          name = data.name;


      return _react2.default.createElement(
        _eui.EuiPage,
        { className: 'stsPage' },
        _react2.default.createElement(
          _eui.EuiPageBody,
          { restrictWidth: true },
          _react2.default.createElement(_server_status2.default, {
            name: name,
            serverState: serverState
          }),
          _react2.default.createElement(_eui.EuiSpacer, null),
          _react2.default.createElement(_metric_tiles2.default, { metrics: metrics }),
          _react2.default.createElement(_eui.EuiSpacer, null),
          _react2.default.createElement(
            _eui.EuiPageContent,
            { grow: false },
            _react2.default.createElement(
              _eui.EuiFlexGroup,
              { alignItems: 'center', justifyContent: 'spaceBetween' },
              _react2.default.createElement(
                _eui.EuiFlexItem,
                { grow: false },
                _react2.default.createElement(
                  _eui.EuiTitle,
                  { size: 's' },
                  _react2.default.createElement(
                    'h2',
                    null,
                    _react2.default.createElement(_react3.FormattedMessage, {
                      id: 'statusPage.statusApp.statusTitle',
                      defaultMessage: 'Plugin status'
                    })
                  )
                )
              ),
              _react2.default.createElement(
                _eui.EuiFlexItem,
                { grow: false },
                _react2.default.createElement(
                  _eui.EuiFlexGroup,
                  null,
                  _react2.default.createElement(
                    _eui.EuiFlexItem,
                    { grow: false },
                    _react2.default.createElement(
                      _eui.EuiText,
                      { size: 's' },
                      _react2.default.createElement(
                        'p',
                        null,
                        _react2.default.createElement(_react3.FormattedMessage, {
                          id: 'statusPage.statusApp.statusActions.buildText',
                          defaultMessage: 'BUILD {buildNum}',
                          values: {
                            buildNum: _react2.default.createElement(
                              'strong',
                              null,
                              buildNum
                            )
                          }
                        })
                      )
                    )
                  ),
                  _react2.default.createElement(
                    _eui.EuiFlexItem,
                    { grow: false },
                    _react2.default.createElement(
                      _eui.EuiText,
                      { size: 's' },
                      _react2.default.createElement(
                        'p',
                        null,
                        _react2.default.createElement(_react3.FormattedMessage, {
                          id: 'statusPage.statusApp.statusActions.commitText',
                          defaultMessage: 'COMMIT {buildSha}',
                          values: {
                            buildSha: _react2.default.createElement(
                              'strong',
                              null,
                              buildSha
                            )
                          }
                        })
                      )
                    )
                  )
                )
              )
            ),
            _react2.default.createElement(_eui.EuiSpacer, null),
            _react2.default.createElement(_status_table2.default, { statuses: statuses })
          )
        )
      );
    }
  }]);

  return StatusApp;
}(_react.Component);

StatusApp.propTypes = {
  buildNum: _propTypes2.default.number.isRequired,
  buildSha: _propTypes2.default.string.isRequired
};
exports.default = StatusApp;
module.exports = exports['default'];

/***/ }),

/***/ "./src/legacy/core_plugins/status_page/public/components/status_table.js":
/*!*******************************************************************************!*\
  !*** ./src/legacy/core_plugins/status_page/public/components/status_table.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _prop_types = __webpack_require__(/*! ../lib/prop_types */ "./src/legacy/core_plugins/status_page/public/lib/prop_types.js");

var _eui = __webpack_require__(/*! @elastic/eui */ "./node_modules/@elastic/eui/lib/index.js");

var _i18n = __webpack_require__(/*! @kbn/i18n */ "./packages/kbn-i18n/target/web/browser.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed to Elasticsearch B.V. under one or more contributor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * license agreements. See the NOTICE file distributed with
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * this work for additional information regarding copyright
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ownership. Elasticsearch B.V. licenses this file to you under
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the Apache License, Version 2.0 (the "License"); you may
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *    http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * software distributed under the License is distributed on an
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * KIND, either express or implied.  See the License for the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * specific language governing permissions and limitations
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var StatusTable = function (_Component) {
  _inherits(StatusTable, _Component);

  function StatusTable() {
    _classCallCheck(this, StatusTable);

    return _possibleConstructorReturn(this, (StatusTable.__proto__ || Object.getPrototypeOf(StatusTable)).apply(this, arguments));
  }

  _createClass(StatusTable, [{
    key: 'render',
    value: function render() {
      var statuses = this.props.statuses;


      if (!statuses) {
        return null;
      }

      return _react2.default.createElement(_eui.EuiBasicTable, {
        columns: StatusTable.columns,
        items: statuses,
        rowProps: StatusTable.getRowProps,
        'data-test-subj': 'statusBreakdown'
      });
    }
  }]);

  return StatusTable;
}(_react.Component);

StatusTable.propTypes = {
  statuses: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired, // plugin id
    state: _prop_types.State.isRequired // state of the plugin
  })) // can be null
};
StatusTable.columns = [{
  field: 'state',
  name: '',
  render: function render(state) {
    return _react2.default.createElement(_eui.EuiIcon, { type: 'dot', 'aria-hidden': true, color: state.uiColor });
  },
  width: '32px'
}, {
  field: 'id',
  name: _i18n.i18n.translate('statusPage.statusTable.columns.idHeader', {
    defaultMessage: 'ID'
  })
}, {
  field: 'state',
  name: _i18n.i18n.translate('statusPage.statusTable.columns.statusHeader', {
    defaultMessage: 'Status'
  }),
  render: function render(state) {
    return _react2.default.createElement(
      'span',
      null,
      state.message
    );
  }
}];

StatusTable.getRowProps = function (_ref) {
  var state = _ref.state;

  return {
    className: 'status-table-row-' + state.uiColor
  };
};

exports.default = StatusTable;
module.exports = exports['default'];

/***/ }),

/***/ "./src/legacy/core_plugins/status_page/public/lib/format_number.js":
/*!*************************************************************************!*\
  !*** ./src/legacy/core_plugins/status_page/public/lib/format_number.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatNumber;

var _numeral = __webpack_require__(/*! numeral */ "./webpackShims/numeral.js");

var _numeral2 = _interopRequireDefault(_numeral);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function formatNumber(num, which) {
  var format = '0.00';
  var postfix = '';
  switch (which) {
    case 'byte':
      format += ' b';
      break;
    case 'ms':
      postfix = ' ms';
      break;
    case 'integer':
      format = '0';
      break;
  }

  return (0, _numeral2.default)(num).format(format) + postfix;
} /*
   * Licensed to Elasticsearch B.V. under one or more contributor
   * license agreements. See the NOTICE file distributed with
   * this work for additional information regarding copyright
   * ownership. Elasticsearch B.V. licenses this file to you under
   * the Apache License, Version 2.0 (the "License"); you may
   * not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *    http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing,
   * software distributed under the License is distributed on an
   * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
   * KIND, either express or implied.  See the License for the
   * specific language governing permissions and limitations
   * under the License.
   */

module.exports = exports['default'];

/***/ }),

/***/ "./src/legacy/core_plugins/status_page/public/lib/load_status.js":
/*!***********************************************************************!*\
  !*** ./src/legacy/core_plugins/status_page/public/lib/load_status.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var fetchData = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', fetch(_chrome2.default.addBasePath('/api/status'), {
              method: 'get',
              credentials: 'same-origin'
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function fetchData() {
    return _ref.apply(this, arguments);
  };
}();

/*
Get the status from the server API and format it for display.

`fetchFn` can be injected for testing, defaults to the implementation above.
*/


var loadStatus = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var fetchFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : fetchData;
    var response, serverIsDownErrorMessage, serverStatusCodeErrorMessage, data;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Clear any existing error banner.
            if (errorNotif) {
              errorNotif.clear();
              errorNotif = null;
            }

            response = void 0;
            _context2.prev = 2;
            _context2.next = 5;
            return fetchFn();

          case 5:
            response = _context2.sent;
            _context2.next = 13;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](2);

            // If the fetch failed to connect, display an error and bail.
            serverIsDownErrorMessage = _i18n.i18n.translate('statusPage.loadStatus.serverIsDownErrorMessage', {
              defaultMessage: 'Failed to request server status. Perhaps your server is down?'
            });


            errorNotif = _notify.toastNotifications.addDanger(serverIsDownErrorMessage);
            return _context2.abrupt('return', _context2.t0);

          case 13:
            if (!(response.status >= 400)) {
              _context2.next = 17;
              break;
            }

            // If the server does not respond with a successful status, display an error and bail.
            serverStatusCodeErrorMessage = _i18n.i18n.translate('statusPage.loadStatus.serverStatusCodeErrorMessage', {
              defaultMessage: 'Failed to request server status with status code {responseStatus}',
              values: { responseStatus: response.status }
            });


            errorNotif = _notify.toastNotifications.addDanger(serverStatusCodeErrorMessage);
            return _context2.abrupt('return');

          case 17:
            _context2.next = 19;
            return response.json();

          case 19:
            data = _context2.sent;
            return _context2.abrupt('return', {
              name: data.name,
              statuses: data.status.statuses.map(formatStatus),
              serverState: formatStatus(data.status.overall).state,
              metrics: formatMetrics(data)
            });

          case 21:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[2, 8]]);
  }));

  return function loadStatus() {
    return _ref2.apply(this, arguments);
  };
}();

var _lodash = __webpack_require__(/*! lodash */ "./node_modules/lodash/index.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _chrome = __webpack_require__(/*! ui/chrome */ "./src/ui/public/chrome/index.js");

var _chrome2 = _interopRequireDefault(_chrome);

var _notify = __webpack_require__(/*! ui/notify */ "./src/ui/public/notify/index.js");

var _i18n = __webpack_require__(/*! @kbn/i18n */ "./packages/kbn-i18n/target/web/browser.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Licensed to Elasticsearch B.V. under one or more contributor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * license agreements. See the NOTICE file distributed with
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * this work for additional information regarding copyright
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * ownership. Elasticsearch B.V. licenses this file to you under
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * the Apache License, Version 2.0 (the "License"); you may
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            *    http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Unless required by applicable law or agreed to in writing,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * software distributed under the License is distributed on an
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * KIND, either express or implied.  See the License for the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * specific language governing permissions and limitations
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */

// Module-level error returned by notify.error
var errorNotif = void 0;

/*
Returns an object of any keys that should be included for metrics.
*/
function formatMetrics(data) {
  if (!data.metrics) {
    return null;
  }

  return [{
    name: _i18n.i18n.translate('statusPage.metricsTiles.columns.heapTotalHeader', {
      defaultMessage: 'Heap total'
    }),
    value: _lodash2.default.get(data.metrics, 'process.memory.heap.size_limit'),
    type: 'byte'
  }, {
    name: _i18n.i18n.translate('statusPage.metricsTiles.columns.heapUsedHeader', {
      defaultMessage: 'Heap used'
    }),
    value: _lodash2.default.get(data.metrics, 'process.memory.heap.used_in_bytes'),
    type: 'byte'
  }, {
    name: _i18n.i18n.translate('statusPage.metricsTiles.columns.loadHeader', {
      defaultMessage: 'Load'
    }),
    value: [_lodash2.default.get(data.metrics, 'os.load.1m'), _lodash2.default.get(data.metrics, 'os.load.5m'), _lodash2.default.get(data.metrics, 'os.load.15m')],
    type: 'float'
  }, {
    name: _i18n.i18n.translate('statusPage.metricsTiles.columns.resTimeAvgHeader', {
      defaultMessage: 'Response time avg'
    }),
    value: _lodash2.default.get(data.metrics, 'response_times.avg_in_millis'),
    type: 'ms'
  }, {
    name: _i18n.i18n.translate('statusPage.metricsTiles.columns.resTimeMaxHeader', {
      defaultMessage: 'Response time max'
    }),
    value: _lodash2.default.get(data.metrics, 'response_times.max_in_millis'),
    type: 'ms'
  }, {
    name: _i18n.i18n.translate('statusPage.metricsTiles.columns.requestsPerSecHeader', {
      defaultMessage: 'Requests per second'
    }),
    value: _lodash2.default.get(data.metrics, 'requests.total') * 1000 / _lodash2.default.get(data.metrics, 'collection_interval_in_millis')
  }];
}

/**
 * Reformat the backend data to make the frontend views simpler.
 */
function formatStatus(status) {
  return {
    id: status.id,
    state: {
      id: status.state,
      title: status.title,
      message: status.message,
      uiColor: status.uiColor
    }
  };
}

exports.default = loadStatus;
module.exports = exports['default'];

/***/ }),

/***/ "./src/legacy/core_plugins/status_page/public/lib/prop_types.js":
/*!**********************************************************************!*\
  !*** ./src/legacy/core_plugins/status_page/public/lib/prop_types.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Metric = exports.State = undefined;

var _propTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var State = exports.State = _propTypes2.default.shape({
  id: _propTypes2.default.string.isRequired,
  message: _propTypes2.default.string, // optional
  title: _propTypes2.default.string, // optional
  uiColor: _propTypes2.default.string.isRequired
}); /*
     * Licensed to Elasticsearch B.V. under one or more contributor
     * license agreements. See the NOTICE file distributed with
     * this work for additional information regarding copyright
     * ownership. Elasticsearch B.V. licenses this file to you under
     * the Apache License, Version 2.0 (the "License"); you may
     * not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *    http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing,
     * software distributed under the License is distributed on an
     * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     * KIND, either express or implied.  See the License for the
     * specific language governing permissions and limitations
     * under the License.
     */

var Metric = exports.Metric = _propTypes2.default.shape({
  name: _propTypes2.default.string.isRequired,
  value: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.number), _propTypes2.default.number]).isRequired,
  type: _propTypes2.default.string // optional
});

/***/ }),

/***/ "./src/legacy/core_plugins/status_page/public/status_page.html":
/*!*********************************************************************!*\
  !*** ./src/legacy/core_plugins/status_page/public/status_page.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"createStatusPageReact\"></div>\n"

/***/ }),

/***/ "./src/legacy/core_plugins/status_page/public/status_page.js":
/*!*******************************************************************!*\
  !*** ./src/legacy/core_plugins/status_page/public/status_page.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! ui/autoload/styles */ "./src/ui/public/autoload/styles.js");

__webpack_require__(/*! ui/i18n */ "./src/ui/public/i18n/index.tsx");

var _modules = __webpack_require__(/*! ui/modules */ "./src/ui/public/modules.js");

var _chrome = __webpack_require__(/*! ui/chrome */ "./src/ui/public/chrome/index.js");

var _chrome2 = _interopRequireDefault(_chrome);

var _render = __webpack_require__(/*! ./components/render */ "./src/legacy/core_plugins/status_page/public/components/render.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chrome2.default.setRootTemplate(__webpack_require__(/*! plugins/status_page/status_page.html */ "./src/legacy/core_plugins/status_page/public/status_page.html")).setRootController('ui', function ($scope, buildNum, buildSha) {
  $scope.$$postDigest(function () {
    (0, _render.renderStatusPage)(buildNum, buildSha.substr(0, 8));
    $scope.$on('$destroy', _render.destroyStatusPage);
  });
}); /*
     * Licensed to Elasticsearch B.V. under one or more contributor
     * license agreements. See the NOTICE file distributed with
     * this work for additional information regarding copyright
     * ownership. Elasticsearch B.V. licenses this file to you under
     * the Apache License, Version 2.0 (the "License"); you may
     * not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *    http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing,
     * software distributed under the License is distributed on an
     * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     * KIND, either express or implied.  See the License for the
     * specific language governing permissions and limitations
     * under the License.
     */

_modules.uiModules.get('kibana').config(function (appSwitcherEnsureNavigationProvider) {
  appSwitcherEnsureNavigationProvider.forceNavigation(true);
});

/***/ }),

/***/ "dll-reference vendors":
/*!**************************!*\
  !*** external "vendors" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = vendors;

/***/ }),

/***/ "mocha":
/*!************************!*\
  !*** external "mocha" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = mocha;

/***/ })

/******/ });
//# sourceMappingURL=status_page.bundle.js.map