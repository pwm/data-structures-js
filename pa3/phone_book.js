(function() { 'use strict';

    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';
    var data = fs.readFileSync(input, 'utf8');

    var lines = data.match(/[^\r\n]+/g);
    var numberOfOperations = lines.length;

    var phoneBook = [];

    for (var i = 1; i < numberOfOperations; i++) {
        var operation = lines[i].split(' ')[0];
        var phoneNumber = lines[i].split(' ')[1];
        var nonexistentEntry = 'not found';

        switch (operation) {
            case 'find':
                if (typeof phoneBook[phoneNumber] !== 'undefined') {
                    console.log(phoneBook[phoneNumber]);
                } else {
                    console.log(nonexistentEntry);
                }
                break;
            case 'add':
                var name = lines[i].split(' ')[2];
                phoneBook[phoneNumber] = name;
                break;
            case 'del':
                phoneBook[phoneNumber] = nonexistentEntry;
                break;
            default:
                throw new Error('Invalid operation.');
        }
    }

})();
