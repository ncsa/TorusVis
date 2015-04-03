
/*
 * File: isFunction
 *
 * (*INTERNAL*) feature module: isFunction function
 *
 * See:
 *     - <isFunctionFunction>
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

module.exports = (
    new FeatureDetector("isFunction")
        .addGeneratorFunction(function() {
            /* Function: isFunctionFunction
             *
             * function determine if an object is a function
             *
             * Parameters:
             *
             *     x - (*Object*) object to be checked
             *
             * Returns:
             *
             *      - (*Boolean*) whether x is a function
             *
             * See:
             *      - <isFunction>
             */
            return function isFunctionFunction(x) {
                return (typeof x === "function");
            };
        })

        .setException(new Error("no isFunction function available"))
);

