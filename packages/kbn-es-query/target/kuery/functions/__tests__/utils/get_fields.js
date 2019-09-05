'use strict';

var _get_fields = require('../../utils/get_fields');

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _index_pattern_response = require('../../../../__fixtures__/index_pattern_response.json');

var _index_pattern_response2 = _interopRequireDefault(_index_pattern_response);

var _ = require('../../..');

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

var indexPattern = void 0;

describe('getFields', function () {

  beforeEach(function () {
    indexPattern = _index_pattern_response2.default;
  });

  describe('field names without a wildcard', function () {

    it('should return an empty array if the field does not exist in the index pattern', function () {
      var fieldNameNode = _.nodeTypes.literal.buildNode('nonExistentField');
      var expected = [];
      var actual = (0, _get_fields.getFields)(fieldNameNode, indexPattern);
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should return the single matching field in an array', function () {
      var fieldNameNode = _.nodeTypes.literal.buildNode('extension');
      var results = (0, _get_fields.getFields)(fieldNameNode, indexPattern);
      (0, _expect2.default)(results).to.be.an('array');
      (0, _expect2.default)(results).to.have.length(1);
      (0, _expect2.default)(results[0].name).to.be('extension');
    });

    it('should not match a wildcard in a literal node', function () {
      var indexPatternWithWildField = {
        title: 'wildIndex',
        fields: [{
          name: 'foo*'
        }]
      };

      var fieldNameNode = _.nodeTypes.literal.buildNode('foo*');
      var results = (0, _get_fields.getFields)(fieldNameNode, indexPatternWithWildField);
      (0, _expect2.default)(results).to.be.an('array');
      (0, _expect2.default)(results).to.have.length(1);
      (0, _expect2.default)(results[0].name).to.be('foo*');

      // ensure the wildcard is not actually being parsed
      var expected = [];
      var actual = (0, _get_fields.getFields)(_.nodeTypes.literal.buildNode('fo*'), indexPatternWithWildField);
      (0, _expect2.default)(actual).to.eql(expected);
    });
  });

  describe('field name patterns with a wildcard', function () {

    it('should return an empty array if it does not match any fields in the index pattern', function () {
      var fieldNameNode = _.nodeTypes.wildcard.buildNode('nonExistent*');
      var expected = [];
      var actual = (0, _get_fields.getFields)(fieldNameNode, indexPattern);
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should return all fields that match the pattern in an array', function () {
      var fieldNameNode = _.nodeTypes.wildcard.buildNode('machine*');
      var results = (0, _get_fields.getFields)(fieldNameNode, indexPattern);
      (0, _expect2.default)(results).to.be.an('array');
      (0, _expect2.default)(results).to.have.length(2);
      (0, _expect2.default)(results.find(function (field) {
        return field.name === 'machine.os';
      })).to.be.ok();
      (0, _expect2.default)(results.find(function (field) {
        return field.name === 'machine.os.raw';
      })).to.be.ok();
    });
  });
});