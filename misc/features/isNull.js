
/*
 * File: isNull
 *
 * (*INTERNAL*) feature module: isNull function
 *
 * See:
 *     - <isNullFunction>
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

module.exports = (
    new FeatureDetector("isNull")
        .addGeneratorFunction(function() {
            /* Function: isNullFunction
             *
             * function determine if an object is null
             *
             * Parameters:
             *
             *     x - (*Object*) object to be compared to null
             *
             * Returns:
             *
             *      - (*Boolean*) whether x is null
             *
             * See:
             *      - <isNull>
             */
            return function isNullFunction(x) {
                return (x === (void 0)) || (x === null);
            };
        })

        .setException(new Error("no isNull function available"))
);

