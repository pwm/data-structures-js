'use strict';

const Heap = (() => {
    const TYPE_MAX = 'max';
    const TYPE_MIN = 'min';
    const TYPES = [
        TYPE_MAX,
        TYPE_MIN
    ];

    class Heap {
        constructor(type = TYPE_MAX, getPriorityFn = x => x, setPriorityFn = (e, x) => e = x) {
            this.a = [];
            this.nodeMap = new Map();
            this.setType(type);
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
            const root = this.a[0];
            // copy last to its place, this keep the tree complete
            this.a[0] = this.a[this.a.length - 1];
            this._siftDown(0); // sift down copied last to its place
            this.a.pop(); // remove copied last from top
            this.nodeMap.delete(root.id); // remove it from nodeMap too
            return root;
        }

        changePriority(nodeId, newPriority) {
            const key = this.nodeMap.get(nodeId);
            if (key === undefined) {
                return;
            }
            const currentPriority = this.getPriority(this.a[key]);
            this.setPriority(this.a[key], newPriority);
            this._priorityViolation(newPriority, currentPriority)
                ? this._siftUp(key)
                : this._siftDown(key);
        }

        removeNode(nodeId) {
            const key = this.nodeMap.get(nodeId);
            if (key === undefined) {
                return;
            }
            const infPriority = this.type === TYPE_MAX
                ? Number.MAX_SAFE_INTEGER
                : Number.MIN_SAFE_INTEGER;
            this.setPriority(this.a[key], infPriority);
            this._siftUp(key);
            this.extractRoot();
        }

        _siftUp(key) {
            let parentKey = Heap._getParentKey(key);
            while (key > 0 && this._priorityViolation(this.getPriority(this.a[key]), this.getPriority(this.a[parentKey]))) {
                Heap._swap(Heap._getParentKey(key), key, this.a, this.nodeMap);
                key = Heap._getParentKey(key);
                parentKey = Heap._getParentKey(key);
            }
        }

        _siftDown(key) {
            let maxKey = key;
            let leftChildKey = Heap._getLeftChildKey(key);
            if (leftChildKey < this.a.length && this._priorityViolation(this.getPriority(this.a[leftChildKey]), this.getPriority(this.a[maxKey]))) {
                maxKey = leftChildKey;
            }
            let rightChildKey = Heap._getRightChildKey(key);
            if (leftChildKey < this.a.length && this._priorityViolation(this.getPriority(this.a[rightChildKey]), this.getPriority(this.a[maxKey]))) {
                maxKey = rightChildKey;
            }
            if (key !== maxKey) {
                Heap._swap(key, maxKey, this.a, this.nodeMap);
                this._siftDown(maxKey);
            }
        }

        _priorityViolation(a, b) {
            return this.type === TYPE_MAX ? a > b : a < b;
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

const a1 = [];
a1.push(new Node(1, 'S'));
for (let i = 2; i < 63; i++) {
    a1.push(new Node(i));
}
a1.push(new Node(63, 'E'));

const maxHeap = new DisplayableHeap(
    Heap.typeMax(),
    node => node.priority,
    (node, newPriority) => node.priority = newPriority
);

maxHeap.build(a1);
maxHeap.display();

console.log('Change node 1(S) priority from 1 to 16 and node 63(E) from 63 to 1');console.log();
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

const a2 = [];
a2.push(new Node(1, 'S'));
for (let i = 2; i < 63; i++) {
    a2.push(new Node(i));
}
a2.push(new Node(63, 'E'));

const minHeap = new DisplayableHeap(
    Heap.typeMin(),
    node => node.priority,
    (node, newPriority) => node.priority = newPriority
);

minHeap.build(a2);
minHeap.display();

console.log('Change node 1(S) priority from 1 to 16 and node 63(E) from 63 to 1');console.log();
minHeap.changePriority(1, 16);
minHeap.changePriority(63, 1);
minHeap.display();

console.log('Remove node 1(S)');console.log();
minHeap.removeNode(1);
minHeap.display();
