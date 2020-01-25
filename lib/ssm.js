const AWS = require( 'aws-sdk' );

function collect( list, items ) {

  list.push( ...(items || []) );
}

async function paginatedCall( ssmInstance, functionName, params, processor ) {

  do {

    const data = await ssmInstance[ functionName ]( params ).promise();

    processor( data );

    params = { ...params, NextToken: data.NextToken };

  } while( params.NextToken );
}

class SSM {

    constructor( options ) {

        this._ssm = new AWS.SSM( options );
    }

    async getParametersByPath( params ) {

      const parameters = [];

      await paginatedCall( this._ssm, 'getParametersByPath', params, ( { Parameters }) => {

          collect( parameters, Parameters );
        });

      return parameters;
    }

    async getParameter( params ) {

      const { Parameter } = await this._ssm.getParameter( params ).promise();

      return Parameter;
    }

    async getParameters( params ) {

      const results = {

        Parameters: [],
        InvalidParameters: [],
      };

      await paginatedCall( this._ssm, 'getParameters', params, (data) => {

          collect( results.Parameters, data.Parameters );
          collect( results.InvalidParameters, data.InvalidParameters );
        });

      return results;
    }

    async putParameter( params ) {

      return await this._ssm.putParameter( params ).promise();
    }
}

module.exports = SSM;
