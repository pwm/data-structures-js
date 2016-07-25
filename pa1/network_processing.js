(function () { 'use strict';

    var Processor = (function () {
        function Processor(bufferSize) {
            this.bufferSize = parseInt(bufferSize);
            this.buffer = [];
            this.startTimes = [];
            this._time = 0;
            this._processorTime = 0;
            this.counter = -1;
        }

        var Packet = (function () {
            function Packet(id, arrivalTime, processingTime) {
                this.id = id;
                this.arrivalTime = parseInt(arrivalTime);
                this.processingTime = parseInt(processingTime);
            }
            Packet.prototype = {
                constructor: Packet,
                getId: function () {
                    return this.id;
                },
                getArrivalTime: function () {
                    return this.arrivalTime;
                },
                getProcessingTime: function () {
                    return this.processingTime;
                }
            };
            return Packet;
        })();

        Processor.prototype = {
            constructor: Processor,

            accept: function (arrivalTime, processingTime) {
                // process previous packets in buffer
                this.process(null);

                var incomingPacket = new Packet(++this.counter, arrivalTime, processingTime);

                // real time when current packet arrives
                this._time = incomingPacket.getArrivalTime();
                // there were no incoming packet for a while => idle processor time => adjust
                if (this.isBufferEmpty() && this._processorTime < this._time) {
                    this._processorTime = this._time;
                }

                // try saving incomingPacket to buffer if there is space (and it's not in buffer?)
                if (this.buffer.length < this.bufferSize) {
                    this.buffer.push(incomingPacket);
                }

                // process packets
                this.process(incomingPacket);

                if (! this.isProcessedPacket(incomingPacket)) {
                    // not processed and not in buffer
                    if (! this.isLastAddedPacket(incomingPacket)) {
                        // space opened up => add to buffer
                        if (this.buffer.length < this.bufferSize) {
                            this.buffer.push(incomingPacket);
                        // no space => drop packet
                        } else {
                            this.startTimes[incomingPacket.getId()] = - 1;
                        }
                    }
                }

                // process packets
                //this.process(null);
            },

            processRemaining: function () {
                // make sure that this is past everything
                this._time = 100000000;
                this.process(null);
            },

            process: function (incomingPacket) {
                while (! this.isBufferEmpty() && this._processorTime <= this._time) {
                    var currentPacket = this.getCurrentPacket();

                    if (this.startTimes[currentPacket.getId()] === undefined) {
                        // processing new packet => idle processor time => adjust
                        if (this.buffer.length === 1 && incomingPacket === currentPacket && this._processorTime < this._time) {
                            this._processorTime = this._time;
                        }
                        this.startTimes[currentPacket.getId()] = this._processorTime;
                        // next available processor time
                        this._processorTime += currentPacket.getProcessingTime();
                    }

                    // packet processed => remove from buffer
                    if (this._processorTime <= this._time) {
                        this.buffer.shift();
                    }
                }
                // buffer got empty => idle processor time => adjust
                if (this._processorTime < this._time) {
                    this._processorTime = this._time;
                }
            },

            isBufferEmpty: function () {
                return this.buffer.length === 0;
            },

            isProcessedPacket: function (packet) {
                return this.startTimes[packet.getId()] !== undefined && this.getCurrentPacket() !== packet;
            },

            isLastAddedPacket: function (packet) {
                return packet === this.getLastAddedPacket();
            },

            getCurrentPacket: function () {
                return this.buffer.length > 0 ? this.buffer[0] : null;
            },

            getLastAddedPacket: function () {
                return this.buffer.length > 0 ? this.buffer[this.buffer.length - 1] : null;
            }
        };

        return Processor;
    })();

    ////////////////////////////////
    
    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';
    var data = fs.readFileSync(input, 'utf8');

    var lines = data.match(/[^\r\n]+/g);
    var bufferSize = lines[0].split(' ')[0];
    var numberOfPackets = lines[0].split(' ')[1];
    lines.shift();

    var processor = new Processor(bufferSize);

    for (var i = 0; i < numberOfPackets; i++) {
        var arrivalTime = lines[i].split(' ')[0];
        var processingTime = lines[i].split(' ')[1];
        // accept incoming packets and process
        processor.accept(arrivalTime, processingTime);
    }
    // process remaining packets
    processor.processRemaining();

    for (var j = 0; j < processor.startTimes.length; j++) {
        console.log(processor.startTimes[j]);
    }

})();
