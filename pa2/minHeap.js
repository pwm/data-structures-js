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

            this.a = [];
            this.nodeMap = new Map();
            this.getPriority = typeof getPriorityFn === 'function'
                ? getPriorityFn
                : x => x;
            this.setPriority = typeof setPriorityFn === 'function'
                ? setPriorityFn
                : (e, x) => e = x;
        }

        build(a) {
            this.a = a;
            a.forEach((node, key) => this.nodeMap.set(node.id, key));
            // siftDown starting from non-leaf nodes
            for (let key = Math.floor((this.a.length - 1) / 2); key >= 0; key--) {
                this._siftDown(key);
            }
        }

        insert(node) {
            const newKey = this.a.length;
            this.a[newKey] = node;
            this.nodeMap.set(node.id, newKey);
            this._siftUp(newKey);
        }

        getSize() {
            return this.a.length;
        }

        getRoot() {
            return this.a[0];
        }

        extractRoot() {
            const min = this.a[0];
            // copy last to its place, this keep the tree complete
            this.a[0] = this.a[this.a.length - 1];
            this._siftDown(0); // sift down copied last to its place
            this.a.pop(); // remove copied last from top
            this.nodeMap.delete(min.id); // remove it from nodeMap too
            return min;
        }

        changePriority(nodeId, newPriority) {
            const key = this.nodeMap.get(nodeId);
            if (key === undefined) {
                return;
            }
            const currentPriority = this.getPriority(this.a[key]);
            this.setPriority(this.a[key], newPriority);
            newPriority < currentPriority
                ? this._siftUp(key)
                : this._siftDown(key);
        }

        removeNode(nodeId) {
            const key = this.nodeMap.get(nodeId);
            if (key === undefined) {
                return;
            }
            this.setPriority(this.a[key], Number.MIN_SAFE_INTEGER);
            this._siftUp(key);
            this.extractRoot();
        }

        _siftUp(key) {
            while (key > 0 && this.getPriority(this.a[Heap._getParentKey(key)]) > this.getPriority(this.a[key])) {
                Heap._swap(Heap._getParentKey(key), key, this.a, this.nodeMap);
                key = Heap._getParentKey(key);
            }
        }

        _siftDown(key) {
            let maxKey = key;
            let leftChildKey = Heap._getLeftChildKey(key);
            if (leftChildKey < this.a.length && this.getPriority(this.a[leftChildKey]) < this.getPriority(this.a[maxKey])) {
                maxKey = leftChildKey;
            }
            let rightChildKey = Heap._getRightChildKey(key);
            if (leftChildKey < this.a.length && this.getPriority(this.a[rightChildKey]) < this.getPriority(this.a[maxKey])) {
                maxKey = rightChildKey;
            }
            if (key !== maxKey) {
                Heap._swap(key, maxKey, this.a, this.nodeMap);
                this._siftDown(maxKey);
            }
        }

        static _getParentKey(key) {
            return Math.floor((key - 1) / 2);
        }

        static _getLeftChildKey(key) {
            return key * 2 + 1;
        }

        static _getRightChildKey(key) {
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
        for (let i = 0; i < this.a.length; i++) {
            if (i === Math.pow(2, height + 1) - 1) {
                height++;
            }
            if (!Array.isArray(p[height])) {
                p[height] = [];
                d[height] = [];
            }
            let currPriority = this.getPriority(this.a[i]);
            p[height].push(currPriority < 10 ? ' ' + currPriority : currPriority);
            d[height].push(this.a[i].data);
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
