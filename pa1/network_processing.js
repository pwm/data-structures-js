(function () { 'use strict';

    var Processor = (function () {
        function Processor(maxBufferSize) {
            this.startTimes = [];
            this._buffer = [];
            this._maxBufferSize = parseInt(maxBufferSize);
            this._now = 0;
            this._processorTime = 0;
            this._packetCounter = -1;
            this._droppedMarker = -1;
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
                var incomingPacket = new Packet(++this._packetCounter, arrivalTime, processingTime);
                this._now = incomingPacket.getArrivalTime();

                // try saving incomingPacket to buffer if there is space
                if (this.bufferHasSpace()) {
                    this._buffer.push(incomingPacket);
                }

                // process packets till we reach "now"
                this.process(incomingPacket);

                // try saving incomingPacket again
                if (! this.isPacketAlreadyProcessed(incomingPacket) && ! this.isLastAddedPacket(incomingPacket)) {
                    if (this.bufferHasSpace()) { // space opened up
                        this._buffer.push(incomingPacket);
                    } else { // still no space
                        this.dropPacket(incomingPacket);
                    }
                }
            },

            processRemaining: function () {
                do {
                    this._now += 100000;
                    this.process();
                } while (this.bufferHasPackets());
            },

            process: function (incomingPacket) {
                while (this.bufferHasPackets() && this._processorTime <= this._now) {
                    var packetToProcess = this.getCurrentPacket();
                    // new packet the processor about to start working on
                    if (! this.isPacketBeingProcessed(packetToProcess)) {
                        // new packet arrived after some idle processor time => fast forward to "now"
                        if (incomingPacket instanceof Packet && this.isCurrentPacket(incomingPacket) && this._processorTime < this._now) {
                            this._processorTime = this._now;
                        }
                        // start working on packet
                        this.startTimes[packetToProcess.getId()] = this._processorTime;
                        // when the processor is next available
                        this._processorTime += packetToProcess.getProcessingTime();
                    }
                    // packet has been processed => remove it from the _buffer
                    if (this._processorTime <= this._now) {
                        this._buffer.shift();
                    }
                }
                // _buffer empty => we might have idle processor time left => fast forward to "now"
                if (! this.bufferHasPackets()) {
                    this._processorTime = this._now;
                }
            },

            bufferHasPackets: function () {
                return this._buffer.length > 0;
            },

            bufferHasSpace: function () {
                return this._buffer.length < this._maxBufferSize;
            },

            isCurrentPacket: function (packet) {
                return packet === this.getCurrentPacket();
            },

            isPacketBeingProcessed: function (packet) {
                return this.isCurrentPacket(packet) && this.startTimes[packet.getId()] !== undefined;
            },

            isPacketAlreadyProcessed: function (packet) {
                return ! this.isCurrentPacket(packet) && this.startTimes[packet.getId()] !== undefined;
            },

            isLastAddedPacket: function (packet) {
                return packet === this.getLastAddedPacket();
            },

            getCurrentPacket: function () {
                return this.bufferHasPackets() ? this._buffer[0] : null;
            },

            getLastAddedPacket: function () {
                return this.bufferHasPackets() ? this._buffer[this._buffer.length - 1] : null;
            },

            dropPacket: function (packet) {
                this.startTimes[packet.getId()] = this._droppedMarker;
            }
        };

        return Processor;
    })();

    ////////////////////////////////
    
    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';
    var data = fs.readFileSync(input, 'utf8');

    var lines = data.match(/[^\r\n]+/g);
    var maxBufferSize = lines[0].split(' ')[0];
    var numberOfPackets = lines[0].split(' ')[1];
    lines.shift();

    var processor = new Processor(maxBufferSize);
    for (var i = 0; i < numberOfPackets; i++) {
        var arrivalTime = lines[i].split(' ')[0];
        var processingTime = lines[i].split(' ')[1];
        processor.accept(arrivalTime, processingTime);
    }
    processor.processRemaining();

    for (var j = 0; j < processor.startTimes.length; j++) {
        console.log(processor.startTimes[j]);
    }

})();
