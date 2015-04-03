
"use strict";

var ppaths = require("./project-paths");

module.exports = function(grunt, config) {
    var pkg = this.pkg;

    config.browserify = {
        "torusvis": {
            "src": ["index.js"],

            "dest": ppaths.files.libDebug,

            "options": {
                "browserifyOptions": {
                    "debug": true,
                    "standalone": "torusvis"
                },

                "preBundleCB": function(b) {
                    var oDeps = pkg.optionalDependencies || {};

                    Object.keys(oDeps).forEach(function(libName) {
                        grunt.log.write("searching for optional dependency: ");
                        grunt.log.write(libName);
                        grunt.log.write(" ... ");

                        /* if an optional dependency is not available... */
                        try {
                            require(libName);
                            grunt.log.writeln("found");
                        }

                        /* ...generate a stub for it */
                        catch(e) {
                            b.ignore(libName);
                            grunt.log.writeln("missing");
                        }
                    });
                }
            }
        }
    };

    grunt.loadNpmTasks("grunt-browserify");
};

