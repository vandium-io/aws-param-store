const { getParametersSync } = require( '..'  /* 'aws-param-store' */ );

try {

    const parameters = getParametersSync( ['/whatever/test/my-parameter', 'other' ], { region: 'us-east-1' } );

    console.log( parameters );
}
catch( err ) {

    console.log( err );
}
