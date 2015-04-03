
/*
 * Class: AbstractColorTransferFunction
 *
 * (*ABSTRACT*) color transfer function foundation class
 *
 * defines the generic API for color transfer functions.  A color transfer
 * function represents a function that maps a scalar value to a color.
 * <AbstractColorTransferFunction> instances represent colors as an array of 3
 * values between 0 and 1; each for the red, green, and blue components of the
 * color, respectively.  The mapping is typically from a fixed range, such as
 * [0, 1].  Scalar values that fall above and below that range trigger the color
 * transfer function's overflow and underflow behaviors, respectively.
 *
 * Subclasses of <AbstractColorTransferFunction> need to override the
 * <computeColor> method, which is where the mapping occurs.
 *
 * See also:
 *      - <LerpColorTransferFunction>
 */


"use strict";

var utils = require("../misc/utils");
var COLOR_TRANSFER_MODE = require("./COLOR_TRANSFER_MODE");

function AbstractColorTransferFunction() { utils._abstract_(); }

utils.extend(AbstractColorTransferFunction.prototype, {
    constructor: AbstractColorTransferFunction,

    setOverflowColor:
    /*
     * Method: setOverflowColor
     *
     * set the color to use for overflow values
     *
     * Parameters:
     *     color - (*array*) color to use for overflow values
     *
     * See also:
     *      - <setOverflowMode>
     *      - <setUnderflowColor>
     *      - <setUnderflowMode>
     *      - <computeColor>
     */
    function setOverflowColor(color) {
        this.overflowColor = color;
    },

    setUnderflowColor:
    /*
     * Method: setUnderflowColor
     *
     * set the color to use for underflow values
     *
     * Parameters:
     *     color - (*array*) color to use for underflow values
     *
     * See also:
     *      - <setOverflowColor>
     *      - <setOverflowMode>
     *      - <setUnderflowMode>
     *      - <computeColor>
     */
    function setUnderflowColor(color) {
        this.underflowColor = color;
    },

    getOverflowColor:
    /*
     * Method: getOverflowColor
     *
     * return the color for overflow values
     *
     * Returns:
     *      - (*array*) the color for overflow values
     *
     * See also:
     *      - <getOverflowMode>
     *      - <getUnderflowColor>
     *      - <getUnderflowMode>
     *      - <computeColor>
     */
    function getOverflowColor() {
        return this.overflowColor || null;
    },

    getUnderflowColor:
    /*
     * Method: getUnderflowColor
     *
     * return the color for underflow values
     *
     * Returns:
     *      - (*array*) the color for underflow values
     *
     * See also:
     *      - <getOverflowColor>
     *      - <getOverflowMode>
     *      - <getUnderflowMode>
     *      - <computeColor>
     */
    function getUnderflowColor() {
        return this.underflowColor || null;
    },

    setOverflowMode:
    /*
     * Method: setOverflowMode
     *
     * set the behavior for overflow values
     *
     * sets the behavior for overflow values.  See <COLOR_TRANSFER_MODE> for
     * details on available modes.
     *
     * Parameters:
     *     mode - (*<COLOR_TRANSFER_MODE>*) mode for overflow values
     *
     * Throws:
     *      - (*Error*) if the given mode is not valid
     *
     * See also:
     *      - <setOverflowColor>
     *      - <setUnderflowColor>
     *      - <setUnderflowMode>
     *      - <computeColor>
     */
    function setOverflowMode(mode) {
        if((mode !== COLOR_TRANSFER_MODE.SATURATE) &&
           (mode !== COLOR_TRANSFER_MODE.REPEAT  )) {
            throw Error("invalid mode");
        }

        this.overflowMode = mode;
    },

    getOverflowMode:
    /*
     * Method: getOverflowMode
     *
     * return the mode for overflow values
     *
     * Returns:
     *      - (*<COLOR_TRANSFER_MODE>*) the mode for overflow values
     *
     * See also:
     *      - <getOverflowColor>
     *      - <getUnderflowColor>
     *      - <getUnderflowMode>
     *      - <computeColor>
     */
    function getOverflowMode() {
        return this.overflowMode;
    },

    setUnderflowMode:
    /*
     * Method: setUnderflowMode
     *
     * set the behavior for underflow values
     *
     * sets the behavior for underflow values.  See <COLOR_TRANSFER_MODE> for
     * details on available modes.
     *
     * Parameters:
     *     mode - (*<COLOR_TRANSFER_MODE>*) mode for underflow values
     *
     * Throws:
     *      - (*Error*) if the given mode is not valid
     *
     * See also:
     *      - <setOverflowColor>
     *      - <setOverflowMode>
     *      - <setUnderflowColor>
     *      - <computeColor>
     */
    function setUnderflowMode(mode) {
        if((mode !== COLOR_TRANSFER_MODE.SATURATE) &&
           (mode !== COLOR_TRANSFER_MODE.REPEAT  )) {
            throw Error("invalid mode");
        }

        this.underflow = mode;
    },

    getUnderflowMode:
    /*
     * Method: getUnderflowMode
     *
     * return the mode for underflow values
     *
     * Returns:
     *      - (*<COLOR_TRANSFER_MODE>*) the mode for underflow values
     *
     * See also:
     *      - <getOverflowColor>
     *      - <getOverflowMode>
     *      - <getUnderflowColor>
     *      - <computeColor>
     */
    function getUnderflowMode() {
        return this.underflow;
    },

    computeColor: (
    /*
     * Method: computeColor
     *
     * (*Abstract*) map the given scalar value to its corresponding color
     *
     * Parameters:
     *     value - (*number*) scalar value to map
     *
     * Returns:
     *      - (*array*) the color corresponding to the given scalar
     */
    function computeColor(value) {
        /* documentation stub */
    },

        utils._abstract_
    )[1]
});

module.exports = AbstractColorTransferFunction;

