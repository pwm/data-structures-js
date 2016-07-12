(function() { 'use strict';

    var Stack = (function() {
        var top = null;

        var Node = function (data, next) {
            this.data = data;
            this.next = next;
        };

        var push = function (data) {
            top = new Node(data, top);
        };

        var pop = function () {
            if (isEmpty()) {
                throw new RangeError('Cannot pop empty stack.');
            }
            var topElement = top;
            top = top.next;
            return topElement.data;
        };

        var isEmpty = function () {
            return top === null;
        };

        return {
            push: push,
            pop: pop,
            isEmpty: isEmpty
        };
    });

    ///////////////////////////////////////////////

    function validateBrackets(data) {
        var stack = new Stack();
        for (var i = 0; i<data.length; i++) {
            if (data[i] === '(' || data[i] === '[' || data[i] === '{') {
                stack.push({'position': i + 1,'bracket': data[i]});
            } else if (data[i] === ')' || data[i] === ']' || data[i] === '}') {
                if (stack.isEmpty()) {
                    return i + 1;
                }
                var saved = stack.pop();
                if (data[i] === ')' && saved.bracket !== '(' ||
                    data[i] === ']' && saved.bracket !== '[' ||
                    data[i] === '}' && saved.bracket !== '{') {
                    return i + 1;
                }
            }
        }
        if (! stack.isEmpty()) {
            return stack.pop().position;
        } else {
            return 'Success';
        }
    }

    // from stdin
    if (process.argv.length === 2) {
        var readline = require('readline');
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });

        rl.on('line',function(line) {
            console.log(validateBrackets(line));
        });
    // from file
    } else if (process.argv.length === 3) {
        var fs = require('fs');
        fs.readFile(process.argv[2], 'utf8', function (error, data) {
            if (error) {
                return console.log(error);
            }
            console.log(validateBrackets(data));
        });
        // read sync and read answer and compare
    }

})();
