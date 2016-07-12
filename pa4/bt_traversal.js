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
            this.data = data;
            this.root = this.build(0);
        }

        BT.prototype = {
            constructor: BT,

            build: function (i) {
                var node = new Node(this.data[i][0]);

                var leftIndex = this.data[i][1];
                if (leftIndex !== -1) {
                    var leftChild = this.build(leftIndex);
                    node.setLeftChild(leftChild);
                    leftChild.setParent(node);
                }

                var rightIndex = this.data[i][2];
                if (rightIndex !== -1) {
                    var rightChild = this.build(rightIndex);
                    node.setRightChild(rightChild);
                    rightChild.setParent(node);
                }

                return node;
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
        };

        return BT;
    })();

    ////////////////////////////////

    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';
    
    var data = fs.readFileSync(input, 'utf8');
    var lines = data.match(/[^\r\n]+/g);

    lines.shift();
    data = lines.map(function (line) { return line.split(' ').map(function (number) { return parseInt(number); }); });

    var bt = new BT(data);

    console.log(bt.inOrderTraversal().join(' '));
    console.log(bt.preOrderTraversal().join(' '));
    console.log(bt.postOrderTraversal().join(' '));

})();
