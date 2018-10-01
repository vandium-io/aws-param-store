'use strict';

var SSM = require('./ssm');

var readline = require('readline');

function handleError(error) {

    var err = Object.assign({}, error, { message: error.message });

    var resultObj = { success: false, err: err };

    console.log(JSON.stringify(resultObj));
}

var rl = readline.createInterface({

    input: process.stdin,
    output: process.stdout
});

rl.on('line', function (input) {

    try {

        var args = JSON.parse(input);

        var query = args[0];
        var options = args[1];

        return new SSM(options).getParameters(query).then(function (parameters) {

            console.log(JSON.stringify({ success: true, result: { parameters: parameters } }));
        }).catch(handleError);
    } catch (err) {

        handleError(err);
    } finally {

        rl.close();
    }
});