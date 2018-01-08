'use strict';

const AWS = require( 'aws-sdk' );

function getParametersByPath( ssm, params, parameters ) {

    return ssm.getParametersByPath( params ).promise()
        .then( (data) => {

            parameters.push( ...(data.Parameters || []) );

            if( data.NextToken ) {

                let nextPageParams = Object.assign( {}, params, { NextToken: data.NextToken } );

                return getParametersByPath( ssm, nextPageParams, parameters );
            }

            return parameters;
        });
}

class SSM {

    constructor( options ) {

        this._ssm = new AWS.SSM( options );
    }

    getParameters( queryParams ) {

        let params = Object.assign( {}, queryParams );

        return getParametersByPath( this._ssm, params, [] );
    }
}

module.exports = SSM;
