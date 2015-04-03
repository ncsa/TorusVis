
/*
 * File: detector
 *
 * functionality detection and generation facilities
 * 
 * This file adds functionality useful for detecting the presence of existing
 * functionality, adding new functionality to existing objects, and generating
 * entirely new functionality.
 * 
 * The two main classes exported in this file are <FeatureDetector> and
 * <FeatureDetectorRegistry>.  <FeatureDetectors> return a particular feature
 * and test the suitability of the object returned.
 * <FeatureDetectorRegistries> maintain a collection of <FeatureDetectors> and
 * provide methods for querying and accessing the features they return.
 * 
 * All <FeatureDetectorRegistry> instance methods are available as static class
 * methods.  The static methods operate on an internal instance that is
 * prepopulated with a number of <FeatureDetectors>.
 *
 * Example:
 *
 * The following code queries the global <FeatureDetectorRegistry> instance for
 * the <threejs> feature object:
 *
 *     (start code)
 *     var reqFeat = torusvis.FeatureDetectorRegistry.requireFeature;
 *     var threeJSLibrary = reqFeat("threejs");
 *
 *     var myThreeJSScene = new threeJSLibrary.Scene()
 *     ...
 *     (end code)
 *
 * While applications that create their own instances...
 *     (start code)
 *     var registry = new torusvis.FeatureDetectorRegistry();
 *     (end code)
 *
 * ...will start with an empty registry ready to be populated with their own
 * <FeatureDetectors>:
 *
 *     (start code)
 *     (registry
 *         .addFeatureDetector(
 *             (new torusvis.FeatureDetector()
 *                 .addGeneratorFunction(function() { ... })
 *                 .addGeneratorFunction(function() { ... })
 *                 ...
 *                 .addFallbackFunction(function() { ... })
 *                 .addFallbackFunction(function() { ... })
 *                 ...
 *                 .setException(...)
 *             )
 *         )
 *         .addFeatureDetector(
 *             (new torusvis.FeatureDetector()
 *                 .addGeneratorFunction(function() { ... })
 *                 .addGeneratorFunction(function() { ... })
 *                 ...
 *                 .addFallbackFunction(function() { ... })
 *                 .addFallbackFunction(function() { ... })
 *                 ...
 *                 .setException(...)
 *             )
 *         )
 *         ...
 *     );
 *     (end code)
 *
 * See:
 *      - <features>
 */

"use strict";

/*
 * Class: FeatureDetector
 * class that represents a single feature
 * 
 * A <FeatureDetector> contains the functions needed to retrieve or generate an
 * object representing a particular feature (feature object).
 * <FeatureDetectors> use a list of provided functions that return a feature
 * object, calling each one in sequence and testing the suitability of their
 * return values.
 */

/*
 * Constructor: FeatureDetector
 *
 * *constructor*
 *
 * Parameters:
 *
 *     name - (*String*) label indicating the feature to be retrieved
 */
function FeatureDetector(name) {
    this.name = name;
    this.generatorFunctions = [];
    this.fallbackFunctions = [];
    this.testFunction = null;
    this.exceptionToThrow = null;
}

FeatureDetector.prototype.constructor = FeatureDetector;

/*
 * Method: addGeneratorFunction
 *
 * add a function for this <FeatureDetector> to use as a generator
 *
 * A generator function takes no arguments and should return an object
 * containing the feature of interest (e.g. a reference to a library's object)
 *
 * When retrieving a feature, <FeatureDetectors> call their generator
 * functions in the order that they were added, stopping once a suitable
 * object is returned.
 *
 * Parameters:
 *
 *     gFunction - (*function*) the function to add to the list of generators
 *
 * Returns:
 *
 *     - (*<FeatureDetector>*) this
 *
 * See:
 *
 *     - <addGeneratorFunction>
 *     - <addFallbackFunction>
 *     - <setTestFunction>
 *     - <get>
 */
FeatureDetector.prototype.addGeneratorFunction =
function addGeneratorFunction(gFunction) {
    this.generatorFunctions.push(gFunction);
    return this;
};

/*
 * Method: addFallbackFunction
 *
 * add a function for this <FeatureDetector> to use as a fallback
 *
 * Fallback functions are generator functions that a <FeatureDetector> uses to
 * retrieve a feature if no functions given for use as a (normal) generator
 * return suitable feature objects.
 *
 * Fallback functions are not necessarily meant to return implementations of a
 * feature that are complete, perform well, or under normal circumnstances,
 * could be preferred over any feature object returned by a function in the
 * generator list.  Rather, fallback functions are meant to return
 * implementations that attempt to emulate a "native" feature, though there is
 * no requirement on the extent to which such an implementation does so.
 *
 * Parameters:
 *
 *     fbFunction - (*function*) the function to add to the list of fallbacks
 *
 * Returns:
 *
 *     - (*<FeatureDetector>*) this
 *
 * See:
 *
 *     - <addGeneratorFunction>
 *     - <setTestFunction>
 *     - <get>
 */
FeatureDetector.prototype.addFallbackFunction =
function addFallbackFunction(fbFunction) {
    this.fallbackFunctions.push(fbFunction);
    return this;
};

/*
 * Method: setTestFunction
 *
 * set the function for this <FeatureDetector> to use for testing returned
 * feature objects
 *
 * Test functions take one argument - the feature object to be tested - and
 * returns a boolean indicating whether the object passed is suitable.
 *
 * If its test function is set, a <FeatureDetector> will use it to determine
 * what feature objects returned by its provided generator and fallback
 * functions to accept.  Otherwise, the feature object is evaluated as a
 * boolean.
 *
 * Parameters:
 * 
 *     tFunction - (*function) the function to use for testing returned
 *                             feature objects
 *
 * Returns:
 *
 *     - (*<FeatureDetector>*) this
 *
 * See:
 *     - <addGeneratorFunction>
 *     - <addFallbackFunction>
 *     - <get>
 */
FeatureDetector.prototype.setTestFunction =
function setTestFunction(tFunction) {
    this.testFunction = tFunction;
    return this;
};

/*
 * Method: setException
 *
 * set the exception to throw when no suitable feature object can be generated
 *
 * If a <FeatureDetector> exhausts its generator and fallback functions without
 * producing a suitable feature object, the exception passed will be thrown.
 *
 * If unset, a default Error exception is thrown.
 *
 * Parameters:
 *
 *     exc - (*Error*) the exception to throw when no suitable feature object
 *                     is produced
 *
 * Returns:
 *
 *     - (*<FeatureDetector>*) this
 *
 * See:
 *
 *     - <getException>
 *     - <get>
 */
FeatureDetector.prototype.setException =
function setException(exc) {
    this.exceptionToThrow = exc;
    return this;
};

/*
 * Method: getException
 *
 * return the exception to throw when no suitable feature object can be
 * generated
 *
 * If unset, a default Error exception is returned.
 *
 * Returns:
 *
 *     - (*Error*) the exception set to be thrown
 *
 * See:
 *     - <setException>
 *     - <get>
 */
FeatureDetector.prototype.getException =
function getException() {
    var result = this.exceptionToThrow;
    if(!(result)) {
        result = new Error(
            "no feature with name \"" + this.name + "\" detected"
        );
        this.setException(result);
    }

    return result;
};

/*
 * Type: FeatureGeneratorResult
 *
 * (*INTERNAL*) prototype for objects returned by <get>
 *
 * Parameters:
 *
 *     feature    - (*Object*) the object representing the feature, or null
 *     isSuitable - (*Boolean*) true if the feature object is suitable
 *     isFallback - (*Boolean*) true if the feature object was generated
 *                              using a fallback function
 *
 * See:
 *
 *     - <get>
 *     - <addGeneratorFunction>
 *     - <addFallbackFunction>
 */

/*
 * Method: get
 *
 * (*INTERNAL*)
 *
 * generate an object containing this <FeatureDetector's> feature
 *
 * The <FeatureDetector> iterates over all generator functions, testing each
 * feature object returned.  Once a returned object tests as suitable for the
 * first time, the iteration stops and a result object is returned.
 *
 * If no suitable object is returned by a generator function, then the
 * iteration continues over all fallback functions.
 *
 * If no suitable object is returned by a fallback function, then an exception
 * is thrown.
 *
 * Returns:
 *
 *     - (*<FeatureGeneratorResult>*) the generation result
 *
 * See:
 *
 *     - <FeatureGeneratorResult>
 *     - <addGeneratorFunction>
 *     - <addFallbackFunction>
 *     - <setTestFunction>
 *     - <setException>
 *     - <getException>
 */
FeatureDetector.prototype.get =
function get() {
    var result = {
        feature: null,
        isSuitable: false,
        isFallback: false
    };

    var functionLists = [
        this.generatorFunctions,
        this.fallbackFunctions
    ];

    var self = this;

    functionLists.some(function(functionList, index) {
        return functionList.some(function(gFunction) {
            try { result.feature = gFunction(); }
            catch(e) { return false; }

            var hasTestFunction = Boolean(self.testFunction);
            if(hasTestFunction) {
                result.isSuitable = self.testFunction(result.feature);
            } else {
                result.isSuitable = Boolean(result.feature);
                if(result.isSuitable && typeof result.feature === "object") {
                    result.isSuitable = (
                        Object.keys(result.feature).length !== 0
                    );
                }
            }

            if(result.isSuitable) {
                result.isFallback = ( index !== 0 );
                return true;
            }
        });
    });

    return result;
};

/*
 * Class: FeatureDetectorRegistry
 *
 * collection of <FeatureDetectors>
 *
 * A <FeatureDetectorRegistry> is a collection of <FeatureDetectors> indexed by
 * name.  <FeatureDetectorRegistries> provide a feature namespace with cached
 * queries.
 */

/*
 * Constructor: FeatureDetectorRegistry
 *
 * *constructor*
 */
function FeatureDetectorRegistry() {
    this.featureTable = {};
}

FeatureDetectorRegistry.prototype.constructor = FeatureDetectorRegistry;

var featureDetectorRegistryMethods = {
    /*
     * Method: addFeatureDetector
     *
     * add a <FeatureDetector>
     *
     * adds the given <FeatureDetector> to the registry
     *
     * Parameters:
     *
     *     featureDetector - (*<FeatureDetector>*) <FeatureDetector> to be
     *                       added
     *
     * Returns:
     *
     *     - (*<FeatureDetectorRegistry>*) this
     *
     * Throws:
     * 
     *     - (*Error*) if another <FeatureDetector> with the same name has
     *                 already been added
     *
     * See:
     *
     *     - <getFeature>
     *     - <requireFeature>
     */
    addFeatureDetector:
    function addFeatureDetector(featureDetector) {
        var key = featureDetector.name;
        if(this.featureTable.hasOwnProperty(key)) {
            throw new Error("entry with name \"" + key + "\" already exists");
        }

        this.featureTable[key] = {
            featureDetector: featureDetector,
            featureGenerationResult: null
        };

        return this;
    },

    /*
     * Method: getFeatureEntry
     *
     * (*INTERNAL*)
     *
     * return the internal table entry for a given feature
     *
     * Parameters:
     *
     *     key - (*String*) the name of the <FeatureDetector> to look up
     *
     * Returns:
     *
     *     - (*Object*) the internal table entry for a given feature
     *
     * Throws:
     * 
     *     - (*Error*) if no entry with the given name exists
     *
     * See:
     *
     *     - <addFeatureDetector>
     */
    getFeatureEntry:
    function getFeatureEntry(key) {
        if(!this.featureTable.hasOwnProperty(key)) {
            throw new Error("no entry with name \"" + key + "\" found");
        }

        return this.featureTable[key];
    },

    /*
     * Method: generateFeature
     *
     * (*INTERNAL*)
     *
     * generate a feature object using the <FeatureDetector> registered under
     * the given name
     *
     * The <FeatureDetector> corresponding to the given name is used to
     * generate a feature object.  If successful, the result is cached and the
     * feature object is returned.
     *
     * Parameters:
     *
     *     key - (*String*) the name of the <FeatureDetector> to look up
     *
     * Returns:
     *
     *     - (*<FeatureDetector.FeatureGeneratorResult>*) the result object
     *     returned by the corresponding <FeatureDetector>
     *
     * Throws:
     *
     *     - (*Error*) if no entry with the given name exists
     *
     * See:
     *
     *     - <FeatureDetector.get>
     *     - <addFeatureDetector>
     *     - <getFeature>
     *     - <requireFeature>
     */
    generateFeature:
    function generateFeature(key) {
        var entry = this.getFeatureEntry(key);
        if(!(entry.featureGenerationResult)) {
            entry.featureGenerationResult = entry.featureDetector.get();
        }

        return entry.featureGenerationResult;
    },

    /*
     * Method: featureIsAvailable
     *
     * determine if a given feature is available
     *
     * The feature is available if some suitable feature object was
     * successfully generated, regardless of whether it was by a generator or
     * fallback function.
     *
     * The given feature is generated if it has not already been.
     *
     * Parameters:
     *
     *     key - (*String*) the name of the <FeatureDetector> to look up
     *
     * Returns:
     *
     *     - (*Boolean*) true if a given feature is available
     *
     * Throws:
     *
     *     - (*Error*) if no entry with the given name exists
     *
     * See:
     *
     *     - <FeatureDetector.addGeneratorFunction>
     *     - <FeatureDetector.addFallbackFunction>
     *
     *     - <featureIsNative>
     *     - <getFeature>
     *     - <requireFeature>
     */
    featureIsAvailable:
    function featureIsAvailable(key) {
        var featureGenerationResult = this.generateFeature(key);
        return featureGenerationResult.isSuitable;
    },

    /**
     * Method: featureIsNative
     *
     * determine if a given feature is available in a native form
     *
     * The feature is available in a native form if a suitable feature object
     * was successfully generated using a generator function.
     *
     * The given feature is generated if it has not already been.
     *
     * Parameters:
     *
     *     key - (*String*) the name of the <FeatureDetector> to look up
     *
     * Returns:
     *
     *     - (*Boolean*) true if a given feature is available in a native form
     *
     * Throws:
     *
     *     - (*Error*) if no entry with the given name exists
     *
     * See:
     *
     *     - <FeatureDetector.addGeneratorFunction>
     *
     *     - <featureIsAvailable>
     *     - <getFeature>
     *     - <requireFeature>
     */
    featureIsNative:
    function featureIsNative(key) {
        var featureGenerationResult = this.generateFeature(key);
        return !featureGenerationResult.isFallback;
    },

    /**
     * Method: getFeature
     *
     * return the given feature object
     *
     * The generated feature object is returned, or null if the feature is
     * unavailable.
     *
     * The given feature object is generated if it has not already been.
     *
     * Parameters:
     *
     *     key - (*String*) the name of the <FeatureDetector> to look up
     *
     * Returns:
     *
     *     - (*Object*) the corresponding feature object generated, or null
     *
     * Throws:
     *
     *     - (*Error*) if no entry with the given name exists
     *
     * See:
     *
     *    - <addFeatureDetector>
     *    - <featureIsAvailable>
     *    - <requireFeature>
     */
    getFeature:
    function getFeature(key) {
        var featureGenerationResult = this.generateFeature(key);
        var result = null;
        if(featureGenerationResult.isSuitable) {
            result = featureGenerationResult.feature;
        }

        return result;
    },

    /**
     * Method: requireFeature
     *
     * return the given feature object, or throw an exception if it is
     * unavailable
     *
     * The given feature object is generated and returned as in <getFeature>,
     * but instead of returning null when it is unavailable, an exception is
     * thrown.
     *
     * Parameters:
     *
     *     key - (*String*) the name of the <FeatureDetector> to look up
     *
     * Returns:
     *
     *     - (*Object*) the corresponding feature object generated
     *
     * Throws:
     *
     *     - (*Error*) if the given feature is unavailable
     *     - (*Error*) if no entry with the given name exists
     *
     * See:
     *
     *     - <addFeatureDetector>
     *     - <featureIsAvailable>
     *     - <getFeature>
     */
    requireFeature:
    function requireFeature(key) {
        var featureGenerationResult = this.generateFeature(key);
        if(!featureGenerationResult.isSuitable) {
            throw this.getFeatureEntry(key).featureDetector.getException();
        }

        return featureGenerationResult.feature;
    }
};

Object.keys(featureDetectorRegistryMethods).forEach(function(methodName) {
    var method = featureDetectorRegistryMethods[methodName];
    FeatureDetectorRegistry.prototype[methodName] = method;
});

var globalFeatureDetectorRegistry = new FeatureDetectorRegistry();

function setMethod(methodName) {
    var method = featureDetectorRegistryMethods[methodName];
    FeatureDetectorRegistry[methodName] = function() {
        var result = method.apply(globalFeatureDetectorRegistry, arguments);
        if(result === globalFeatureDetectorRegistry) {
            result = FeatureDetectorRegistry;
        }

        return result;
    };
}

Object.keys(featureDetectorRegistryMethods).forEach(setMethod);

exports.FeatureDetector = FeatureDetector;
exports.FeatureDetectorRegistry = FeatureDetectorRegistry;

