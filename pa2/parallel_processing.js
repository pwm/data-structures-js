(function(){ 'use strict';

    var MinHeap = (function () {
        function MinHeap(array, isABeforeB) {
            this.array = [];
            this.size = 0;
            this.maxSize = Number.MAX_SAFE_INTEGER;
            this.isABeforeB = typeof isABeforeB === 'function'
                ? isABeforeB
                : function (a, b) { return parseInt(a) < parseInt(b); };
            this._build(array);
        }

        MinHeap.prototype = {
            constructor: MinHeap,

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
            },

            _siftUp: function (i) {
                //while (i > 0 && parseInt(this.array[this._getParent(i)]) > parseInt(this.array[i])) {
                while (i > 0 && this.isABeforeB(this.array[i], this.array[this._getParent(i)])) {
                    this._swap(this._getParent(i), i);
                    i = this._getParent(i);
                }
            },

            _siftDown: function (i, size) {
                size = typeof size !== 'undefined' ? size : this.size;
                var maxIndex = i;
                var leftChild = this._getLeftChild(i);
                //if (leftChild < size && parseInt(this.array[leftChild]) < parseInt(this.array[maxIndex])) {
                if (leftChild < size && this.isABeforeB(this.array[leftChild], this.array[maxIndex])) {
                    maxIndex = leftChild;
                }
                var rightChild = this._getRightChild(i);
                //if (rightChild < size && parseInt(this.array[rightChild]) < parseInt(this.array[maxIndex])) {
                if (rightChild < size && this.isABeforeB(this.array[rightChild], this.array[maxIndex])) {
                    maxIndex = rightChild;
                }
                if (i !== maxIndex) {
                    this._swap(i, maxIndex);
                    this._siftDown(maxIndex, size);
                }
            },

            _checkHeapProperty: function () {
                for (var i = 0; i < this.size; i++) {
                    if (i * 2 + 1 <= this.size - 1 && parseInt(this.array[i]) >= parseInt(this.array[i * 2 + 1])) {
                        throw new Error('MinHeap property violated.');
                    }
                    if (i * 2 + 2 <= this.size - 1 && parseInt(this.array[i]) >= parseInt(this.array[i * 2 + 2])) {
                        throw new Error('MinHeap property violated.');
                    }
                }
            },

            // Public methods

            getSwaps: function () {
                return this.swaps;
            },

            insert: function (element) {
                if (this.size === this.maxSize) {
                    throw new RangeError('MinHeap overflow.');
                }
                this.array[this.size] = element;
                this.size++;
                this._siftUp(this.size - 1);
            },

            getMin: function () {
                return this.array[0];
            },

            extractMin: function () {
                var minElement = this.array[0];
                this.array[0] = this.array[this.size - 1];
                this.size--;
                this._siftDown(0);
                this.array.pop(); // remove copied element
                return minElement;
            },

            removeElement: function (i) {
                this.array[i] = Number.MIN_SAFE_INTEGER;
                this._siftUp(i);
                this.extractMin();
            },

            changePriority: function (i, newPriority) {
                var currentPriority = this.array[i];
                this.array[i]= newPriority;
                newPriority < currentPriority ? this._siftUp(i) : this._siftDown(i);
            },

            /**
             * O(n * log n)
             */
            sort: function () {
                var counter = this.size - 1;
                for (var i = 0; i < this.size - 1; i++) {
                    this._swap(0, counter);
                    counter--;
                    this._siftDown(0, counter);
                }
                return this.array;
            },

            /**
             * O(n + k * log n) = O(n) run time if k <= n / log n
             */
            partialSort: function (k) {
                if (k > this.size / Math.log2(this.size)) {
                    throw new Error('Not efficient partial sort for ' + k);
                }
                var partiallySortedArray = [];
                for (var i = 0; i <= k - 1; i++) {
                    partiallySortedArray[i] = this.extractMin();
                }
                return partiallySortedArray;
            }
        };

        return MinHeap;
    })();

    ////////////////////////////////

    var Processor = (function () {
        function Processor(id, workAmount) {
            this.id = id;
            this.startTime = 0;
            this.workAmount = workAmount;
        }

        Processor.prototype = {
            constructor: Processor,

            adjustStartTime: function (workAmount) {
                this.startTime += this.workAmount;
                this.workAmount = workAmount;
            }
        };

        Processor.isABeforeB = function (a, b) {
            if (parseInt(a.workAmount + a.startTime) === parseInt(b.workAmount + b.startTime)) {
                return parseInt(a.id) < parseInt(b.id);
            }
            return parseInt(a.workAmount + a.startTime) < parseInt(b.workAmount + b.startTime);
        };

        return Processor;
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
        var numberOfProcessors = 0;
        var jobs = [];
        rl.on('line', function(line) {
            if (lines === 0) {
                numberOfProcessors = parseInt(line.split(' ')[0]);
                lines++;
            } else if (lines === 1) {
                jobs = line.split(' ').map(function (number) { return parseInt(number); });
                var numberOfJobs = jobs.length;

                // initialize processor array
                var processors = [];
                for (var i = 0; i < numberOfProcessors; i++) {
                    processors.push(new Processor(i, jobs[i]));
                }

                // do calculation
                if (numberOfProcessors < numberOfJobs) {
                    // print out processor array
                    for (i = 0; i < numberOfProcessors; i++) {
                        console.log(processors[i].id, processors[i].startTime);
                    }
                    var minHeap = new MinHeap(processors, Processor.isABeforeB);
                    for (i = numberOfProcessors; i < numberOfJobs; i++) {
                        var currentProcessor = minHeap.extractMin();
                        currentProcessor.adjustStartTime(jobs[i]);
                        minHeap.insert(currentProcessor);
                        console.log(currentProcessor.id, currentProcessor.startTime);
                    }
                } else {
                    // print out processor array
                    for (i = 0; i < numberOfJobs; i++) {
                        console.log(processors[i].id, processors[i].startTime);
                    }
                }
            }
        });
    }

})();
