const { getParameterSync } = require( '..'  /* 'aws-param-store' */ );

try {

    let parameters = getParameterSync( '/whatever/test/my-parameter', { region: 'us-east-1' } );

    console.log( parameters );
}
catch( err ) {

    console.log( err );
}
