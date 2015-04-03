
"use strict";

var ppaths = require("./project-paths");

module.exports = function(grunt, config) {
    config.copy = {
        "docs-project": {
            "files": [{
                "expand": true,
                "cwd": ppaths.directories.docsConfigSource,
                "src": [ "**" ],
                "dest": ppaths.directories.docsConfigDestination
            }]
        }
    };

    grunt.loadNpmTasks("grunt-contrib-copy");
};

