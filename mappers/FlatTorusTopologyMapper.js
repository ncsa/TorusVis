
/*
 * File: FlatTorusTopologyMapper
 *
 * flat torus toplogy mapping implementation
 */

"use strict";

var utils = require("../misc/utils");
var AbstractTopologyMapper = require("./AbstractTopologyMapper");

var _private_ = require("./FlatTorusTopologyMapperInternals");

var features = require("../misc/features");
features.require("slice");

/*
 * Class: FlatTorusTopologyMapper
 *
 * topology mapping implementation for <FlatTori>
 *
 * <FlatTorusTopologyMappers> provide features specific to <FlatTori> that take
 * advantage of their regularity.  They embed the torus topology in a 3D space
 * by regularly spacing nodes along a specified embedding volume.
 * <FlatTorusTopologyMappers> also allow their mappings to be shifted
 * arbitrarily along its topological dimensions, producing "wrapped" views.
 *
 * Note that <FlatTorusTopologyMappers> only map <FlatTori> up to their first
 * three topological dimensions.  The embedding produced for higher dimensional
 * <FlatTori> effectively discards the additional dimensions.
 *
 * See also:
 *      - <FlatTorus>
 */

/*
 * Constructor: constructor
 *
 * construct a new <FlatTorusTopologyMapper> that embeds <FlatTori> within the
 * given volume
 *
 * constructs a new <FlatTorusTopologyMapper> that embeds <FlatTori> within the
 * given volume.  The volume is defined as a box with the given dimensions
 * centered on the given center point.
 *
 * Parameters:
 *     center - the given center point
 *     dimensions - the given dimensions
 */
function constructor(center, dimensions) {
    /* documentation stub */
}

function FlatTorusTopologyMapper(center, dimensions) {
    this.center = Array.slice(center);
    this.dimensions = utils.map(dimensions, Math.abs);
    this.shifts = utils.map(dimensions, function() { return 0; });
}

utils.extend(
    FlatTorusTopologyMapper.prototype,
    AbstractTopologyMapper.prototype
);

utils.extend(FlatTorusTopologyMapper.prototype, {
    constructor: FlatTorusTopologyMapper,

    getCenter:
    /*
     * Method: getCenter
     *
     * return the center point of the embedding volume
     *
     * Returns:
     *      - (*Array*) the center point of the embedding volume
     *
     * See also:
     *      - <setCenter>
     *      - <getCenterComponent>
     */
    function getCenter() {
        return Array.slice(this.center, 0);
    },
    
    getCenterComponent:
    /*
     * Method: getCenterComponent
     *
     * return a component of the center point of the embedding volume
     *
     * Parameters:
     *     i - (*Number*) index indicating the component to get
     *
     * Returns:
     *      - (*number*) the component of the center point of the embedding
     *        volume
     *
     * See also:
     *      - <setCenterComponent>
     *      - <getCenter>
     */
    function getCenterComponent(i) {
        return this.center[i];
    },

    getDimensions:
    /*
     * Method: getDimensions
     *
     * return the dimensions of the embedding volume
     *
     * Returns:
     *      - (*Array*) the dimensions of the embedding volume
     *
     * See also:
     *      - <setDimensions>
     *      - <getDimensionComponent>
     */
    function getDimensions() {
        return Array.slice(this.dimensions, 0);
    },

    getDimensionComponent:
    /*
     * Method: getDimensionComponent
     *
     * return a component of the dimensions of the embedding volume
     *
     * Parameters:
     *     i - (*Number*) index indicating the component to get
     *
     * Returns:
     *      - (*number*) the component of the dimensions of the embedding volume
     *
     * See also:
     *      - <setDimensionComponent>
     *      - <getDimensions>
     */
    function getDimensionComponent(i) {
        return this.dimensions[i];
    },

    getShifts:
    /*
     * Method: getShifts
     *
     * return the shift dimensions of the embedding volume
     *
     * Returns:
     *      - (*Array*) the shift dimensions of the embedding volume
     *
     * See also:
     *      - <setShifts>
     *      - <getShiftComponent>
     */
    function getShifts(shifts) {
        return Array.slice(this.shifts, 0);
    },

    getShiftComponent:
    /*
     * Method: getShiftComponent
     *
     * return a component of the shift dimensions of the embedding volume
     *
     * Parameters:
     *     i - (*Number*) index indicating the component to get
     *
     * Returns:
     *      - (*number*) the component of the shift dimensions of the embedding
     *        volume
     *
     * See also:
     *      - <setShiftComponent>
     *      - <getShifts>
     */
    function getShiftComponent(i) {
        return this.shifts[i];
    },

    setCenter:
    /*
     * Method: setCenter
     *
     * set the center point of the embedding volume
     *
     * Parameters:
     *     center - (*Array*) center point of the embedding volume
     *
     * Returns:
     *      - (*Object*) *this*
     *
     * See also:
     *      - <getCenter>
     *      - <setCenterComponent>
     */
    function setCenter(center) {
        var self = this;
        utils.iter(center, function nction(x, i) {
            self.setCenterComponent(i, x);
        });
        return this;
    },

    setCenterComponent:
    /*
     * Method: setCenterComponent
     *
     * set a component of the center point of the embedding volume
     *
     * Parameters:
     *     i - (*Number*) index indicating the component to set
     *     x - (*Number*) value to set the component to
     *
     * Returns:
     *      - (*Object*) *this*
     *
     * See also:
     *      - <getCenterComponent>
     *      - <setCenter>
     */
    function setCenterComponent(i, x) {
        this.center[i] = x;
        return this;
    },

    setDimensions:
    /*
     * Method: setDimensions
     *
     * set the dimensions of the embedding volume
     *
     * Parameters:
     *     dimensions - (*Array*) dimensions of the embedding volume
     *
     * Returns:
     *      - (*Object*) *this*
     *
     * See also:
     *      - <getDimensions>
     *      - <setDimensionComponent>
     */
    function setDimensions(dimensions) {
        var self = this;
        utils.iter(dimensions, function(x, i) {
            self.setDimensionComponent(i, x);
        });

        return this;
    },

    setDimensionComponent:
    /*
     * Method: setDimensionComponent
     *
     * set a component of the dimensions of the embedding volume
     *
     * Parameters:
     *     i - (*Number*) index indicating the component to set
     *     x - (*Number*) value to set the component to
     *
     * Returns:
     *      - (*Object*) *this*
     *
     * See also:
     *      - <getDimensionComponent>
     *      - <setDimensions>
     */
    function setDimensionComponent(i, x) {
        this.dimensions[i] = x;
        return this;
    },

    setShifts:
    /*
     * Method: setShifts
     *
     * set the shift dimensions of the embedding volume
     *
     * Parameters:
     *     shifts - (*Array*) the shift dimensions of the embedding volume
     *
     * Returns:
     *      - (*Object*) *this*
     *
     * See also:
     *      - <getShifts>
     *      - <setShiftComponent>
     */
    function setShifts(shifts) {
        var self = this;
        utils.iter(shifts, function(x, i) {
            this.setShiftComponent(i, x);
        });

        return this;
    },

    setShiftComponent:
    /*
     * Method: setShiftComponent
     *
     * set a component of the shift dimensions of the embedding volume
     *
     * Parameters:
     *     i - (*Number*) index indicating the component to set
     *     x - (*Number*) value to set the component to
     *
     * Returns:
     *      - (*Object*) *this*
     *
     * See also:
     *      - <getShiftComponent>
     *      - <setShifts>
     */
    function setShiftComponent(i, x) {
        this.shifts[i] = Math.floor(x);
        return this;
    },

    graphNodeToPosition:
    /*
     * Method: graphNodeToPosition
     *
     * Implements:
     *      - <AbstractTopologyMapper.graphNodeToPosition>
     */
    function graphNodeToPosition(graph, nodeHandle) {
        var position = graph.nodeCoordinates(nodeHandle);
        var gDims = graph.getDimensions();

        var self = this;
        position = utils.map(position, function(x, i) {
            var delta = self.dimensions[i]/gDims[i];

            x += self.shifts[i];

            x %= gDims[i];
            x += gDims[i];
            x %= gDims[i];

            x *= delta;

            /* center within the virtual box */
            x += self.center[i] - 0.5*self.dimensions[i];
            x += 0.5*delta;

            return x;
        });

        return position;
    },

    graphEdgeToPath:
    /*
     * Method: graphEdgeToPath
     *
     * Implements:
     *      - <AbstractTopologyMapper.graphEdgeToPath>
     */
    function graphEdgeToPath(graph, edgeHandle) {
        var tmp = {
            self: this,
            graph: graph,
            edgeHandle: edgeHandle
        };

        if(_private_.edgeWraps(tmp)) {
            return _private_.traceWrappingEdge(tmp);
        }
        return [ tmp.p0, tmp.p1 ];
    }
});

module.exports = FlatTorusTopologyMapper;

