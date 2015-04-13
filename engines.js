
/**
 * @defgroup torusvis_engines engines
 * @brief output engine specification and implementations
 * @ingroup torusvis
 */
module.exports = {
    AbstractOutputEngine         : require("./engines/AbstractOutputEngine"),
    GenericOutputEngine          : require("./engines/GenericOutputEngine" ),
    ThreeJSOutputEngine          : require("./engines/ThreeJSOutputEngine" ),
    ThreeJSSceneNodeOutputEngine :
        require("./engines/ThreeJSSceneNodeOutputEngine")
};

