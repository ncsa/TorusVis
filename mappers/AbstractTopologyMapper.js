
/*
 * File: abstractTopologyMapper
 *
 * abstract topology mapping API
 */

"use strict";

var utils = require("../misc/utils");

/*
 * Class: AbstractTopologyMapper
 *
 * (*ABSTRACT*) abstract class for topology-mapping codes
 *
 * An <AbstractTopologyMapper> maps the topology information in a graph to
 * locations in a 3D space.  Their primary functions are to map nodes to points
 * and to map edges to sequences of points that form a path.  Subclasses of
 * <AbstractTopologyMapper> may operate directly on a graph, act as a filter
 * that transforms the mapping results of another topology mapper, or support a
 * combination of the two use cases.  Furthermore, a subclass may opt to map
 * topology information to other metrics, entirely, providing their own
 * extension of the topology mapping API for consumption by other compliant
 * topology mappers or output engines.
 *
 * See also:
 *      - <AbstractGraph>
 *      - <AbstractOutputEngine>
 *      - <DirectTopologyMapper>
 */

function AbstractTopologyMapper() { utils._abstract_(); }

utils.extend(AbstractTopologyMapper.prototype, {
    constructor: AbstractTopologyMapper,

    /*
     * Method: graphNodeToPosition
     *
     * (*ABSTRACT*) map the given node of the given graph to a location in 3D
     * space
     *
     * maps the given node of the given graph to a location in 3D space.  The
     * given node should be a node belonging to the given graph.
     *
     * Parameters:
     *     graph - (*<AbstractGraph>*) the given graph
     *     nodeHandle - (*Object*) handle to the given node
     *
     * Returns:
     *      - (*Array*) array with x, y, and z position coordinates
     *
     * See also:
     *      - <graphEdgeToPath>
     */
    graphNodeToPosition: utils._abstract_,

    /*
     * Method: graphEdgeToPath
     *
     * (*ABSTRACT*) map the given edge of the given graph to a path in 3D space
     *
     * maps the given edge of the given graph to a path in 3D space.  The given
     * edge should be an edge belonging to the given graph.  The path returned
     * is an array of 3-component arrays corresponding to x, y, and z position
     * coordinates.  The path is defined as a collection of line segments
     * connecting each point in the array to the one immediately following it.
     * For example, an array with subarrays [a, b, c] represent two line
     * segments: the first connecting point a to point b, and the second
     * connecting point b to point c.  The array may also contain null values
     * which represent breaks in the path.  No line segment should be drawn
     * between two non-null values that have a null value between them.
     *
     * Parameters:
     *     graph - (*<AbstractGraph>*) the given graph
     *     edgeHandle - (*Object*) handle to the given edge
     *
     * Returns:
     *      - (*Array*) path array
     *
     * See also:
     *      - <graphNodeToPosition>
     */
    graphEdgeToPath: utils._abstract_,

    /*
     * Method: setInput
     *
     * set this topology mapper to use the results of the given topology mapper
     * as its input
     *
     * sets the input of this topology mapper to the given topology mapper.  If
     * multiple topology mapper instances are provided, they are bundled in a
     * chain so that this mapper uses the output of the first provided mapper,
     * which itself uses the output of the second provided mapper, and so on.
     *
     * Parameters:
     *     mapperObject[, ...] - (*<AbstractTopologyMapper>*) the topology
     *                           mapper to use as input
     *
     * Returns:
     *      - (*<AbstractTopologyMapper>*) *this*
     *
     * See also:
     *      - <getInput>
     */
    setInput:
    function setInput(mapperObject) {
        var n = arguments.length - 1;
        mapperObject = arguments[n];
        while(n--) { mapperObject = arguments[n].setInput(mapperObject); }
        this.input = mapperObject;
        return this;
    },

    /*
     * Method: getInput
     *
     * return the topology mapper being used as this topology mapper's input
     *
     * Returns:
     *      - (*<AbstractTopologyMapper>*) the topology mapper being used as
     *        this topology mapper's input, or null
     *
     * See also:
     *      - <setInput>
     */
    getInput:
    function getInput() {
        return this.input;
    }
});

module.exports = AbstractTopologyMapper;

