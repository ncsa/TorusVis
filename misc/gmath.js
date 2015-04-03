
/*
 * gmath.js: math routines for 3D graphics
 *
 * @author: Omar Padron (opadron@illinois.edu)
 */

"use strict";

var utils = require("./utils");
var features = require("./features");

var threejs = features.get("threejs");

/* 
 * constant vectors pointing along the x, y, and z axes
 */
var I_WORLD,
    J_WORLD,
    K_WORLD,
    Y_UP_TO_Z_UP,
    Z_UP_TO_Y_UP;

if(threejs) {
    I_WORLD = new threejs.Vector3(1, 0, 0);
    J_WORLD = new threejs.Vector3(0, 1, 0);
    K_WORLD = new threejs.Vector3(0, 0, 1);

    Y_UP_TO_Z_UP = (new threejs.Matrix4()).set(
        1, 0,  0, 0,
        0, 0, -1, 0,
        0, 1,  0, 0,
        0, 0,  0, 1
    );

    Z_UP_TO_Y_UP = (new threejs.Matrix4()).set(
        1,  0, 0, 0,
        0,  0, 1, 0,
        0, -1, 0, 0,
        0,  0, 0, 1
    );
}

/*
 * canonicalAngle: rescale angle to lie within the range [0, 2*Math.PI)
 *
 * returns: the angle that is rotationally equivalent to
 *          [th] within the range [0, 2*Math.PI)
 */
function canonicalAngle(th) {
    return th - 2*Math.PI*Math.floor(0.5*th/Math.PI);
}

/*
 * angleDiff: compute angle between two vectors
 *
 * returns: the absolute angle between the two vectors [v1] and [v2]
 */
function angleDiff(v1, v2) {
    return Math.acos(
        v1.dot(v2)/( v1.length()*v2.length() )
    );
}

if(threejs) {
    /* monkey-patch two new methods into the Matrix4 class in threejs */
    utils.extend(threejs.Matrix4.prototype, {
        constructor: threejs.Matrix4,

        /*
         * makeSpan: construct a transformation matrix from world basis to a new
         * basis
         *
         * if threejs.Vector3's [v1] and [v2] are given, initialize the matrix
         * so that the new basis it transforms to has a local X-axis that points
         * towards [v1 - v2], a local Y-axis that bisects the angle between [v1]
         * and [v2], and a local Z-axis that points towards the cross product of
         * [v1] and [v2]
         *
         * if provided, [v1] and [v2] must not be colinear.
         *
         * else, initialize the matrix so that its axes point along the
         * corresponding global axes (identity matrix)
         */
        makeSpan:
        function makeSpan(v1, v2) {
            if(arguments.length < 2) {
                return this.identity();
            }

            v1 = new threejs.Vector3.copy(v1).normalize();
            v2 = new threejs.Vector3.copy(v2).normalize();

            var i = new threejs.Vector3.copy(v1).sub(v2).normalize(),
                j = new threejs.Vector3.copy(v1).add(v2).normalize(),
                k = new threejs.Vector3.copy(i).cross(j).normalize(),

                ix = i.x, iy = i.y, iz = i.z,
                jx = j.x, jy = j.y, jz = j.z,
                kx = k.x, ky = k.y, kz = k.z;

            return this.set(
                 ix,  iy,  iz, 0.0,
                 jx,  jy,  jz, 0.0,
                 kx,  ky,  kz, 0.0,
                0.0, 0.0, 0.0, 1.0
            );
        },

        /*
         * makeCoord: construct a transformation matrix from world coordinates
         * to local coordinates
         *
         * if threejs.Vector3's [v1] and [v2] are given, initialize the matrix
         * so that the new basis it transforms to has a local X-axis that points
         * towards [v1 - v2], a local Y-axis that bisects the angle between [v1]
         * and [v2], and a local Z-axis that points towards the cross product of
         * [v1] and [v2]
         *
         * if provided, the local origin is set to threejs.Vector3 [origin].
         *
         * if provided, [v1] and [v2] must not be colinear.
         *
         * else, initialize the matrix so that local and world coordinates match
         * (identity matrix)
         */
        makeCoord:
        function MakeCoord(v1, v2, origin) {
            origin = origin || new threejs.Vector3(0.0, 0.0, 0.0);

            this.makeSpan(v1, v2);
            this.multiply(
                new threejs.Matrix4()
                    .makeTranslation(-origin.x, -origin.y, -origin.z)
            );
        }
    });
}

var lerp = (function() {
/* jshint maxparams: 5 */
return function lerp(x, iMin, iMax, oMin, oMax) {
    if(arguments.length < 4) { oMin = 0.0; }
    if(arguments.length < 5) { oMax = 1.0; }

    return (x - iMin)*(oMax - oMin)/(iMax - iMin) + oMin;
};
})();

function scaleDownMapper(center, boxDimensions) {
    function result(r, a) {
        r.x = lerp(a, 0.0, 1.0, r.x, (r.x - center.x)/boxDimensions.x);
        r.y = lerp(a, 0.0, 1.0, r.y, (r.y - center.y)/boxDimensions.y);
        r.z = lerp(a, 0.0, 1.0, r.z, (r.z - center.z)/boxDimensions.z);

        return r;
    }

    return result;
}

function scaleUpMapper(center, boxDimensions) {
    function result(r, a) {
        r.x = lerp(a, 0.0, 1.0, r.x, (r.x*boxDimensions.x + center.x));
        r.y = lerp(a, 0.0, 1.0, r.y, (r.y*boxDimensions.y + center.y));
        r.z = lerp(a, 0.0, 1.0, r.z, (r.z*boxDimensions.z + center.z));

        return r;
    }

    return result;
}

function polarizeMapper(dimensionOrder, nPoints, radiusRatio) {
    function result(r, a) {
        var rd1 = r[dimensionOrder[0]] + 0.5;
        var radius = 0.5*((1 - rd1)*radiusRatio + rd1);
        var a2 = (1 - Math.pow(1 - a, 4));
        var rescaledR = lerp(
            r[dimensionOrder[1]],
            -0.5, 0.5,
            -0.5, nPoints/(nPoints + 1) - 0.5
        );
        var theta = ((1-a)*0.1 + a*2.0)*rescaledR*Math.PI;

        r[dimensionOrder[0]] = lerp(
            a2,
            0.0, 1.0,
            r[dimensionOrder[0]],
            radius*Math.cos(a*theta)
        );

        r[dimensionOrder[1]] = lerp(
            a2,
            0.0, 1.0,
            r[dimensionOrder[1]],
            radius*Math.sin(a*theta)
        );

        return r;
    }

    return result;
}

function downPolarizeUpMapper(args) {
    var center = args.centerList[0];
    var center2 = args.centerList[1];
    var boxDimensions = args.boxDimensionList[0];
    var boxDimensions2 = args.boxDimensionList[1];
    var dimensionOrder = args.dimensionOrder;
    var nPoints = args.numPoints;
    var radiusRatio = args.radiusRatio;

    var p = scaleDownMapper(center, boxDimensions),
        m = polarizeMapper(dimensionOrder, nPoints, radiusRatio),
        q = scaleUpMapper(center2, boxDimensions2);

    var r2 = new threejs.Vector3();
    function result(r, a) {
        r2.copy(r);
        q(m(p(r2, 1.0), a), 1.0);
        r.x = lerp(a, 0.0, 1.0, r.x, r2.x);
        r.y = lerp(a, 0.0, 1.0, r.y, r2.y);
        r.z = lerp(a, 0.0, 1.0, r.z, r2.z);
        return r;
    }

    return result;
}

function torusMapper(args) {
    args = utils.extend({ crossFadeFactor: 0.0 }, args || {});

    var center = args.center;
    var boxDimensions = args.boxDimensions;
    var gridDimensions = args.gridDimensions;
    var radiusRatio = args.radiusRatio;
    var crossFadeFactor = args.crossFadeFactor;

    var boxDimensions2 = new threejs.Vector3().copy(boxDimensions);
    boxDimensions2.x *= 0.5;


    /* jshint -W098 */
    var pmq1;
    var pmq2;

    (function() {
    /* jshint unused:false */
        pmq1 = downPolarizeUpMapper({
            centerList: [center, center],
            boxDimensionList: [boxDimensions, boxDimensions],
            dimensionOrder: ["x", "y", "z"],
            numPoints: gridDimensions.y,
            radiusRatio: radiusRatio
        });

        pmq2 = downPolarizeUpMapper({
            centerList: [center, center],
            boxDimensionList: [boxDimensions, boxDimensions],
            dimensionOrder: ["y", "z", "x"],
            numPoints: gridDimensions.z,
            radiusRatio: radiusRatio
        });
    })();

    if(crossFadeFactor < 0.01) { crossFadeFactor = 0.01; }
    var cf2 = 0.5*crossFadeFactor;

    var result; (function() {
    /* jshint maxstatements: 30 */
    result = function result(r, a) {
        if(a < 0.0) { a = 0.0; }
        if(a > 1.0) { a = 1.0; }

        var a0 = 0.0;
        var a1 = 0.0;

        if(a < 0.5 + cf2) { a0 = a/(0.5 + cf2); }
        if(a > 0.5 - cf2) { a1 = (a - 0.5 + cf2)/(0.5 + cf2); }

        if(a < 0.5 - cf2) { return pmq2(pmq1(r, a0), 0.0); }
        if(a > 0.5 + cf2) { return pmq2(pmq1(r, 1.0), a1); }

        var alpha = (a - 0.5 + cf2)/crossFadeFactor;
        var r0 = pmq2(pmq1(new threejs.Vector3().copy(r), a0), 0.0);
        var r1 = pmq2(pmq1(new threejs.Vector3().copy(r), 1.0), a1);

        r.x = lerp(alpha, 0.0, 1.0, r0.x, r1.x);
        r.y = lerp(alpha, 0.0, 1.0, r0.y, r1.y);
        r.z = lerp(alpha, 0.0, 1.0, r0.z, r1.z);

        return r;
    };
    })();

    return result;
}

utils.extend(exports, {
    I_WORLD              : I_WORLD             ,
    J_WORLD              : J_WORLD             ,
    K_WORLD              : K_WORLD             ,
    Y_UP_TO_Z_UP         : Y_UP_TO_Z_UP        ,
    Z_UP_TO_Y_UP         : Z_UP_TO_Y_UP        ,

    angleDiff            : angleDiff           ,
    canonicalAngle       : canonicalAngle      ,
    downPolarizeUpMapper : downPolarizeUpMapper,
    lerp                 : lerp                ,
    polarizeMapper       : polarizeMapper      ,
    scaleDownMapper      : scaleDownMapper     ,
    scaleUpMapper        : scaleUpMapper       ,
    torusMapper          : torusMapper
});


