'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _from_lucene = require('../from_lucene');

var _decorate_query = require('../decorate_query');

var _lucene_string_to_dsl = require('../lucene_string_to_dsl');

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

  describe('buildQueryFromLucene', function () {

    it('should return the parameters of an Elasticsearch bool query', function () {
      var result = (0, _from_lucene.buildQueryFromLucene)();
      var expected = {
        must: [],
        filter: [],
        should: [],
        must_not: []
      };
      (0, _expect2.default)(result).to.eql(expected);
    });

    it('should transform an array of lucene queries into ES queries combined in the bool\'s must clause', function () {
      var queries = [{ query: 'foo:bar', language: 'lucene' }, { query: 'bar:baz', language: 'lucene' }];

      var expectedESQueries = queries.map(function (query) {
        return (0, _decorate_query.decorateQuery)((0, _lucene_string_to_dsl.luceneStringToDsl)(query.query), {});
      });

      var result = (0, _from_lucene.buildQueryFromLucene)(queries, {});

      (0, _expect2.default)(result.must).to.eql(expectedESQueries);
    });

    it('should also accept queries in ES query DSL format, simply passing them through', function () {
      var queries = [{ query: { match_all: {} }, language: 'lucene' }];

      var result = (0, _from_lucene.buildQueryFromLucene)(queries, {});

      (0, _expect2.default)(result.must).to.eql([queries[0].query]);
    });
  });
});