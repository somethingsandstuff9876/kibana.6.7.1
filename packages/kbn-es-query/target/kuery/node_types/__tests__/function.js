'use strict';

var _function = require('../function');

var functionType = _interopRequireWildcard(_function);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _is = require('../../functions/is');

var isFunction = _interopRequireWildcard(_is);

var _index_pattern_response = require('../../../__fixtures__/index_pattern_response.json');

var _index_pattern_response2 = _interopRequireDefault(_index_pattern_response);

var _node_types = require('../../node_types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

describe('kuery node types', function () {

  describe('function', function () {

    var indexPattern = void 0;

    beforeEach(function () {
      indexPattern = _index_pattern_response2.default;
    });

    describe('buildNode', function () {

      it('should return a node representing the given kuery function', function () {
        var result = functionType.buildNode('is', 'extension', 'jpg');
        (0, _expect2.default)(result).to.have.property('type', 'function');
        (0, _expect2.default)(result).to.have.property('function', 'is');
        (0, _expect2.default)(result).to.have.property('arguments');
      });
    });

    describe('buildNodeWithArgumentNodes', function () {

      it('should return a function node with the given argument list untouched', function () {
        var fieldNameLiteral = _node_types.nodeTypes.literal.buildNode('extension');
        var valueLiteral = _node_types.nodeTypes.literal.buildNode('jpg');
        var argumentNodes = [fieldNameLiteral, valueLiteral];
        var result = functionType.buildNodeWithArgumentNodes('is', argumentNodes);

        (0, _expect2.default)(result).to.have.property('type', 'function');
        (0, _expect2.default)(result).to.have.property('function', 'is');
        (0, _expect2.default)(result).to.have.property('arguments');
        (0, _expect2.default)(result.arguments).to.be(argumentNodes);
        (0, _expect2.default)(result.arguments).to.eql(argumentNodes);
      });
    });

    describe('toElasticsearchQuery', function () {

      it('should return the given function type\'s ES query representation', function () {
        var node = functionType.buildNode('is', 'extension', 'jpg');
        var expected = isFunction.toElasticsearchQuery(node, indexPattern);
        var result = functionType.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(_lodash2.default.isEqual(expected, result)).to.be(true);
      });
    });
  });
});