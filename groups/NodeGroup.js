
/*
 * File: NodeGroups
 *
 * node groups
 */

"use strict";

var utils = require("../misc/utils");
var GenericGroup = require("./GenericGroup");

/*
 * Class: NodeGroup
 *
 * collection of nodes with a set of display options
 *
 * Extends:
 *      - <GenericGroup>
 *
 * See also:
 *      - <EdgeGroup>
 */

/*
 * Constructor: constructor
 *
 * construct a new <NodeGroup>
 *
 * Parameters:
 *     args - (*Object*) table of group arguments
 *     args.nodes - (*Array*) collection of node handles to be added to this
 *                  <NodeGroup>
 *     args.displayMode - (*String*) mode indicating how the nodes should be
 *                        displayed
 *     args.displayOptions - (*Object*) options controlling how the nodes should
 *                           be displayed
 *
 * See also:
 *      - <Common Display Options>
 */
function constructor(args) {
    /* documentation stub */
}

function NodeGroup(args_) {
    args_ = args_ || {};

    var args = {};
    utils.extend(true, args,
        NodeGroup.DEFAULT_ARGS,
        args_
    );

    this.setDisplayMode(args.displayMode);
    var nodes = utils.objectPop(args, "nodes")[1];
    GenericGroup.apply(this, [nodes, args]);
}


utils.extend(NodeGroup, {
    /*
     * Variable: DEFAULT_DISPLAY_OPTIONS
     *
     * (*Object*) default display options for new <NodeGroups> by display mode
     *
     * Parameters:
     *     sphere.thetaSegments - (*Number*)
     *     sphere.thetaStart - (*Number*)
     *     sphere.thetaLength - (*Number*)
     *     sphere.phiSegments - (*Number*)
     *     sphere.phiStart - (*Number*)
     *     sphere.phiLength - (*Number*)
     *
     * Parameters:
     *     "--common--".color - (*Number*)
     *     "--common--".size - (*Number*)
     *     "--common--".opacity - (*Number*)
     *
     * See also:
     *      - <NODE_GROUP_DEFAULT_ARGS>
     *      - <EDGE_GROUP_DEFAULT_DISPLAY_OPTIONS>
     *      - <Common Display Options>
     */
    DEFAULT_DISPLAY_OPTIONS: {
        sphere: {
            thetaSegments  :           3,
            thetaStart     :           0,
            thetaLength    :     Math.PI,

            phiSegments    :           2,
            phiStart       :           0,
            phiLength      : 2.0*Math.PI
        },

        "--common--": {
            color  : 0xFFFFFF,
            size   : 1,
            opacity: 1.0
        }
    },

    /*
     * Variable: DEFAULT_ARGS
     *
     * (*Object*) default arguments for new <NodeGroups>
     *
     * Parameters:
     *     nodes - (*Array*)
     *     displayMode - (*String*)
     *     displayOptions - (*Object*)
     *
     * See also:
     *      - <NODE_GROUP_DEFAULT_DISPLAY_OPTIONS>
     *      - <EDGE_GROUP_DEFAULT_ARGS>
     */
    DEFAULT_ARGS: {
        nodes: [],
        displayMode: "sprite",
        displayOptions: { }
    }
});

utils.extend(NodeGroup.prototype, GenericGroup.prototype);
utils.extend(NodeGroup.prototype, {
    constructor: NodeGroup,

    setDisplayMode:
    /*
     * Method: setDisplayMode
     *
     * set this <NodeGroup's> display mode
     *
     * Parameters:
     *     mode - (*String*) the mode to set this <NodeGroup's> display mode to
     *
     * Returns:
     *      - (*Object*) *this*
     */
    function setDisplayMode(mode) {
        this.displayMode = mode;

        var newDisplayOptionSet = utils.extend(true, {},
            NodeGroup.DEFAULT_DISPLAY_OPTIONS["--common--"],
            NodeGroup.DEFAULT_DISPLAY_OPTIONS[mode]
        );

        this.displayOptions = utils.extend(
            true,
            newDisplayOptionSet,
            this.displayOptions
        );

        return this;
    }
});

module.exports = NodeGroup;

