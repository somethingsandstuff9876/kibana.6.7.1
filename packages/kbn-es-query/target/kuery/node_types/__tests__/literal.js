'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _literal = require('../literal');

var literal = _interopRequireWildcard(_literal);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

describe('kuery node types', function () {

  describe('literal', function () {

    describe('buildNode', function () {

      it('should return a node representing the given value', function () {
        var result = literal.buildNode('foo');
        (0, _expect2.default)(result).to.have.property('type', 'literal');
        (0, _expect2.default)(result).to.have.property('value', 'foo');
      });
    });

    describe('toElasticsearchQuery', function () {

      it('should return the literal value represented by the given node', function () {
        var node = literal.buildNode('foo');
        var result = literal.toElasticsearchQuery(node);
        (0, _expect2.default)(result).to.be('foo');
      });
    });
  });
});