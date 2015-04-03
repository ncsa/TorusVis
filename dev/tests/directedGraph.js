
"use strict";

var DirectedGraph = require("torusvis/graphs/DirectedGraph");
var EDGE_ORIENTATION = require("torusvis/graphs/EDGE_ORIENTATION");

var utils = require("torusvis/misc/utils");

module.exports = {
    DirectedGraph: (function() {
    /* jshint maxstatements: 70 */
    return function(test) {

        debugger;
        var nodes = { };
        var edges = { };
        var message;

        test.expect(292);

        /* create new DirectedGraph */
        var dGraph0 = new DirectedGraph();
        test.ok(dGraph0, "cannot create directed graph");

        /* add nodes */
        nodes.a = dGraph0.newNode({ label: "a" });
        nodes.b = dGraph0.newNode({ label: "b" });
        nodes.c = dGraph0.newNode({ label: "c" });
        nodes.d = dGraph0.newNode({ label: "d" });

        message = "cannot add new nodes";
        test.ok(!utils.isNull(nodes.a), message);
        test.ok(!utils.isNull(nodes.b), message);
        test.ok(!utils.isNull(nodes.c), message);
        test.ok(!utils.isNull(nodes.d), message);

        /* verify node data */
        message = "incorrect node data";
        test.equal(dGraph0.nodeData(nodes.a).label, "a", message);
        test.equal(dGraph0.nodeData(nodes.b).label, "b", message);
        test.equal(dGraph0.nodeData(nodes.c).label, "c", message);
        test.equal(dGraph0.nodeData(nodes.d).label, "d", message);

        /* add edges */

        /*
         *         [d]
         *       //   \
         *    .-[c]   | (<-reversed)
         *    v    \  v
         *   [a]    [b]-.
         *           ^--'
         */
        function newEdge() {
            return dGraph0.newEdge.apply(dGraph0, arguments);
        }

        edges.ca = newEdge(nodes.c, nodes.a, EDGE_ORIENTATION.DIRECTED);
        edges.cb = newEdge(nodes.c, nodes.b, EDGE_ORIENTATION.UNDIRECTED);
        edges.cd = newEdge(nodes.c, nodes.d, EDGE_ORIENTATION.BIDIRECTIONAL);
        edges.bd = newEdge(nodes.b, nodes.d, EDGE_ORIENTATION.REVERSED);
        edges.bb = newEdge(nodes.b, nodes.b, EDGE_ORIENTATION.DIRECTED);

        dGraph0.edgeData(edges.ca).label = "c->a";
        dGraph0.edgeData(edges.cb).label = "c--b";
        dGraph0.edgeData(edges.cd).label = "c==d";
        dGraph0.edgeData(edges.bd).label = "b<-d";
        dGraph0.edgeData(edges.bb).label = "b->b";

        message = "cannot add new edges";
        test.ok(!utils.isNull(edges.ca), message);
        test.ok(!utils.isNull(edges.cb), message);
        test.ok(!utils.isNull(edges.cd), message);
        test.ok(!utils.isNull(edges.bd), message);
        test.ok(!utils.isNull(edges.bb), message);

        /* verify edge data */
        message = "incorrect edge data";
        test.equal(dGraph0.edgeData(edges.ca).label, "c->a", message);
        test.equal(dGraph0.edgeData(edges.cb).label, "c--b", message);
        test.equal(dGraph0.edgeData(edges.cd).label, "c==d", message);
        test.equal(dGraph0.edgeData(edges.bd).label, "b<-d", message);
        test.equal(dGraph0.edgeData(edges.bb).label, "b->b", message);

        /* verify graph topology data */
        function dict() {
            var ret = {};
            var key, value;
            for(var i=0; i<arguments.length; ++i) {
                if(i%2 === 0) { key = arguments[i]; }
                else {
                    value = arguments[i];
                    ret[key] = value;
                }
            }

            return ret;
        }

        var topologyMap = dict(
            edges.ca, {
                orientation: EDGE_ORIENTATION.DIRECTED,
                source: nodes.c,
                destination: nodes.a,
                canonicalSources: [nodes.c],
                canonicalDestinations: [nodes.a],
                symmetricalSources: [nodes.c],
                symmetricalDestinations: [nodes.a],
                predicates: {
                    isIncidentEdge: dict(nodes.c, 1, nodes.a, 1),
                    isDirectedEdge: dict(nodes.c, 1, nodes.a, 1),
                    isCanonicallyDirectedEdge: dict(
                        nodes.c, 1,
                        nodes.a, 1
                    ),
                    isAsymmetricEdge: dict(nodes.c, 1, nodes.a, 1),

                    isInEdge: dict(nodes.a, 1),
                    isOutEdge: dict(nodes.c, 1),
                    isCanonicallyInEdge: dict(nodes.a, 1),
                    isCanonicallyOutEdge: dict(nodes.c, 1),
                    isSymmetricallyInEdge: dict(nodes.a, 1),
                    isSymmetricallyOutEdge: dict(nodes.c, 1)
                }
            },

            edges.cb, {
                orientation: EDGE_ORIENTATION.UNDIRECTED,
                source: nodes.c,
                destination: nodes.b,
                canonicalSources: [],
                canonicalDestinations: [],
                symmetricalSources: [nodes.c, nodes.b],
                symmetricalDestinations: [nodes.b, nodes.c],
                predicates: {
                    isIncidentEdge: dict(nodes.c, 1, nodes.b, 1),
                    isUndirectedEdge: dict(nodes.c, 1, nodes.b, 1),
                    isSymmetricEdge: dict(nodes.c, 1, nodes.b, 1),
                    isSymmetricallyInEdge: dict(nodes.c, 1, nodes.b, 1),
                    isSymmetricallyOutEdge: dict(nodes.c, 1, nodes.b, 1),

                    isInEdge: dict(nodes.b, 1),
                    isOutEdge: dict(nodes.c, 1),

                    isCanonicallyUndirectedEdge: dict(
                        nodes.c, 1, nodes.b, 1
                    )
                }
            },

            edges.cd, {
                orientation: EDGE_ORIENTATION.BIDIRECTIONAL,
                source: nodes.c,
                destination: nodes.d,
                canonicalSources: [nodes.c, nodes.d],
                canonicalDestinations: [nodes.d, nodes.c],
                symmetricalSources: [nodes.c, nodes.d],
                symmetricalDestinations: [nodes.d, nodes.c],
                predicates: {
                    isIncidentEdge: dict(nodes.c, 1, nodes.d, 1),
                    isBidirectionalEdge: dict(nodes.c, 1, nodes.d, 1),
                    isCanonicallyDirectedEdge: dict(
                        nodes.c, 1,
                        nodes.d, 1
                    ),
                    isSymmetricEdge: dict(nodes.c, 1, nodes.d, 1),
                    isCanonicallyInEdge: dict(nodes.c, 1, nodes.d, 1),
                    isCanonicallyOutEdge: dict(nodes.c, 1, nodes.d, 1),
                    isSymmetricallyInEdge: dict(nodes.c, 1, nodes.d, 1),
                    isSymmetricallyOutEdge: dict(nodes.c, 1, nodes.d, 1),

                    isInEdge: dict(nodes.d, 1),
                    isOutEdge: dict(nodes.c, 1)
                }
            },

            edges.bd, {
                orientation: EDGE_ORIENTATION.REVERSED,
                source: nodes.b,
                destination: nodes.d,
                canonicalSources: [nodes.d],
                canonicalDestinations: [nodes.b],
                symmetricalSources: [nodes.d],
                symmetricalDestinations: [nodes.b],
                predicates: {
                    isIncidentEdge: dict(nodes.b, 1, nodes.d, 1),
                    isReversedEdge: dict(nodes.b, 1, nodes.d, 1),
                    isCanonicallyDirectedEdge: dict(
                        nodes.b, 1,
                        nodes.d, 1
                    ),
                    isAsymmetricEdge: dict(nodes.b, 1, nodes.d, 1),

                    isInEdge: dict(nodes.d, 1),
                    isOutEdge: dict(nodes.b, 1),
                    isCanonicallyInEdge: dict(nodes.b, 1),
                    isCanonicallyOutEdge: dict(nodes.d, 1),
                    isSymmetricallyInEdge: dict(nodes.b, 1),
                    isSymmetricallyOutEdge: dict(nodes.d, 1)
                }
            },

            edges.bb, {
                orientation: EDGE_ORIENTATION.DIRECTED,
                source: nodes.b,
                destination: nodes.b,
                canonicalSources: [nodes.b],
                canonicalDestinations: [nodes.b],
                symmetricalSources: [nodes.b],
                symmetricalDestinations: [nodes.b],
                predicates: {
                    isIncidentEdge: dict(nodes.b, 1),
                    isSelfEdge: dict(nodes.b, 1),
                    isDirectedEdge: dict(nodes.b, 1),
                    isCanonicallyDirectedEdge: dict(nodes.b, 1),
                    isAsymmetricEdge: dict(nodes.b, 1),
                    isInEdge: dict(nodes.b, 1),
                    isOutEdge: dict(nodes.b, 1),
                    isCanonicallyInEdge: dict(nodes.b, 1),
                    isCanonicallyOutEdge: dict(nodes.b, 1),
                    isSymmetricallyInEdge: dict(nodes.b, 1),
                    isSymmetricallyOutEdge: dict(nodes.b, 1)
                }
            }
        );

        function testEdge(edgeId) {
            var e = topologyMap[edgeId];

            test.equal(
                dGraph0.edgeOrientation(edgeId),
                e.orientation,
                "orientation check failed"
            );

            test.equal(
                dGraph0.edgeSource(edgeId),
                e.source,
                "source check failed"
            );

            test.equal(
                dGraph0.edgeDestination(edgeId),
                e.destination,
                "destination check failed"
            );

            test.deepEqual(
                dGraph0.edgeCanonicalSources(edgeId),
                e.canonicalSources,
                "canonical sources check failed"
            );

            test.deepEqual(
                dGraph0.edgeCanonicalDestinations(edgeId),
                e.canonicalDestinations,
                "canonical destinations check failed"
            );

            test.deepEqual(
                dGraph0.edgeSymmetricalSources(edgeId),
                e.symmetricalSources,
                "symmetrical sources check failed"
            );

            test.deepEqual(
                dGraph0.edgeSymmetricalDestinations(edgeId),
                e.symmetricalDestinations,
                "symmetrical destinations check failed"
            );

            utils.iter(e.predicates, function(nodeSet, key) {
                var predicate = DirectedGraph.prototype[key];

                utils.iter(nodes, function(nodeId, label) {
                    var presumption = ( nodeId in nodeSet );
                    var result = predicate.apply(dGraph0, [edgeId, nodeId]);

                    test.equal(
                        presumption,
                        result,
                        "predicate check failed"                    + "\n" +
                        "  pred: " + key                            + "\n" +
                        "  edge: " + dGraph0.edgeData(edgeId).label + "\n" +
                        "  node: " + dGraph0.nodeData(nodeId).label + "\n" +
                        ""                                          + "\n" +
                        "  expected: " + presumption                + "\n" +
                        "  result  : " + result                     + "\n" +
                        ""
                    );
                });
            });
        }

        utils.iter(topologyMap, function(_, edgeId) {
            testEdge(edgeId);
        });

        /* iter nodes */
        var nodeCounts, edgeCounts, neighborCounts;
        nodeCounts = dict(
            nodes.a, 0,
            nodes.b, 0,
            nodes.c, 0,
            nodes.d, 0
        );

        dGraph0.iterNodes(function(nodeId) {
            test.ok(!utils.isNull(nodeId), "invalid node ID");
            test.ok(nodeId in nodeCounts, "invalid edge ID");
            ++nodeCounts[nodeId];
        });

        /* verify iter nodes */
        var numberOfVisitedNodes = 0;
        utils.iter(nodeCounts, function(count) {
            test.equal(count, 1, "incorrect node count");
            ++numberOfVisitedNodes;
        });

        test.equal(numberOfVisitedNodes, 4, "incorrect number of nodes");

        /* iter edges */
        edgeCounts = dict(
            edges.ca, 0,
            edges.cb, 0,
            edges.cd, 0,
            edges.bd, 0,
            edges.bb, 0
        );

        dGraph0.iterEdges(function(edgeId) {
            test.ok(!utils.isNull(edgeId), "invalid edge ID");
            test.ok(edgeId in edgeCounts, "invalid edge ID");
            ++edgeCounts[edgeId];
        });

        /* verify iter edges */
        var numberOfVisitedEdges = 0;
        utils.iter(edgeCounts, function(count) {
            test.equal(count, 1, "incorrect edge count");
            ++numberOfVisitedEdges;
        });

        test.equal(numberOfVisitedEdges, 5, "incorrect number of edges");

        /* iter neighbors */
        neighborCounts = dict(
            nodes.a, 0,
            nodes.b, 0,
            nodes.d, 0
        );

        dGraph0.iterEdges(nodes.c, function(edgeId) {
            test.ok(!utils.isNull(edgeId), "invalid edge ID");

            var neighborId = dGraph0.nodeNeighbor(nodes.c, edgeId);
            test.ok(!utils.isNull(neighborId), "invalid neighbor ID");

            test.ok(
                neighborId in neighborCounts,
                "invalid neighbor ID"
            );

            ++neighborCounts[neighborId];
        });

        /* verify iter neighbors */
        var numberOfVisitedNeighbors = 0;
        utils.iter(neighborCounts, function(count) {
            test.equal(count, 1, "incorrect neighbor count");
            ++numberOfVisitedNeighbors;
        });

        test.equal(
            numberOfVisitedNeighbors,
            3,
            "incorrect number of neighbors"
        );

        test.done();
    };
    })()
};

