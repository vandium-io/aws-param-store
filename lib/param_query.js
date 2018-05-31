'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var spawnSync = require('child_process').spawnSync;

var SSM = require('./ssm');

var PARAM_DEFAULTS = {

    Path: '/',
    Recursive: true,
    WithDecryption: true
};

var ParameterQuery = function () {
    function ParameterQuery(options) {
        _classCallCheck(this, ParameterQuery);

        this._params = Object.assign({}, PARAM_DEFAULTS);
        this._options = Object.assign({}, options);
    }

    _createClass(ParameterQuery, [{
        key: 'path',
        value: function path(p) {

            this._params.Path = p;
            return this;
        }
    }, {
        key: 'recursive',
        value: function recursive() {
            var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;


            this._params.Recursive = enabled === true;
            return this;
        }
    }, {
        key: 'decryption',
        value: function decryption() {
            var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;


            this._params.WithDecryption = enabled === true;
            return this;
        }

        /**
         * @Promise
         */

    }, {
        key: 'execute',
        value: function execute() {

            return new SSM(this._options).getParameters(this._params);
        }
    }, {
        key: 'executeSync',
        value: function executeSync() {

            var str = JSON.stringify([this._params, this._options]);

            var result = spawnSync('node', [__dirname + '/param_query_sync'], {

                input: str,
                maxBuffer: 4000000
            });

            var queryResult = JSON.parse(result.stdout.toString());

            if (queryResult.success) {

                return queryResult.result.parameters;
            } else {

                throw new Error(queryResult.err.message);
            }
        }
    }]);

    return ParameterQuery;
}();

module.exports = ParameterQuery;