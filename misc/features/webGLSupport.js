
/*
 * File: webGLSupport
 *
 * (*INTERNAL*)
 * feature module: true if webGL support is detected
 *
 * See:
 *     - The Khronos group <webGL page at http://www.khronos.org/webgl/>
 *     - <get.webgl.org at http://get.webgl.org/>
 *     - <three.js License>
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

module.exports = (
    new FeatureDetector("webGLSupport")
        .addGeneratorFunction(function() {
            var features = require("../features");
            var _global_ = features.require("global");

            return Boolean(_global_.WebGLRenderingContext);
        })

        .setException(new Error("No webGL support detected"))
);

