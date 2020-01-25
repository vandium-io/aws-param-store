const AWS = require( 'aws-sdk' );

const syncRPC = require('sync-rpc');

const SSM = require( './ssm' );

const ssmSync = syncRPC( __dirname + '/ssm-sync-worker' );

const PARAM_DEFAULTS = {

    Recursive: true,
    WithDecryption: true,
    Type: 'SecureString'
};

const PutTypes = new Set( ['String', 'StringList', 'SecureString'] );

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

    withValue( value ) {

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

      if( Object.prototype.hasOwnProperty.call( this._options, 'Overwrite' ) ) {

        overwrite = this._options.Overwrite;
      }

      this._params.Overwrite = overwrite;

      delete this._params.Path;
      delete this._params.WithDecryption;
      delete this._params.Recursive;

      return this;
    }

    type( typeName = 'SecureString' ) {

      if( !PutTypes.has( typeName ) ) {

        throw Error( `Type provided ${typeName} not in [${[...PutTypes]}]` );
      }

      this._params.Type = typeName;
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
    async execute() {

      return new SSM( this._options )[ this._call ]( this._params );
    }

    executeSync() {

      let profile;

      const { credentials } = AWS.config;

      if( credentials ) {

        profile = credentials.profile;
      }

      const result = ssmSync( {

          options: this._options,
          funcName: this._call,
          parameters: [ this._params ],
          profile,
      });

      return result;
    }

    _cleanParams() {

        const clean = {};

        const fields = PARAM_FIELDS[ this._call ];

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
