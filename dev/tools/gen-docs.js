#! /usr/bin/env node

var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

var mkBuild = false;
try { mkBuild = ( !fs.statSync('build').isDirectory() ); }
catch(e) { mkBuild = true; }
if(mkBuild) { fs.mkdirSync('build'); }

function mergeTree(source, destination, callback) {
    var directoryList = [];
    var fileList = [];
    var directoryQueue = [source];
}

var docsCssFile = 'docs.css';
var inFileName = docsCssFile;
var outFileName = path.join('build', docsCssFile);
var fIn = fs.createReadStream(inFileName);
var fOut = fs.createWriteStream(outFileName);

fIn.on('open', function() {
    fOut.on('open', function() { fIn.pipe(fOut); });
});

var comArgs = [
    '-i', '.',
    '-xi', 'tags',
    '-xi', 'docs.css',
    '-xi', 'node_modules',
    '-xi', 'package.json',
    '-o', 'HTML', path.join('build', 'docs'),
    '-p', 'build',
    '-s', 'Default',
    '-s', 'docs'
];


fIn.on('end', function() {
    fOut.close();
});

fOut.on('end', function() {
    console.log('naturaldocs ', comArgs.join(' '));
    (
        childProcess.spawn('naturaldocs', comArgs, { stdio: 'inherit' })
        .on('exit', function(code) {
            if(!code) { console.log('success'); }
            process.exit(0);
        })
    );
});

