/**
 * @class COLOR_TRANSFER_MODE
 * @brief color transfer function constants
 *
 * @ingroup torusvis_colors
 */

/* jshint bitwise: false */
var COLOR_TRANSFER_MODE = {

    /**
     * @var Number SATURATE
     * @brief saturate mapping behavior
     *
     * @details used to set color mapping behavior to saturate when mapping
     * out-of-bound values to colors.  Subclasses of @ref
     * AbstractColorTransferFunction should respond to out-of-bound conditions
     * by using @ref AbstractColorTransferFunction.getOverflowColor or @ref
     * AbstractColorTransferFunction.getUnderflowColor as appropriate and fall
     * back to the color mapped to the greatest or lowest value within bounds if
     * no such out-of-bound colors have been set, respectively.
     *
     * @sa @ref COLOR_TRANSFER_MODE.REPEAT
     * @sa @ref AbstractColorTransferFunction.setOverflowMode
     * @sa @ref AbstractColorTransferFunction.setOverflowColor
     * @sa @ref AbstractColorTransferFunction.setUnderflowMode
     * @sa @ref AbstractColorTransferFunction.setUnderflowColor
     *
     * @memberof COLOR_TRANSFER_MODE
     */
    SATURATE : 1 << 0,

    /**
     * @var Number REPEAT
     * @brief repeat mapping behavior
     *
     * @details used to set color mapping behavior to wrap around when mapping
     * out-of-bound values to colors.  Subclasses of @ref
     * AbstractColorTransferFunction should respond to out-of-bound conditions
     * by wrapping the value to be mapped around to the other end of the valid
     * range of scalars.  Subclasses may choose to fall back to other behaviors
     * if it has no well-defined wrapping semantics (for example, infinite or
     * semi-infinite ranges such as in log scales).
     *
     * @sa @ref COLOR_TRANSFER_MODE.SATURATE
     * @sa @ref AbstractColorTransferFunction.setOverflowMode
     * @sa @ref AbstractColorTransferFunction.setOverflowColor
     * @sa @ref AbstractColorTransferFunction.setUnderflowMode
     * @sa @ref AbstractColorTransferFunction.setUnderflowColor
     *
     * @memberof COLOR_TRANSFER_MODE
     */
    REPEAT   : 1 << 1
};

module.exports = COLOR_TRANSFER_MODE;

