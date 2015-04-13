
/**
 * @class LerpColorTransferFunctionInternals
 * @private
 * @ingroup torusvis_colors
 */

"use strict";

var utils = require("../misc/utils");
var COLOR_TRANSFER_MODE = require("./COLOR_TRANSFER_MODE");

module.exports = {
    /**
     * @fn Boolean clipColor(LerpColorTransferFunction self, Object tmp)
     * @brief clips a given scalar value according to the given
     * @ref LerpColorTransferFunction "LerpColorTransferFunction's" overflow and
     * underflow modes
     * @private
     *
     * @param[in] self the given @ref LerpColorTransferFunction
     * @param[in,out] tmp object containing the given scalar attribute
     *                ```.value```
     *
     * @return ```false```, unless
     *  - ```tmp.value > 1```; *and*
     *  - the given
     *    @ref LerpColorTransferFunction "LerpColorTransferFunction's" overflow
     *    mode is set to @ref COLOR_TRANSFER_MODE.SATURATE; *and*
     *  - an overflow color has been set \n
     *  *or* \n
     *  - ```tmp.value < 0```; *and*
     *  - the given
     *    @ref LerpColorTransferFunction "LerpColorTransferFunction's" underflow
     *    mode is set to @ref COLOR_TRANSFER_MODE.SATURATE; *and*
     *  - an underflow color has been set
     *
     * ####Note
     * If ```tmp.value > 1``` and the given
     * @ref LerpColorTransferFunction "LerpColorTransferFunction's" overflow
     * mode is set to @ref COLOR_TRANSFER_MODE.REPEAT, then the given scalar
     * will be modulated to lie within [0, 1], and similarly if
     * ```tmp.value < 0``` and the given
     * @ref LerpColorTransferFunction "LerpColorTransferFunction's" underflow
     * mode is set to @ref COLOR_TRANSFER_MODE.REPEAT.
     *
     * @sa @ref LerpColorTransferFunction.computeColor
     * @sa @ref AbstractColorTransferFunction.setOverflowColor
     * @sa @ref AbstractColorTransferFunction.setOverflowMode
     * @sa @ref AbstractColorTransferFunction.setUnderflowColor
     * @sa @ref AbstractColorTransferFunction.setUnderflowMode
     * @sa @ref COLOR_TRANSFER_MODE
     *
     * @memberof LerpColorTransferFunctionInternals
     */
    computeClipColor:
    function computeClipColor(self, tmp) {
        var color = null;

        if(tmp.value > 1) {
            if(self.getOverflowMode() === COLOR_TRANSFER_MODE.SATURATE) {
                tmp.value = 1;
                color = self.getOverflowColor();
            } else if(self.getOverflowMode() === COLOR_TRANSFER_MODE.REPEAT) {
                tmp.value %= 1;
            }
        } else if(tmp.value < 0) {
            if(self.getUnderflowMode() === COLOR_TRANSFER_MODE.SATURATE) {
                tmp.value = 0;
                color = self.getUnderflowColor();
            } else if(self.getUnderflowMode() === COLOR_TRANSFER_MODE.REPEAT) {
                tmp.value %= 1;
                tmp.value %= 1;
                ++tmp.value;
            }
        }

        var result = Boolean(color);
        if(result) {
            tmp.color = color;
        }

        return result;
   },

    /**
     * @fn Array<Number>                                             \\
     *     colorLookup(LerpColorTransferFunction self, Number value)
     * @private
     *
     * @memberof LerpColorTransferFunctionInternals
     */
   colorLookup:
   function colorLookup(self, value) {
        var index = utils.bisect(self.markers, value);

        var colorA = self.colors[index - 1];
        var colorB = self.colors[index];

        var colorAIsNull = utils.isNull(colorA);
        var colorBIsNull = utils.isNull(colorB);

        if(colorAIsNull && colorBIsNull) { return null; }
        if(colorAIsNull) { return colorB; }
        if(colorBIsNull) { return colorA; }

        var weight = (
            (value - self.markers[index - 1])
            /
            (self.markers[index] - self.markers[index - 1])
        );

        return [
            (1 - weight)*colorA[0] + weight*colorB[0],
            (1 - weight)*colorA[1] + weight*colorB[1],
            (1 - weight)*colorA[2] + weight*colorB[2]
        ];
   }
};

