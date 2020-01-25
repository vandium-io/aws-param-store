const ParameterQuery = require( './param_query' );

function parameterQuery( options ) {

    return new ParameterQuery( options );
}

async function getParametersByPath( path = '/', options ) {

    return parameterQuery( options )
        .path( path )
        .execute();
}

function getParametersByPathSync( path = '/', options ) {

    return parameterQuery( options )
        .path( path )
        .executeSync();
}

async function putParameter( name, value, type, options ) {

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


async function getParameter( name, options ) {

    return parameterQuery( options )
        .named( name )
        .execute();
}

function getParameterSync( name, options ) {

    return parameterQuery( options )
        .named( name )
        .executeSync();
}

async function getParameters( names, options ) {

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
function newQuery( path = '/', options ) {

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
