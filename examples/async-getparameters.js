const { getParameters } = require( '..'  /* 'aws-param-store' */ );

getParameters( [ '/whatever/test/my-parameter', '/whatever/unknown-parameter' ], { region: 'us-east-1' } )
    .then( (results) => {

        console.log( results );
    })
    .catch( (err) => {

        console.log( err );
    });
