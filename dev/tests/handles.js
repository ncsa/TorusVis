
"use strict";

var utils = require("torusvis/misc/utils");
var handles = require("torusvis/misc/handles");

module.exports = {
    handles: (function() {
    /* jshint maxstatements: 25 */
    return function(test) {
        var allocator;
        var object;
        var testObject = {test:"testtesttesttest"};
        var handle;

        /* handle allocator */
        allocator = handles();
        test.ok(allocator, "cannot create handle allocator");

        /* handles */
        /* ... with new objects */
        /* ... ... create */
        handle = allocator();
        test.ok(handle, "cannot create handle");

        /* ... ... dereference */
        object = handle();
        test.ok(object, "cannot dereference handle");

        /* ... ... verify object */
        test.strictEqual(Object.keys(object).length, 0, "new object not empty");

        /* ... ... free */
        test.doesNotThrow(function() { handle.free(); }, "cannot free handle");

        /* ... ... verify freed */
        test.throws(function() { handle(); }, "handle not properly freed");

        /* ... with existing objects */
        /* ... ... create */
        handle = allocator(testObject);
        test.ok(handle, "cannot create handle");

        /* ... ... dereference */
        object = handle();
        test.ok(object, "cannot dereference handle");

        /* ... ... verify object */
        test.strictEqual(object, testObject, "wrong object in handle");

        /* ... ... free */
        test.doesNotThrow(function() { handle.free(); }, "cannot free handle");

        /* ... ... verify freed */
        test.throws(function() { handle(); }, "handle not properly freed");

        test.done();
    };
    })()
};

