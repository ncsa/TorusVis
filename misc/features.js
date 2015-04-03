
/*
 * File: features
 *
 * (*INTERNAL*) collection of predefined features
 *
 * This module populates the global <FeatureDetectorRegistry> instance with a
 * number of features.
 *
 * None of the members documented in this module are directly accessible, but
 * instead represent <FeatureDetectors> that exist within the global
 * <FeatureDetectorRegistry> instance, and can only be queried through it.
 *
 * See:
 *     - <detector>
 */

"use strict";

var detector = require("./detector");

var features = new detector.FeatureDetectorRegistry();
features.require     = features.requireFeature;
features.get         = features.getFeature;
features.isAvailable = features.featureIsAvailable;
features.isNative    = features.featureIsNative;

features.addFeatureDetector(require("./features/canvasRendering"     ));
features.addFeatureDetector(require("./features/extend"              ));
features.addFeatureDetector(require("./features/global"              ));
features.addFeatureDetector(require("./features/isNull"              ));
features.addFeatureDetector(require("./features/isFunction"          ));
features.addFeatureDetector(require("./features/isString"            ));
features.addFeatureDetector(require("./features/isPlainObject"       ));
features.addFeatureDetector(require("./features/jquery"              ));
features.addFeatureDetector(require("./features/noWebGLWarningBanner"));
features.addFeatureDetector(require("./features/slice"               ));
features.addFeatureDetector(require("./features/threejs"             ));
features.addFeatureDetector(require("./features/threejsRenderer"     ));
features.addFeatureDetector(require("./features/urlArguments"        ));
features.addFeatureDetector(require("./features/webGLRendering"      ));
features.addFeatureDetector(require("./features/webGLSupport"        ));

module.exports = features;

