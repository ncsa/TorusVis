
/*
 * File: FlatTorus
 *
 * flat torus graph implementation
 */

"use strict";

var utils = require("../misc/utils");
var AbstractGraph = require("./AbstractGraph");
var features = require("../misc/features");
var EDGE_ORIENTATION = require("./EDGE_ORIENTATION");

features.require("slice");

function flatTorusInvalidOperation(operationName) {
    return utils.breakFunction(
        "FlatTorus: invalid operation: " + operationName
    );
}

/*
 * Class: FlatTorus
 *
 * flat torus graph implementation
 *
 * <FlatTori> are graphs whos nodes and edges are arranged in a regular
 * rectilinear structure.  Their topology logically resembles that of a
 * multidimensional "box" with boundaries that "wrap around".  Despite what the
 * class name may suggest, <FlatTori> may span any number of topological
 * dimensions.
 *
 * <FlatTori> track their nodes and edges using a fully implicit scheme and can
 * take advantage of their highly regular structure to reduce memory usage
 * compared to an equivalent graph represented using a more generic data
 * structure.  A <FlatTorus's> nodes and edges are considered "created" all at
 * once during instantiation, and attempts to add or remove nodes or edges
 * result in an exception being thrown.
 *
 * Extends:
 *      - <AbstractGraph>
 *
 * See also:
 *      - <DirectedGraph>
 */

/*
 * About: Flat Torus Edge Coordinates
 *
 * flat torus edge coordinate definition
 *
 * A <FlatTorus> edge is always aligned along some <FlatTorus> dimension, with
 * one of its incident nodes, *a*, immediately followed in the dimension by its
 * other incident node.  The torus coordinates for an edge is defined as the
 * torus coordinates for *a* with an additional component indicating the
 * dimension along which the edge is aligned.
 *
 * For example, *[0, 0, 0]* are the torus coordinates for an edge in a 2D
 * <FlatTorus> incident on the node with torus coordinates *[0, 0]* and aligned
 * along the first (*0*'th) dimension.  If the first dimension is nonsingular,
 * then the torus coordinates for the other incident node would be *[1, 0]* (it
 * would be *[0, 0]* in the singular case due to "wrap-around").
 */

/*
 * Constructor: constructor
 *
 * constructs a new <FlatTorus>
 *
 * Parameters:
 *     dimensions[, ...] - (*number*) dimensions of the torus
 */
function constructor(dimensions) {
    /* documentation stub */
}

function FlatTorus() {
    this.dimensions = Array.slice(arguments, 0);
}

utils.extend(FlatTorus.prototype, AbstractGraph.prototype);
utils.extend(FlatTorus.prototype, {
    constructor: FlatTorus,

    /*
     * Method: getDimensions
     *
     * return this <FlatTorus's> dimensions
     *
     * Returns:
     *      - (*Array*) this <FlatTorus's> dimensions
     */
    getDimensions:
    function getDimensions() {
        return this.dimensions;
    },

    nodeAt:
    /*
     * Method: nodeAt
     *
     * return the node with the given torus coordinates
     *
     * Parameters:
     *     coords - (*Array*) the given coordinates
     *
     * Returns:
     *      - (*Number*) ID for the node with the given torus coordinates
     *
     * See also:
     *      - <nodeCoordinates>
     *      - <edgeAt>
     */
    function nodeAt(coords) {
        var result = utils.indexMap(coords, this.dimensions);
        return result;
    },

    nodeCoordinates:
    /*
     * Method: nodeCoordinates
     *
     * return the torus coordinates for the given node
     *
     * Parameters:
     *     nodeId - ID for the given node
     *
     * Returns:
     *      - (*Array*) the torus coordinates for the given node
     *
     * See also:
     *      - <nodeAt>
     *      - <edgeCoordinates>
     */
    function nodeCoordinates(nodeId) {
        return utils.indexUnmap(nodeId, this.dimensions);
    },

    edgeAt:
    /*
     * Method: edgeAt
     *
     * return the edge with the given torus coordinates
     *
     * returns the edge with the given torus coordinates.  If dimension is not
     * provided, it is assumed to be added as a final element in coords.
     *
     * Parameters:
     *     coords - (*Array*) torus coordinates for the given edge
     *     [dimension] - (*Number*) dimension along which the given edge is
     *                   aligned
     *
     * Returns:
     *      - (*Number*) ID for the edge with the given torus coordinates
     *
     * See also:
     *      - <Flat Torus Edge Coordinates>
     *      - <edgeCoordinates>
     *      - <nodeAt>
     */
    function edgeAt(coords, dimension) {
        var n = coords.length;
        if(arguments.length === 1) {
            dimension = coords[n-1];
            coords = Array.slice(coords, 0, n - 1);
        }

        var result = (
            utils.indexMap(coords, this.dimensions) +
            dimension*this.numberOfNodes()
        );

        return result;
    },

    edgeCoordinates:
    /*
     * Method: edgeCoordinates
     *
     * return the torus coordinates for the given edge
     *
     * Parameters:
     *     edgeId - (*Number*) ID for the given edge
     *
     * Returns:
     *      - (*Array*) the torus coordinates for the given edge
     *
     * See also:
     *      - <Flat Torus Edge Coordinates>
     *      - <edgeAt>
     *      - <nodeCoordinates>
     */
    function edgeCoordinates(edgeId) {
        var N = this.numberOfNodes();
        var result = utils.indexUnmap(edgeId % N, this.dimensions);
        var dimension = Math.floor(edgeId/N);
        result.push(dimension);
        return result;
    },

    /*
     * Method: clear
     *
     * throws an exception: <FlatTori> cannot be cleared
     *
     * Throws:
     *      - (*Error*) always
     *
     * Implements:
     *      - <AbstractGraph.clear>
     */
    clear: flatTorusInvalidOperation("clear"),

    /*
     * Method: newNode
     *
     * throws an exception: new nodes cannot be created for <FlatTori>
     *
     * Throws:
     *      - (*Error*) always
     *
     * Implements:
     *      - <AbstractGraph.newNode>
     */
    newNode: flatTorusInvalidOperation("newNode"),

    nodeNeighbor:
    /*
     * Method: nodeNeighbor
     *
     * Implements:
     *      - <AbstractGraph.nodeNeighbor>
     */
    function nodeNeighbor(nodeId, edgeId) {
        var nodeId2 = this.edgeSource(edgeId);
        if(nodeId === nodeId2) {
            nodeId2 = this.edgeDestination(edgeId);
        }

        return nodeId2;
    },

    numberOfNodes:
    /*
     * Method: numberOfNodes
     *
     * Implements:
     *      - <AbstractGraph.numberOfNodes>
     */
    function numberOfNodes() {
        if(utils.isNull(this._numberOfNodes)) {
            this._numberOfNodes = utils.reduce(
                this.dimensions,
                utils.multiply,
                1.0
            );
        }
        return this._numberOfNodes;
    },

    getNodeById:
    /*
     * Method: getNodeById
     *
     * Implements:
     *      - <AbstractGraph.getNodeById>
     */
    function getNodeById(id) {
        if(!(0 <= id && id < this.numberOfNodes())) {
            throw Error("FlatTorus: no such node matching id: " + id);
        }
        return id;
    },

    /*
     * Method: deleteNode
     *
     * throws an exception: nodes cannot be deleted from <FlatTori>
     *
     * Throws:
     *      - (*Error*) always
     *
     * Implements:
     *      - <AbstractGraph.deleteNode>
     */
    deleteNode: flatTorusInvalidOperation("deleteNode"),

    nodeData:
    /*
     * Method: nodeData
     *
     * Implements:
     *      - <AbstractGraph.nodeData>
     */
    function nodeData(nodeId) {
        if(utils.isNull(this._nodeData)) {
            this._nodeData = new Array(this.numberOfNodes());
        }

        var result = this._nodeData[nodeId];
        if(utils.isNull(result)) {
            result = this._nodeData[nodeId] = { };
        }

        return result;
    },

    /*
     * Method: newEdge
     *
     * throws an exception: new edges cannot be created for <FlatTori>
     *
     * Throws:
     *      - (*Error*) always
     *
     * Implements:
     *      - <AbstractGraph.newEdge>
     */
    newEdge: flatTorusInvalidOperation("newEdge"),

    numberOfEdges:
    /*
     * Method: numberOfEdges
     *
     * Implements:
     *      - <AbstractGraph.numberOfEdges>
     */
    function numberOfEdges() {
        if(utils.isNull(this._numberOfEdges)) {
            this._numberOfEdges = this.numberOfNodes()*this.dimensions.length;
        }

        return this._numberOfEdges;
    },

    getEdgeById:
    /*
     * Method: getEdgeById
     *
     * Implements:
     *      - <AbstractGraph.getEdgeById>
     */
    function getEdgeById(id) {
        if(!(0 <= id && id < this.numberOfEdges())) {
            throw Error("FlatTorus: no such edge matching id: " + id);
        }
        return id;
    },

    /*
     * Method: deleteEdge
     *
     * throws an exception: edges cannot be deleted from <FlatTori>
     *
     * Throws:
     *      - (*Error*) always
     *
     * Implements:
     *      - <AbstractGraph.deleteEdge>
     */
    deleteEdge: flatTorusInvalidOperation("deleteEdge"),

    edgeData:
    /*
     * Method: edgeData
     *
     * Implements:
     *      - <AbstractGraph.edgeData>
     */
    function edgeData(edgeId) {
        if(utils.isNull(this._edgeData)) {
            this._edgeData = new Array(this.numberOfEdges());
        }

        var result = this._edgeData[edgeId];
        if(utils.isNull(result)) {
            result = this._edgeData[edgeId] = { };
        }

        return result;
    },

    edgeOrientation:
    /*
     * Method: edgeOrientation
     *
     * Implements:
     *      - <AbstractGraph.edgeOrientation>
     */
    function edgeOrientation(edgeId) {
        return EDGE_ORIENTATION.UNDIRECTED;
    },

    edgeSource:
    /*
     * Method: edgeSource
     *
     * Implements:
     *      - <AbstractGraph.edgeSource>
     */
    function edgeSource(edgeId) {
        var x = this.edgeCoordinates(edgeId);
        x.pop();
        return this.nodeAt(x);
    },

    edgeDestination:
    /*
     * Method: edgeDestination
     *
     * Implements:
     *      - <AbstractGraph.edgeDestination>
     */
    function edgeDestination(edgeId) {
        var sourceCoords = this.edgeCoordinates(edgeId);
        var dimension = sourceCoords.splice(sourceCoords.length - 1, 1);

        ++sourceCoords[dimension];
        sourceCoords[dimension] %= this.dimensions[dimension];

        return this.nodeAt(sourceCoords);
    },

    edgeCanonicalSources:
    /*
     * Method: edgeCanonicalSources
     *
     * Implements:
     *      - <AbstractGraph.edgeCanonicalSources>
     */
    function edgeCanonicalSources(edgeId) {
        return [];
    },

    edgeCanonicalDestinations:
    /*
     * Method: edgeCanonicalDestinations
     *
     * Implements:
     *      - <AbstractGraph.edgeCanonicalDestinations>
     */
    function edgeCanonicalDestinations(edgeId) {
        return [];
    },

    edgeSymmetricalSources:
    /*
     * Method: edgeSymmetricalSources
     *
     * Implements:
     *      - <AbstractGraph.edgeSymmetricalSources>
     */
    function edgeSymmetricalSources(edgeId) {
        return [
            this.edgeSource(edgeId),
            this.edgeDestination(edgeId)
        ];
    },

    edgeSymmetricalDestinations:
    /*
     * Method: edgeSymmetricalDestinations
     *
     * Implements:
     *      - <AbstractGraph.edgeSymmetricalDestinations>
     */
    function edgeSymmetricalDestinations(edgeId) {
        return [
            this.edgeDestination(edgeId),
            this.edgeSource(edgeId)
        ];
    },

    isIncidentEdge:
    /*
     * Method: isIncidentEdge
     *
     * Implements:
     *      - <AbstractGraph.isIncidentEdge>
     */
    function isIncidentEdge(edgeId, nodeId) {
        return (
            nodeId === this.getNodeId(this.edgeSource(edgeId)) ||
            nodeId === this.getNodeId(this.edgeDestination(edgeId))
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
        var edgeCoords = this.edgeCoordinates(edgeId);
        var nodeDimensions = this.getDimensions();
        var edgeDimension = edgeCoords[edgeCoords.length - 1];

        /*
         * for flat tori, this should always be false
         * (unless the edge wraps around along a singular dimension)
         */
        var result = (
            this.isIncidentEdge(edgeId, nodeId) &&
            nodeDimensions[edgeDimension] === 1

        );

        return result;
    },

    isDirectedEdge:
    /*
     * Method: isDirectedEdge
     *
     * Implements:
     *      - <AbstractGraph.isDirectedEdge>
     */
    function isDirectedEdge(edgeId, nodeId) {
        return false;
    },

    isUndirectedEdge:
    /*
     * Method: isUndirectedEdge
     *
     * Implements:
     *      - <AbstractGraph.isUndirectedEdge>
     */
    function isUndirectedEdge(edgeId, nodeId) {
        return true;
    },

    isReversedEdge:
    /*
     * Method: isReversedEdge
     *
     * Implements:
     *      - <AbstractGraph.isReversedEdge>
     */
    function isReversedEdge(edgeId, nodeId) {
        return false;
    },

    isBidirectionalEdge:
    /*
     * Method: isBidirectionalEdge
     *
     * Implements:
     *      - <AbstractGraph.isBidirectionalEdge>
     */
    function isBidirectionalEdge(edgeId, nodeId) {
        return false;
    },

    isCanonicallyDirectedEdge:
    /*
     * Method: isCanonicallyDirectedEdge
     *
     * Implements:
     *      - <AbstractGraph.isCanonicallyDirectedEdge>
     */
    function isCanonicallyDirectedEdge(edgeId, nodeId) {
        return false;
    },

    isCanonicallyUndirectedEdge:
    /*
     * Method: isCanonicallyUndirectedEdge
     *
     * Implements:
     *      - <AbstractGraph.isCanonicallyUndirectedEdge>
     */
    function isCanonicallyUndirectedEdge(edgeId, nodeId) {
        return true;
    },

    isSymmetricEdge:
    /*
     * Method: isSymmetricEdge
     *
     * Implements:
     *      - <AbstractGraph.isSymmetricEdge>
     */
    function isSymmetricEdge(edgeId, nodeId) {
        return true;
    },

    isAsymmetricEdge:
    /*
     * Method: isAsymmetricEdge
     *
     * Implements:
     *      - <AbstractGraph.isAsymmetricEdge>
     */
    function isAsymmetricEdge(edgeId, nodeId) {
        return false;
    },

    isInEdge:
    /*
     * Method: isInEdge
     *
     * Implements:
     *      - <AbstractGraph.isInEdge>
     */
    function isInEdge(edgeId, nodeId) {
        return (
            this.getNodeId(nodeId) ===
            this.getNodeId(this.edgeDestination(edgeId))
        );
    },

    isOutEdge:
    /*
     * Method: isOutEdge
     *
     * Implements:
     *      - <AbstractGraph.isOutEdge>
     */
    function isOutEdge(edgeId, nodeId) {
        return (
            this.getNodeId(nodeId) ===
            this.getNodeId(this.edgeSource(edgeId))
        );
    },

    isCanonicallyInEdge:
    /*
     * Method: isCanonicallyInEdge
     *
     * Implements:
     *      - <AbstractGraph.isCanonicallyInEdge>
     */
    function isCanonicallyInEdge(edgeId, nodeId) {
        return false;
    },

    isCanonicallyOutEdge:
    /*
     * Method: isCanonicallyOutEdge
     *
     * Implements:
     *      - <AbstractGraph.isCanonicallyOutEdge>
     */
    function isCanonicallyOutEdge(edgeId, nodeId) {
        return false;
    },

    isSymmetricallyInEdge:
    /*
     * Method: isSymmetricallyInEdge
     *
     * Implements:
     *      - <AbstractGraph.isSymmetricallyInEdge>
     */
    function isSymmetricallyInEdge(edgeId, nodeId) {
        return true;
    },

    isSymmetricallyOutEdge:
    /*
     * Method: isSymmetricallyOutEdge
     *
     * Implements:
     *      - <AbstractGraph.isSymmetricallyOutEdge>
     */
    function isSymmetricallyOutEdge(edgeId, nodeId) {
        return true;
    },

    iterNodes:
    /*
     * Method: iterNodes
     *
     * Implements:
     *      - <AbstractGraph.iterNodes>
     */
    function iterNodes(callback) {
        for(var i=0; i<this.numberOfNodes(); ++i) {
            callback(this.getNodeById(i));
        }
    },

    iterEdges:
    /*
     * Method: iterEdges
     *
     * Implements:
     *      - <AbstractGraph.iterEdges>
     */
    function iterEdges(nodeId, callback) {
        if(arguments.length === 1) {
            callback = nodeId;
            for(var i=0; i<this.numberOfEdges(); ++i) {
                if(callback(i)) {
                    return true;
                }
            }
        } else {
            var coords = utils.indexUnmap(nodeId, this.dimensions);
            var self = this;
            return this.dimensions.some(function(dimension, i) {
                coords.push(i);
                if(callback(self.edgeAt.apply(self, coords))) {
                    return true;
                }

                {
                    coords[i] += dimension - 1;
                    coords[i] %= dimension;

                    if(callback(self.edgeAt.apply(self, coords))) {
                        return true;
                    }

                    coords[i] += dimension + 1;
                    coords[i] %= dimension;
                }

                coords.pop();
            });
        }
    }
});

module.exports = FlatTorus;

