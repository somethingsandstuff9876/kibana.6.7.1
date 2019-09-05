'use strict';

var _range = require('../range');

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
  describe('Range filter builder', function () {
    beforeEach(function () {
      expected = _lodash2.default.cloneDeep(_filter_skeleton2.default);
    });

    it('should be a function', function () {
      (0, _expect2.default)(_range.buildRangeFilter).to.be.a(Function);
    });

    it('should return a range filter when passed a standard field', function () {
      var field = getField(_index_pattern_response2.default, 'bytes');
      expected.range = {
        bytes: {
          gte: 1,
          lte: 3
        }
      };
      (0, _expect2.default)((0, _range.buildRangeFilter)(field, { gte: 1, lte: 3 }, _index_pattern_response2.default)).to.eql(expected);
    });

    it('should return a script filter when passed a scripted field', function () {
      var field = getField(_index_pattern_response2.default, 'script number');
      expected.meta.field = 'script number';
      _lodash2.default.set(expected, 'script.script', {
        lang: 'expression',
        source: '(' + field.script + ')>=gte && (' + field.script + ')<=lte',
        params: {
          value: '>=1 <=3',
          gte: 1,
          lte: 3
        }
      });
      (0, _expect2.default)((0, _range.buildRangeFilter)(field, { gte: 1, lte: 3 }, _index_pattern_response2.default)).to.eql(expected);
    });

    it('should wrap painless scripts in comparator lambdas', function () {
      var field = getField(_index_pattern_response2.default, 'script date');
      var expected = 'boolean gte(Supplier s, def v) {return s.get() >= v} ' + 'boolean lte(Supplier s, def v) {return s.get() <= v}' + ('gte(() -> { ' + field.script + ' }, params.gte) && ') + ('lte(() -> { ' + field.script + ' }, params.lte)');

      var inlineScript = (0, _range.buildRangeFilter)(field, { gte: 1, lte: 3 }, _index_pattern_response2.default).script.script.source;
      (0, _expect2.default)(inlineScript).to.be(expected);
    });

    it('should throw an error when gte and gt, or lte and lt are both passed', function () {
      var field = getField(_index_pattern_response2.default, 'script number');
      (0, _expect2.default)(function () {
        (0, _range.buildRangeFilter)(field, { gte: 1, gt: 3 }, _index_pattern_response2.default);
      }).to.throwError();
      (0, _expect2.default)(function () {
        (0, _range.buildRangeFilter)(field, { lte: 1, lt: 3 }, _index_pattern_response2.default);
      }).to.throwError();
    });

    it('to use the right operator for each of gte, gt, lt and lte', function () {
      var field = getField(_index_pattern_response2.default, 'script number');
      _lodash2.default.each({ gte: '>=', gt: '>', lte: '<=', lt: '<' }, function (operator, key) {
        var params = {};
        params[key] = 5;
        var filter = (0, _range.buildRangeFilter)(field, params, _index_pattern_response2.default);

        (0, _expect2.default)(filter.script.script.source).to.be('(' + field.script + ')' + operator + key);
        (0, _expect2.default)(filter.script.script.params[key]).to.be(5);
        (0, _expect2.default)(filter.script.script.params.value).to.be(operator + 5);
      });
    });

    describe('when given params where one side is infinite', function () {
      var field = getField(_index_pattern_response2.default, 'script number');
      var filter = void 0;
      beforeEach(function () {
        filter = (0, _range.buildRangeFilter)(field, { gte: 0, lt: Infinity }, _index_pattern_response2.default);
      });

      describe('returned filter', function () {
        it('is a script filter', function () {
          (0, _expect2.default)(filter).to.have.property('script');
        });

        it('contain a param for the finite side', function () {
          (0, _expect2.default)(filter.script.script.params).to.have.property('gte', 0);
        });

        it('does not contain a param for the infinite side', function () {
          (0, _expect2.default)(filter.script.script.params).not.to.have.property('lt');
        });

        it('does not contain a script condition for the infinite side', function () {
          var field = getField(_index_pattern_response2.default, 'script number');
          var script = field.script;
          (0, _expect2.default)(filter.script.script.source).to.equal('(' + script + ')>=gte');
        });
      });
    });

    describe('when given params where both sides are infinite', function () {
      var field = getField(_index_pattern_response2.default, 'script number');
      var filter = void 0;
      beforeEach(function () {
        filter = (0, _range.buildRangeFilter)(field, { gte: -Infinity, lt: Infinity }, _index_pattern_response2.default);
      });

      describe('returned filter', function () {
        it('is a match_all filter', function () {
          (0, _expect2.default)(filter).not.to.have.property('script');
          (0, _expect2.default)(filter).to.have.property('match_all');
        });

        it('does not contain params', function () {
          (0, _expect2.default)(filter).not.to.have.property('params');
        });

        it('meta field is set to field name', function () {
          (0, _expect2.default)(filter.meta.field).to.equal('script number');
        });
      });
    });
  });
});

function getField(indexPattern, name) {
  return indexPattern.fields.find(function (field) {
    return field.name === name;
  });
}