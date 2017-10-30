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