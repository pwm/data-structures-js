(function() { 'use strict';

    var BT = (function () {
        function BT(data) {
            this.data = data;
        }

        BT.prototype = {
            constructor: BT,

            iterativeInOrderTraversal: function () {
                var nodes = [],
                    stack = [],
                    currentNode = this.data[0];
                while (currentNode !== undefined || stack.length > 0) {
                    while (currentNode !== undefined) {
                        stack.push(currentNode);
                        currentNode = this.data[currentNode[1]];
                    }
                    if (stack.length > 0) {
                        var topNode = stack.pop();
                        nodes.push(topNode[0]);
                        currentNode = this.data[topNode[2]];
                    }
                }
                return nodes;
            },

            iterativePreOrderTraversal: function () {
                var nodes = [],
                    stack = [],
                    currentNode = this.data[0];
                stack.push(currentNode);
                while (stack.length > 0) {
                    currentNode = stack.pop();
                    nodes.push(currentNode[0]);
                    if (this.data[currentNode[2]] !== undefined) {
                        stack.push(this.data[currentNode[2]]);
                    }
                    if (this.data[currentNode[1]] !== undefined) {
                        stack.push(this.data[currentNode[1]]);
                    }
                }
                return nodes;
            },

            iterativePostOrderTraversal: function () {
                var nodes = [],
                    stack = [],
                    currentNode = this.data[0];
                stack.push(currentNode);
                while (stack.length > 0) {
                    currentNode = stack.pop();
                    nodes.push(currentNode[0]);
                    if (this.data[currentNode[1]] !== undefined) {
                        stack.push(this.data[currentNode[1]]);
                    }
                    if (this.data[currentNode[2]] !== undefined) {
                        stack.push(this.data[currentNode[2]]);
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
    console.log(bt.iterativeInOrderTraversal().join(' '));
    console.log(bt.iterativePreOrderTraversal().join(' '));
    console.log(bt.iterativePostOrderTraversal().join(' '));

})();
