'use strict';

const ParameterQuery = require( './param_query' );

function parameterQuery( options ) {

    return new ParameterQuery( options );
}

function getParametersByPath( path = '/', options = undefined ) {

    return parameterQuery( options )
        .path( path )
        .execute();
}

function getParametersByPathSync( path = '/', options = undefined ) {

    return parameterQuery( options )
        .path( path )
        .executeSync();
}

function putParameter( name, value, type, options ) {

    return parameterQuery( options )
        .put( name )
        .withValue(value)
        .type( type )
        .execute();
}

function putParameterSync( name, value, type, options ) {

    return parameterQuery( options )
        .put( name )
        .withValue(value)
        .type( type )
        .executeSync();
}


function getParameter( name, options ) {

    return parameterQuery( options )
        .named( name )
        .execute();
}

function getParameterSync( name, options ) {

    return parameterQuery( options )
        .named( name )
        .executeSync();
}

function getParameters( names, options ) {

    return parameterQuery( options )
        .named( names )
        .execute();
}

function getParametersSync( names, options ) {

    return parameterQuery( options )
        .named( names )
        .executeSync();
}

// legacy
function newQuery( path = '/', options = undefined ) {

    return parameterQuery( options ).path( path );
}

module.exports = {

    parameterQuery,

    getParametersByPath,
    getParametersByPathSync,

    getParameter,
    getParameterSync,

    getParameters,
    getParametersSync,

    putParameter,
    putParameterSync,

    newQuery,
};
