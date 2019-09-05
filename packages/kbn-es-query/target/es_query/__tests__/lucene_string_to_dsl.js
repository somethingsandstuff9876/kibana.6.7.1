'use strict';

var _lucene_string_to_dsl = require('../lucene_string_to_dsl');

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
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

describe('build query', function () {

  describe('luceneStringToDsl', function () {

    it('should wrap strings with an ES query_string query', function () {
      var result = (0, _lucene_string_to_dsl.luceneStringToDsl)('foo:bar');
      var expectedResult = {
        query_string: { query: 'foo:bar' }
      };
      (0, _expect2.default)(result).to.eql(expectedResult);
    });

    it('should return a match_all query for empty strings and whitespace', function () {
      var expectedResult = {
        match_all: {}
      };

      (0, _expect2.default)((0, _lucene_string_to_dsl.luceneStringToDsl)('')).to.eql(expectedResult);
      (0, _expect2.default)((0, _lucene_string_to_dsl.luceneStringToDsl)('   ')).to.eql(expectedResult);
    });

    it('should return non-string arguments without modification', function () {
      var expectedResult = {};
      var result = (0, _lucene_string_to_dsl.luceneStringToDsl)(expectedResult);
      (0, _expect2.default)(result).to.be(expectedResult);
      (0, _expect2.default)(result).to.eql(expectedResult);
    });
  });
});