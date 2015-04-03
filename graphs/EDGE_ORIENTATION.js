
/*
 * Enum: EDGE_ORIENTATION
 *
 * orientation model for edges
 *
 * The <abstractGraph> API uses an edge model where every edge has a source and
 * destination node, but also an orientation that can provide hints to analysis
 * and visualization mapping modules on how to process such edges.  For example,
 * a visualization mapping module might want to draw DIRECTED edges with arrows
 * and UNDIRECTED edges with straight lines.
 *
 * DIRECTED      - edge begins at its source node and ends at its destination
 *                 node
 * REVERSED      - as in <EDGE_ORIENTATION.DIRECTED>, but vice-versa
 * BIDIRECTIONAL - edge both begins and ends at both its source and
 *                 destination nodes
 * UNDIRECTED    - edge has no orientation indication at all
 *
 * See also:
 *      - <AbstractGraph.edgeOrientation>
 *      - <Edge Orientation Interpretation>
 */

/* jshint bitwise: false */
var EDGE_ORIENTATION = {
    UNDIRECTED   : 1 << 0,
    DIRECTED     : 1 << 1,
    BIDIRECTIONAL: 1 << 2,
    REVERSED     : 1 << 3
};

/*
 * About: Edge Orientation Interpretation
 *
 * edge orientation interpretation considerations
 *
 * While the edge orientation model described in <EDGE_ORIENTATION> allows
 * visualization mapping modules to use orientation information for presenting
 * edges, a consequence of this model is the ambiguity with which various
 * source, destination, and orientation combinations may be interpreted,
 * especially for analysis codes that seek to traverse graph structures with
 * edges of various orientations.  Some questions that a given interpretation
 * would need to answer include:
 *
 *     - Should orientation affect the source and destination nodes?
 *       (begin code)
 *           // is
 *           {
 *               source=node0,
 *               destination=node1,
 *               orientation=REVERSED
 *           }
 *
 *           // the same as
 *           {
 *               source=node1,
 *               destination=node0,
 *               orientation=DIRECTED
 *           }
 *
 *           // ?
 *       (end code)
 *
 *     - How should UNDIRECTED edges be regarded?
 * |     Should traversal across such edges occur in either direction?
 * |        If so:  shouldn't they occur in both directions?
 * |
 * |            If so:  how are such edges different from BIDIRECTIONAL edges?
 * |
 * |            If not: how are such edges different from DIRECTED or REVERSED
 * |                    edges?
 * |
 * |        If not: how are such edges different from the complete absence of an
 * |                edge?
 *
 * To assist analysis codes in answering tricky questions like these, this
 * module defines three interpretations.  The primary features of these
 * interpretations are whether they equate REVERSED edges to their logical
 * DIRECTED counterparts, and whether they regard UNDIRECTED and BIDIRECTIONAL
 * edges as equivalent.
 *
 * direct      - regards edges as beginning from their source and ending at
 *               their destination nodes; without any regard to their
 *               orientation
 *
 * canonical   - takes orientation into account when considering an edge's
 *               source and destination nodes.  Considers BIDIRECTIONAL edges to
 *               be distinct from UNDIRECTED edges.  UNDIRECTED edges have no
 *               directional orientation at all (i.e.: they have neither source
 *               nor destination nodes).
 *
 * symmetrical - as in canonical, except UNDIRECTED edges are treated like
 *               BIDIRECTIONAL edges.  They have two source and two destination
 *               nodes, and may be traversed in either direction.
 *
 * See also:
 *      - <AbstractGraph.edgeSource>
 *      - <AbstractGraph.edgeDestination>
 *      - <AbstractGraph.edgeCanonicalSources>
 *      - <AbstractGraph.edgeCanonicalDestinations>
 *      - <AbstractGraph.edgeSymmetricalSources>
 *      - <AbstractGraph.edgeSymmetricalDestinations>
 *      - <AbstractGraph.isEdge>
 *      - <AbstractGraph.isSelfEdge>
 *      - <AbstractGraph.isDirectedEdge>
 *      - <AbstractGraph.isUndirectedEdge>
 *      - <AbstractGraph.isReversedEdge>
 *      - <AbstractGraph.isBidirectionalEdge>
 *      - <AbstractGraph.isCanonicallyDirectedEdge>
 *      - <AbstractGraph.isCanonicallyUndirectedEdge>
 *      - <AbstractGraph.isSymmetricEdge>
 *      - <AbstractGraph.isAsymmetricEdge>
 *      - <AbstractGraph.isInEdge>
 *      - <AbstractGraph.isOutEdge>
 *      - <AbstractGraph.isCanonicallyInEdge>
 *      - <AbstractGraph.isCanonicallyOutEdge>
 *      - <AbstractGraph.isSymmetricallyInEdge>
 *      - <AbstractGraph.isSymmetricallyOutEdge>
 */

module.exports = EDGE_ORIENTATION;

