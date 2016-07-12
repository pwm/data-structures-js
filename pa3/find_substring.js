(function() { 'use strict';

    var PrimeFinder = (function () {
        function PrimeFinder() {
            this.maxNumber = Number.MAX_SAFE_INTEGER;
        }

        PrimeFinder.prototype = {
            constructor: PrimeFinder,

            findGreaterThan: function (number) {
                number = parseInt(number);
                if (number > this.maxNumber) {
                    throw new Error('Exceeded MAX_SAFE_INTEGER.');
                }
                while (this._isPrime(number) === false) {
                    number++;
                }
                return number;
            },

            _isPrime: function (number) {
                var sqrtX = Math.ceil(Math.sqrt(number));
                if (number === 2) {
                    return true;
                }
                var c = 2;
                while (c <= sqrtX) {
                    if (number % c === 0) {
                        return false;
                    }
                    c++;
                }
                return true;
            }
        };

        return PrimeFinder;
    })();

    var RabinKarp = (function () {
        function RabinKarp(text) {
            this.text = text;
            this.textLength = this.text.length;
            this.x = 7; // random number between 0 and this.textLength - 1
        }

        RabinKarp.prototype = {
            constructor: RabinKarp,

            findPattern: function (pattern) {
                this._initUsingPattern(pattern);

                var matchPositions = [];
                for (var i = 0; i <= this.textLength - this.patternLength; i++) {
                    if (this.precomputedHashes[i] !== this.patternHash) {
                        continue;
                    }
                    var currentTextSubstring = this.text.substring(i, i + this.patternLength);
                    if (this._areEqual(this.pattern, currentTextSubstring)) {
                        matchPositions.push(i);
                    }
                }
                return matchPositions;
            },

            _initUsingPattern: function (pattern) {
                this.pattern = pattern;
                this.patternLength = this.pattern.length;
                this.prime = this._generatePrime();
                this.patternHash = this._polyHash(pattern);
                this.precomputedHashes = this._precomputeHashes();
            },

            _generatePrime: function () {
                return (new PrimeFinder()).findGreaterThan(this.patternLength * this.textLength * 1000);
            },

            _polyHash: function (string) {
                var hash = 0;
                var stringLength = string.length;
                for (var i = stringLength - 1; i >= 0; i--) {
                    hash = ((hash * this.x + string.charCodeAt(i)) % this.prime + this.prime) % this.prime;
                }
                return hash;
            },

            _precomputeHashes: function () {
                var precomputedHashes = [];
                var lastPatternLengthSubstring = this.text.substring(this.textLength - this.patternLength, this.textLength);
                precomputedHashes[this.textLength - this.patternLength] = this._polyHash(lastPatternLengthSubstring);
                var y = 1;
                for (var i = 1; i <= this.patternLength; i++) {
                    y = (y * this.x) % this.prime;
                }
                for (i = this.textLength - this.patternLength - 1; i >= 0; i--) {
                    var startChar = this.text.charCodeAt(i);
                    var endChar = this.text.charCodeAt(i + this.patternLength);
                    precomputedHashes[i] =
                        (this.x * precomputedHashes[i + 1] +
                        ((startChar - y * endChar) % this.prime + this.prime) % this.prime
                        ) % this.prime;
                }
                return precomputedHashes;
            },

            _areEqual: function (stringA, stringB) {
                var lengthA = stringA.length;
                var lengthB = stringB.length;
                if (lengthA !== lengthB) {
                    return false;
                }
                for (var i = 0; i < lengthA; i++) {
                    if (stringA[i] !== stringB[i]) {
                        return false;
                    }
                }
                return true;
            }
        };

        return RabinKarp;
    })();

    ////////////////////////////////

    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';

    console.time('load');
    var data = fs.readFileSync(input, 'utf8');
    var lines = data.match(/[^\r\n]+/g);
    var pattern = lines[0];
    var text = lines[1];
    console.timeEnd('load');

    console.time('work');
    //var results = text.match(new RegExp(pattern, 'g'));
    var results = (new RabinKarp(text)).findPattern(pattern);
    console.timeEnd('work');

    console.log();
    console.log('pattern:', pattern);
    console.log('text size:', (text.length / 1024 / 1024).toPrecision(2), 'MiB');
    console.log('pattern occurrences:', results.length);

})();
