(function() { 'use strict';

    /**
     * Node
     */
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

    /**
     * Binary search tree
     */
    var BST = (function () {
        function BST() {
            this.root = null;
        }

        BST.prototype = {
            constructor: BST,

            setRoot: function (root) {
                this.root = root;
            },

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
                if (parent.getKey() === key) { // trying to add an existing key
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
                if (node === null) { // trying to delete a non-existent key
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

            inOrderTraversal: function () {
                var nodes = [];
                (function inOrderTraversal(node) {
                    if (node === null) {
                        return;
                    }
                    inOrderTraversal(node.getLeftChild());
                    nodes.push(node.getKey());
                    inOrderTraversal(node.getRightChild());
                })(this.root);
                return nodes;
            },

            preOrderTraversal: function () {
                var nodes = [];
                (function preOrderTraversal (node) {
                    if (node === null) {
                        return;
                    }
                    nodes.push(node.getKey());
                    preOrderTraversal(node.getLeftChild());
                    preOrderTraversal(node.getRightChild());
                })(this.root);
                return nodes;
            },

            postOrderTraversal: function () {
                var nodes = [];
                (function postOrderTraversal (node) {
                    if (node === null) {
                        return;
                    }
                    postOrderTraversal(node.getLeftChild());
                    postOrderTraversal(node.getRightChild());
                    nodes.push(node.getKey());
                })(this.root);
                return nodes;
            }

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

    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';
    
    //var data = fs.readFileSync(input, 'utf8');
    //var lines = data.match(/[^\r\n]+/g);
    
    var bst = new BST();


    console.log(bst.inOrderTraversal().join(' '));
    console.log(bst.preOrderTraversal().join(' '));
    console.log(bst.postOrderTraversal().join(' '));

})();
