
/**
 * @file
 * @brief high-level output engine implementation producing a complete DOM
 *        element containing a threejs scene
 *
 * @sa @ref torusvis_misc.features.threejs
 */

"use strict";

var utils = require("../misc/utils");
var ThreeJSSceneNodeOutputEngine = require("./ThreeJSSceneNodeOutputEngine");
var features = require("../misc/features");

var threejs = features.get("threejs");
var threejsRenderer = features.get("threejsRenderer");
var noWebGLWarningBanner = features.require("noWebGLWarningBanner");
var globals = features.get("global");

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

/**
 * @class ThreeJSOutputEngine
 * @brief output engine producing a complete DOM element containing a threejs
 *        scene
 *
 * @details @ref ThreeJSOutputEngine "ThreeJSOutputEngines" produce complete DOM
 * elements which contain threejs scenes, including cameras, lights, mouse and
 * keyboard event listeners, and automatic WebGL support detection mechanisms.
 *
 * @extends ThreeJSSceneNodeOutputEngine
 *
 * @ingroup torusvis_engines
 */

/**
 * @fn ThreeJSOutputEngine(AbstractGraph graph, AbstractTopologyMapper mapper)
 *
 * @implements ThreeJSSceneNodeOutputEngine
 *
 * @memberof ThreeJSOutputEngine
 */
function ThreeJSOutputEngine(graph, mapper) {
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

    /**
     * @fn ThreeJSOutputEngine setContainerSize(Number width, Number height)
     * @brief set the size of the dom element containing this
     *        @ref ThreeJSOutputEngine "ThreeJSOutputEngine's" scene
     *
     * @param[in] width dom element width
     * @param[in] height dom element height
     *
     * @return ```this```
     *
     * @sa @ref render
     * @sa @ref update
     *
     * @memberof ThreeJSOutputEngine
     */
    setContainerSize:
    function setContainerSize(width, height) {
        var out = this.getOutput();

        out.renderer.setSize(width, height);
        out.camera.aspect = width/height;
        out.camera.updateProjectionMatrix();

        return this;
    },

    /**
     * @fn ThreeJSOutputEngine render()
     *
     * @brief convenience method that renders this
     *        @ref ThreeJSOutputEngine "ThreeJSOutputEngine's" scene using the
     *        produced renderer and canvas objects
     *
     * @return ```this```
     *
     * @sa @ref update
     *
     * @memberof ThreeJSOutputEngine
     */
    render:
    function render() {
        var out = this.getOutput();

        // out.composer.render();
        out.renderer.clear();
        // out.axes.visible = false;
        out.renderer.render(out.scene, out.camera);
        // out.renderer.render(out.axesScene, out.axesCamera);

        return this;
    },

    /**
     * @fn ThreeJSOutputEngine update()
     *
     * @implements ThreeJSSceneNodeOutputEngine
     *
     * @memberof ThreeJSOutputEngine
     */
    update:
    function update() {
        var out = this.getOutput();

        ThreeJSSceneNodeOutputEngine.prototype.update.apply(this, arguments);
        out.controls.update();

        return this;
    },

    /**
     * @fn void onControlChange()
     * @brief event handler that is callsed after panning, zooming, or rotating
     *        the view
     *
     * @memberof ThreeJSOutputEngine
     */
    onControlChange:
    function onControlChange() {
        var out = this.getOutput();

        out.axesCamera.rotation.copy(out.camera.rotation);
        out.axesCamera.updateProjectionMatrix();
        this.render();
    }
});

module.exports = ThreeJSOutputEngine;

