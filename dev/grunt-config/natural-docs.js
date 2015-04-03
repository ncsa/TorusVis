
"use strict";

var ppaths = require("./project-paths");

module.exports = function(grunt, config) {
    /* keep jshint happy */
    var key = "natural_docs";
    config[key] = {
        "options": {
            "bin": "naturaldocs",
            "project": ppaths.directories.docsConfigDestination,
            "src": ".",
            "styles": ["Default", "docs"],
            "excludes": [
                ppaths.lists.gruntSources,
                "dev",
                "node_modules",
                "package.json",
                "pub"
            ],
            "inputs": ["/"]
        },

        "framedHtml": {
            "format": "FramedHTML",
            "output": ppaths.directories.framedDocs,
        },

        "html": {
            "format": "HTML",
            "output": ppaths.directories.plainDocs,
        },
    };

    grunt.loadNpmTasks("grunt-natural-docs");
};

