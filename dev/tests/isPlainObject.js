
"use strict";

var utils = require("torusvis/misc/utils");

function DummyClass() {
    this.dummy = "dummy";
}

module.exports = {
    isPlainObject: function(test) {
        test.expect(4);

        test.ok(utils.isPlainObject({}));
        test.ok(!utils.isPlainObject(function(){}));
        test.ok(!utils.isPlainObject(new DummyClass()));
        test.ok(!utils.isPlainObject(Object.create({})));

        test.done();
    }
};

