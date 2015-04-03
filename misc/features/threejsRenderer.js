
/*
 * File: threejsRenderer
 *
 * (*INTERNAL*)
 * feature module: instance of a three.js renderer class
 *
 * The renderer is either hardware accelerated
 * (<WebGLRenderer at
 * http://threejs.org/docs/#Reference/Renderers/WebGLRenderer>),
 * or using software rendering if hardware acceleration is not available
 * (<CanvasRenderer at
 * http://threejs.org/docs/#Reference/Renderers/CanvasRenderer>).
 *
 * See:
 *     - <threejs>
 *     - <webGLRendering>
 *     - <canvasRendering>
 *     - <three.js License>
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

module.exports = (
    new FeatureDetector("threejsRenderer")

        .addGeneratorFunction(function() {
            var features = require("../features");
            var threejs = features.require("threejs");
            var webGLAvailable = features.isAvailable("webGLRendering");
            var result = null;

            if(webGLAvailable) {
                result = threejs.WebGLRenderer;
            }

            return result;
        })

        .addFallbackFunction(function() {
            var features = require("../features");
            var threejs = features.require("threejs");

            var canvasRenderingAvailable = (
                features.isAvailable("canvasRendering")
            );

            var result = null;

            if(canvasRenderingAvailable) {
                result = threejs.CanvasRenderer;
            }

            return result;
        })

        .setException(new Error("no suitable threejs renderer detected"))
);

