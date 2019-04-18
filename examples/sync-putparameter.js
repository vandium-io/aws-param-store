'use strict';

let awsParamStore = require( '..'  /* 'aws-param-store' */ );

try {

    let results = awsParamStore.putParameterSync( '/whatever/test/putParameter', 'value1', 'SecureString', { region: 'us-east-1' } );

    console.log( results );
}
catch( err ) {

    console.log( err );
}
