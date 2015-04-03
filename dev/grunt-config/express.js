
"use strict";

var path = require("path");
var express = require("express");
var bundleware = require("bundleware");

var ppaths = require("./project-paths");

module.exports = function(grunt, config) {
    config.express = {
        "demo": {
            "options": {
                "script": ppaths.files.demoServerMain,
                "background": false
            }
        }
    };

    grunt.loadNpmTasks("grunt-express-server");
};

