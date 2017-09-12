'use strict';

const SSM = require( './ssm' );

const readline = require( 'readline' );

function handleError( error ) {

    let err = Object.assign( {}, error, { message: error.message } );

    let resultObj = { success: false, err };

    console.log( JSON.stringify( resultObj ) );
}

const rl = readline.createInterface( {

  input: process.stdin,
  output: process.stdout
});

rl.on( 'line', (input) => {

    try {

        let query = JSON.parse( input );

        return new SSM().getParameters( query )
            .then( (parameters) => {

                console.log( JSON.stringify( { success: true, result: { parameters } } ) );
            })
            .catch( handleError );
    }
    catch( err ) {

        handleError( err );
    }
    finally {

        rl.close();
    }
});
