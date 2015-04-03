
/*
 * Class: ColorMap
 *
 * color mapping class
 *
 * <ColorMaps> maintain a color transfer function that map scalar values in the
 * range [0, 1) to colors as well as a set of bounds on the scalar values to be
 * mapped.  <ColorMaps> map these scalar value to colors by rescaling them based
 * on the bounds before passing them onto the color transfer function.
 */

"use strict";

var utils = require("../misc/utils");

var DEFAULT_NULL_COLOR = [0, 0, 0];

/*
 * Constructor: constructor
 *
 * construct a new <ColorMap> around the given color transfer function
 *
 * constructs a new <ColorMap> around the given color transfer function.  The
 * <ColorMap> starts with an undefined bound.
 *
 * Parameters:
 *     colorTransferFunction - (*Function*) the given color transfer function
 */
function constructor(colorTransferFunction) {
    /* documentation stub */
}

function ColorMap(colorTransferFunction) {
    this.colorTransferFunction = colorTransferFunction;
    this.bounds = null;
}

utils.extend(ColorMap.prototype, {
    constructor: ColorMap,

    getBounds:
    /*
     * Method: getBounds
     *
     * return this <ColorMap's> scalar value bounds
     *
     * Returns:
     *      - (*Array*) array containing [low, hi] scalar value bounds, or null
     *
     * See also:
     *      - <setBounds>
     */
    function getBounds() {
        return this.bounds;
    },

    setBounds:
    /*
     * Method: setBounds
     *
     * set this <ColorMap's> scalar value bounds
     *
     * Parameters:
     *     min - (*number*) minimum value
     *     max - (*number*) maximum value
     *
     * See also:
     *      - <getBounds>
     *      - <extendBounds>
     */
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
    },

    extendBounds:
    /*
     * Method: extendBounds
     *
     * grow the range of this <ColorMap's> scalar value bounds to accomodate the
     * given range 
     *
     * grows the range of this <ColorMap's> scalar value bounds to accomodate
     * the given range.  If only one value is provided, grows the range to
     * accomodate it.
     *
     * Parameters:
     *     min - (*number*) minimum value
     *     [max] - (*number*) maximum value
     *
     * See also:
     *      - <setBounds>
     */
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
    },

    /*
     * Method: getNullColor
     *
     * return this <ColorMap's> null color
     *
     * returns the null color to be used by this <ColorMap> for data that is
     * missing, invalid, or otherwise unfit.  If no null color was previously
     * set for this <ColorMap>, then a default null color is returned.
     *
     * Returns:
     *     - (*Array*) this <ColorMap's> null color
     *
     * See also:
     *      - <setNullColor>
     */
    getNullColor:
    function getNullColor() {
        var result = this.nullColor;
        if(utils.isNull(result)) {
            result = DEFAULT_NULL_COLOR;
        }

        return result;
    },

    /*
     * Method: setNullColor
     *
     * set this <ColorMap's> null color
     *
     * Parameters:
     *     color - (*Array*) the color to use as this <ColorMap's> null color
     *
     * Returns:
     *     - (*<ColorMap>*) *this*
     *
     * See also:
     *      - <getNullColor>
     */
    setNullColor:
    function setNullColor(color) {
        this.nullColor = color;
        return this;
    },

    computeColor:
    /*
     * Method: computeColor
     *
     * return the color associated with the given scalar value
     *
     * returns the color associated with the given scalar value.  The returned
     * color is a 3-component array with red, green, and blue color component
     * values in the range [0, 1].
     *
     * Returns:
     *      - (*Array*) red, green, and blue components of the returned color
     *
     * See also:
     *      - <getNullColor>
     */
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

