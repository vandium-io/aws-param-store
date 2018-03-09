'use strict';

let awsParamStore = require( '..'  /* 'aws-param-store' */ );

try {

    let parameters = awsParamStore.getParametersSync( ['/whatever/test/getParameter', 'unknown'], { region: 'us-east-1' } );

    console.log( parameters );
}
catch( err ) {

    console.log( err );
}
