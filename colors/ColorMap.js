
/**
 * @class ColorMap
 * @brief color mapping class
 *
 * @details @ref ColorMap "ColorMaps" maintain a color transfer function that
 * map scalar values in the range [0, 1) to colors as well as a set of bounds on
 * the scalar values to be mapped.  @ref ColorMap "ColorMaps" map these scalar
 * value to colors by rescaling them based on the bounds before passing them
 * onto the @ref AbstractColorTransferFunction "color transfer function".
 *
 * @ingroup torusvis_colors
 */

"use strict";

var utils = require("../misc/utils");

var DEFAULT_NULL_COLOR = [0, 0, 0];

/**
 * @fn ColorMap(AbstractColorTransferFunction func)
 * @brief construct a new @ref ColorMap around the given
 * @ref AbstractColorTransferFunction "color transfer function"
 *
 * @details constructs a new @ref ColorMap around the given @ref
 * AbstractColorTransferFunction "color transfer function".  The @ref ColorMap
 * starts with an undefined bound.
 *
 * @param[in] func the given
 * @ref AbstractColorTransferFunction "color transfer function"
 *
 * @memberof ColorMap
 */
function ColorMap(func) {
    this.colorTransferFunction = func;
    this.bounds = null;
}

utils.extend(ColorMap.prototype, {
    constructor: ColorMap,

    /**
     * @fn Array<Number> getBounds(void)
     * @brief return this @ref ColorMap "ColorMap's" scalar value bounds
     *
     * @return array containing [low, hi] scalar value bounds, or null
     *
     * @sa @ref setBounds
     *
     * @memberof ColorMap
     */
    getBounds:
    function getBounds() {
        return this.bounds;
    },

    /**
     * @fn ColorMap setBounds(Number min, Number max)
     * @brief set this @ref ColorMap "ColorMap's" scalar value bounds
     *
     * @param[in] min minimum value
     * @param[in] max maximum value
     *
     * @return ```this```
     *
     * @sa @ref getBounds
     * @sa @ref extendBounds
     *
     * @memberof ColorMap
     */
    setBounds:
    function setBounds(min, max) {
        if(min > max) {
            if(utils.isNull(this.bounds)) {
                this.bounds = [max, min];
            }
            this.bounds[0] = max;
            this.bounds[1] = min;
        } else {
            if(utils.isNull(this.bounds)) {
                this.bounds = [min, max];
            }
            this.bounds[0] = min;
            this.bounds[1] = max;
        }

        return this;
    },

    /**
     * @fn ColorMap extendBounds(Number min, Number max)
     * @brief grow the range of this @ref ColorMap "ColorMap's" scalar value
     * bounds to accomodate the given range
     *
     * @param[in] min minimum value
     * @param[in] max maximum value
     *
     * @return ```this```
     *
     * @sa @ref setBounds
     *
     * @memberof ColorMap
     */

    /**
     * @fn ColorMap extendBounds(Number value)
     * @brief equivalent to ```extendBounds(value, value)```
     *
     * @param[in] value value to accomodate
     *
     * @return ```this```
     *
     * @sa @ref setBounds
     *
     * @memberof ColorMap
     */
    extendBounds:
    function extendBounds(min, max) {
        if(arguments.length < 2) {
            max = min;
        }

        if(min <= max) {
            if(utils.isNull(this.bounds)) {
                this.bounds = [min, max];
            }

            if(this.bounds[0] > min) {
                this.bounds[0] = min;
            }

            if(this.bounds[1] < max) {
                this.bounds[1] = max;
            }
        }

        return this;
    },

    /**
     * @fn Array<Number> getNullColor()
     * @brief return this @ref ColorMap "ColorMap's" null color
     *
     * @details returns the null color to be used by this @ref ColorMap for data
     * that is missing, invalid, or otherwise unfit.  If no null color was
     * previously set for this @ref ColorMap, then a default null color is
     * returned.
     *
     * @return this @ref ColorMap "ColorMap's" null color
     *
     * @sa @ref setNullColor
     *
     * @memberof ColorMap
     */
    getNullColor:
    function getNullColor() {
        var result = this.nullColor;
        if(utils.isNull(result)) {
            result = DEFAULT_NULL_COLOR;
        }

        return result;
    },

    /**
     * @fn ColorMap setNullColor(Array<Number> color)
     * @brief set this @ref ColorMap "ColorMap's" null color
     *
     * @param[in] color the color to use as this @ref ColorMap "ColorMap's" null
     * color
     *
     * @return ```this```
     *
     * @sa @ref getNullColor
     *
     * @memberof ColorMap
     */
    setNullColor:
    function setNullColor(color) {
        this.nullColor = color;
        return this;
    },

    /**
     * @fn Array<Number> computeColor(Number value)
     * @brief return the color associated with the given scalar value
     *
     * @details returns the color associated with the given scalar value.  The
     * returned color is a 3-component array with red, green, and blue color
     * component values in the range [0, 1].
     *
     * @return red, green, and blue components of the returned color
     *
     * @sa @ref getNullColor
     *
     * @memberof ColorMap
     */
    computeColor:
    function computeColor(value) {
        var bounds = this.getBounds();
        var rescaledValue = (value - bounds[0])/(bounds[1] - bounds[0]);
        var result = this.colorTransferFunction.computeColor(rescaledValue);
        if(utils.isNull(result)) {
            result = this.getNullColor();
        }

        return result;
    }
});

module.exports = ColorMap;

