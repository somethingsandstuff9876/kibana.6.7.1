'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _filter_to_kuery = require('../filter_to_kuery');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('filter to kuery migration', function () {

  describe('filterToKueryAST', function () {

    it('should hand off conversion of known filter types to the appropriate converter', function () {
      var filter = {
        meta: {
          type: 'exists',
          key: 'foo'
        }
      };
      var result = (0, _filter_to_kuery.filterToKueryAST)(filter);

      (0, _expect2.default)(result).to.have.property('type', 'function');
      (0, _expect2.default)(result).to.have.property('function', 'exists');
    });

    it('should thrown an error when an unknown filter type is encountered', function () {
      var filter = {
        meta: {
          type: 'foo'
        }
      };

      (0, _expect2.default)(_filter_to_kuery.filterToKueryAST).withArgs(filter).to.throwException(/Couldn't convert that filter to a kuery/);
    });

    it('should wrap the AST node of negated filters in a "not" function', function () {
      var filter = {
        meta: {
          type: 'exists',
          key: 'foo'
        }
      };
      var negatedFilter = _lodash2.default.set(_lodash2.default.cloneDeep(filter), 'meta.negate', true);

      var result = (0, _filter_to_kuery.filterToKueryAST)(filter);
      var negatedResult = (0, _filter_to_kuery.filterToKueryAST)(negatedFilter);

      (0, _expect2.default)(negatedResult).to.have.property('type', 'function');
      (0, _expect2.default)(negatedResult).to.have.property('function', 'not');
      (0, _expect2.default)(negatedResult.arguments[0]).to.eql(result);
    });
  });
}); /*
     * Licensed to Elasticsearch B.V. under one or more contributor
     * license agreements. See the NOTICE file distributed with
     * this work for additional information regarding copyright
     * ownership. Elasticsearch B.V. licenses this file to you under
     * the Apache License, Version 2.0 (the "License"); you may
     * not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *    http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing,
     * software distributed under the License is distributed on an
     * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     * KIND, either express or implied.  See the License for the
     * specific language governing permissions and limitations
     * under the License.
     */