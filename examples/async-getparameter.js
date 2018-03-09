'use strict';

let awsParamStore = require( '..'  /* 'aws-param-store' */ );

awsParamStore.getParameter( '/whatever/test/getParameter', { region: 'us-east-1' } )
    .then( (parameter) => {

        console.log( parameter );
    })
    .catch( (err) => {

        console.log( err );
    });
