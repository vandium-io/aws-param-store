'use strict';

const spawnSync = require( 'child_process' ).spawnSync;

const SSM = require( './ssm' );

const PARAM_DEFAULTS = {

    Path: '/',
    Recursive: true,
    WithDecryption: true
};

class ParameterQuery {

    constructor( options ) {

        this._params = Object.assign( {}, PARAM_DEFAULTS );
        this._options = Object.assign( {}, options );
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

        return new SSM( this._options ).getParameters( this._params );
    }

    executeSync() {

        let str = JSON.stringify( [ this._params, this._options ] );

        let result = spawnSync( 'node', [ __dirname + '/param_query_sync' ], {

            input: str,
            maxBuffer: 4000000
        });

        let queryResult = JSON.parse( result.stdout.toString() );

        if( queryResult.success ) {

            return queryResult.result.parameters;
        }
        else {

            throw new Error( queryResult.err.message );
        }
    }
}

module.exports = ParameterQuery;
