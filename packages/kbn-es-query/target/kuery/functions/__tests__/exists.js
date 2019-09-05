'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /*
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

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _exists = require('../exists');

var exists = _interopRequireWildcard(_exists);

var _node_types = require('../../node_types');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _index_pattern_response = require('../../../__fixtures__/index_pattern_response.json');

var _index_pattern_response2 = _interopRequireDefault(_index_pattern_response);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var indexPattern = void 0;

describe('kuery functions', function () {
  describe('exists', function () {

    beforeEach(function () {
      indexPattern = _index_pattern_response2.default;
    });

    describe('buildNodeParams', function () {
      it('should return a single "arguments" param', function () {
        var result = exists.buildNodeParams('response');
        (0, _expect2.default)(result).to.only.have.key('arguments');
      });

      it('arguments should contain the provided fieldName as a literal', function () {
        var _exists$buildNodePara = exists.buildNodeParams('response'),
            _exists$buildNodePara2 = _slicedToArray(_exists$buildNodePara.arguments, 1),
            arg = _exists$buildNodePara2[0];

        (0, _expect2.default)(arg).to.have.property('type', 'literal');
        (0, _expect2.default)(arg).to.have.property('value', 'response');
      });
    });

    describe('toElasticsearchQuery', function () {
      it('should return an ES exists query', function () {
        var expected = {
          exists: { field: 'response' }
        };

        var existsNode = _node_types.nodeTypes.function.buildNode('exists', 'response');
        var result = exists.toElasticsearchQuery(existsNode, indexPattern);
        (0, _expect2.default)(_lodash2.default.isEqual(expected, result)).to.be(true);
      });

      it('should return an ES exists query without an index pattern', function () {
        var expected = {
          exists: { field: 'response' }
        };

        var existsNode = _node_types.nodeTypes.function.buildNode('exists', 'response');
        var result = exists.toElasticsearchQuery(existsNode);
        (0, _expect2.default)(_lodash2.default.isEqual(expected, result)).to.be(true);
      });

      it('should throw an error for scripted fields', function () {
        var existsNode = _node_types.nodeTypes.function.buildNode('exists', 'script string');
        (0, _expect2.default)(exists.toElasticsearchQuery).withArgs(existsNode, indexPattern).to.throwException(/Exists query does not support scripted fields/);
      });
    });
  });
});