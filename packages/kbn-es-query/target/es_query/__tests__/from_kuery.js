'use strict';

var _from_kuery = require('../from_kuery');

var _index_pattern_response = require('../../__fixtures__/index_pattern_response.json');

var _index_pattern_response2 = _interopRequireDefault(_index_pattern_response);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _kuery = require('../../kuery');

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
  describe('buildQueryFromKuery', function () {
    it('should return the parameters of an Elasticsearch bool query', function () {
      var result = (0, _from_kuery.buildQueryFromKuery)(null, [], true);
      var expected = {
        must: [],
        filter: [],
        should: [],
        must_not: []
      };
      (0, _expect2.default)(result).to.eql(expected);
    });

    it('should transform an array of kuery queries into ES queries combined in the bool\'s filter clause', function () {
      var queries = [{ query: 'extension:jpg', language: 'kuery' }, { query: 'machine.os:osx', language: 'kuery' }];

      var expectedESQueries = queries.map(function (query) {
        return (0, _kuery.toElasticsearchQuery)((0, _kuery.fromKueryExpression)(query.query), _index_pattern_response2.default);
      });

      var result = (0, _from_kuery.buildQueryFromKuery)(_index_pattern_response2.default, queries, true);

      (0, _expect2.default)(result.filter).to.eql(expectedESQueries);
    });

    it('should throw a useful error if it looks like query is using an old, unsupported syntax', function () {
      var oldQuery = { query: 'is(foo, bar)', language: 'kuery' };

      (0, _expect2.default)(_from_kuery.buildQueryFromKuery).withArgs(_index_pattern_response2.default, [oldQuery], true).to.throwError(/It looks like you're using an outdated Kuery syntax./);
    });
  });
});