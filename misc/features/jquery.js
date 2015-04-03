
/*
 * File: jquery
 *
 * (*INTERNAL*)
 * feature module: instance of the jQuery library
 *
 * See:
 *     - <jquery.com at http://www.jquery.com>
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

module.exports = (
    new FeatureDetector("jquery")
        .addGeneratorFunction(function() {
            var features = require("../features");
            var global = features.require("global");
            return ( global.jQuery || global.jquery );
        })

        .addGeneratorFunction(function() {
            try {
                return require("jquery");
            } catch(e) { /* void */ }

            return null;
        })

        .setException(new Error("no jquery library detected"))
);

