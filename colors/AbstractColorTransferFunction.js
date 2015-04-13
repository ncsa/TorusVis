
/**
 * @class AbstractColorTransferFunction
 * @brief color transfer function foundation class
 * @pure
 *
 * @details defines the generic API for color transfer functions.  A color
 * transfer function represents a function that maps a scalar value to a color.
 * @ref AbstractColorTransferFunction instances represent colors as an array of
 * 3 values between 0 and 1; each for the red, green, and blue components of the
 * color, respectively.  The mapping is typically from a fixed range, such as
 * [0, 1].  Scalar values that fall above and below that range trigger the color
 * transfer function's overflow and underflow behaviors, respectively.
 *
 * Subclasses of @ref AbstractColorTransferFunction need to override the @ref
 * computeColor method, which is where the mapping occurs.
 *
 * @sa @ref LerpColorTransferFunction
 *
 * @ingroup torusvis_colors
 */


"use strict";

var utils = require("../misc/utils");
var COLOR_TRANSFER_MODE = require("./COLOR_TRANSFER_MODE");

/**
 * @fn AbstractColorTransferFunction()
 * @pure
 *
 * @memberof AbstractColorTransferFunction
 */
function AbstractColorTransferFunction() { utils._abstract_(); }

utils.extend(AbstractColorTransferFunction.prototype, {
    constructor: AbstractColorTransferFunction,

    /**
     * @fn AbstractColorTransferFunction setOverflowColor(Array<Number> color)
     * @brief set the color to use for overflow values
     *
     * @param[in] color color to use for overflow values
     *
     * @return ```this```
     *
     * @sa @ref setOverflowMode
     * @sa @ref setUnderflowColor
     * @sa @ref setUnderflowMode
     * @sa @ref computeColor
     *
     * @memberof AbstractColorTransferFunction
     */
    setOverflowColor:
    function setOverflowColor(color) {
        this.overflowColor = color;
        return this;
    },

    /**
     * @fn AbstractColorTransferFunction setUnderflowColor(Array<Number> color)
     * @brief set the color to use for underflow values
     *
     * @param[in] color color to use for underflow values
     *
     * @return ```this```
     *
     * @sa @ref setOverflowColor
     * @sa @ref setOverflowMode
     * @sa @ref setUnderflowMode
     * @sa @ref computeColor
     *
     * @memberof AbstractColorTransferFunction
     */
    setUnderflowColor:
    function setUnderflowColor(color) {
        this.underflowColor = color;
    },

    /**
     * @fn Array<Number> getOverflowColor()
     * @brief return the color for overflow values
     * @return the color for overflow values
     *
     * @sa @ref getOverflowMode
     * @sa @ref getUnderflowColor
     * @sa @ref getUnderflowMode
     * @sa @ref computeColor
     *
     * @memberof AbstractColorTransferFunction
     */
    getOverflowColor:
    function getOverflowColor() {
        return this.overflowColor || null;
    },

    /**
     * @fn Array<Number> getUnderflowColor()
     * @brief return the color for underflow values
     * @return the color for underflow values
     *
     * @sa @ref getOverflowColor
     * @sa @ref getOverflowMode
     * @sa @ref getUnderflowMode
     * @sa @ref computeColor
     *
     * @memberof AbstractColorTransferFunction
     */
    getUnderflowColor:
    function getUnderflowColor() {
        return this.underflowColor || null;
    },

    /**
     * @fn AbstractColorTransferFunction             \\
     *     setOverflowMode(COLOR_TRANSFER_MODE mode)
     *
     * @brief set the behavior for overflow values
     *
     * @param[in] mode mode for overflow values
     *
     * @return ```this```
     *
     * @throws Error if the given mode is not valid
     *
     * @sa @ref setOverflowColor
     * @sa @ref setUnderflowColor
     * @sa @ref setUnderflowMode
     * @sa @ref computeColor
     *
     * @memberof AbstractColorTransferFunction
     */
    setOverflowMode:
    function setOverflowMode(mode) {
        if((mode !== COLOR_TRANSFER_MODE.SATURATE) &&
           (mode !== COLOR_TRANSFER_MODE.REPEAT  )) {
            throw Error("invalid mode");
        }

        this.overflowMode = mode;
    },

    /**
     * @fn COLOR_TRANSFER_MODE getOverflowMode()
     * @brief return the mode for overflow values
     *
     * @return the mode for overflow values
     *
     * @sq @ref getOverflowColor
     * @sq @ref getUnderflowColor
     * @sq @ref getUnderflowMode
     * @sq @ref computeColor
     *
     * @memberof AbstractColorTransferFunction
     */
    getOverflowMode:
    function getOverflowMode() {
        return this.overflowMode;
    },

    /**
     * @fn AbstractColorTransferFunction              \\
     *     setUnderflowMode(COLOR_TRANSFER_MODE mode)
     *
     * @brief set the behavior for underflow values
     *
     * @param[in] mode mode for underflow values
     *
     * @return ```this```
     *
     * @throws Error if the given mode is not valid
     *
     * @sa @ref setOverflowColor
     * @sa @ref setOverflowMode
     * @sa @ref setUnderflowColor
     * @sa @ref computeColor
     *
     * @memberof AbstractColorTransferFunction
     */
    setUnderflowMode:
    function setUnderflowMode(mode) {
        if((mode !== COLOR_TRANSFER_MODE.SATURATE) &&
           (mode !== COLOR_TRANSFER_MODE.REPEAT  )) {
            throw Error("invalid mode");
        }

        this.underflow = mode;
    },

    /**
     * @fn COLOR_TRANSFER_MODE getUnderflowMode()
     * @brief return the mode for underflow values
     *
     * @return the mode for underflow values
     *
     * @sa @ref getOverflowColor
     * @sa @ref getOverflowMode
     * @sa @ref getUnderflowColor
     * @sa @ref computeColor
     *
     * @memberof AbstractColorTransferFunction
     */
    getUnderflowMode:
    function getUnderflowMode() {
        return this.underflow;
    },

    /**
     * @fn Array<Number> computeColor(Number value)
     * @brief map the given scalar value to its corresponding color
     * @pure
     *
     * @param[in] value scalar value to map
     *
     * @return the color corresponding to the given scalar
     *
     * @memberof AbstractColorTransferFunction
     */
    computeColor: utils._abstract_
});

module.exports = AbstractColorTransferFunction;

