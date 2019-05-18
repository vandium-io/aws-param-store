'use strict';

let awsParamStore = require( '..'  /* 'aws-param-store' */ );

awsParamStore.putParameter( '/whatever/test/putParameter', 'value1', 'SecureString', { region: 'us-east-1' } )
    .then( (result) => {

        console.log( result );
    })
    .catch( (err) => {

        console.log( err );
    });
