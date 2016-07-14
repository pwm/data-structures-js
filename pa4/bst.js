(function() { 'use strict';

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

            find: function (key) {
                var node = this._getSelfOrParent(key, this.root);
                return node.getKey() === key
                    ? node
                    : null;
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
                (parent.getKey() > key)
                    ? parent.setLeftChild(newNode)
                    : parent.setRightChild(newNode);
            },

            delete: function (key) {
                var node = this.find(key);
                if (node === null) {
                    return;
                }
                // Replace node with replaceNode
                // promote replaceNode.Right (replaceNode's parent becomes replaceNode.Right's parent)
                if (node.getRightChild() instanceof Node) {
                    var replaceNode = this._getNextLargest(node);
                    //@todo
                } else { // Remove node and promote its left child (if there is one) to its place
                    if (node === this.root) {
                        this._setRoot(node.getLeftChild());
                    } else {
                        node.getKey() > node.getParent().getKey()
                            ? node.getParent().setRightChild(node.getLeftChild())
                            : node.getParent().setLeftChild(node.getLeftChild());
                        if (node.getLeftChild() instanceof Node) {
                            node.getLeftChild().setParent(node.getParent());
                        }
                    }
                }
            },

            rangeSearch: function (keyFrom, keyTo) {
                var hits = [];
                var currentNode = this._getSelfOrParent(keyFrom, this.root);
                // if currentNode is the largest then _getNextLargest will return null
                while (currentNode instanceof Node && currentNode.getKey() <= keyTo) {
                    // currentNode's key can be smaller than keyFrom
                    // because we might not have an exact _getSelfOrParent
                    if (currentNode.getKey() >= keyFrom) {
                        hits.push(currentNode.getKey());
                    }
                    currentNode = this._getNextLargest(currentNode);
                }
                return hits;
            },

            recursiveInOrderTraversal: function () {
                function inOrderTraverse(node, nodes) {
                    if (node === null) {
                        return;
                    }
                    inOrderTraverse(node.getLeftChild(), nodes);
                    nodes.push(node.getKey());
                    inOrderTraverse(node.getRightChild(), nodes);
                    return nodes;
                }
                return inOrderTraverse(this.root, []);
            },

            recursivePreOrderTraversal: function () {
                function preOrderTraverse(node, nodes) {
                    if (node === null) {
                        return;
                    }
                    nodes.push(node.getKey());
                    preOrderTraverse(node.getLeftChild(), nodes);
                    preOrderTraverse(node.getRightChild(), nodes);
                    return nodes;
                }
                return preOrderTraverse(this.root, []);
            },

            recursivePostOrderTraversal: function () {
                function postOrderTraverse(node, nodes) {
                    if (node === null) {
                        return;
                    }
                    postOrderTraverse(node.getLeftChild(), nodes);
                    postOrderTraverse(node.getRightChild(), nodes);
                    nodes.push(node.getKey());
                    return nodes;
                }
                return postOrderTraverse(this.root, []);
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

            _setRoot: function (node) {
                this.root = node;
                node.setParent(null);
            },

            _getSelfOrParent: function (key, node) {
                if (node.getKey() === key) {
                    return node;
                } else if (node.getKey() > key) {
                    return (node.getLeftChild() instanceof Node)
                        ? this._getSelfOrParent(key, node.getLeftChild())
                        : node;
                } else if (node.getKey() < key) {
                    return (node.getRightChild() instanceof Node)
                        ? this._getSelfOrParent(key, node.getRightChild())
                        : node;
                }
            },

            _getNextLargest: function (node) {
                return (node.getRightChild() instanceof Node)
                    ? this._leftDescendant(node.getRightChild())
                    : this._rightAncestor(node);
            },

            _leftDescendant: function (node) {
                return (node.getLeftChild() instanceof Node)
                    ? this._leftDescendant(node.getLeftChild())
                    : node;
            },

            _rightAncestor: function (node) {
                if (node === this.root) {
                    return null;
                }
                return (node.getKey() < node.getParent().getKey())
                    ? node.getParent()
                    : this._rightAncestor(node.getParent());
            }
        };

        return BST;
    })();

    ////////////////////////////////
    
    var bst = new BST();

    bst.insert(3);
    bst.insert(1);
    bst.insert(5);
    bst.insert(2);
    bst.insert(4);

    console.log('recursiveInOrder:', bst.recursiveInOrderTraversal().join(' ')); // 1 2 3 4 5
    console.log('iterativeInOrder:', bst.iterativeInOrderTraversal().join(' ')); // 1 2 3 4 5
    console.log('recursivePreOrder:', bst.recursivePreOrderTraversal().join(' ')); // 3 1 2 5 4
    console.log('iterativePreOrder:', bst.iterativePreOrderTraversal().join(' ')); // 3 1 2 5 4
    console.log('recursivePostOrder:', bst.recursivePostOrderTraversal().join(' ')); // 2 1 4 5 3
    console.log('iterativePostOrder:', bst.iterativePostOrderTraversal().join(' ')); // 2 1 4 5 3

    console.log('find 2:', bst.find(2).getKey()); // 2
    console.log('range(2, 4):', bst.rangeSearch(2, 4).join(' ')); // 2 3 4

    bst.delete(2);
    bst.delete(4);

    console.log('find 2 after deleting 2:', bst.find(2)); // null
    console.log('range(2, 4) after deleting 2 and 4:', bst.rangeSearch(2, 4).join(' ')); // 3

})();
