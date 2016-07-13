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
            this.root = this._recursiveBuild(data);
        }

        BT.prototype = {
            constructor: BT,

            _recursiveBuild: function (data) {
                function buildRecursively(i) {
                    var node = new Node(data[i][0]);
                    var leftIndex = data[i][1];
                    if (leftIndex !== -1) {
                        var leftChild = buildRecursively(leftIndex);
                        node.setLeftChild(leftChild);
                        leftChild.setParent(node);
                    }
                    var rightIndex = data[i][2];
                    if (rightIndex !== -1) {
                        var rightChild = buildRecursively(rightIndex);
                        node.setRightChild(rightChild);
                        rightChild.setParent(node);
                    }
                    return node;
                }
                return buildRecursively(0);
            },

            _iterativeBuild: function (data) {
                //@todo
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

            iterativeInOrderTraversal: function () {
                var nodes = [];
                var stack = [];
                var currentNode = this.root;
                stack.push(currentNode);
                currentNode = currentNode.getLeftChild();
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

            iterativePreOrderTraversal: function () {
                var nodes = [];
                var stack = [];
                var currentNode = this.root;
                nodes.push(currentNode.getKey());
                stack.push(currentNode);
                currentNode = currentNode.getLeftChild();
                while (currentNode instanceof Node || stack.length > 0) {
                    while (currentNode instanceof Node) {
                        nodes.push(currentNode.getKey());
                        stack.push(currentNode);
                        currentNode = currentNode.getLeftChild();
                    }
                    if (stack.length > 0) {
                        var topNode = stack.pop();
                        currentNode = topNode.getRightChild();
                    }
                }
                return nodes;
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

            iterativePostOrderTraversal: function () {
                var nodes = [];
                var stack = [];
                var currentNode = this.root;
                stack.push(currentNode);
                currentNode = currentNode.getLeftChild();
                while (currentNode instanceof Node || stack.length > 0) {
                    while (currentNode instanceof Node) {
                        stack.push(currentNode);
                        currentNode = currentNode.getLeftChild();
                    }
                    if (stack.length > 0) {
                        var topNode = stack.pop();
                        currentNode = topNode.getRightChild();
                    }
                }
                return nodes;
            }
        };

        return BT;
    })();

    ////////////////////////////////

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

    console.log('recursive inOrder', bt.recursiveInOrderTraversal().join(' '));
    console.log('iterative inOrder', bt.iterativeInOrderTraversal().join(' '));
    console.log('recursive preOrder', bt.recursivePreOrderTraversal().join(' '));
    console.log('iterative preOrder', bt.iterativePreOrderTraversal().join(' '));
    console.log('recursive postOrder', bt.recursivePostOrderTraversal().join(' '));
    //console.log('iterative postOrder', bt.iterativePostOrderTraversal().join(' '));

})();
