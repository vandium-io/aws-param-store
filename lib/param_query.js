'use strict';

const SSM = require( './ssm' );

function getParametersByPath( ssm, params, parameters ) {

    return ssm.getParametersByPath( params ).promise()
        .then( (data) => {

            parameters.push( ...(data.Parameters || []) );

            if( data.NextToken ) {

                params.NextToken = data.NextToken;

                return getParametersByPath( ssm, params, parameters );
            }

            return parameters;
        });
}

class ParameterQuery {

    constructor() {

        this._params = {

             Path: '/'
        };
    }

    path( p ) {

        this._params.Path = p;
        return this;
    }

    recursive( enabled = true ) {

        this._params.Recursive = (enabled === true);
        return this;
    }

    decryption( enabled = true ) {

        this._params.WithDecryption = (enabled === true);
        return this;
    }

    /**
     * @Promise
     */
    execute() {

        let params = Object.assign( {}, this._params );

        return getParametersByPath( SSM.newInstance(), params, [] );
    }
}

module.exports = ParameterQuery;
