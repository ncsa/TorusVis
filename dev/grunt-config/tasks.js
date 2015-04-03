
"use strict";

var digest = require("../grunt-digest");

module.exports = function(grunt, config) {
    digest(grunt, {config:config, context:this}, [
        "tasks/build",
        "tasks/check",
        "tasks/debug",
        "tasks/default",
        "tasks/test",
        "tasks/demo"
    ]);
};

