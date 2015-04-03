
"use strict";

var fs = require("fs");

var errno;
try {
    errno = require("errno");
} catch(e) { }

var symbolList = [];
var symbolSet = {};

var torusvis;

function addSymbol(x) {
    if(x in symbolSet) {
        return;
    }

    symbolList.push(x);
    symbolSet[x] = true;
}

function checkKey(key) {
    var n = key.length;
    for(var i=0; i<n; ++i) {
        var characterIsValid = (
            ("a" <= key[i] && key[i] <= "z") ||
            ("A" <= key[i] && key[i] <= "Z") ||
            (key[i] === "_") ||
            (
                i === 0 &&
                (
                    ("0" <= key[i] && key[i] <= "9") ||
                    (key[i] === ".")
                )
            )
        );

        if(!characterIsValid) {
            return false;
        }
    }

    return (n > 0);
}

function traverseObject(root, prefix) {
    if(!Boolean(prefix)) {
        prefix = "";
    }

    var tmp = [root, root.prototype];
    Object.keys(tmp).forEach(function(tmpI) {
        root = tmp[tmpI];

        if(!Boolean(root)) {
            return;
        }

        Object.keys(root).forEach(function(key) {
            if(!Boolean(checkKey(key))) {
                return;
            }

            var value = root[key];
            addSymbol(key);
            addSymbol(prefix + key);
            if(
                value !== null      &&
                value !== undefined &&
                (
                    torusvis.misc.utils.isPlainObject(value) ||
                    (!!(value.prototype))
                )
            ) {
                traverseObject(value, prefix + key + ".");
            }
        });
    });
}

module.exports = function(grunt, config) {
    grunt.registerTask("tags", function() {
	torusvis = require("torusvis");
        traverseObject({ torusvis: torusvis });

        var numSymbols = symbolList.length;

        symbolList.sort();
        symbolList.push("");

        fs.writeFileSync("tags", [
            [
                "!_TAG_FILE_FORMAT\t2\t/extended format;",
                "--format=1 will not append ;\" to lines/"
            ].join(" "),

            [
                "!_TAG_FILE_SORTED\t1\t/0=unsorted, 1=sorted,",
                "2=foldcase/"
            ].join(" "),

            "",

            symbolList.join(
                ["", "index.js", "goto" + "\n"].join("\t")
            )
        ].join("\n"));

        grunt.log.write("generated ");
        grunt.log.write(String(numSymbols));
        grunt.log.write(" tag");
        if(numSymbols !== 1) {
            grunt.log.write("s");
        }
        grunt.log.writeln(".");
    });
};

