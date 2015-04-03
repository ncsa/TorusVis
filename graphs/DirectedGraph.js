
/*
 * File: directedGraph
 *
 * directed graph implementation
 */

"use strict";

var utils = require("../misc/utils");
var AbstractGraph = require("./AbstractGraph");
var EDGE_ORIENTATION = require("./EDGE_ORIENTATION");

/*
 * Class: DirectedGraph
 *
 * directed graph implementation
 *
 * <DirectedGraphs> serve as a highly general data structure for representing
 * various graphs.  Nodes and edges are stored in a fully explicit scheme,
 * allowing their use in representing complex and irregular topologies.
 *
 * Extends:
 *      - <AbstractGraph>
 */

/*
 * Constructor: constructor
 *
 * constructs a new <DirectedGraph> with no nodes or edges
 */
function DirectedGraph() {
    this.nodeIdAllocator = new utils.IdAllocator();
    this.edgeIdAllocator = new utils.IdAllocator();

    this.nodeIterGuard = new utils.IterationGuard();
    this.edgeIterGuard = new utils.IterationGuard();

    this.edgeIterGuard.setException(
        new Error("cannot add or remove nodes while iterating over them")
    );

    this.edgeIterGuard.setException(
        new Error("cannot add or remove edges while iterating over them")
    );

    this._clear();
}

utils.extend(DirectedGraph.prototype, AbstractGraph.prototype);
utils.extend(DirectedGraph.prototype, {
    constructor: DirectedGraph,

    _clear:
    /*
     * Method: _clear
     *
     * (*INTERNAL*) helper method for clearing this graph
     *
     * See also:
     *     - <clear>
     */
    function _clear() {
        this.nodes = new utils.OrderedMap();
        this.edges = new utils.OrderedMap();

        this.nodeIdAllocator.freeAll();
        this.edgeIdAllocator.freeAll();
        this.edgeIteratorCache = { };

        this.nodeEntryList = [];
        this.edgeEntryList = [];
    },

    _computeEdges:
    /*
     * Method: _computeEdges
     *
     * (*INTERNAL*) helper method for computing incident edges
     *
     * computes the set of edges incident to the given node.  The results are
     * cached to speed up future incidence queries.
     *
     * Parameters:
     *     nodeId - (*Number*) ID for the given node
     *
     * See also:
     *      - <_deleteNode>
     *      - <iterNodes>
     */
    function _computeEdges(nodeId) {
        if(!(nodeId in this.edgeIteratorCache)) {
            /* collect all edges incident to this node */
            var incidentEdges = new utils.OrderedMap();

            /* edges entering this node */
            var inNeighbors = this.nodeEntryList[nodeId].inNeighborSet;
            utils.iter(inNeighbors, function(edgeId, key) {
                incidentEdges.set(String(edgeId), edgeId);
            });

            /* edges leaving this node */
            var outNeighbors = this.nodeEntryList[nodeId].outNeighborSet;
            utils.iter(outNeighbors, function(edgeId, key) {
                incidentEdges.set(String(edgeId), edgeId);
            });

            this.edgeIteratorCache[nodeId] = incidentEdges;
        }

        return this.edgeIteratorCache[nodeId];
    },

    _deleteEdge:
    /*
     * Method: _deleteEdge
     *
     * (*INTERNAL*) helper method for deleting an edge
     *
     * See also:
     *      - <deleteEdge>
     */ 
    function _deleteEdge(edgeId) {
        var edgeEntry = this.edgeEntryList[edgeId];

        var srcId = edgeEntry.srcId;
        var dstId = edgeEntry.dstId;
        var orientation = edgeEntry.orientation;

        /* is there a connection from srcId to dstId? */
        var src2dst = (
            orientation === EDGE_ORIENTATION.UNDIRECTED    ||
            orientation === EDGE_ORIENTATION.DIRECTED      ||
            orientation === EDGE_ORIENTATION.BIDIRECTIONAL
        );

        /* is there a connection from dstId to srcId? */
        var dst2src = (
            orientation === EDGE_ORIENTATION.UNDIRECTED    ||
            orientation === EDGE_ORIENTATION.REVERSED      ||
            orientation === EDGE_ORIENTATION.BIDIRECTIONAL
        );

        if(src2dst) {
            delete this.nodeEntryList[srcId].outNeighborSet[dstId];
            delete this.nodeEntryList[dstId].inNeighborSet[srcId];
        }

        if(dst2src) {
            delete this.nodeEntryList[dstId].outNeighborSet[srcId];
            delete this.nodeEntryList[srcId].inNeighborSet[dstId];
        }

        this.edges.unset(String(edgeId));
        this.edgeIdAllocator.free(edgeId);
    },

    _deleteNode:
    /*
     * Method: _deleteNode
     *
     * (*INTERNAL*) helper method for deleting nodes
     *
     * See also:
     *      - <deleteNode>
     */
    function _deleteNode(nodeId) {
        /* remove all edges incident to this node */
        var incidentEdges = this._computeEdges(nodeId);
        var self = this;
        utils.iter(incidentEdges, function(edgeId, key) {
            self._deleteEdge(edgeId);
        });

        this.nodes.unset(String(nodeId));
        this.nodeIdAllocator.free(nodeId);
    },

    _newEdge:
    /*
     * Method: _newEdge
     *
     * (*INTERNAL*) helper method for creating new edges
     *
     * See also:
     *      - <newEdge>
     */
    function _newEdge(srcId, dstId, orientation) {
        orientation = orientation || EDGE_ORIENTATION.UNDIRECTED;

        var edgeId = this.edgeIdAllocator.alloc();
        utils.reserve(this.edgeEntryList, edgeId);

        this.edgeEntryList[edgeId] = {
            src: srcId,
            dst: dstId,
            orientation: orientation,
            data: {}
        };

        /* is there a connection from src to dst? */
        var src2dst = (
            orientation === EDGE_ORIENTATION.UNDIRECTED    ||
            orientation === EDGE_ORIENTATION.DIRECTED      ||
            orientation === EDGE_ORIENTATION.BIDIRECTIONAL
        );

        /* is there a connection from dst to src? */
        var dst2src = (
            orientation === EDGE_ORIENTATION.UNDIRECTED    ||
            orientation === EDGE_ORIENTATION.REVERSED      ||
            orientation === EDGE_ORIENTATION.BIDIRECTIONAL
        );

        if(src2dst) {
            this.nodeEntryList[srcId].outNeighborSet[dstId] = edgeId;
            this.nodeEntryList[dstId].inNeighborSet[srcId] = edgeId;
        }

        if(dst2src) {
            this.nodeEntryList[srcId].inNeighborSet[dstId] = edgeId;
            this.nodeEntryList[dstId].outNeighborSet[srcId] = edgeId;
        }

        this.edges.set(String(edgeId), edgeId);

        return edgeId;
    },

    _newNode:
    /*
     * Method: _newNode
     *
     * (*INTERNAL*) helper method for creating new nodes
     *
     * See also:
     *      - <newNode>
     */
    function _newNode(data) {
        var nodeId = this.nodeIdAllocator.alloc();
        utils.reserve(this.nodeEntryList, nodeId);

        if(utils.isNull(data)) {
            data = {};
        }

        this.nodeEntryList[nodeId] = {
            data: data,
            inNeighborSet: {},
            outNeighborSet: {}
        };

        this.nodes.set(String(nodeId), nodeId);

        return nodeId;
    },

    clear:
    /*
     * Method: clear
     *
     * Implements:
     *      - <AbstractGraph.clear>
     */
    function clear() {
        utils.IterationGuard.check([this.nodeIterGuard, this.edgeIterGuard]);
        var result = this._clear.apply(this, arguments);
        return result;
    },

    newNode:
    /*
     * Method: newNode
     *
     * Implements:
     *      - <AbstractGraph.newNode>
     */
    function newNode(data) {
        this.nodeIterGuard.check();
        var result = this._newNode.apply(this, arguments);
        return result;
    },

    nodeNeighbor:
    /*
     * Method: nodeNeighbor
     *
     * Implements:
     *      - <AbstractGraph.nodeNeighbor>
     */
    function nodeNeighbor(nodeId, edgeId) {
        var edgeEntry = this.edgeEntryList[edgeId];
        return (
            edgeEntry.src === nodeId ? edgeEntry.dst
          : edgeEntry.dst === nodeId ? edgeEntry.src
          : null
        );
    },

    getNodeId:
    /*
     * Method: getNodeId
     *
     * Implements:
     *      - <AbstractGraph.getNodeId>
     */
    function getNodeId(nodeId) {
        return nodeId;
    },

    numberOfNodes:
    /*
     * Method: numberOfNodes
     *
     * Implements:
     *      - <AbstractGraph.numberOfNodes>
     */
    function numberOfNodes() {
        return this.nodes.length();
    },

    getNodeById:
    /*
     * Method: getNodeById
     *
     * Implements:
     *      - <AbstractGraph.getNodeById>
     */
    function getNodeById(id) {
        return id;
    },

    getEdgeId:
    /*
     * Method: getEdgeId
     *
     * Implements:
     *      - <AbstractGraph.getEdgeId>
     */
    function getEdgeId(edgeId) {
        return edgeId;
    },

    deleteNode:
    /*
     * Method: deleteNode
     *
     * Implements:
     *      - <AbstractGraph.deleteNode>
     */
    function deleteNode() {
        this.nodeIterGuard.check();
        try {
            this.edgeIterGuard.check();
        } catch(e) {
            throw Error("cannot remove nodes while iterating over edges");
        }

        var result = this._deleteNode.apply(this, arguments);
        return result;
    },

    nodeData:
    /*
     * Method: nodeData
     *
     * Implements:
     *      - <AbstractGraph.nodeData>
     */
    function nodeData(nodeId) {
        return this.nodeEntryList[nodeId].data;
    },

    newEdge:
    /*
     * Method: newEdge
     *
     * Implements:
     *      - <AbstractGraph.newEdge>
     */
    function newEdge() {
        this.edgeIterGuard.check();
        var result = this._newEdge.apply(this, arguments);
        return result;
    },

    numberOfEdges:
    /*
     * Method: numberOfEdges
     *
     * Implements:
     *      - <AbstractGraph.numberOfEdges>
     */
    function numberOfEdges() {
        return this.edges.length();
    },

    getEdgeById:
    /*
     * Method: getEdgeById
     *
     * Implements:
     *      - <AbstractGraph.getEdgeById>
     */
    function getEdgeById(id) {
        return id;
    },

    deleteEdge:
    /*
     * Method: deleteEdge
     *
     * Implements:
     *      - <AbstractGraph.deleteEdge>
     */
    function deleteEdge() {
        this.edgeIterGuard.check();

        var result = this._deleteEdge.apply(this, arguments);
        return result;
    },

    edgeData:
    /*
     * Method: edgeData
     *
     * Implements:
     *      - <AbstractGraph.edgeData>
     */
    function edgeData(edgeId) {
        return this.edgeEntryList[edgeId].data;
    },

    edgeOrientation:
    /*
     * Method: edgeOrientation
     *
     * Implements:
     *      - <AbstractGraph.edgeOrientation>
     */
    function edgeOrientation(edgeId) {
        var result = this.edgeEntryList[edgeId].orientation;
        return result;
    },

    edgeSource:
    /*
     * Method: edgeSource
     *
     * Implements:
     *      - <AbstractGraph.edgeSource>
     */
    function edgeSource(edgeId) {
        var result = this.edgeEntryList[edgeId].src;
        return result;
    },

    edgeDestination:
    /*
     * Method: edgeDestination
     *
     * Implements:
     *      - <AbstractGraph.edgeDestination>
     */
    function edgeDestination(edgeId) {
        var result = this.edgeEntryList[edgeId].dst;
        return result;
    },

    edgeCanonicalSources:
    /*
     * Method: edgeCanonicalSources
     *
     * Implements:
     *      - <AbstractGraph.edgeCanonicalSources>
     */
    function edgeCanonicalSources(edgeId) {
        var edgeEntry = this.edgeEntryList[edgeId];
        var result;

        switch(edgeEntry.orientation) {
        case EDGE_ORIENTATION.DIRECTED:
            result = [edgeEntry.src];
            break;
        case EDGE_ORIENTATION.REVERSED:
            result = [edgeEntry.dst];
            break;
        case EDGE_ORIENTATION.UNDIRECTED:
            result = [];
            break;
        case EDGE_ORIENTATION.BIDIRECTIONAL:
            if(edgeEntry.src === edgeEntry.dst) { result = [edgeEntry.src]; }
            else { result = [edgeEntry.src, edgeEntry.dst]; }
            break;
        default:
            throw Error("invalid edge orientation");
        }

        return result;
    },

    edgeCanonicalDestinations:
    /*
     * Method: edgeCanonicalDestinations
     *
     * Implements:
     *      - <AbstractGraph.edgeCanonicalDestinations>
     */
    function edgeCanonicalDestinations(edgeId) {
        var edgeEntry = this.edgeEntryList[edgeId];
        var result;

        switch(edgeEntry.orientation) {
        case EDGE_ORIENTATION.DIRECTED:
            result = [edgeEntry.dst];
            break;
        case EDGE_ORIENTATION.REVERSED:
            result = [edgeEntry.src];
            break;
        case EDGE_ORIENTATION.UNDIRECTED:
            result = [];
            break;
        case EDGE_ORIENTATION.BIDIRECTIONAL:
            if(edgeEntry.src === edgeEntry.dst) { result = [edgeEntry.dst]; }
            else { result = [edgeEntry.dst, edgeEntry.src]; }
            break;
        default:
            throw Error("invalid edge orientation");
        }

        return result;
    },

    edgeSymmetricalSources:
    /*
     * Method: edgeSymmetricalSources
     *
     * Implements:
     *      - <AbstractGraph.edgeSymmetricalSources>
     */
    function edgeSymmetricalSources(edgeId) {
        var edgeEntry = this.edgeEntryList[edgeId];
        var result;

        switch(edgeEntry.orientation) {
        case EDGE_ORIENTATION.DIRECTED:
            result = [edgeEntry.src];
            break;
        case EDGE_ORIENTATION.REVERSED:
            result = [edgeEntry.dst];
            break;
        case EDGE_ORIENTATION.UNDIRECTED:
            if(edgeEntry.src === edgeEntry.dst) { result = [edgeEntry.src]; }
            else { result = [edgeEntry.src, edgeEntry.dst]; }
            break;
        case EDGE_ORIENTATION.BIDIRECTIONAL:
            if(edgeEntry.src === edgeEntry.dst) { result = [edgeEntry.src]; }
            else { result = [edgeEntry.src, edgeEntry.dst]; }
            break;
        default:
            throw Error("invalid edge orientation");
        }

        return result;
    },

    edgeSymmetricalDestinations:
    /*
     * Method: edgeSymmetricalDestinations
     *
     * Implements:
     *      - <AbstractGraph.edgeSymmetricalDestinations>
     */
    function edgeSymmetricalDestinations(edgeId) {
        var edgeEntry = this.edgeEntryList[edgeId];
        var result;

        switch(edgeEntry.orientation) {
        case EDGE_ORIENTATION.DIRECTED:
            result = [edgeEntry.dst];
            break;
        case EDGE_ORIENTATION.REVERSED:
            result = [edgeEntry.src];
            break;
        case EDGE_ORIENTATION.UNDIRECTED:
            if(edgeEntry.src === edgeEntry.dst) { result = [edgeEntry.dst]; }
            else { result = [edgeEntry.dst, edgeEntry.src]; }
            break;
        case EDGE_ORIENTATION.BIDIRECTIONAL:
            if(edgeEntry.src === edgeEntry.dst) { result = [edgeEntry.dst]; }
            else { result = [edgeEntry.dst, edgeEntry.src]; }
            break;
        default:
            throw Error("invalid edge orientation");
        }

        return result;
    },

    isIncidentEdge:
    /*
     * Method: isIncidentEdge
     *
     * Implements:
     *      - <AbstractGraph.isIncidentEdge>
     */
    function isIncidentEdge(edgeId, nodeId) {
        var edgeEntry = this.edgeEntryList[edgeId];
        return (
            nodeId === edgeEntry.src ||
            nodeId === edgeEntry.dst
        );
    },

    isSelfEdge:
    /*
     * Method: isSelfEdge
     *
     * Implements:
     *      - <AbstractGraph.isSelfEdge>
     */
    function isSelfEdge(edgeId, nodeId) {
        var edgeEntry = this.edgeEntryList[edgeId];
        return (
            nodeId === edgeEntry.src &&
            nodeId === edgeEntry.dst
        );
    },

    isDirectedEdge:
    /*
     * Method: isDirectedEdge
     *
     * Implements:
     *      - <AbstractGraph.isDirectedEdge>
     */
    function isDirectedEdge(edgeId, nodeId) {
        if(!this.isIncidentEdge(edgeId, nodeId)) {
            return false;
        }

        var edgeEntry = this.edgeEntryList[edgeId];
        var orientation = edgeEntry.orientation;

        return orientation === EDGE_ORIENTATION.DIRECTED;
    },

    isUndirectedEdge:
    /*
     * Method: isUndirectedEdge
     *
     * Implements:
     *      - <AbstractGraph.isUndirectedEdge>
     */
    function isUndirectedEdge(edgeId, nodeId) {
        if(!this.isIncidentEdge(edgeId, nodeId)) {
            return false;
        }

        var edgeEntry = this.edgeEntryList[edgeId];
        var orientation = edgeEntry.orientation;

        return orientation === EDGE_ORIENTATION.UNDIRECTED;
    },

    isReversedEdge:
    /*
     * Method: isReversedEdge
     *
     * Implements:
     *      - <AbstractGraph.isReversedEdge>
     */
    function isReversedEdge(edgeId, nodeId) {
        if(!this.isIncidentEdge(edgeId, nodeId)) {
            return false;
        }

        var edgeEntry = this.edgeEntryList[edgeId];
        var orientation = edgeEntry.orientation;

        return orientation === EDGE_ORIENTATION.REVERSED;
    },

    isBidirectionalEdge:
    /*
     * Method: isBidirectionalEdge
     *
     * Implements:
     *      - <AbstractGraph.isBidirectionalEdge>
     */
    function isBidirectionalEdge(edgeId, nodeId) {
        if(!this.isIncidentEdge(edgeId, nodeId)) {
            return false;
        }

        var edgeEntry = this.edgeEntryList[edgeId];
        var orientation = edgeEntry.orientation;

        return orientation === EDGE_ORIENTATION.BIDIRECTIONAL;
    },

    isCanonicallyDirectedEdge:
    /*
     * Method: isCanonicallyDirectedEdge
     *
     * Implements:
     *      - <AbstractGraph.isCanonicallyDirectedEdge>
     */
    function isCanonicallyDirectedEdge(edgeId, nodeId) {
        if(!this.isIncidentEdge(edgeId, nodeId)) {
            return false;
        }

        var edgeEntry = this.edgeEntryList[edgeId];
        var orientation = edgeEntry.orientation;

        return (
            orientation === EDGE_ORIENTATION.DIRECTED      || 
            orientation === EDGE_ORIENTATION.REVERSED      || 
            orientation === EDGE_ORIENTATION.BIDIRECTIONAL
        );
    },

    isCanonicallyUndirectedEdge:
    /*
     * Method: isCanonicallyUndirectedEdge
     *
     * Implements:
     *      - <AbstractGraph.isCanonicallyUndirectedEdge>
     */
    function isCanonicallyUndirectedEdge(edgeId, nodeId) {
        if(!this.isIncidentEdge(edgeId, nodeId)) {
            return false;
        }

        var edgeEntry = this.edgeEntryList[edgeId];
        var orientation = edgeEntry.orientation;

        return !(
            orientation === EDGE_ORIENTATION.DIRECTED      || 
            orientation === EDGE_ORIENTATION.REVERSED      || 
            orientation === EDGE_ORIENTATION.BIDIRECTIONAL
        );
    },

    isSymmetricEdge:
    /*
     * Method: isSymmetricEdge
     *
     * Implements:
     *      - <AbstractGraph.isSymmetricEdge>
     */
    function isSymmetricEdge(edgeId, nodeId) {
        if(!this.isIncidentEdge(edgeId, nodeId)) {
            return false;
        }

        var edgeEntry = this.edgeEntryList[edgeId];
        var orientation = edgeEntry.orientation;

        return (
            orientation === EDGE_ORIENTATION.BIDIRECTIONAL ||
            orientation === EDGE_ORIENTATION.UNDIRECTED
        );
    },

    isAsymmetricEdge:
    /*
     * Method: isAsymmetricEdge
     *
     * Implements:
     *      - <AbstractGraph.isAsymmetricEdge>
     */
    function isAsymmetricEdge(edgeId, nodeId) {
        if(!this.isIncidentEdge(edgeId, nodeId)) {
            return false;
        }

        var edgeEntry = this.edgeEntryList[edgeId];
        var orientation = edgeEntry.orientation;

        return (
            orientation === EDGE_ORIENTATION.DIRECTED ||
            orientation === EDGE_ORIENTATION.REVERSED
        );
    },

    isInEdge:
    /*
     * Method: isInEdge
     *
     * Implements:
     *      - <AbstractGraph.isInEdge>
     */
    function isInEdge(edgeId, nodeId) {
        var edgeEntry = this.edgeEntryList[edgeId];
        return edgeEntry.dst === nodeId;
    },

    isOutEdge:
    /*
     * Method: isOutEdge
     *
     * Implements:
     *      - <AbstractGraph.isOutEdge>
     */
    function isOutEdge(edgeId, nodeId) {
        var edgeEntry = this.edgeEntryList[edgeId];
        return edgeEntry.src === nodeId;
    },

    /*
     * TODO (opadron) elaborate in comments on why some seemingly-obvious edge
     * query operations are left out
     */

    isCanonicallyInEdge:
    /*
     * Method: isOutEdge isCanonicallyInEdge
     *
     * Implements:
     *      - <AbstractGraph.isCanonicallyInEdge>
     */
    function isCanonicallyInEdge(edgeId, nodeId) {
        if(!this.isIncidentEdge(edgeId, nodeId)) {
            return false;
        }

        var edgeEntry = this.edgeEntryList[edgeId];
        var orientation = edgeEntry.orientation;

        return (
            orientation === EDGE_ORIENTATION.BIDIRECTIONAL   || (
                orientation === EDGE_ORIENTATION.DIRECTED &&
                edgeEntry.dst === nodeId
            )                                               || (
                orientation === EDGE_ORIENTATION.REVERSED &&
                edgeEntry.src === nodeId
            )
        );
    },

    isCanonicallyOutEdge:
    /*
     * Method: isCanonicallyOutEdge
     *
     * Implements:
     *      - <AbstractGraph.isCanonicallyOutEdge>
     */
    function isCanonicallyOutEdge(edgeId, nodeId) {
        if(!this.isIncidentEdge(edgeId, nodeId)) {
            return false;
        }

        var edgeEntry = this.edgeEntryList[edgeId];
        var orientation = edgeEntry.orientation;

        return (
            orientation === EDGE_ORIENTATION.BIDIRECTIONAL   || (
                orientation === EDGE_ORIENTATION.DIRECTED &&
                edgeEntry.src === nodeId
            )                                               || (
                orientation === EDGE_ORIENTATION.REVERSED &&
                edgeEntry.dst === nodeId
            )
        );
    },

    isSymmetricallyInEdge:
    /*
     * Method: isSymmetricallyInEdge
     *
     * Implements:
     *      - <AbstractGraph.isSymmetricallyInEdge>
     */
    function isSymmetricallyInEdge(edgeId, nodeId) {
        if(!this.isIncidentEdge(edgeId, nodeId)) {
            return false;
        }

        var edgeEntry = this.edgeEntryList[edgeId];
        var orientation = edgeEntry.orientation;

        return (
            orientation === EDGE_ORIENTATION.UNDIRECTED      ||
            orientation === EDGE_ORIENTATION.BIDIRECTIONAL   || (
                orientation === EDGE_ORIENTATION.DIRECTED &&
                edgeEntry.dst === nodeId
            )                                               || (
                orientation === EDGE_ORIENTATION.REVERSED &&
                edgeEntry.src === nodeId
            )
        );
    },

    isSymmetricallyOutEdge:
    /*
     * Method: isSymmetricallyOutEdge
     *
     * Implements:
     *      - <AbstractGraph.isSsSymmetricallyOutEdge>
     */
    function isSymmetricallyOutEdge(edgeId, nodeId) {
        if(!this.isIncidentEdge(edgeId, nodeId)) {
            return false;
        }

        var edgeEntry = this.edgeEntryList[edgeId];
        var orientation = edgeEntry.orientation;

        return (
            orientation === EDGE_ORIENTATION.UNDIRECTED      ||
            orientation === EDGE_ORIENTATION.BIDIRECTIONAL   || (
                orientation === EDGE_ORIENTATION.DIRECTED &&
                edgeEntry.src === nodeId
            )                                               || (
                orientation === EDGE_ORIENTATION.REVERSED &&
                edgeEntry.dst === nodeId
            )
        );
    },

    iterNodes:
    /*
     * Method: iterNodes
     *
     * Implements:
     *      - <AbstractGraph.iterNodes>
     */
    function iterNodes(callback) {
        var self = this;
        return this.nodeIterGuard.run(function() {
            return self.nodes.keys().some(callback);
        });
    },

    iterEdges:
    /*
     * Method: iterEdges
     *
     * Implements:
     *      - <AbstractGraph.iterEdges>
     */
    function iterEdges(nodeId, callback) {
        var self = this;
        if(arguments.length === 1) {
            callback = nodeId;
            return this.edgeIterGuard.run(function() {
                return self.edges.keys().some(callback);
            });
        } else {
            var set = this._computeEdges(nodeId);
            return this.edgeIterGuard.run(function() {
                var n = set.length();
                for(var i=0; i<n; ++i) {
                    if(callback(set.get(i))) {
                        return true;
                    }
                }
            });
        }
    }
});

module.exports = DirectedGraph;

