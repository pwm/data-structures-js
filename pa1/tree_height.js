(function() { 'use strict';

    function computeHeightLinear(tree) {
        var maxHeight = 0;
        var treeSize = tree.length;
        for (var vertex = 0; vertex < treeSize; vertex++) {
            var height = 0;
            for (var i = vertex; i != -1; i = tree[i].key) {
                if (tree[i].height !== null) {
                    height += tree[i].height;
                    break;
                }
                height++;
            }
            tree[vertex].height = height;
            maxHeight = Math.max(maxHeight, height);
        }
        return maxHeight;
    }

    //////////////////////////////////////////////////////////////////////////

    // from stdin
    if (process.argv.length === 2) {
        var readline = require('readline');
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });

        var lines = 0;
        rl.on('line',function(line) {
            if (lines === 0) {
                lines++;
            } else if (lines === 1) {
                var tree = line.split(' ').map(function (key) { return {'key': key, 'height': null}; });
                console.log(computeHeightLinear(tree));
            }
        });
    // from file
    } else if (process.argv.length === 3) {
        var fs = require('fs');
        fs.readFile(process.argv[2], 'utf8', function (error, data) {
            if (error) {
                return console.log(error);
            }
            data = data.split('\r\n');
            var tree = data[1].split(' ').map(function (key) { return {'key': key, 'height': null}; });
            console.log(computeHeightLinear(tree));
        });
        // read sync and read answer and compare
    }

})();
