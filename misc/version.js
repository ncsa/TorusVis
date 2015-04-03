
/*
 * Module: version
 *
 * torusvis version object
 *
 * Parameters:
 *     major - (*number*) major version number
 *     minor - (*number*) minor version number
 *     micro - (*number*) micro version number
 *     array - (*array*) array of version numbers (as in [major, minor, micro])
 *     string - (*String*) version string (as in array.join('.'))
 */

"use strict";

function VersionObject(array) {
    this.array  = array;
    this.major  = array[0];
    this.minor  = array[1];
    this.micro  = array[2];
    this.string = array.join(".");
}

VersionObject.prototype.toString = function toString() {
    return this.string;
};

module.exports = new VersionObject([0, 1, 0]);

