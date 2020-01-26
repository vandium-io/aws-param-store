const AWS = require( 'aws-sdk' );

function collect( list, items ) {

  list.push( ...(items || []) );
}

class SSM {

  constructor( options ) {

    this._ssm = new AWS.SSM( options );
  }

  async getParametersByPath( params ) {

    const parameters = [];

    await this.paginatedCall( 'getParametersByPath', params, ( { Parameters }) => {

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

    const names = params.Names || [];

    // batch in groups of 10
    for( let i = 0; i < names.length; i+= 10 ) {

      params = {
        ...params,
        Names: names.slice( i, i + 10 )
      };

      const { Parameters, InvalidParameters } = await this._ssm.getParameters( params ).promise();

      collect( results.Parameters, Parameters );
      collect( results.InvalidParameters, InvalidParameters );
    }

    return results;
  }

  async putParameter( params ) {

    return await this._ssm.putParameter( params ).promise();
  }

  async paginatedCall( functionName, params, processor ) {

    do {

      const data = await this._ssm[ functionName ]( params ).promise();

      processor( data );

      params = { ...params, NextToken: data.NextToken };

    } while( params.NextToken );
  }
}

module.exports = SSM;
