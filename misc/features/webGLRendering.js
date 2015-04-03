
/*
 * File: webGLRendering
 *
 * (*INTERNAL*)
 * feature module: true if hardware accelerated rendering is available
 *
 * See:
 *     - <webGLSupport>
 *     - <three.js License>
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

module.exports = (
    new FeatureDetector("webGLRendering")
        .addGeneratorFunction(function() {
            var features = require("../features");
            var _global_ = features.require("global");

            var webGLSupported = features.isAvailable("webGLSupport");
            if(!webGLSupported) { return false; }

            var webGLAvailable = false;
            try {
                var canvas = _global_.document.createElement("canvas");
                webGLAvailable = (
                    canvas.getContext("webgl") ||
                    canvas.getContext("experimental-webgl")
                );
            } catch(e) { }

            return webGLAvailable;
        })

        .setException(new Error("webGL rendering unavailable"))
);

