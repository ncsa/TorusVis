#! /usr/bin/env node

var childProcess = require('child_process');

var fs = require('fs');
var path = require('path');

var nodeModules = path.join('.', 'node_modules');

var mocha = path.join(nodeModules, '.bin', 'mocha');
var testDir = path.join(nodeModules, 'torusvis-tests', 'tests');

var tests = fs.readdirSync(testDir).map(function(x) {
    return path.join(testDir, x);
});

var com = mocha;
var comArgs = (
    [ '-u', 'tdd', '-R', 'spec', '--check-leaks' ]
    .concat(tests)
);

console.log(com + ' ' + comArgs.join(' '));

(
    childProcess.spawn(com, comArgs, { stdio: 'inherit' })
    .on('exit', function(code) {
        console.log('done');
    })
);

