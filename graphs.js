
/**
 * @defgroup torusvis_graphs graphs
 * @brief graph data structures
 * @ingroup torusvis
 */
module.exports = {
    AbstractGraph    : require("./graphs/AbstractGraph"   ),
    DirectedGraph    : require("./graphs/DirectedGraph"   ),
    EDGE_ORIENTATION : require("./graphs/EDGE_ORIENTATION"),
    FlatTorus        : require("./graphs/FlatTorus"       )
};

