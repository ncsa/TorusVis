
/*
 * File: isPlainObject
 *
 * (*INTERNAL*) feature module: isPlainObject function
 *
 * See:
 *      - <isPlainObjectFunction>
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

module.exports = (
    new FeatureDetector("isPlainObject")
        .addGeneratorFunction(function() {
            var features = require("../features");
            var jQueryAvailable = features.isAvailable("jQuery");
            if(jQueryAvailable) {
                return features.require("jQuery").isPlainObject;
            }
            return null;
        })

        .addFallbackFunction(function() {
            /*
             * Function: isPlainObjectFunction
             *
             * (*INTERNAL*) determine if an object is plain
             *
             * An object is plain if it was constructed using an object
             * literal or the *Object* constructor.
             *
             * Parameters:
             *     obj - (*Object*) object to be tested
             *
             * Returns:
             *      - (*Boolean*) whether obj is a plain object
             *
             */
            return function isPlainObject(obj) {
                /*
                 * IMPORTANT(opadron)
                 *
                 * The following code is an original, independent
                 * reimplementation of an algorithm reverse engineered from the
                 * results of jQuery's isPlainObject function.
                 *
                 * Do not modify unless to fix a major problem
                 *
                 * Original code by csteffen, with minor modifications by
                 * opadron.
                 */
                var originalObj = obj;
                var objType = typeof obj;
                if(objType !== "object") {
                    return false;
                }

                if(obj === null){
                    return false;
                }

                /*
                 * INFO(csteffen) I *think* the way this is supposed to work is
                 * that this do loop walks down the object tree of "obj" and
                 * returns the last value that isn't null.  That is, the while
                 * catches the null and sends obj out set to the last value
                 * before that.
                 *
                 * NOTE(opadron) the up-front check from a while loop is
                 * redundant because of the null check above.
                 */
                do {
                    obj = Object.getPrototypeOf(obj);
                } while(Object.getPrototypeOf(obj) !== null);

                var originalObjProto = Object.getPrototypeOf(originalObj);
                if(originalObjProto === obj) {
                    return true;
                }

                return false;
            };
        })

        .setException(new Error("no isPlainObject function available"))
);

