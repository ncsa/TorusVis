
/*
 * Module: COLOR_TRANSFER_FUNCTIONS
 *
 * prepopulated collection of <LerpColorTransferFunctions>
 *
 * See also:
 *      - <LerpColorTransferFunction>
 */

"use strict";

var utils = require("../misc/utils");
var LerpColorTransferFunction = require("./LerpColorTransferFunction");

/* table of pre-configured linear color transfer functions */
function lctf(table) {
    var result = new LerpColorTransferFunction();
    var value, red, green, blue;

    utils.iter(table, function(entry, index) {
        switch(index % 4) {
            case 0:
                value = entry;
                break;
            case 1:
                red = entry;
                break;
            case 2:
                green = entry;
                break;
            case 3:
                blue = entry;
                result.setMarker(value, [red, green, blue]);
                break;
        }
    });

    return result;
}

/*
 * Variable: binary
 */

/*
 * Variable: hot
 */

/*
 * Variable: seismic
 */

var COLOR_TRANSFER_FUNCTIONS = {

    binary: lctf([
        0   , 1   , 1   , 1   ,
        1   , 0   , 0   , 0
    ]),

    hot: lctf([
        0   , 0   , 0   , 0   ,
        0.25, 0.47, 0   , 0   ,
        0.5 , 0.95, 0.45, 0   ,
        0.75, 1   , 1   , 0.5 ,
        1   , 1   , 1   , 1
    ]),

    seismic: lctf([
        0   , 0   , 0   , 1   ,
        0.5 , 1   , 1   , 1   ,
        1   , 1   , 0   , 0
    ])
};

module.exports = COLOR_TRANSFER_FUNCTIONS;

