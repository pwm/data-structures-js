(function() { 'use strict';

    /**
     * Binary search tree
     */
    var BST = (function () {
        function BST() {
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
                }
            };

            return Node;
        })();

        BST.prototype = {
            constructor: BST,

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

                if (size > 99) {
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


                // fill the display array ends with whitespaces for fun
                // for (var i = 0; i < display.length; i++) {
                //     if (display[i].length < Math.pow(2, height) - 1) {
                //         display[i] += ' '.repeat(Math.pow(2, height) - 1 - display[i].length);
                //     }
                // }
                // display tree
                for (var i = 0; i < display.length; i++) {
                    if (/\S/.test(display[i])) {
                        console.log(display[i]);
                    }
                }
            },

            find: function (key) {
                var node = this._getSelfOrParent(key, this.root);
                return node.getKey() === key
                    ? node
                    : null;
            },

            insertFromArray: function (a) {
                var aLength = a.length;
                for (var i = 0; i < aLength; i++) {
                    this.insert(a[i]);
                }
            },

            insert: function (key) {
                if (this.root === null) {
                    this._setRoot(new Node(key));
                    return;
                }
                var parent = this._getSelfOrParent(key, this.root);
                if (parent.getKey() === key) {
                    return;
                }
                var newNode = new Node(key);
                newNode.setParent(parent);
                parent.getKey() > key
                    ? parent.setLeftChild(newNode)
                    : parent.setRightChild(newNode);
            },

            delete: function (key) {
                var node = this.find(key);
                if (node === null) {
                    return;
                }
                // node has no children (ie. right child is null as well) or only has right child
                if (node.getLeftChild() === null) {
                    if (node.getKey() === this.root.getKey()) {
                        this._setRoot(node.getRightChild());
                    } else {
                        node.getKey() < node.getParent().getKey()
                            ? node.getParent().setLeftChild(node.getRightChild())
                            : node.getParent().setRightChild(node.getRightChild());
                        if (node.getRightChild() instanceof Node) {
                            node.getRightChild().setParent(node.getParent());
                        }
                    }
                // node has only left child
                } else if (node.getRightChild() === null) {
                    if (node.getKey() === this.root.getKey()) {
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
                        if (node.getKey() === this.root.getKey()) {
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
                        if (nextLargestNode.getRightChild() instanceof Node) {
                            nextLargestNode.getRightChild().setParent(nextLargestNode.getParent());
                        }
                        // replace node with nextLargestNode
                        if (node.getKey() === this.root.getKey()) {
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
                    // because we might not have an exact _getSelfOrParent
                    if (currentNode.getKey() >= keyFrom) {
                        inRange.push(currentNode.getKey());
                    }
                    currentNode = this._getNextLargest(currentNode);
                }
                return inRange;
            },

            inOrderTraversal: function () {
                return (function _traverse(node, nodes) {
                    if (node === null) {
                        return nodes;
                    }
                    _traverse(node.getLeftChild(), nodes);
                    nodes.push(node.getKey());
                    _traverse(node.getRightChild(), nodes);
                    return nodes;
                })(this.root, []);
            },

            preOrderTraversal: function () {
                return (function _traverse(node, nodes) {
                    if (node === null) {
                        return nodes;
                    }
                    nodes.push(node.getKey());
                    _traverse(node.getLeftChild(), nodes);
                    _traverse(node.getRightChild(), nodes);
                    return nodes;
                })(this.root, []);
            },

            postOrderTraversal: function () {
                return (function _traverse(node, nodes) {
                    if (node === null) {
                        return nodes;
                    }
                    _traverse(node.getLeftChild(), nodes);
                    _traverse(node.getRightChild(), nodes);
                    nodes.push(node.getKey());
                    return nodes;
                })(this.root, []);
            },

            iterativeInOrderTraversal: function () {
                var nodes = [],
                    stack = [],
                    currentNode = this.root;
                while (currentNode instanceof Node || stack.length > 0) {
                    while (currentNode instanceof Node) {
                        stack.push(currentNode);
                        currentNode = currentNode.getLeftChild();
                    }
                    if (stack.length > 0) {
                        var topNode = stack.pop();
                        nodes.push(topNode.getKey());
                        currentNode = topNode.getRightChild();
                    }
                }
                return nodes;
            },

            iterativePreOrderTraversal: function () {
                var nodes = [],
                    stack = [],
                    currentNode = this.root;
                if (currentNode === null) {
                    return nodes;
                }
                stack.push(currentNode);
                while (stack.length > 0) {
                    currentNode = stack.pop();
                    nodes.push(currentNode.getKey());
                    if (currentNode.getRightChild() instanceof Node) {
                        stack.push(currentNode.getRightChild());
                    }
                    if (currentNode.getLeftChild() instanceof Node) {
                        stack.push(currentNode.getLeftChild());
                    }
                }
                return nodes;
            },

            iterativePostOrderTraversal: function () {
                var nodes = [],
                    stack = [],
                    currentNode = this.root;
                if (currentNode === null) {
                    return nodes;
                }
                stack.push(currentNode);
                while (stack.length > 0) {
                    currentNode = stack.pop();
                    nodes.push(currentNode.getKey());
                    if (currentNode.getLeftChild() instanceof Node) {
                        stack.push(currentNode.getLeftChild());
                    }
                    if (currentNode.getRightChild() instanceof Node) {
                        stack.push(currentNode.getRightChild());
                    }
                }
                return nodes.reverse();
            },

            levelTraversal: function () {
                var nodes = [],
                    queue = [];
                if (this.root === null) {
                    return nodes;
                }
                queue.push(this.root);
                while (queue.length > 0) {
                    var frontNode = queue.shift();
                    nodes.push(frontNode.getKey());
                    if (frontNode.getLeftChild() instanceof Node) {
                        queue.push(frontNode.getLeftChild());
                    }
                    if (frontNode.getRightChild() instanceof Node) {
                        queue.push(frontNode.getRightChild());
                    }
                }
                return nodes;
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
                } else if (node.getKey() > key) {
                    return node.getLeftChild() instanceof Node
                        ? this._getSelfOrParent(key, node.getLeftChild())
                        : node;
                } else if (node.getKey() < key) {
                    return node.getRightChild() instanceof Node
                        ? this._getSelfOrParent(key, node.getRightChild())
                        : node;
                }
            },

            _getNextLargest: function (node) {
                return node.getRightChild() instanceof Node
                    ? this._leftDescendant(node.getRightChild())
                    : this._rightAncestor(node);
            },

            _leftDescendant: function (node) {
                return node.getLeftChild() instanceof Node
                    ? this._leftDescendant(node.getLeftChild())
                    : node;
            },

            _rightAncestor: function (node) {
                if (node.getKey() === this.root.getKey()) {
                    return null;
                }
                return node.getKey() < node.getParent().getKey()
                    ? node.getParent()
                    : this._rightAncestor(node.getParent());
            }
        };

        return BST;
    })();

    ////////////////////////////////

    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
        return a;
    }

    function haveSomeFun() {
        var sleep = require('sleep');

        var size = 7;
        var a = [];
        for (var i = 1; i <= size; i++) {
            a.push(i);
        }
        while (true) {
            var bst = new BST();
            bst.insertFromArray(shuffle(a));
            bst.visualize();
            sleep.usleep(500000);
        }
    }

    ////////////////////////////////

    //haveSomeFun();


    var bst = new BST();

    //bst.insertFromArray([1, 2, 3, 4, 5, 6, 7]);
    bst.insertFromArray([2, 1, 4, 3, 10, 9, 5, 7, 6, 8, 12, 11, 13]);
    //bst.insert(1);
    bst.visualize(); console.log('----');

    bst.delete(4); bst.visualize(); console.log('----');
    //bst.delete(2); bst.visualize(); console.log('----');
    //bst.delete(1); bst.visualize(); console.log('----');

})();
