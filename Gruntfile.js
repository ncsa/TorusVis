
"use strict";

var digest = require("./dev/grunt-digest");

module.exports = function(grunt) {
    grunt.initConfig(
        digest(
            grunt, [
                "pkg",
                "browserify",
                "express",
                "clean",
                "copy",
                "csslint",
                "jshint",
                "mkdir",
                "natural-docs",
                "node-inspector",
                "nodeunit",
                "symlink",
                "tags",
                "tasks",
                "uglify",
                "watch"
            ]
        )
    );
};

