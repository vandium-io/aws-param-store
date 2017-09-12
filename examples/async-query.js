'use strict';

let awsParamStore = require( '..'  /* 'aws-param-store' */ );

awsParamStore.newQuery( '/' ).recursive().execute()
    .then( (results) => {

        console.log( results );
    })
    .catch( (err) => {

        console.log( err );
    });
