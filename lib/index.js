'use strict';

const ParameterQuery = require( './param_query' );

function newQuery( path = '/' ) {

    return new ParameterQuery( { Path: path } );
}

module.exports = {

    newQuery
};
