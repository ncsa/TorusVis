
"use strict";

var path = require("path");
var ppaths = require("./project-paths");

module.exports = function(grunt, config) {
    config.jshint = {
        "options": {
            "jshintrc": ".jshintrc",
            "reporter": ppaths.files.customJshintReporter
        },

        "gruntfile": {
            "src": [].concat(
                ppaths.lists.gruntSources,
                [ ppaths.files.customJshintReporter ]
            )
        },

        "lib": { "src": ppaths.lists.librarySources },
        "test": { "src": ppaths.lists.testSources },
        "example": {
            "src": ppaths.lists.exampleSources,
            "options": {
                "jshintrc": path.join(
                    ppaths.directories.examples,
                    ".jshintrc"
                ),
                "extract": "always"
            }
        }
    };

    grunt.loadNpmTasks("grunt-contrib-jshint");
};

