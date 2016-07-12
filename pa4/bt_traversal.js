(function() { 'use strict';

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

    var BT = (function () {
        function BT(data) {
            this.root = this._buildTree(data);
        }

        BT.prototype = {
            constructor: BT,

            _buildTree: function (data) {
                function recursiveBuild(i) {
                    var node = new Node(data[i][0]);
                    var leftIndex = data[i][1];
                    if (leftIndex !== -1) {
                        var leftChild = recursiveBuild(leftIndex);
                        node.setLeftChild(leftChild);
                        leftChild.setParent(node);
                    }
                    var rightIndex = data[i][2];
                    if (rightIndex !== -1) {
                        var rightChild = recursiveBuild(rightIndex);
                        node.setRightChild(rightChild);
                        rightChild.setParent(node);
                    }
                    return node;
                }
                return recursiveBuild(0);
            },

            inOrderTraversal: function () {
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

            preOrderTraversal: function () {
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

            postOrderTraversal: function () {
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
            }
        };

        return BT;
    })();

    ////////////////////////////////

    /*
     1) Create an empty stack S.
     2) Initialize current node as root
     3) Push the current node to S and set current = current->left until current is NULL
     4) If current is NULL and stack is not empty then
     a) Pop the top item from stack.
     b) Print the popped item, set current = popped_item->right
     c) Go to step 3.
     5) If current is NULL and stack is empty then we are done.
     */

    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';
    
    var data = fs.readFileSync(input, 'utf8');
    var lines = data.match(/[^\r\n]+/g);

    lines.shift();
    data = lines.map(function (line) {
        return line.split(' ').map(function (number) {
            return parseInt(number);
        });
    });

    var bt = new BT(data);

    console.log(bt.inOrderTraversal().join(' '));
    console.log(bt.preOrderTraversal().join(' '));
    console.log(bt.postOrderTraversal().join(' '));

})();
