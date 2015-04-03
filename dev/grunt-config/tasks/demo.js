
"use strict";

var opn = require("opn");

module.exports = function(grunt, config) {
    grunt.registerTask("open:demo", function() {
        setTimeout(function() { opn("http://localhost:5000"); }, 1000);
    });

    grunt.registerTask("demo", ["open:demo", "express:demo"]);
};

