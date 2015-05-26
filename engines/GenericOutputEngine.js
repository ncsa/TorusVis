
/**
 * @file
 * @brief generic output engine implementation including common method
 *        implementations
 */

"use strict";

var utils = require("../misc/utils");
var AbstractOutputEngine = require("./AbstractOutputEngine");

function _ensureCaches_(self) {
    if(!Boolean(self.cache)) { self.cache = {}; }
    var cache = self.cache;

    if(!Boolean(cache.nodeGroups)) { cache.nodeGroups = {}; }
    if(!Boolean(cache.edgeGroups)) { cache.edgeGroups = {}; }

    return cache;
}

function _ensureNodeCache_(self, groupName) {
    var ngCache = _ensureCaches_(self).nodeGroups;
    if(!Boolean(ngCache[groupName])) { ngCache[groupName] = {}; }

    return ngCache[groupName];
}

function _ensureEdgeCache_(self, groupName) {
    var egCache = _ensureCaches_(self).edgeGroups;
    if(!Boolean(egCache[groupName])) { egCache[groupName] = {}; }

    return egCache[groupName];
}

function _ensureOldCaches_(self) {
    if(!Boolean(self.oldCache)) { self.oldCache = {}; }
    var oldCache = self.oldCache;

    if(!Boolean(oldCache.nodeGroups)) { oldCache.nodeGroups = {}; }
    if(!Boolean(oldCache.edgeGroups)) { oldCache.edgeGroups = {}; }

    return oldCache;
}

function _ensureOldNodeCache_(self, groupName) {
    var ongCache = _ensureOldCaches_(self).nodeGroups;
    if(!Boolean(ongCache[groupName])) { ongCache[groupName] = {}; }

    return ongCache[groupName];
}

function _ensureOldEdgeCache_(self, groupName) {
    var oegCache = _ensureOldCaches_(self).edgeGroups;
    if(!Boolean(oegCache[groupName])) { oegCache[groupName] = {}; }

    return oegCache[groupName];
}

function _pageCaches_(self) {
    var oCache = _ensureOldCaches_(self);
    delete oCache.nodeGroups;
    delete oCache.edgeGroups;

    utils.extend(true, oCache, _ensureCaches_(self));
}

/**
 * @class GenericOutputEngine
 * @brief generic output engine implementing common methods
 *
 * @extends AbstractOutputEngine
 *
 * @ingroup torusvis_engines
 */

/**
 * @fn GenericOutputEngine(              \
 *         AbstractGraph graph,          \
 *         AbstractTopologyMapper mapper \
 *     )
 * @brief construct a new @ref GenericOutputEngine
 *
 * @param[in] graph the graph to produce output for
 * @param[in] mapper the topology mapper used to map the given graph
 *
 * @memberof GenericOutputEngine
 */
function GenericOutputEngine(graph, mapper) {
    this.graph = graph;
    this.mapper = mapper;
    this.nodeGroups = {};
    this.edgeGroups = {};

    this.nodeGroupIterGuard = new utils.IterationGuard();
    this.edgeGroupIterGuard = new utils.IterationGuard();

    this.nodeGroupIterGuard.setException(
        new Error("cannot modify node groups while iterating over them")
    );

    this.edgeGroupIterGuard.setException(
        new Error("cannot modify edge groups while iterating over them")
    );

    this.output = {};
    this.oldOutput = {};
}

utils.extend(GenericOutputEngine.prototype, AbstractOutputEngine.prototype);
utils.extend(GenericOutputEngine.prototype, {
    constructor: GenericOutputEngine,

    /**
     * @fn NodeGroup getNodeGroup(String groupName)
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    getNodeGroup:
    function getNodeGroup(groupName) {
        return this.nodeGroups[groupName];
    },

    /**
     * @fn GenericOutputEngine setNodeGroup(String groupName, NodeGroup group)
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    setNodeGroup:
    function setNodeGroup(groupName, group) {
        if(arguments.length < 2) {
            var groups = groupName;
            if(!Boolean(groups)) { return this; }

            var self = this;
            utils.iter(groups, function(group, groupName) {
                self.setNodeGroup(groupName, group);
            });

            return this;
        }

        this.nodeGroupIterGuard.check();
        if(groupName in this.nodeGroups) {
            this.removeNodeGroup(groupName);
        }

        this.nodeGroups[groupName] = group;

        return this;
    },

    /**
     * @fn: GenericOutputEngine removeNodeGroup(String groupName)
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    removeNodeGroup:
    function removeNodeGroup(groupName) {
        this.nodeGroupIterGuard.check();
        delete this.nodeGroups[groupName];
        this.clearNodeGroupCache(groupName);
        return this;
    },

    /**
     * @fn EdgeGroup getEdgeGroup(String groupName)
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    getEdgeGroup:
    function getEdgeGroup(groupName) {
        return this.edgeGroups[groupName];
    },

    /**
     * @fn GenericOutputEngine setEdgeGroup(String groupName, EdgeGroup group)
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    setEdgeGroup:
    function setEdgeGroup(groupName, group) {
        if(arguments.length < 2) {
            var groups = groupName;
            if(!Boolean(groups)) { return this; }

            var self = this;
            utils.iter(groups, function(group, groupName) {
                self.setEdgeGroup(groupName, group);
            });

            return this;
        }

        this.edgeGroupIterGuard.check();
        if(groupName in this.nodeGroups) {
            this.removeEdgeGroup(groupName);
        }

        this.edgeGroups[groupName] = group;

        return this;
    },

    /**
     * @fn GenericOutputEngine removeEdgeGroup(String groupName)
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    removeEdgeGroup:
    function removeEdgeGroup(groupName) {
        this.edgeGroupIterGuard.check();
        delete this.edgeGroups[groupName];
        this.clearEdgeGroupCache(groupName);
        return this;
    },

    /**
     * @fn GenericOutputEngine update()
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    update:
    function update() {
        _pageCaches_(this);
        AbstractOutputEngine.prototype.update.apply(this, arguments);
        return this;
    },

    /**
     * @fn Object getOutput()
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    getOutput:
    function getOutput() {
        return this.output;
    },

    /**
     * @fn Object getNodeGroupCache(String groupName)
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    getNodeGroupCache:
    function getNodeGroupCache(groupName) {
        return _ensureNodeCache_(this, groupName);
    },

    /**
     * @fn Object getOldNodeGroupCache(String groupName)
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    getOldNodeGroupCache:
    function getOldNodeGroupCache(groupName) {
        return _ensureOldNodeCache_(this, groupName);
    },

    /**
     * @fn GenericOutputEngine clearNodeGroupCache(String groupName)
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    clearNodeGroupCache:
    function clearNodeGroupCache(groupName) {
        var cache = _ensureCaches_(this).nodeGroups;
        var oCache = _ensureOldCaches_(this).nodeGroups;
        if(arguments.length > 0) {
            delete cache[groupName];
            delete oCache[groupName];
        } else {
            var self = this;
            utils.iter(cache, function(group, groupName) {
                self.clearNodeGroupCache(groupName);
            });
        }

        return this;
    },

    /**
     * @fn Object getEdgeGroupCache(String groupName)
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    getEdgeGroupCache:
    function getEdgeGroupCache(groupName) {
        return _ensureEdgeCache_(this, groupName);
    },

    /**
     * @fn Object getOldEdgeGroupCache(String groupName)
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    getOldEdgeGroupCache:
    function getOldEdgeGroupCache(groupName) {
        return _ensureOldEdgeCache_(this, groupName);
    },

    /**
     * @fn GenericOutputEngine clearEdgeGroupCache(String groupName)
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    clearEdgeGroupCache:
    function clearEdgeGroupCache(groupName) {
        var cache = _ensureCaches_(this).edgeGroups;
        var oCache = _ensureOldCaches_(this).edgeGroups;
        if(arguments.length > 0) {
            delete cache[groupName];
            delete oCache[groupName];
        } else {
            var self = this;
            utils.iter(cache, function(group, groupName) {
                self.clearEdgeGroupCache(groupName);
            });
        }

        return this;
    },

    /**
     * @fn void iterNodeGroups(Function callback)
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    iterNodeGroups:
    function iterNodeGroups(callback) {
        var self = this;
        this.nodeGroupIterGuard.run(function() {
            Object.keys(self.nodeGroups).some(function(key) {
                return callback(self.nodeGroups[key], null, self);
            });
        });
    },

    /**
     * @fn void iterEdgeGroups(Function callback)
     * @implements AbstractOutputEngine
     *
     * @memberof GenericOutputEngine
     */
    iterEdgeGroups:
    function iterEdgeGroups(callback) {
        var self = this;
        this.edgeGroupIterGuard.run(function() {
            Object.keys(self.edgeGroups).some(function(key) {
                return callback(self.edgeGroups[key], null, self);
            });
        });
    }

});

module.exports = GenericOutputEngine;

