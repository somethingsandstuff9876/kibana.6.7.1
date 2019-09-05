'use strict';

var _query = require('../query');

var _lodash = require('lodash');

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _index_pattern_response = require('../../__fixtures__/index_pattern_response.json');

var _index_pattern_response2 = _interopRequireDefault(_index_pattern_response);

var _filter_skeleton = require('../../__fixtures__/filter_skeleton');

var _filter_skeleton2 = _interopRequireDefault(_filter_skeleton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expected = void 0; /*
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

describe('Filter Manager', function () {
  describe('Phrase filter builder', function () {
    beforeEach(function () {
      expected = (0, _lodash.cloneDeep)(_filter_skeleton2.default);
    });

    it('should be a function', function () {
      (0, _expect2.default)(_query.buildQueryFilter).to.be.a(Function);
    });

    it('should return a query filter when passed a standard field', function () {
      expected.query = {
        foo: 'bar'
      };
      (0, _expect2.default)((0, _query.buildQueryFilter)({ foo: 'bar' }, _index_pattern_response2.default.id)).to.eql(expected);
    });
  });
});