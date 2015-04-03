
/*
 * File: periodicBoundaryTopologyMapper
 *
 * generic periodic domain topology mapping implementation
 */
 "use strict";

var utils = require("../misc/utils");
var AbstractTopologyMapper = require("./AbstractTopologyMapper");
var features = require("../misc/features");

features.require("slice");

/*
 * Class: PeriodicBoundaryTopologyMapper
 *
 * periodic domain topology-mapping subclass of <AbstractTopologyMapper>
 *
 * <PeriodicBoundaryTopologyMappers> transform the results returned by other
 * <AbstractTopologyMapper> instances so that the produced graph embedding lies
 * within a defined embedding "box" volume.  Node locations and edge path
 * segments that lie outside the boundaries of this volume are "wrapped around"
 * so that they extend from the opposite boundary into the volume - as many
 * times over as is needed to keep everything within the volume.
 *
 * <PeriodicBoundaryTopologyMappers> define the extents and shifting semantics
 * of an embedding volume for arbitrary graph types in much the same way that
 * <FlatTorusTopologyMappers> do so for <FlatTori>, with the major difference
 * being that <PeriodicBoundaryTopologyMappers> allow continuous shifting by
 * fractional amounts whereas <FlatTorusTopologyMappers> only allow shifting by
 * integer multiples of the node spacing.
 *
 * Extends:
 *      - <AbstractTopologyMapper>
 *
 * See also:
 *      - <FlatTorusTopologyMapper>
 */

/*
 * Constructor: constructor
 *
 * construct a new <PeriodicBoundaryTopologyMapper> that embeds a graph within
 * the given volume
 *
 * constructs a new <PeriodicBoundaryTopologyMapper> that embeds a graph within
 * the given volume.  The volume is defined as a box with the given dimensions
 * centered on the given center point.
 *
 * Parameters:
 *     center - the given center point
 *     dimensions - the given dimensions
 */
function PeriodicBoundaryTopologyMapper(center, dimensions) {
    this.setCenter(center);
    this.setDimensions(dimensions);
    this.shifts = utils.map(dimensions, function() { return 0.0; });
}

utils.extend(
    PeriodicBoundaryTopologyMapper.prototype,
    AbstractTopologyMapper.prototype
);

utils.extend(PeriodicBoundaryTopologyMapper.prototype, {
    constructor: PeriodicBoundaryTopologyMapper,

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
     *      - (*Number*) the component of the center point of the embedding
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
        this.center = Array.slice(center);
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
        this.dimensions = utils.map(dimensions, Math.abs);
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
        this.dimensions[i] = Math.abs(x);
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
        this.shifts = Array.slice(shifts);
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
        this.shifts[i] = x;
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
        var input = this.getInput();
        var position = input.graphNodeToPosition.apply(input, arguments);
        position = Array.slice(position, 0);

        var self = this;
        position = utils.map(position, function(x, i) {
            x += self.shifts[i];

            /*
             * handle the periodic wrapping (the seemingly redudant
             * operations are actually here to handle negative values)
             */
            if(Math.abs(self.dimensions[i]) < 1e-8) {
                x = 0;
            } else {
                x %= self.dimensions[i];
                x += self.dimensions[i];
                x %= self.dimensions[i];
            }

            x += self.center[i] - 0.5*self.dimensions[i];

            return x;
        });

        return position;
    },

    /*
     * Method: graphEdgeToPath
     *
     * Implements:
     *      - <AbstractTopologyMapper.graphEdgeToPath>
     */
    graphEdgeToPath: (function() {
    /* jshint maxcomplexity: 20 */
    /* jshint maxstatements: 70 */
    return function graphEdgeToPath(graph, edgeHandle) {
        var p0 = this.graphNodeToPosition(graph, graph.edgeSource(edgeHandle));
        var p1 = this.graphNodeToPosition(
            graph,
            graph.edgeDestination(edgeHandle)
        );

        var self = this;
        utils.iter(p0, function(_, i) {
            if(Math.abs(self.dimensions[i]) < 1e-8) {
                p0[i] = 0;
                p1[i] = 0;
            } else {
                p0[i] += self.dimensions[i];
                p1[i] += self.dimensions[i];

                p0[i] -= self.center[i] - 0.5*self.dimensions[i];
                p1[i] -= self.center[i] - 0.5*self.dimensions[i];

                p0[i] %= self.dimensions[i];
                p1[i] %= self.dimensions[i];
            }
        });

        var delta = new Array(3);
        var deltaNorm = 0;
        var nWrappings = 0;
        var i;
        var j;

        for(i=0; i<3; ++i) {
            delta[i] = p1[i] - p0[i];
            if(Math.abs(delta[i]) > 0.5*this.dimensions[i]) {
                if(p0[i] < p1[i]) { delta[i] -= this.dimensions[i]; }
                else { delta[i] += this.dimensions[i]; }
                ++nWrappings;
            }

            deltaNorm += delta[i]*delta[i];
        }

        deltaNorm = Math.sqrt(deltaNorm);
        for(i=0; i<3; ++i) { delta[i] /= deltaNorm; }

        var result = [];
        var anchorPoint = p0;

        var tracerPoint = Array.slice(p0);
        var factor;

        /* here, the ray casting is done */
        for(j=0; j<nWrappings; ++j) {
            var minI, minFactor;

            /* only used to computing minFactor */
            var firstFlag = true;

            /* perform one ray casting step */
            for(i=0; i<3; ++i) {
                if(Math.abs(delta[i]) < 1e-8) { continue; }

                factor = ( (delta[i] > 0) ?  this.dimensions[i] : 0 );
                factor -= tracerPoint[i];
                factor /= delta[i];

                if(firstFlag || minFactor > factor) {
                    minI = i;
                    minFactor = factor;
                    firstFlag = false;
                }
            }

            var factorIsTiny = ( Math.abs(minFactor) < 1e-8 );
            if(!factorIsTiny) {
                for(i=0; i<3; ++i) { tracerPoint[i] += delta[i]*minFactor; }

                if(result.length > 0) { result.push(null); }

                result.push(anchorPoint);
                result.push(Array.slice(tracerPoint, 0));
            }

            tracerPoint[minI] = (
                delta[minI] > 0
                ? 0
                : this.dimensions[minI]
            );

            anchorPoint = Array.slice(tracerPoint);
        }

        if(result.length > 0) { result.push(null); }

        result.push(anchorPoint);
        result.push(p1);

        result = utils.map(result, function(point, i) {
            if(point) {
                point = utils.map(point, function(x, j) {
                    return x + self.center[j] - 0.5*self.dimensions[j];
                });
            }
            return point;
        });

        return result;
    };
    })()
});

module.exports = PeriodicBoundaryTopologyMapper;

