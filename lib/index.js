'use strict';

var ParameterQuery = require('./param_query');

function newQuery() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;


    return new ParameterQuery(options).path(path);
}

module.exports = {

    newQuery: newQuery
};