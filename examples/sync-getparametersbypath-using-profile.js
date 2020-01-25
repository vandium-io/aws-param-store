const AWS = require( 'aws-sdk' );

const { getParametersByPathSync } = require( '..'  /* 'aws-param-store' */ );

const credentials = new AWS.SharedIniFileCredentials( {profile: 'my-test-profile'} );
AWS.config.credentials = credentials;

try {

    let parameters = getParametersByPathSync( '/', { region: 'us-east-1' } );

    console.log( parameters );
}
catch( err ) {

    console.log( err );
}
