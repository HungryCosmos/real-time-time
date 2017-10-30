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