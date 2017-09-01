'use strict';

const spawnSync = require('child_process').spawnSync;

const ParameterQuery = require( './param_query' );

const env = require( './env' );

function newQuery( path = '/' ) {

    return new ParameterQuery().path( path );
}

function executeQuerySync( query ) {

    let str = JSON.stringify( query._params );


    let result = spawnSync( 'node', [ __dirname + '/param_query_sync' ], {

        input: str
    } );

    let strResult = result.stdout.toString();

    let queryResult = JSON.parse( strResult );

    if( queryResult.success ) {

        return queryResult.result.parameters;
    }
    else {

        throw queryResult.err;
    }
}

module.exports = {

    loadToEnv: env.loadToEnv,

    newQuery,

    executeQuerySync
};
