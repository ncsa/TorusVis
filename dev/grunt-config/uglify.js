
"use strict";

var ppaths = require("./project-paths");

module.exports = function(grunt, config) {
    config.uglify = {
        "options": {
            "report": "gzip",
            "mangle": true,
            "preserveComments": false,
        },

        "torusvis": {
            "options": {
                "sourceMap": true,
                "sourceMapName": ppaths.files.libMap,

                "banner": [
                    "/*!",
                    " * torusvis JavaScript Library v0.1.0",
                    " * http://torusvis.github.io",
                    " *",
                    " * Copyright 2013-2015, University of Illinois/NCSA.",
                    " * All rights reserved.",
                    " *",
                    " * See http://torusvis.github.io/license",
                    " */",
                    ""
                ].join("\n")
            },

            "files": (function() {
                var result = {};
                result[ppaths.files.libMin] = [ppaths.files.libDebug];
                return result;
            })()
        }
    };

    grunt.loadNpmTasks("grunt-contrib-uglify");
};

