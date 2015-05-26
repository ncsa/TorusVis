
/**
 * @file
 * @brief output engine implementation producing a threejs scene node
 *
 * @sa @ref torusvis_misc.features.threejs
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

/**
 * @class ThreeJSSceneNodeOutputEngine
 * @brief output engine producing a threejs scene node
 *
 * @extends GenericOutputEngine
 *
 * @sa @ref ThreeJSOutputEngine
 *
 * @ingroup torusvis_engines
 */

/**
 * @fn ThreeJSSceneNodeOutputEngine(     \
 *         AbstractGraph graph,          \
 *         AbstractTopologyMapper mapper \
 *     )
 *
 * @implements GenericOutputEngine
 *
 * @memberof ThreeJSSceneNodeOutputEngine
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

    /**
     * @fn ThreeJSSceneNodeOutputEngine clearNodeGroupCache(String groupName)
     *
     * @implements GenericOutputEngine
     *
     * @memberof ThreeJSSceneNodeOutputEngine
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

    /**
     * @fn ThreeJSSceneNodeOutputEngine clearEdgeGroupCache(String groupName)
     *
     * @implements GenericOutputEngine
     *
     * @memberof ThreeJSSceneNodeOutputEngine
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

    /**
     * @fn ThreeJSSceneNodeOutputEngine updateNodeGroup(String groupName)
     *
     * @implements GenericOutputEngine
     *
     * @memberof ThreeJSSceneNodeOutputEngine
     */
    updateNodeGroup:
    function updateNodeGroup(groupName) {
        _private_.updateNodeGroupGeometry(this, groupName);
        _private_.updateNodeGroupMaterial(this, groupName);
        _private_.updateNodeGroupActor(this, groupName);
        return this;
    },

    /**
     * @fn ThreeJSSceneNodeOutputEngine updateEdgeGroup(String groupName)
     *
     * @implements GenericOutputEngine
     *
     * @memberof ThreeJSSceneNodeOutputEngine
     */
    updateEdgeGroup:
    function updateEdgeGroup(groupName) {
        _private_.updateEdgeGroupGeometry(this, groupName);
        _private_.updateEdgeGroupMaterial(this, groupName);
        _private_.updateEdgeGroupActor(this, groupName);
        return this;
    }
});

module.exports = ThreeJSSceneNodeOutputEngine;


