(function() { 'use strict';

    var SplayTree = (function () {
        function SplayTree() {
            this.root = null;
        }

        var Node = (function () {
            function Node(key) {
                this.key = key;
                this.sum = 0;
                this.parent = null;
                this.leftChild = null;
                this.rightChild = null;
            }

            Node.prototype = {
                constructor: Node,

                getKey: function () {
                    return this.key;
                },

                setSum: function (sum) {
                    this.sum = sum;
                },

                getSum: function () {
                    return this.sum;
                },

                setParent: function (parent) {
                    this.parent = parent;
                    return this;
                },

                setLeftChild: function (leftChild) {
                    this.leftChild = leftChild;
                    return this;
                },

                setRightChild: function (rightChild) {
                    this.rightChild = rightChild;
                    return this;
                },

                getParent: function () {
                    return this.parent;
                },

                getLeftChild: function () {
                    return this.leftChild;
                },

                getRightChild: function () {
                    return this.rightChild;
                },

                isRoot: function () {
                    return this.getParent() === null;
                },

                hasParent: function () {
                    return this.getParent() instanceof Node;
                },

                hasLeftChild: function () {
                    return this.getLeftChild() instanceof Node;
                },

                hasRightChild: function () {
                    return this.getRightChild() instanceof Node;
                },

                isLeftChild: function () {
                    return this.hasParent() &&
                        this.getParent().hasLeftChild() &&
                        this.getParent().getLeftChild().getKey() === this.getKey();
                },

                isRightChild: function () {
                    return this.hasParent() &&
                        this.getParent().hasRightChild() &&
                        this.getParent().getRightChild().getKey() === this.getKey();
                }
            };

            return Node;
        })();

        SplayTree.prototype = {
            constructor: SplayTree,

            getRoot: function () {
                return this.root;
            },

            setRoot: function (node) {
                this.root = node;
                if (node instanceof Node) {
                    node.setParent(null);
                }
            },

            hasNodes: function () {
                return this.root instanceof Node;
            },

            find: function (key) {
                if (this.root === null) {
                    return null;
                }
                var node = this._getSelfOrParent(key);
                this._splay(node);
                return node.getKey() === key ? node : null;
            },

            insert: function (key) {
                var newNode = new Node(key);
                if (this.root === null) {
                    newNode.setSum(newNode.getKey());
                    this.setRoot(newNode);
                    return;
                }
                var parent = this._getSelfOrParent(key);
                if (parent.getKey() === key) { // already in the tree
                    return;
                }
                newNode.setParent(parent);
                parent.getKey() > key
                    ? parent.setLeftChild(newNode)
                    : parent.setRightChild(newNode);
                this._splay(newNode);
                // adjust sums
                var leftChildSum = newNode.hasLeftChild() ? newNode.getLeftChild().getSum() : 0;
                var rightChildSum = newNode.hasRightChild() ? newNode.getRightChild().getSum() : 0;
                newNode.setSum(newNode.getKey() + leftChildSum + rightChildSum);
            },

            delete: function (key) {
                if (this.root === null) {
                    return;
                }
                var node = this._getSelfOrParent(key);
                if (node.getKey() !== key) { // not in the tree
                    return;
                }
                var nextLargestNode = this._getNextLargest(node);
                // node is the largest so after splay it won't have a
                // right subtree so just make its left child the root
                // note: no need for sum change here
                if (nextLargestNode === null) {
                    this._splay(node);
                    this.setRoot(node.getLeftChild());
                // node is root, next largest is its right child and the right
                // child has no left subtree as it's node's next largest, so
                // set right child as root
                } else {
                    this._splay(nextLargestNode);
                    this._splay(node);
                    if (node.hasLeftChild()) {
                        node.getLeftChild().setParent(nextLargestNode);
                        // adjust sums
                        nextLargestNode.setSum(nextLargestNode.getSum() + node.getLeftChild().getSum());
                    }
                    nextLargestNode.setLeftChild(node.getLeftChild());
                    this.setRoot(nextLargestNode);
                }
            },

            split: function (key, direction) {
                function leftSplit(node, tree) {
                    tree._splay(node);
                    if (node.hasRightChild()) {
                        rightTree.setRoot(node.getRightChild());
                        node.setRightChild(null);
                        // adjust sums
                        node.setSum(node.getSum() - rightTree.getRoot().getSum());
                    }
                    leftTree.setRoot(node);
                    return [leftTree, rightTree];
                }
                function rightSplit(node, tree) {
                    tree._splay(node);
                    if (node.hasLeftChild()) {
                        leftTree.setRoot(node.getLeftChild());
                        node.setLeftChild(null);
                        // adjust sums
                        node.setSum(node.getSum() - leftTree.getRoot().getSum());
                    }
                    rightTree.setRoot(node);
                    return [leftTree, rightTree];
                }

                direction = typeof direction !== 'undefined' ? direction : 'left';
                var leftTree = new SplayTree(),
                    rightTree = new SplayTree();
                if (this.root === null) {
                    return [leftTree, rightTree];
                }
                var node = this._getSelfOrParent(key);
                if (node.getKey() < key) {
                    return leftSplit(node, this);
                } else if (node.getKey() > key) {
                    return rightSplit(node, this);
                } else { // key is in the tree
                    return direction === 'left' ? leftSplit(node, this) : rightSplit(node, this);
                }
            },

            join: function (leftTree, rightTree) {
                if (leftTree.getRoot() === null && rightTree.getRoot() === null) {
                    return new SplayTree();
                }
                if (leftTree.getRoot() === null) {
                    return rightTree;
                }
                if (rightTree.getRoot() === null) {
                    return leftTree;
                }
                var newRoot = leftTree._getSelfOrParent(Number.MAX_SAFE_INTEGER, leftTree.getRoot());
                leftTree._splay(newRoot);
                newRoot.setRightChild(rightTree.getRoot());
                rightTree.getRoot().setParent(newRoot);
                // adjust sums
                newRoot.setSum(newRoot.getSum() + rightTree.getRoot().getSum());
                this.setRoot(newRoot);
                return this;
            },

            _getSelfOrParent: function (key, node) {
                node = typeof node !== 'undefined' ? node : this.root;
                while (node instanceof Node && node.getKey() !== key) {
                    if (node.getKey() > key) {
                        if (! node.hasLeftChild()) {
                            break;
                        }
                        node = node.getLeftChild();
                    } else {
                        if (! node.hasRightChild()) {
                            break;
                        }
                        node = node.getRightChild();
                    }
                }
                return node;
            },

            _getNextSmallest: function (node) {
                return node.hasLeftChild()
                    ? this._rightDescendant(node.getLeftChild())
                    : this._leftAncestor(node);
            },

            _getNextLargest: function (node) {
                return node.hasRightChild()
                    ? this._leftDescendant(node.getRightChild())
                    : this._rightAncestor(node);
            },

            _leftDescendant: function (node) {
                while (node.hasLeftChild()) {
                    node = node.getLeftChild();
                }
                return node;
            },

            _rightDescendant: function (node) {
                while (node.hasRightChild()) {
                    node = node.getRightChild();
                }
                return node;
            },

            _leftAncestor: function (node) {
                if (node.isRoot()) {
                    return null;
                }
                while (node.getKey() < node.getParent().getKey()) {
                    node = node.getParent();
                    if (node.isRoot()) {
                        return null;
                    }
                }
                return node.getParent();
            },

            _rightAncestor: function (node) {
                if (node.isRoot()) {
                    return null;
                }
                while (node.getKey() > node.getParent().getKey()) {
                    node = node.getParent();
                    if (node.isRoot()) {
                        return null;
                    }
                }
                return node.getParent();
            },

            _splay: function (node) {
                if (node.isRoot()) {
                    return;
                }
                // splay till node becomes root
                while (node.hasParent()) {
                    // Node has no grand-parent, so we left rotate if it's a
                    // right child or right rotate if it's a left child.
                    if (! node.getParent().hasParent()) {
                        node.isLeftChild() ? this._rightRotation(node) : this._leftRotation(node);
                        node.setParent(null);
                    } else {
                        var greatGrandParent = node.getParent().getParent().hasParent()
                            ? node.getParent().getParent().getParent()
                            : null;
                        // there are 4 type of rotations that we need to choose from
                        if (node.isLeftChild() && node.getParent().isLeftChild()) {
                            this._zigZigRightRightRotation(node);
                        } else if (node.isLeftChild() && node.getParent().isRightChild()) {
                            this._zigZagRightLeftRotation(node);
                        } else if (node.isRightChild() && node.getParent().isRightChild()) {
                            this._zigZigLeftLeftRotation(node);
                        } else {
                            this._zigZagLeftRightRotation(node);
                        }
                        // connect back to the rest of the tree
                        if (greatGrandParent instanceof Node) {
                            node.getKey() < greatGrandParent.getKey()
                                ? greatGrandParent.setLeftChild(node)
                                : greatGrandParent.setRightChild(node);
                        }
                    }
                }
                this.setRoot(node);
            },

            _leftRotation: function (node) {
                var parent = node.getParent();
                parent.setRightChild(node.getLeftChild());
                if (node.hasLeftChild()) {
                    node.getLeftChild().setParent(parent);
                }
                parent.setParent(node);
                node.setLeftChild(parent);
                // adjust sums
                var parentLeftChildSum = parent.hasLeftChild() ? parent.getLeftChild().getSum() : 0;
                var parentRightChildSum = parent.hasRightChild() ? parent.getRightChild().getSum() : 0;
                var nodeRightChildSum = node.hasRightChild() ? node.getRightChild().getSum() : 0;
                parent.setSum(parent.getKey() + parentLeftChildSum + parentRightChildSum);
                node.setSum(node.getKey() + parent.getSum() + nodeRightChildSum);
            },

            _rightRotation: function (node) {
                var parent = node.getParent();
                parent.setLeftChild(node.getRightChild());
                if (node.hasRightChild()) {
                    node.getRightChild().setParent(parent);
                }
                parent.setParent(node);
                node.setRightChild(parent);
                // adjust sums
                var parentLeftChildSum = parent.hasLeftChild() ? parent.getLeftChild().getSum() : 0;
                var parentRightChildSum = parent.hasRightChild() ? parent.getRightChild().getSum() : 0;
                var nodeLeftChildSum = node.hasLeftChild() ? node.getLeftChild().getSum() : 0;
                parent.setSum(parent.getKey() + parentLeftChildSum + parentRightChildSum);
                node.setSum(node.getKey() + nodeLeftChildSum + parent.getSum());
            },

            _zigZigRightRightRotation: function (node) {
                var parent = node.getParent(),
                    grandParent = node.getParent().getParent();
                if (node.hasRightChild()) {
                    node.getRightChild().setParent(parent);
                }
                if (parent.hasRightChild()) {
                    parent.getRightChild().setParent(grandParent);
                }
                node.setParent(grandParent.getParent());
                grandParent.setParent(parent);
                parent.setParent(node);
                grandParent.setLeftChild(parent.getRightChild());
                parent.setRightChild(grandParent);
                parent.setLeftChild(node.getRightChild());
                node.setRightChild(parent);
                // adjust sums
                var grandParentLeftChildSum = grandParent.hasLeftChild() ? grandParent.getLeftChild().getSum() : 0;
                var grandParentRightChildSum = grandParent.hasRightChild() ? grandParent.getRightChild().getSum() : 0;
                var parentLeftChildSum = parent.hasLeftChild() ? parent.getLeftChild().getSum() : 0;
                var nodeLeftChildSum = node.hasLeftChild() ? node.getLeftChild().getSum() : 0;
                grandParent.setSum(grandParent.getKey() + grandParentLeftChildSum + grandParentRightChildSum);
                parent.setSum(parent.getKey() + parentLeftChildSum + grandParent.getSum());
                node.setSum(node.getKey() + nodeLeftChildSum + parent.getSum());
            },

            _zigZigLeftLeftRotation: function (node) {
                var parent = node.getParent(),
                    grandParent = node.getParent().getParent();
                if (node.hasLeftChild()) {
                    node.getLeftChild().setParent(parent);
                }
                if (parent.hasLeftChild()) {
                    parent.getLeftChild().setParent(grandParent);
                }
                node.setParent(grandParent.getParent());
                grandParent.setParent(parent);
                parent.setParent(node);
                grandParent.setRightChild(parent.getLeftChild());
                parent.setLeftChild(grandParent);
                parent.setRightChild(node.getLeftChild());
                node.setLeftChild(parent);
                // adjust sums
                var grandParentLeftChildSum = grandParent.hasLeftChild() ? grandParent.getLeftChild().getSum() : 0;
                var grandParentRightChildSum = grandParent.hasRightChild() ? grandParent.getRightChild().getSum() : 0;
                var parentRightChildSum = parent.hasRightChild() ? parent.getRightChild().getSum() : 0;
                var nodeRightChildSum = node.hasRightChild() ? node.getRightChild().getSum() : 0;
                grandParent.setSum(grandParent.getKey() + grandParentLeftChildSum + grandParentRightChildSum);
                parent.setSum(parent.getKey() + grandParent.getSum() + parentRightChildSum);
                node.setSum(node.getKey() + parent.getSum() + nodeRightChildSum);
            },

            _zigZagRightLeftRotation: function (node) {
                var parent = node.getParent(),
                    grandParent = node.getParent().getParent();
                if (node.hasLeftChild()) {
                    node.getLeftChild().setParent(grandParent);
                }
                if (node.hasRightChild()) {
                    node.getRightChild().setParent(parent);
                }
                node.setParent(grandParent.getParent());
                grandParent.setParent(node);
                parent.setParent(node);
                grandParent.setRightChild(node.getLeftChild());
                parent.setLeftChild(node.getRightChild());
                node.setRightChild(parent);
                node.setLeftChild(grandParent);
                // adjust sums
                var grandParentLeftChildSum = grandParent.hasLeftChild() ? grandParent.getLeftChild().getSum() : 0;
                var grandParentRightChildSum = grandParent.hasRightChild() ? grandParent.getRightChild().getSum() : 0;
                var parentLeftChildSum = parent.hasLeftChild() ? parent.getLeftChild().getSum() : 0;
                var parentRightChildSum = parent.hasRightChild() ? parent.getRightChild().getSum() : 0;
                grandParent.setSum(grandParent.getKey() + grandParentLeftChildSum + grandParentRightChildSum);
                parent.setSum(parent.getKey() + parentLeftChildSum + parentRightChildSum);
                node.setSum(node.getKey() + parent.getSum() + grandParent.getSum());
            },

            _zigZagLeftRightRotation: function (node) {
                var parent = node.getParent(),
                    grandParent = node.getParent().getParent();
                if (node.hasLeftChild()) {
                    node.getLeftChild().setParent(parent);
                }
                if (node.hasRightChild()) {
                    node.getRightChild().setParent(grandParent);
                }
                node.setParent(grandParent.getParent());
                grandParent.setParent(node);
                parent.setParent(node);
                grandParent.setLeftChild(node.getRightChild());
                parent.setRightChild(node.getLeftChild());
                node.setLeftChild(parent);
                node.setRightChild(grandParent);
                // adjust sums
                var grandParentLeftChildSum = grandParent.hasLeftChild() ? grandParent.getLeftChild().getSum() : 0;
                var grandParentRightChildSum = grandParent.hasRightChild() ? grandParent.getRightChild().getSum() : 0;
                var parentLeftChildSum = parent.hasLeftChild() ? parent.getLeftChild().getSum() : 0;
                var parentRightChildSum = parent.hasRightChild() ? parent.getRightChild().getSum() : 0;
                grandParent.setSum(grandParent.getKey() + grandParentLeftChildSum + grandParentRightChildSum);
                parent.setSum(parent.getKey() + parentLeftChildSum + parentRightChildSum);
                node.setSum(node.getKey() + grandParent.getSum() + parent.getSum());
            }
        };

        return SplayTree;
    })();

    ////////////////////////////////
    
    function rangeSum(from, to) {
        var left, middle, right, tmp, result;
        tmp = st.split(from, 'right');
        left = tmp[0];
        middle = tmp[1];
        tmp = middle.split(to, 'left');
        middle = tmp[0];
        right = tmp[1];
        result = middle.hasNodes() ? middle.getRoot().getSum() : 0;
        var leftMiddle = left.join(left, middle);
        st = leftMiddle.join(leftMiddle, right);
        return result;
    }
    
    ////////////////////////////////

    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';
    var data = fs.readFileSync(input, 'utf8');

    var lines = data.match(/[^\r\n]+/g);
    var numberOfOperations = lines[0];
    lines.shift();

    var st = new SplayTree();
    var M = 1000000001;
    var x = 0;

    for (var i = 0; i < numberOfOperations; i++) {
        var operation = lines[i].split(' ')[0];
        var value = (parseInt(lines[i].split(' ')[1]) + x) % M;
        if (typeof lines[i].split(' ')[2] !== 'undefined') {
            var value2 = (parseInt(lines[i].split(' ')[2]) + x) % M;
        }
        switch (operation) {
            case '+':
                st.insert(value);
                break;
            case '-':
                st.delete(value);
                break;
            case '?':
                var found = st.find(value) !== null ? 'Found' : 'Not found';
                console.log(found);
                break;
            case 's':
                x = rangeSum(value, value2);
                console.log(x);
                break;
            default:
                throw new Error('Invalid operation.');
        }
    }

})();
