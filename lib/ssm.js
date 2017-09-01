'use strict';

const AWS = require( 'aws-sdk' );

function newInstance() {

    return new AWS.SSM();
}

module.exports = {

    newInstance
};
