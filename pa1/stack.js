(function () { 'use strict';

    var StackNode = (function () {
        function StackNode(key) {
            this.key = key;
            this.next = null;
        }

        StackNode.prototype = {
            constructor: StackNode,

            setNext: function (node) {
                this.next = node;
                return this;
            },
            
            getNext: function () {
                return this.next;
            },

            getKey: function () {
                return this.key;
            }
        };

        return StackNode;
    })();

    var Stack = (function() {
        function Stack() {
            this.top = null;
            this.size = 0;
        }

        Stack.prototype = {
            constructor: Stack,

            push: function (key) {
                this.top = (new StackNode(key)).setNext(this.top);
                this.size++;
            },

            pop: function () {
                if (this.isEmpty()) {
                    return;
                }
                var topNode = this.top;
                this.top = this.top.getNext();
                return topNode.getKey();
            },

            isEmpty: function () {
                return this.size === 0;
            },

            getSize: function () {
                return this.size;
            }
        };

        return Stack;
    })();

    ////////////////////////////////
    
    var stack = new Stack();
    
    console.log('empty:', stack.isEmpty()); // true
    console.log('size:', stack.getSize()); // 0
    
    stack.push(1);
    stack.push(2);
    stack.push(3);

    console.log('empty:', stack.isEmpty()); // false
    console.log('size:', stack.getSize()); // 3

    console.log(stack.pop()); // 3
    console.log(stack.pop()); // 2
    console.log(stack.pop()); // 1
    
    console.log('empty:', stack.isEmpty()); // true
    console.log('size:', stack.getSize()); // 0

})();
