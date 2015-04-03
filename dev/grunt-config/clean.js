
"use strict";

var ppaths = require("./project-paths");

module.exports = function(grunt, config) {
    config.clean = [
        ppaths.directories.build,
        ppaths.files.tags
    ];

    grunt.loadNpmTasks("grunt-contrib-clean");
};

