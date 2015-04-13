
/**
 * @defgroup torusvis_mappers mappers
 * @brief topology mapper specification and implementations
 * @ingroup torusvis
 */
module.exports = {
    AbstractTopologyMapper:
        require("./mappers/AbstractTopologyMapper"        ),
    DirectTopologyMapper:
        require("./mappers/DirectTopologyMapper"          ),
    FlatTorusTopologyMapper:
        require("./mappers/FlatTorusTopologyMapper"       ),
    PeriodicBoundaryTopologyMapper:
        require("./mappers/PeriodicBoundaryTopologyMapper")
};

