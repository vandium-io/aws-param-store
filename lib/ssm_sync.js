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

        let args = JSON.parse( input );

        let opts = args[0];

        let options = opts.options;
        let funcName = opts.funcName;
        let parameters = opts.parameters;

        let ssm = new SSM( options );

        return ssm[ funcName ].apply( ssm, parameters )
            .then( (result ) => {

                console.log( JSON.stringify( { success: true, result } ) );
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
