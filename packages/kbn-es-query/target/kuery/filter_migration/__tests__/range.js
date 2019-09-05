'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _range = require('../range');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); } /*
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

describe('filter to kuery migration', function () {

  describe('range filter', function () {

    it('should return a kuery node equivalent to the given filter', function () {
      var filter = {
        meta: {
          type: 'range',
          key: 'foo',
          params: {
            gt: 1000,
            lt: 8000
          }
        }
      };
      var result = (0, _range.convertRangeFilter)(filter);

      (0, _expect2.default)(result).to.have.property('type', 'function');
      (0, _expect2.default)(result).to.have.property('function', 'range');

      var _result$arguments = _toArray(result.arguments),
          fieldName = _result$arguments[0].value,
          args = _result$arguments.slice(1);

      (0, _expect2.default)(fieldName).to.be('foo');

      var argByName = _lodash2.default.mapKeys(args, 'name');
      (0, _expect2.default)(argByName.gt.value.value).to.be(1000);
      (0, _expect2.default)(argByName.lt.value.value).to.be(8000);
    });

    it('should throw an exception if the given filter is not of type "range"', function () {
      var filter = {
        meta: {
          type: 'foo'
        }
      };

      (0, _expect2.default)(_range.convertRangeFilter).withArgs(filter).to.throwException(/Expected filter of type "range", got "foo"/);
    });
  });
});