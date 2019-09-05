'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _migrate_filter = require('../migrate_filter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('migrateFilter', function () {

  var oldMatchPhraseFilter = {
    match: {
      fieldFoo: {
        query: 'foobar',
        type: 'phrase'
      }
    }
  };

  var newMatchPhraseFilter = {
    match_phrase: {
      fieldFoo: {
        query: 'foobar'
      }
    }
  };

  // https://github.com/elastic/elasticsearch/pull/17508
  it('should migrate match filters of type phrase', function () {
    var migratedFilter = (0, _migrate_filter.migrateFilter)(oldMatchPhraseFilter);
    (0, _expect2.default)(_lodash2.default.isEqual(migratedFilter, newMatchPhraseFilter)).to.be(true);
  });

  it('should not modify the original filter', function () {
    var oldMatchPhraseFilterCopy = _lodash2.default.clone(oldMatchPhraseFilter, true);
    (0, _migrate_filter.migrateFilter)(oldMatchPhraseFilter);
    (0, _expect2.default)(_lodash2.default.isEqual(oldMatchPhraseFilter, oldMatchPhraseFilterCopy)).to.be(true);
  });

  it('should return the original filter if no migration is necessary', function () {
    var originalFilter = {
      match_all: {}
    };
    var migratedFilter = (0, _migrate_filter.migrateFilter)(originalFilter);
    (0, _expect2.default)(migratedFilter).to.be(originalFilter);
    (0, _expect2.default)(_lodash2.default.isEqual(migratedFilter, originalFilter)).to.be(true);
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