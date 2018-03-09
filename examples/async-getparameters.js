'use strict';

let awsParamStore = require( '..'  /* 'aws-param-store' */ );

awsParamStore.getParameters( [ '/whatever/test/getParameter', '/whatever/unknown-parameter' ], { region: 'us-east-1' } )
    .then( (results) => {

        console.log( results );
    })
    .catch( (err) => {

        console.log( err );
    });
