
"use strict";

var ppaths = require("./project-paths");

module.exports = function(grunt, config) {
    config.watch = {
        "gruntfile": {
            "files": [ppaths.lists.gruntSources],
            "tasks": ["jshint:gruntfile"]
        },

        "lib": {
            "files": ppaths.lists.librarySources,
            "tasks": ["jshint:lib", "test", "tags"]
        },

        "docs": {
            "files": ppaths.lists.documentationSources,
            "tasks": ["build:docs"]
        },

        "test": {
            "files": ppaths.lists.testSources,
            "tasks": ["jshint:test", "test"]
        },

        "css": {
            "files": ppaths.lists.cssSources,
            "tasks": ["csslint:strict"]
        },

        "example": {
            "files": ppaths.lists.exampleSources,
            "tasks": ["jshint:example"]
        }
    };

    grunt.loadNpmTasks("grunt-contrib-watch");
};

