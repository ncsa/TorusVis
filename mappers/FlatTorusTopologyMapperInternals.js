
/*
 * File: FlatTorusTopologyMapperInternals
 */

"use strict";

require("../misc/features").require("slice");

module.exports = {
    edgeWraps:
    function edgeWraps(tmp) {
        var edgeCoordinates = tmp.graph.edgeCoordinates(tmp.edgeHandle);
        var edgeDimension = edgeCoordinates.pop();

        var edgeSource = tmp.graph.edgeSource(tmp.edgeHandle);
        var edgeDestination = tmp.graph.edgeDestination(tmp.edgeHandle);

        var p0 = tmp.self.graphNodeToPosition(tmp.graph, edgeSource);
        var p1 = tmp.self.graphNodeToPosition(tmp.graph, edgeDestination);

        var result = (
            ( p0[edgeDimension] > p1[edgeDimension] ) ||
            ( edgeSource === edgeDestination ) /* singular dimension case */
        );

        tmp.p0 = p0;
        tmp.p1 = p1;
        tmp.edgeDimension = edgeDimension;

        return result;
    },

    traceWrappingEdge:
    function traceWrappingEdge(tmp) {
        var graphDimensions = tmp.graph.getDimensions();

        var delta = 0.5*tmp.self.dimensions[tmp.edgeDimension];
        delta /= graphDimensions[tmp.edgeDimension];

        var result = [ ];
        var dummyPoint;

        result.push(tmp.p0);

        dummyPoint = Array.slice(tmp.p0);
        dummyPoint[tmp.edgeDimension] += delta;
        result.push(dummyPoint);

        result.push(null);

        dummyPoint = Array.slice(tmp.p1);
        dummyPoint[tmp.edgeDimension] -= delta;
        result.push(dummyPoint);

        result.push(tmp.p1);

        return result;
    }
};

