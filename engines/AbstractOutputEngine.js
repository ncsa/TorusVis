
/**
 * @file
 * @brief abstract result generation API
 */

"use strict";

var utils = require("../misc/utils");

/**
 * @page GroupCache Group Cache
 * @brief cache objects for an @ref AbstractOutputEngine "output engine's"
 * @ref NodeGroup "NodeGroups" or @ref EdgeGroup "EdgeGroups"
 *
 * @details maps each group name of an
 * @ref AbstractOutputEngine "output engine's" @ref NodeGroup "NodeGroups" or
 * @ref EdgeGroup "EdgeGroups" to an object caching any intermediate objects or
 * values created during the post-processing proceedure for that group.  The
 * values stored in an entry as well as any semantics associated to them are
 * implementation-defined.  Entries in a @ref GroupCache "group cache" can be
 * modified or completely cleared with the expectation that they will be
 * processed or regenerated on the next update.
 *
 * @sa @ref AbstractOutputEngine.getNodeGroupCache
 * @sa @ref AbstractOutputEngine.getEdgeGroupCache
 * @sa @ref AbstractOutputEngine.update
 */

/**
 * @class AbstractOutputEngine
 * @brief abstract class for result-producing codes
 * @pure
 *
 * @details @ref AbstractOutputEngine "AbstractOutputEngines" maintain a
 * collection of @ref NodeGroup "NodeGroups" and @ref EdgeGroup "EdgeGroups"
 * while exposing a post-processing procedure that produces some data product
 * result, such as a graph or summary table.
 *
 * @ingroup torusvis_engines
 */

function AbstractOutputEngine() { utils._abstract_(); }

utils.extend(AbstractOutputEngine.prototype, {

    /**
     * @fn AbstractOutputEngine()
     * @pure
     *
     * @memberof AbstractOutputEngine
     */
    constructor: AbstractOutputEngine,

    /**
     * @fn NodeGroup getNodeGroup(String groupName)
     * @brief return the @ref NodeGroup mapped to the given name
     * @pure
     *
     * @param[in] groupName the group name to look up
     *
     * @return the @ref NodeGroup mapped to the given name
     *
     * @sa @ref setNodeGroup
     * @sa @ref removeNodeGroup
     * @sa @ref iterNodeGroups
     * @sa @ref getEdgeGroup
     *
     * @memberof AbstractOutputEngine
     */
    getNodeGroup: utils._abstract_,

    /**
     * @fn AbstractOutputEngine setNodeGroup(String groupName, NodeGroup group)
     * @brief map the given @ref NodeGroup to the given name
     * @pure
     *
     * @details maps the given @ref NodeGroup to the given name.  If a
     * @ref NodeGroup is already mapped to the given name, then it is replaced
     * with the given @ref NodeGroup.
     *
     * @param[in] groupName the given group name
     * @param[in] group the given group
     *
     * @return ```this```
     *
     * @sa @ref getNodeGroup
     * @sa @ref removeNodeGroup
     * @sa @ref setEdgeGroup
     *
     * @memberof AbstractOutputEngine
     */

    /**
     * @fn AbstractOutputEngine setNodeGroup(Object mapping)
     * @brief update the @ref NodeGroup mapping with the given mapping
     * @pure
     *
     * @details Equivalent to calling ```setNodeGroup(key, value)``` for each
     * ```key, value``` pair in ```mapping```.
     *
     * @param[in] mapping the mapping of names to groups
     *
     * @return ```this```
     *
     * @sa @ref getNodeGroup
     * @sa @ref removeNodeGroup
     * @sa @ref setEdgeGroup
     *
     * @memberof AbstractOutputEngine
     */
    setNodeGroup: utils._abstract_,

    /**
     * @fn AbstractOutputEngine removeNodeGroup(String groupName)
     * @brief remove the @ref NodeGroup mapped to the given name
     * @pure
     *
     * @details removes the @ref NodeGroup mapped to the given name from this
     * @ref AbstractOutputEngine.  Does nothing if there is no @ref NodeGroup
     * mapped to the given name.
     *
     * @param[in] groupName the given name
     *
     * @return ```this```
     *
     * @sa @ref getNodeGroup
     * @sa @ref setNodeGroup
     * @sa @ref removeEdgeGroup
     *
     * @memberof AbstractOutputEngine
     */
    removeNodeGroup: utils._abstract_,

    /**
     * @fn Object getNodeGroupCache(String groupName)
     * @brief return the cache entry object for the given @ref NodeGroup
     * @pure
     *
     * @param[in] groupName name of the given @ref NodeGroup
     *
     * @return the cache entry object for the given @ref NodeGroup
     *
     * @sa @ref getOldNodeGroupCache
     * @sa @ref getEdgeGroupCache
     * @sa @ref clearNodeGroupCache
     * @sa @ref iterNodeGroups
     * @sa @ref GroupCache
     *
     * @memberof AbstractOutputEngine
     */
    getNodeGroupCache: utils._abstract_,

    /**
     * @fn Object getOldNodeGroupCache(String groupName)
     * @brief return the old cache entry object for the given @ref NodeGroup
     * (for update procedures that require cached objects from the previous
     * update)
     * @pure
     *
     * @param[in] groupName name of the given @ref NodeGroup
     *
     * @return the old cache entry object for the given @ref NodeGroup
     *
     * @sa @ref getNodeGroupCache
     * @sa @ref getOldEdgeGroupCache
     * @sa @ref iterNodeGroups
     * @sa @ref GroupCache
     *
     * @memberof AbstractOutputEngine
     */
    getOldNodeGroupCache: utils._abstract_,

    /**
     * @fn AbstractOutputEngine clearNodeGroupCache(String groupName)
     * @brief clear the cache entry object for the given @ref NodeGroup.
     * @pure
     *
     * @details clears the cache entry object for the @ref NodeGroup associated
     * with the given group name.  Does nothing if there is no @ref NodeGroup
     * mapped to the given name.
     *
     * @param[in] groupName name of the given @ref NodeGroup
     *
     * @return ```this```
     *
     * @sa @ref getEdgeGroupCache
     * @sa @ref clearNodeGroupCache
     * @sa @ref iterNodeGroups
     * @sa @ref GroupCache
     *
     * @memberof AbstractOutputEngine
     */

    /**
     * @fn AbstractOutputEngine clearNodeGroupCache()
     * @brief clear the cache entry objects for all @ref NodeGroups.
     * @pure
     *
     * @return ```this```
     *
     * @sa @ref getEdgeGroupCache
     * @sa @ref clearNodeGroupCache
     * @sa @ref iterNodeGroups
     * @sa @ref GroupCache
     *
     * @memberof AbstractOutputEngine
     */
    clearNodeGroupCache: utils._abstract_,

    /**
     * @fn EdgeGroup getEdgeGroup(String groupName)
     * @brief return the @ref EdgeGroup mapped to the given name
     * @pure
     *
     * @param[in] groupName the group name to look up
     *
     * @return the @ref EdgeGroup mapped to the given name
     *
     * @sa @ref setEdgeGroup
     * @sa @ref removeEdgeGroup
     * @sa @ref iterEdgeGroups
     * @sa @ref getEdgeGroup
     *
     * @memberof AbstractOutputEngine
     */
    getEdgeGroup: utils._abstract_,

    /**
     * @fn AbstractOutputEngine setEdgeGroup(String groupName, EdgeGroup group)
     * @brief map the given EdgeGroup to the given name
     * @pure
     *
     * @details maps the given @ref EdgeGroup to the given name.  If an
     * @ref EdgeGroup is already mapped to the given name, then it is replaced
     * with the given @ref EdgeGroup.
     *
     * @param[in] groupName the given name
     * @param[in] group the given group
     *
     * @return ```this```
     *
     * @sa @ref getEdgeGroup
     * @sa @ref removeEdgeGroup
     * @sa @ref setNodeGroup
     *
     * @memberof AbstractOutputEngine
     */

    /**
     * @fn AbstractOutputEngine setEdgeGroup(Object mapping)
     * @brief maps multiple names to multiple @ref EdgeGroup "EdgeGroups".
     * @pure
     *
     * @details maps multiple names to multiple @ref EdgeGroup "EdgeGroups".
     * Equivalent to calling ```setNodeGroup(key, value)``` for each
     * ```key, value``` pair in ```mapping```.
     *
     * @param[in] mapping the mapping of names to groups
     *
     * @return ```this```
     *
     * @sa @ref getEdgeGroup
     * @sa @ref removeEdgeGroup
     * @sa @ref setNodeGroup
     *
     * @memberof AbstractOutputEngine
     */
    setEdgeGroup: utils._abstract_,

    /**
     * @fn AbstractOutputEngine removeEdgeGroup(String groupName)
     * @brief remove the @ref EdgeGroup mapped to the given name
     * @pure
     *
     * @details removes the @ref EdgeGroup mapped to the given name from this
     * @ref AbstractOutputEngine.  Does nothing if there is no @ref EdgeGroup
     * mapped to the given name.
     *
     * @param[in] groupName the given name
     *
     * @return ```this```
     *
     * @sa @ref getEdgeGroup
     * @sa @ref setEdgeGroup
     * @sa @ref removeNodeGroup
     *
     * @memberof AbstractOutputEngine
     */
    removeEdgeGroup: utils._abstract_,

    /**
     * @fn Object getEdgeGroupCache(String groupName)
     * @brief return the cache entry object for the given @ref EdgeGroup
     * @pure
     *
     * @param[in] groupName name of the given @ref EdgeGroup
     *
     * @return the cache entry object for the given @ref EdgeGroup
     *
     * @sa @ref getOldEdgeGroupCache
     * @sa @ref getNodeGroupCache
     * @sa @ref clearEdgeGroupCache
     * @sa @ref iterEdgeGroups
     * @sa @ref GroupCache
     *
     * @memberof AbstractOutputEngine
     */
    getEdgeGroupCache: utils._abstract_,

    /**
     * @fn Object getOldEdgeGroupCache(String groupName)
     * @brief return the old cache entry object for the given @ref EdgeGroup
     * (for update procedures that require cached objects from the previous
     * update)
     * @pure
     *
     * @param[in] groupName name of the given @ref EdgeGroup
     *
     * @return the old cache entry object for the given @ref EdgeGroup
     *
     * @sa @ref getEdgeGroupCache
     * @sa @ref getOldNodeGroupCache
     * @sa @ref iterEdgeGroups
     * @sa @ref GroupCache
     *
     * @memberof AbstractOutputEngine
     */
    getOldEdgeGroupCache: utils._abstract_,

    /**
     * @fn AbstractOutputEngine clearEdgeGroupCache(String groupName)
     * @brief clear the cache entry object for the given @ref EdgeGroup.
     * @pure
     *
     * @details clears the cache entry object for the @ref EdgeGroup associated
     * with the given group name.  Does nothing if there is no @ref EdgeGroup
     * mapped to the given name.
     *
     * @param[in] groupName name of the given @ref EdgeGroup
     *
     * @return ```this```
     *
     * @sa @ref getNodeGroupCache
     * @sa @ref clearEdgeGroupCache
     * @sa @ref iterEdgeGroups
     * @sa @ref GroupCache
     *
     * @memberof AbstractOutputEngine
     */

    /**
     * @fn AbstractOutputEngine clearEdgeGroupCache()
     * @brief clear the cache entry objects for all @ref EdgeGroups.
     * @pure
     *
     * @return ```this```
     *
     * @sa @ref getNodeGroupCache
     * @sa @ref clearEdgeGroupCache
     * @sa @ref iterEdgeGroups
     * @sa @ref GroupCache
     *
     * @memberof AbstractOutputEngine
     */
    clearEdgeGroupCache: utils._abstract_,

    /**
     * @fn AbstractOutputEngine updateNodeGroup(String groupName)
     * @brief update this output engine's internal representation based on the
     * @ref NodeGroup mapped to the given group name.
     * @pure
     *
     * @param[in] groupName the group name to look up
     *
     * @return ```this```
     *
     * @sa @ref updateEdgeGroup
     * @sa @ref updateNodeGroups
     *
     * @memberof AbstractOutputEngine
     */
    updateNodeGroup: utils._abstract_,

    /**
     * @fn AbstractOutputEngine updateNodeGroups()
     * @brief update this output engine's internal representation based on all
     * @ref NodeGroup "NodeGroups".
     *
     * @details updates this output engine's internal representation based on
     * all @ref NodeGroup "NodeGroups".  Equivalent to calling
     * ```updateNodeGroup(groupName)``` for each of this engine's
     * @ref NodeGroup "NodeGroups"
     *
     * @return ```this```
     *
     * @sa @ref updateEdgeGroups
     * @sa @ref updateNodeGroup
     *
     * @memberof AbstractOutputEngine
     */
    updateNodeGroups:
    function updateNodeGroups() {
        var self = this;
        this.iterNodeGroups(function(group, groupName) {
            self.updateNodeGroup(groupName);
        });

        return this;
    },

    /**
     * @fn AbstractOutputEngine updateEdgeGroup(String groupName)
     * @brief update this output engine's internal representation based on the
     * @ref EdgeGroup mapped to the given group name.
     * @pure
     *
     * @param[in] groupName the group name to look up
     *
     * @return ```this```
     *
     * @sa @ref updateNodeGroup
     * @sa @ref updateEdgeGroups
     *
     * @memberof AbstractOutputEngine
     */
    updateEdgeGroup: utils._abstract_,

    /**
     * @fn AbstractOutputEngine updateEdgeGroups()
     * @brief update this output engine's internal representation based on all
     * @ref EdgeGroup "EdgeGroups".
     *
     * @details updates this output engine's internal representation based on
     * all @ref EdgeGroup "EdgeGroups".  Equivalent to calling
     * ```updateEdgeGroup(groupName)``` for each of this engine's
     * @ref EdgeGroup "EdgrGroups"
     *
     * @return ```this```
     *
     * @sa @ref updateNodeGroups
     * @sa @ref updateEdgeGroup
     *
     * @memberof AbstractOutputEngine
     */
    updateEdgeGroups:
    function updateEdgeGroups() {
        var self = this;
        this.iterEdgeGroups(function(group, groupName) {
            self.updateEdgeGroup(groupName);
        });

        return this;
    },

    /**
     * @fn AbstractOutputEngine update()
     * @brief update this output engine's internal representation based on all
     * group changes
     * @pure
     *
     * @details updates this output engine's internal representation based on
     * all group changes.  Equivalent to calling ```updateNodeGroups()``` and
     * ```updateEdgeGroups()```.
     *
     * @return ```this```
     *
     * @sa @ref updateNodeGroups
     * @sa @ref updateEdgeGroups
     *
     * @memberof AbstractOutputEngine
     */
    update:
    function update() {
        this.updateNodeGroups();
        this.updateEdgeGroups();
        return this;
    },

    /**
     * @fn void iterNodeGroups(Function callback)
     * @brief iterate over this
     * @ref AbstractOutputEngine "AbstractOutputEngine's"
     * @ref NodeGroup "NodeGroups"
     * @pure
     *
     * @details iterates over this
     * @ref AbstractOutputEngine "AbstractOutputEngine's"
     * @ref NodeGroup "NodeGroups".  ```callback``` must conform to the
     * following signature:
     * @code{.cpp}
     *     Boolean callback(NodeGroup, String, AbstractOutputEngine)
     * @endcode
     * For each @ref NodeGroup in this @ref AbstractOutputEngine, ```callback```
     * is called with the @ref NodeGroup, the group's name, and ```this```,
     * respectively.  If callback returns ```true```, then the iteration ends
     * early.
     *
     * @param[in] callback callback to call for each @ref NodeGroup
     *
     * @sa @ref iterEdgeGroups
     *
     * @memberof AbstractOutputEngine
     */
    iterNodeGroups: utils._abstract_,

    /**
     * @fn void iterEdgeGroups(Function callback)
     * @brief iterate over this
     * @ref AbstractOutputEngine "AbstractOutputEngine's"
     * @ref EdgeGroup "EdgeGroups"
     * @pure
     *
     * @details iterates over this
     * @ref AbstractOutputEngine "AbstractOutputEngine's"
     * @ref EdgeGroup "EdgeGroups".  ```callback``` must conform to the
     * following signature:
     *     ```Boolean callback(EdgeGroup, String, AbstractOutputEngine)```
     * For each @ref EdgeGroup in this @ref AbstractOutputEngine, callback is
     * called with the @ref EdgeGroup, the group's name, and ```this```,
     * respectively.  If callback returns ```true```, then the iteration ends
     * early.
     *
     * @param[in] callback callback to call for each @ref EdgeGroup
     *
     * @sa @ref iterNodeGroups
     *
     * @memberof AbstractOutputEngine
     */
    iterEdgeGroups: utils._abstract_,

    /**
     * @fn Object getOutput()
     * @brief return the object generated by this output engine
     * @pure
     *
     * @details returns the object generated by this output engine.  The
     * returned value should be an object passed by reference.  Changes to the
     * output resulting from subsequent @ref update "updates" should be
     * immediately visible to all other sections of code holding a reference to
     * it.
     *
     * @return the object generated by this output engine
     *
     * @sa @ref update
     *
     * @memberof AbstractOutputEngine
     */
    getOutput: utils._abstract_
});

module.exports = AbstractOutputEngine;

