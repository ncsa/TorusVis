
"use strict";

var ppaths = require("./project-paths");

module.exports = function(grunt, config) {
    config.symlink = {
        "torusvis": {
            "dest": ppaths.directories.torusvisSymlink,
            "relativeSrc": "..",
            "options": { "type": "dir" }
        }
    };

    grunt.loadNpmTasks("grunt-symlink");
};

