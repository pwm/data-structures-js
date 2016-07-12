(function(){ 'use strict';

    var Heap = (function () {
        function Heap(array) {
            this.array = [];
            this.size = 0;
            this.maxSize = Number.MAX_SAFE_INTEGER;
            this.numberOfSwaps = 0;
            this.swaps = [];
            this._build(array);
        }

        Heap.prototype = {
            constructor: Heap,

            /**
             * The heap property is satisfied at the leaves hence we start
             * from the level above the last level
             */
            _build: function (array) {
                this.array = array;
                this.size = array.length;
                for (var i = Math.floor((this.size - 1) / 2); i >= 0; i--) {
                    this._siftDown(i);
                }
            },

            _getParent: function (i) {
                return Math.floor((i - 1) / 2);
            },

            _getLeftChild: function (i) {
                return i * 2 + 1;
            },

            _getRightChild: function (i) {
                return i * 2 + 2;
            },

            _swap: function (fromKey, toKey) {
                var tmp = this.array[fromKey];
                this.array[fromKey] = this.array[toKey];
                this.array[toKey] = tmp;

                this.swaps[this.numberOfSwaps++] = {'from': fromKey, 'to': toKey};
            },

            _siftUp: function (i) {
                while (i > 0 && parseInt(this.array[this._getParent(i)]) > parseInt(this.array[i])) {
                    this._swap(this._getParent(i), i);
                    i = this._getParent(i);
                }
            },

            _siftDown: function (i, size) {
                size = typeof size !== 'undefined' ? size : this.size;
                var maxIndex = i;
                var leftChild = this._getLeftChild(i);
                if (leftChild < size && parseInt(this.array[leftChild]) < parseInt(this.array[maxIndex])) {
                    maxIndex = leftChild;
                }
                var rightChild = this._getRightChild(i);
                if (rightChild < size && parseInt(this.array[rightChild]) < parseInt(this.array[maxIndex])) {
                    maxIndex = rightChild;
                }
                if (i !== maxIndex) {
                    this._swap(i, maxIndex);
                    this._siftDown(maxIndex, size);
                }
            },

            // Public methods

            getSwaps: function () {
                return this.swaps;
            }
        };

        return Heap;
    })();

    ////////////////////////////////

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
                var array = line.split(' ');
                console.log(array);
                var heap = new Heap(array);
                console.log(array);

                // var swaps = heap.getSwaps();
                // var numberOfSwaps = swaps.length;
                // console.log(numberOfSwaps);
                // if (numberOfSwaps > 0) {
                //     for (var i = 0; i<numberOfSwaps; i++) {
                //         console.log(swaps[i].from,swaps[i].to);
                //     }
                // }
            }
        });
    }

})();
