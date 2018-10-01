'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var AWS = require('aws-sdk');

function getParametersByPath(ssm, params, parameters) {

    return ssm.getParametersByPath(params).promise().then(function (data) {

        parameters.push.apply(parameters, _toConsumableArray(data.Parameters || []));

        if (data.NextToken) {

            var nextPageParams = Object.assign({}, params, { NextToken: data.NextToken });

            return getParametersByPath(ssm, nextPageParams, parameters);
        }

        return parameters;
    });
}

var SSM = function () {
    function SSM(options) {
        _classCallCheck(this, SSM);

        this._ssm = new AWS.SSM(options);
    }

    _createClass(SSM, [{
        key: 'getParameters',
        value: function getParameters(queryParams) {

            var params = Object.assign({}, queryParams);

            return getParametersByPath(this._ssm, params, []);
        }
    }]);

    return SSM;
}();

module.exports = SSM;