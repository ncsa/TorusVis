
"use strict";

module.exports = {
    dummy: function(test) {
        test.expect(1);
        test.notStrictEqual(0, 1, "somehow, 0 === 1");
        test.done();
    }
};

