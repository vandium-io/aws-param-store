const AWS = require( 'aws-sdk' );

const { getParametersByPathSync } = require( '..'  /* 'aws-param-store' */ );

// use a profile
const credentials = new AWS.SharedIniFileCredentials( {profile: 'my-test-profile'} );
AWS.config.credentials = credentials;

// set the region
AWS.config.update({region: 'us-east-1'});

try {

    let parameters = getParametersByPathSync( '/' );

    console.log( parameters );
}
catch( err ) {

    console.log( err );
}
