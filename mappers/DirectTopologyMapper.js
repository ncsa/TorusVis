
/*
 * File: directTopologyMapper
 *
 * direct topology mapping implementation
 */

"use strict";

var utils = require("../misc/utils");
var AbstractTopologyMapper = require("./AbstractTopologyMapper");

/*
 * Class: DirectTopologyMapper
 *
 * direct topology-mapping subclass of <AbstractTopologyMapper>
 *
 * direct topology-mapping subclass of <AbstractTopologyMapper>.  Maps a node to
 * locations by fetching the "position" attribute of its data object.  Edges are
 * mapped to a single direct line segment connecting its two incident nodes.
 *
 * Extends:
 *      - <AbstractTopologyMapper>
 */

/*
 * Constructor: constructor
 *
 * constructs a new <DirectTopologyMapper>
 */
function DirectTopologyMapper() {
    /* void */
}

utils.extend(DirectTopologyMapper.prototype, AbstractTopologyMapper.prototype);
utils.extend(DirectTopologyMapper.prototype, {
    constructor: DirectTopologyMapper,

    graphNodeToPosition:
    /*
     * Method: graphNodeToPosition
     *
     * Implements:
     *      - <AbstractTopologyMapper.graphNodeToPosition>
     */
    function graphNodeToPosition(graph, node) {
        var result = graph.nodeData(node).position;
        if(utils.isNull(result)) {
            result = [0, 0, 0];
        }
        return result;
    },

    graphEdgeToPath:
    /*
     * Method: graphEdgeToPath
     *
     * Implements:
     *      - <AbstractTopologyMapper.graphEdgeToPath>
     */
    function graphEdgeToPath(graph, edge) {
        return [
            this.graphNodeToPosition(graph, graph.edgeSource(edge)),
            this.graphNodeToPosition(graph, graph.edgeDestination(edge))
        ];
    }
});

module.exports = DirectTopologyMapper;

