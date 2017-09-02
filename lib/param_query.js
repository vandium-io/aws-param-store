'use strict';

const spawnSync = require('child_process').spawnSync;

const SSM = require( './ssm' );

class ParameterQuery {

    constructor( params = { Path: '/' } ) {

        this._params = Object.assign( {}, params );
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

        return new SSM().getParameters( this._params );
    }

    executeSync() {

        let str = JSON.stringify( this._params );

        let result = spawnSync( 'node', [ __dirname + '/param_query_sync' ], {

            input: str
        } );

        let strResult = result.stdout.toString();

        let queryResult = JSON.parse( strResult );

        if( queryResult.success ) {

            return queryResult.result.parameters;
        }
        else {

            throw new Error( queryResult.err );
        }
    }
}

module.exports = ParameterQuery;
