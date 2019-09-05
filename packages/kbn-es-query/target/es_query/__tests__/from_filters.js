'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _from_filters = require('../from_filters');

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

  describe('buildQueryFromFilters', function () {
    it('should return the parameters of an Elasticsearch bool query', function () {
      var result = (0, _from_filters.buildQueryFromFilters)([]);
      var expected = {
        must: [],
        filter: [],
        should: [],
        must_not: []
      };
      (0, _expect2.default)(result).to.eql(expected);
    });

    it('should transform an array of kibana filters into ES queries combined in the bool clauses', function () {
      var filters = [{
        match_all: {},
        meta: { type: 'match_all' }
      }, {
        exists: { field: 'foo' },
        meta: { type: 'exists' }
      }];

      var expectedESQueries = [{ match_all: {} }, { exists: { field: 'foo' } }];

      var result = (0, _from_filters.buildQueryFromFilters)(filters);

      (0, _expect2.default)(result.must).to.eql(expectedESQueries);
    });

    it('should place negated filters in the must_not clause', function () {
      var filters = [{
        match_all: {},
        meta: { type: 'match_all', negate: true }
      }];

      var expectedESQueries = [{ match_all: {} }];

      var result = (0, _from_filters.buildQueryFromFilters)(filters);

      (0, _expect2.default)(result.must_not).to.eql(expectedESQueries);
    });

    it('should translate old ES filter syntax into ES 5+ query objects', function () {
      var filters = [{
        query: { exists: { field: 'foo' } },
        meta: { type: 'exists' }
      }];

      var expectedESQueries = [{
        exists: { field: 'foo' }
      }];

      var result = (0, _from_filters.buildQueryFromFilters)(filters);

      (0, _expect2.default)(result.must).to.eql(expectedESQueries);
    });

    it('should migrate deprecated match syntax', function () {
      var filters = [{
        query: { match: { extension: { query: 'foo', type: 'phrase' } } },
        meta: { type: 'phrase' }
      }];

      var expectedESQueries = [{
        match_phrase: { extension: { query: 'foo' } }
      }];

      var result = (0, _from_filters.buildQueryFromFilters)(filters);

      (0, _expect2.default)(result.must).to.eql(expectedESQueries);
    });
  });
});