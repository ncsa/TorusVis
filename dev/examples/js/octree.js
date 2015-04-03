
/*
 * construct an octree from a list of points
 *
 * recursively subdivides the group of points such that no group contains more
 * than [maxN] points
 */
function octree(points, maxN) {

    /*
     * base case:
     *
     * if the number of points in the list is below [maxN], nothing needs to be
     * done
     */
    if(points.length <= maxN) {
        return points;
    }

    /* otherwise, compute the centroid of the list of points... */
    var ret = { };
    var m = [0.0, 0.0, 0.0];
    for(var i in points) {
        var p = points[i];
        m[0] += p[0];
        m[1] += p[1];
        m[2] += p[2];
    }

    m[0] /= points.length;
    m[1] /= points.length;
    m[2] /= points.length;

    /* ...and use it to divide the list into as many as 8 groups */
    for(var i in points) {
        var p = points[i];
        var key = 0;
        if(p[0] > m[0]) { key += (1 << 0); }
        if(p[1] > m[1]) { key += (1 << 1); }
        if(p[2] > m[2]) { key += (1 << 2); }

        var group = ret[key] = (ret[key] || new Array());
        group.push(p);
    }

    /* finally, recursively construct a suboctree from each group */
    for(var key in ret) {
        ret[key] = octree(ret[key], maxN);
    }

    return ret;
}

