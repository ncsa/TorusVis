
/*
 * File: urlArguments
 *
 * (*INTERNAL*) feature module: urlArguments function
 *
 * See:
 *      - <urlArgumentsFunction>
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

module.exports = (
    new FeatureDetector("urlArguments")
        .addGeneratorFunction(function() {
            var features = require("../features");
            var _global_ = features.require("global");

            /*
             * Type: UrlArgumentsFunctionResult
             *
             * (*INTERNAL*) prototype for objects returned by
             * <urlArgumentsFunction>
             *
             * Parameters:
             *
             *     keyword - (*Object*) key-value mapping of arguments.
             *     Duplicate keys are mapped to the value assigned to the
             *     last instance.  The current location path is mapped to
             *     null.
             *
             *     positional - (*Array*) array of key-value pairs, the
             *     first of which is *[path, null]* where *path* is the
             *     current location path.
             *
             * See:
             *     - <urlArguments>
             *     - <urlArgumentsFunction>
             */

            /*
             * Function: urlArgumentsFunction
             *
             * (*INTERNAL*) parses cgi arguments at the end of a url
             *
             * Parameters:
             *
             *     href - (*String*) an href or url
             *     (default: the current page's location href)
             *
             * Returns:
             *  - (*<UrlArgumentsFunctionResult>*) object containing the
             *  parsed cgi arguments
             *
             * See:
             *      - <urlArguments>
             *      - <UrlArgumentsFunctionResult>
             */
            return function urlArgumentsFunction(href) {
                href = href || _global_.location.href;
                var hashes;
                var indexOfQM = href.indexOf("?");
                var noURLArguments = (
                    (indexOfQM < 0) ||
                    (indexOfQM + 1 >= href.length)
                );
                if(noURLArguments) {
                    hashes = [ href ];
                } else {
                    hashes = (
                        [
                            href.slice(0, indexOfQM)
                        ].concat(
                            href
                                .slice(href.indexOf("?") + 1)
                                .split("&")
                        )
                    );
                }

                var result = {
                    positional: new Array(hashes.length),
                    keyword: { }
                };


                hashes.forEach(function(hash, index) {
                    hash = hash.split("=");
                    var key = hash[0];
                    var val = hash.slice(1).join("=") || null;

                    result.positional[index] = [key, val];
                    result.keyword[key] = val;
                });

                return result;
            };
        })

        .setException(new Error("no urlArguments function available"))
);

