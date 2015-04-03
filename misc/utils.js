
/*
 * Module: utils
 *
 * various utility types and functions
 */

"use strict";

/* global Exception */

var features = require("./features");

var isNull = features.require("isNull");
var isPlainObject = features.require("isPlainObject");
var isFunction = features.require("isFunction");
var isString = features.require("isString");
var extend = features.require("extend");

features.require("slice");

/*
 * Function: bisect
 *
 * array bisection algorithm
 *
 * searches a sorted array using a bisection algorithm.  The returned index, i,
 * partitions the array such that
 * | ( array[index] <= value )   for all index in [lo, i)
 * and
 * | ( value < array[index] )   for all index in [i, hi)
 *
 * The search can be bounded to only consider the subsection of the array given
 * by
 * | Array.slice(array, lo, hi)
 *
 * If the section of the array to be searched is not sorted, then the return
 * value is unspecified.
 *
 * Parameters:
 *     array[] - (*array*) sorted array of *numbers*
 *     value - (*number*) value to use in the search
 *     [lo] - (*number*) the lower-bound of the search (default: 0)
 *     [hi] - (*number*) the upper-bound of the search (default: array.length)
 *
 * Returns:
 *      - (*number*) the index bisecting the array
 */

/* wrap definition in a function literal for jshint exceptions */
var bisect; (function() {
/* jshint maxparams: 4 */
bisect = function bisect(array, value, lo, hi) {
    if(arguments.length < 3) { lo = 0; }
    if(arguments.length < 4) { hi = array.length; }

    var mid;
    while(lo < hi) {
        mid = Math.floor((lo + hi)/2);
        if(value < array[mid]) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }

    return lo;
};})();

/*
 * Function: breakFunction
 *
 * construct a function that throws an exception
 *
 * constructs and returns a function that, when called, throws an exception
 *
 * Parameters:
 *     message - (*String*) the message to be included in the thrown exception
 *
 * Returns:
 *      - (*function*) the constructed function
 *
 * See also:
 *      - <_abstract_>
 *      - <_notImplemented_>
 *      - <_notSupported_>
 */
function breakFunction(message) {
    return function() {
        throw Error(message);
    };
}

/*
 * Function: _deepEqualArray_
 *
 * (*INTERNAL*) try to compare two values as arrays
 *
 * Parameters:
 *
 *     a - (*Object*) a value to be compared with
 *     b - (*Object*) another value to be compared with
 *     tmp - (*Object*) temporary storage object
 *
 * Returns:
 *
 *      - (*Boolean*) *true* if the two objects are Arrays (also sets
 *                    *tmp.result* according whether the Arrays are equal in a
 *                    deep comparison)
 *
 * See:
 *     - <deepEqual>
 *     - <nodejs.org at http://www.nodejs.org/>
 *     - <Node License>
 */
function _deepEqualArray_(a, b, tmp) {
    var result = ( Array.isArray(a) && Array.isArray(b) );
    if(result) {
        tmp.result = (
            /* equal if number of elements match */
            a.length === b.length

            && /* ... and ... */

            /* every element matches */
            a.every(function(x, i) {
                /* jshint eqeqeq: false */
                return (x == b[i]);
                /* jshint eqeqeq: true */
            })
        );
    }
    return result;
}

/*
 * Function: _deepEqualDate_
 *
 * (*INTERNAL*) try to compare two values as Dates
 *
 * Parameters:
 *
 *     a - (*Object*) a value to be compared with
 *     b - (*Object*) another value to be compared with
 *     tmp - (*Object*) temporary storage object
 *
 * Returns:
 *
 *      - (*Boolean*) *true* if the two objects are Dates (also sets
 *                    *tmp.result* according to whether the Dates are equal)
 *
 * See:
 *     - <deepEqual>
 *     - <nodejs.org at http://www.nodejs.org/>
 *     - <Node License>
 */
function _deepEqualDate_(a, b, tmp) {
    var result = ( a instanceof Date && b instanceof Date );
    if(result) { tmp.result = ( a.getTime() === b.getTime() ); }
    return result;
}

/*
 * Function: _deepEqualDirect_
 *
 * (*INTERNAL*) try to compare two values directly
 *
 * Parameters:
 *
 *     a - (*Object*) a value to be compared with
 *     b - (*Object*) another value to be compared with
 *     tmp - (*Object*) temporary storage object
 *
 * Returns:
 *
 *      - (*Boolean*) *true* if the two objects can be compared directly
 *                    (also sets *tmp.result* to *true*)
 *
 * See:
 *     - <deepEqual>
 *     - <nodejs.org at http://www.nodejs.org/>
 *     - <Node License>
 */
function _deepEqualDirect_(a, b, tmp) {
    var result = ( a === b );
    if(result) { tmp.result = true; }
    return result;
}

/*
 * Function: _deepEqualNonObject_
 *
 * (*INTERNAL*) try to compare two values as non-Objects
 *
 * Parameters:
 *
 *     a - (*Object*) a value to be compared with
 *     b - (*Object*) another value to be compared with
 *     tmp - (*Object*) temporary storage object
 *
 * Returns:
 *
 *      - (*Boolean*) *true* if neither of the two objects are Objects (also
 *                    sets *tmp.result* according to whether a and b compare
 *                    equal under type coercion)
 *
 * See:
 *     - <deepEqual>
 *     - <nodejs.org at http://www.nodejs.org/>
 *     - <Node License>
 */
function _deepEqualNonObject_(a, b, tmp) {
    var result = ( typeof a !== "object" && typeof b !== "object" );
    /* jshint eqeqeq: false */
    if(result) { tmp.result = ( a == b ); }
    /* jshint eqeqeq: true */
    return result;
}

/*
 * Function: _deepEqualNull_
 *
 * (*INTERNAL*) check if either of two values are null
 *
 * Parameters:
 *
 *     a - (*Object*) a value to compare with null
 *     b - (*Object*) another value to compare with null
 *     tmp - (*Object*) temporary storage object
 *
 * Returns:
 *
 *      - (*Boolean*) *true* if either of the two objects are null (also sets
 *                    *tmp.result* to *false*)
 *
 * See:
 *     - <deepEqual>
 *     - <nodejs.org at http://www.nodejs.org/>
 *     - <Node License>
 */
function _deepEqualNull_(a, b, tmp) {
    var result = ( isNull(a) || isNull(b) );
    if(result) { tmp.result = false; }
    return result;
}

/*
 * Function: _deepEqualObject_
 *
 * (*INTERNAL*) explicitly deep-compare two objects
 *
 * Parameters:
 *
 *     a - (*Object*) a value to be compared with
 *     b - (*Object*) another value to be compared with
 *     tmp - (*Object*) temporary storage object
 *
 * Returns:
 *
 *      - (*Boolean*) *true* always (sets *tmp.result* according to whether the
 *                    two objects are equal in a deep comparison)
 *
 * See:
 *     - <deepEqual>
 *     - <nodejs.org at http://www.nodejs.org/>
 *     - <Node License>
 */
function _deepEqualObject_(a, b, tmp) {
    var aKeys, bKeys;

    try {
        aKeys = Object.keys(a);
        bKeys = Object.keys(b);
    } catch(e) {
        tmp.result = false;
        return true;
    }

    if(aKeys.length !== bKeys.length) {
        tmp.result = false;
        return true;
    }

    aKeys.sort();
    bKeys.sort();

    tmp.result = (
        /* equal if every key matches */
        aKeys.every(function(aKey, i) {
            return (aKey = bKeys[i]);
        })

        && /* ... and ... */

        /* every value matches */
        aKeys.every(function(key) {
            return deepEqual(a[key], b[key]);
        })
    );

    return true;
}

/*
 * Function: _deepEqualPrototype_
 *
 * (*INTERNAL*) check if the prototypes of two values are different
 *
 * Parameters:
 *
 *     a - (*Object*) a value to check
 *     b - (*Object*) another value to check
 *     tmp - (*Object*) temporary storage object
 *
 * Returns:
 *
 *      - (*Boolean*) *true* if the two objects have different prototypes
 *                    (also sets *tmp.result* to *false*)
 *
 * See:
 *     - <deepEqual>
 *     - <nodejs.org at http://www.nodejs.org/>
 *     - <Node License>
 */
function _deepEqualPrototype_(a, b, tmp) {
    var result = ( a.prototype !== b.prototype );
    if(result) { tmp.result = false; }
    return result;
}

/*
 * Function: _deepEqualRegExp_
 *
 * (*INTERNAL*) try to compare two values as RegExps
 *
 * Parameters:
 *
 *     a - (*Object*) a value to be compared with
 *     b - (*Object*) another value to be compared with
 *     tmp - (*Object*) temporary storage object
 *
 * Returns:
 *
 *      - (*Boolean*) *true* if the two objects are RegExps (also sets
 *                    *tmp.result* to *true* according to whether the RegExps
 *                    are equal)
 *
 * See:
 *     - <deepEqual>
 *     - <nodejs.org at http://www.nodejs.org/>
 *     - <Node License>
 */
function _deepEqualRegExp_(a, b, tmp) {
    var result = (a instanceof RegExp && b instanceof RegExp);
    if(result) {
        tmp.result = (
            a.source     === b.source     &&
            a.global     === b.global     &&
            a.multiline  === b.multiline  &&
            a.lastIndex  === b.lastIndex  &&
            a.ignoreCase === b.ignoreCase
        );
    }
    return result;
}

/*
 * Function: deepEqual
 *
 * deep comparison of two values
 *
 * Parameters:
 *
 *     a - (*Object*) a value to be compared with
 *     b - (*Object*) another value to be compared with
 *
 * Returns:
 *
 *      - (*Boolean*) whether the two objects are equal in a deep comparison
 *
 * See:
 *
 *     - <_deepEqualArray_>
 *     - <_deepEqualDate_>
 *     - <_deepEqualDirect_>
 *     - <_deepEqualNonObject_>
 *     - <_deepEqualNull_>
 *     - <_deepEqualObject_>
 *     - <_deepEqualPrototype_>
 *     - <_deepEqualRegExp_>
 *     - <nodejs.org at http://www.nodejs.org/>
 *     - <Node License>
 */
function deepEqual(a, b) {
    var tmp = {};

    /*
     * iterate through each comparison heuristic
     * until one of them yields a definitive result
     */
    [
        _deepEqualDirect_,
        _deepEqualArray_,
        _deepEqualDate_,
        _deepEqualRegExp_,
        _deepEqualNonObject_,
        _deepEqualNull_,
        _deepEqualPrototype_,
        _deepEqualObject_
    ].some(function(func) {
        return func.apply(null, [a, b, tmp]);
    });

    return tmp.result;
}

/*
 * Function: indexMap
 *
 * map a tuple of integer indexes to a single index
 *
 * maps a tuple of integer indexes representing an index into a multidimensional
 * array to a single index that represents an index into a flattened 1D version
 * of the same array.  The flattened array is conceptually arranged so that
 * tuples mapping to consecutive flattened index values have their
 * index components changing faster the earlier they occur in the tuple (i.e.:
 * FORTRAN ordering).
 *
 * For example, a 3 x 5 array would have their flattened index values
 * conceptually arranged according to the diagram below:
 *
 * |                     dim_1
 * |
 * |              0    1    2    3    4
 * |           .------------------------.
 * |         0 |  0 |  3 |  6 |  9 | 12 |
 * |           |----+-------------------|
 * |  dim_0  1 |  1 |  4 |  7 | 10 | 13 |
 * |           |----+-------------------|
 * |         2 |  2 |  5 |  8 | 11 | 14 |
 * |           '------------------------'
 *
 * Parameters:
 *     indexes[] - (*array*) array of integer indexes
 *     dimensions[] - (*array*) array of integer dimensions
 *
 * Returns:
 *      - (*number*) integer index into the flattened array
 *
 * Example:
 * (begin code)
 * var im = torusvis.indexMap;
 * var dimensions = [3, 5];
 *
 * console.log(im([0, 0], dimensions));
 * console.log(im([1, 0], dimensions));
 * console.log(im([2, 0], dimensions));
 * console.log(im([0, 1], dimensions));
 * console.log(im([1, 1], dimensions));
 * console.log(im([2, 1], dimensions));
 * console.log(im([0, 2], dimensions));
 * (end code)
 *
 * | 0
 * | 1
 * | 2
 * | 3
 * | 4
 * | 5
 * | 6
 *
 * See also:
 *      - <indexUnmap>
 */
function indexMap(indexes, dimensions) {
    var result = 0,
        scaleFactor = 1;

    iter(indexes, function(index, i) {
        if(i > 0) { scaleFactor *= dimensions[i-1]; }
        result += index*scaleFactor;
    });

    return result;
}

/*
 * Function: indexUnmap
 *
 * map a single index to a tuple of integer indexes
 *
 * maps a single index into a flattend array to a tuple of integer indexes
 * representing an index into a multidimensional version ot the same array.
 * This function is the inverse of <indexMap>.
 *
 * Parameters:
 *     index - (*number*) integer index
 *     dimensions[] - (*array*) array of integer dimensions
 *     [result[]] - (*array*) array to populate with the resulting indexes
 *               (default: a new array is allocated)
 *
 * Returns:
 *      - (*array*) tuple of integer indexes
 *
 * See also:
 *      - <indexMap>
 */
function indexUnmap(index, dimensions, result) {
    if((void 0) === result || null === result) {
        result = new Array(dimensions.length);
    }

    var divisor = reduce(dimensions, multiply, 1.0);

    for(var i=dimensions.length; i--; ) {
        divisor /= dimensions[i];
        result[i] = Math.floor(index/divisor);
        index %= divisor;
    }

    return result;
}

function multiply(a, b) { return a*b; }
function add(a, b) { return a+b; }

/*
 * Function: noop
 *
 * does nothing (it's a no-op)
 *
 * Parameters:
 *     anything you want (it's a no-op)
 *
 * Returns:
 *      - absolutely nothing (it's a no-op)
 *
 * Throws:
 *      - never (unless something went horribly wrong)
 */
function noop() { }

/*
 * Function: objectPop
 *
 * remove and return an item from an object
 *
 * returns the item mapped to the given key in the given object.  The entry for
 * the returned item is also removed from it.  If the given key is not provided,
 * a key is arbitrarily chosen from the given object.  If the given object is
 * empty or does not contain a provided key, then *null* is returned and the
 * object is not modified.
 *
 * Parameters:
 *     obj - (*Object*) the given object
 *     [key] - (*Object*) an optional key
 *
 * Returns:
 *      - (*array*) The *[key, value]* pair removed, or *null*
 *
 */
function objectPop(obj, key) {
    var result;
    var hasKey = (arguments.length >= 2);

    if(!hasKey) {
        var objKeys = Object.keys(obj);
        hasKey = (objKeys.length > 0);
        if(hasKey) { key = objKeys[0]; }
    }

    if(hasKey) {
        result = [key, obj[key]];
        delete obj[key];
    }

    return result;
}

/*
 * Class: IdAllocator
 *
 * integer ID allocator
 *
 * An <IdAllocator> is a self-contained namespace of unique integer ID
 * numbers.  <IdAllocators> provide methods for allocating new ID numbers and
 * releasing previously allocated ID numbers.  Once allocated, an ID number is
 * guaranteed to never be returned by a subsequent allocation by the same
 * <IdAllocator> until it is released.
 */

/*
 * Constructor: new IdAllocator
 *
 * constructs a new <IdAllocator> with no ID numbers allocated
 */
function IdAllocator() {
    this.freeAll();
}

extend(IdAllocator.prototype, {
    constructor: IdAllocator,

    alloc:
    /*
     * Method: alloc
     *
     * allocates a new ID number
     *
     * Returns:
     *
     *      - (*number*) the allocated ID number
     *
     * See:
     *
     *      - <free>
     *      - <freeAll>
     */
    function alloc() {
        var result = objectPop(this.freeSet);
        if(isNull(result)) {
            return this.counter++;
        }

        ++this.size;
        return result[0];
    },

    idIsAllocated:
    /*
     * Method: idIsAllocated
     *
     * check if a given ID is allocated
     *
     * Returns:
     *      - (*Boolean*) whether the given ID is allocated
     */
    function idIsAllocated(id) {
        return (
            id < this.counter &&
            !( id in this.freeSet )
        );
    },

    free:
    /*
     * Method: free
     *
     * releases an allocated ID number, allowing it to be allocated again
     *
     * See:
     *
     *      - <alloc>
     *      - <freeAll>
     */
    function free(id) {
        if(!this.idIsAllocated(id)) {
            throw Error("id not allocated");
        }
        this.freeSet[id] = true;
        --this.size;
    },

    freeAll:
    /*
     * Method: freeAll
     *
     * releases all allocated ID numbers
     *
     * See:
     *      - <free>
     *      - <alloc>
     */
    function freeAll() {
        this.freeSet = {};
        this.counter = 0;
        this.size = 0;
    },

    size:
    /*
     * Method: size
     *
     * returns the number of allocated ID numbers
     *
     * Returns:
     *      - (*number*) number of allocated ID numbers
     */
    function size() {
        return this.size;
    }
});

/*
 * Class: IterationGuard
 *
 * reference-counting write guard for iterators
 *
 * Data structure types offering an iterator interface usually require that
 * client code avoid performing operations that modify the internal structures
 * of the type's instances -- often to prevent undefined behavior.  For example,
 * types representing a list usually forbid client code from adding or removing
 * items while iterating over them.
 *
 * <IterationGuards> enable these types to protect their internal structures
 * from iteration code.  To do so, these types allocate an <IterationGuard>
 * instance, enable it before allowing client code to iterate over its contents,
 * and disable it once client code has completed iteration.  By inserting checks
 * on the state of the <IterationGuard> near the beginning of each of its
 * structure-modifying methods, such data structure types can readily detect and
 * react to client code that is trying to modify structure while traversing it.
 *
 * <IterationGuards> track a reference count that is incremented by one every
 * time it is enabled, and decremented by 1 every time it is disabled, raising
 * an exception anytime it is checked with a non-zero reference count.  In this
 * way, <IterationGuards> allow iteration code to recursively iterate in a
 * manner analagous to how reentrant locks and semaphores allow nested access to
 * critical sections of data.
 *
 * Example:
 * (begin code)
 * function ExampleList() {
 *     this.array = [];
 *     this.iterGuard = new torusvis.IterationGuard();
 * }
 *
 * ExampleList.prototype.add = function(item) {
 *     // throws exception if being iterated over
 *     this.iterGuard.check();
 *
 *     // go on to add item ...
 * }
 * 
 * // similarly for insert(), remove(), etc...
 *
 * ExampleList.prototype.iterItems = function(callback) {
 *     this.iterGuard.run(function() {
 *         // *None* of the code executed within this function body can modify
 *         // the ExampleList's internal structures.  This restriction extends
 *         // to the client iteration callback code.
 *
 *         for(
 *             // some loop condition
 *         ) {
 *             var item = this.getNextItem();
 *
 *             // client iteration code
 *             var result = callback(item);
 *
 *             // comonly used to allow client code to break out of the
 *             // iteration by returning anything that evaluates to true in a
 *             // boolean context
 *             if(!!(result)) { break; }
 *         }
 *     });
 * }
 *
 * // later on in client code...
 * var myList = new ExampleList();
 * for(...) {
 *     var item = // new item
 *     ExampleList.add(item);
 * }
 *
 * ...
 *
 * myList.iterItems(function(item) {
 *     // do anything with item
 *
 *     // can also recursively iterate
 *     myList.iterItems(function(otherItem) {
 *         if(item != otherItem) {
 *             // do something interesting...
 *         }
 *     });
 *
 *     try {
 *         var anotherItem = // completely new item
 *
 *         // raises an exception: cannot modify
 *         // internal structure while iterating
 *         myList.add(anotherItem);
 *     } catch(e) {
 *         console.log('exception thrown');
 *     }
 * });
 * (end code)
 *
 * | exception thrown
 */

/*
 * Constructor: new IterationGuard
 *
 * constructs a new <IterationGuard>
 *
 * See also:
 *      - <IterationGuard>
 */
function IterationGuard() {
    this.referenceCount = 0;
}

extend(IterationGuard.prototype, {
    check:
    /*
     * Method: check
     *
     * checks the state of the <IterationGuard>
     *
     * Throws:
     *      - (*Error*) (the exception set to be thrown) if the <IterationGuard>
     *        is enabled
     *
     * See also:
     *      - <setException>
     *      - <getException>
     *      - <IterationGuard.check>
     */
    function check() {
        if(this.referenceCount > 0) {
            throw this.getException();
        }
    },

    getException:
    /*
     * Method: getException
     *
     * return the exception set to be thrown when this <IterationGuard> is
     * triggered
     *
     * Returns:
     *      - (*Error*) the exception set to be thrown
     *
     * See also:
     *      - <setException>
     *      - <check>
     */
    function getException() {
        var result = this.exception || null;
        if(!!result) {
            result = new Error(
                "cannot modify internal state while iterating it"
            );
            this.exception = result;
        }

        return result;
    },

    run:
    /*
     * Method: run
     *
     * executes a given callback while ensuring the <IterationGuard> is enabled
     *
     * If the <IterationGuard> is <checked> during the execution of the callback
     * function, an exception is thrown
     *
     * Parameters:
     *     callback - (*function*) callback function to execute
     *
     * Throws:
     *      - (*Error*) if the <IterationGuard> is checked during the execution
     *        of the callback function
     *
     * See also:
     *      - <check>
     *      - <_increment>
     */
    function run(callback) {
        this._increment(+1);

        try { callback(); }

        finally {
            this._increment(-1);
        }
    },

    setException:
    /*
     * Method: setException
     *
     * sets the exception to be thrown when this <IterationGuard> is triggered
     *
     * Parameters:
     *     e - (*Error*) the exception set to be thrown
     *
     * Returns:
     *      - (*IterationGuard*) *this*
     *
     * See also:
     *      - <getException>
     *      - <check>
     */
    function setException(e) {
        this.exception = e;
        return this;
    },

    _increment:
    /*
     * Method: _increment
     *
     * (*INTERNAL*) modifies the reference count of the <IterationGuard>
     *
     * Parameters:
     *     [amount] - (*number*) the amount by which to change the reference
     *                count (can be negative).  (default: 1)
     *
     * Throws:
     *      - (*Error*) if the new reference count would become negative after
     *        the change
     *
     * See also:
     *      - <run>
     *      - <IterationGuard._increment>
     */
    function _increment(amount) {
        if(arguments.length < 1) {
            amount = 1;
        }

        var newReferenceCount = (
            this.referenceCount + amount
        );

        if(newReferenceCount < 0) {
            throw new Error(
                "cannot decrement IterationGuard reference count below 0"
            );
        }

        this.referenceCount = newReferenceCount;
    },
});

/*
 * Function: IterationGuard.check
 *
 * checks the state of multiple <IterationGuards>
 *
 * Parameters:
 *     guards[] - (*<IterationGuard>*) the guards to check
 *
 * Throws:
 *      - (*Error*) if any <IterationGuard> <check>() call throws an exception.
 *         The exception thrown is for the first such <IterationGuard> given.
 *
 * See also:
 *      - <check>
 */
IterationGuard.check = function check(guards) {
    iter(guards, function(guard) {
        guard.check();
    });
};

/*
 * Function: IterationGuard.run
 *
 * executes a given callback while ensuring all given <IterationGuards> are
 * enabled
 *
 * If any of the given <IterationGuards> are <checked> during the execution of
 * the callback function, an exception is thrown
 *
 * Parameters:
 *     guards[] - (*<IterationGuard>*) the guards to execute the given callback
 *              under
 *     callback - (*function*) callback function to execute
 *
 * Throws:
 *      - (*Error*) if any given <IterationGuard> is checked during the
 *        execution of the callback function
 *
 * See also:
 *      - <check>
 *      - <run>
 */
IterationGuard.run = function run(guards, callback) {
    IterationGuard._increment(guards, +1);

    try { callback(); }

    finally {
        IterationGuard._increment(guards, -1);
    }
};

/*
 * Function: IterationGuard._increment
 *
 * (*INTERNAL*) modifies the reference counts of each <IterationGuard> given
 *
 * Parameters:
 *     guards[] - (*<IterationGuard>*) the guards to increment
 *
 *     [amount] - (*number*) the amount by which to change the reference
 *                counts (can be negative).  (default: 1)
 *
 * Throws:
 *      - (*Error*) if the new reference count of any given <IterationGuard>
 *        would become negative after the change.  None of the given
 *        <IterationGuards> are modified in this case.
 *
 * See also:
 *      - <_increment>
 *      - <IterationGuard.run>
 */
IterationGuard._increment = function _increment(guards, amount) {
    var n = arguments.length;

    if(arguments.length < 2) {
        amount = 1;
    }

    var lastI;
    for(var i=0; i<n; ++i) {
        lastI = i;
        try {
            guards[i]._increment(amount);
        } catch(e) {
            for(;lastI--;) {
                guards[lastI]._increment(-amount);
            }
            throw e;
        }
    }
};

/*
 * Class: OrderedMap
 *
 * ordered mapping between key-value pairs
 *
 * An <OrderedMap> is a mapping between key-value pairs that "remembers" the
 * order in which new keys are added.  Changing the value for an existing key in
 * an <OrderedMap> will not change the key's place in the ordering.  To move an
 * existing key "to the front of the line", first remove (<unset>) the key-value
 * pair from the <OrderedMap> and then <set> it, anew.
 */

/*
 * Constructor: new OrderedMap
 *
 * constructs an empty <OrderedMap>
 */
function OrderedMap() {
    this.unset();
}

extend(OrderedMap.prototype, {
    constructor: OrderedMap,

    get:
    /*
     * Method: get
     *
     * fetch and return one or more values associated with the given keys
     *
     * If one key is given, the value associated with it is returned.
     *
     * If multiple keys are given, a plain object mapping each provided key to
     * its associated value is returned.
     *
     * If no keys are given, a plain object mapping all keys is returned.
     *
     * Parameters:
     *
     *     [keys[, ...]] - (*String* | *number*) one or more keys or indexes to
     *                     look up, or none to return all entries
     *
     * Returns:
     *      - (*Object*) value associated with the given key, or plain object
     *        mapping multiple keys
     */
    function get() {
        var args = Array.slice(arguments);
        var self = this;

        var result;

        if(args.length < 1) {
            result = {};
            extend(result, this.map);
        } else if(args.length === 1) {
            var key = args[0];
            if(typeof key === "number") {
                this._checkIndex(key);
                key = this.order[key];
            }
            result = this.map[key];
        } else {
            result = {};
            iter(args, function(key) {
                var k = key;
                if(typeof k === "number") {
                    k = self.order[k];
                }
                result[key] = self.map[k];
            });
        }
        return result;
    },

    /*
     * Method: keys
     *
     * return keys in the order that they were added
     *
     * Returns:
     *
     *      - (*array*) list of keys in order
     */
    keys:
    function keys() {
        return [].concat(this.order);
    },

    /*
     * Method: length
     *
     * return the number of keys
     *
     * Returns:
     *
     *      - (*number*) the number of keys in this <OrderedMap>
     */
    length:
    function length() {
        return this.order.length;
    },

    set:
    /*
     * Method: set
     *
     * sets the value to be associated with a given key
     *
     * If an entry for *key* does not already exist, a new one is created for
     * it.  If *key* is a number, the value for the *key*'th entry is set, or an
     * exception is thrown if *key* is out of bounds.
     *
     * Parameters:
     *
     *     key - (*String* | *number*) key or index to look up.
     *     value - (*Object*) object to associate with *key*
     *
     * Returns:
     *      - (*Object*) *this*
     *
     * Throws:
     *      - (*Error*) if a given numeric key is out of bounds
     */
    function set(key, value) {
        if(typeof key === "number") {
            this._checkIndex(key);
            key = this.order[key];
        }

        var keyExists = ( key in this.map );
        this.map[key] = value;
        if(!keyExists) {
            this.order.push(key);
        }

        return this;
    },

    unset:
    /*
     * Method: unset
     *
     * remove entries for a set of given keys
     *
     * Parameters:
     *
     *     [keys[, ...]] - (*String* | *number*) one or more keys or indexes to
     *                     remove from the mapping, or none to clear all entries
     *
     * Returns:
     *      - (*Object*) *this*
     */
    function unset() {
        var args = Array.slice(arguments);
        if(args.length < 1) {
            this.map = {};
            this.order = [];
        } else {
            var keySet = {};
            var self = this;

            iter(args, function(key) {
                if(typeof key === "number") {
                    key = self.order[key];
                }

                var keyNotFound = !(key in keySet);
                if(keyNotFound) {
                    keySet[key] = true;
                    delete self.map[key];
                }
            });

            var key;
            var index = 0;
            var n = this.order.length;
            while(index < n) {
                key = this.order[index];
                if(key in keySet) {
                    if(index === 0) {
                        this.order.shift();
                    } else if(index + 1 === n) {
                        this.order.pop();
                    } else {
                        this.order = this.order.concat(
                            this.order.splice(index).slice(1)
                        );
                    }

                    --n;
                } else {
                    ++index;
                }
            }
        }

        return this;
    },

    _checkIndex:
    /*
     * Method: _checkIndex
     *
     * (*INTERNAL*) index bounds check for this <OrderedMap>
     *
     * Parameters:
     *
     *     key - (*number*) the index to be checked
     *
     * Throws:
     *
     *      - (*Error*) if *key* is out of this <OrderedMap's> array bounds
     */
    function _checkIndex(key) {
        if(key < 0 || key >= this.order.length) {
            throw new Exception("numeric key " + key + " is out of bounds");
        }
    }
});

function reserve(array, capacity) {
    var length = array.length;

    if(length < capacity) {
        array.push.apply(array, new Array(capacity - length));
    }

    return array;
}

function iter(iterable, callback) {
    var result;

    if(isFunction(iterable)) {
        result = iterable(callback);
        return result;
    }

    if( /* if array-like */
        Array.isArray(iterable) ||
        isFunction(iterable.some)
    ) {
        result = iterable.some(callback);
        return result;
    }

    /* should catch all other iterables */
    if(isPlainObject(iterable)) {
        result = Object.keys(iterable).some(function(key) {
            var item = iterable[key];

            /*
             * counteract the coercion of Numbers to Strings
             *
             * If index is a String containing a number, and converting to a
             * Number and back results in the same string, then use the number
             * as the key.
             */
            if(isString(key)) {
                var numericKey = Number(key);
                if(!isNaN(numericKey)) {
                    var key2 = String(numericKey);
                    if(key2 === key) {
                        key = numericKey;
                    }
                }
            }

            return callback(item, key, iterable);
        });

        return result;
    }

    throw Error("incompatible iterable");
}

function map(iterable, callback) {
    var result;

    if(isFunction(iterable)) {
        result = iterable(callback);
        return result;
    }

    if( /* if array-like */
        Array.isArray(iterable) ||
        isFunction(iterable.map)
    ) {
        result = iterable.map(callback);
        return result;
    }

    /* should catch all other iterables */
    if(isPlainObject(iterable)) {
        result = {};
        iter(iterable, function(item, key) {
            /*
             * counteract the coercion of Numbers to Strings
             *
             * If index is a String containing a number, and converting to a
             * Number and back results in the same string, then use the number
             * as the key.
             */
            if(isString(key)) {
                var numericKey = Number(key);
                if(!isNaN(numericKey)) {
                    var key2 = String(numericKey);
                    if(key2 === key) {
                        key = numericKey;
                    }
                }
            }

            result[key] = callback(item, key, iterable);
        });

        return result;
    }

    throw Error("incompatible iterable");
}

function reduce(iterable, callback, initialValue) {
    var result;

    if(isFunction(iterable)) {
        result = iterable(callback, initialValue);
        return result;
    }

    if( /* if array-like */
        Array.isArray(iterable) ||
        isFunction(iterable.reduce)
    ) {
        result = iterable.reduce(callback, initialValue);
        return result;
    }

    if(arguments.length < 3) {
        initialValue = 0;
    }

    /* should catch all other iterables */
    if(isPlainObject(iterable)) {
        result = initialValue;
        iter(iterable, function(item, key) {
            /*
             * counteract the coercion of Numbers to Strings
             *
             * If index is a String containing a number, and converting to a
             * Number and back results in the same string, then use the number
             * as the key.
             */
            if(isString(key)) {
                var numericKey = Number(key);
                if(!isNaN(numericKey)) {
                    var key2 = String(numericKey);
                    if(key2 === key) {
                        key = numericKey;
                    }
                }
            }

            result = callback(result, item, key, iterable);
        });

        return result;
    }

    throw Error("incompatible iterable");
}

extend(exports, {
    global: features.require("global"),
    objectPop: objectPop,
    isNull: isNull,
    isPlainObject: isPlainObject,
    isFunction: isFunction,
    extend: extend,
    urlArguments: features.require("urlArguments"),
    deepEqual: deepEqual,

    indexMap: indexMap,
    indexUnmap: indexUnmap,

    noop: noop,

    breakFunction: breakFunction,

    /*
     * Function: _abstract_
     *
     * (*INTERNAL*) function stub for abstract methods
     */
    _abstract_ : breakFunction("abstract"),

    /*
     * Function: _notImplemented_
     *
     * (*INTERNAL*) function stub for unimplemented functions
     */
    _notImplemented_: breakFunction("not implemented"),

    /*
     * Function: _notSupported_
     *
     * (*INTERNAL*) function stub for unsupported functions
     */
    _notSupported_: breakFunction("not supported"),

    multiply: multiply,
    add: add,

    OrderedMap: OrderedMap,
    IdAllocator: IdAllocator,
    IterationGuard: IterationGuard,

    bisect: bisect,
    reserve: reserve,

    iter: iter,
    map: map,
    reduce: reduce
});

