
/*
 * File: noWebGLWarningBanner
 *
 * (*INTERNAL*)
 * feature module: function that produces a warning banner
 *
 * When called for the first time, and if no webGL support is detected,
 * this function produces a banner with a warning message.  Otherwise, it
 * does nothing.
 *
 * See:
 *     - <webGLSupport>
 *     - <three.js License>
 */

"use strict";

var FeatureDetector = require("../detector").FeatureDetector;

module.exports = (
    new FeatureDetector("noWebGLWarningBanner")
        .addGeneratorFunction(function() {
            var features = require("../features");
            var webGLSupported = features.isAvailable("webGLSupport");
            var webGLAvailable = features.isAvailable("webGLRendering");

            if(webGLAvailable) {
                return function(){}; /* no op */
            }

            var element = null;
            var link = null;

            var _global_ = features.get("global");

            /* TODO(opadron): come up with a better banner */
            function createElement() {
                if(Boolean(element)) { return; }

                element = _global_.document.createElement("div");
                element.id = "webgl-error-message";
                element.style.fontFamily = "monospace";
                element.style.fontSize = "13px";
                element.style.fontWeight = "normal";
                element.style.textAlign = "center";
                element.style.background = "#FF9696";
                element.style.width = "100%";

                var blameItOn = "browser";
                if(webGLSupported) {
                    blameItOn = "graphics card";
                }

                element.innerHTML += "<br>";
                element.innerHTML += [
                    [
                        "Your ", blameItOn, " does not seem to support ",
                        "<a href=\"http://khronos.org/",
                        "webgl/wiki/Getting_a_WebGL_Implementation\" ",
                        "style=\"color:#000\">WebGL</a>.<br/>"
                    ].join(""),
                    [
                        "Find out how to get it ",
                        "<a href=\"http://get.webgl.org/\" ",
                        "style=\"color:#000\">here</a>.<br>"
                    ].join("")
                ].join("\n");

                link = _global_.document.createElement("a");
                link.innerHTML = "(close)";
                link.href = "#";
                element.appendChild(link);

                return element;
            }

            function addGetWebGLMessage(args) {
                var parent, id, element;

                args = args || { };

                parent = _global_.document.body;
                if(!!args.parent) {
                    parent = args.parent;
                }

                id = "oldie";
                if(args.id !== undefined) {
                    parent = args.parent;
                }

                element = createElement();
                element.id = id;

                link.onclick = function() {
                    parent.removeChild(element);
                };

                parent.appendChild(element);
            }

            return addGetWebGLMessage;
        })

        .setException(new Error("noWebGL warning banner unavailable"))
);

