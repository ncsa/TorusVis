/*
 * Enum: COLOR_TRANSFER_MODE
 *
 * color transfer function constants
 *
 * SATURATE - saturate mapping behavior
 *
 * used to set color mapping behavior to saturate when mapping out-of-bound
 * values to colors.  Subclasses of <AbstractColorTransferFunction> should
 * respond to out-of-bound conditions by using <getOverflowColor> or
 * <getUnderflowColor> as appropriate and fall back to the color mapped to
 * the greatest or lowest value within bounds if no such out-of-bound colors
 * have been set, respectively.
 *
 * See also:
 *      - <COLOR_TRANSFER_MODE.REPEAT>
 *      - <AbstractColorTransferFunction.setOverflowMode>
 *      - <AbstractColorTransferFunction.setOverflowColor>
 *      - <AbstractColorTransferFunction.setUnderflowMode>
 *      - <AbstractColorTransferFunction.setUnderflowColor>
 *
 * REPEAT - repeat mapping behavior
 *
 * used to set color mapping behavior to wrap around when mapping
 * out-of-bound values to colors.  Subclasses of
 * <AbstractColorTransferFunction> should respond to out-of-bound conditions
 * by wrapping the value to be mapped around to the other end of the valid
 * range of scalars.  Subclasses may choose to fall back to other behaviors
 * if it has no well-defined wrapping semantics (for example, infinite or
 * semi-infinite ranges such as in log scales).
 *
 * See also:
 *      - <COLOR_TRANSFER_MODE.SATURATE>
 *      - <AbstractColorTransferFunction.setOverflowMode>
 *      - <AbstractColorTransferFunction.setOverflowColor>
 *      - <AbstractColorTransferFunction.setUnderflowMode>
 *      - <AbstractColorTransferFunction.setUnderflowColor>
 */

/* jshint bitwise: false */
var COLOR_TRANSFER_MODE = {
    SATURATE : 1 << 0,
    REPEAT   : 1 << 1
};

module.exports = COLOR_TRANSFER_MODE;

