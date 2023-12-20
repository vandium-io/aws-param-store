'use strict';

const { SSMClient, GetParameterCommand, PutParameterCommand, GetParametersCommand, GetParametersByPathCommand } = require("@aws-sdk/client-ssm");

class SSM {

    constructor( options ) {

        this._ssm = new SSMClient( options );
    }

    getParametersByPath( params ) {
        return this._getParamatersByPathPaginated( params ).then( (data) => {
            return data;
        });
    }

    getParameter( params ) {

        return this._ssm.send(new GetParameterCommand(params))
            .then( (data) => {

                return data.Parameter;
            });
    }

    getParameters( params ) {

        return this._ssm.send(new GetParametersCommand(params))
            .then( (data) => {

                return data;
            });
    }

    putParameter( params ) {
        return this._ssm.send(new PutParameterCommand(params))
            .then( (data) => {

                return data;
            });
    }

    async _getParamatersByPathPaginated( params ) {
        let results = [];
        let NextToken;
        do {
            const result = await this._ssm.send(
                new GetParametersByPathCommand(Object.assign({}, params, NextToken? {NextToken} : undefined))
            );
            NextToken = result.NextToken;
            if (result.Parameters && result.Parameters.length) {
                results.push(result.Parameters);
            }
        } while (NextToken);
        return [].concat(...results);
    }
}

module.exports = SSM;
