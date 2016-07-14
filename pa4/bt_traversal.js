(function() { 'use strict';

    var BT = (function () {
        function BT(data) {
            this.root = this._recursiveBuild(data);
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

        BT.prototype = {
            constructor: BT,

            _recursiveBuild: function (data) {
                var nodes = [];
                function buildRecursively(i) {
                    var node = new Node(data[i][0]),
                        leftIndex = data[i][1],
                        rightIndex = data[i][2];
                    //nodes.push(node.getKey()); // preOrder
                    if (leftIndex !== -1) {
                        var leftChild = buildRecursively(leftIndex);
                        node.setLeftChild(leftChild);
                        leftChild.setParent(node);
                    }
                    //nodes.push(node.getKey()); // inOrder
                    if (rightIndex !== -1) {
                        var rightChild = buildRecursively(rightIndex);
                        node.setRightChild(rightChild);
                        rightChild.setParent(node);
                    }
                    //nodes.push(node.getKey()); // postOrder
                    return node;
                }
                var res = buildRecursively(0);
                console.log(nodes.join(' '));
                return res;
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

    //console.log(bt.recursiveInOrderTraversal().join(' '));
    console.log(bt.iterativeInOrderTraversal().join(' '));
    //console.log(bt.recursivePreOrderTraversal().join(' '));
    console.log(bt.iterativePreOrderTraversal().join(' '));
    //console.log(bt.recursivePostOrderTraversal().join(' '));
    console.log(bt.iterativePostOrderTraversal().join(' '));

})();
