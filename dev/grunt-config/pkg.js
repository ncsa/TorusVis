
"use strict";

module.exports = function(grunt, config) {
    this.pkg = grunt.file.readJSON("package.json");
    config.pkg = this.pkg;
};

