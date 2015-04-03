
"use strict";

var path = require("path");

module.exports = function digest(grunt, data, configNames) {
    if(arguments.length < 3) {
        configNames = data;
        data = {
            config: {},
            context: {}
        };
    }

    configNames.forEach(function(configName) {
        var configPath = ["./grunt-config", configName].join("/");
        var configFunction = require(configPath);
        configFunction.apply(data.context, [grunt, data.config]);
    });

    return data.config;
};

