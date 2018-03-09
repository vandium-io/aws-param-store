'use strict';

let awsParamStore = require( '..'  /* 'aws-param-store' */ );

try {

    let parameters = awsParamStore.getParameterSync( '/whatever/test/getParameter', { region: 'us-east-1' } );

    console.log( parameters );
}
catch( err ) {

    console.log( err );
}
