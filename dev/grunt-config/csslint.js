
"use strict";

var ppaths = require("./project-paths");

module.exports = function(grunt, config) {
    config.csslint = {
        "strict": {
            "options": { "csslintrc": ".csslintrc" },
            "src": ppaths.lists.cssSources
        }
    };

    grunt.loadNpmTasks("grunt-contrib-csslint");
};

