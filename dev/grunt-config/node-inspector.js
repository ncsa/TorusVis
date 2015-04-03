
"use strict";

var ppaths = require("./project-paths");

module.exports = function(grunt, config) {
    config["node-inspector"] = {
        "dev": {
            "options": {
                "save-live-edit": true,
                "no-preload": false,
                "stack-trace-limit": 4,
                "hidden": ["node_modules", "pub"]
            },

            "src": ppaths.lists.testSources
        }
    };

    grunt.loadNpmTasks("grunt-node-inspector");
};

