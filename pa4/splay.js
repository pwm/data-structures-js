(function() { 'use strict';

    /**
     * Splay Tree
     *
     * All operations are O(log n) amortized time.
     */
    var SplayTree = (function () {
        function SplayTree() {
            this.root = null;
        }

        var Node = (function () {
            function Node(key) {
                this.key = key;
                this.parent = null;
                this.leftChild = null;
                this.rightChild = null;
            }

            Node.prototype = {
                constructor: Node,

                getKey: function () {
                    return this.key;
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
                    return ! this.isRoot();
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

            getHeight: function () {
                return (function _recurse(node) {
                    return node instanceof Node
                        ? 1 + Math.max(_recurse(node.getLeftChild()), _recurse(node.getRightChild()))
                        : 0;
                })(this.root);
            },

            getSize: function () {
                return (function _recurse(node) {
                    return node instanceof Node
                        ? 1 + _recurse(node.getLeftChild()) + _recurse(node.getRightChild())
                        : 0;
                })(this.root);
            },

            visualize: function () {
                var queue = [],
                    height = this.getHeight(),
                    size = this.getSize(),
                    levelCounter = 0,
                    currDepth = 1,
                    display = [];

                if (size > 20) {
                    console.log('Tree is too big to display');
                    return;
                }
                
                if (this.root instanceof Node) {
                    queue.push(this.root);
                    while (queue.length > 0) {
                        var nodeDisplayWidth = size < 10 ? 1 : 2;
                        var fullSpace = ' '.repeat(Math.pow(2,height - currDepth + 1) - 1).repeat(nodeDisplayWidth);
                        var halfSpace = ' '.repeat(Math.pow(2,height - currDepth) - 1).repeat(nodeDisplayWidth);
                        var displayNonexistentNode = ' '.repeat(nodeDisplayWidth);

                        var frontNode = queue.shift();

                        if (frontNode instanceof Node) {
                            var displayNode = frontNode.getKey();
                            if (nodeDisplayWidth === 2 && parseInt(displayNode)<=9) {
                                displayNode = ' ' + displayNode;
                            }
                            display[currDepth - 1] === undefined
                                ? display[currDepth - 1] = halfSpace + displayNode
                                : display[currDepth - 1] += fullSpace + displayNode;
                        } else {
                            display[currDepth - 1] === undefined
                                ? display[currDepth - 1] = halfSpace + displayNonexistentNode
                                : display[currDepth - 1] += fullSpace + displayNonexistentNode;
                        }

                        levelCounter++;
                        if (levelCounter === Math.pow(2,currDepth) - 1) {
                            currDepth++;
                        }

                        if (frontNode instanceof Node) {
                            queue.push(frontNode.getLeftChild());
                        } else if (currDepth < height) {
                            queue.push('noLeftChild');
                        }
                        if (frontNode instanceof Node) {
                            queue.push(frontNode.getRightChild());
                        } else if (currDepth < height) {
                            queue.push('noRightChild');
                        }
                    }
                }
                // display tree
                for (var i = 0; i < display.length; i++) {
                    if (/\S/.test(display[i])) {
                        console.log(display[i]);
                    }
                }
                console.log('--------');
            },

            find: function (key) {
                var node = this._getSelfOrParent(key, this.root);
                if (node.getKey() !== key) {
                    return null;
                }
                this._splay(node);
                return node;
            },

            insertFromArray: function (a) {
                var aLength = a.length;
                for (var i = 0; i < aLength; i++) {
                    this.insert(a[i]);
                }
            },

            insert: function (key) {
                var newNode = new Node(key);
                if (this.root === null) {
                    this._setRoot(newNode);
                    return;
                }
                var parent = this._getSelfOrParent(key, this.root);
                if (parent.getKey() === key) {
                    return;
                }
                newNode.setParent(parent);
                parent.getKey() > key
                    ? parent.setLeftChild(newNode)
                    : parent.setRightChild(newNode);
                this._splay(newNode);
            },

            delete: function (key) {
                var node = this.find(key);
                if (node === null) {
                    return;
                }
                // node has no children (ie. right child is null as well) or only has right child
                if (! node.hasLeftChild()) {
                    if (node.isRoot()) {
                        this._setRoot(node.getRightChild());
                    } else {
                        node.getKey() < node.getParent().getKey()
                            ? node.getParent().setLeftChild(node.getRightChild())
                            : node.getParent().setRightChild(node.getRightChild());
                        if (node.hasRightChild()) {
                            node.getRightChild().setParent(node.getParent());
                        }
                    }
                // node has only left child
                } else if (! node.hasRightChild()) {
                    if (node.isRoot()) {
                        this._setRoot(node.getLeftChild());
                    } else {
                        node.getKey() < node.getParent().getKey()
                            ? node.getParent().setLeftChild(node.getLeftChild())
                            : node.getParent().setRightChild(node.getLeftChild());
                        node.getLeftChild().setParent(node.getParent());
                    }
                // node has both children
                } else {
                    // never returns null as node is not the largest key (has right child)
                    // this also guarantees that nextLargestNode always has a parent
                    var nextLargestNode = this._getNextLargest(node);
                    // node's next largest is node's right child
                    if (node.getRightChild().getKey() === nextLargestNode.getKey()) {
                        if (node.isRoot()) {
                            this._setRoot(node.getRightChild());
                        } else {
                            node.getKey() < node.getParent().getKey()
                                ? node.getParent().setLeftChild(node.getRightChild())
                                : node.getParent().setRightChild(node.getRightChild());
                            node.getRightChild().setParent(node.getParent());
                        }
                        node.getLeftChild().setParent(node.getRightChild());
                        node.getRightChild().setLeftChild(node.getLeftChild());
                    // node's next largest is in node's right subtree
                    } else {
                        // replace nextLargestNode with its right child
                        nextLargestNode.getParent().setLeftChild(nextLargestNode.getRightChild());
                        if (nextLargestNode.hasRightChild()) {
                            nextLargestNode.getRightChild().setParent(nextLargestNode.getParent());
                        }
                        // replace node with nextLargestNode
                        if (node.getKey() === this.root.getKey()) { //@todo: node.isRoot() ?
                            this._setRoot(nextLargestNode);
                        } else {
                            node.getKey() < node.getParent().getKey()
                                ? node.getParent().setLeftChild(nextLargestNode)
                                : node.getParent().setRightChild(nextLargestNode);
                            nextLargestNode.setParent(node.getParent());
                        }
                        node.getRightChild().setParent(nextLargestNode);
                        node.getLeftChild().setParent(nextLargestNode);
                        nextLargestNode.setRightChild(node.getRightChild());
                        nextLargestNode.setLeftChild(node.getLeftChild());
                    }
                }
            },

            rangeSearch: function (keyFrom, keyTo) {
                var inRange = [],
                    currentNode = this._getSelfOrParent(keyFrom, this.root);
                // if currentNode is the largest then _getNextLargest will return null
                while (currentNode instanceof Node && currentNode.getKey() <= keyTo) {
                    // currentNode's key can be smaller than keyFrom
                    // because we might not have an exact hit
                    if (currentNode.getKey() >= keyFrom) {
                        inRange.push(currentNode.getKey());
                    }
                    currentNode = this._getNextLargest(currentNode);
                }
                return inRange;
            },

            join: function (leftTree, rightTree) {
                var newRoot = leftTree._getSelfOrParent(Number.MAX_SAFE_INTEGER, leftTree._getRoot());
                leftTree.delete(newRoot.getKey());
                this._joinWithRoot(leftTree, rightTree, newRoot);
            },

            split: function () {
                //@todo
            },

            _getRoot: function () {
                return this.root;
            },

            _setRoot: function (node) {
                this.root = node;
                if (node instanceof Node) {
                    node.setParent(null);
                }
            },

            _getSelfOrParent: function (key, node) {
                if (node.getKey() === key) {
                    return node;
                }

                if (node.getKey() > key) {
                    return node.hasLeftChild()
                        ? this._getSelfOrParent(key, node.getLeftChild())
                        : node;
                } else {
                    return node.hasRightChild()
                        ? this._getSelfOrParent(key, node.getRightChild())
                        : node;
                }
            },

            _getNextLargest: function (node) {
                return node.hasRightChild()
                    ? this._leftDescendant(node.getRightChild())
                    : this._rightAncestor(node);
            },

            _leftDescendant: function (node) {
                return node.hasLeftChild()
                    ? this._leftDescendant(node.getLeftChild())
                    : node;
            },

            _rightAncestor: function (node) {
                if (node.isRoot()) {
                    return null;
                }
                return node.getKey() < node.getParent().getKey()
                    ? node.getParent()
                    : this._rightAncestor(node.getParent());
            },

            _splay: function (node) {
                if (node.isRoot()) {
                    return;
                }

                // Node has no grand-parent, so we left rotate if it's a
                // right child or right rotate if it's a left child.
                if (! node.getParent().hasParent()) {
                    node.isLeftChild() ? this._rightRotation(node) : this._leftRotation(node);
                    this._setRoot(node);
                    return;
                }

                // Node has grand-parent
                var parent = node.getParent(),
                    grandParent = node.getParent().getParent();

                // node has great-grand-parent
                if (grandParent.hasParent()) {
                    node.getKey() < grandParent.getParent().getKey()
                        ? grandParent.getParent().setLeftChild(node)
                        : grandParent.getParent().setRightChild(node);
                }

                // Decide which of the 4 cases are we in
                if (node.isLeftChild() && node.getParent().isLeftChild()) {
                    this._zigZigRightRightRotation(node, parent, grandParent);
                } else if (node.isLeftChild() && node.getParent().isRightChild()) {
                    this._zigZagRightLeftRotation(node, parent, grandParent);
                } else if (node.isRightChild() && node.getParent().isRightChild()) {
                    this._zigZigLeftLeftRotation(node, parent, grandParent);
                } else {
                    this._zigZagLeftRightRotation(node, parent, grandParent);
                }

                // splay till node becomes root
                node.hasParent()
                    ? this._splay(node)
                    : this._setRoot(node);
            },

            _leftRotation: function (node) {
                node.getParent().setRightChild(node.getLeftChild());
                if (node.hasLeftChild()) {
                    node.getLeftChild().setParent(node.getParent());
                }
                node.getParent().setParent(node);
                node.setLeftChild(node.getParent());
            },

            _rightRotation: function (node) {
                node.getParent().setLeftChild(node.getRightChild());
                if (node.hasRightChild()) {
                    node.getRightChild().setParent(node.getParent());
                }
                node.getParent().setParent(node);
                node.setRightChild(node.getParent());
            },

            _zigZigRightRightRotation: function (node, parent, grandParent) {
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
            },

            _zigZigLeftLeftRotation: function (node, parent, grandParent) {
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
            },

            _zigZagRightLeftRotation: function (node, parent, grandParent) {
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
            },

            _zigZagLeftRightRotation: function (node, parent, grandParent) {
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
            },

            _joinWithRoot: function (leftTree, rightTree, root) {
                root.setLeftChild(leftTree._getRoot());
                root.setRightChild(rightTree._getRoot());
                leftTree._getRoot().setParent(root);
                rightTree._getRoot().setParent(root);
                this._setRoot(root);
            }
        };

        return SplayTree;
    })();

    ////////////////////////////////


    var splayTree = new SplayTree();
    splayTree.insertFromArray([8,4,12,2,6,1,3,5,7,10,14,9,11,13,15]);
    console.log('initial:'); splayTree.visualize();
    splayTree.insert(16);
    console.log('after insert:'); splayTree.visualize();
    splayTree.find(7);
    console.log('after find:'); splayTree.visualize();



})();
