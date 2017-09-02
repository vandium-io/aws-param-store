'use strict';

const SSM = require( './ssm' );

let input = '';

process.stdin.setEncoding( 'utf8' );

process.stdin.on( 'readable', () => {

    let chunk = process.stdin.read();

    if( chunk ) {

        input+= chunk;
    }
});

process.stdin.on( 'end', () => {

    try {

        let query = JSON.parse( input );

        return new SSM().getParameters( query )
            .then( (parameters) => {

                console.log( JSON.stringify( { success: true, result: { parameters } } ) );
                process.exit( 0 );
            })
            .catch( (error) => {

                let resultObj = { success: false, err: { message: error.message, message: error.stacktrace } };

                console.log( JSON.stringify( resultObj ) );
                process.exit( 1 );

            });
    }
    catch( err ) {

        let resultObj = { success: false, err: { message: err.message, message: err.stacktrace } };

        console.log( JSON.stringify( resultObj ) );
        process.exit( 1 );
    }
});
