'use strict';

function nextPage( params, results ) {

    return Object.assign( {}, params, { NextToken: results.NextToken } );
}

class AWSPaginatedCall {

    constructor( service, funcName ) {

        this._service = service;
        this._funcName = funcName;
    }

    execute( params, initialState, proc ) {

        params = Object.assign( {}, params );

        return this._invoke( params, initialState, proc )
    }

    _invoke( params, results, proc ) {

        return this._service[ this._funcName ]( params ).promise()
            .then( (data) => {

                proc( data, results );

                if( data.NextToken ) {

                    return this._invoke( nextPage( params, data ), results, proc );
                }

                return results;
            });
    }
}

module.exports = AWSPaginatedCall;
