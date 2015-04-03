
/*
 * File: GenericGroups
 *
 * node and edge groups
 */

"use strict";

var utils = require("../misc/utils");

/*
 * About: Common Display Options
 *
 * Parameters:
 *     map - (*Object*) texture map to use. 
 *
 *     size - (*Number*) size of the elements used (e.g. radius of spheres,
 *            height of sprites, thickness of lines)
 *
 *     opacity - (*Number*) value between 0.0 (fully transparent) and 1.0 (fully
 *               opaque)
 *
 *     color - (*Number*) color in hex of the elements used (ignored if
 *             colorBy and colorMap are set
 *
 *     colorBy - (*String*) attribute name from nodes' or edges' data objects by
 *               which the elements used should be colored
 *
 *     colorMap - (*<ColorMap>*) color mapping from fetched colorBy values to
 *                colors
 *
 * See also:
 *      - <THREE.ImageUtils.loadTexture at
 *          http://threejs.org/docs/#Reference/Extras/ImageUtils.loadTexture>
 *
 */

/*
 * Class: GenericGroup
 *
 * (*INTERNAL*) common subclass for node and edge groups
 *
 * A <GenericGroup> is a set of handles index by their handle ID numbers.
 * <GenericGroups> form the basis of <NodeGroups> and <EdgeGroups>, which are
 * subclasses of <GenericGroup> with each instance bundled with display
 * information.
 *
 * See also:
 *      - <NodeGroup>
 *      - <EdgeGroup>
 *      - <handles>
 */

/*
 * Constructor: constructor
 *
 * constructs a new <GenericGroup>
 *
 * Parameters:
 *     handleList - (*Array*) initial list of handles to populate this
 *                  <GenericGroup> with
 *
 *     options - (*Object*) table of options
 *
 * See also:
 *      - <Common Display Options>
 */
function constructor(handleList, options) {
    /* documentation stub */
}

function GenericGroup(handleList, options) {
    handleList = handleList || [];
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

    hasItem:
    /*
     * Method: hasItem
     *
     * determine if this <GenericGroup> has the given item
     *
     * Parameters:
     *     handle - (*Object*) handle to the given item
     *
     * Returns:
     *      - (*Boolean*) whether this <GenericGroup> has the given item
     *
     * See also:
     *      - <addItem>
     *      - <removeItem>
     */
    function hasItem(handle) {
        return (this.handleIdSet[handle] === handle);
    },

    addItem:
    /*
     * Method: addItem
     *
     * add a new item to this <GenericGroup>
     *
     * Parameters:
     *     handle - (*Object*) handle to the new item
     *
     * Returns:
     *      - (*Object*) *this*
     *
     * Throws:
     *      - (*Error*) if called while iterating
     *
     * See also:
     *      - <removeItem>
     *      - <iterItems>
     */
    function addItem(handle) {
        this.iterGuard.check();
        if(!this.hasItem(handle)) {
            this.handleIdSet[handle] = handle;
        }

        return this;
    },

    iterItems:
    /*
     * Method: iterItems
     *
     * iterate over each item in this <GenericGroup>
     *
     * Parameters:
     *     callback - (*Function*) callback function to call for each item
     *
     * Throws:
     *      - (*Error*) if the iterating code attempts to add or remove items
     *        from this <GenericGroup>
     *
     * See also:
     *      - <addItem>
     *      - <removeItem>
     */
    function iterItems(callback) {
        var self = this;
        this.iterGuard.run(function() {
            Object.keys(self.handleIdSet).some(function(key) {
                var handle = self.handleIdSet[key];
                return callback(handle);
            });
        });
    },

    removeItem:
    /*
     * Method: removeItem
     *
     * remove the given item from this <GenericGroup>
     *
     * Parameters:
     *     handle - (*Object*) handle to the given item
     *
     * Returns:
     *      - (*Object*) *this*
     *
     * Throws:
     *      - (*Error*) if called while iterating
     *
     * See also:
     *      - <addItem>
     *      - <iterItems>
     */
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

