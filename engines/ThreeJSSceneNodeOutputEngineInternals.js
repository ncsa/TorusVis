
/** @file */

"use strict";

var utils = require("../misc/utils");
var features = require("../misc/features");

var threejs = features.get("threejs");

var _private_ = {
    updateNodeGroupGeometrySprites:
    function updateNodeGroupGeometrySprites(self, nodeGroup, cacheEntry) {
        var displayOptions = nodeGroup.displayOptions;

        var geometry = new threejs.Geometry();
        var colorBy = Boolean(displayOptions.colorBy);

        var colorMap;
        if(colorBy) { colorMap = displayOptions.colorMap; }

        nodeGroup.iterItems(function(nodeHandle) {
            var coords = self.mapper.graphNodeToPosition(
                self.graph,
                nodeHandle
            );

            geometry.vertices.push(new threejs.Vector3(
                coords[0],
                coords[1],
                coords[2]
            ));

            if(colorBy) {
                var scalar = Number(
                    self.graph.nodeData(nodeHandle)[displayOptions.colorBy]
                );

                var color = colorMap.computeColor(scalar);
                color = new threejs.Color(color[0], color[1], color[2]);
                geometry.colors.push(color);
            }
        });

        if(colorBy) { geometry.colorsNeedUpdate = true; }

        return geometry;
    },

    updateNodeGroupGeometrySpheres:
    function updateNodeGroupGeometrySpheres(self, nodeGroup, cacheEntry) {
        var displayOptions = nodeGroup.displayOptions;
        var displayMode = nodeGroup.displayMode;

        var geometry = new threejs.Geometry();
        var colorBy = Boolean(displayOptions.colorBy);

        var colorMap;
        if(colorBy) { colorMap = displayOptions.colorMap; }

        var mesh = new threejs.Mesh(
            new threejs.SphereGeometry(
                displayOptions.size,
                displayOptions.phiSegments,
                displayOptions.thetaSegments,
                displayOptions.phiStart,
                displayOptions.phiLength,
                displayOptions.thetaStart,
                displayOptions.thetaLength
            )
        );

        nodeGroup.iterItems(function(nodeHandle) {
            /* TODO(opadron): implement color mapping */
            var coords = self.mapper.graphNodeToPosition(
                self.graph,
                nodeHandle
            );

            mesh.position.set(coords[0], coords[1], coords[2]);
            mesh.updateMatrix();
            threejs.GeometryUtils.merge(geometry, mesh);
        });

        /* if(colorBy) { geometry.colorsNeedUpdate = true; } */

        return geometry;
    },

    updateNodeGroupGeometry:
    function updateNodeGroupGeometry(self, groupName) {
        var cacheEntry = self.getNodeGroupCache(groupName);

        if(Boolean(cacheEntry.geometry)) { return; }

        var nodeGroup = self.getNodeGroup(groupName);
        var vTable = {
            "sprite": "updateNodeGroupGeometrySprites",
            "sphere": "updateNodeGroupGeometrySpheres"
        };

        var displayMode = nodeGroup.displayMode;
        if(!(displayMode in vTable)) { displayMode = "sprite"; }

        var implementation = _private_[vTable[displayMode]];

        cacheEntry.geometry = implementation(self, nodeGroup, cacheEntry);
        delete cacheEntry.actor;
    },

    updateNodeGroupMaterialSprites:
    function updateNodeGroupMaterialSprites(self, nodeGroup, cacheEntry) {
        var displayOptions = nodeGroup.displayOptions;
        var colorBy = Boolean(displayOptions.colorBy);

        var materialOptions = utils.extend(
            { sizeAttenuation: true, alphaTest: 0.5 },
            displayOptions
        );

        materialOptions.transparent = (materialOptions.opacity < 1.00);

        if(materialOptions.transparent) {
            materialOptions.depthWrite = true;
        } else {
            delete materialOptions.opacity;
        }

        if(colorBy) { materialOptions.vertexColors = true; }

        var material = new threejs.ParticleBasicMaterial(materialOptions);
        return material;
    },

    updateNodeGroupMaterialSpheres:
    function updateNodeGroupMaterialSpheres(self, nodeGroup, cacheEntry) {
        var displayOptions = nodeGroup.displayOptions;
        var colorBy = Boolean(displayOptions.colorBy);

        var materialOptions = utils.extend(
            { ambient: 0x000000 },
            displayOptions
        );
        materialOptions.transparent = (materialOptions.opacity < 1.00);

        var material = new threejs.MeshLambertMaterial(materialOptions);
        return material;
    },

    updateNodeGroupMaterial:
    function updateNodeGroupMaterial(self, groupName) {
        var cacheEntry = self.getNodeGroupCache(groupName);

        if(Boolean(cacheEntry.material)) { return; }

        var nodeGroup = self.getNodeGroup(groupName);
        var vTable = {
            "sprite": "updateNodeGroupMaterialSprites",
            "sphere": "updateNodeGroupMaterialSpheres"
        };

        var displayMode = nodeGroup.displayMode;
        if(!(displayMode in vTable)) { displayMode = "sprite"; }

        var implementation = _private_[vTable[displayMode]];

        cacheEntry.material = implementation(self, nodeGroup, cacheEntry);
        delete cacheEntry.actor;
    },

    updateNodeGroupActorSprites:
    function updateNodeGroupActorSprites(self, nodeGroup, cacheEntry) {
        var actor = new threejs.ParticleSystem(
            cacheEntry.geometry,
            cacheEntry.material
        );

        if(cacheEntry.material.transparent) { actor.sortParticles = true; }

        return actor;
    },

    updateNodeGroupActorSpheres:
    function updateNodeGroupActorSpheres(self, nodeGroup, cacheEntry) {
        var actor = new threejs.Mesh(
            cacheEntry.geometry,
            cacheEntry.material
        );

        return actor;
    },

    updateNodeGroupActor:
    function updateNodeGroupActor(self, groupName) {
        var cacheEntry = self.getNodeGroupCache(groupName);

        if(Boolean(cacheEntry.actor)) { return; }

        var oldActor = self.getOldNodeGroupCache(groupName).actor;
        var sceneNode = self.getOutput().sceneNode;

        if(Boolean(oldActor)) { sceneNode.remove(oldActor); }

        var nodeGroup = self.getNodeGroup(groupName);
        var vTable = {
            "sprite": "updateNodeGroupActorSprites",
            "sphere": "updateNodeGroupActorSpheres"
        };

        var displayMode = nodeGroup.displayMode;
        if(!(displayMode in vTable)) { displayMode = "sprite"; }

        var implementation = _private_[vTable[displayMode]];

        cacheEntry.actor = implementation(self, nodeGroup, cacheEntry);

        sceneNode.add(cacheEntry.actor);
    },

    updateEdgeGroupGeometryLines:
    function updateEdgeGroupGeometryLines(self, edgeGroup, cacheEntry) {
        var displayOptions = edgeGroup.displayOptions;
        var displayMode = edgeGroup.displayMode;

        var geometry = new threejs.Geometry();
        var colorBy = Boolean(displayOptions.colorBy);
        var colorMap;
        if(colorBy) {
            colorMap = displayOptions.colorMap;
        }

        edgeGroup.iterItems(function(edgeHandle) {
            var path = self.mapper.graphEdgeToPath(self.graph, edgeHandle);

            var color;
            if(colorBy) {
                var scalar = Number(
                    self.graph.edgeData(edgeHandle)[displayOptions.colorBy]
                );

                color = colorMap.computeColor(scalar);
                color = new threejs.Color(color[0], color[1], color[2]);
            }

            var p0 = null, p1 = null;

            utils.iter(path, function(p) {
                if(utils.isNull(p)) {
                    p0 = null;
                    return;
                }

                if(utils.isNull(p0)) {
                    p0 = new threejs.Vector3(p[0], p[1], p[2]);

                } else {
                    p1 = new threejs.Vector3(p[0], p[1], p[2]);
                    geometry.vertices.push(p0);
                    geometry.vertices.push(p1);

                    if(colorBy) {
                        geometry.colors.push(color);
                        geometry.colors.push(color);
                    }

                    p0 = p1;
                }
            });
        });

        if(colorBy) {
            geometry.colorsNeedUpdate = true;
        }

        return geometry;
    },

    updateEdgeGroupGeometryCylinders:
    function updateEdgeGroupGeometryCylinders(self, edgeGroup, cacheEntry) {
        var displayOptions = edgeGroup.displayOptions;
        var displayMode = edgeGroup.displayMode;

        var geometry = new threejs.Geometry();

        /* TODO(opadron) implement color mapping */
        /* var colorBy = Boolean(displayOptions.colorBy); */

        edgeGroup.iterItems(function(edgeHandle) {
            var path = self.mapper.graphEdgeToPath(self.graph, edgeHandle);
            var p0 = null, p1 = null;

            utils.iter(path, function(p) {
                if(utils.isNull(p)) {
                    p0 = null;
                    return;
                }

                if(utils.isNull(p0)) {
                    p0 = new threejs.Vector3(p[0], p[1], p[2]);

                } else {
                    p1 = new threejs.Vector3(p[0], p[1], p[2]);
                    var direction = (
                        new threejs.Vector3().subVectors(p1, p0)
                    );

                    var arrow = new threejs.ArrowHelper(
                        direction.clone().normalize(), p0
                    );

                    var mesh = new threejs.Mesh(
                        new threejs.CylinderGeometry(
                            displayOptions.size,
                            displayOptions.size,
                            direction.length(),
                            displayOptions.thetaSegments,
                            displayOptions.heightSegments,
                            true
                        )
                    );

                    mesh.rotation.setFromQuaternion(arrow.quaternion);
                    mesh.position = (
                        new threejs.Vector3()
                            .addVectors(p0, direction.multiplyScalar(0.5))
                    );

                    mesh.updateMatrix();
                    threejs.GeometryUtils.merge(geometry, mesh);

                    p0 = p1;
                }
            });
        });

        /* if(colorBy) { geometry.colorsNeedUpdate = true; } */

        return geometry;
    },

    updateEdgeGroupGeometryArrows:
    function updateEdgeGroupGeometryArrows(self, edgeGroup, cacheEntry) {
        /* TODO(opadron) implement arrows */

        /*
         * (just do cylinders, for now)
         */
        return (
            _private_.updateEdgeGroupGeometryCylinders.apply(null, arguments)
        );
    },

    updateEdgeGroupGeometry:
    function updateEdgeGroupGeometry(self, groupName) {
        var cacheEntry = self.getEdgeGroupCache(groupName);

        if(Boolean(cacheEntry.geometry)) { return; }

        var edgeGroup = self.getEdgeGroup(groupName);
        var vTable = {
            "line": "updateEdgeGroupGeometryLines",
            "cylinder": "updateEdgeGroupGeometryCylinders",
            "arrow": "updateEdgeGroupGeometryArrows"
        };

        var displayMode = edgeGroup.displayMode;
        if(!(displayMode in vTable)) { displayMode = "line"; }

        var implementation = _private_[vTable[displayMode]];

        cacheEntry.geometry = implementation(self, edgeGroup, cacheEntry);
        delete cacheEntry.actor;
    },

    updateEdgeGroupMaterialLines:
    function updateEdgeGroupMaterialLines(self, edgeGroup, cacheEntry) {
        var displayOptions = edgeGroup.displayOptions;
        var materialOptions = utils.extend({}, displayOptions);
        materialOptions.transparent = (displayOptions.opacity < 1.00);

        if(materialOptions.transparent) {
            materialOptions.depthWrite = true;
        } else {
            delete materialOptions.opacity;
        }

        if(materialOptions.colorBy) { materialOptions.vertexColors = true; }

        materialOptions.linewidth = utils.objectPop(materialOptions, "size")[1];
        var material = new threejs.LineBasicMaterial(materialOptions);
        return material;
    },

    updateEdgeGroupMaterialCylinders:
    function updateEdgeGroupMaterialCylinders(self, edgeGroup, cacheEntry) {
        var displayOptions = edgeGroup.displayOptions;
        var materialOptions = utils.extend(
            { ambient: 0x000000 },
            displayOptions
        );

        materialOptions.transparent = (displayOptions.opacity < 1.00);

        if(materialOptions.transparent) {
            materialOptions.depthWrite = true;
        } else {
            delete materialOptions.opacity;
        }

        var material = new threejs.MeshLambertMaterial(materialOptions);
        return material;
    },

    updateEdgeGroupMaterialArrows:
    function updateEdgeGroupMaterialArrows(self, edgeGroup, cacheEntry) {
        /* TODO(opadron) implement arrows */

        /*
         * (just do cylinders, for now)
         */
        return (
            _private_.updateEdgeGroupMaterialCylinders.apply(null, arguments)
        );
    },

    updateEdgeGroupMaterial:
    function updateEdgeGroupMaterial(self, groupName) {
        var cacheEntry = self.getEdgeGroupCache(groupName);

        if(Boolean(cacheEntry.material)) { return; }

        var edgeGroup = self.getEdgeGroup(groupName);
        var vTable = {
            "line": "updateEdgeGroupMaterialLines",
            "cylinder": "updateEdgeGroupMaterialCylinders",
            "arrow": "updateEdgeGroupMaterialArrows"
        };

        var displayMode = edgeGroup.displayMode;
        if(!(displayMode in vTable)) { displayMode = "line"; }

        var implementation = _private_[vTable[displayMode]];

        cacheEntry.material = implementation(self, edgeGroup, cacheEntry);
        delete cacheEntry.actor;
    },

    updateEdgeGroupActorLines:
    function updateEdgeGroupActorLines(self, edgeGroup, cacheEntry) {
        var lineType = threejs.LinePieces;
        if(cacheEntry.geometry.piecewiseContinuous) {
            lineType = threejs.LineStrip;
        }

        var actor = new threejs.Line(
            cacheEntry.geometry,
            cacheEntry.material,
            threejs.LinePieces
        );

        return actor;
    },

    updateEdgeGroupActorCylinders:
    function updateEdgeGroupActorCylinders(self, edgeGroup, cacheEntry) {
        var actor = new threejs.Mesh(
            cacheEntry.geometry,
            cacheEntry.material
        );

        return actor;
    },

    updateEdgeGroupActorArrows:
    function updateEdgeGroupActorArrows(self, edgeGroup, cacheEntry) {
        /* TODO(opadron) implement arrows */

        /*
         * (just do cylinders, for now)
         */
        return (
            _private_.updateEdgeGroupActorCylinders.apply(null, arguments)
        );
    },

    updateEdgeGroupActor:
    function updateEdgeGroupActor(self, groupName) {
        var cacheEntry = self.getEdgeGroupCache(groupName);

        if(Boolean(cacheEntry.actor)) { return; }

        var oldActor = self.getOldEdgeGroupCache(groupName).actor;
        var sceneNode = self.getOutput().sceneNode;

        if(Boolean(oldActor)) { sceneNode.remove(oldActor); }

        var edgeGroup = self.edgeGroups[groupName];
        var vTable = {
            "line": "updateEdgeGroupActorLines",
            "cylinder": "updateEdgeGroupActorCylinders",
            "arrow": "updateEdgeGroupActorArrows"
        };

        var displayMode = edgeGroup.displayMode;
        if(!(displayMode in vTable)) { displayMode = "line"; }

        var implementation = _private_[vTable[displayMode]];

        cacheEntry.actor = implementation(self, edgeGroup, cacheEntry);

        sceneNode.add(cacheEntry.actor);

    }
};

module.exports = _private_;

