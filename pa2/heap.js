'use strict';

const Heap = (() => {
    const TYPE_MAX = 'max';
    const TYPE_MIN = 'min';
    const TYPES = [
        TYPE_MAX,
        TYPE_MIN
    ];

    class Heap {
        constructor(
            type = TYPE_MAX,
            getIdFn = id => id,
            getPriorityFn = p => p,
            // allows client code to use 1st parameter as node
            setPriorityFn = (_, p, a, k) => a[k] = p
        ) {
            this.a = [];
            this.nodeIdKeyMap = new Map();
            this.setType(type);
            this.getId = getIdFn;
            this.getPriority = getPriorityFn;
            this.setPriority = setPriorityFn;
        }

        static typeMin() {
            return TYPE_MIN;
        }

        static typeMax() {
            return TYPE_MAX;
        }

        setType(type) {
            if (! TYPES.includes(type)) {
                throw Error('Invalid type.');
            }
            this.type = type;
        }

        build(a) {
            this.a = a.slice(0);
            a.forEach((node, key) => this.nodeIdKeyMap.set(this.getId(node), key));
            // siftDown starting from non-leaf nodes
            for (let key = Math.floor((this.a.length - 1) / 2); key >= 0; key--) {
                this._siftDown(key);
            }
        }

        insert(node) {
            const newKey = this.a.length;
            this.a[newKey] = node;
            this.nodeIdKeyMap.set(this.getId(node), newKey);
            this._siftUp(newKey);
        }

        getSize() {
            return this.a.length;
        }

        getRoot() {
            return this.a[0];
        }

        extractRoot() {
            const root = this.a[0];
            // copy last to its place, this keep the tree complete
            this.a[0] = this.a[this.a.length - 1];
            // don't forget to update nodeIdKeyMap
            this.nodeIdKeyMap.set(this.getId(this.a[0]), 0);
            this._siftDown(0); // sift down copied last to its place
            this.a.pop(); // remove copied last from top
            this.nodeIdKeyMap.delete(this.getId(root)); // remove it from nodeIdKeyMap too
            return root;
        }

        changePriority(nodeId, newPriority) {
            const key = this.nodeIdKeyMap.get(nodeId);
            if (key === undefined) {
                return;
            }
            const currentPriority = this.getPriority(this.a[key]);
            this.setPriority(this.a[key], newPriority, this.a, key);
            this._priorityViolation(newPriority, currentPriority)
                ? this._siftUp(key)
                : this._siftDown(key);
        }

        removeNode(nodeId) {
            const key = this.nodeIdKeyMap.get(nodeId);
            if (key === undefined) {
                return;
            }
            const infPriority = this.type === TYPE_MAX
                ? Number.MAX_SAFE_INTEGER
                : Number.MIN_SAFE_INTEGER;
            this.setPriority(this.a[key], infPriority, this.a, key);
            this._siftUp(key);
            this.extractRoot();
        }

        _siftUp(key) {
            let parentKey = Heap._getParentKey(key);
            while (key > 0 && this._priorityViolation(this.getPriority(this.a[key]), this.getPriority(this.a[parentKey]))) {
                this._swap(Heap._getParentKey(key), key);
                key = Heap._getParentKey(key);
                parentKey = Heap._getParentKey(key);
            }
        }

        _siftDown(key) {
            let maxKey = key;
            let leftChildKey = Heap._getLeftChildKey(key);
            if (leftChildKey < this.a.length &&
                this._priorityViolation(this.getPriority(this.a[leftChildKey]), this.getPriority(this.a[maxKey]))) {
                maxKey = leftChildKey;
            }
            let rightChildKey = Heap._getRightChildKey(key);
            if (rightChildKey < this.a.length &&
                this._priorityViolation(this.getPriority(this.a[rightChildKey]), this.getPriority(this.a[maxKey]))) {
                maxKey = rightChildKey;
            }
            if (key !== maxKey) {
                this._swap(key, maxKey);
                this._siftDown(maxKey);
            }
        }

        _priorityViolation(a, b) {
            return this.type === TYPE_MAX ? a > b : a < b;
        }

        _swap(x, y) {
            this.nodeIdKeyMap.set(this.getId(this.a[x]), y);
            this.nodeIdKeyMap.set(this.getId(this.a[y]), x);
            [this.a[y], this.a[x]] = [this.a[x], this.a[y]];
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
    }

    return Heap;
})();

////////////////////////////////

class DisplayableHeap extends Heap {
    constructor(type, getIdFn, getPriorityFn, setPriorityFn) {
        super(type, getIdFn, getPriorityFn, setPriorityFn);
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
                d[height] = [];
                p[height] = [];
            }
            let currPriority = this.getPriority(this.a[i]);
            d[height].push(this.a[i].data);
            p[height].push(currPriority < 10 ? ' ' + currPriority : currPriority);
        }
        for (let i = 0; i < p.length; i++) {
            let s = Math.pow(2, p.length - i) - 1;
            d[i] = ' '.repeat(s / 2) + d[i].join(' '.repeat(s)) + ' '.repeat(s / 2);
            p[i] = ' '.repeat(s) + p[i].join(' '.repeat(s * 2)) + ' '.repeat(s);
        }
        d.forEach(data => console.log(data));
        console.log();
        p.forEach(priority => console.log(priority));
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

        static resetId() {
            id = 0;
        }

    }
    return Node;
})();

////////////////////////////////

// max heap
console.log();
console.log('------------------');
console.log('--== Max Heap ==--');
console.log('------------------');
console.log();

const a1 = [];

// for (let i = 0; i < 63; i++) {
//     a1.push(i);
// }
// const maxHeap = new DisplayableHeap();

a1.push(new Node(1, 'S'));
for (let i = 2; i < 63; i++) {
    i === 20
        ? a1.push(new Node(i, 'M')) // marker
        : a1.push(new Node(i));
}
a1.push(new Node(63, 'E'));
const maxHeap = new DisplayableHeap(
    Heap.typeMax(),
    node => node.id,
    node => node.priority,
    (node, newPriority) => node.priority = newPriority
);

console.log('Build max heap with min node S and max node E');console.log();
maxHeap.build(a1);
maxHeap.display();

console.log('Change node S(id=1) priority from 1 to 16 and node E(id=63) from 63 to 1');console.log();
maxHeap.changePriority(1, 16);
maxHeap.changePriority(63, 1);
maxHeap.display();

console.log('Remove node 1(S)');console.log();
maxHeap.removeNode(1);
maxHeap.display();

Node.resetId();

// min heap
console.log();
console.log('------------------');
console.log('--== Min Heap ==--');
console.log('------------------');
console.log();

const a2 = [];

// for (let i = 0; i < 63; i++) {
//     a2.push(i);
// }
// const minHeap = new DisplayableHeap(Heap.typeMin());

a2.push(new Node(1, 'S'));
for (let i = 2; i < 63; i++) {
    i === 20
        ? a2.push(new Node(i, 'M')) // marker
        : a2.push(new Node(i));
}
a2.push(new Node(63, 'E'));
const minHeap = new DisplayableHeap(
    Heap.typeMin(),
    node => node.id,
    node => node.priority,
    (node, newPriority) => node.priority = newPriority
);

console.log('Build min heap with min node S and max node E');console.log();
minHeap.build(a2);
minHeap.display();

console.log('Change node S(id=1) priority from 1 to 16 and node E(id=63) from 63 to 1');console.log();
minHeap.changePriority(1, 16);
minHeap.changePriority(63, 1);
minHeap.display();

console.log('Remove node 1(S)');console.log();
minHeap.removeNode(1);
minHeap.display();
