'use strict';

let awsParamStore = require( '..'  /* 'aws-param-store' */ );

try {

    let parameters = awsParamStore.newQuery( '/' ).executeSync();
    console.log( parameters );
}
catch( err ) {

    console.log( err );
}
