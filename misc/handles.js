
/*
 * File: handles
 *
 * handle-based memory management
 *
 * Handles are a more manual method of object management similar in concept to
 * memory management in compiled languages like C.  Managing javascript objects
 * using a handle-based approach enables some APIs that require greater control
 * over the introduction and removal of internal objects.  For example, a
 * graph-like data structure might expose an interface to access objects
 * representing the nodes or edges in it, but also allow users to remove such
 * features.  By returning handles around node and edge objects instead of those
 * objects directly, graphs can remove the objects in a manner immediately
 * noticable to other parts of an application.
 *
 * This handles module also tags handles upon creation with a unique integer ID
 * number, which allow arbitrary objects to be used as keys through their
 * handles -- even objects that don't lend themselves well to serialization.
 *
 * Note that although a handle may be freed, there is no guarantee that the
 * object it referenced will be garbage collected.  Other sections of code might
 * possess a direct reference to the object, or it might be referenced by other
 * active handles.  The only guarantee offered is that such an object would no
 * longer be accessible through the freed handle.
 */

"use strict";

var utils = require("./utils");

function _throwOnInvalidHandle_(handle) {
    if(!handle.isValid()) { throw new Error("invalid handle"); }
}

/*
 * Function: newHandleAllocator
 *
 * factory function for creating new <HandleAllocators>
 *
 * Note that objects returned by <newHandleAllocator> are *not* actually
 * <HandleAllocators>, but instead thin wrappers around them.  These wrappers
 * expose the same API as that documented for <HandleAllocators>, but may also
 * be called directly as a function would to invoke its <HandleAllocator.alloc>
 * method.
 *
 * Returns:
 *      - (*Object*) wrapper around the newly created <HandleAllocator>
 */
function newHandleAllocator() {
    var allocator = new HandleAllocator();

    var wrapper = function() {
        return allocator.alloc.apply(allocator, arguments);
    };
    wrapper.alloc = wrapper;

    wrapper.getHandleFromId = function() {
        return allocator.getHandleFromId.apply(allocator, arguments);
    };

    wrapper.iterHandles = function() {
        return allocator.iterHandles.apply(allocator, arguments);
    };

    wrapper.size    = function() { return allocator.size();    };
    wrapper.freeAll = function() { return allocator.freeAll(); };

    return wrapper;
}



/*
 * Class: HandleAllocator
 *
 * allocator of new <Handles>
 *
 * A <HandleAllocator> serves as a manager of- and a stand-alone namespace for-
 * new <Handles>.  Active <Handles> are guaranteed to posess an ID number that
 * is unique among all other active <Handles> created by the same
 * <HandleAllocator>.
 *
 * See also:
 *      - <Handle>
 */

/*
 * Constructor: new HandleAllocator
 *
 * (*INTERNAL*) constructs a new empty <HandleAllocator>
 */
function HandleAllocator() {
    this.objectList = [];
    this.slotCounterList = [];
    this.handleList = [];
    this.idAllocator = new utils.IdAllocator();
    this.iterGuard = new utils.IterationGuard();
    this.iterGuard.setException(
        new Error("cannot allocate or free handles while iterating")
    );
}

utils.extend(HandleAllocator.prototype, {
    constructor: HandleAllocator,

    alloc:
    /*
     * Method: alloc
     *
     * allocates a new <Handle> and returns a wrapper around it
     *
     * Parameters:
     *     [object] - (*Object*) object to be referenced by the new <Handle>
     *                (default: { })
     *
     * Returns:
     *      - (*Object*) a callable wrapper around the <Handle>
     *
     * Throws:
     *      - (*Error*) if this <HandleAllocator> is currently being iterated
     *        over
     *
     * See also:
     *      - <freeAll>
     *      - <size>
     *      - <Handle.free>
     */
    function alloc(object) {
        this.iterGuard.check();

        if(arguments.length < 1) {
            object = {};
        }

        var handleId = this.idAllocator.alloc();

        this.slotCounterList[handleId] = this.slotCounterList[handleId] || 0;
        ++this.slotCounterList[handleId];

        this.objectList[handleId] = object;

        var handle = new Handle(this, handleId, this.slotCounterList[handleId]);

        var wrapper = function() {
            return handle.dereference.apply(handle, arguments);
        };
        wrapper.dereference = wrapper;

        wrapper.isValid  = function() { return handle.isValid    (); };
        wrapper.free     = function() {        handle.free       (); };
        wrapper.id       = handle.id;
        wrapper.checksum = handle.checksum;

        this.handleList[handleId] = wrapper;
        return wrapper;
    },

    getHandleFromId:
    /*
     * Method: getHandleFromId
     *
     * returns the wrapper around the <handle> with the given ID number
     *
     * Parameters:
     *     id - (*number*) the ID number to search for
     *
     * Returns:
     *      - (*object*) the wrapper around the <handle> with the given ID
     *        number, or *null* if no such wrapper exists
     */
    function getHandleFromId(id) {
        if(!this.idAllocator.idIsAllocated(id)) {
            return null;
        }
        return this.handleList[id];
    },

    size:
    /*
     * Method: size
     *
     * returns the total number of active <handles> allocated by this
     * <HandleAllocator>
     *
     * Returns:
     *      - (*number*) the total number of active <handles> allocated by this
     *                   <HandleAllocator>
     *
     * See also:
     *      - <alloc>
     *      - <freeAll>
     *      - <Handle.free>
     */
    function size() {
        return this.idAllocator.size();
    },

    iterHandles:
    /*
     * Method: iterHandles
     *
     * iterate over all active <handle> wrappers allocated by this
     * <HandleAllocator>
     *
     * iterates over all active <handles> calling the provided callback function
     * with each wrapped <handle> as its sole argument.  The iteration ends once
     * all wrapped <handles> are passed or when the callback function returns a
     * value that evaluates as true in a boolean context.
     *
     * Parameters:
     *     callback - (*function*) the function to call for each wrapped
     *                <handle>
     *
     * Throws:
     *      - (*Error*) if the callback function attempts to add or remove
     *        <Handles> from this <HandleAllocator>
     *
     * See also:
     *      - <alloc>
     *      - <freeAll>
     *      - <Handle.free>
     */
    function iterHandles(callback) {
        var self = this;
        this.iterGuard.run(function() {
            self.handleList.some(function(handle) {
                var result = false;
                if(handle) { result = callback(handle); }
                return result;
            });
        });
    },

    freeAll:
    /*
     * Method: freeAll
     *
     * releases all active <Handles> managed by this <HandleAllocator>
     *
     * Throws:
     *      - (*Error*) if this <HandleAllocator> is currently being iterated
     *        over
     *
     * See also:
     *      - <Handle.free>
     */
    function freeAll() {
        this.iterGuard.check();

        this.objectList = [];
        this.slotCounterList = [];
        this.idAllocator.freeAll();
    }
});



/*
 * Class: Handle
 *
 * indirect reference to javascript objects
 *
 * Note that objects returned by <HandleAllocator.alloc> are *not* actually
 * <Handles>, but instead thin wrappers around them.  These wrappers expose the
 * same API as that documented here, but may also be called directly as a
 * function would to invoke its <dereference> method.
 */

/*
 * Constructor: new Handle
 *
 * (*INTERNAL*) constructs a new handle
 *
 * Parameters:
 *     allocator - (*<HandleAllocator>*) reference to the handle's parent
 *                 <HandleAllocator>
 *     id - (*number*) unique integer ID created by the handle's parent
 *          <HandleAllocator>
 *     checksum - (*number*) internal checksum used to differentiate two handles
 *                with the same ID (i.e.: if one was freed and its ID recycled)
 *
 * See also:
 *      - <HandleAllocator>
 */
function Handle(allocator, id, checksum) {
    this.allocator = allocator;
    this.id = id;
    this.checksum = checksum;
}

utils.extend(Handle.prototype, {
    constructor: Handle,

    dereference:
    /*
     * Method: dereference
     *
     * return the object referenced by this <Handle>
     *
     * Returns:
     *      - (*Object*) the object referenced by this <Handle>
     *
     * Throws:
     *      - (*Error*) if this <Handle> is invalid
     *
     * See also:
     *      - <isValid>
     */
    function dereference() {
        _throwOnInvalidHandle_(this);
        var object = this.allocator.objectList[this.id];
        return object;
    },

    free:
    /*
     * Method: free
     *
     * releases the handle, preventing it from being further
     * dereferenced
     *
     * Throws:
     *      - (*Error*) if this <Handle> is invalid
     *      - (*Error*) if this <Handle's> parent <HandleAllocator> is currently
     *        being
     *        iterated over Throws:
     *
     * See also:
     *      - <isValid>
     */
    function free() {
        _throwOnInvalidHandle_(this);
        delete this.allocator.objectList[this.id];
        delete this.allocator.handleList[this.id];
        this.allocator.idAllocator.free(this.id);
    },

    isValid:
    /*
     * Method: isValid
     *
     * check if this <Handle> is valid
     *
     * A handle is valid if it has been properly allocated by a parent
     * <HandleAllocator> and has not since been freed.
     *
     * Returns:
     *      - (*Boolean*) whether this <Handle> is valid
     *
     * See also:
     *      - <free>
     *      - <HandleAllocator>
     */
    function isValid() {
        return (
            this.allocator.idAllocator.idIsAllocated(this.id) &&
            this.allocator.slotCounterList[this.id] === this.checksum
        );
    }
});

module.exports = newHandleAllocator;

