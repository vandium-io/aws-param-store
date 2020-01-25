const { getParameters } = require( '..'  /* 'aws-param-store' */ );

const parameterNames = (() => {

    const names = [ '/whatever/test/my-parameter' ];

    for( let i = 0; i < 100; i++ ) {

      names.push( '/whatever/unknown-' + i );
    }

    return names;
  })();

getParameters( parameterNames, { region: 'us-east-1' } )
    .then( (results) => {

        console.log( results );
    })
    .catch( (err) => {

        console.log( err );
    });
