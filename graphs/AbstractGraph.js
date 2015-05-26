
/**
 * @file
 * @brief abstract graph data structure API
 */

"use strict";

var utils = require("../misc/utils");
var EDGE_ORIENTATION = require("./EDGE_ORIENTATION");

/**
 * @class AbstractGraph
 * @brief abstract class for graphs of different topologies
 * @pure
 *
 * @details The @ref AbstractGraph class defines all the methods that concrete
 * subclasses need to implement in order to provide a complete graph interface.
 * The abstract API is designed to accommodate graph types of topologies as
 * generic as arbitrarily connected directed graphs while also allowing graph
 * types of simpler or more regular topologies to offer the same interface while
 * internally taking advantage of their simplicity.
 *
 * For example, where an arbitrarily connected directed graph might need to
 * explicitly track each of its nodes and edges as individual objects, complete
 * with orientation information; an undirected variant might only need to track
 * edges internally using a list of node pairs and present all edges as having
 * an orientation of @ref EDGE_ORIENTATION.UNDIRECTED.  Another typical
 * possibility might be a highly structured graph type, such as a flat torus
 * that can take advantage of its regular and structural features to use an
 * entirely implicit edge tracking scheme.
 *
 * @sa @ref DirectedGraph
 * @sa @ref FlatTorus
 *
 * @ingroup torusvis_graphs
 */
function AbstractGraph() { utils._abstract_(); }

utils.extend(AbstractGraph.prototype, {
    constructor: AbstractGraph,

    /**
     * @fn Number newNode()
     * @brief creates a new node and adds it to this graph
     * @pure
     *
     * @details the returned handle representing the created node should be a
     * non-negative integral ```Number```.  Node handles returned by this
     * function are usable as an index into an ```Array``` and may be passed to
     * other methods expecting a node handle.
     *
     * @return the created node's handle
     *
     * @throws Error if called while iterating over existing nodes
     *
     * @sa @ref deleteNode
     * @sa @ref newEdge
     * @sa @ref nodeNeighbor
     * @sa @ref numberOfNodes
     * @sa @ref nodeData
     * @sa @ref iterNodes
     *
     * @memberof AbstractGraph
     */
    newNode: utils._abstract_,

    /**
     * @fn AbstractGraph deleteNode(Number nodeHandle)
     * @brief deletes a created node and removes it from this graph
     * @pure
     *
     * @details deletes a created node and removes it from this graph.  Any
     * edges incident to the given node are also removed.
     *
     * @param[in] nodeHandle the Handle of the node to delete
     *
     * @return ```this```
     *
     * @throws Error if called while iterating over existing nodes
     * @throws Error if called while iterating over existing edges
     *
     * @sa @ref newNode
     * @sa @ref deleteEdge
     * @sa @ref clear
     * @sa @ref iterNodes
     * @sa @ref iterEdges
     *
     * @memberof AbstractGraph
     */
    deleteNode: utils._abstract_,

    /**
     * @fn Number newEdge(                               \
     *         Number srcHandle,                         \
     *         Number dstId,                             \
     *         EDGE_ORIENTATION orientation = UNDIRECTED \
     * )
     *
     * @brief creates a new edge and adds it to this graph
     * @pure
     *
     * @details the returned handle representing the created edge should be a
     * non-negative integral ```Number```.  Edge handles returned by this
     * function should be usable as an index into an ```Array``` and may be
     * passed to other methods expecting an edge handle.
     *
     * @param[in] srcHandle handle for the source node
     * @param[in] dstHandle handle for the destination node
     * @param[in] orientation orientation of the created edge
     *
     * @return the created edge's handle
     *
     * @throws Error if called while iterating over existing edges
     *
     * @sa @ref newNode
     * @sa @ref deleteEdge
     * @sa @ref nodeNeighbor
     * @sa @ref numberOfEdges
     * @sa @ref edgeData
     * @sa @ref clear
     * @sa @ref edgeOrientation
     * @sa @ref edgeSource
     * @sa @ref edgeDestination
     * @sa @ref edgeCanonicalSources
     * @sa @ref edgeCanonicalDestinations
     * @sa @ref edgeSymmetricalSources
     * @sa @ref edgeSymmetricalDestinations
     * @sa @ref iterEdges
     *
     * @memberof AbstractGraph
     */
    newEdge: utils._abstract_,

    /**
     * @fn AbstractGraph deleteEdge(Number edgeHandle)
     * @brief deletes a created edge and removes it from this graph
     * @pure
     *
     * @param[in] edgeHandle the handle for the edge to delete
     *
     * @return ```this```
     *
     * @throws Error if called while iterating over existing edges
     *
     * @sa @ref deleteNode
     * @sa @ref newEdge
     * @sa @ref clear
     * @sa @ref iterEdges
     *
     * @memberof AbstractGraph
     */
    deleteEdge: utils._abstract_,

    /**
     * @fn Number nodeNeighbor(Number nodeHandle, Number edgeHandle)
     * @brief return the node that shares the given edge with the given node
     * @pure
     *
     * @details return the node that shares the given edge with the given node.
     * If the given edge is not incident to the given node, then ```-1``` is
     * returned.
     *
     * @param[in] nodeHandle handle for the given node
     * @param[in] edgeHandle handle for the edge along which to find the given
     *                       node's neighbor
     *
     * @return handle for the given node's neighbor that shares the given edge
     *         with it, or ```-1```
     *
     * @sa @ref isIncidentEdge
     *
     * @memberof AbstractGraph
     */
    nodeNeighbor: utils._abstract_,

    /**
     * @fn Number numberOfNodes()
     * @brief returns the total number of nodes in this graph
     * @pure
     *
     * @return the total number of nodes in this graph
     *
     * @sa @ref newNode
     * @sa @ref deleteNode
     * @sa @ref numberOfEdges
     * @sa @ref clear
     * @sa @ref iterNodes
     *
     * @memberof AbstractGraph
     */
    numberOfNodes: utils._abstract_,

    /**
     * @fn Number numberOfEdges()
     * @brief returns the total number of edges in this graph
     * @pure
     *
     * @return the total number of edges in this graph
     *
     * @sa @ref newEdge
     * @sa @ref deleteEdge
     * @sa @ref numberOfEdges
     * @sa @ref clear
     * @sa @ref iterEdges
     *
     * @memberof AbstractGraph
     */
    numberOfEdges: utils._abstract_,

    /**
     * @fn Object nodeData(Number nodeHandle)
     * @brief get the data object associated with the given node
     * @pure
     *
     * @param[in] nodeHandle handle for the given node
     *
     * @return data object associated with the given node
     *
     * @sa @ref edgeData
     *
     * @memberof AbstractGraph
     */
    nodeData: utils._abstract_,

    /**
     * @fn Object edgeData(Number edgeHandle)
     * @brief get the data object associated with the given edge
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     *
     * @return data object associated with the given edge
     *
     * @sa @ref nodeData
     *
     * @memberof AbstractGraph
     */
    edgeData: utils._abstract_,

    /**
     * @fn AbstractGraph clear()
     * @brief removes all nodes and all edges from this graph
     * @pure
     *
     * @return ```this```
     *
     * @sa @ref deleteNode
     * @sa @ref deleteEdge
     *
     * @memberof AbstractGraph
     */
    clear: utils._abstract_,

    /**
     * @fn EDGE_ORIENTATION edgeOrientation(Number edgeHandle)
     * @brief returns the orientation of the given edge
     * @pure
     *
     * param[in] edgeHandle handle for the given edge
     *
     * @return the orientation of the given edge
     *
     * @sa @ref EDGE_ORIENTATION
     * @sa @ref EdgeOrientationInterpretation
     *
     * @memberof AbstractGraph
     */
    edgeOrientation: utils._abstract_,

    /**
     * @fn Number edgeSource(Number edgeHandle)
     * @brief return the source node of the given edge under the direct
     * orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     *
     * @return handle for the given edge's source node
     *
     * @sa @ref edgeDestination
     * @sa @ref edgeCanonicalSources
     * @sa @ref edgeSymmetricalSources
     * @sa @ref EdgeOrientationInterpretation
     *
     * @memberof AbstractGraph
     */
    edgeSource: utils._abstract_,

    /**
     * @fn Number edgeDestination(Number edgeHandle)
     * @brief return the destination node of the given edge under the direct
     * orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     *
     * @return handle for the given edge's destination node
     *
     * @sa @ref edgeSource
     * @sa @ref edgeCanonicalDestinations
     * @sa @ref edgeSymmetricalDestinations
     * @sa @ref EdgeOrientationInterpretation
     *
     * @memberof AbstractGraph
     */
    edgeDestination: utils._abstract_,

    /**
     * @fn Array<Number> edgeCanonicalSources(Number edgeHandle)
     * @brief return the source nodes of the given edge under the canonical
     * orientation interpretation
     * @pure
     *
     * param[in] edgeHandle handle for the given edge
     *
     * @return array of handles for the given edge's source nodes
     *
     * @sa @ref edgeCanonicalDestinations
     * @sa @ref edgeSource
     * @sa @ref edgeSymmetricalSources
     * @sa @ref EdgeOrientationInterpretation
     *
     * @memberof AbstractGraph
     */
    edgeCanonicalSources: utils._abstract_,

    /**
     * @fn Array<Number> edgeCanonicalDestinations(Number edgeHandle)
     * @brief return the destination nodes of the given edge under the canonical
     * orientation interpretation
     * @pure
     *
     * param[in] edgeHandle handle for the given edge
     *
     * @return array of handles for the given edge's destination nodes
     *
     * @sa @ref edgeCanonicalSources
     * @sa @ref edgeDestination
     * @sa @ref edgeSymmetricalDestinations
     * @sa @ref EdgeOrientationInterpretation
     *
     * @memberof AbstractGraph
     */
    edgeCanonicalDestinations: utils._abstract_,

    /**
     * @fn Array<Number> edgeSymmetricalSources(Number edgeHandle)
     * @brief return the source nodes of the given edge under the symmetrical
     * orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     *
     * @return array of handles for the given edge's source nodes
     *
     * @sa @ref edgeSymmetricalDestinations
     * @sa @ref edgeCanonicalSources
     * @sa @ref edgeSource
     * @sa @ref EdgeOrientationInterpretation
     *
     * @memberof AbstractGraph
     */
    edgeSymmetricalSources: utils._abstract_,

    /**
     * @fn Array<Number> edgeSymmetricalDestinations(Number edgeHandle)
     * @brief return the destination nodes of the given edge under the
     * symmetrical orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     *
     * @return array of handles for the given edge's destination nodes
     *
     * @sa @ref edgeSymmetricalSources
     * @sa @ref edgeCanonicalDestinations
     * @sa @ref edgeDestination
     * @sa @ref EdgeOrientationInterpretation
     *
     * @memberof AbstractGraph
     */
    edgeSymmetricalDestinations: utils._abstract_,

    /**
     * @fn Boolean isIncidentEdge(Number edgeHandle, Number nodeHandle)
     * @brief determine if the given edge is incident to the given node under
     * the direct orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is incident to the given node
     *
     * @sa @ref isDirectedEdge
     * @sa @ref isUndirectedEdge
     * @sa @ref isReversedEdge
     * @sa @ref isBidirectionalEdge
     * @sa @ref isInEdge
     * @sa @ref isOutEdge
     *
     * @memberof AbstractGraph
     */
    isIncidentEdge: utils._abstract_,

    /**
     * @fn Boolean isSelfEdge(Number edgeHandle, Number nodeHandle)
     * @brief determine if the given edge has the given node as both its source
     * and destination
     * @pure
     *
     * @details determines if the given edge's source node, the given edge's
     * destination node, and the given node are all one in the same.  Note that
     * the result of this method is unaffacted by orientation and is therefore
     * the same under all orientation interpretations.
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge has the given node as both its source and
     * destination
     *
     * @sa @ref edgeSource
     * @sa @ref edgeDestination
     *
     * @memberof AbstractGraph
     */
    isSelfEdge: utils._abstract_,

    /**
     * @fn Boolean isDirectedEdge(Number edgeHandle, Number nodeHandle)
     * @brief determine if the given edge is a directed edge incident to the
     * given node under the direct orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is a directed edge incident to the given
     * node
     *
     * @sa @ref isIncidentEdge
     * @sa @ref isUndirectedEdge
     * @sa @ref isReversedEdge
     * @sa @ref isBidirectionalEdge
     * @sa @ref isInEdge
     * @sa @ref isOutEdge
     *
     * @memberof AbstractGraph
     */
    isDirectedEdge: utils._abstract_,

    /**
     * @fn Boolean isUndirectedEdge(Number edgeHandle, Number nodeHandle)
     * @brief determine if the given edge is an undirected edge incident to the
     * given node under the direct orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is an undirected edge incident to the
     * given node
     *
     * @sa @ref isIncidentEdge
     * @sa @ref isDirectedEdge
     * @sa @ref isReversedEdge
     * @sa @ref isBidirectionalEdge
     * @sa @ref isInEdge
     * @sa @ref isOutEdge
     *
     * @memberof AbstractGraph
     */
    isUndirectedEdge: utils._abstract_,

    /**
     * @fn Boolean isReversedEdge(Number edgeHandle, Number nodeHandle)
     * @brief determine if the given edge is an reversed edge incident to the
     * given node under the direct orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is an reversed edge incident to the given
     * node
     *
     * @sa @ref isIncidentEdge
     * @sa @ref isDirectedEdge
     * @sa @ref isUndirectedEdge
     * @sa @ref isBidirectionalEdge
     * @sa @ref isInEdge
     * @sa @ref isOutEdge
     *
     * @memberof AbstractGraph
     */
    isReversedEdge: utils._abstract_,

    /**
     * @fn Boolean isBidirectionalEdge(Number edgeHandle, Number nodeHandle)
     * @brief determine if the given edge is a bidirectional edge incident to
     * the given node under the direct orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is a bidirectional edge incident to the
     * given node
     *
     * @sa @ref isIncidentEdge
     * @sa @ref isDirectedEdge
     * @sa @ref isUndirectedEdge
     * @sa @ref isReversedEdge
     * @sa @ref isInEdge
     * @sa @ref isOutEdge
     *
     * @memberof AbstractGraph
     */
    isBidirectionalEdge: utils._abstract_,

    /**
     * @fn Boolean isCanonicallyDirectedEdge( \
     *         Number edgeHandle,             \
     *         Number nodeHandle              \
     *     )
     *
     * @brief determine if the given edge is a directed edge incident to the
     * given node under the canonical orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is a directed edge incident to the given
     * node
     *
     * @sa @ref isIncidentEdge
     * @sa @ref isCanonicallyUndirectedEdge
     * @sa @ref isCanonicallyInEdge
     * @sa @ref isCanonicallyOutEdge
     *
     * @memberof AbstractGraph
     */
    isCanonicallyDirectedEdge: utils._abstract_,

    /**
     * @fn Boolean isCanonicallyUndirectedEdge( \
     *         Number edgeHandle,               \
     *         Number nodeHandle                \
     *     )
     *
     * @brief determine if the given edge is an undirected edge incident to the
     * given node under the canonical orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is an undirected edge incident to the
     * given node
     *
     * @sa @ref isIncidentEdge
     * @sa @ref isCanonicallyDirectedEdge
     * @sa @ref isCanonicallyInEdge
     * @sa @ref isCanonicallyOutEdge
     *
     * @memberof AbstractGraph
     */
    isCanonicallyUndirectedEdge: utils._abstract_,

    /**
     * @fn Boolean isSymmetricEdge(Number edgeHandle, Number nodeHandle)
     * @brief determine if the given edge is a symmetric edge incident to the
     * given node under the symmetrical orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is a symmetric edge incident to the given
     * node
     *
     * @sa @ref isIncidentEdge
     * @sa @ref isAsymmetricEdge
     * @sa @ref isSymmetricallyInEdge
     * @sa @ref isSymmetricallyOutEdge
     *
     * @memberof AbstractGraph
     */
    isSymmetricEdge: utils._abstract_,

    /**
     * @fn Boolean isAsymmetricEdge(Number edgeHandle, Number nodeHandle)
     * @brief determine if the given edge is an asymmetric edge incident to the
     * given node under the symmetrical orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is an asymmetric edge incident to the
     * given node
     *
     * @sa @ref isIncidentEdge
     * @sa @ref isSymmetricEdge
     * @sa @ref isSymmetricallyInEdge
     * @sa @ref isSymmetricallyOutEdge
     *
     * @memberof AbstractGraph
     */
    isAsymmetricEdge: utils._abstract_,

    /**
     * @fn Boolean isInEdge(Number edgeHandle, Number nodeHandle)
     * @brief determine if the given edge is incident to the given node and
     * oriented towards it under the direct orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is incident to the given node and oriented
     * towards it
     *
     * @sa @ref isIncidentEdge
     * @sa @ref isOutEdge
     *
     * @memberof AbstractGraph
     */
    isInEdge: utils._abstract_,

    /**
     * @fn Boolean isOutEdge(Number edgeHandle, Number nodeHandle)
     * @brief determine if the given edge is incident to the given node and
     * oriented away from it under the direct orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is incident to the given node and oriented
     * away from it
     *
     * @sa @ref isIncidentEdge
     * @sa @ref isInEdge
     *
     * @memberof AbstractGraph
     */
    isOutEdge: utils._abstract_,

    /**
     * @fn Boolean isCanonicallyInEdge(Number edgeHandle, Number nodeHandle)
     * @brief determine if the given edge is incident to the given node and
     * oriented towards it under the canonical orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is incident to the given node and oriented
     * towards it
     *
     * @sa @ref isIncidentEdge
     * @sa @ref isCanonicallyOutEdge
     *
     * @memberof AbstractGraph
     */
    isCanonicallyInEdge: utils._abstract_,

    /**
     * @fn Boolean isCanonicallyOutEdge(Number edgeHandle, Number nodeHandle)
     * @brief determine if the given edge is incident to the given node and
     * oriented away from it under the canonical orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is incident to the given node and oriented
     * away from it
     *
     * @sa @ref isIncidentEdge
     * @sa @ref isCanonicallyInEdge
     *
     * @memberof AbstractGraph
     */
    isCanonicallyOutEdge: utils._abstract_,

    /**
     * @fn Boolean isSymmetricallyInEdge(Number edgeHandle, Number nodeHandle)
     * @brief determine if the given edge is incident to the given node and
     * oriented towards it under the symmetrical orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is incident to the given node and oriented
     * towards it
     *
     * @sa @ref isIncidentEdge
     * @sa @ref isSymmetricallyOutEdge
     *
     * @memberof AbstractGraph
     */
    isSymmetricallyInEdge: utils._abstract_,

    /**
     * @fn Boolean isSymmetricallyOutEdge(Number edgeHandle, Number nodeHandle)
     * @brief determine if the given edge is incident to the given node and
     * oriented away from it under the symmetrical orientation interpretation
     * @pure
     *
     * @param[in] edgeHandle handle for the given edge
     * @param[in] nodeHandle handle for the given node
     *
     * @return whether the given edge is incident to the given node and oriented
     * away from it
     *
     * @sa @ref isIncidentEdge
     * @sa @ref isSymmetricallyInEdge
     *
     * @memberof AbstractGraph
     */
    isSymmetricallyOutEdge: utils._abstract_,

    /**
     * @fn void iterNodes(Function callback)
     * @brief iterate over this graph's nodes
     * @pure
     *
     * @details iterates over this graph's nodes. ```callback``` must conform to
     * the following signature:
     * @code{.cpp}
     *     Boolean callback(Number, String, AbstractGraph)
     * @endcode
     * For each node, ```callback``` is called with its handle, ```null```, and
     * ```this```, respectively.  If ```callback``` returns ```true```, then the
     * iteration ends early.
     *
     * @param[in] callback the function to call for each node
     *
     * @throws Error if the callback function attempts to modify this graph by
     * adding or removing nodes or edges
     *
     * @sa @ref newNode
     * @sa @ref deleteNode
     * @sa @ref newEdge
     * @sa @ref deleteEdge
     * @sa @ref clear
     * @sa @ref iterEdges
     *
     * @memberof AbstractGraph
     */
    iterNodes: utils._abstract_,

    /**
     * @fn void iterEdges(Function callback)
     * @brief iterate over this graph's edges
     * @pure
     *
     * @details iterates over this graph's edges. ```callback``` must conform to
     * the following signature:
     * @code{.cpp}
     *     Boolean callback(Number, String, AbstractGraph)
     * @endcode
     * For each edge, ```callback``` is called with its handle, ```null```, and
     * ```this```, respectively.  If ```callback``` returns ```true```, then the
     * iteration ends early.
     *
     * @param[in] callback the function to call for each edge handle
     *
     * @throws Error if the callback function attempts to modify this graph by
     * adding or removing nodes or edges
     *
     * @sa @ref newNode
     * @sa @ref deleteNode
     * @sa @ref newEdge
     * @sa @ref deleteEdge
     * @sa @ref clear
     * @sa @ref iterNodes
     *
     * @memberof AbstractGraph
     */

    /**
     * @fn void iterEdges(Number nodeHandle, Function callback)
     * @brief iterate over the edges incident on the given node
     * @pure
     *
     * @details iterates over the edges incident on the given node (as in
     * ```iterEdges(callback)```)
     *
     * @param[in] nodeHandle handle to the given node
     * @param[in] callback the function to call for each edge handle
     *
     * @throws Error if the callback function attempts to modify this graph by
     * adding or removing nodes or edges
     *
     * @sa @ref newNode
     * @sa @ref deleteNode
     * @sa @ref newEdge
     * @sa @ref deleteEdge
     * @sa @ref clear
     * @sa @ref iterNodes
     *
     * @memberof AbstractGraph
     */
    iterEdges: utils._abstract_
});

module.exports = AbstractGraph;

