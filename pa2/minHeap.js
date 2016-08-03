'use strict';

const Heap = (() => {
    const TYPE_MAX = 'max';
    const TYPE_MIN = 'min';
    const TYPES = [
        TYPE_MAX,
        TYPE_MIN
    ];

    class Heap {
        constructor(type, getPriorityFn, setPriorityFn) {
            if (! TYPES.includes(type)) {
                throw Error('Invalid type.');
            }
            this.type = type;

            this.array = [];
            this.size = 0;
            this.nodeMap = new Map();
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
            a.forEach((node, key) => this.nodeMap.set(node.id, key));
            // start siftDown from non-leaf nodes
            for (let key = Math.floor((this.size - 1) / 2); key >= 0; key--) {
                this._siftDown(key);
            }
        }

        insert(node) {
            this.array[this.size] = node;
            this.nodeMap.set(node.id, this.size);
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
            this.nodeMap.delete(min.id); // remove it from nodeMap too
            return min;
        }

        changePriority(nodeId, newPriority) {
            const key = this.nodeMap.get(nodeId);
            if (key === undefined) {
                return;
            }
            const currentPriority = this.getPriority(this.array[key]);
            this.setPriority(this.array[key], newPriority);
            newPriority < currentPriority
                ? this._siftUp(key)
                : this._siftDown(key);
        }

        removeNode(nodeId) {
            const key = this.nodeMap.get(nodeId);
            if (key === undefined) {
                return;
            }
            this.setPriority(this.array[key], Number.MIN_SAFE_INTEGER);
            this._siftUp(key);
            this.extractMin();
        }

        _siftUp(key) {
            while (key > 0 && this.getPriority(this.array[Heap._getParent(key)]) > this.getPriority(this.array[key])) {
                Heap._swap(Heap._getParent(key), key, this.array, this.nodeMap);
                key = Heap._getParent(key);
            }
        }

        _siftDown(key) {
            let maxKey = key;
            let leftChild = Heap._getLeftChild(key);
            if (leftChild < this.size && this.getPriority(this.array[leftChild]) < this.getPriority(this.array[maxKey])) {
                maxKey = leftChild;
            }
            let rightChild = Heap._getRightChild(key);
            if (leftChild < this.size && this.getPriority(this.array[rightChild]) < this.getPriority(this.array[maxKey])) {
                maxKey = rightChild;
            }
            if (key !== maxKey) {
                Heap._swap(key, maxKey, this.array, this.nodeMap);
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

        static _swap(x, y, a, nodeMap) {
            nodeMap.set(a[x].id, y);
            nodeMap.set(a[y].id, x);
            [a[y], a[x]] = [a[x], a[y]];
        }
    }

    return Heap;
})();

////////////////////////////////

class DisplayableHeap extends Heap {
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

const Node = (() => {
    let id = 0;
    class Node {
        constructor(priority, data) {
            this.id = ++id;
                this.priority = parseInt(priority);
            this.data = typeof data !== 'undefined' ? data : 'x';
        }
    }
    return Node;
})();
////////////////////////////////

const a = [];
a.push(new Node(1, 'S'));
for (let i = 2; i < 63; i++) {
    a.push(new Node(i));
}
a.push(new Node(63, 'E'));

const mh = new DisplayableHeap(
    'min',
    node => node.priority,
    (node, newPriority) => node.priority = newPriority
);

mh.build(a);
mh.display();

mh.changePriority(1, 16);
mh.changePriority(63, 1);
mh.display();

mh.removeNode(1);
mh.display();
