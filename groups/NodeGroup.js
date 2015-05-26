
/** @file */

"use strict";

var utils = require("../misc/utils");
var GenericGroup = require("./GenericGroup");

/**
 * @class NodeGroup
 * @brief collection of nodes with a set of display options
 *
 * @extends GenericGroup
 *
 * @sa @ref EdgeGroup
 *
 * @ingroup torusvis_groups
 */

/**
 * @fn NodeGroup(Object options = {})
 * @brief construct a new @ref NodeGroup
 *
 * @param[in] options.nodes           (```Array<Object>```) collection of node
 *                                    handles to be added to this @ref NodeGroup
 *
 * @param[in] options.displayMode     (```String```) mode indicating how the
 *                                    nodes should be displayed
 *
 * @param[in] options.displayOptions  (```Object```) options controlling how the
 *                                    nodes should be displayed
 *
 * @sa @ref CommonDisplayOptions
 *
 * @memberof NodeGroup
 */
function NodeGroup(options) {
    options = options || {};

    var newOptions = {};
    utils.extend(true, newOptions,
        { displayMode: "sphere", displayOptions: {} },
        options
    );

    this.setDisplayMode(newOptions.displayMode);
    var nodes = utils.objectPop(newOptions, "nodes")[1];
    GenericGroup.apply(this, [nodes, newOptions]);
}

utils.extend(NodeGroup.prototype, GenericGroup.prototype);
utils.extend(NodeGroup.prototype, {
    constructor: NodeGroup,

    /**
     * @fn NodeGroup setDisplayMode(String mode)
     * @brief set this @ref NodeGroup "NodeGroup's" display mode
     *
     * @param[in] mode the mode to set this @ref NodeGroup "NodeGroup's" display
     *                 mode to
     *
     * @return ```this```
     *
     * @memberof NodeGroup
     */
    setDisplayMode:
    function setDisplayMode(mode) {
        this.displayMode = mode;
        return this;
    }
});

module.exports = NodeGroup;

