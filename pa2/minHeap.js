'use strict';

const MinHeap = (() => {
    const TYPE_MAX = 'max';
    const TYPE_MIN = 'min';
    const TYPES = [
        TYPE_MAX,
        TYPE_MIN
    ];

    class MinHeap {
        constructor(type, getPriorityFn, setPriorityFn) {
            if (! TYPES.includes(type)) {
                throw Error('Invalid type.');
            }
            this.type = type;

            this.array = [];
            this.size = 0;
            this.getPriority = typeof getPriorityFn === 'function'
                ? getPriorityFn
                : x => x;
            this.setPriority = typeof setPriorityFn === 'function'
                ? setPriorityFn
                : (e, x) => e = x;
        }

        build(a) {
            this.array = a;
            this.size = a.length;
            for (let key = Math.floor((this.size - 1) / 2); key >= 0; key--) {
                this._siftDown(key);
            }
        }

        insert(node) {
            this.array[this.size] = node;
            this._siftUp(this.size);
            this.size++;
        }

        getSize() {
            return this.size;
        }

        getMin() {
            return this.array[0];
        }

        extractMin() {
            const min = this.array[0];
            // copy last to its place, this keep the tree complete
            this.array[0] = this.array[this.size - 1];
            this.size--;
            this._siftDown(0); // sift down copied last to its place
            this.array.pop(); // remove copied last from top
            return min;
        }

        changePriority(key, nodeWithNewPriority) {
            const currentPriority = this.getPriority(this.array[key]);
            this.array[key] = nodeWithNewPriority;
            this.getPriority(nodeWithNewPriority) < currentPriority
                ? this._siftUp(key)
                : this._siftDown(key);
        }

        removeNode(key) {
            this.setPriority(this.array[key], Number.MIN_SAFE_INTEGER);
            this._siftUp(key);
            this.extractMin();
        }

        _siftUp(key) {
            while (key > 0 && this.getPriority(this.array[MinHeap._getParent(key)]) > this.getPriority(this.array[key])) {
                MinHeap._swap(this.array, MinHeap._getParent(key), key);
                key = MinHeap._getParent(key);
            }
        }

        _siftDown(key) {
            let maxKey = key;
            let leftChild = MinHeap._getLeftChild(key);
            if (leftChild < this.size && this.getPriority(this.array[leftChild]) < this.getPriority(this.array[maxKey])) {
                maxKey = leftChild;
            }
            let rightChild = MinHeap._getRightChild(key);
            if (leftChild < this.size && this.getPriority(this.array[rightChild]) < this.getPriority(this.array[maxKey])) {
                maxKey = rightChild;
            }
            if (key !== maxKey) {
                MinHeap._swap(this.array, key, maxKey);
                this._siftDown(maxKey);
            }
        }

        static _getParent(key) {
            return Math.floor((key - 1) / 2);
        }

        static _getLeftChild(key) {
            return key * 2 + 1;
        }

        static _getRightChild(key) {
            return key * 2 + 2;
        }

        static _swap(a, x, y) {
            [a[y], a[x]] = [a[x], a[y]];
        }
    }

    return MinHeap;
})();

////////////////////////////////

class DisplayableMinHeap extends MinHeap {
    constructor(type, getPriorityFn, setPriorityFn) {
        super(type, getPriorityFn, setPriorityFn);
    }

    display() {
        const p = [],
            d = [];
        let height = 0;
        for (let i = 0; i < this.size; i++) {
            if (i === Math.pow(2, height + 1) - 1) {
                height++;
            }
            if (!Array.isArray(p[height])) {
                p[height] = [];
                d[height] = [];
            }
            let currPriority = this.getPriority(this.array[i]);
            p[height].push(currPriority < 10 ? ' ' + currPriority : currPriority);
            d[height].push(this.array[i].data);
        }
        for (let i = 0; i < p.length; i++) {
            let s = Math.pow(2, p.length - i) - 1;
            p[i] = ' '.repeat(s) + p[i].join(' '.repeat(s * 2)) + ' '.repeat(s);
            d[i] = ' '.repeat(s / 2) + d[i].join(' '.repeat(s)) + ' '.repeat(s / 2);
        }
        p.forEach(priority => console.log(priority));
        console.log();
        d.forEach(data => console.log(data));
        console.log();
    }
}

////////////////////////////////

class Node {
    constructor(priority, data) {
        this.priority = parseInt(priority);
        this.data = typeof data !== 'undefined' ? data : 'x';
    }
}

////////////////////////////////

//@todo: have a priority-key map to be able to access elements by priority
//@todo: this however would not work as there can be multiple entries  with the same priority
//@todo: maybe a map from object to key would work


const a = [];
a.push(new Node(1, 'S'));
for (let i = 2; i < 63; i++) {
    a.push(new Node(i));
}
a.push(new Node(63, 'E'));

const mh = new DisplayableMinHeap(
    'min',
    node => node.priority,
    (node, newPriority) => node.priority = newPriority
);

mh.build(a);
mh.display();

mh.changePriority(0, new Node(23, 'S'));
mh.changePriority(62, new Node(1, 'E'));
mh.display();

mh.removeNode(15);
mh.display();
