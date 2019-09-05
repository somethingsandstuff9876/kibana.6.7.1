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

var _range = require('../range');

var range = _interopRequireWildcard(_range);

var _node_types = require('../../node_types');

var _index_pattern_response = require('../../../__fixtures__/index_pattern_response.json');

var _index_pattern_response2 = _interopRequireDefault(_index_pattern_response);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var indexPattern = void 0;

describe('kuery functions', function () {

  describe('range', function () {

    beforeEach(function () {
      indexPattern = _index_pattern_response2.default;
    });

    describe('buildNodeParams', function () {

      it('arguments should contain the provided fieldName as a literal', function () {
        var result = range.buildNodeParams('bytes', { gt: 1000, lt: 8000 });

        var _result$arguments = _slicedToArray(result.arguments, 1),
            fieldName = _result$arguments[0];

        (0, _expect2.default)(fieldName).to.have.property('type', 'literal');
        (0, _expect2.default)(fieldName).to.have.property('value', 'bytes');
      });

      it('arguments should contain the provided params as named arguments', function () {
        var givenParams = { gt: 1000, lt: 8000, format: 'epoch_millis' };
        var result = range.buildNodeParams('bytes', givenParams);

        var _result$arguments2 = _toArray(result.arguments),
            params = _result$arguments2.slice(1);

        (0, _expect2.default)(params).to.be.an('array');
        (0, _expect2.default)(params).to.not.be.empty();

        params.map(function (param) {
          (0, _expect2.default)(param).to.have.property('type', 'namedArg');
          (0, _expect2.default)(['gt', 'lt', 'format'].includes(param.name)).to.be(true);
          (0, _expect2.default)(param.value.type).to.be('literal');
          (0, _expect2.default)(param.value.value).to.be(givenParams[param.name]);
        });
      });
    });

    describe('toElasticsearchQuery', function () {

      it('should return an ES range query for the node\'s field and params', function () {
        var expected = {
          bool: {
            should: [{
              range: {
                bytes: {
                  gt: 1000,
                  lt: 8000
                }
              }
            }],
            minimum_should_match: 1
          }
        };

        var node = _node_types.nodeTypes.function.buildNode('range', 'bytes', { gt: 1000, lt: 8000 });
        var result = range.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(result).to.eql(expected);
      });

      it('should return an ES range query without an index pattern', function () {
        var expected = {
          bool: {
            should: [{
              range: {
                bytes: {
                  gt: 1000,
                  lt: 8000
                }
              }
            }],
            minimum_should_match: 1
          }
        };

        var node = _node_types.nodeTypes.function.buildNode('range', 'bytes', { gt: 1000, lt: 8000 });
        var result = range.toElasticsearchQuery(node);
        (0, _expect2.default)(result).to.eql(expected);
      });

      it('should support wildcard field names', function () {
        var expected = {
          bool: {
            should: [{
              range: {
                bytes: {
                  gt: 1000,
                  lt: 8000
                }
              }
            }],
            minimum_should_match: 1
          }
        };

        var node = _node_types.nodeTypes.function.buildNode('range', 'byt*', { gt: 1000, lt: 8000 });
        var result = range.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(result).to.eql(expected);
      });

      it('should support scripted fields', function () {
        var node = _node_types.nodeTypes.function.buildNode('range', 'script number', { gt: 1000, lt: 8000 });
        var result = range.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(result.bool.should[0]).to.have.key('script');
      });
    });
  });
});