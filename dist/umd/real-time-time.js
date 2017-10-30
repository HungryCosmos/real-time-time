(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["RealtimeTime"] = factory();
	else
		root["RealtimeTime"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


String.prototype.formatUnicorn = __webpack_require__(1);

var domPrinter = __webpack_require__(2);
var mergeJson = __webpack_require__(3);

/**
 * Default fall-back arguments for {@link init} in case user would need it
 */
var defaults = __webpack_require__(4);
var config;

/**
 * After this script initializes {@link setInterval} with config, it will be exported here so
 * user is able to cancel it any moment.
 */
var loop;

/**
 * Writes value calculated with eztz to configured HTML DOM element (if present)
 * using {@link domPrinter.writeIntoDomElement}
 */
function showCurrentTime() {

    // Formatting time string, which will replace {time} in template
    var remoteTime = eztz.get(config.remoteTimezoneOffsetHours);
    var time = remoteTime.toLocaleString(config.timeFormat.locales, config.timeFormat.options);

    // Formatting time zone difference string, which will replace {diff} in template
    var diffHours = eztz.diff(remoteTime, new Date());
    var diffTxt = diffHours == 0 ? config.diffFormat.noDiffTxt : config.diffFormat.diffTxt.formatUnicorn({
        h: Math.abs(diffHours),
        course: diffHours > 0 ? config.diffFormat.course.ahead : config.diffFormat.course.behind
    });
    var diff = config.diffFormat.wrapper.formatUnicorn({ diffTxt: diffTxt });

    domPrinter.writeIntoDomElement(config.timeDisplayFormat.formatUnicorn({ time: time, diff: diff }), config.domElement);
}

/**
 * Interrupts previous {@link loop} and starts new one
 */
function startLoop() {
    destroyLoop();
    loop = setInterval(showCurrentTime, config.intervalDelayMillis);
}

/**
 * Breaks {@link loop} with {@link window#clearInterval}
 */
function destroyLoop() {
    if (!!loop) {
        window.clearInterval(loop);
        loop = null;
    }
}

/**
 * Reads config object provided by user and starts periodic task with {@link setInterval} which
 * periodically prints time. Output format, frequency, target and timezone are read from {@link config}.
 * Time in remote timezone obtained with eztz {@see https://www.npmjs.com/package/eztz}
 * @param pref optional object (default is {@link defaults}). Some of the fields are listed below:
 *   remoteTimezoneOffsetHours - offset (in hours) of remote timezone relative to UTC.
 *   domElement - HTML DOM element to write output to.
 *   intervalDelayMillis - {@link setInterval} delay in milliseconds.
 *   timeDisplayFormat - {@link formatUnicorn} template
 * See README.md or {@link defaults} for more info
 */
function init(pref) {
    config = mergeJson.merge(defaults, pref);
    showCurrentTime();
    startLoop();
}

module.exports = {
    init: init,
    start: startLoop,
    destroy: destroyLoop
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Stack Overflow actually has their own formatting function for the String prototype
 * called formatUnicorn. You can use objects, arrays, and strings as arguments! I got
 * its code and reworked it to produce a new version of String.prototype.format
 *
 * Note the clever Array.prototype.slice.call(arguments) call -- that means if you throw
 * in arguments that are strings or numbers, not a single JSON-style object, you get C#'s
 * String.Format behavior almost exactly.
 * "a{0}bcd{1}ef".formatUnicorn("foo", "bar"); // yields "aFOObcdBARef"
 * That's because Array's slice will force whatever's in arguments into an Array, whether
 * it was originally or not, and the key will be the index (0, 1, 2...) of each array element
 * coerced into a string (eg, "0", so "\\{0\\}" for your first regexp pattern).
 *
 *
 * @See community wiki question and answer https://stackoverflow.com/a/18234317/8722066
 *
 * Contribution licensed under cc by-sa 3.0 (https://creativecommons.org/licenses/by-sa/3.0/) with attribution required.
 */

function formatUnicorn() {
    "use strict";

    var str = this.toString();
    if (arguments.length) {
        var t = _typeof(arguments[0]);
        var key;
        var args = "string" === t || "number" === t ? Array.prototype.slice.call(arguments) : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
}

module.exports = formatUnicorn;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Attempts to write specified text into provided HTML DOM element (if present)
 * @param domElement HTML DOM element to write output to. Default is console.
 * @param text data to write
 */
function writeIntoDomElement(text, domElement) {
    if (domElement) {
        domElement.innerHTML = text;
    } else {
        console.log(text);
    }
}

module.exports = {
    writeIntoDomElement: writeIntoDomElement
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// JSON Konstruktor für die Überprüfung ob ein Objekt JSON ist
var jsonC = {}.constructor;

var isJSON = function isJSON(json) {
	if (json && json.constructor === jsonC) {
		return true;
	} else {
		return false;
	}
};

exports.isJSON = isJSON;

var mergeJSON = function mergeJSON(json1, json2) {
	var result = null;
	if (isJSON(json2)) {
		result = {};
		if (isJSON(json1)) {
			for (var key in json1) {
				result[key] = json1[key];
			}
		}

		for (var key in json2) {
			if (_typeof(result[key]) === "object" && (typeof json2 === "undefined" ? "undefined" : _typeof(json2)) === "object") {
				result[key] = mergeJSON(result[key], json2[key]);
			} else {
				result[key] = json2[key];
			}
		}
	} else if (Array.isArray(json1) && Array.isArray(json2)) {
		result = json1;

		for (var i = 0; i < json2.length; i++) {
			if (result.indexOf(json2[i]) === -1) {
				result[result.length] = json2[i];
			}
		}
	} else {
		result = json2;
	}

	return result;
};

exports.merge = mergeJSON;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DEFAULTS = {
    domElement: null,
    remoteTimezoneOffsetHours: 0,
    intervalDelayMillis: 500,
    timeDisplayFormat: "It's {time} there{diff}",
    timeFormat: {
        locales: "en-US",
        options: {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true
        }
    },
    diffFormat: {
        wrapper: " ({diffTxt})",
        noDiffTxt: "my timezone PogChamp",
        diffTxt: "{h}h {course} btw",
        course: {
            ahead: "ahead",
            behind: "behind"
        }
    }
};

module.exports = DEFAULTS;

/***/ })
/******/ ]);
});