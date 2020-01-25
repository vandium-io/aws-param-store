const { putParameter } = require( '..'  /* 'aws-param-store' */ );

putParameter( '/whatever/test/my-parameter', 'value1', 'SecureString', { region: 'us-east-1' } )
    .then( (result) => {

        console.log( result );
    })
    .catch( (err) => {

        console.log( err );
    });
