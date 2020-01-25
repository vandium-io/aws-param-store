const { putParameterSync } = require( '..'  /* 'aws-param-store' */ );

try {

    const results = putParameterSync( '/whatever/test/my-parameter', 'value1', 'SecureString', { region: 'us-east-1' } );

    console.log( results );
}
catch( err ) {

    console.log( err );
}
