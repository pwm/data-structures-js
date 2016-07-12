(function () { 'use strict';

    var QueueNode = (function () {
        function QueueNode(key) {
            this.key = key;
            this.next = null;
        }

        QueueNode.prototype = {
            constructor: QueueNode,

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

        return QueueNode;
    })();

    var Queue = (function() {
        function Queue() {
            this.back = null;
            this.front = null;
            this.size = 0;
        }

        Queue.prototype = {
            constructor: Queue,

            enqueue: function (key) {
                var newNode = new QueueNode(key);
                if (this.back instanceof QueueNode) {
                    this.back.setNext(newNode);
                } else {
                    this.front = newNode;
                }
                this.back = newNode;
                this.size++;
            },

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
