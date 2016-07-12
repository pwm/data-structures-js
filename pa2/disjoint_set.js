(function() { 'use strict';

    var DisjointSet = (function () {
        function DisjointSet(withPathCompression) {
            this.parent = [];
            this.rank = [];
            this.withPathCompression = withPathCompression !== false;
        }

        DisjointSet.prototype = {
            constructor: DisjointSet,

            makeSet: function(i) {
                i = parseInt(i);
                this.parent[i] = i;
                this.rank[i] = 0;
            },

            find: function(i) {
                return (this.withPathCompression)
                    ? this.findWithPathCompression(i)
                    : this.findWithoutPathCompression(i);
            },

            findWithoutPathCompression: function(i) {
                i = parseInt(i);
                while (i !== this.parent[i]) {
                    i = this.parent[i];
                }
                return i;
            },

            findWithPathCompression: function(i) {
                i = parseInt(i);
                if (i !== this.parent[i]) {
                    this.parent[i] = this.find(this.parent[i]);
                }
                return this.parent[i];
            },

            union: function(i, j) {
                i = parseInt(i);
                j = parseInt(j);
                var rootI = this.find(i);
                var rootJ = this.find(j);
                if (rootI === rootJ) {
                    return true;
                }
                if (this.rank[rootI] > this.rank[rootJ]) {
                    this.parent[rootJ] = rootI;
                } else {
                    this.parent[rootI] = rootJ;
                    if (this.rank[rootI] === this.rank[rootJ]) {
                        this.rank[rootJ]++;
                    }
                }
            }
        };

        return DisjointSet;
    })();

    ////////////////////////////////

    //var ds = new DisjointSet(false); // without path compression
    var ds = new DisjointSet(); // with path compression

    for (var i = 0; i < 8; i++) {
        ds.makeSet(i); // 8 height 0 trees
    }

    console.log(ds.parent); console.log(ds.rank);

    ds.union(0, 1); ds.union(2, 3); ds.union(4, 5); ds.union(6, 7); // 4 height 1 trees
    ds.union(1, 3); ds.union(5, 7); // 2 height 2 trees
    ds.union(3, 7); // 1 height 3 tree

    console.log(ds.parent); console.log(ds.rank);

    // tree stays 3 tall without path compression,
    // but becomes 1 tall with path compression
    console.log(ds.find(0));
    console.log(ds.find(2));
    console.log(ds.find(4));

    console.log(ds.parent); console.log(ds.rank);

})();
