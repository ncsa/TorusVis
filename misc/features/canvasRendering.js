
/*
 * File: canvasRendering
 *
 * (*INTERNAL*)
 * feature module: returns true if software rendering is available
 *
 * See:
 *     - <three.js License>
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

module.exports = (
    new FeatureDetector("canvasRendering")
        .addGeneratorFunction(function() {
            var features = require("../features");
            var global = features.require("global");
            return Boolean(global.CanvasRenderingContext2D);
        })

        .setException(new Error("canvas rendering unavailable"))
);

