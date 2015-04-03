
"use strict";

module.exports = function(grunt, config) {
    grunt.registerTask("build:lib", ["browserify", "uglify"]);

    grunt.registerTask(
        "build:docs", [
            "mkdir:build-dir",
            "mkdir:docs-dir",
            "mkdir:plain-docs-dir",
            "mkdir:framed-docs-dir",
            "copy:docs-project",
            "symlink:torusvis",
            "natural_docs"
        ]
    );

    grunt.registerTask("build", ["build:lib", "build:docs", "tags"]);
};

