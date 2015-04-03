
"use strict";

var ppaths = require("./project-paths");

module.exports = function(grunt, config) {
grunt.loadNpmTasks("grunt-contrib-nodeunit");
    config.nodeunit = {
        "files": ppaths.lists.testSources,
        "options": {
            "reporter": "grunt"
        }
    };

    grunt.loadNpmTasks("grunt-contrib-nodeunit");
};

