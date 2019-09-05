'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _build_es_query = require('../build_es_query');

var _index_pattern_response = require('../../__fixtures__/index_pattern_response.json');

var _index_pattern_response2 = _interopRequireDefault(_index_pattern_response);

var _kuery = require('../../kuery');

var _lucene_string_to_dsl = require('../lucene_string_to_dsl');

var _decorate_query = require('../decorate_query');

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
  describe('buildEsQuery', function () {

    it('should return the parameters of an Elasticsearch bool query', function () {
      var result = (0, _build_es_query.buildEsQuery)();
      var expected = {
        bool: {
          must: [],
          filter: [],
          should: [],
          must_not: []
        }
      };
      (0, _expect2.default)(result).to.eql(expected);
    });

    it('should combine queries and filters from multiple query languages into a single ES bool query', function () {
      var queries = [{ query: 'extension:jpg', language: 'kuery' }, { query: 'bar:baz', language: 'lucene' }];
      var filters = [{
        match_all: {},
        meta: { type: 'match_all' }
      }];
      var config = {
        allowLeadingWildcards: true,
        queryStringOptions: {}
      };

      var expectedResult = {
        bool: {
          must: [(0, _decorate_query.decorateQuery)((0, _lucene_string_to_dsl.luceneStringToDsl)('bar:baz'), config.queryStringOptions), { match_all: {} }],
          filter: [(0, _kuery.toElasticsearchQuery)((0, _kuery.fromKueryExpression)('extension:jpg'), _index_pattern_response2.default)],
          should: [],
          must_not: []
        }
      };

      var result = (0, _build_es_query.buildEsQuery)(_index_pattern_response2.default, queries, filters, config);

      (0, _expect2.default)(result).to.eql(expectedResult);
    });
  });
});