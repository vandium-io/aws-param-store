const { getParametersByPath } = require( '..'  /* 'aws-param-store' */ );

getParametersByPath( '/', { region: 'us-east-1' } )
    .then( (results) => {

        console.log( results );
    })
    .catch( (err) => {

        console.log( err );
    });
