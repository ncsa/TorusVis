
/**
 * @defgroup torusvis_misc_version version
 * @brief torusvis version object
 * @ingroup torusvis_misc
 *
 * @{
 */

"use strict";

function VersionObject(array) {

 *
 * Parameters:
 *     major - (*number*) major version number
 *     minor - (*number*) minor version number
 *     micro - (*number*) micro version number
 *     string - (*String*) version string (as in array.join('.'))
 */


    /**
     * @var Number[] array
     * @brief array of version number components
     * contains the version number components in the form [major, minor, micro]
     */
    this.array  = array;

    /**
     * @var Number major
     * @brief major version number
     */
    this.major  = array[0];

    /**
     * @var Number minor
     * @brief minor version number
     */
    this.minor  = array[1];

    /**
     * @var Number micro
     * @brief micro version number
     */
    this.micro  = array[2];

    /**
     * @var Number string
     * @brief version string
     * equivalent to
     *
     *     array.join('.')
     */
    this.string = array.join(".");
}

/** @} */

VersionObject.prototype.toString = function toString() {
    return this.string;
};

module.exports = new VersionObject([0, 1, 0]);

