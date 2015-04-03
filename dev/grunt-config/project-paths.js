
"use strict";

var path = require("path");

var files = {};
var directories = {};
var lists = {};

directories.dev = "dev";
directories.nodeModules = "node_modules";
directories.torusvisSymlink = path.join(directories.nodeModules, "torusvis");
directories.devTools = path.join(directories.dev, "tools");
directories.pubs = "pub";
directories.demoServer = path.join(directories.dev, "demo-server");
directories.demoServerRoot = path.join(directories.demoServer, "root");

files.customJshintReporter = path.join(
    directories.dev,
    "customJshintReporter"
);

files.tags = "tags";
files.license = "LICENSE.txt";

lists.librarySources = [
    "index.js",
    "colors.js",
    "engines.js",
    "graphs.js",
    "groups.js",
    "mappers.js",
    "misc.js",

    "colors/**/*.js",
    "engines/**/*.js",
    "graphs/**/*.js",
    "groups/**/*.js",
    "mappers/**/*.js",
    "misc/**/*.js"
];

lists.documentationSources = [].concat(
    lists.librarySources,
    [files.license]
);

lists.exampleSources = [
    "dev/examples/**/*.html",
    "dev/examples/js/**/*.js"
];

lists.testSources = [
    "dev/tests/**/*.js"
];

lists.gruntSources = [
    "Gruntfile.js",
    "dev/grunt-digest.js",
    "dev/grunt-config/**/*.js"
];


directories.build = path.join(directories.dev, "build");
directories.docs = path.join(directories.build, "docs");
directories.framedDocs = path.join(directories.docs, "framedHtml");
directories.plainDocs = path.join(directories.docs, "html");
directories.docsConfigSource = path.join(directories.dev, "doc-config");
directories.docsConfigDestination = path.join(directories.build, "doc-config");
directories.examples = path.join(directories.dev, "examples");

lists.cssSources = [
    path.join(directories.docsConfigSource, "**", "*.css"),
    path.join(directories.examples, "**", "*.css")
];

files.stub = path.join(directories.build, "stub.js");
files.libDebug = path.join(directories.build, "torusvis.js");
files.libMin = path.join(directories.build, "torusvis.min.js");
files.libMap = path.join(directories.build, "torusvis.min.map");

files.demoServerMain = path.join(directories.demoServer, "index.js");

module.exports = {
    files: files,
    directories: directories,
    lists: lists
};

