'use strict';

var _phrase = require('../phrase');

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

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
      expected = _lodash2.default.cloneDeep(_filter_skeleton2.default);
    });

    it('should be a function', function () {
      (0, _expect2.default)(_phrase.buildPhraseFilter).to.be.a(Function);
    });

    it('should return a match query filter when passed a standard field', function () {
      var field = getField(_index_pattern_response2.default, 'bytes');
      expected.query = {
        match: {
          bytes: {
            query: 5,
            type: 'phrase'
          }
        }
      };
      (0, _expect2.default)((0, _phrase.buildPhraseFilter)(field, 5, _index_pattern_response2.default)).to.eql(expected);
    });

    it('should return a script filter when passed a scripted field', function () {
      var field = getField(_index_pattern_response2.default, 'script number');
      expected.meta.field = 'script number';
      _lodash2.default.set(expected, 'script.script', {
        source: '(' + field.script + ') == value',
        lang: 'expression',
        params: {
          value: 5
        }
      });
      (0, _expect2.default)((0, _phrase.buildPhraseFilter)(field, 5, _index_pattern_response2.default)).to.eql(expected);
    });
  });

  describe('buildInlineScriptForPhraseFilter', function () {

    it('should wrap painless scripts in a lambda', function () {
      var field = {
        lang: 'painless',
        script: 'return foo;'
      };

      var expected = 'boolean compare(Supplier s, def v) {return s.get() == v;}' + 'compare(() -> { return foo; }, params.value);';

      (0, _expect2.default)((0, _phrase.buildInlineScriptForPhraseFilter)(field)).to.be(expected);
    });

    it('should create a simple comparison for other langs', function () {
      var field = {
        lang: 'expression',
        script: 'doc[bytes].value'
      };

      var expected = '(doc[bytes].value) == value';

      (0, _expect2.default)((0, _phrase.buildInlineScriptForPhraseFilter)(field)).to.be(expected);
    });
  });
});

function getField(indexPattern, name) {
  return indexPattern.fields.find(function (field) {
    return field.name === name;
  });
}