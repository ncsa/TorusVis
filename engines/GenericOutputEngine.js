
/*
 * File: GenericOutputEngine
 *
 * generic output engine implementation including common method implementations
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

/*
 * Class: GenericOutputEngine
 *
 * generic output engine implementing common methods
 *
 * Extends:
 *      - <AbstractOutputEngine>
 */

/*
 * Constructor: constructor
 *
 * construct a new <GenericOutputEngine>
 *
 * constructs a new <GenericOutputEngine>.  If <NodeGroups> or <EdgeGroups> are
 * provided, the constructed output engine is prepopulated with the node and
 * edge groups contained within them.
 *
 * Parameters:
 *     graph - the graph to produce output for
 *     mapper - the topology mapper used to map the given graph
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

    getNodeGroup:
    /*
     * Method: getNodeGroup
     *
     * Implements:
     *      - <AbstractOutputEngine.getNodeGroup>
     */
    function getNodeGroup(groupName) {
        return this.nodeGroups[groupName];
    },

    setNodeGroup:
    /*
     * Method: setNodeGroup
     *
     * Implements:
     *      - <AbstractOutputEngine.setNodeGroup>
     */
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

    /*
     * Method: removeNodeGroup
     *
     * Implements:
     *      - <AbstractOutputEngine.removeNodeGroup>
     */
    removeNodeGroup:
    function removeNodeGroup(groupName) {
        this.nodeGroupIterGuard.check();
        delete this.nodeGroups[groupName];
        this.clearNodeGroupCache(groupName);
        return this;
    },

    getEdgeGroup:
    /*
     * Method: getEdgeGroup
     *
     * Implements:
     *      - <AbstractOutputEngine.getEdgeGroup>
     */
    function getEdgeGroup(groupName) {
        return this.edgeGroups[groupName];
    },

    setEdgeGroup:
    /*
     * Method: setEdgeGroup
     *
     * Implements:
     *      - <AbstractOutputEngine.setEdgeGroup>
     */
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

    /*
     * Method: removeEdgeGroup
     *
     * Implements:
     *      - <AbstractOutputEngine.removeEdgeGroup>
     */
    removeEdgeGroup:
    function removeEdgeGroup(groupName) {
        this.edgeGroupIterGuard.check();
        delete this.edgeGroups[groupName];
        this.clearEdgeGroupCache(groupName);
        return this;
    },

    update:
    /*
     * Method: update
     *
     * Extends:
     *      - <AbstractOutputEngine.update>
     */
    function update() {
        _pageCaches_(this);
        AbstractOutputEngine.prototype.update.apply(this, arguments);
        return this;
    },

    getOutput:
    /*
     * Method: getOutput
     *
     * Implements:
     *      - <AbstractOutputEngine.getOutput>
     */
    function getOutput() {
        return this.output;
    },

    /*
     * Method: getNodeGroupCache
     *
     * Implements:
     *      - <AbstractOutputEngine.getNodeGroupCache>
     */
    getNodeGroupCache:
    function getNodeGroupCache(groupName) {
        return _ensureNodeCache_(this, groupName);
    },

    /*
     * Method: getOldNodeGroupCache
     *
     * Implements:
     *      - <AbstractOutputEngine.getOldNodeGroupCache>
     */
    getOldNodeGroupCache:
    function getOldNodeGroupCache(groupName) {
        return _ensureOldNodeCache_(this, groupName);
    },

    /*
     * Method: clearNodeGroupCache
     *
     * Implements:
     *      - <AbstractOutputEngine.clearNodeGroupCache>
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

    /*
     * Method: getEdgeGroupCache
     *
     * Implements:
     *
     *      - <AbstractOutputEngine.getEdgeGroupCache>
     */
    getEdgeGroupCache:
    function getEdgeGroupCache(groupName) {
        return _ensureEdgeCache_(this, groupName);
    },

    /*
     * Method: getOldEdgeGroupCache
     *
     * Implements:
     *      - <AbstractOutputEngine.getOldEdgeGroupCache>
     */
    getOldEdgeGroupCache:
    function getOldEdgeGroupCache(groupName) {
        return _ensureOldEdgeCache_(this, groupName);
    },

    /*
     * Method: clearEdgeGroupCache
     *
     * Implements:
     *      - <AbstractOutputEngine.clearEdgeGroupCache>
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

    iterNodeGroups:
    /*
     * Method: iterNodeGroups
     *
     * Extends:
     *      - <AbstractOutputEngine.iterNodeGroups>
     *
     * See also:
     *      - <iterEdgeGroups>
     */
    function iterNodeGroups(callback) {
        var self = this;
        this.nodeGroupIterGuard.run(function() {
            Object.keys(self.nodeGroups).some(function(key) {
                return callback(self.nodeGroups[key], key);
            });
        });
    },

    iterEdgeGroups:
    /*
     * Method: iterEdgeGroups
     *
     * Extends:
     *      - <AbstractOutputEngine.iterEdgeGroups>
     *
     * See also:
     *      - <iterNodeGroups>
     */
    function iterEdgeGroups(callback) {
        var self = this;
        this.edgeGroupIterGuard.run(function() {
            Object.keys(self.edgeGroups).some(function(key) {
                return callback(self.edgeGroups[key], key);
            });
        });
    }

});

module.exports = GenericOutputEngine;

