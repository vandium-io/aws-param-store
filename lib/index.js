'use strict';

const ParameterQuery = require( './param_query' );

function newQuery( path = '/', options = undefined ) {

    return new ParameterQuery( options ).path( path );
}

module.exports = {

    newQuery
};
