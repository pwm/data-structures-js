(function () { 'use strict';

    /**
     * Stack
     */
    var Stack = (function() {
        function Stack() {
            this.top = null;
            this.size = 0;
        }

        var Node = (function () {
            function Node(key) {
                this.key = key;
                this.next = null;
            }

            Node.prototype = {
                constructor: Node,

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

            return Node;
        })();

        Stack.prototype = {
            constructor: Stack,

            /**
             *
             * Top              Top                Top           Top
             *  |                |                  |             |
             *  v                v                  v             v
             *  O -> O   =>   O  O -> O   =>   O -> O -> O   =>   O -> O -> O
             * 
             */
            push: function (key) {
                this.top = (new Node(key)).setNext(this.top);
                this.size++;
            },

            /**
             *
             * Top                     Top                        Top
             *  |                       |                          |
             *  v                       v                          v
             *  O -> O -> O   =>   O -> O -> O   =(implicitly)=>   O -> O
             *
             * Implicitly, ie. we won't have a way to get to the "removed" node
             */
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
