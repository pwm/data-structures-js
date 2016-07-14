(function() { 'use strict';

    /**
     * Disjoint-set
     */
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
                    ? this._findWithPathCompression(i)
                    : this._findWithoutPathCompression(i);
            },

            union: function(i, j) {
                i = parseInt(i);
                j = parseInt(j);
                var rootI = this.find(i);
                var rootJ = this.find(j);
                if (rootI === null || rootJ === null) {
                    throw new Error('Unknown set.');
                }
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
            },

            _findWithoutPathCompression: function(i) {
                i = parseInt(i);
                if (this.parent[i] === undefined) {
                    return null;
                }
                while (i !== this.parent[i]) {
                    i = this.parent[i];
                }
                return i;
            },

            _findWithPathCompression: function(i) {
                i = parseInt(i);
                if (this.parent[i] === undefined) {
                    return null;
                }
                if (i !== this.parent[i]) {
                    this.parent[i] = this.find(this.parent[i]);
                }
                return this.parent[i];
            }
        };

        return DisjointSet;
    })();

    ////////////////////////////////

    // DS with path compression. DisjointSet(false) would be without PC.
    var ds = new DisjointSet();

    for (var i = 1; i <= 8; i++) {
        ds.makeSet(i); // 8 trees with height 0 and rank 0
    }

    console.log(ds.parent.join(' ')); // 1 2 3 4 5 6 7 8
    console.log(ds.rank.join(' '));   // 0 0 0 0 0 0 0 0

    ds.union(1, 2); ds.union(3, 4); ds.union(5, 6); ds.union(7, 8); // 4 trees with height 1 and rank 1
    ds.union(2, 4); ds.union(6, 8); // 2 trees with height 2 and rank 2
    ds.union(4, 8); // 1 tree with height 3 and rank 3

    console.log(ds.parent.join(' ')); // 2 4 4 8 6 8 8 8
    console.log(ds.rank.join(' '));   // 0 1 0 2 0 1 0 3

    // Tree height becomes 1 with PC but stays 3 without PC. Rank is not affected and stays 3
    console.log(ds.find(1)); // 8
    console.log(ds.parent.join(' ')); // with PC: 8 8 4 8 6 8 8 8, without PC: 2 4 4 8 6 8 8 8
    console.log(ds.find(3)); // 8
    console.log(ds.parent.join(' ')); // with PC: 8 8 8 8 6 8 8 8, without PC: 2 4 4 8 6 8 8 8
    console.log(ds.find(5)); // 8
    console.log(ds.parent.join(' ')); // with PC: 8 8 8 8 8 8 8 8, without PC: 2 4 4 8 6 8 8 8

    console.log(ds.find(9)); // null

})();
