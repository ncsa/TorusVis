
/*
 * File: threejs
 *
 * (*INTERNAL*)
 * feature module: instance of the three.js graphics library
 *
 * See:
 *     - <threejs.org at http://www.threejs.org>
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

module.exports = (
    new FeatureDetector("threejs")
        .addGeneratorFunction(function() {
            var features = require("../features");
            var _global_ = features.require("global");

            return (
                _global_.THREE ||
                _global_.three ||
                _global_.THREEJS ||
                _global_.threejs
            );
        })

        .addGeneratorFunction(function() {
            try {
                return require("three");
            } catch(e) { /* void */ }

            return null;
        })

        .setException(new Error("no threejs library detected"))
);

