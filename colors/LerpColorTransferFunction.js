
/*
 * Class: LerpColorTransferFunction
 *
 * linearly interpolated color lookup tables
 *
 * <LerpColorTransferFunctions> map scalar values to colors by maintaining an
 * internal table of value-color pairs, sorted by value.
 *
 * Extends:
 *      - <AbstractColorTransferFunction>
 */

"use strict";

var utils = require("../misc/utils");
var AbstractColorTransferFunction = require("./AbstractColorTransferFunction");

var _private_ = require("./LerpColorTransferFunctionInternals");

/*
 * Constructor: constructor
 */
function LerpColorTransferFunction() {
    this.markers = [];
    this.colors = [];
}

utils.extend(
    LerpColorTransferFunction.prototype,
    AbstractColorTransferFunction.prototype
);

utils.extend(LerpColorTransferFunction.prototype, {
    constructor: LerpColorTransferFunction,

    setMarker:
    /*
     * Method: setMarker
     *
     * set or add a marker mapping the given scalar value to the given color
     *
     * Parameters:
     *     value - (*Number*) the given scalar value
     *     color - (*Array*) the given color in floating point RGB format
     *
     * Returns:
     *      - (*<LerpColorTransferFunction>*) *this*
     *
     * See also:
     *      - <computeColor>
     */
    function setMarker(value, color) {
        if(value > 1) { value = 1; }
        if(value < 0) { value = 0; }

        var index = utils.bisect(this.markers, value);
        if(this.markers[index] === value) {
            this.colors[index] = color;
        } else {
            this.markers.splice(index, 0, value);
            this.colors.splice(index, 0, color);
        }

        return this;
    },

    computeColor:
    /*
     * Method: computeColor
     *
     * compute the color corresponding to the given scalar value
     *
     * computes the color corresponding to the given scalar value.  Colors are
     * computed by fetching the color corresponding to the given scalar, or
     * linearly interpolating between the two colors corresponding to the scalar
     * values bounding the given scalar.
     *
     * Parameters:
     *     value - (*Number*) the given scalar value
     *
     * Returns:
     *      - (*Array*) the color corresponding to the given scalar value in
     *        floating point RGB format, or *null* if the given scalar value is
     *        invalid
     *
     * Implements:
     *      - <AbstractColorTransferFunction.computeColor>
     *
     * See also:
     *      - <setMarker>
     *      - <AbstractColorTransferFunction.getOverflowColor>
     *      - <AbstractColorTransferFunction.setOverflowColor>
     *      - <AbstractColorTransferFunction.getOverflowMode>
     *      - <AbstractColorTransferFunction.setOverflowMode>
     *      - <AbstractColorTransferFunction.getUnderflowColor>
     *      - <AbstractColorTransferFunction.setUnderflowColor>
     *      - <AbstractColorTransferFunction.getUnderflowMode>
     *      - <AbstractColorTransferFunction.setUnderflowMode>
     */
    function computeColor(value) {
        var self = { value: value };

        if(_private_.computeClipColor(this, self)) { return self.color; }

        value = self.value;

        /*
         * [value] should have been properly clipped by now
         *
         * If it has not, then treat it as an invalid value.
         */
        if(value < 0 || value > 1) {
            return null;
        }

        /*
         * When clipped from the ceiling, [value] is set slightly below the
         * maximum to ensure the table lookup returns the correct index.
         */
        if(value === 1 /* (exactly) */) {
            value -= 0.0000001;
        }

        var result = _private_.colorLookup(this, value);
        return result;
    }
});

module.exports = LerpColorTransferFunction;

