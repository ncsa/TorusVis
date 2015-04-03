#! /usr/bin/env node

var childProcess = require('child_process');

var fs = require('fs');
var path = require('path');

var nodeModules = path.join('.', 'node_modules');
var devTools = path.join(nodeModules, 'torusvis-dev-tools');
var demoDir = path.join(devTools, 'demo');
var demoScript = path.join(demoDir, 'index.js');

var com = 'node';
var comArgs = [];

var child = childProcess.spawn(
    com, comArgs, { stdio: ['pipe'] }
);

var demoScriptStream = fs.createReadStream(demoScript);
demoScriptStream.pipe(child.stdin);

