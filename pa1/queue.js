(function () { 'use strict';

    var Queue = (function() {
        function Queue() {
            this.back = null;
            this.front = null;
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

        Queue.prototype = {
            constructor: Queue,

            /**
             *
             * F    B        F    B           F    B             F         B
             * |    |        |    |           |    |             |         |
             * v    v        v    v           v    v             v         v
             * O -> O   =>   O -> O  O   =>   O -> O -> O   =>   O -> O -> O
             *
             */
            enqueue: function (key) {
                var newNode = new Node(key);
                if (this.back instanceof Node) {
                    this.back.setNext(newNode);
                } else {
                    this.front = newNode;
                }
                this.back = newNode;
                this.size++;
            },

            /**
             * F         B             B    F                     B    F
             * |         |             |    |                     |    |
             * v         v             v    v                     v    v
             * O -> O -> O   =>   O -> O -> O   =(implicitly)=>   O -> O
             *
             * Implicitly, ie. we won't have a way to get to the "removed" node
             */
            dequeue: function () {
                if (this.isEmpty()) {
                    return;
                }
                var frontNode = this.front;
                this.front = this.front.getNext();
                return frontNode.getKey();
            },

            isEmpty: function () {
                return this.size === 0;
            },

            getSize: function () {
                return this.size;
            }
        };

        return Queue;
    })();

    ////////////////////////////////
    
    var queue = new Queue();
    
    console.log('empty:', queue.isEmpty()); // true
    console.log('size:', queue.getSize()); // 0

    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    console.log('empty:', queue.isEmpty()); // false
    console.log('size:', queue.getSize()); // 3

    console.log(queue.dequeue()); // 1
    console.log(queue.dequeue()); // 2
    console.log(queue.dequeue()); // 3
    
    console.log('empty:', queue.isEmpty()); // true
    console.log('size:', queue.getSize()); // 0

})();
