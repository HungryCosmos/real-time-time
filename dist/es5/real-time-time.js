'use strict';

String.prototype.formatUnicorn = require('./lib/stackoverflow/format-unicorn');

var domPrinter = require('./lib/local/dom-printer');
var mergeJson = require('merge-json');

/**
 * Default fall-back arguments for {@link init} in case user would need it
 */
var defaults = require('./cfg/defaults.js');
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