
/*
 * File: ThreeJSSceneNodeOutputEngine
 *
 * output engine implementation producing a threejs scene node
 *
 * See also:
 *      - <threejs>
 */

"use strict";

var utils = require("../misc/utils");
var GenericOutputEngine = require("./GenericOutputEngine");
var features = require("../misc/features");

var _private_ = require("./ThreeJSSceneNodeOutputEngineInternals");

var threejs = features.get("threejs");

function _checkForThreeJS_() {
    if(!threejs) { throw Error("no three.js library detected"); }
}

/*
 * Class: ThreeJSSceneNodeOutputEngine
 *
 * output engine producing a threejs scene node
 *
 * Extends:
 *      - <GenericOutputEngine>
 *
 * See also:
 *      - <ThreeJSOutputEngine>
 */

/*
 * Constructor: constructor
 *
 * Extends:
 *      - <GenericOutputEngine.constructor>
 */
function ThreeJSSceneNodeOutputEngine(graph, mapper) {
    _checkForThreeJS_();
    GenericOutputEngine.apply(this, arguments);
    this.getOutput().sceneNode = new threejs.Object3D();
}

utils.extend(
    ThreeJSSceneNodeOutputEngine.prototype,
    GenericOutputEngine.prototype
);

utils.extend(ThreeJSSceneNodeOutputEngine.prototype, {
    constructor: ThreeJSSceneNodeOutputEngine,

    /*
     * Method: clearNodeGroupCache
     *
     * Implements:
     *      - <AbstractOutputEngine.clearNodeGroupCache>
     */
    clearNodeGroupCache:
    function clearNodeGroupCache(groupName) {
        if(arguments.length > 0) {
            var cache = this.getNodeGroupCache(groupName);
            var actor = cache.actor;

            if(Boolean(actor)) { this.getOutput().sceneNode.remove(actor); }
        }

        return GenericOutputEngine.prototype.clearNodeGroupCache.apply(
            this,
            arguments
        );
    },

    /*
     * Method: clearEdgeGroupCache
     *
     * Implements:
     *      - <AbstractOutputEngine.clearEdgeGroupCache>
     */
    clearEdgeGroupCache:
    function clearEdgeGroupCache(groupName) {
        if(arguments.length > 0) {
            var cache = this.getEdgeGroupCache(groupName);
            var actor = cache.actor;

            if(Boolean(actor)) { this.getOutput().sceneNode.remove(actor); }
        }

        return GenericOutputEngine.prototype.clearEdgeGroupCache.apply(
            this,
            arguments
        );
    },

    /*
     * Method: updateNodeGroup
     *
     * Implements:
     *      - <AbstractOutputEngine.updateNodeGroup>
     *
     * See also:
     *      - <updateEdgeGroup>
     */
    updateNodeGroup:
    function updateNodeGroup(groupName) {
        _private_.updateNodeGroupGeometry(this, groupName);
        _private_.updateNodeGroupMaterial(this, groupName);
        _private_.updateNodeGroupActor(this, groupName);
        return this;
    },

    updateEdgeGroup:
    /*
     * Method: updateEdgeGroup
     *
     * Implements:
     *      - <AbstractOutputEngine.updateEdgeGroup>
     *
     * See also:
     *      - <updateNodeGroup>
     */
    function updateEdgeGroup(groupName) {
        _private_.updateEdgeGroupGeometry(this, groupName);
        _private_.updateEdgeGroupMaterial(this, groupName);
        _private_.updateEdgeGroupActor(this, groupName);
        return this;
    }
});

module.exports = ThreeJSSceneNodeOutputEngine;


