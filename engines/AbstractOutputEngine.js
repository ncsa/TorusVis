
/*
 * File: AbstractOutputEngine
 *
 * abstract result generation API
 */

"use strict";

var utils = require("../misc/utils");

/*
 * Class: AbstractOutputEngine
 *
 * (*ABSTRACT*) abstract class for result-producing codes
 *
 * <AbstractOutputEngines> maintain a collection of <NodeGroups> and
 * <EdgeGroups> while exposing a post-processing procedure that produces some
 * data product result, such as a graph or summary table.
 */

/*
 * Type: GroupCache
 *
 * cache objects for an output engine's <NodeGroups> or <EdgeGroups>
 *
 * maps each group name of an output engine's <NodeGroups> or <EdgeGroups> to an
 * object caching any intermediate objects or values created during the
 * post-processing proceedure for that group.  The values stored in an entry as
 * well as any semantics associated to them are implementation defined.  Entries
 * in a <GroupCache> can be modified or completely cleared with the expectation
 * that they will be processed or regenerated on the next update.
 *
 * See also:
 *      - <getNodeGroupCache>
 *      - <getEdgeGroupCache>
 *      - <update>
 */

function AbstractOutputEngine() { utils._abstract_(); }

utils.extend(AbstractOutputEngine.prototype, {
    constructor: AbstractOutputEngine,

    /*
     * Method: getNodeGroup
     *
     * (*ABSTRACT*) return the <NodeGroup> mapped to the given name
     *
     * Parameters:
     *     groupName - (*String*) the group name to look up
     *
     * Returns:
     *      - (*<NodeGroup>*) the <NodeGroup> mapped to the given name
     *
     * See also:
     *      - <setNodeGroup>
     *      - <removeNodeGroup>
     *      - <iterNodeGroups>
     *      - <getEdgeGroup>
     */
    getNodeGroup: utils._abstract_,

    /*
     * Method: setNodeGroup
     *
     * (*ABSTRACT*) map the given <NodeGroup> to the given name
     *
     * maps the given <NodeGroup> to the given name.  If a <NodeGroup> is
     * already mapped to the given name, then it is replaced with the given
     * <NodeGroup>.
     *
     * if a single object is supplied, then each key-value pair given will be
     * set as in setNodeGroup(key, value)
     *
     * Parameters:
     *     groupName - (*String*) the given name
     *     [group] - (*<NodeGroup>*) the given group
     *
     * Returns:
     *      - (*<AbstractOutputEngine>*) *this*
     *
     * See also:
     *      - <getNodeGroup>
     *      - <removeNodeGroup>
     *      - <setEdgeGroup>
     */
    setNodeGroup: utils._abstract_,

    /*
     * Method: removeNodeGroup
     *
     * (*ABSTRACT*) remove the <NodeGroup> mapped to the given name
     *
     * removes the <NodeGroup> mapped to the given name from this
     * <AbstractOutputEngine>.  Does nothing if there is no <NodeGroup> mapped
     * to the given name.
     *
     * Parameters:
     *     groupName - (*String*) the given name
     *
     * Returns:
     *      - (*<AbstractOutputEngine>*) *this*
     *
     * See also:
     *      - <getNodeGroup>
     *      - <setNodeGroup>
     *      - <removeEdgeGroup>
     */
    removeNodeGroup: utils._abstract_,

    /*
     * Method: getNodeGroupCache
     *
     * return the cache entry object for the given <NodeGroup>
     *
     * Parameters:
     *     groupName - (*String*) name of the given <NodeGroup>
     *
     * Returns:
     *      - (*Object*) the cache entry object for the given <NodeGroup>
     *
     * See also:
     *      - <getOldNodeGroupCache>
     *      - <getEdgeGroupCache>
     *      - <clearNodeGroupCache>
     *      - <iterNodeGroups>
     */
    getNodeGroupCache: utils._abstract_,

    /*
     * Method: getOldNodeGroupCache
     *
     * return the old cache entry object for the given <NodeGroup> (for update
     * procedures that require cached objects from the previous update)
     *
     * Parameters:
     *     groupName - (*String*) name of the given <NodeGroup>
     *
     * Returns:
     *      - (*Object*) the old cache entry object for the given <NodeGroup>
     *
     * See also:
     *      - <getNodeGroupCache>
     *      - <getOldEdgeGroupCache>
     *      - <iterNodeGroups>
     */
    getOldNodeGroupCache: utils._abstract_,

    /*
     * Method: clearNodeGroupCache
     *
     * clear the cache entry object for the given <NodeGroup>. If groupName is
     * not provided, clear the cache entry objects for all <NodeGroups>.
     *
     * Parameters:
     *     groupName - (*String*) name of the given <NodeGroup>
     *
     * Returns:
     *      - (*<AbstractOutputEngine>*) *this*
     *
     * See also:
     *      - <getEdgeGroupCache>
     *      - <clearNodeGroupCache>
     *      - <iterNodeGroups>
     */
    clearNodeGroupCache: utils._abstract_,

    /*
     * Method: getEdgeGroup
     *
     * (*ABSTRACT*) return the <EdgeGroup> mapped to the given name
     *
     * Parameters:
     *     groupName - (*String*) the group name to look up
     *
     * Returns:
     *      - (*<EdgeGroup>*) the <EdgeGroup> mapped to the given name
     *
     * See also:
     *      - <setEdgeGroup>
     *      - <removeEdgeGroup>
     *      - <iterEdgeGroups>
     *      - <getEdgeGroup>
     */
    getEdgeGroup: utils._abstract_,

    /*
     * Method: setEdgeGroup
     *
     * (*ABSTRACT*) map the given <EdgeGroup> to the given name
     *
     * maps the given <EdgeGroup> to the given name.  If an <EdgeGroup> is
     * already mapped to the given name, then it is replaced with the given
     * <EdgeGroup>.
     *
     * if a single object is supplied, then each key-value pair given will be
     * set as in setEdgeGroup(key, value)
     *
     * Parameters:
     *     groupName - (*String*) the given name
     *     [group] - (*<EdgeGroup>*) the given group
     *
     * Returns:
     *      - (*<AbstractOutputEngine>*) *this*
     *
     * See also:
     *      - <getEdgeGroup>
     *      - <removeEdgeGroup>
     *      - <setNodeGroup>
     */
    setEdgeGroup: utils._abstract_,

    /*
     * Method: removeEdgeGroup
     *
     * (*ABSTRACT*) remove the <EdgeGroup> mapped to the given name
     *
     * removes the <EdgeGroup> mapped to the given name from this
     * <AbstractOutputEngine>.  Does nothing if there is no <EdgeGroup> mapped
     * to the given name.
     *
     * Parameters:
     *     groupName - (*String*) the given name
     *
     * Returns:
     *      - (*<AbstractOutputEngine>*) *this*
     *
     * See also:
     *      - <getEdgeGroup>
     *      - <setEdgeGroup>
     *      - <removeNodeGroup>
     */
    removeEdgeGroup: utils._abstract_,

    /*
     * Method: getEdgeGroupCache
     *
     * return the cache entry object for the given <EdgeGroup>
     *
     * Parameters:
     *     groupName - (*String*) name of the given <EdgeGroup>
     *
     * Returns:
     *      - (*Object*) the cache entry object for the given <EdgeGroup>
     *
     * See also:
     *      - <getOldEdgeGroupCache>
     *      - <getNodeGroupCache>
     *      - <clearEdgeGroupCache>
     *      - <iterEdgeGroups>
     */
    getEdgeGroupCache: utils._abstract_,

    /*
     * Method: getOldEdgeGroupCache
     *
     * return the old cache entry object for the given <EdgeGroup> (for update
     * procedures that require cached objects from the previous update)
     *
     * Parameters:
     *     groupName - (*String*) name of the given <EdgeGroup>
     *
     * Returns:
     *      - (*Object*) the old cache entry object for the given <EdgeGroup>
     *
     * See also:
     *      - <getEdgeGroupCache>
     *      - <getOldNodeGroupCache>
     *      - <iterEdgeGroups>
     */
    getOldEdgeGroupCache: utils._abstract_,

    /*
     * Method: clearEdgeGroupCache
     *
     * clear the cache entry object for the given <EdgeGroup>. If groupName is
     * not provided, clear the cache entry objects for all <EdgeGroups>.
     *
     * Parameters:
     *     groupName - (*String*) name of the given <EdgeGroup>
     *
     * Returns:
     *      - (*<AbstractOutputEngine>*) *this*
     *
     * See also:
     *      - <getNodeGroupCache>
     *      - <clearEdgeGroupCache>
     *      - <iterEdgeGroups>
     */
    clearEdgeGroupCache: utils._abstract_,

    /*
     * Method: updateNodeGroup
     *
     * (*ABSTRACT*) update this output engine's internal representation based on
     * a <NodeGroup>
     *
     * updates this output engine's internal representation based on
     * any changes made in the <NodeGroup> mapped to the given group name
     *
     * Parameters:
     *     groupName - (*String*) the group name to look up
     *
     * Returns:
     *      - (*<AbstractOutputEngine>*) *this*
     *
     * See also:
     *      - <updateEdgeGroup>
     *      - <updateNodeGroups>
     */
    updateNodeGroup: utils._abstract_,

    /*
     * Method: updateNodeGroups
     *
     * update this output engine's internal representation based on all
     * <NodeGroups>
     *
     * calls <updateNodeGroup> for each of this engine's <NodeGroups>
     *
     * Returns:
     *      - (*<AbstractOutputEngine>*) *this*
     *
     * See also:
     *      - <updateEdgeGroups>
     *      - <updateNodeGroup>
     */
    updateNodeGroups:
    function updateNodeGroups() {
        var self = this;
        this.iterNodeGroups(function(group, groupName) {
            self.updateNodeGroup(groupName);
        });

        return this;
    },

    /*
     * Method: updateEdgeGroup
     *
     * (*ABSTRACT*) update this output engine's internal representation based on
     * an <EdgeGroup>
     *
     * updates this output engine's internal representation based on
     * any changes made in the <EdgeGroup> mapped to the given group name
     *
     * Parameters:
     *     groupName - (*String*) the group name to look up
     *
     * Returns:
     *      - (*<AbstractOutputEngine>*) *this*
     *
     * See also:
     *      - <updateNodeGroup>
     *      - <updateEdgeGroups>
     */
    updateEdgeGroup: utils._abstract_,

    /*
     * Method: updateEdgeGroups
     *
     * update this output engine's internal representation based on all
     * <EdgeGroups>
     *
     * calls <updateEdgeGroup> for each of this engine's <EdgeGroups>
     *
     * Returns:
     *      - (*<AbstractOutputEngine>*) *this*
     *
     * See also:
     *      - <updateNodeGroups>
     *      - <updateEdgeGroup>
     */
    updateEdgeGroups:
    function updateEdgeGroups() {
        var self = this;
        this.iterEdgeGroups(function(group, groupName) {
            self.updateEdgeGroup(groupName);
        });

        return this;
    },

    /*
     * Method: update
     *
     * update this output engine's internal representation based on all group
     * changes
     *
     * calls <updateNodeGroups> and <updateEdgeGroups>
     *
     * Returns:
     *      - (*<AbstractOutputEngine>*) *this*
     *
     * See also:
     *      - <updateNodeGroups>
     *      - <updateEdgeGroups>
     */
    update:
    function update() {
        this.updateNodeGroups();
        this.updateEdgeGroups();
        return this;
    },

    /*
     * Method: iterNodeGroups
     *
     * (*ABSTRACT*) iterate over this <AbstractOutputEngine's> <NodeGroups>
     *
     * Parameters:
     *     callback - (*Function*) callback to call for each node group's name
     *
     * See also:
     *      - <iterEdgeGroups>
     */
    iterNodeGroups: utils._abstract_,

    /*
     * Method: iterEdgeGroups
     *
     * (*ABSTRACT*) iterate over this <AbstractOutputEngine's> <EdgeGroups>
     *
     * Parameters:
     *     callback - (*Function*) callback to call for each edge group's name
     *
     * See also:
     *      - <iterNodeGroups>
     */
    iterEdgeGroups: utils._abstract_,

    /*
     * Method: getOutput
     *
     * (*ABSTRACT*) return the object generated by this output engine
     *
     * returns the object generated by this output engine.  The returned value
     * should be an object passed by reference.  Changes to the output resulting
     * from subsequent <updates> should be immediately visible to all other
     * sections of code holding a reference to it.
     *
     * Returns:
     *      - (*Object*) the object generated by this output engine
     *
     * See also:
     *      - <update>
     */
    getOutput: utils._abstract_
});

module.exports = AbstractOutputEngine;

