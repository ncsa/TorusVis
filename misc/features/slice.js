
/*
 * File: slice
 *
 * (*INTERNAL*) feature module: Array.slice static method
 *
 * Returns <sliceMethod>.  Also has the side-effect of assigning
 * <sliceMethod> to Array.slice if previously undefined.
 *
 * See:
 *      - <sliceMethod>
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

module.exports = (
    new FeatureDetector("slice")
        .addGeneratorFunction(function() {
            var features = require("../features");
            var _global_ = features.require("global");
            return _global_.Array.slice;
        })

        .addFallbackFunction(function() {
            var features = require("../features");
            var _global_ = features.require("global");

            /*
             * Method: sliceMethod
             *
             * (*INTERNAL*) Array.slice method
             *
             * See:
             *     - <Array.slice() at
             * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice>
             */
            _global_.Array.slice = function sliceMethod() {
                var args = new _global_.Array(arguments.length - 1);
                for(var i=0; i<arguments.length - 1; ++i) {
                    args[i] = arguments[i+1];
                }

                return _global_.Array.prototype.slice.apply(
                    arguments[0], args
                );
            };

            return _global_.Array.slice;
        })

        .setException(new Error("no Array.slice function available"))
);

