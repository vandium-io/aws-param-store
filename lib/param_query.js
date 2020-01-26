const AWS = require( 'aws-sdk' );

const syncRPC = require('sync-rpc');

const SSM = require( './ssm' );

const ssmSync = syncRPC( __dirname + '/ssm-sync-worker' );

const PARAM_DEFAULTS = {

  Recursive: true,
  WithDecryption: true,
  Type: 'SecureString',
  Overwrite: true,
};

const PutTypes = new Set( [ 'String', 'StringList', 'SecureString' ] );

const PARAM_FIELDS = {

  getParametersByPath: [ 'Path', 'Recursive', 'WithDecryption' ],
  getParameters: [ 'Names', 'WithDecryption' ],
  getParameter: [ 'Name', 'WithDecryption' ],
  putParameter: [ 'Name', 'Value', 'Type', 'Overwrite' ],
};

function getAWSProfile() {

  let profile;

  const { credentials } = AWS.config;

  if( credentials ) {

    profile = credentials.profile;
  }

  return profile;
}

class ParameterQuery {

  constructor( { Overwrite, ...options } = {} ) {

      this._params = {};
      this._options = { ...options };

      this._defaults = {};

      Object.keys( PARAM_DEFAULTS ).forEach( (key) => {

        this._defaults[ key ] = PARAM_DEFAULTS[ key ];
      });

      if( Overwrite !== undefined ) {

        this._defaults.Overwrite = Overwrite;
      }

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

    this._cleanParams();

    return this;
  }

  overwrite( enabled = true ) {

    this._params.Overwrite = (enabled === true );
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

  async execute() {

    return new SSM( this._options )[ this._call ]( this._params );
  }

  executeSync() {

    const options = { ...this._options };

    if( !options.region && AWS.config.region ) {

      options.region = AWS.config.region;
    }

    const profile = getAWSProfile();

    const result = ssmSync( {

      options,
      funcName: this._call,
      parameters: [ this._params ],
      profile,
    });

    return result;
  }

  _cleanParams() {

    const clean = {};

    PARAM_FIELDS[ this._call ].forEach( (field) => {

      let value = this._params[ field ];

      if( value === undefined ) {

        value = this._defaults[ field ];
      }

      if( value !== undefined ) {

        clean[ field ] = value;
      }
    });

    this._params = clean;
  }
}

module.exports = ParameterQuery;
