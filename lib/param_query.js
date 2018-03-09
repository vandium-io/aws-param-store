'use strict';

const spawnSync = require( 'child_process' ).spawnSync;

const SSM = require( './ssm' );

const PARAM_DEFAULTS = {

    Path: '/',
    Recursive: true,
    WithDecryption: true
};

const PARAM_FIELDS = {

    getParametersByPath: [ 'Path', 'Recursive', 'WithDecryption' ],
    getParameters: [ 'Names', 'WithDecryption' ],
    getParameter: [ 'Name', 'WithDecryption' ]
};

class ParameterQuery {

    constructor( options ) {

        this._params = Object.assign( {}, PARAM_DEFAULTS );
        this._options = Object.assign( {}, options );
        this.path( '/' );
    }

    path( p ) {

        this._params.Path = p;
        this._call = 'getParametersByPath';
        return this;
    }

    named( nameOrNames ) {

        if( Array.isArray( nameOrNames ) ) {

            this._params.Names =  nameOrNames;
            this._call = 'getParameters';
        }
        else {

            this._params.Name = nameOrNames;
            this._call = 'getParameter';
        }

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

        let params = this.cleanParams();

        return new SSM( this._options )[ this._call ]( params );
    }

    executeSync() {

        let params = this.cleanParams();

        let opts = {

            options: this._options,
            funcName: this._call,
            parameters: [ params ]
        };

        let str = JSON.stringify( [ opts ] );

        let result = spawnSync( 'node', [ __dirname + '/ssm_sync' ], {

            input: str,
            maxBuffer: 4000000
        });

        let queryResult = JSON.parse( result.stdout.toString() );

        if( queryResult.success ) {

            return queryResult.result;
        }
        else {

            throw new Error( queryResult.err.message );
        }
    }

    cleanParams() {

        let clean = {};

        let fields = PARAM_FIELDS[ this._call ];

        for( let field of fields ) {

            let value = this._params[ field ];

            if( value !== undefined ) {

                clean[ field ] = value;
            }
        }

        return clean;
    }
}

module.exports = ParameterQuery;
