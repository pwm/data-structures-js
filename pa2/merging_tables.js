(function() { 'use strict';

    var DisjointSet = (function () {
        function DisjointSet(max) {
            this.parent = [];
            this.rank = [];
            this.max = max;
        }

        DisjointSet.prototype = {
            constructor: DisjointSet,

            makeSet: function(object) {
                var key = parseInt(object.key);
                this.parent[key] = object;
                this.rank[key] = 0;
            },

            find: function(object) {
                var key = parseInt(object.key);
                if (! this.parent[key]) {
                    throw new Error('No such element.');
                }
                if (key !== this.parent[key].key) {
                    this.parent[key] = this.find(this.parent[key]);
                }
                return this.parent[key];
            },

            union: function(objectX, objectY) {
                var rootX = this.find(objectX);
                var rootY = this.find(objectY);
                if (rootX.key === rootY.key) {
                    return true;
                }
                if (this.rank[rootY.key] < this.rank[rootX.key]) {
                    rootX.size += rootY.size;
                    rootY.size = 0;
                    if (rootX.size > this.max) {
                        this.max = rootX.size;
                    }
                    this.parent[rootY.key] = rootX;
                } else {
                    rootY.size += rootX.size;
                    rootX.size = 0;
                    if (rootY.size > this.max) {
                        this.max = rootY.size;
                    }
                    this.parent[rootX.key] = rootY;
                    if (this.rank[rootX.key] === this.rank[rootY.key]) {
                        this.rank[rootY.key]++;
                    }
                }
            }
        };

        return DisjointSet;
    })();

    ////////////////////////////////

    var Table = (function () {
        function Table(key, size) {
            this.key = key;
            this.size = size;
        }
        return Table;
    })();

    function getInitialMax(tableLengths) {
        var initialMax = 0;
        for (var i = 0; i < tableLengths.length; i++) {
            if (tableLengths[i] > initialMax) {
                initialMax = tableLengths[i];
            }
        }
        return initialMax;
    }

    ////////////////////////////////

    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';
    var data = fs.readFileSync(input, 'utf8');

    var lines = data.match(/[^\r\n]+/g);

    var numberOfTables = parseInt(lines[0].split(' ')[0]);
    var numberOfMerges = parseInt(lines[0].split(' ')[1]);
    var tableLengths = lines[1].split(' ').map(function (v) { return parseInt(v); });

    var merges = [];
    for (var lineNumber = 2; lineNumber < numberOfMerges + 2; lineNumber++) {
        var s = parseInt(lines[lineNumber].split(' ')[0]) - 1;
        var d = parseInt(lines[lineNumber].split(' ')[1]) - 1;
        merges.push({'s': s, 'd': d});
    }

    // create disjoint sets
    var tables = [];
    var ds = new DisjointSet(getInitialMax(tableLengths));
    for (var i = 0; i < numberOfTables; i++) {
        tables[i] = new Table(i, tableLengths[i]);
        ds.makeSet(tables[i]);
    }

    // merges
    for (var mergeCount = 0; mergeCount < numberOfMerges; mergeCount++) {
        ds.union(tables[merges[mergeCount].s], tables[merges[mergeCount].d]);
        console.log(ds.max);
    }

})();
