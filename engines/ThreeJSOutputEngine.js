
/*
 * File: ThreeJSOutputEngine
 *
 * high-level output engine implementation producing a complete DOM element
 * containing a threejs scene
 *
 * See also:
 *      - <threejs>
 */

"use strict";

var utils = require("../misc/utils");
var ThreeJSSceneNodeOutputEngine = require("./ThreeJSSceneNodeOutputEngine");
var features = require("../misc/features");

var threejs = features.get("threejs");
var threejsRenderer = features.get("threejsRenderer");
var noWebGLWarningBanner = features.require("noWebGLWarningBanner");
var globals = features.get("global");

/*
 * Function: _ThreeJSOutputEngineAddLights_
 *
 * (*INTERNAL*) adds a set of predefined lights to a <ThreeJSOutputEngine>'s
 * scene
 *
 * Parameters:
 *
 *     self - (*Object*) the <ThreeJSOutputEngine> to add lights to
 *
 * See also:
 *
 *      - <ThreeJSOutputEngine.constructor>
 */

function _ThreeJSOutputEngineAddLights_(self) {
    var out = self.getOutput();

    var lights = [
        new threejs.PointLight(  0xFFFFFF),
        new threejs.PointLight(  0x3333FF),
        new threejs.AmbientLight(0x202020)
    ];

    lights[0].position.set( 1.0,  1.0,  1.0).normalize().multiplyScalar(50);
    lights[1].position.set(-1.0, -1.0, -1.0).normalize().multiplyScalar(50);

    out.lights = lights;

    out.scene.add(lights[0]);
    out.scene.add(lights[1]);
    out.scene.add(lights[2]);
}

/*
 * Function: _ThreeJSOutputEngineAddCamera_
 *
 * (*INTERNAL*) adds a camera at a predefined location to a
 *              <ThreeJSOutputEngine>'s scene
 *
 * Parameters:
 *
 *     self - (*Object*) the <ThreeJSOutputEngine> to add the camera to
 *
 * See also:
 *
 *      - <ThreeJSOutputEngine.constructor>
 */
function _ThreeJSOutputEngineAddCamera_(self) {
    var out = self.getOutput();

    out.camera = new threejs.PerspectiveCamera(
          50.00, // fov
           1.00, // aspect ratio (assume 1:1, initially)
           0.01, // near cutoff
        1000.01  // far cutoff
    );

    out.scene.add(out.camera);

    /* clone main camera for axes scene camera */
    out.axesCamera = out.camera.clone();
    out.scene.add(out.axesCamera);
}

/*
 * Function: _ThreeJSOutputEngineAddRenderer_
 *
 * (*INTERNAL*) adds a predefined renderer to a <ThreeJSOutputEngine>
 *
 * Parameters:
 *
 *     self - (*Object*) the <ThreeJSOutputEngine> to add the renderer to
 *
 * See also:
 *
 *      - <ThreeJSOutputEngine.constructor>
 */
function _ThreeJSOutputEngineAddRenderer_(self) {
    var out = self.getOutput();

    /* create renderer */
    noWebGLWarningBanner();
    out.renderer = new threejsRenderer({
        preserveDrawingBuffer: true,
        clearAlpha: 1
    });
    out.renderer.autoClearColor = false;
    out.renderer.setClearColor(0x000000, 1);

    // make the canvas element focusable (necessary for keyboard events)
    out.renderer.domElement.tabIndex = 0;
    out.renderer.sortObjects = true;
    utils.extend(out.renderer.domElement.style, {
        position: "relative",
        width   : "100%",
        height  : "100%"
    });

    out.container = globals.document.createElement("div");
    out.container.appendChild(out.renderer.domElement);
}


/*
 * Function: _ThreeJSOutputEngineAddControls_
 *
 * (*INTERNAL*) adds predefined camera controls to a <ThreeJSOutputEngine>
 *
 * Parameters:
 *
 *     self - (*Object*) the <ThreeJSOutputEngine> to add the camera controls to
 *
 * See also:
 *
 *      - <ThreeJSOutputEngine.constructor>
 */
function _ThreeJSOutputEngineAddControls_(self) {
    var out = self.getOutput();

    out.controls = new threejs.OrbitControls(
        out.camera,
        out.renderer.domElement
    );

    out.controls.autoRotateSpeed = 5.0;

    (
        out.camera.position
            .copy(out.controls.target)
            .add(new threejs.Vector3(0, 0, 10))
    );

    out.axesCamera.position.set(0, 0, -10);

    out.controls.addEventListener("change", function() {
        self.onControlChange();
    });
}

/*
 * Function: _ThreeJSOutputEngineAddAxes_
 *
 * (*INTERNAL*) adds predefined set of axis objects to a <ThreeJSOutputEngine>
 *
 * Parameters:
 *
 *     self - (*Object*) the <ThreeJSOutputEngine> to add the axis objects to
 *
 * See also:
 *
 *      - <ThreeJSOutputEngine.constructor>
 */
function _ThreeJSOutputEngineAddAxes_(self) {
    var out = self.getOutput();

    var axes = new threejs.Object3D();
    var cylinderGeometry = new threejs.CylinderGeometry(1.0, 1.0, 1.0, 8, 3);
    var material = new threejs.MeshLambertMaterial();
    var colors = [ 0xFF0000, 0x00FF00, 0x0000FF ];
    var p0 = new threejs.Vector3(0, 0, 0);
    var p1 = new threejs.Vector3();

    for(var dimension=0; dimension<3; ++dimension) {
        material.color = colors[dimension];
        var mesh = new threejs.Mesh(cylinderGeometry, material);
        p1.copy(p0);
        p1.setComponent(dimension, 1.0);

        var arrow = new threejs.ArrowHelper(
            p1.clone().normalize(), p0
        );

        mesh.rotation.setFromQuaternion(arrow.quaternion);
        axes.add(mesh);
    }

    out.axes = axes;
}


/*
 * Class: ThreeJSOutputEngine
 *
 * output engine producing a complete DOM element containing a threejs scene
 *
 * <ThreeJSOutputEngines> produce complete DOM elements which contain threejs
 * scenes, including cameras, lights, mouse and keyboard event listeners, and
 * automatic WebGL support detection mechanisms.
 *
 * Extends:
 *      - <ThreeJSSceneNodeOutputEngine>
 */

/*
 * Constructor: constructor
 *
 * construct a new <ThreeJSOutputEngine>
 *
 * Extends:
 *      - <ThreeJSSceneNodeOutputEngine.constructor>
 */
function ThreeJSOutputEngine() {
    ThreeJSSceneNodeOutputEngine.apply(this, arguments);

    var out = this.getOutput();

    /* build main scene */
    out.scene = new threejs.Scene();
    out.scene.add(out.sceneNode);

    _ThreeJSOutputEngineAddLights_(this);
    _ThreeJSOutputEngineAddCamera_(this);
    _ThreeJSOutputEngineAddRenderer_(this);
    _ThreeJSOutputEngineAddControls_(this);
    _ThreeJSOutputEngineAddAxes_(this);

    this.update();
    out.controls.dispatchEvent({ type: "change" });
}

utils.extend(
    ThreeJSOutputEngine.prototype,
    ThreeJSSceneNodeOutputEngine.prototype
);

utils.extend(ThreeJSOutputEngine.prototype, {
    constructor: ThreeJSOutputEngine,

    setContainerSize:
    /*
     * Method: setContainerSize
     *
     * set the size of the dom element containing this <ThreeJSOutputEngine's>
     * scene
     *
     * Parameters:
     *     w - (*Number*) dom element width
     *     h - (*Number*) dom element height
     *
     * Returns:
     *      - (*<ThreeJSOutputEngine>*) *this*
     *
     * See also:
     *      - <render>
     *      - <update>
     */
    function setContainerSize(w, h) {
        var out = this.getOutput();

        out.renderer.setSize(w, h);
        out.camera.aspect = w/h;
        out.camera.updateProjectionMatrix();

        return this;
    },

    render:
    /*
     * Method: render
     *
     * convenience method that renders this <ThreeJSOutputEngine's> scene using
     * the produced renderer and canvas objects
     *
     * Returns:
     *      - (*<ThreeJSOutputEngine>*) *this*
     *
     * See also:
     *      - <update>
     */
    function render() {
        var out = this.getOutput();

        // out.composer.render();
        out.renderer.clear();
        // out.axes.visible = false;
        out.renderer.render(out.scene, out.camera);
        // out.renderer.render(out.axesScene, out.axesCamera);

        return this;
    },

    update:
    /*
     * Method: update
     *
     * Extends:
     *      - <GenericOutputEngine.update>
     */
    function update() {
        var out = this.getOutput();

        ThreeJSSceneNodeOutputEngine.prototype.update.apply(this, arguments);
        out.controls.update();

        return this;
    },

    onControlChange:
    /*
     * Method: onControlChange
     *
     * event handler that is callsed after panning, zooming, or rotating the
     * view
     */
    function onControlChange() {
        var out = this.getOutput();

        out.axesCamera.rotation.copy(out.camera.rotation);
        out.axesCamera.updateProjectionMatrix();
        this.render();
    }
});

module.exports = ThreeJSOutputEngine;

