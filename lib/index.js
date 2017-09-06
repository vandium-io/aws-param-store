'use strict';

const ParameterQuery = require( './param_query' );

function newQuery( path = '/' ) {

    return new ParameterQuery().path( path );
}

module.exports = {

    newQuery
};
