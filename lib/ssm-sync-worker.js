const AWS = require( 'aws-sdk' );

const SSM = require( './ssm' );

// sync-rpc handler
function init() {

  return async function ( { options, funcName, parameters, profile } ) {

    if( profile ) {

      // use profile from controlling processor
      AWS.config.credentials = new AWS.SharedIniFileCredentials( { profile } );
    }

    const ssm = new SSM( options );

    return await ssm[ funcName ].apply( ssm, parameters );
  }
}

module.exports = init;
