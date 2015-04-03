
/*
 * File: EdgeGroup
 *
 * edge groups
 */

"use strict";

var utils = require("../misc/utils");
var GenericGroup = require("./GenericGroup");

/*
 * Class: EdgeGroup
 *
 * collection of edges with a set of display options
 *
 * Extends:
 *      - <GenericGroup>
 *
 * See also:
 *      - <NodeGroup>
 */

/*
 * Constructor: constructor
 *
 * construct a new <EdgeGroup>
 *
 * Parameters:
 *     args - (*Object*) table of group arguments
 *     args.edges - (*Array*) collection of edge handles to be added to this
 *                  <EdgeGroup>
 *     args.displayMode - (*String*) mode indicating how the edges should be
 *                        displayed
 *     args.displayOptions - (*Object*) options controlling how the edges should
 *                           be displayed
 *
 * See also:
 *      - <Common Display Options>
 */
function constructor(args) {
    /* documentation stub */
}

function EdgeGroup(args_) {
    args_ = args_ || {};

    var args = {};
    utils.extend(true, args,
        EdgeGroup.DEFAULT_ARGS,
        args_
    );

    this.setDisplayMode(args.displayMode);
    var edges = utils.objectPop(args, "edges")[1];
    GenericGroup.apply(this, [edges, args]);
}

utils.extend(EdgeGroup, {
    /*
     * Variable: DEFAULT_ARGS
     *
     * (*Object*) default arguments for new <EdgeGroups>
     *
     * Parameters:
     *     edges - (*Array*)
     *     displayMode - (*String*)
     *     displayOptions - (*Object*)
     *
     * See also:
     *      - <DEFAULT_DISPLAY_OPTIONS>
     *      - <NODE_GROUP_DEFAULT_ARGS>
     */
    DEFAULT_ARGS: {
        edges: [],
        displayMode: "line",
        displayOptions: { }
    },

    /*
     * Variable: DEFAULT_DISPLAY_OPTIONS
     *
     * (*Object*) default display options for new <EdgeGroups> by display mode
     *
     * Parameters:
     *     line.heightSegments - (*Number*)
     *     line.heightStart - (*Number*)
     *     line.heightLength - (*Number*)
     *
     * Parameters:
     *     cylinder.thetaSegments - (*Number*)
     *     cylinder.thetaStart - (*Number*)
     *     cylinder.thetaLength - (*Number*)
     *     cylinder.heightSegments - (*Number*)
     *     cylinder.heightStart - (*Number*)
     *     cylinder.heightLength - (*Number*)
     *
     * Parameters:
     *     arrow.headLength - (*Number*)
     *     arrow.headRadius - (*Number*)
     *     arrow.headThetaSegments - (*Number*)
     *     arrow.headThetaStart - (*Number*)
     *     arrow.headThetaLength - (*Number*)
     *     arrow.heightSegments - (*Number*)
     *     arrow.heightStart - (*Number*)
     *     arrow.heightLength - (*Number*)
     *
     * Parameters:
     *     "--common--".color - (*Number*)
     *     "--common--".size - (*Number*)
     *     "--common--".opacity - (*Number*)
     *
     * See also:
     *      - <DEFAULT_ARGS>
     *      - <Common Display Options>
     */
    DEFAULT_DISPLAY_OPTIONS: {
        line: {
            heightSegments : 2,
            heightStart    : 0,
            heightLength   : 1
        },

        cylinder: {
            thetaSegments  :       3,
            thetaStart     :       0,
            thetaLength    : Math.PI,

            heightSegments : 2,
            heightStart    : 0,
            heightLength   : 1
        },

        arrow: {
            headLength: 0.1,
            headRadius: 1.0,

            headThetaSegments:       3,
            headThetaStart   :       0,
            headThetaLength  : Math.PI,

            heightSegments : 2,
            heightStart    : 0,
            heightLength   : 1
        },

        "--common--": {
            color  : 0xFFFFFF,
            size   : 1,        // "thickness" for lines, "radius" for cylinders
            opacity: 1.0
        }
    }
});

utils.extend(EdgeGroup.prototype, GenericGroup.prototype);
utils.extend(EdgeGroup.prototype, {
    constructor: EdgeGroup,

    setDisplayMode:
    /*
     * Method: setDisplayMode
     *
     * set this <EdgeGroup's> display mode
     *
     * Parameters:
     *     mode - (*String*) the mode to set this <EdgeGroup's> display mode to
     *
     * Returns:
     *      - (*Object*) *this*
     */
    function setDisplayMode(mode) {
        this.displayMode = mode;

        var newDisplayOptionSet = utils.extend(true, {},
            EdgeGroup.DEFAULT_DISPLAY_OPTIONS["--common--"],
            EdgeGroup.DEFAULT_DISPLAY_OPTIONS[mode]
        );

        this.displayOptions = utils.extend(
            true,
            newDisplayOptionSet,
            this.displayOptions
        );

        return this;
    }
});

module.exports = EdgeGroup;

