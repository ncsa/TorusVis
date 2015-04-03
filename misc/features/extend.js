
/*
 * File: extend
 *
 * (*INTERNAL*) feature module: extend function from <jQuery>
 *
 * See:
 *      - <extendFunction>
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

module.exports = (
    new FeatureDetector("extend")
        .addGeneratorFunction(function() {
            var features = require("../features");
            var jQueryAvailable = features.isAvailable("jquery");

            if(jQueryAvailable) {
                return features.require("jquery").extend;
            }

            return null;
        })

        .addFallbackFunction(function() {
            var features = require("../features");
            var isPlainObject = features.require("isPlainObject");
            var isNull = features.require("isNull");

            /*
             * if jQuery.extend is not available, use this fallback
             * (a slightly modified version from jquery's source)
             */

            /*
             * Function: extendFunction
             *
             * (*INTERNAL*) extend function returned by the <extend> feature
             *
             * extends a target object with the attributes of one or more
             * source objects.  The sources are used in the order that they
             * are given.  New attributes replace existing target attributes
             * of the same name.
             *
             * Parameters:
             *     
             *     target - (*Object*) object to be extended
             *     source[, ...] - (*Object*) one or more source objects
             *
             * Returns:
             *
             *      - (*Object*) the target object after extending
             *
             * See:
             *     - <jQuery.extend at
             *       https://api.jquery.com/jquery.extend/>
             *     - <jQuery License>
             */

            /* jshint maxcomplexity: 15 */
            /* jshint maxstatements: 30 */
            /* jshint forin: false */
            return function extendFunction(target, source) {
                /* copy reference to target object */
                target = arguments[0] || {};
                var i = 1;
                var length = arguments.length;
                var deep = false;
                var options, name, src, copy;

                // Handle a deep copy situation
                if(typeof target === "boolean") {
                    deep = target;
                    target = arguments[1] || {};
                    // skip the boolean and the target
                    i = 2;
                }

                /*
                 * Handle case when target is a string
                 * or something (possible in deep copy)
                 */
                if(
                    typeof target !== "object"   &&
                    typeof target !== "function"
                ) {
                    target = {};
                }

                /*
                 * in jQuery, extend() adds attributes to jQuery
                 * itself if only one argument is passed
                 *
                 * for torusvis, an Error is thrown, instead
                 */
                if(length === i) {
                    /*
                     * don't do this
                     * -------------
                     * target = this;
                     * --i;
                     */

                    /* do this, instead */
                    throw new Error("invalid number of arguments");
                }

                for( ; i < length; i++) {
                    /* only deal with non-null/undefined values */
                    options = arguments[i];
                    if(!isNull(options)) {
                        /* extend the base object */
                        for(name in options) {
                            src = target[name];
                            copy = options[name];

                            /* prevent never-ending loop */
                            if(target === copy) {
                                continue;
                            }

                            /* recurse */
                            if(deep && copy && isPlainObject(copy)) {
                                var clone = src;

                                /*
                                 * never move original objects,
                                 * clone them, instead
                                 */
                                target[name] = extendFunction(
                                    deep, clone, copy
                                );

                            /* don't bring in undefined values */
                            } else if(copy !== undefined) {
                                target[name] = copy;
                            }
                        }
                    }
                }

                /* return the modified object */
                return target;
            };
        })

        .setException(new Error("no extend function available"))
);

