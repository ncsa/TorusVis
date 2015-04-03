
/*
 * File: isString
 *
 * (*INTERNAL*) feature module: isString function
 *
 * See:
 *     - <isStringFunction>
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

module.exports = (
    new FeatureDetector("isString")
        .addGeneratorFunction(function() {
            /* Function: isStringFunction
             *
             * function to determine if an object is a *String*
             *
             * Parameters:
             *
             *     x - (*Object*) object to be checked
             *
             * Returns:
             *
             *      - (*Boolean*) whether x is a *String*
             *
             * See:
             *      - <isString>
             */
            return function isStringFunction(x) {
                return (typeof x === "string");
            };
        })

        .setException(new Error("no isString function available"))
);

