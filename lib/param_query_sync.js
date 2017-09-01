'use strict';

const ParamQuery = require( './param_query' );

process.stdin.setEncoding( 'utf8' );

let input = '';

process.stdin.on( 'readable', function() {

    let chunk = process.stdin.read();

    if( chunk ) {

        input+= chunk;
    }
});

process.stdin.on( 'end', function() {

    try {

        let param = JSON.parse( input );

        return new ParamQuery( param )
            .execute()
            .then( (parameters) => {

                console.log( JSON.stringify( { success: true, result: { parameters } } ) );
            })
    }
    catch( err ) {

        console.log( JSON.stringify( { success: false, err } ) );
    }
});
