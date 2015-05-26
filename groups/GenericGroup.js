
/** @file */

"use strict";

var utils = require("../misc/utils");

/**
 * @class GenericGroup
 * @brief common base class for node and edge groups
 *
 * @details A @ref GenericGroup is a set of handles indexed by their handle ID
 * numbers.  @ref GenericGroup "GenericGroups" form the base class for @ref
 * NodeGroup "NodeGroups" and @ref EdgeGroup "EdgeGroups", where each instance
 * is bundled with display information.
 *
 * @private
 *
 * @sa @ref NodeGroup
 * @sa @ref EdgeGroup
 * @sa @ref handles
 *
 * @ingroup torusvis_groups
 */

/**
 * @page CommonDisplayOptions Common Display Options
 *
 * @code{.cpp}
 * Object options;
 * @endcode
 *
 * @brief common display options for groups
 *
 * @details common display options for groups.  These options are only those
 * more commonly recognized by various implementations of
 * @ref AbstractOutputEngine.
 *
 * @param options.size       (```Number```) size of the elements used (e.g.
 *                           radius of spheres, height of sprites, thickness of
 *                           lines)
 *
 * @param options.opacity    (```Number```) value between 0.0 (fully
 *                           transparent) and 1.0 (fully opaque)
 *
 * @param options.color      (```Number```) color in hex of the elements used
 *                           (ignored if colorBy and colorMap are set)
 *
 * @param options.colorBy    (```String```) attribute name from nodes' or edges'
 *                           data objects by which the elements used should be
 *                           colored
 *
 * @param options.colorMap   (@ref ColorMap) color mapping from fetched colorBy
 *                           values to colors
 *
 * @param options.map        (```Object```) texture map to use
 *
 * @note the options documented in this entry are not meant to be exhaustive.
 * Recognized display options are defined by the @ref AbstractOutputEngine
 * implementation used.  For more display options, see the documentation for
 * your chosen implementation.
 *
 * @sa [THREE.ImageUtils.loadTexture](                                     \
 *     http://threejs.org/docs/#Reference/Extras/ImageUtils.loadTexture>)
 */


/**
 * @fn GenericGroup(Array<handle> handleList = [], Object options = {})
 * @brief constructs a new @ref GenericGroup
 *
 * @param[in] handleList initial list of handles to populate this
 *                       @ref GenericGroup with
 *
 * @param[in] options    set of options
 *
 * @sa @ref CommonDisplayOptions
 *
 * @memberof GenericGroup
 */
function GenericGroup(handleList, options) {
    handleList = handleList || [];
    options = options || {};
    this.handleIdSet = {};
    this.iterGuard = new utils.IterationGuard();
    this.iterGuard.setException(
        new Error("cannot add or remove items while iterating over them")
    );

    var self = this;
    utils.iter(handleList, function(handle) {
        self.addItem(handle);
    });

    utils.extend(true, this, options);
}


utils.extend(GenericGroup.prototype, {
    constructor: GenericGroup,

    /**
     * @fn Boolean hasItem(Object handle)
     * @brief determine if this @ref GenericGroup has the given item
     *
     * @param[in] handle handle to the given item
     *
     * @return whether this @ref GenericGroup has the given item
     *
     * @sa @ref addItem
     * @sa @ref removeItem
     *
     * @memberof GenericGroup
     */
    hasItem:
    function hasItem(handle) {
        return (this.handleIdSet[handle] === handle);
    },

    /**
     * @fn GenericGroup addItem(Object handle)
     * @brief add a new item to this @ref GenericGroup
     *
     * @param[in] handle handle to the new item
     *
     * @return ```this```
     *
     * @throw Error if called while iterating
     *
     * @sa @ref removeItem
     * @sa @ref iterItems
     *
     * @memberof GenericGroup
     */
    addItem:
    function addItem(handle) {
        this.iterGuard.check();
        if(!this.hasItem(handle)) {
            this.handleIdSet[handle] = handle;
        }

        return this;
    },

    /**
     * @fn void iterItems(Function callback)
     * @brief iterate over each item in this @ref GenericGroup
     *
     * @details iterates over each item in this @ref GenericGroup.
     * ```callback``` must conform to the following signature:
     * @code{.cpp}
     *     Boolean callback(Object, String, GenericGroup)
     * @endcode
     * For each handle in this @ref GenericGroup, ```callback``` is called with
     * the handle, ```null```, and ```this```, respectively.  If ```callback```
     * returns ```true```, then the iteration ends early.
     *
     * @param[in] callback callback function to call for each item
     *
     * @throw Error if the iterating code attempts to add or remove items from
     *              this @ref GenericGroup
     *
     * @sa @ref addItem
     * @sa @ref removeItem
     *
     * @memberof GenericGroup
     */
    iterItems:
    function iterItems(callback) {
        var self = this;
        this.iterGuard.run(function() {
            Object.keys(self.handleIdSet).some(function(key) {
                var handle = self.handleIdSet[key];
                return callback(handle, null, self);
            });
        });
    },

    /**
     * @fn GenericGroup removeItem(Object handle)
     * @brief remove the given item from this @ref GenericGroup
     *
     * @param[in] handle handle to the given item
     *
     * @return ```this```
     *
     * @throw Error if called while iterating
     * @throw Error if ```handle``` not in this @ref GenericGroup
     *
     * @sa @ref addItem
     * @sa @ref iterItems
     *
     * @memberof GenericGroup
     */
    removeItem:
    function removeItem(handle) {
        this.iterGuard.check();
        if(!this.hasItem(handle)) {
            throw Error("item not in group: " + handle);
        }

        delete this.handleIdSet[handle];

        return this;
    }
});

module.exports = GenericGroup;

