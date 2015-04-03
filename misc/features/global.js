
/*
 * File: global
 *
 * (*INTERNAL*)
 * feature module: global namespace object
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

var notFound = function() {};

module.exports = (
    new FeatureDetector("global")
        .addGeneratorFunction(function() {
            /* global window */
            return (
                (typeof window) !== "undefined" ? window
              : (typeof global) !== "undefined" ? global
              : notFound
            );
        })

        .setTestFunction(function(x) {
            return ( x !== notFound );
        })

        .addFallbackFunction(function() {
            return { };
        })

        .setException(new Error("global namespace unavailable"))
);

