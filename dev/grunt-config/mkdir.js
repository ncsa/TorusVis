
"use strict";

var ppaths = require("./project-paths");

module.exports = function(grunt, config) {
    config.mkdir = {
        "build-dir": {
            "options": {
                "create": [ ppaths.directories.build ]
            }
        },

        "docs-dir": {
            "options": {
                "create": [ ppaths.directories.docs ]
            },
        },

        "plain-docs-dir": {
            "options": {
                "create": [ ppaths.directories.plainDocs ]
            },
        },

        "framed-docs-dir": {
            "options": {
                "create": [ ppaths.directories.framedDocs ]
            },
        }
    };

    grunt.loadNpmTasks("grunt-mkdir");
};

