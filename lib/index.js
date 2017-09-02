'use strict';

const ParameterQuery = require( './param_query' );

const env = require( './env' );

function newQuery( path = '/' ) {

    return new ParameterQuery().path( path );
}

module.exports = {

    loadToEnv: env.loadToEnv,

    newQuery
};
