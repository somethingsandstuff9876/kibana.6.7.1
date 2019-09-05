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
/******/ 		"timelion": 0
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
/******/ 	deferredModules.push(["./optimize/bundles/timelion.entry.js","commons"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/angular-sortable-view/src/angular-sortable-view.js":
/*!**************************************************************************************************************!*\
  !*** delegated ./node_modules/angular-sortable-view/src/angular-sortable-view.js from dll-reference vendors ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(/*! dll-reference vendors */ "dll-reference vendors"))("./node_modules/angular-sortable-view/src/angular-sortable-view.js");

/***/ }),

/***/ "./optimize/bundles/timelion.entry.js":
/*!********************************************!*\
  !*** ./optimize/bundles/timelion.entry.js ***!
  \********************************************/
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
      __webpack_require__(/*! plugins/timelion/app */ "./src/legacy/core_plugins/timelion/public/app.js");
    }
  });

  var coreStartContract = coreSystem.start();

  if (i18nError) {
    coreStartContract.fatalErrors.add(i18nError);
  }
});

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/app.js":
/*!********************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/app.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(/*! lodash */ "./node_modules/lodash/index.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _doc_title = __webpack_require__(/*! ui/doc_title */ "./src/ui/public/doc_title/index.js");

var _saved_object_registry = __webpack_require__(/*! ui/saved_objects/saved_object_registry */ "./src/ui/public/saved_objects/saved_object_registry.js");

var _notify = __webpack_require__(/*! ui/notify */ "./src/ui/public/notify/index.js");

var _timezone = __webpack_require__(/*! ui/vis/lib/timezone */ "./src/ui/public/vis/lib/timezone.js");

var _persisted_log = __webpack_require__(/*! ui/persisted_log */ "./src/ui/public/persisted_log/index.ts");

var _timefilter = __webpack_require__(/*! ui/timefilter */ "./src/ui/public/timefilter/index.js");

__webpack_require__(/*! uiExports/fieldFormats */ "./node_modules/val-loader/dist/cjs.js!./src/optimize/create_ui_exports_module.js?{\"type\":\"fieldFormats\",\"modules\":[\"plugins/kibana/field_formats/register\"]}");

__webpack_require__(/*! uiExports/savedObjectTypes */ "./node_modules/val-loader/dist/cjs.js!./src/optimize/create_ui_exports_module.js?{\"type\":\"savedObjectTypes\",\"modules\":[\"plugins/kibana/visualize/saved_visualizations/saved_visualization_register\",\"plugins/kibana/discover/saved_searches/saved_search_register\",\"plugins/kibana/dashboard/saved_dashboard/saved_dashboard_register\"]}");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import the uiExports that we want to "use"
__webpack_require__(/*! ui/autoload/all */ "./src/ui/public/autoload/all.js"); /*
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

__webpack_require__(/*! plugins/timelion/directives/cells/cells */ "./src/legacy/core_plugins/timelion/public/directives/cells/cells.js");
__webpack_require__(/*! plugins/timelion/directives/fixed_element */ "./src/legacy/core_plugins/timelion/public/directives/fixed_element.js");
__webpack_require__(/*! plugins/timelion/directives/fullscreen/fullscreen */ "./src/legacy/core_plugins/timelion/public/directives/fullscreen/fullscreen.js");
__webpack_require__(/*! plugins/timelion/directives/timelion_expression_input */ "./src/legacy/core_plugins/timelion/public/directives/timelion_expression_input.js");
__webpack_require__(/*! plugins/timelion/directives/timelion_help/timelion_help */ "./src/legacy/core_plugins/timelion/public/directives/timelion_help/timelion_help.js");
__webpack_require__(/*! plugins/timelion/directives/timelion_interval/timelion_interval */ "./src/legacy/core_plugins/timelion/public/directives/timelion_interval/timelion_interval.js");

document.title = 'Timelion - Kibana';

var app = __webpack_require__(/*! ui/modules */ "./src/ui/public/modules.js").get('apps/timelion', []);

__webpack_require__(/*! plugins/timelion/services/saved_sheets */ "./src/legacy/core_plugins/timelion/public/services/saved_sheets.js");
__webpack_require__(/*! plugins/timelion/services/_saved_sheet */ "./src/legacy/core_plugins/timelion/public/services/_saved_sheet.js");

__webpack_require__(/*! ./vis */ "./src/legacy/core_plugins/timelion/public/vis/index.js");

_saved_object_registry.SavedObjectRegistryProvider.register(__webpack_require__(/*! plugins/timelion/services/saved_sheet_register */ "./src/legacy/core_plugins/timelion/public/services/saved_sheet_register.js"));

var unsafeNotifications = _notify.notify._notifs;

__webpack_require__(/*! ui/routes */ "./src/ui/public/routes/index.js").enable();

__webpack_require__(/*! ui/routes */ "./src/ui/public/routes/index.js").when('/:id?', {
  template: __webpack_require__(/*! plugins/timelion/index.html */ "./src/legacy/core_plugins/timelion/public/index.html"),
  reloadOnSearch: false,
  resolve: {
    savedSheet: function savedSheet(redirectWhenMissing, savedSheets, $route) {
      return savedSheets.get($route.current.params.id).then(function (savedSheet) {
        if ($route.current.params.id) {
          _persisted_log.recentlyAccessed.add(savedSheet.getFullPath(), savedSheet.title, savedSheet.id);
        }
        return savedSheet;
      }).catch(redirectWhenMissing({
        'search': '/'
      }));
    }
  }
});

var location = 'Timelion';

app.controller('timelion', function ($http, $route, $routeParams, $scope, $timeout, AppState, config, confirmModal, courier, kbnUrl, Notifier, Private, i18n) {

  // Keeping this at app scope allows us to keep the current page when the user
  // switches to say, the timepicker.
  $scope.page = config.get('timelion:showTutorial', true) ? 1 : 0;
  $scope.setPage = function (page) {
    return $scope.page = page;
  };

  _timefilter.timefilter.enableAutoRefreshSelector();
  _timefilter.timefilter.enableTimeRangeSelector();

  var notify = new Notifier({
    location: location
  });

  var savedVisualizations = Private(_saved_object_registry.SavedObjectRegistryProvider).byLoaderPropertiesName.visualizations;
  var timezone = Private(_timezone.timezoneProvider)();
  var docTitle = Private(_doc_title.DocTitleProvider);

  var defaultExpression = '.es(*)';
  var savedSheet = $route.current.locals.savedSheet;

  $scope.topNavMenu = [{
    key: 'new',
    label: i18n('timelion.topNavMenu.newSheetButtonLabel', {
      defaultMessage: 'New'
    }),
    description: i18n('timelion.topNavMenu.newSheetButtonAriaLabel', {
      defaultMessage: 'New Sheet'
    }),
    run: function run() {
      kbnUrl.change('/');
    },
    testId: 'timelionNewButton'
  }, {
    key: 'add',
    label: i18n('timelion.topNavMenu.addChartButtonLabel', {
      defaultMessage: 'Add'
    }),
    description: i18n('timelion.topNavMenu.addChartButtonAriaLabel', {
      defaultMessage: 'Add a chart'
    }),
    run: function run() {
      $scope.newCell();
    },
    testId: 'timelionAddChartButton'
  }, {
    key: 'save',
    label: i18n('timelion.topNavMenu.saveSheetButtonLabel', {
      defaultMessage: 'Save'
    }),
    description: i18n('timelion.topNavMenu.saveSheetButtonAriaLabel', {
      defaultMessage: 'Save Sheet'
    }),
    template: __webpack_require__(/*! plugins/timelion/partials/save_sheet.html */ "./src/legacy/core_plugins/timelion/public/partials/save_sheet.html"),
    testId: 'timelionSaveButton'
  }, {
    key: 'delete',
    label: i18n('timelion.topNavMenu.deleteSheetButtonLabel', {
      defaultMessage: 'Delete'
    }),
    description: i18n('timelion.topNavMenu.deleteSheetButtonAriaLabel', {
      defaultMessage: 'Delete current sheet'
    }),
    disableButton: function disableButton() {
      return !savedSheet.id;
    },
    run: function run() {
      var title = savedSheet.title;
      function doDelete() {
        savedSheet.delete().then(function () {
          _notify.toastNotifications.addSuccess(i18n('timelion.topNavMenu.delete.modal.successNotificationText', {
            defaultMessage: 'Deleted \'{title}\'',
            values: { title: title }
          }));
          kbnUrl.change('/');
        }).catch(function (error) {
          return (0, _notify.fatalError)(error, location);
        });
      }

      var confirmModalOptions = {
        onConfirm: doDelete,
        confirmButtonText: i18n('timelion.topNavMenu.delete.modal.confirmButtonLabel', {
          defaultMessage: 'Delete'
        }),
        title: i18n('timelion.topNavMenu.delete.modalTitle', {
          defaultMessage: 'Delete Timelion sheet \'{title}\'?',
          values: { title: title }
        })
      };

      confirmModal(i18n('timelion.topNavMenu.delete.modal.warningText', {
        defaultMessage: 'You can\'t recover deleted sheets.'
      }), confirmModalOptions);
    },
    testId: 'timelionDeleteButton'
  }, {
    key: 'open',
    label: i18n('timelion.topNavMenu.openSheetButtonLabel', {
      defaultMessage: 'Open'
    }),
    description: i18n('timelion.topNavMenu.openSheetButtonAriaLabel', {
      defaultMessage: 'Open Sheet'
    }),
    template: __webpack_require__(/*! plugins/timelion/partials/load_sheet.html */ "./src/legacy/core_plugins/timelion/public/partials/load_sheet.html"),
    testId: 'timelionOpenButton'
  }, {
    key: 'options',
    label: i18n('timelion.topNavMenu.optionsButtonLabel', {
      defaultMessage: 'Options'
    }),
    description: i18n('timelion.topNavMenu.optionsButtonAriaLabel', {
      defaultMessage: 'Options'
    }),
    template: __webpack_require__(/*! plugins/timelion/partials/sheet_options.html */ "./src/legacy/core_plugins/timelion/public/partials/sheet_options.html"),
    testId: 'timelionOptionsButton'
  }, {
    key: 'help',
    label: i18n('timelion.topNavMenu.helpButtonLabel', {
      defaultMessage: 'Help'
    }),
    description: i18n('timelion.topNavMenu.helpButtonAriaLabel', {
      defaultMessage: 'Help'
    }),
    template: '<timelion-help></timelion-help>',
    testId: 'timelionDocsButton'
  }];

  $timeout(function () {
    if (config.get('timelion:showTutorial', true)) {
      $scope.kbnTopNav.open('help');
    }
  }, 0);

  $scope.transient = {};
  $scope.state = new AppState(getStateDefaults());
  function getStateDefaults() {
    return {
      sheet: savedSheet.timelion_sheet,
      selected: 0,
      columns: savedSheet.timelion_columns,
      rows: savedSheet.timelion_rows,
      interval: savedSheet.timelion_interval
    };
  }

  var init = function init() {
    $scope.running = false;
    $scope.search();

    $scope.$listen($scope.state, 'fetch_with_changes', $scope.search);
    $scope.$listen(_timefilter.timefilter, 'fetch', $scope.search);

    $scope.opts = {
      saveExpression: saveExpression,
      saveSheet: saveSheet,
      savedSheet: savedSheet,
      state: $scope.state,
      search: $scope.search,
      dontShowHelp: function dontShowHelp() {
        config.set('timelion:showTutorial', false);
        $scope.setPage(0);
        $scope.kbnTopNav.close('help');
      }
    };
  };

  var refresher = void 0;
  $scope.$listen(_timefilter.timefilter, 'refreshIntervalUpdate', function () {
    if (refresher) $timeout.cancel(refresher);
    var interval = _timefilter.timefilter.getRefreshInterval();
    if (interval.value > 0 && !interval.pause) {
      var startRefresh = function startRefresh() {
        refresher = $timeout(function () {
          if (!$scope.running) $scope.search();
          startRefresh();
        }, interval.value);
      };

      startRefresh();
    }
  });

  $scope.$watch(function () {
    return savedSheet.lastSavedTitle;
  }, function (newTitle) {
    docTitle.change(savedSheet.id ? newTitle : undefined);
  });

  $scope.toggle = function (property) {
    $scope[property] = !$scope[property];
  };

  $scope.newSheet = function () {
    kbnUrl.change('/', {});
  };

  $scope.newCell = function () {
    $scope.state.sheet.push(defaultExpression);
    $scope.state.selected = $scope.state.sheet.length - 1;
    $scope.safeSearch();
  };

  $scope.setActiveCell = function (cell) {
    $scope.state.selected = cell;
  };

  $scope.search = function () {
    $scope.state.save();
    $scope.running = true;

    var httpResult = $http.post('../api/timelion/run', {
      sheet: $scope.state.sheet,
      time: _lodash2.default.extend(_timefilter.timefilter.getTime(), {
        interval: $scope.state.interval,
        timezone: timezone
      })
    }).then(function (resp) {
      return resp.data;
    }).catch(function (resp) {
      throw resp.data;
    });

    httpResult.then(function (resp) {
      dismissNotifications();
      $scope.stats = resp.stats;
      $scope.sheet = resp.sheet;
      _lodash2.default.each(resp.sheet, function (cell) {
        if (cell.exception) {
          $scope.state.selected = cell.plot;
        }
      });
      $scope.running = false;
    }).catch(function (resp) {
      $scope.sheet = [];
      $scope.running = false;

      var err = new Error(resp.message);
      err.stack = resp.stack;
      notify.error(err);
    });
  };

  $scope.safeSearch = _lodash2.default.debounce($scope.search, 500);

  function saveSheet() {
    savedSheet.timelion_sheet = $scope.state.sheet;
    savedSheet.timelion_interval = $scope.state.interval;
    savedSheet.timelion_columns = $scope.state.columns;
    savedSheet.timelion_rows = $scope.state.rows;
    savedSheet.save().then(function (id) {
      if (id) {
        _notify.toastNotifications.addSuccess(i18n('timelion.saveSheet.successNotificationText', {
          defaultMessage: 'Saved sheet \'{title}\'',
          values: { title: savedSheet.title }
        }));

        if (savedSheet.id !== $routeParams.id) {
          kbnUrl.change('/{{id}}', { id: savedSheet.id });
        }
      }
    });
  }

  function saveExpression(title) {
    savedVisualizations.get({ type: 'timelion' }).then(function (savedExpression) {
      savedExpression.visState.params = {
        expression: $scope.state.sheet[$scope.state.selected],
        interval: $scope.state.interval
      };
      savedExpression.title = title;
      savedExpression.visState.title = title;
      savedExpression.save().then(function (id) {
        if (id) {
          _notify.toastNotifications.addSuccess(i18n('timelion.saveExpression.successNotificationText', {
            defaultMessage: 'Saved expression \'{title}\'',
            values: { title: savedExpression.title }
          }));
        }
      });
    });
  }

  function dismissNotifications() {
    unsafeNotifications.splice(0, unsafeNotifications.length);
  }

  init();
});

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/directives/cells/cells.html":
/*!*****************************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/directives/cells/cells.html ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div sv-root\n  sv-part=\"state.sheet\"\n  sv-on-sort=\"dropCell($item, $partFrom, $partTo, $indexFrom, $indexTo)\"\n  >\n\n  <div sv-element\n    ng-repeat=\"cell in state.sheet track by $index\"\n    class=\"timCell col-md-{{12 / state.columns}} col-sm-12 col-xs-12\"\n    timelion-grid timelion-grid-rows=\"state.rows\"\n    ng-click=\"onSelect($index)\"\n    ng-class=\"{active: $index === state.selected}\"\n    kbn-accessible-click\n    aria-label=\"Timelion chart {{$index + 1}}\"\n    aria-current=\"{{$index === state.selected}}\"\n    >\n\n    <div chart=\"sheet[$index]\" class=\"timChart\" search=\"onSearch\" interval=\"state.interval\"></div>\n    <div class=\"timCell__actions\">\n      <div class=\"timCell__id\"><span>{{$index + 1}}</span></div>\n\n      <button\n        class=\"timCell__action\"\n        ng-click=\"removeCell($index)\"\n        tooltip=\"{{ ::'timelion.cells.actions.removeTooltip' | i18n: { defaultMessage: 'Remove' } }}\"\n        tooltip-append-to-body=\"1\"\n        aria-label=\"{{ ::'timelion.cells.actions.removeAriaLabel' | i18n: { defaultMessage: 'Remove chart' } }}\"\n      >\n        <span class=\"fa fa-remove\"></span>\n      </button>\n      <button\n        class=\"timCell__action\"\n        tooltip=\"{{ ::'timelion.cells.actions.reorderTooltip' | i18n: { defaultMessage: 'Drag to reorder' } }}\"\n        tooltip-append-to-body=\"1\"\n        sv-handle\n        aria-label=\"{{ ::'timelion.cells.actions.reorderAriaLabel' | i18n: { defaultMessage: 'Drag to reorder' } }}\"\n        tabindex=\"-1\"\n      >\n        <span class=\"fa fa-arrows\"></span>\n      </button>\n      <button\n        class=\"timCell__action\"\n        ng-click=\"transient.fullscreen = true\"\n        tooltip=\"{{ ::'timelion.cells.actions.fullscreenTooltip' | i18n: { defaultMessage: 'Full screen' } }}\"\n        tooltip-append-to-body=\"1\"\n        aria-label=\"{{ ::'timelion.cells.actions.fullscreenAriaLabel' | i18n: { defaultMessage: 'Full screen chart' } }}\"\n      >\n        <span class=\"fa fa-expand\"></span>\n      </button>\n    </div>\n  </div>\n\n</div>\n"

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/directives/cells/cells.js":
/*!***************************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/directives/cells/cells.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(/*! lodash */ "./node_modules/lodash/index.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _collection = __webpack_require__(/*! ui/utils/collection */ "./src/ui/public/utils/collection.ts");

var _cells = __webpack_require__(/*! ./cells.html */ "./src/legacy/core_plugins/timelion/public/directives/cells/cells.html");

var _cells2 = _interopRequireDefault(_cells);

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

__webpack_require__(/*! angular-sortable-view */ "./node_modules/angular-sortable-view/src/angular-sortable-view.js");
__webpack_require__(/*! plugins/timelion/directives/chart/chart */ "./src/legacy/core_plugins/timelion/public/directives/chart/chart.js");
__webpack_require__(/*! plugins/timelion/directives/timelion_grid */ "./src/legacy/core_plugins/timelion/public/directives/timelion_grid.js");

var app = __webpack_require__(/*! ui/modules */ "./src/ui/public/modules.js").get('apps/timelion', ['angular-sortable-view']);


app.directive('timelionCells', function () {
  return {
    restrict: 'E',
    scope: {
      sheet: '=',
      state: '=',
      transient: '=',
      onSearch: '=',
      onSelect: '='
    },
    template: _cells2.default,
    link: function link($scope) {

      $scope.removeCell = function (index) {
        _lodash2.default.pullAt($scope.state.sheet, index);
        $scope.onSearch();
      };

      $scope.dropCell = function (item, partFrom, partTo, indexFrom, indexTo) {
        $scope.onSelect(indexTo);
        (0, _collection.move)($scope.sheet, indexFrom, indexTo);
      };
    }
  };
});

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/directives/fixed_element.js":
/*!*****************************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/directives/fixed_element.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(/*! jquery */ "./webpackShims/jquery.js");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = __webpack_require__(/*! ui/modules */ "./src/ui/public/modules.js").get('apps/timelion', []); /*
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

app.directive('fixedElementRoot', function () {
  return {
    restrict: 'A',
    link: function link($scope, $elem) {
      var fixedAt = void 0;
      (0, _jquery2.default)(window).bind('scroll', function () {
        var fixed = (0, _jquery2.default)('[fixed-element]', $elem);
        var body = (0, _jquery2.default)('[fixed-element-body]', $elem);
        var top = fixed.offset().top;

        if ((0, _jquery2.default)(window).scrollTop() > top) {
          // This is a gross hack, but its better than it was. I guess
          fixedAt = (0, _jquery2.default)(window).scrollTop();
          fixed.addClass(fixed.attr('fixed-element'));
          body.addClass(fixed.attr('fixed-element-body'));
          body.css({ top: fixed.height() });
        }

        if ((0, _jquery2.default)(window).scrollTop() < fixedAt) {
          fixed.removeClass(fixed.attr('fixed-element'));
          body.removeClass(fixed.attr('fixed-element-body'));
          body.removeAttr('style');
        }
      });
    }
  };
});

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/directives/fullscreen/fullscreen.html":
/*!***************************************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/directives/fullscreen/fullscreen.html ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"timCell col-md-12 col-sm-12 col-xs-12\" timelion-grid timelion-grid-rows=\"1\">\n  <div  chart=\"series\" class=\"timChart\" search=\"onSearch\" interval=\"state.interval\"></div>\n  <div class=\"timCell__actions\">\n    <button\n      class=\"timCell__action\"\n      ng-click=\"transient.fullscreen = false\"\n      tooltip=\"{{ ::'timelion.fullscreen.exitTooltip' | i18n: { defaultMessage: 'Exit full screen' } }}\"\n      tooltip-append-to-body=\"1\"\n      aria-label=\"{{ ::'timelion.fullscreen.exitAriaLabel' | i18n: { defaultMessage: 'Exit full screen' } }}\"\n    >\n      <span class=\"fa fa-compress\"></span>\n    </button>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/directives/fullscreen/fullscreen.js":
/*!*************************************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/directives/fullscreen/fullscreen.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _fullscreen = __webpack_require__(/*! ./fullscreen.html */ "./src/legacy/core_plugins/timelion/public/directives/fullscreen/fullscreen.html");

var _fullscreen2 = _interopRequireDefault(_fullscreen);

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

__webpack_require__(/*! angular-sortable-view */ "./node_modules/angular-sortable-view/src/angular-sortable-view.js");
__webpack_require__(/*! plugins/timelion/directives/chart/chart */ "./src/legacy/core_plugins/timelion/public/directives/chart/chart.js");
__webpack_require__(/*! plugins/timelion/directives/timelion_grid */ "./src/legacy/core_plugins/timelion/public/directives/timelion_grid.js");

var app = __webpack_require__(/*! ui/modules */ "./src/ui/public/modules.js").get('apps/timelion', ['angular-sortable-view']);


app.directive('timelionFullscreen', function () {
  return {
    restrict: 'E',
    scope: {
      expression: '=',
      series: '=',
      state: '=',
      transient: '=',
      onSearch: '='
    },
    template: _fullscreen2.default
  };
});

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/directives/timelion_grid.js":
/*!*****************************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/directives/timelion_grid.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(/*! jquery */ "./webpackShims/jquery.js");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = __webpack_require__(/*! ui/modules */ "./src/ui/public/modules.js").get('apps/timelion', []); /*
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

app.directive('timelionGrid', function () {
  return {
    restrict: 'A',
    scope: {
      timelionGridRows: '=',
      timelionGridColumns: '='
    },
    link: function link($scope, $elem) {

      function init() {
        setDimensions();
      }

      $scope.$on('$destroy', function () {
        (0, _jquery2.default)(window).off('resize'); //remove the handler added earlier
      });

      (0, _jquery2.default)(window).resize(function () {
        setDimensions();
      });

      $scope.$watchMulti(['timelionGridColumns', 'timelionGridRows'], function () {
        setDimensions();
      });

      function setDimensions() {
        var borderSize = 2;
        var headerSize = 45 + 35 + 28 + 20 * 2; // chrome + subnav + buttons + (container padding)
        var verticalPadding = 10;

        if ($scope.timelionGridColumns != null) {
          $elem.width($elem.parent().width() / $scope.timelionGridColumns - borderSize * 2);
        }

        if ($scope.timelionGridRows != null) {
          $elem.height(((0, _jquery2.default)(window).height() - headerSize) / $scope.timelionGridRows - (verticalPadding + borderSize * 2));
        }
      }

      init();
    }
  };
});

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/directives/timelion_help/timelion_help.html":
/*!*********************************************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/directives/timelion_help/timelion_help.html ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"euiText timHelp\">\n  <div ng-show=\"page === 1\">\n    <div>\n      <h1\n        i18n-id=\"timelion.help.welcomeTitle\"\n        i18n-default-message=\"Welcome to {strongTimelionLabel}!\"\n        i18n-values=\"{ html_strongTimelionLabel: '<strong>Timelion</strong>' }\"\n      ></h1>\n      <p\n        i18n-id=\"timelion.help.welcome.content.paragraph1\"\n        i18n-default-message=\"Timelion is the clawing, gnashing, zebra killing, pluggable time\n                              series interface for {emphasizedEverything}. If your datastore can\n                              produce a time series, then you have all of the awesome power of\n                              Timelion at your disposal. Timelion lets you compare, combine, and\n                              combobulate datasets across multiple datasources with one\n                              easy-to-master expression syntax. This tutorial focuses on\n                              Elasticsearch, but you'll quickly discover that what you learn here\n                              applies to any datasource Timelion supports.\"\n        i18n-values=\"{ html_emphasizedEverything: '<em>' + translations.emphasizedEverythingText + '</em>' }\"\n      ></p>\n      <p>\n        <span\n          i18n-id=\"timelion.help.welcome.content.paragraph2\"\n          i18n-default-message=\"Ready to get started? Click {strongNext}. Want to skip the tutorial and view the docs?\"\n          i18n-values=\"{\n            html_strongNext: '<strong>' + translations.strongNextText + '</strong>',\n          }\"\n        ></span>\n        <a\n          ng-click=\"setPage(0)\"\n          i18n-id=\"timelion.help.welcome.content.functionReferenceLinkText\"\n          i18n-default-message=\"Jump to the function reference\"\n        ></a>.\n      </p>\n    </div>\n    <div class=\"timHelp__buttons\">\n\n      <button\n        ng-click=\"opts.dontShowHelp()\"\n        class=\"kuiButton kuiButton--hollow\"\n      >\n        {{translations.dontShowHelpButtonLabel}}\n      </button>\n\n\n      <button\n        ng-click=\"setPage(page+1)\"\n        class=\"kuiButton kuiButton--primary\"\n      >\n        {{translations.nextButtonLabel}}\n      </button>\n\n    </div>\n  </div>\n  <div ng-show=\"page === 2\">\n    <div ng-show=\"!es.valid\">\n      <div>\n        <h2\n          i18n-id=\"timelion.help.configuration.notValidTitle\"\n          i18n-default-message=\"First time configuration\"\n        ></h2>\n        <p\n          i18n-id=\"timelion.help.configuration.notValid.paragraph1\"\n          i18n-default-message=\"If you're using Logstash, you don't need to configure anything to\n                                start exploring your log data with Timelion. To search other\n                                indices, go to {advancedSettingsPath} and configure the {esDefaultIndex}\n                                and {esTimefield} settings to match your indices.\"\n          i18n-values=\"{\n            html_advancedSettingsPath: '<strong>' + translations.notValidAdvancedSettingsPath + '</strong>',\n            html_esDefaultIndex: '<code>timelion:es.default_index</code>',\n            html_esTimefield: '<code>timelion:es.timefield</code>',\n          }\"\n        ></p>\n        <p\n          i18n-id=\"timelion.help.configuration.notValid.paragraph2\"\n          i18n-default-message=\"You'll also see some other Timelion settings. For now, you don't need\n                                to worry about them. Later, you'll see that you can set most of\n                                them on the fly if you need to.\"\n        ></p>\n      </div>\n      <div class=\"timHelp__buttons\">\n\n        <button\n          ng-click=\"setPage(page-1)\"\n          class=\"kuiButton kuiButton--primary\"\n        >\n          {{translations.previousButtonLabel}}\n        </button>\n\n        <span\n          ng-show=\"es.invalidCount > 0 && !es.valid\"\n          i18n-id=\"timelion.help.configuration.notValid.notValidSettingsErrorMessage\"\n          i18n-default-message=\"Could not validate Elasticsearch settings: {reason}.\n                                Check your Advanced Settings and try again. ({count})\"\n          i18n-values=\"{\n            html_reason: '<strong>' + es.invalidReason + '</strong>',\n            count: es.invalidCount,\n          }\"\n        ></span>\n\n        <button\n          ng-click=\"recheckElasticsearch()\"\n          class=\"kuiButton kuiButton--primary\"\n          i18n-id=\"timelion.help.configuration.notValid.validateButtonLabel\"\n          i18n-default-message=\"Validate Config\"\n        ></button>\n\n      </div>\n    </div>\n    <div ng-show=\"es.valid\">\n      <div>\n        <h2\n          i18n-id=\"timelion.help.configuration.validTitle\"\n          i18n-default-message=\"Good news, Elasticsearch is configured correctly!\"\n        ></h2>\n        <p>\n          <span\n            i18n-id=\"timelion.help.configuration.valid.paragraph1Part1\"\n            i18n-default-message=\"We validated your default index and your timefield and everything\n                                  looks ok. We found data from {statsMin} to {statsMax}.\n                                  You're probably all set. If this doesn't look right, see\"\n            i18n-values=\"{\n              html_statsMin: '<strong>' + es.stats.min + '</strong>',\n              html_statsMax: '<strong>' + es.stats.max + '</strong>',\n            }\"\n            i18n-description=\"Part of composite text timelion.help.configuration.valid.paragraph1Part1 +\n                              timelion.help.configuration.firstTimeConfigurationLinkText +\n                              timelion.help.configuration.valid.paragraph1Part2\"\n          ></span>\n          <a\n            ng-click=\"es.valid = false\"\n            i18n-id=\"timelion.help.configuration.firstTimeConfigurationLinkText\"\n            i18n-default-message=\"First time configuration\"\n            i18n-description=\"Part of composite text timelion.help.configuration.valid.paragraph1Part1 +\n                              timelion.help.configuration.firstTimeConfigurationLinkText +\n                              timelion.help.configuration.valid.paragraph1Part2\"\n          ></a>\n          <span\n            i18n-id=\"timelion.help.configuration.valid.paragraph1Part2\"\n            i18n-default-message=\"for information about configuring the Elasticsearch datasource.\"\n            i18n-description=\"Part of composite text timelion.help.configuration.valid.paragraph1Part1 +\n                              timelion.help.configuration.firstTimeConfigurationLinkText +\n                              timelion.help.configuration.valid.paragraph1Part2\"\n          ></span>\n        </p>\n        <p\n          i18n-id=\"timelion.help.configuration.valid.paragraph2\"\n          i18n-default-message=\"You should already see one chart, but you might need to make a\n                                couple adjustments before you see any interesting data:\"\n        ></p>\n        <ul>\n          <li>\n            <strong\n              i18n-id=\"timelion.help.configuration.valid.intervalsTitle\"\n              i18n-default-message=\"Intervals\"\n            ></strong>\n            <p>\n              <span\n                i18n-id=\"timelion.help.configuration.valid.intervalsTextPart1\"\n                i18n-default-message=\"The interval selector at the right of the input bar lets you\n                                      control the sampling frequency. It's currently set to {interval}.\"\n                i18n-values=\"{ html_interval: '<code>' + state.interval + '</code>' }\"\n                i18n-description=\"Part of composite text\n                                  timelion.help.configuration.valid.intervalsTextPart1 +\n                                  (timelion.help.configuration.valid.intervalIsAutoText ||\n                                  timelion.help.configuration.valid.intervals.content.intervalIsNotAutoText) +\n                                  timelion.help.configuration.valid.intervalsTextPart2\"\n              ></span>\n              <span ng-show=\"state.interval == 'auto'\">\n                <strong\n                  i18n-id=\"timelion.help.configuration.valid.intervalIsAutoText\"\n                  i18n-default-message=\"You're all set!\"\n                  i18n-description=\"Part of composite text\n                                    timelion.help.configuration.valid.intervalsTextPart1 +\n                                    (timelion.help.configuration.valid.intervalIsAutoText ||\n                                    timelion.help.configuration.valid.intervals.content.intervalIsNotAutoText) +\n                                    timelion.help.configuration.valid.intervalsTextPart2\"\n                ></strong>\n              </span>\n              <span\n                ng-show=\"state.interval != 'auto'\"\n                i18n-id=\"timelion.help.configuration.valid.intervals.content.intervalIsNotAutoText\"\n                i18n-default-message=\"Set it to {auto} to let Timelion choose an appropriate interval.\"\n                i18n-description=\"Part of composite text\n                                  timelion.help.configuration.valid.intervalsTextPart1 +\n                                  (timelion.help.configuration.valid.intervalIsAutoText ||\n                                  timelion.help.configuration.valid.intervals.content.intervalIsNotAutoText) +\n                                  timelion.help.configuration.valid.intervalsTextPart2\"\n                i18n-values=\"{ html_auto: '<code>auto</code>' }\"\n              ></span>\n              <span\n                i18n-id=\"timelion.help.configuration.valid.intervalsTextPart2\"\n                i18n-default-message=\"If Timelion thinks your combination of time range and interval\n                                      will produce too many data points, it throws an error.\n                                      You can adjust that limit by configuring {maxBuckets} in {advancedSettingsPath}.\"\n                i18n-values=\"{\n                  html_maxBuckets: '<code>timelion:max_buckets</code>',\n                  html_advancedSettingsPath: '<strong>' + translations.validAdvancedSettingsPath + '</strong>',\n                }\"\n              ></span>\n            </p>\n          </li>\n          <li>\n            <strong\n              i18n-id=\"timelion.help.configuration.valid.timeRangeTitle\"\n              i18n-default-message=\"Time range\"\n            ></strong>\n            <p\n              i18n-id=\"timelion.help.configuration.valid.timeRangeText\"\n              i18n-default-message=\"Use the timepicker in the Kibana toolbar to select the time period\n                                    that contains the data you want to visualize. Make sure you select\n                                    a time period that includes all or part of the time range shown above.\"\n            ></p>\n          </li>\n        </ul>\n        <p\n          i18n-id=\"timelion.help.configuration.valid.paragraph3\"\n          i18n-default-message=\"Now, you should see a line chart that displays a count of your data points over time.\"\n        ></p>\n      </div>\n      <div class=\"timHelp__buttons\">\n\n        <button\n          ng-click=\"setPage(page-1)\"\n          class=\"kuiButton kuiButton--primary\"\n        >\n          {{translations.previousButtonLabel}}\n        </button>\n\n\n        <button\n          ng-click=\"setPage(page+1)\"\n          class=\"kuiButton kuiButton--primary\"\n        >\n          {{translations.nextButtonLabel}}\n        </button>\n\n      </div>\n    </div>\n  </div>\n  <div ng-show=\"page === 3\">\n    <div>\n      <h2\n        i18n-id=\"timelion.help.queryingTitle\"\n        i18n-default-message=\"Querying the Elasticsearch datasource\"\n      ></h2>\n      <p\n        i18n-id=\"timelion.help.querying.paragraph1\"\n        i18n-default-message=\"Now that we've validated that you have a working Elasticsearch\n                              datasource, you can start submitting queries. For starters,\n                              enter {esPattern} in the input bar and hit enter.\"\n        i18n-values=\"{\n          html_esPattern: '<code>.es(*)</code>',\n        }\"\n      ></p>\n      <p>\n        <span\n          i18n-id=\"timelion.help.querying.paragraph2Part1\"\n          i18n-default-message=\"This says {esAsteriskQueryDescription}. If you want to find a subset, you could enter something\n                                like {htmlQuery} to count events that match {html}, or {bobQuery}\n                                to find events that contain {bob} in the {user} field and have a {bytes}\n                                field that is greater than 100. Note that this query is enclosed in single\n                                quotes&mdash;that's because it contains spaces. You can enter any\"\n          i18n-values=\"{\n            html_esAsteriskQueryDescription: '<em>' + translations.esAsteriskQueryDescription + '</em>',\n            html_html: '<em>html</em>',\n            html_htmlQuery: '<code>.es(html)</code>',\n            html_bobQuery: '<code>.es(\\'user:bob AND bytes:>100\\')</code>',\n            html_bob: '<em>bob</em>',\n            html_user: '<code>user</code>',\n            html_bytes: '<code>bytes</code>',\n          }\"\n          i18n-description=\"Part of composite text\n                            timelion.help.querying.paragraph2Part1 +\n                            timelion.help.querying.luceneQueryLinkText +\n                            timelion.help.querying.paragraph2Part2\"\n        ></span>\n        <a\n          href=\"https://www.elastic.co/guide/en/elasticsearch/reference/5.1/query-dsl-query-string-query.html#query-string-syntax\"\n          target=\"_blank\"\n          rel=\"noopener\"\n          i18n-id=\"timelion.help.querying.luceneQueryLinkText\"\n          i18n-default-message=\"Lucene query string\"\n          i18n-description=\"Part of composite text\n                            timelion.help.querying.paragraph2Part1 +\n                            timelion.help.querying.luceneQueryLinkText +\n                            timelion.help.querying.paragraph2Part2\"\n        ></a>\n        <span\n          i18n-id=\"timelion.help.querying.paragraph2Part2\"\n          i18n-default-message=\"as the first argument to the {esQuery} function.\"\n          i18n-values=\"{\n            html_esQuery: '<code>.es()</code>',\n          }\"\n          i18n-description=\"Part of composite text\n                            timelion.help.querying.paragraph2Part1 +\n                            timelion.help.querying.luceneQueryLinkText +\n                            timelion.help.querying.paragraph2Part2\"\n        ></span>\n      </p>\n      <h4\n        i18n-id=\"timelion.help.querying.passingArgumentsTitle\"\n        i18n-default-message=\"Passing arguments\"\n      ></h4>\n      <p\n        i18n-id=\"timelion.help.querying.passingArgumentsText\"\n        i18n-default-message=\"Timelion has a number of shortcuts that make it easy to do common things.\n                              One is that for simple arguments that don't contain spaces or special\n                              characters, you don't need to use quotes. Many functions also have defaults.\n                              For example, {esEmptyQuery} and {esStarQuery} do the same thing.\n                              Arguments also have names, so you don't have to specify them in a specific order.\n                              For example, you can enter {esLogstashQuery} to tell the Elasticsearch datasource\n                              {esIndexQueryDescription}.\"\n        i18n-values=\"{\n          html_esEmptyQuery: '<code>.es()</code>',\n          html_esStarQuery: '<code>.es(*)</code>',\n          html_esLogstashQuery: '<code>.es(index=\\'logstash-*\\', q=\\'*\\')</code>',\n          html_esIndexQueryDescription: '<em>' + translations.esIndexQueryDescription + '</em>',\n        }\"\n      ></p>\n      <h4\n        i18n-id=\"timelion.help.querying.countTitle\"\n        i18n-default-message=\"Beyond count\"\n      ></h4>\n      <p>\n        <span\n          i18n-id=\"timelion.help.querying.countTextPart1\"\n          i18n-default-message=\"Counting events is all well and good, but the Elasticsearch datasource also supports any\"\n          i18n-description=\"Part of composite text\n                            timelion.help.querying.countTextPart1 +\n                            timelion.help.querying.countMetricAggregationLinkText +\n                            timelion.help.querying.countTextPart2\"\n        ></span>\n        <a\n          href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics.html\"\n          target=\"_blank\"\n          rel=\"noopener\"\n          i18n-id=\"timelion.help.querying.countMetricAggregationLinkText\"\n          i18n-default-message=\"Elasticsearch metric aggregation\"\n          i18n-description=\"Part of composite text\n                            timelion.help.querying.countTextPart1 +\n                            timelion.help.querying.countMetricAggregationLinkText +\n                            timelion.help.querying.countTextPart2\"\n        ></a>\n        <span\n          i18n-id=\"timelion.help.querying.countTextPart2\"\n          i18n-default-message=\"that returns a single value. Some of the most useful are\n                                {min}, {max}, {avg}, {sum}, and {cardinality}.\n                                Let's say you want a unique count of the {srcIp} field.\n                                Simply use the {cardinality} metric: {esCardinalityQuery}. To get the\n                                average of the {bytes} field, you can use the {avg} metric: {esAvgQuery}.\"\n          i18n-values=\"{\n            html_min: '<code>min</code>',\n            html_max: '<code>max</code>',\n            html_avg: '<code>avg</code>',\n            html_sum: '<code>sum</code>',\n            html_cardinality: '<code>cardinality</code>',\n            html_bytes: '<code>bytes</code>',\n            html_srcIp: '<code>src_ip</code>',\n            html_esCardinalityQuery: '<code>.es(*, metric=\\'cardinality:src_ip\\')</code>',\n            html_esAvgQuery: '<code>.es(metric=\\'avg:bytes\\')</code>',\n          }\"\n          i18n-description=\"Part of composite text\n                            timelion.help.querying.countTextPart1 +\n                            timelion.help.querying.countMetricAggregationLinkText +\n                            timelion.help.querying.countTextPart2\"\n        ></span>\n      </p>\n    </div>\n    <div class=\"timHelp__buttons\">\n\n      <button\n        ng-click=\"setPage(page-1)\"\n        class=\"kuiButton kuiButton--primary\"\n      >\n        {{translations.previousButtonLabel}}\n      </button>\n\n\n      <button\n        ng-click=\"setPage(page+1)\"\n        class=\"kuiButton kuiButton--primary\"\n      >\n        {{translations.nextButtonLabel}}\n      </button>\n\n    </div>\n  </div>\n\n  <div ng-show=\"page === 4\">\n    <div>\n      <h2\n        i18n-id=\"timelion.help.expressionsTitle\"\n        i18n-default-message=\"Expressing yourself with expressions\"\n      ></h2>\n      <p\n        i18n-id=\"timelion.help.expressions.paragraph1\"\n        i18n-default-message=\"Every expression starts with a datasource function. From there, you\n                              can append new functions to the datasource to transform and augment it.\"\n      ></p>\n      <p\n        i18n-id=\"timelion.help.expressions.paragraph2\"\n        i18n-default-message=\"By the way, from here on out you probably know more about your data\n                              than we do. Feel free to replace the sample queries with something\n                              more meaningful!\"\n      ></p>\n      <p\n        i18n-id=\"timelion.help.expressions.paragraph3\"\n        i18n-default-message=\"We're going to experiment, so click {strongAdd} in the Kibana toolbar\n                              to add another chart or three. Then, select a chart,\n                              copy one of the following expressions, paste it into the input bar,\n                              and hit enter. Rinse, repeat to try out the other expressions.\"\n        i18n-values=\"{ html_strongAdd: '<strong>' + translations.strongAddText + '</strong>' }\"\n      ></p>\n      <table class=\"table table-condensed table-striped\">\n        <tr>\n          <td><code>.es(*), .es(US)</code></td>\n          <td\n            i18n-id=\"timelion.help.expressions.examples.twoExpressionsDescription\"\n            i18n-default-message=\"{descriptionTitle} Two expressions on the same chart.\"\n            i18n-values=\"{\n              html_descriptionTitle: '<strong>' + translations.twoExpressionsDescriptionTitle + '</strong>',\n            }\"\n          ></td>\n        </tr>\n        <tr>\n          <td><code>.es(*).color(#f66), .es(US).bars(1)</code></td>\n          <td\n            i18n-id=\"timelion.help.expressions.examples.customStylingDescription\"\n            i18n-default-message=\"{descriptionTitle} Colorizes the first series red and\n                                  uses 1 pixel wide bars for the second series.\"\n            i18n-values=\"{\n              html_descriptionTitle: '<strong>' + translations.customStylingDescriptionTitle + '</strong>',\n            }\"\n          ></td>\n        </tr>\n        <tr>\n          <td>\n            <code>.es(*).color(#f66).lines(fill=3),\n            .es(US).bars(1).points(radius=3, weight=1)</code>\n          </td>\n          <td\n            i18n-id=\"timelion.help.expressions.examples.namedArgumentsDescription\"\n            i18n-default-message=\"{descriptionTitle} Forget trying to remember what order you need\n                                  to specify arguments in, use named arguments to make\n                                  the expressions easier to read and write.\"\n            i18n-values=\"{\n              html_descriptionTitle: '<strong>' + translations.namedArgumentsDescriptionTitle + '</strong>',\n            }\"\n          ></td>\n        </tr>\n        <tr>\n          <td><code>(.es(*), .es(GB)).points()</code></td>\n          <td\n            i18n-id=\"timelion.help.expressions.examples.groupedExpressionsDescription\"\n            i18n-default-message=\"{descriptionTitle} You can also chain groups of expressions to\n                                  functions. Here, both series are shown as points instead of lines.\"\n            i18n-values=\"{\n              html_descriptionTitle: '<strong>' + translations.groupedExpressionsDescriptionTitle + '</strong>',\n            }\"\n          ></td>\n        </tr>\n      </table>\n      <p>\n        <span\n          i18n-id=\"timelion.help.expressions.paragraph4\"\n          i18n-default-message=\"Timelion provides additional view transformation functions you can use\n                                to customize the appearance of your charts. For the complete list, see the\"\n          i18n-description=\"Part of composite text\n                            timelion.help.expressions.paragraph4 +\n                            timelion.help.expressions.functionReferenceLinkText\"\n        ></span>\n        <a\n          ng-click=\"setPage(0)\"\n          i18n-id=\"timelion.help.expressions.functionReferenceLinkText\"\n          i18n-default-message=\"Function reference\"\n          i18n-description=\"Part of composite text\n                            timelion.help.expressions.paragraph4 +\n                            timelion.help.expressions.functionReferenceLinkText\"\n        ></a>.\n      </p>\n    </div>\n    <div class=\"timHelp__buttons\">\n\n      <button\n        ng-click=\"setPage(page-1)\"\n        class=\"kuiButton kuiButton--primary\"\n      >\n        {{translations.previousButtonLabel}}\n      </button>\n\n\n      <button\n        ng-click=\"setPage(page+1)\"\n        class=\"kuiButton kuiButton--primary\"\n      >\n        {{translations.nextButtonLabel}}\n      </button>\n\n    </div>\n  </div>\n  <div ng-show=\"page === 5\">\n    <div>\n      <h2\n        i18n-id=\"timelion.help.dataTransformingTitle\"\n        i18n-default-message=\"Transforming your data: the real fun begins!\"\n      ></h2>\n      <p\n        i18n-id=\"timelion.help.dataTransforming.paragraph1\"\n        i18n-default-message=\"Now that you've mastered the basics, it's time to unleash the power of\n                              Timelion. Let's figure out what percentage some subset of our data\n                              represents of the whole, over time. For example, what percentage of\n                              our web traffic comes from the US?\"\n      ></p>\n      <p\n        i18n-id=\"timelion.help.dataTransforming.paragraph2\"\n        i18n-default-message=\"First, we need to find all events that contain US: {esUsQuery}.\"\n        i18n-values=\"{ html_esUsQuery: '<code>.es(\\'US\\')</code>' }\"\n      ></p>\n      <p\n        i18n-id=\"timelion.help.dataTransforming.paragraph3\"\n        i18n-default-message=\"Next, we want to calculate the ratio of US events to the whole.\n                              To divide {us} by everything, we can use the {divide} function:\n                              {divideDataQuery}.\"\n        i18n-values=\"{\n          html_us: '<code>\\'US\\'</code>',\n          html_divide: '<code>divide</code>',\n          html_divideDataQuery: '<code>.es(\\'US\\').divide(.es())</code>',\n        }\"\n      ></p>\n      <p\n        i18n-id=\"timelion.help.dataTransforming.paragraph4\"\n        i18n-default-message=\"Not bad, but this gives us a number between 0 and 1. To convert it\n                              to a percentage, simply multiply by 100: {multiplyDataQuery}.\"\n        i18n-values=\"{ html_multiplyDataQuery: '<code>.es(\\'US\\').divide(.es()).multiply(100)</code>' }\"\n      ></p>\n      <p\n        i18n-id=\"timelion.help.dataTransforming.paragraph5\"\n        i18n-default-message=\"Now we know what percentage of our traffic comes from the US, and\n                              can see how it has changed over time! Timelion has a number of\n                              built-in arithmetic functions, such as {sum}, {subtract}, {multiply},\n                              and {divide}. Many of these can take a series or a number. There are\n                              also other useful data transformation functions, such as\n                              {movingaverage}, {abs}, and {derivative}.\"\n        i18n-values=\"{\n          html_sum: '<code>sum</code>',\n          html_subtract: '<code>subtract</code>',\n          html_multiply: '<code>multiply</code>',\n          html_divide: '<code>divide</code>',\n          html_movingaverage: '<code>movingaverage</code>',\n          html_abs: '<code>abs</code>',\n          html_derivative: '<code>derivative</code>',\n        }\"\n      ></p>\n      <p>\n        <span\n          i18n-id=\"timelion.help.dataTransforming.paragraph6Part1\"\n          i18n-default-message=\"Now that you're familiar with the syntax, refer to the\"\n          i18n-description=\"Part of composite text\n                            timelion.help.dataTransforming.paragraph6Part1 +\n                            timelion.help.dataTransforming.functionReferenceLinkText +\n                            timelion.help.dataTransforming.paragraph6Part2\"\n        ></span>\n        <a\n          ng-click=\"setPage(0)\"\n          i18n-id=\"timelion.help.dataTransforming.functionReferenceLinkText\"\n          i18n-default-message=\"Function reference\"\n          i18n-description=\"Part of composite text\n                            timelion.help.dataTransforming.paragraph6Part1 +\n                            timelion.help.dataTransforming.functionReferenceLinkText +\n                            timelion.help.dataTransforming.paragraph6Part2\"\n        ></a>\n        <span\n          i18n-id=\"timelion.help.dataTransforming.paragraph6Part2\"\n          i18n-default-message=\"to see how to use all of the available Timelion functions.\n                                You can view the reference at any time by clicking \\{Docs\\}\n                                in the Kibana toolbar. To get back to this tutorial, click the\n                                \\{Tutorial\\} link at the top of the reference.\"\n          i18n-description=\"Part of composite text\n                            timelion.help.dataTransforming.paragraph6Part1 +\n                            timelion.help.dataTransforming.functionReferenceLinkText +\n                            timelion.help.dataTransforming.paragraph6Part2\"\n        ></span>\n      </p>\n    </div>\n    <div class=\"timHelp__buttons\">\n\n      <button\n        ng-click=\"setPage(page-1)\"\n        class=\"kuiButton kuiButton--primary\"\n      >\n        {{translations.previousButtonLabel}}\n      </button>\n\n\n\n      <button\n        ng-click=\"opts.dontShowHelp()\"\n        class=\"kuiButton kuiButton--hollow\"\n      >\n        {{translations.dontShowHelpButtonLabel}}\n      </button>\n\n    </div>\n  </div>\n</div>\n<div ng-show=\"page === 0\">\n  <h2\n    class=\"kuiLocalDropdownTitle\"\n    i18n-id=\"timelion.help.mainPageTitle\"\n    i18n-default-message=\"Help\"\n  ></h2>\n\n  <tabset>\n    <tab heading=\"{{ ::'timelion.help.mainPage.functionReferenceTitle' | i18n: { defaultMessage: 'Function reference' } }}\">\n      <div class=\"list-group-item list-group-item--noBorder\">\n        <div class=\"kuiLocalDropdownHelpText\">\n          <span\n            i18n-id=\"timelion.help.mainPage.functionReference.gettingStartedText\"\n            i18n-default-message=\"Click any function for more information. Just getting started?\"\n          ></span>\n          <a\n            i18n-id=\"timelion.help.mainPage.functionReference.welcomePageLinkText\"\n            i18n-default-message=\"Check out the tutorial\"\n            class=\"kuiLink\"\n            ng-click=\"setPage(1)\"\n            kbn-accessible-click\n          ></a>.\n        </div>\n\n        <div class=\"timHelp__functions\">\n          <table class=\"table table-condensed table-bordered\">\n            <tr\n              class=\"timHelp__functionsTableRow\"\n              ng-repeat-start=\"function in functions.list\"\n              ng-class=\"{active: functions.details === function.name}\"\n              ng-click=\"functions.details =\n                        (functions.details === function.name ?\n                          null : function.name)\"\n              kbn-accessible-click\n            >\n              <td><strong>.{{function.name}}()</strong></td>\n              <td>{{function.help}}</td>\n            </tr>\n            <tr ng-if=\"functions.details === function.name\" ng-repeat-end>\n              <td colspan=2>\n                <div class=\"suggestion-details\" >\n                  <table\n                    class=\"table table-condensed table-bordered\n                           timHelp__functionDetailsTable\"\n                    ng-show=\"function.args.length > (function.chainable ? 1: 0)\"\n                  >\n                    <thead>\n                      <th\n                        scope=\"col\"\n                        i18n-id=\"timelion.help.mainPage.functionReference.detailsTable.argumentNameColumnLabel\"\n                        i18n-default-message=\"Argument Name\"\n                      ></th>\n                      <th\n                        scope=\"col\"\n                        i18n-id=\"timelion.help.mainPage.functionReference.detailsTable.acceptedTypesColumnLabel\"\n                        i18n-default-message=\"Accepted Types\"\n                      ></th>\n                      <th\n                        scope=\"col\"\n                        i18n-id=\"timelion.help.mainPage.functionReference.detailsTable.informationColumnLabel\"\n                        i18n-default-message=\"Information\"\n                      ></th>\n                    </thead>\n                    <tr\n                      ng-repeat=\"arg in function.args\"\n                      ng-hide=\"$index < 1 && function.chainable\"\n                    >\n                      <td>{{arg.name}}</td>\n                      <td><em>{{arg.types.join(', ')}}</em></td>\n                      <td>{{arg.help}}</td>\n                    </tr>\n                  </table>\n                  <div ng-hide=\"function.args.length > (function.chainable ? 1: 0)\">\n                    <em\n                      i18n-id=\"timelion.help.mainPage.functionReference.noArgumentsFunctionErrorMessage\"\n                      i18n-default-message=\"This function does not accept any arguments. Well that's simple, isn't it?\"\n                    ></em>\n                  </div>\n                </div>\n              </td>\n            </tr>\n          </table>\n        </div>\n      </div>\n    </tab>\n\n    <tab heading=\"{{ ::'timelion.help.mainPage.keyboardTipsTitle' | i18n: { defaultMessage: 'Keyboard tips' } }}\">\n      <div class=\"list-group-item list-group-item--noBorder\">\n        <!-- General editing tips -->\n        <dl class=\"dl-horizontal\">\n          <dd>\n            <strong\n              i18n-id=\"timelion.help.mainPage.keyboardTips.generalEditingTitle\"\n              i18n-default-message=\"General editing\"\n            ></strong></dd>\n          <dt></dt>\n          <dt>Ctrl/Cmd + Enter</dt>\n          <dd\n            i18n-id=\"timelion.help.mainPage.keyboardTips.generalEditing.submitRequestText\"\n            i18n-default-message=\"Submit request\"\n          ></dd>\n        </dl>\n\n        <!-- Auto complete tips -->\n        <dl class=\"dl-horizontal\">\n          <dt></dt>\n          <dd>\n            <strong\n              i18n-id=\"timelion.help.mainPage.keyboardTips.autoCompleteTitle\"\n              i18n-default-message=\"When auto-complete is visible\"\n            ></strong>\n          </dd>\n          <dt\n            i18n-id=\"timelion.help.mainPage.keyboardTips.autoComplete.downArrowLabel\"\n            i18n-default-message=\"Down arrow\"\n          ></dt>\n          <dd\n            i18n-id=\"timelion.help.mainPage.keyboardTips.autoComplete.downArrowDescription\"\n            i18n-default-message=\"Switch focus to auto-complete menu. Use arrows to further select a term\"\n          ></dd>\n          <dt>Enter/Tab</dt>\n          <dd\n            i18n-id=\"timelion.help.mainPage.keyboardTips.autoComplete.enterTabDescription\"\n            i18n-default-message=\"Select the currently selected or the top most term in auto-complete menu\"\n          ></dd>\n          <dt>Esc</dt>\n          <dd\n            i18n-id=\"timelion.help.mainPage.keyboardTips.autoComplete.escDescription\"\n            i18n-default-message=\"Close auto-complete menu\"\n          ></dd>\n        </dl>\n      </div>\n    </tab>\n  </tabset>\n</div>\n"

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/directives/timelion_help/timelion_help.js":
/*!*******************************************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/directives/timelion_help/timelion_help.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _timelion_help = __webpack_require__(/*! ./timelion_help.html */ "./src/legacy/core_plugins/timelion/public/directives/timelion_help/timelion_help.html");

var _timelion_help2 = _interopRequireDefault(_timelion_help);

var _modules = __webpack_require__(/*! ui/modules */ "./src/ui/public/modules.js");

var _lodash = __webpack_require__(/*! lodash */ "./node_modules/lodash/index.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = __webpack_require__(/*! moment */ "./webpackShims/moment.js");

var _moment2 = _interopRequireDefault(_moment);

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

var app = _modules.uiModules.get('apps/timelion', []);

app.directive('timelionHelp', function ($http, i18n) {
  return {
    restrict: 'E',
    template: _timelion_help2.default,
    controller: function controller($scope) {
      $scope.functions = {
        list: [],
        details: null
      };

      function init() {
        $scope.es = {
          invalidCount: 0
        };

        $scope.translations = {
          nextButtonLabel: i18n('timelion.help.nextPageButtonLabel', {
            defaultMessage: 'Next'
          }),
          previousButtonLabel: i18n('timelion.help.previousPageButtonLabel', {
            defaultMessage: 'Previous'
          }),
          dontShowHelpButtonLabel: i18n('timelion.help.dontShowHelpButtonLabel', {
            defaultMessage: 'Don\'t show this again'
          }),
          strongNextText: i18n('timelion.help.welcome.content.strongNextText', {
            defaultMessage: 'Next'
          }),
          emphasizedEverythingText: i18n('timelion.help.welcome.content.emphasizedEverythingText', {
            defaultMessage: 'everything'
          }),
          notValidAdvancedSettingsPath: i18n('timelion.help.configuration.notValid.advancedSettingsPathText', {
            defaultMessage: 'Management / Kibana / Advanced Settings'
          }),
          validAdvancedSettingsPath: i18n('timelion.help.configuration.valid.advancedSettingsPathText', {
            defaultMessage: 'Management/Kibana/Advanced Settings'
          }),
          esAsteriskQueryDescription: i18n('timelion.help.querying.esAsteriskQueryDescriptionText', {
            defaultMessage: 'hey Elasticsearch, find everything in my default index'
          }),
          esIndexQueryDescription: i18n('timelion.help.querying.esIndexQueryDescriptionText', {
            defaultMessage: 'use * as the q (query) for the logstash-* index'
          }),
          strongAddText: i18n('timelion.help.expressions.strongAddText', {
            defaultMessage: 'Add'
          }),
          twoExpressionsDescriptionTitle: i18n('timelion.help.expressions.examples.twoExpressionsDescriptionTitle', {
            defaultMessage: 'Double the fun.'
          }),
          customStylingDescriptionTitle: i18n('timelion.help.expressions.examples.customStylingDescriptionTitle', {
            defaultMessage: 'Custom styling.'
          }),
          namedArgumentsDescriptionTitle: i18n('timelion.help.expressions.examples.namedArgumentsDescriptionTitle', {
            defaultMessage: 'Named arguments.'
          }),
          groupedExpressionsDescriptionTitle: i18n('timelion.help.expressions.examples.groupedExpressionsDescriptionTitle', {
            defaultMessage: 'Grouped expressions.'
          })
        };

        getFunctions();
        checkElasticsearch();
      }

      function getFunctions() {
        return $http.get('../api/timelion/functions').then(function (resp) {
          $scope.functions.list = resp.data;
        });
      }
      $scope.recheckElasticsearch = function () {
        $scope.es.valid = null;
        checkElasticsearch().then(function (valid) {
          if (!valid) $scope.es.invalidCount++;
        });
      };

      function checkElasticsearch() {
        return $http.get('../api/timelion/validate/es').then(function (resp) {
          if (resp.data.ok) {

            $scope.es.valid = true;
            $scope.es.stats = {
              min: (0, _moment2.default)(resp.data.min).format('LLL'),
              max: (0, _moment2.default)(resp.data.max).format('LLL'),
              field: resp.data.field
            };
          } else {
            $scope.es.valid = false;
            $scope.es.invalidReason = function () {
              try {
                var esResp = JSON.parse(resp.data.resp.response);
                return _lodash2.default.get(esResp, 'error.root_cause[0].reason');
              } catch (e) {
                if (_lodash2.default.get(resp, 'data.resp.message')) return _lodash2.default.get(resp, 'data.resp.message');
                if (_lodash2.default.get(resp, 'data.resp.output.payload.message')) return _lodash2.default.get(resp, 'data.resp.output.payload.message');
                return i18n('timelion.help.unknownErrorMessage', { defaultMessage: 'Unknown error' });
              }
            }();
          }
          return $scope.es.valid;
        });
      }
      init();
    }
  };
});

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/index.html":
/*!************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/index.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"timApp app-container\" ng-controller=\"timelion\">\n  <!-- Local nav. -->\n  <kbn-top-nav name=\"timelion\" config=\"topNavMenu\">\n    <!-- Transcluded elements. -->\n    <div data-transclude-slots>\n      <div data-transclude-slot=\"topLeftCorner\">\n        <span class=\"kuiLocalTitle\" ng-show=\"opts.savedSheet.id\">\n          {{opts.savedSheet.lastSavedTitle}}\n          &nbsp;\n          <span class=\"fa fa-bolt\" ng-click=\"showStats = !showStats\"></span>\n          &nbsp;\n          <span class=\"timApp__stats\" ng-show=\"showStats\">\n            <span\n              i18n-id=\"timelion.topNavMenu.statsDescription\"\n              i18n-default-message=\"Query Time {queryTime}ms / Processing Time {processingTime}ms\"\n              i18n-values=\"{\n                queryTime: stats.queryTime - stats.invokeTime,\n                processingTime: stats.sheetTime - stats.queryTime,\n              }\"></span>\n          </span>\n        </span>\n      </div>\n    </div>\n  </kbn-top-nav>\n\n  <div class=\"timApp__container\">\n    <div>\n      <!-- Search. -->\n      <form\n        role=\"form\"\n        ng-submit=\"search()\"\n        class=\"kuiFieldGroup kuiFieldGroup--alignTop kuiVerticalRhythm\"\n      >\n        <div class=\"kuiFieldGroupSection kuiFieldGroupSection--wide\">\n          <timelion-expression-input\n            sheet=\"state.sheet[state.selected]\"\n            rows=\"1\"\n            update-chart=\"search()\"\n            should-popover-suggestions=\"true\"\n          ></timelion-expression-input>\n        </div>\n\n        <div class=\"kuiFieldGroupSection\">\n          <timelion-interval\n            class=\"kuiVerticalRhythmSmall\"\n            model=\"state.interval\"\n          ></timelion-interval>\n\n          <button\n            type=\"submit\"\n            aria-label=\"{{ ::'timelion.search.submitAriaLabel' | i18n: { defaultMessage: 'Search' } }}\"\n            class=\"kuiButton kuiButton--primary fullWidth kuiVerticalRhythmSmall\"\n          >\n            <span aria-hidden=\"true\" class=\"kuiButton__icon kuiIcon fa-play\"></span>\n          </button>\n        </div>\n      </form>\n\n      <div class=\"kuiVerticalRhythm\">\n        <timelion-fullscreen\n          ng-show=\"transient.fullscreen\"\n          transient=\"transient\"\n          state=\"state\"\n          series=\"sheet[state.selected]\"\n          expression=\"state.sheet[state.selected]\"\n          on-search=\"search\"\n        ></timelion-fullscreen>\n\n        <timelion-cells\n          ng-show=\"!transient.fullscreen\"\n          transient=\"transient\"\n          state=\"state\"\n          sheet=\"sheet\"\n          on-search=\"search\"\n          on-select=\"setActiveCell\"\n        ></timelion-cells>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/partials/load_sheet.html":
/*!**************************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/partials/load_sheet.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form role=\"form\" ng-submit=\"fetch()\">\n  <h2\n    class=\"kuiLocalDropdownTitle\"\n    i18n-id=\"timelion.topNavMenu.openSheetTitle\"\n    i18n-default-message=\"Open Sheet\"\n  ></h2>\n\n  <saved-object-finder\n    type=\"timelion-sheet\"\n    use-local-management=\"true\"\n  ></saved-object-finder>\n</form>\n"

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/partials/save_sheet.html":
/*!**************************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/partials/save_sheet.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"list-group\">\n  <button class=\"list-group-item\" ng-click=\"section = 'sheet'\" type=\"button\">\n    <h4\n      class=\"list-group-item-heading\"\n      i18n-id=\"timelion.topNavMenu.save.saveEntireSheetTitle\"\n      i18n-default-message=\"Save entire Timelion sheet\"\n    ></h4>\n    <p\n      class=\"list-group-item-text\"\n      i18n-id=\"timelion.topNavMenu.save.saveEntireSheetDescription\"\n      i18n-default-message=\"You want this option if you mostly use Timelion expressions from within\n                            the Timelion app and don't need to add Timelion charts to Kibana\n                            dashboards. You may also want this if you make use of references to\n                            other panels.\"\n    ></p>\n  </button>\n\n  <div class=\"list-group-item\" ng-show=\"section == 'sheet'\">\n    <form role=\"form\" class=\"container-fluid\" ng-submit=\"opts.saveSheet()\">\n      <label\n        for=\"savedSheet\"\n        class=\"kuiLabel kuiVerticalRhythmSmall\"\n        i18n-id=\"timelion.topNavMenu.save.saveEntireSheetLabel\"\n        i18n-default-message=\"Save sheet as\"\n      ></label>\n\n      <input\n        id=\"savedSheet\"\n        ng-model=\"opts.savedSheet.title\"\n        input-focus=\"select\"\n        class=\"form-control kuiVerticalRhythmSmall\"\n        placeholder=\"{{ ::'timelion.topNavMenu.save.saveEntireSheet.inputPlaceholder' | i18n: { defaultMessage: 'Name this sheet...' } }}\"\n        aria-label=\"{{ ::'timelion.topNavMenu.save.saveEntireSheet.inputAriaLabel' | i18n: { defaultMessage: 'Name' } }}\"\n      >\n\n      <saved-object-save-as-check-box\n        class=\"kuiVerticalRhythmSmall\"\n        saved-object=\"opts.savedSheet\"\n      ></saved-object-save-as-check-box>\n\n      <button\n        ng-disabled=\"!opts.savedSheet.title\"\n        type=\"submit\"\n        class=\"kuiButton kuiButton--primary kuiVerticalRhythmSmall\"\n        i18n-id=\"timelion.topNavMenu.save.saveEntireSheet.submitButtonLabel\"\n        i18n-default-message=\"Save\"\n      ></button>\n    </form>\n  </div>\n\n  <button class=\"list-group-item\" ng-click=\"section = 'expression'\" type=\"button\">\n    <h4\n      class=\"list-group-item-heading\"\n      i18n-id=\"timelion.topNavMenu.save.saveAsDashboardPanelTitle\"\n      i18n-default-message=\"Save current expression as Kibana dashboard panel\"\n    ></h4>\n    <p\n      class=\"list-group-item-text\"\n      i18n-id=\"timelion.topNavMenu.save.saveAsDashboardPanelDescription\"\n      i18n-default-message=\"Need to add a chart to a Kibana dashboard? We can do that! This option\n                            will save your currently selected expression as a panel that can be\n                            added to Kibana dashboards as you would add anything else. Note, if you\n                            use references to other panels you will need to remove the refences by\n                            copying the referenced expression directly into the expression you are\n                            saving. Click a chart to select a different expression to save.\"\n    ></p>\n  </button>\n\n  <div class=\"list-group-item\" ng-show=\"section == 'expression'\">\n    <form role=\"form\" class=\"container-fluid\" ng-submit=\"opts.saveExpression(panelTitle)\">\n      <div class=\"form-group\">\n        <label\n          class=\"control-label\"\n          i18n-id=\"timelion.topNavMenu.save.saveAsDashboardPanel.selectedExpressionLabel\"\n          i18n-default-message=\"Currently selected expression\"\n        ></label>\n        <code>{{opts.state.sheet[opts.state.selected]}}</code>\n      </div>\n      <div class=\"form-group\">\n        <label\n          for=\"savedExpression\"\n          class=\"control-label\"\n          i18n-id=\"timelion.topNavMenu.save.saveAsDashboardPanelLabel\"\n          i18n-default-message=\"Save expression as\"\n        ></label>\n        <input\n          id=\"savedExpression\"\n          ng-model=\"panelTitle\"\n          input-focus=\"select\"\n          class=\"form-control\"\n          placeholder=\"{{ ::'timelion.topNavMenu.save.saveAsDashboardPanel.inputPlaceholder' | i18n: { defaultMessage: 'Name this panel' } }}\"\n        >\n      </div>\n      <div class=\"form-group\">\n        <button\n          ng-disabled=\"!panelTitle\"\n          type=\"submit\"\n          class=\"kuiButton kuiButton--primary\"\n          i18n-id=\"timelion.topNavMenu.save.saveAsDashboardPanel.submitButtonLabel\"\n          i18n-default-message=\"Save\"\n        ></button>\n      </div>\n    </form>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/partials/sheet_options.html":
/*!*****************************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/partials/sheet_options.html ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form role=\"form\">\n  <h2\n    class=\"kuiLocalDropdownTitle\"\n    i18n-id=\"timelion.topNavMenu.sheetOptionsTitle\"\n    i18n-default-message=\"Sheet options\"\n  ></h2>\n\n  <div>\n    <div class=\"form-group col-md-6\">\n      <label\n        for=\"timelionColCount\"\n        i18n-id=\"timelion.topNavMenu.options.columnsCountLabel\"\n        i18n-default-message=\"Columns (Column count must divide evenly into 12)\"\n      ></label>\n      <select class=\"form-control\"\n        id=\"timelionColCount\"\n        ng-change=\"opts.search()\"\n        ng-options=\"column for column in [1, 2, 3, 4, 6, 12]\"\n        ng-model=\"opts.state.columns\">\n      </select>\n    </div>\n    <div class=\"form-group col-md-6\">\n      <label\n        for=\"timelionRowCount\"\n        i18n-id=\"timelion.topNavMenu.options.rowsCountLabel\"\n        i18n-default-message=\"Rows (This is a target based on the current window height)\"\n      ></label>\n      <select class=\"form-control\"\n        id=\"timelionRowCount\"\n        ng-change=\"opts.search()\"\n        ng-options=\"row for row in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]\"\n        ng-model=\"opts.state.rows\">\n      </select>\n    </div>\n  </div>\n</form>\n"

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/services/_saved_sheet.js":
/*!**************************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/services/_saved_sheet.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _modules = __webpack_require__(/*! ui/modules */ "./src/ui/public/modules.js");

var _legacy_class = __webpack_require__(/*! ui/utils/legacy_class */ "./src/ui/public/utils/legacy_class.js");

var _courier = __webpack_require__(/*! ui/courier */ "./src/ui/public/courier/index.js");

var _module = _modules.uiModules.get('app/timelion');

// Used only by the savedSheets service, usually no reason to change this
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

_module.factory('SavedSheet', function (Private, config) {

  // SavedSheet constructor. Usually you'd interact with an instance of this.
  // ID is option, without it one will be generated on save.
  var SavedObject = Private(_courier.SavedObjectProvider);
  (0, _legacy_class.createLegacyClass)(SavedSheet).inherits(SavedObject);
  function SavedSheet(id) {
    // Gives our SavedSheet the properties of a SavedObject
    SavedObject.call(this, {
      type: SavedSheet.type,
      mapping: SavedSheet.mapping,

      // if this is null/undefined then the SavedObject will be assigned the defaults
      id: id,

      // default values that will get assigned if the doc is new
      defaults: {
        title: 'New TimeLion Sheet',
        hits: 0,
        description: '',
        timelion_sheet: ['.es(*)'],
        timelion_interval: 'auto',
        timelion_chart_height: 275,
        timelion_columns: config.get('timelion:default_columns') || 2,
        timelion_rows: config.get('timelion:default_rows') || 2,
        version: 1
      }
    });

    this.showInRecentlyAccessed = true;
  }

  // save these objects with the 'sheet' type
  SavedSheet.type = 'timelion-sheet';

  // if type:sheet has no mapping, we push this mapping into ES
  SavedSheet.mapping = {
    title: 'text',
    hits: 'integer',
    description: 'text',
    timelion_sheet: 'text',
    timelion_interval: 'keyword',
    timelion_other_interval: 'keyword',
    timelion_chart_height: 'integer',
    timelion_columns: 'integer',
    timelion_rows: 'integer',
    version: 'integer'
  };

  // Order these fields to the top, the rest are alphabetical
  SavedSheet.fieldOrder = ['title', 'description'];

  SavedSheet.prototype.getFullPath = function () {
    return '/app/timelion#/' + this.id;
  };

  return SavedSheet;
});

/***/ }),

/***/ "./src/legacy/core_plugins/timelion/public/services/saved_sheet_register.js":
/*!**********************************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/services/saved_sheet_register.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = savedSearchObjectFn;

__webpack_require__(/*! ./saved_sheets */ "./src/legacy/core_plugins/timelion/public/services/saved_sheets.js");

function savedSearchObjectFn(savedSheets) {
  return savedSheets;
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

/***/ "./src/legacy/core_plugins/timelion/public/services/saved_sheets.js":
/*!**************************************************************************!*\
  !*** ./src/legacy/core_plugins/timelion/public/services/saved_sheets.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _saved_object_loader = __webpack_require__(/*! ui/courier/saved_object/saved_object_loader */ "./src/ui/public/courier/saved_object/saved_object_loader.js");

var _saved_object_registry = __webpack_require__(/*! plugins/kibana/management/saved_object_registry */ "./src/legacy/core_plugins/kibana/public/management/saved_object_registry.js");

var _saved_objects = __webpack_require__(/*! ui/saved_objects */ "./src/ui/public/saved_objects/index.js");

var _modules = __webpack_require__(/*! ui/modules */ "./src/ui/public/modules.js");

__webpack_require__(/*! ./_saved_sheet.js */ "./src/legacy/core_plugins/timelion/public/services/_saved_sheet.js");

var _module = _modules.uiModules.get('app/sheet');

// Register this service with the saved object registry so it can be
// edited by the object editor.
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

_saved_object_registry.savedObjectManagementRegistry.register({
  service: 'savedSheets',
  title: 'sheets'
});

// This is the only thing that gets injected into controllers
_module.service('savedSheets', function (Private, Promise, SavedSheet, kbnIndex, kbnUrl, $http, chrome) {
  var savedObjectClient = Private(_saved_objects.SavedObjectsClientProvider);
  var savedSheetLoader = new _saved_object_loader.SavedObjectLoader(SavedSheet, kbnIndex, kbnUrl, $http, chrome, savedObjectClient);
  savedSheetLoader.urlFor = function (id) {
    return kbnUrl.eval('#/{{id}}', { id: id });
  };

  // Customize loader properties since adding an 's' on type doesn't work for type 'timelion-sheet'.
  savedSheetLoader.loaderProperties = {
    name: 'timelion-sheet',
    noun: 'Saved Sheets',
    nouns: 'saved sheets'
  };
  return savedSheetLoader;
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
//# sourceMappingURL=timelion.bundle.js.map