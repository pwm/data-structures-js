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
                return this;
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
            },

            insertFromArray: function (a) {
                var aLength = a.length;
                for (var i = 0; i < aLength; i++) {
                    this.insert(a[i]);
                }
                return this;
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
                    }
                    nextLargestNode.setLeftChild(node.getLeftChild());
                    this.setRoot(nextLargestNode);
                }
            },

            deleteFromArray: function (a) {
                var aLength = a.length;
                for (var i = 0; i < aLength; i++) {
                    this.delete(a[i]);
                }
            },

            rangeSearch: function (keyFrom, keyTo) {
                if (this.root === null) {
                    return [];
                }
                var inRange = [],
                    currentNode = this._getSelfOrParent(keyFrom);
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

            split: function (key) {
                var leftTree = new SplayTree(),
                    rightTree = new SplayTree();
                if (this.root === null) {
                    return [leftTree, rightTree];
                }
                var node = this._getSelfOrParent(key);
                //@todo: do we need this check? we can split on nonexistent key
                //if (node.getKey() !== key) { // not in the tree
                //    return;
                //}
                this._splay(node);
                if (node.hasRightChild()) {
                    rightTree.setRoot(node.getRightChild());
                    node.setRightChild(null);
                }
                leftTree.setRoot(node);
                return [leftTree, rightTree];
            },

            join: function (leftTree, rightTree) {
                if (leftTree.getRoot() === null && rightTree.getRoot() === null) {
                    return null;
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
                this.setRoot(newRoot);
                return this;
            },

            getRoot: function () {
                return this.root;
            },

            setRoot: function (node) {
                this.root = node;
                if (node instanceof Node) {
                    node.setParent(null);
                }
            },

            _getSelfOrParent: function (key, node) {
                node = typeof node !== 'undefined' ? node : this.root;
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
                return node.hasLeftChild()
                    ? this._leftDescendant(node.getLeftChild())
                    : node;
            },

            _rightDescendant: function (node) {
                return node.hasRightChild()
                    ? this._rightDescendant(node.getRightChild())
                    : node;
            },

            _leftAncestor: function (node) {
                if (node.isRoot()) {
                    return null;
                }
                return node.getKey() > node.getParent().getKey()
                    ? node.getParent()
                    : this._leftAncestor(node.getParent());
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
                    this.setRoot(node);
                    return;
                }

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

                // splay till node becomes root
                node.hasParent()
                    ? this._splay(node)
                    : this.setRoot(node);
            },

            _leftRotation: function (node) {
                var parent = node.getParent();
                parent.setRightChild(node.getLeftChild());
                if (node.hasLeftChild()) {
                    node.getLeftChild().setParent(parent);
                }
                parent.setParent(node);
                node.setLeftChild(parent);
            },

            _rightRotation: function (node) {
                var parent = node.getParent();
                parent.setLeftChild(node.getRightChild());
                if (node.hasRightChild()) {
                    node.getRightChild().setParent(parent);
                }
                parent.setParent(node);
                node.setRightChild(parent);
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
            }
        };

        return SplayTree;
    })();

    ////////////////////////////////

    var st = new SplayTree();
    st.insertFromArray([4,2,1,3,6,5,7]);
    st.find(4);
    st.visualize();

    console.log(st._getNextSmallest(st._getSelfOrParent(1)).getKey());

    process.exit();


    var splitFrom = 2, splitTo = 6;
    var tmp = st.split(1);
    var left = tmp[0];
    var middle = tmp[1];

    left.visualize();
    middle.visualize();


    tmp = middle.split(splitTo);
    middle = tmp[0];
    var right = tmp[1];

    middle.visualize();

    left.join(left, middle);
    left.join(left, right);
    left.visualize();

    process.exit();




    // empty tests
    console.log((new SplayTree()).find(3));
    (new SplayTree()).delete(3);
    console.log((new SplayTree()).rangeSearch(4,7));
    console.log((new SplayTree()).split(3));
    console.log((new SplayTree()).join(new SplayTree(), new SplayTree()));

    var st = new SplayTree();
    //st.insertFromArray([8,4,12,2,6,1,3,5,7,10,14,9,11,13,15]);
    st.insertFromArray([4,2,1,3,6,5,7]);
    st.visualize();
    st.find(6);
    st.find(5);
    st.visualize();
    st.deleteFromArray([4,7]);
    st.visualize();
    console.log(st.rangeSearch(4,7));


    var stL = (new SplayTree()).insertFromArray([4,2,3,1,5]);
    var stR = (new SplayTree()).insertFromArray([8,7,6,9,10]);
    stL.visualize();
    stR.visualize();
    (new SplayTree()).join(stL, new SplayTree()).visualize();
    (new SplayTree()).join(new SplayTree(), stR).visualize();
    var stj = (new SplayTree()).join(stL, stR).visualize();
    stj.delete(7);
    stj.visualize();

    var trees = stj.split(5);
    trees[0].visualize();
    trees[1].visualize();
    trees[0].find(3);
    trees[1].find(9);
    trees[0].visualize();
    trees[1].visualize();
    var newTree = (new SplayTree()).join(trees[0], trees[1]);
    newTree.visualize();
    newTree.deleteFromArray([6,4,5]);
    newTree.visualize();
    console.log(newTree.rangeSearch(2,8));


})();
