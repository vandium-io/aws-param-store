'use strict';

const SSM = require( './ssm' );

function handleError( err ) {

    let resultObj = { success: false, err };

    console.log( JSON.stringify( resultObj ) );
    process.exit( 1 );
}

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
            .catch( handleError );
    }
    catch( err ) {

        handleError( err );
    }
});
