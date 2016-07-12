(function(){ 'use strict';

    /**
     * Node of a doubly linked list
     */
    var Node = (function () {
        function Node(key) {
            this.key = key;
            this.next = null;
            this.prev = null;
        }

        Node.prototype = {
            constructor: Node,

            setNext: function (node) {
                this.next = node;
                return this;
            },

            setPrev: function (node) {
                this.prev = node;
                return this;
            },

            getNext: function () {
                return this.next;
            },

            getPrev: function () {
                return this.prev;
            },

            getKey: function () {
                return this.key;
            }
        };

        return Node;
    })();

    /**
     * Doubly linked list
     */
    var List = (function () {
        function List() {
            this._init();
        }
        
        List.prototype = {
            constructor: List,
            
            prepend: function (key) {
                var newNode = new Node(key); // next and prev are null by default
                if (this.head !== null) {
                    newNode.setNext(this.head);
                    this.head.setPrev(newNode);
                }
                this.head = newNode;
                if (this.tail === null) {
                    this.tail = newNode;
                }
                this.size++;
            },

            find: function (key) {
                var node = this.head;
                if (node === null) {
                    return false;
                }
                do {
                    if (node.getKey() === key) {
                        return true;
                    }
                } while ((node = node.getNext()) !== null);
                return false;
            },

            remove: function (key) {
                if (this.head === null) {
                    return;
                }
                var node = this.head;
                do {
                    if (node.getKey() === key) {
                        var prevNode = node.getPrev();
                        var nextNode = node.getNext();
                        if (prevNode !== null && nextNode !== null) {
                            prevNode.setNext(nextNode);
                            nextNode.setPrev(prevNode);
                            this.size--;
                        } else if (nextNode !== null) {
                            nextNode.setPrev(prevNode);
                            this.head = nextNode;
                            this.size--;
                        } else if (prevNode !== null) {
                            prevNode.setNext(nextNode);
                            this.tail = prevNode;
                            this.size--;
                        } else {
                            this._init();
                        }
                        break;
                    }
                } while ((node = node.getNext()) !== null);
            },

            getSize: function () {
                return this.size;
            },

            _init: function () {
                this.head = null;
                this.tail = null;
                this.size = 0;
            }
        };
        
        return List;
    })();

    /**
     * Hash table
     */
    var HashTable = (function () {
        function HashTable (slots) {
            this.array = [];
            this.slots = slots;
            this.prime = 1000000007;
            this.x = 263;
            this._initSlots();
        }

        HashTable.prototype = {
            constructor: HashTable,

            add: function (string) {
                var slot = this._polyHash(string);
                var list = this.array[slot];
                if (list.find(string)) {
                    return;
                }
                list.prepend(string);
                this.array[slot] = list;
            },

            del: function (string) {
                var slot = this._polyHash(string);
                var list = this.array[slot];
                list.remove(string);
                this.array[slot] = list;
            },

            find: function (string) {
                var slot = this._polyHash(string);
                var list = this.array[slot];
                return list.find(string);
            },

            check: function (slot) {
                var list = this.array[parseInt(slot)];
                var output = '';
                if (list.getSize() === 0) {
                    return output;
                }
                var node = list.head;
                do {
                    output += node.getKey() + ' ';
                } while ((node = node.getNext()) !== null);
                return output.slice(0, -1);
            },

            _initSlots: function () {
                for (var i = 0; i < this.slots; i++) {
                    this.array[i] = new List();
                }
            },

            _polyHash: function (string) {
                var hash = 0;
                for (var i = string.length - 1; i >= 0; i--) {
                    hash = (hash * this.x + string.charCodeAt(i)) % this.prime;
                    //hash = ((hash * this.x + string.charCodeAt(i)) % this.prime + this.prime) % this.prime;
                }
                return hash % this.slots;
            }
        };

        return HashTable;
    })();
    
    ////////////////////////////////

    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';
    var data = fs.readFileSync(input, 'utf8');

    var lines = data.match(/[^\r\n]+/g);
    var numberOfSlots = lines[0];
    var numberOfOperations = lines[1];
    lines.shift();
    lines.shift();

    var hashTable = new HashTable(numberOfSlots);

    for (var i = 0; i < numberOfOperations; i++) {
        var operation = lines[i].split(' ')[0];
        var payload = lines[i].split(' ')[1];

        switch (operation) {
            case 'add':
                hashTable.add(payload);
                break;
            case 'del':
                hashTable.del(payload);
                break;
            case 'find':
                console.log(hashTable.find(payload) === true ? 'yes' : 'no');
                break;
            case 'check':
                console.log(hashTable.check(payload));
                break;
            default:
                throw new Error('Invalid operation.');
        }
    }

})();
