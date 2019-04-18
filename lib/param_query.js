'use strict';

const spawnSync = require( 'child_process' ).spawnSync;

const SSM = require( './ssm' );

const PARAM_DEFAULTS = {

    Recursive: true,
    WithDecryption: true,
    Type: 'SecureString'
};

const PutTypes = new Set(['String', 'StringList', 'SecureString']);

const PARAM_FIELDS = {

    getParametersByPath: [ 'Path', 'Recursive', 'WithDecryption' ],
    getParameters: [ 'Names', 'WithDecryption' ],
    getParameter: [ 'Name', 'WithDecryption' ],
    putParameter: [ 'Name', 'Value', 'Type' ]
};

class ParameterQuery {

    constructor( options ) {

        this._params = {};
        this._options = Object.assign( {}, options );
        this.path( '/' );
    }

    path( p ) {

        this._params.Path = p;
        this._call = 'getParametersByPath';
        this._cleanParams();
        return this;
    }

    withValue (value) {

        this._params.Value = value;
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

        this._cleanParams();
        return this;
    }

    put( name ) {

        this._call = 'putParameter';
        this._params.Name = name;
        let overwrite = true;

        if (this._options.hasOwnProperty('Overwrite')){
            overwrite = this._options.Overwrite;
        }

        this._params.Overwrite = overwrite;

        delete this._params.Path;
        delete this._params.WithDecryption;
        delete this._params.Recursive;


        return this;
    }


    type( typeName = 'SecureString' ) {
        if (PutTypes.has(typeName) ) {
            this._params.Type = typeName;
            return this;
        } else {
            throw Error(`Type provided ${typeName} not in [${[...PutTypes]}]`)
        }
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

        return new SSM( this._options )[ this._call ]( this._params );
    }

    executeSync() {

        let opts = {

            options: this._options,
            funcName: this._call,
            parameters: [ this._params ]
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

            throw new Error( queryResult.err.message || queryResult.err.code );
        }
    }

    _cleanParams() {

        let clean = {};

        let fields = PARAM_FIELDS[ this._call ];

        for( let field of fields ) {

            let value = this._params[ field ];

            if( value === undefined ) {

                value = PARAM_DEFAULTS[ field ];
            }

            if( value !== undefined ) {

                clean[ field ] = value;
            }
        }

        this._params = clean;
    }
}

module.exports = ParameterQuery;
