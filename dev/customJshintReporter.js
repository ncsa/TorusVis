
/* custom jshint reporter (based on jshint-stylish by Sindre Sorhus) */

/*
 * The MIT License (MIT)
 *
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

"use strict";

var chalk = require("chalk");
var table = require("text-table");
var logSymbols = require("log-symbols");
var stringLength = require("string-length");

function pluralize(str, count) {
    return str + (count === 1 ? "" : "s");
}

module.exports = {
    reporter: function (oldResult, config, options) {
        var total = oldResult.length;
        var result = "";
        var headers = [];
        var prevfile;
        var errorCount = 0;
        var warningCount = 0;

        options = options || {};

        result += table(oldResult.reverse().map(function (el, i) {
            var err = el.error;

            // E: Error, W: Warning, I: Info
            var isError = err.code && err.code[0] === "E";

            var line = [
                el.file,
                [
                    chalk.gray(String(err.line || 1)),
                    ",",
                    chalk.gray([String(err.character || 1)])
                ].join(""),

                (
                    isError ? chalk.red(err.reason)
                    : process.platform !== "win32" ? chalk.blue(err.reason)
                    : chalk.cyan(err.reason)
                )
            ];

            if (el.file !== prevfile) {
                headers[i] = el.file;
            }

            if (options.verbose) {
                line.push(chalk.gray("(" + err.code + ")"));
            }

            if (isError) {
                errorCount++;
            } else {
                warningCount++;
            }

            prevfile = el.file;

            return line;

        }), { stringLength: stringLength }

        ).split("\n").map(function (el, i) {
            return headers[i] ? "\n" + el : el;

        }).join("\n") + "\n\n";

        if (total > 0) {
            if (errorCount > 0) {
                result += (
                    "  " +
                    logSymbols.error +
                    "  " +
                    errorCount +
                    pluralize(" error", errorCount) +
                    ( warningCount > 0 ? "\n" : "" )
                );
            }

            result += (
                "  " +
                logSymbols.warning +
                "  " +
                warningCount +
                pluralize(" warning", total)
            );

        } else {
            result += "  " + logSymbols.success + " No problems";
            result = "\n" + result.trim();
        }

        console.log(result + "\n");
    }
};

