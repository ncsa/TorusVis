#! /usr/bin/env node

var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

var stubs = [];

[ 'jquery', 'three' ].forEach(function(x) {
    /* if an optional dependency is not available... */
    try { require(x); }

    /* ...generate a stub for it */
    catch(e) { stubs.push(x); }
});

stubs.forEach(function(x) {
    console.log('%s not found... generating stub', x);
});

var mkBuild = false;
try { mkBuild = ( !fs.statSync('build').isDirectory() ); }

catch(e) { mkBuild = true; }

if(mkBuild) { fs.mkdirSync('build'); }

var browserify = path.join('..', 'node_modules', '.bin', 'browserify');
var mapOutput = 'torusvis.min.map';
var minOutput = 'torusvis.min.js';
var noMinOutput = 'torusvis.js';

var comNoMin = [
    path.join('..', 'index.js'),
    '-s', 'torusvis', '-d',
    '-o', noMinOutput
];

var comMin = [
    path.join('..', 'index.js'),
    '-s', 'torusvis', '-d',
    '-p', '[', 'minifyify', '--map', mapOutput, '--output', mapOutput, ']',
    '-o', minOutput
];

stubs.forEach(function(x) {
    comNoMin.push('-i');
    comNoMin.push(x);

    comMin.push('-i');
    comMin.push(x);
});

process.chdir('build');

console.log(browserify + ' ' + comMin.join(' '));
(
    childProcess.spawn(browserify, comMin, { stdio: 'inherit' })
    .on('exit', function(code) {
        if(!code) {
            console.log(browserify + ' '+ comNoMin.join(' '));
            (
                childProcess.spawn(browserify, comNoMin, { stdio: 'inherit' })
                .on('exit', function(code2) {
                    if(!code2) {
                        console.log('done');
                    }
                })
            );
        }
    })
);

