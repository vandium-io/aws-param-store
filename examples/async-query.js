'use strict';

let awsParamStore = require( '..'  /* 'aws-param-store' */ );

awsParamStore.newQuery( '/', { region: 'us-west-1' } ).recursive().execute()
    .then( (results) => {

        console.log( results );
    })
    .catch( (err) => {

        console.log( err );
    });
