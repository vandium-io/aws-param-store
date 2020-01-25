const { getParameter } = require( '..'  /* 'aws-param-store' */ );

getParameter( '/whatever/test/my-parameter', { region: 'us-east-1' } )
    .then( (parameter) => {

        console.log( parameter );
    })
    .catch( (err) => {

        console.log( err );
    });
