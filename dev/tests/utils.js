
"use strict";

var utils = require("torusvis/misc/utils");

module.exports = {
    utils: {
        orderedMap: (function() {
        /* jshint maxstatements: 30 */
        return function(test) {
            test.expect(48);
            var map;
            var keyOrder = ["a", "b", "f", "g", "h", "2"];

            /* create */
            map = new utils.OrderedMap();
            test.ok(map, "cannot create OrderedMap");

            /* set */
            utils.iter(keyOrder, function(key) {
                map.set(key, {value: key});
                test.ok(map.map[key], "cannot set values in OrderedMap");
            });

            /* verify set */
            utils.iter(keyOrder, function(key) {
                test.strictEqual(
                    map.map[key].value,
                    key,
                    "incorrect values in OrderedMap"
                );
            });

            var values;
            var get;
            var n;
            var i;

            /* get by key */
            values = [];
            utils.iter(keyOrder, function(key) {
                get = map.get(key);
                test.ok(get, "cannot get values in OrderedMap");
                values.push(get);
            });

            /* verify get by key */
            utils.iter(keyOrder, function(key, i) {
                test.strictEqual(
                    values[i].value,
                    keyOrder[i],
                    "incorrect values in OrderedMap"
                );
            });

            /* get by index */
            values = [];
            n = map.length();
            for(i=0; i<n; ++i) {
                get = map.get(i);
                test.ok(get, "cannot get values in OrderedMap");
                values.push(get);
            }

            /* verify get by index */
            for(i=0; i<n; ++i) {
                test.strictEqual(
                    values[i].value,
                    keyOrder[i],
                    "incorrect values in OrderedMap"
                );
            }

            /* verify key order */
            /* TODO(opadron) convert this to use the ordered map's iterator */
            utils.iter(map.keys(), function(key, index) {
                test.strictEqual(
                    key,
                    keyOrder[index],
                    "incorrect key order"
                );
            });

            map.unset(2);
            keyOrder = keyOrder.concat(keyOrder.splice(2).slice(1));
            utils.iter(map.keys(), function(key, index) {
                test.strictEqual(
                    key,
                    keyOrder[index],
                    "incorrect key order after removing keys"
                );
            });

            test.done();
        };
        })()
    }
};

