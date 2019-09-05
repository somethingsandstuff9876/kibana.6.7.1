'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _filter_matches_index = require('../filter_matches_index');

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

describe('filterMatchesIndex', function () {
  it('should return true if the filter has no meta', function () {
    var filter = {};
    var indexPattern = { id: 'foo', fields: [{ name: 'bar' }] };
    (0, _expect2.default)((0, _filter_matches_index.filterMatchesIndex)(filter, indexPattern)).to.be(true);
  });

  it('should return true if no index pattern is passed', function () {
    var filter = { meta: { index: 'foo', key: 'bar' } };
    var indexPattern = undefined;
    (0, _expect2.default)((0, _filter_matches_index.filterMatchesIndex)(filter, indexPattern)).to.be(true);
  });

  it('should return true if the filter key matches a field name', function () {
    var filter = { meta: { index: 'foo', key: 'bar' } };
    var indexPattern = { id: 'foo', fields: [{ name: 'bar' }] };
    (0, _expect2.default)((0, _filter_matches_index.filterMatchesIndex)(filter, indexPattern)).to.be(true);
  });

  it('should return false if the filter key does not match a field name', function () {
    var filter = { meta: { index: 'foo', key: 'baz' } };
    var indexPattern = { id: 'foo', fields: [{ name: 'bar' }] };
    (0, _expect2.default)((0, _filter_matches_index.filterMatchesIndex)(filter, indexPattern)).to.be(false);
  });
});