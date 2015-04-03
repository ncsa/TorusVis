
(function(require, exports) {

function kMeans3(means, points, meanDiffTolerance, maxIterations) {
    if(arguments.length < 3) {
        meanDiffTolerance = 0.01;
    }
    meanDiffTolerance *= meanDiffTolerance;

    var k = means.length,
        n = points.length;

    var m = new Array(k);
    var om = new Array(k);
    for(var i=0; i<k; ++i) {
        m[i] = [
            means[i][0],
            means[i][1],
            means[i][2]
        ];
    }

    var ret = new Array(k);

    for(
        var iter=0;
        (!maxIterations || iter < maxIterations);
        ++iter
    ) {
        for(var i=0; i<k; ++i) {
            ret[i] = [];
        }

        for(var i=0; i<n; ++i) {
            var minK, minDelta;
            for(var j=0; j<k; ++j) {
                var diffs = [
                    points[i][0] - m[j][0],
                    points[i][1] - m[j][1],
                    points[i][2] - m[j][2]
                ];

                var delta = Math.sqrt(
                    diffs[0]*diffs[0] + 
                    diffs[1]*diffs[1] + 
                    diffs[2]*diffs[2]
                );

                if(
                    j==0 ||
                    delta < minDelta
                ) {
                    minK = j;
                    minDelta = delta;
                }
            }

            ret[minK].push(i);
        }

        var meanDiff = 0.0;
        for(var i=0; i<k; ++i) {
            om[i] = [
                m[i][0],
                m[i][1],
                m[i][2]
            ];

            m[i][0] = 0.0;
            m[i][1] = 0.0;
            m[i][2] = 0.0;

            for(var j in ret[i]) {
                var p = points[ret[i][j]];
                m[i][0] += p[0];
                m[i][1] += p[1];
                m[i][2] += p[2];
            }

            m[i][0] /= ret[i].length;
            m[i][1] /= ret[i].length;
            m[i][2] /= ret[i].length;

            var diffs = [
                (om[i][0] - m[i][0])/om[i][0],
                (om[i][1] - m[i][1])/om[i][1],
                (om[i][2] - m[i][2])/om[i][2]
            ];

            meanDiff += (
                diffs[0]*diffs[0] + 
                diffs[1]*diffs[1] + 
                diffs[2]*diffs[2]
            )
        }

        meanDiff /= k;
        if(meanDiff < meanDiffTolerance) {
            break;
        }
    }

    return {
        sets: ret,
        centroids: m
    };
};

exports.kMeans3 = kMeans3;

})(
    (typeof require !== "undefined" ? require : function () {}),
    (typeof exports !== "undefined" ? exports : (window))
);

