'use strict';

let awsParamStore = require( '..'  /* 'aws-param-store' */ );

try {

    let parameters = awsParamStore.newQuery( '/', { region: 'us-east-1' } ).executeSync();
    console.log( parameters );
}
catch( err ) {

    console.log( err );
}
