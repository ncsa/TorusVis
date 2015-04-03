
/*
 * File: abstractGraph
 *
 * abstract graph data structure API
 */

"use strict";

var utils = require("../misc/utils");
var EDGE_ORIENTATION = require("./EDGE_ORIENTATION");

/*
 * Class: AbstractGraph
 *
 * (*ABSTRACT*) abstract class for graphs of different topologies
 *
 * The <AbstractGraph> class defines all the methods that concrete subclasses
 * need to implement in order to provide a complete graph interface.  The
 * abstract API is designed to accommodate graph types of topologies as generic
 * as arbitrarily connected directed graphs while also allowing graph types of
 * simpler or more regular topologies to offer the same interface while
 * internally taking advantage of their simplicity.
 *
 * For example, where an arbitrarily connected directed graph might need to
 * explicitly track each of its nodes and edges as individual objects, complete
 * with orientation information; an undirected variant might only need to track
 * edges internally using a list of node pairs and present all edges as having
 * an orientation of <EDGE_ORIENTATION.UNDIRECTED>.  Another typical possibility
 * might be a highly structured graph type, such as a flat torus that can take
 * advantage of its regular and structural features to use an entirely implicit
 * edge tracking scheme.
 *
 * See also:
 *      - <DirectedGraph>
 *      - <FlatTorus>
 */
function AbstractGraph() { utils._abstract_(); }

utils.extend(AbstractGraph.prototype, {
    constructor: AbstractGraph,

    /*
     * Method: newNode
     *
     * (*ABSTRACT*) creates a new node and adds it to this graph
     *
     * the returned ID representing the created node should be a non-negative
     * integral *Number*.  Node IDs returned by this function should be usable
     * as an index into an *Array* and may be passed to other methods expecting
     * a node ID.
     *
     * Returns:
     *      - (*Number*) the created node's ID
     *
     * Throws:
     *      - (*Error*) if called while iterating over existing nodes
     *
     * See also:
     *      - <deleteNode>
     *      - <newEdge>
     *      - <nodeNeighbor>
     *      - <numberOfNodes>
     *      - <nodeData>
     *      - <iterNodes>
     */
    newNode: utils._abstract_,

    /*
     * Method: deleteNode
     *
     * (*ABSTRACT*) deletes a created node and removes it from this graph
     *
     * deletes a created node and removes it from this graph.  Any edges
     * incident to the given node are also removed.
     *
     * Parameters:
     *     nodeId - (*Number*) the ID of the node to delete
     *
     * Throws:
     *      - (*Error*) if called while iterating over existing nodes
     *      - (*Error*) if called while iterating over existing edges
     *
     * See also:
     *      - <newNode>
     *      - <deleteEdge>
     *      - <clear>
     *      - <iterNodes>
     *      - <iterEdges>
     *
     */
    deleteNode: utils._abstract_,

    /*
     * Method: newEdge
     *
     * (*ABSTRACT*) creates a new edge and adds it to this graph
     *
     * the returned ID representing the created edge should be a non-negative
     * integral *Number*.  Edge IDs returned by this function should be usable
     * as an index into an *Array* and may be passed to other methods expecting
     * an edge ID.
     *
     * Parameters:
     *     srcId - (*Number*) ID for the source node
     *     dstId - (*Number*) ID for the destination node
     *     [orientation] - (*<EDGE_ORIENTATION>*) orientation of the created
     *                     edge (default: <EDGE_ORIENTATION.UNDIRECTED>)
     *
     * Returns:
     *      - (*Number*) the created edge
     *
     * Throws:
     *      - (*Error*) if called while iterating over existing edges
     *
     * See also:
     *      - <newNode>
     *      - <deleteEdge>
     *      - <nodeNeighbor>
     *      - <numberOfEdges>
     *      - <edgeData>
     *      - <clear>
     *      - <edgeOrientation>
     *      - <edgeSource>
     *      - <edgeDestination>
     *      - <edgeCanonicalSources>
     *      - <edgeCanonicalDestinations>
     *      - <edgeSymmetricalSources>
     *      - <edgeSymmetricalDestinations>
     *      - <iterEdges>
     *
     */
    newEdge: utils._abstract_,

    /*
     * Method: deleteEdge
     *
     * (*ABSTRACT*) deletes a created edge and removes it from this graph
     *
     * deletes a created edge and removes it from this graph
     *
     * Parameters:
     *     edgeId - (*Number*) the ID for the edge to delete
     *
     * Throws:
     *      - (*Error*) if called while iterating over existing edges
     *
     * See also:
     *      - <deleteNode>
     *      - <newEdge>
     *      - <clear>
     *      - <iterEdges>
     *
     */
    deleteEdge: utils._abstract_,

    /*
     * Method: nodeNeighbor
     *
     * (*ABSTRACT*) return the node that shares the given edge with the given
     * node
     *
     * return the node that shares the given edge with the given node.  If the
     * given edge is not incident to the given node, then *-1* is returned.
     *
     * Parameters:
     *     nodeId - (*Number*) ID for the given node
     *     edgeId - (*Number*) ID for the edge along which to find the given
     *              node's neighbor
     *
     * Returns:
     *      - (*Number*) ID for the given node's neighbor that shares the given
     *        edge with it, or *-1*
     *
     * See also:
     *      - <isIncidentEdge>
     *
     */
    nodeNeighbor: utils._abstract_,

    /*
     * Method: numberOfNodes
     *
     * (*ABSTRACT*) returns the total number of nodes in this graph
     *
     * Returns:
     *      - (*number*) the total number of nodes in this graph
     *
     * See also:
     *      - <newNode>
     *      - <deleteNode>
     *      - <numberOfEdges>
     *      - <clear>
     *      - <iterNodes>
     */
    numberOfNodes: utils._abstract_,

    /*
     * Method: numberOfEdges
     *
     * (*ABSTRACT*) returns the total number of edges in this graph
     *
     * Returns:
     *      - (*number*) the total number of edges in this graph
     *
     * See also:
     *      - <newEdge>
     *      - <deleteEdge>
     *      - <numberOfEdges>
     *      - <clear>
     *      - <iterEdges>
     *
     */
    numberOfEdges: utils._abstract_,

    /*
     * Method: nodeData
     *
     * (*ABSTRACT*) get the data object associated with the given node
     *
     * Parameters:
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Object*) data object associated with the given node
     *
     * See also:
     *      - <edgeData>
     */
    nodeData: utils._abstract_,

    /*
     * Method: edgeData
     *
     * (*ABSTRACT*) get the data object associated with the given edge
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *
     * Returns:
     *      - (*Object*) data object associated with the given edge
     *
     * See also:
     *      - <nodeData>
     */
    edgeData: utils._abstract_,

    /*
     * Method: clear
     *
     * (*ABSTRACT*) removes all nodes and all edges from this graph
     *
     * See also:
     *      - <deleteNode>
     *      - <deleteEdge>
     */
    clear: utils._abstract_,

    /*
     * Method: edgeOrientation
     *
     * (*ABSTRACT*) returns the orientation of the given edge
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *
     * Returns:
     *      - (*<EDGE_ORIENTATION>*) the orientation of the given edge
     *
     * See also:
     *      - <EDGE_ORIENTATION>
     *      - <Edge Orientation Interpretation>
     *
     */
    edgeOrientation: utils._abstract_,

    /*
     * Method: edgeSource
     *
     * (*ABSTRACT*) return the source node of the given edge under the direct
     * orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *
     * Returns:
     *      - (*Number*) ID for the given edge's source node
     *
     * See also:
     *      - <edgeDestination>
     *      - <edgeCanonicalSources>
     *      - <edgeSymmetricalSources>
     *      - <Edge Orientation Interpretation>
     */
    edgeSource: utils._abstract_,

    /*
     * Method: edgeDestination
     *
     * (*ABSTRACT*) return the destination node of the given edge under the
     * direct orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *
     * Returns:
     *      - (*Number*) ID for the given edge's destination node
     *
     * See also:
     *      - <edgeSource>
     *      - <edgeCanonicalDestinations>
     *      - <edgeSymmetricalDestinations>
     *      - <Edge Orientation Interpretation>
     */
    edgeDestination: utils._abstract_,

    /*
     * Method: edgeCanonicalSources
     *
     * (*ABSTRACT*) return the source nodes of the given edge under the
     * canonical orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *
     * Returns:
     *      - (*array*) array of IDs for the given edge's source nodes
     *
     * See also:
     *      - <edgeCanonicalDestinations>
     *      - <edgeSource>
     *      - <edgeSymmetricalSources>
     *      - <Edge Orientation Interpretation>
     */
    edgeCanonicalSources: utils._abstract_,

    /*
     * Method: edgeCanonicalDestinations
     *
     * (*ABSTRACT*) return the destination nodes of the given edge under the
     * canonical orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *
     * Returns:
     *      - (*array*) array of IDs for the given edge's destination nodes
     *
     * See also:
     *      - <edgeCanonicalSources>
     *      - <edgeDestination>
     *      - <edgeSymmetricalDestinations>
     *      - <Edge Orientation Interpretation>
     */
    edgeCanonicalDestinations: utils._abstract_,

    /*
     * Method: edgeSymmetricalSources
     *
     * (*ABSTRACT*) return the source nodes of the given edge under the
     * symmetrical orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *
     * Returns:
     *      - (*array*) array of IDs for the given edge's source nodes
     *
     * See also:
     *      - <edgeSymmetricalDestinations>
     *      - <edgeCanonicalSources>
     *      - <edgeSource>
     *      - <Edge Orientation Interpretation>
     */
    edgeSymmetricalSources: utils._abstract_,

    /*
     * Method: edgeSymmetricalDestinations
     *
     * (*ABSTRACT*) return the destination nodes of the given edge under the
     * symmetrical orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *
     * Returns:
     *      - (*array*) array of IDs for the given edge's destination nodes
     *
     * See also:
     *      - <edgeSymmetricalSources>
     *      - <edgeCanonicalDestinations>
     *      - <edgeDestination>
     *      - <Edge Orientation Interpretation>
     */
    edgeSymmetricalDestinations: utils._abstract_,

    /*
     * Method: isIncidentEdge
     *
     * (*ABSTRACT*) determine if the given edge is incident to the given node
     * under the direct orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is incident to the given node
     *
     * See also:
     *      - <isDirectedEdge>
     *      - <isUndirectedEdge>
     *      - <isReversedEdge>
     *      - <isBidirectionalEdge>
     *      - <isInEdge>
     *      - <isOutEdge>
     */
    isIncidentEdge: utils._abstract_,

    /*
     * Method: isSelfEdge
     *
     * (*ABSTRACT*) determine if the given edge has the given node as both its
     * source and destination
     *
     * determines if the given edge's source node, the given edge's destination
     * node, and the given node are all one in the same.  Note that the result
     * of this method is unaffacted by orientation and is therefore the same
     * under all orientation interpretations.
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge has the given node as both its
     *        source and destination
     *
     * See also:
     *      - <edgeSource>
     *      - <edgeDestination>
     */
    isSelfEdge: utils._abstract_,

    /*
     * Method: isDirectedEdge
     *
     * (*ABSTRACT*) determine if the given edge is a directed edge incident to
     * the given node under the direct orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is a directed edge incident to
     *        the given node
     *
     * See also:
     *      - <isIncidentEdge>
     *      - <isUndirectedEdge>
     *      - <isReversedEdge>
     *      - <isBidirectionalEdge>
     *      - <isInEdge>
     *      - <isOutEdge>
     */
    isDirectedEdge: utils._abstract_,

    /*
     * Method: isUndirectedEdge
     *
     * (*ABSTRACT*) determine if the given edge is an undirected edge incident
     * to the given node under the direct orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is an undirected edge incident
     *        to the given node
     *
     * See also:
     *      - <isIncidentEdge>
     *      - <isDirectedEdge>
     *      - <isReversedEdge>
     *      - <isBidirectionalEdge>
     *      - <isInEdge>
     *      - <isOutEdge>
     */
    isUndirectedEdge: utils._abstract_,

    /*
     * Method: isReversedEdge
     *
     * (*ABSTRACT*) determine if the given edge is an reversed edge incident to
     * the given node under the direct orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is an reversed edge incident to
     *        the given node
     *
     * See also:
     *      - <isIncidentEdge>
     *      - <isDirectedEdge>
     *      - <isUndirectedEdge>
     *      - <isBidirectionalEdge>
     *      - <isInEdge>
     *      - <isOutEdge>
     */
    isReversedEdge: utils._abstract_,

    /*
     * Method: isBidirectionalEdge
     *
     * (*ABSTRACT*) determine if the given edge is a bidirectional edge incident
     * to the given node under the direct orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is a bidirectional edge
     *        incident to the given node
     *
     * See also:
     *      - <isIncidentEdge>
     *      - <isDirectedEdge>
     *      - <isUndirectedEdge>
     *      - <isReversedEdge>
     *      - <isInEdge>
     *      - <isOutEdge>
     */
    isBidirectionalEdge: utils._abstract_,

    /*
     * Method: isCanonicallyDirectedEdge
     *
     * (*ABSTRACT*) determine if the given edge is a directed edge incident to
     * the given node under the canonical orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is a directed edge incident to
     *        the given node
     *
     * See also:
     *      - <isIncidentEdge>
     *      - <isCanonicallyUndirectedEdge>
     *      - <isCanonicallyInEdge>
     *      - <isCanonicallyOutEdge>
     */
    isCanonicallyDirectedEdge: utils._abstract_,

    /*
     * Method: isCanonicallyUndirectedEdge
     *
     * (*ABSTRACT*) determine if the given edge is an undirected edge incident
     * to the given node under the canonical orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is an undirected edge incident
     *        to the given node
     *
     * See also:
     *      - <isIncidentEdge>
     *      - <isCanonicallyDirectedEdge>
     *      - <isCanonicallyInEdge>
     *      - <isCanonicallyOutEdge>
     */
    isCanonicallyUndirectedEdge: utils._abstract_,

    /*
     * Method: isSymmetricEdge
     *
     * (*ABSTRACT*) determine if the given edge is a symmetric edge incident to
     * the given node under the symmetrical orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is a symmetric edge incident to
     *        the given node
     *
     * See also:
     *      - <isIncidentEdge>
     *      - <isAsymmetricEdge>
     *      - <isSymmetricallyInEdge>
     *      - <isSymmetricallyOutEdge>
     */
    isSymmetricEdge: utils._abstract_,

    /*
     * Method: isAsymmetricEdge
     *
     * (*ABSTRACT*) determine if the given edge is an asymmetric edge incident
     * to the given node under the symmetrical orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is an asymmetric edge incident
     *        to the given node
     *
     * See also:
     *      - <isIncidentEdge>
     *      - <isSymmetricEdge>
     *      - <isSymmetricallyInEdge>
     *      - <isSymmetricallyOutEdge>
     */
    isAsymmetricEdge: utils._abstract_,

    /*
     * Method: isInEdge
     *
     * (*ABSTRACT*) determine if the given edge is incident to the given node
     * and oriented towards it under the direct orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is incident to the given node
     *        and oriented towards it
     *
     * See also:
     *      - <isIncidentEdge>
     *      - <isOutEdge>
     */
    isInEdge: utils._abstract_,

    /*
     * Method: isOutEdge
     *
     * (*ABSTRACT*) determine if the given edge is incident to the given node
     * and oriented away from it under the direct orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is incident to the given node
     *        and oriented away from it
     *
     * See also:
     *      - <isIncidentEdge>
     *      - <isInEdge>
     */
    isOutEdge: utils._abstract_,

    /*
     * Method: isCanonicallyInEdge
     *
     * (*ABSTRACT*) determine if the given edge is incident to the given node
     * and oriented towards it under the canonical orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is incident to the given node
     *        and oriented towards it
     *
     * See also:
     *      - <isIncidentEdge>
     *      - <isCanonicallyOutEdge>
     */
    isCanonicallyInEdge: utils._abstract_,

    /*
     * Method: isCanonicallyOutEdge
     *
     * (*ABSTRACT*) determine if the given edge is incident to the given node
     * and oriented away from it under the canonical orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is incident to the given node
     *        and oriented away from it
     *
     * See also:
     *      - <isIncidentEdge>
     *      - <isCanonicallyInEdge>
     */
    isCanonicallyOutEdge: utils._abstract_,

    /*
     * Method: isSymmetricallyInEdge
     *
     * (*ABSTRACT*) determine if the given edge is incident to the given node
     * and oriented towards it under the symmetrical orientation interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is incident to the given node
     *        and oriented towards it
     *
     * See also:
     *      - <isIncidentEdge>
     *      - <isSymmetricallyOutEdge>
     */
    isSymmetricallyInEdge: utils._abstract_,

    /*
     * Method: isSymmetricallyOutEdge
     *
     * (*ABSTRACT*) determine if the given edge is incident to the given node
     * and oriented away from it under the symmetrical orientation
     * interpretation
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *     nodeId - (*Number*) ID for the given node
     *
     * Returns:
     *      - (*Boolean*) whether the given edge is incident to the given node
     *        and oriented away from it
     *
     * See also:
     *      - <isIncidentEdge>
     *      - <isSymmetricallyInEdge>
     */
    isSymmetricallyOutEdge: utils._abstract_,

    /*
     * Method: iterNodes
     *
     * (*ABSTRACT*) iterate over this graph's nodes
     *
     * iterates over this graph's nodes, calling the provided callback function
     * with the ID for each node as its sole argument.  The iteration ends once
     * all node IDs are passed or when the callback function returns a value
     * that evaluates as true in a boolean context.
     *
     * Parameters:
     *     callback - (*function*) the function to call for each node ID
     *
     * Throws:
     *      - (*Error*) if the callback function attempts to modify this graph
     *        by adding or removing nodes or edges
     *
     * See also:
     *      - <newNode>
     *      - <deleteNode>
     *      - <newEdge>
     *      - <deleteEdge>
     *      - <clear>
     *      - <iterEdges>
     */
    iterNodes: utils._abstract_,

    /*
     * Method: iterEdges
     *
     * (*ABSTRACT*) iterate over this graph's edges
     *
     * iterates over this graph's edges, calling the provided callback function
     * with the ID for each edge as its sole argument.  If nodeId is given, then
     * the iteration is restricted to edges incident to the given node.  The
     * iteration ends once all edge IDs are passed or when the callback
     * function returns a value that evaluates as true in a boolean context.
     *
     * Parameters:
     *     [nodeId] - (*Number*) optional ID for a given node
     *     callback - (*function*) the function to call for each edge ID
     *
     * Throws:
     *      - (*Error*) if the callback function attempts to modify this graph
     *        by adding or removing nodes or edges
     *
     * See also:
     *      - <newNode>
     *      - <deleteNode>
     *      - <newEdge>
     *      - <deleteEdge>
     *      - <clear>
     *      - <iterNodes>
     */
    iterEdges: utils._abstract_
});

module.exports = AbstractGraph;

