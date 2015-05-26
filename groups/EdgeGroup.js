
/** @file */

"use strict";

var utils = require("../misc/utils");
var GenericGroup = require("./GenericGroup");

/**
 * @class EdgeGroup
 * @brief collection of edges with a set of display options
 *
 * @extends GenericGroup
 *
 * @sa @ref NodeGroup
 *
 * @ingroup torusvis_groups
 */

/**
 * @fn EdgeGroup(Object options = {})
 * @brief construct a new @ref EdgeGroup
 *
 * @param[in] options.edges           (```Array<Object>```) collection of edge
 *                                    handles to be added to this @ref EdgeGroup
 *
 * @param[in] options.displayMode     (```String```) mode indicating how the
 *                                    edges should be displayed
 *
 * @param[in] options.displayOptions  (```Object```) options controlling how the
 *                                    edges should be displayed
 *
 * @sa @ref CommonDisplayOptions
 *
 * @memberof EdgeGroup
 */
function EdgeGroup(options) {
    options = options || {};

    var newOptions = {};
    utils.extend(true, newOptions,
        { displayMode: "line", displayOptions: {} },
        options
    );

    this.setDisplayMode(newOptions.displayMode);
    var edges = utils.objectPop(newOptions, "edges")[1];
    GenericGroup.apply(this, [edges, newOptions]);
}

utils.extend(EdgeGroup.prototype, GenericGroup.prototype);
utils.extend(EdgeGroup.prototype, {
    constructor: EdgeGroup,

    /**
     * @fn EdgeGroup setDisplayMode(String mode)
     * @brief set this @ref EdgeGroup "EdgeGroup's" display mode
     *
     * @param[in] mode the mode to set this @ref EdgeGroup "EdgeGroup's" display
     *                 mode to
     *
     * @return ```this```
     *
     * @memberof EdgeGroup
     */
    setDisplayMode:
    function setDisplayMode(mode) {
        this.displayMode = mode;
        return this;
    }
});

module.exports = EdgeGroup;

