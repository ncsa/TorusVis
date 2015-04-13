#!/usr/bin/env node

var fs = require("fs")
function writeLine(line) {
    line = line || "";
    process.stdout.write(line);
    process.stdout.write("\n");
}

fs.readFile(process.argv[2], 'utf8', function (err, data) {
    var docStart = /^\s*\/\*\*$/;
    var docEnd = /^\s*\*\/$/;
    var docInline = /^\s*\/\*\*(.*)\*\/$/;

    var inCommentBlock = false;
    data.split("\n").forEach(function(line) {
        var m;

        if(inCommentBlock) {
            writeLine(line);
            m = line.match(docEnd);
            if(m) {
                inCommentBlock = false;
            }
            return;
        }

        m = line.match(docInline);
        if(m) {
            writeLine(line);
            return;
        }

        m = line.match(docStart);
        if(m) {
            writeLine(line);
            inCommentBlock = true;
            return;
        }

        writeLine();
    });

    writeLine();
});
