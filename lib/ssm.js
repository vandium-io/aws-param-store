'use strict';

const AWS = require( 'aws-sdk' );

const AWSPaginatedCall = require( './aws_paginated_call' );

function collect( list, additions ) {

    list.push( ...(additions || []) );
}

class SSM {

    constructor( options ) {

        this._ssm = new AWS.SSM( options );
    }

    getParametersByPath( params ) {

        return this._paginatedCall( 'getParametersByPath' )
            .execute( params, [], (data, parameters) => {

                collect( parameters, data.Parameters );
            });
    }

    getParameter( params ) {

        return this._ssm.getParameter( params ).promise()
            .then( (data) => {

                return data.Parameter;
            });
    }

    getParameters( params ) {

        return this._paginatedCall( 'getParameters' )
            .execute( params, { Parameters: [], InvalidParameters: []}, (data, results) => {

                collect( results.Parameters, data.Parameters );
                collect( results.InvalidParameters, data.InvalidParameters );
            });
    }

    putParameter( params ) {
        return this._ssm.putParameter( params ).promise()
            .then( (data) => {

                return data;
            });
    }

    _paginatedCall( functionName ) {

        return new AWSPaginatedCall( this._ssm, functionName );
    }
}

module.exports = SSM;
