#! /usr/bin/env node

var fs = require('fs');

var errno;
try {
    errno = require('errno');
} catch(e) { }

symbolList = [];
symbolSet = {};

function addSymbol(x) {
    if(x in symbolSet) {
        return;
    }

    symbolList.push(x);
    symbolSet[x] = true;
}

function checkKey(key) {
    var n = key.length;
    if(n<1) return false;
    if(!(
        ('a' <= key[0] && key[0] <= 'z') ||
        ('A' <= key[0] && key[0] <= 'Z') ||
        (key[0] == '_')
    )) {
        return false;
    }

    for(var i=1; i<n; ++i) {
        if(!(
            ('a' <= key[i] && key[i] <= 'z') ||
            ('A' <= key[i] && key[i] <= 'Z') ||
            ('0' <= key[i] && key[i] <= '9') ||
            (key[i] == '_') || (key[i] == '.')
        )) {
            return false;
        }
    }

    return true;
}

function traverseObject(root, prefix) {
    if(!prefix) prefix = '';
    var tmp = [root, root.prototype];
    for(var tmp_i in tmp) {
        root = tmp[tmp_i];
        if(!root) continue;
        for(var key in root) {
            if(!checkKey(key)) continue;
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
                traverseObject(value, prefix + key + '.');
            }
        }
    }
}

var torusvis = require('../../../index');
traverseObject({ torusvis: torusvis });

symbolList.sort();
symbolList.push('');

fs.writeFileSync('tags', (
    [
        '!_TAG_FILE_FORMAT\t2\t/extended format; --format=1 will not append ;" to lines/',
        '!_TAG_FILE_SORTED\t1\t/0=unsorted, 1=sorted, 2=foldcase/'
    ].join('\n') +
    '\n'         +
    symbolList.join(
        ['', 'index.js', 'goto' + '\n'].join('\t')
    )
));

