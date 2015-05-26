
/** @file */

"use strict";

/**
 * @struct version
 * @brief torusvis version object
 * @details torusvis version object
 * @note this documentation is for a plain javascript object constant.  It is
 * documented as a struct with member functions because doxygen cannot handle
 * plain javascript objects.
 * @ingroup torusvis_misc
 */

function VersionObject(array) {
    /**
     * @var Array<Number> array
     * @brief array of version number components
     * @details contains the version number components in the form [major, minor,
     * micro]
     * @memberof version
     */
    this.array  = array;

    /**
     * @var Number major
     * @brief major version number
     * @memberof version
     */
    this.major  = array[0];

    /**
     * @var Number minor
     * @brief minor version number
     * @memberof version
     */
    this.minor  = array[1];

    /**
     * @var Number micro
     * @brief micro version number
     * @memberof version
     */
    this.micro  = array[2];

    /**
     * @var Number string
     * @brief version string
     * equivalent to
     *
     *     array.join('.')
     * @memberof version
     */
    this.string = array.join(".");
}

VersionObject.prototype.toString = function toString() {
    return this.string;
};

module.exports = new VersionObject([0, 1, 0]);

