'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _named_arg = require('../named_arg');

var namedArg = _interopRequireWildcard(_named_arg);

var _node_types = require('../../node_types');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('kuery node types', function () {

  describe('named arg', function () {

    describe('buildNode', function () {

      it('should return a node representing a named argument with the given value', function () {
        var result = namedArg.buildNode('fieldName', 'foo');
        (0, _expect2.default)(result).to.have.property('type', 'namedArg');
        (0, _expect2.default)(result).to.have.property('name', 'fieldName');
        (0, _expect2.default)(result).to.have.property('value');

        var literalValue = result.value;
        (0, _expect2.default)(literalValue).to.have.property('type', 'literal');
        (0, _expect2.default)(literalValue).to.have.property('value', 'foo');
      });

      it('should support literal nodes as values', function () {
        var value = _node_types.nodeTypes.literal.buildNode('foo');
        var result = namedArg.buildNode('fieldName', value);
        (0, _expect2.default)(result.value).to.be(value);
        (0, _expect2.default)(result.value).to.eql(value);
      });
    });

    describe('toElasticsearchQuery', function () {

      it('should return the argument value represented by the given node', function () {
        var node = namedArg.buildNode('fieldName', 'foo');
        var result = namedArg.toElasticsearchQuery(node);
        (0, _expect2.default)(result).to.be('foo');
      });
    });
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