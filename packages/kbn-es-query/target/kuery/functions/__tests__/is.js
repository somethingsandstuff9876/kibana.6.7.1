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

var _is = require('../is');

var is = _interopRequireWildcard(_is);

var _node_types = require('../../node_types');

var _index_pattern_response = require('../../../__fixtures__/index_pattern_response.json');

var _index_pattern_response2 = _interopRequireDefault(_index_pattern_response);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var indexPattern = void 0;

describe('kuery functions', function () {

  describe('is', function () {

    beforeEach(function () {
      indexPattern = _index_pattern_response2.default;
    });

    describe('buildNodeParams', function () {

      it('fieldName and value should be required arguments', function () {
        (0, _expect2.default)(is.buildNodeParams).to.throwException(/fieldName is a required argument/);
        (0, _expect2.default)(is.buildNodeParams).withArgs('foo').to.throwException(/value is a required argument/);
      });

      it('arguments should contain the provided fieldName and value as literals', function () {
        var _is$buildNodeParams = is.buildNodeParams('response', 200),
            _is$buildNodeParams$a = _slicedToArray(_is$buildNodeParams.arguments, 2),
            fieldName = _is$buildNodeParams$a[0],
            value = _is$buildNodeParams$a[1];

        (0, _expect2.default)(fieldName).to.have.property('type', 'literal');
        (0, _expect2.default)(fieldName).to.have.property('value', 'response');

        (0, _expect2.default)(value).to.have.property('type', 'literal');
        (0, _expect2.default)(value).to.have.property('value', 200);
      });

      it('should detect wildcards in the provided arguments', function () {
        var _is$buildNodeParams2 = is.buildNodeParams('machine*', 'win*'),
            _is$buildNodeParams2$ = _slicedToArray(_is$buildNodeParams2.arguments, 2),
            fieldName = _is$buildNodeParams2$[0],
            value = _is$buildNodeParams2$[1];

        (0, _expect2.default)(fieldName).to.have.property('type', 'wildcard');
        (0, _expect2.default)(value).to.have.property('type', 'wildcard');
      });

      it('should default to a non-phrase query', function () {
        var _is$buildNodeParams3 = is.buildNodeParams('response', 200),
            _is$buildNodeParams3$ = _slicedToArray(_is$buildNodeParams3.arguments, 3),
            isPhrase = _is$buildNodeParams3$[2];

        (0, _expect2.default)(isPhrase.value).to.be(false);
      });

      it('should allow specification of a phrase query', function () {
        var _is$buildNodeParams4 = is.buildNodeParams('response', 200, true),
            _is$buildNodeParams4$ = _slicedToArray(_is$buildNodeParams4.arguments, 3),
            isPhrase = _is$buildNodeParams4$[2];

        (0, _expect2.default)(isPhrase.value).to.be(true);
      });
    });

    describe('toElasticsearchQuery', function () {

      it('should return an ES match_all query when fieldName and value are both "*"', function () {
        var expected = {
          match_all: {}
        };

        var node = _node_types.nodeTypes.function.buildNode('is', '*', '*');
        var result = is.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(result).to.eql(expected);
      });

      it('should return an ES multi_match query using default_field when fieldName is null', function () {
        var expected = {
          multi_match: {
            query: 200,
            type: 'best_fields',
            lenient: true
          }
        };

        var node = _node_types.nodeTypes.function.buildNode('is', null, 200);
        var result = is.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(result).to.eql(expected);
      });

      it('should return an ES query_string query using default_field when fieldName is null and value contains a wildcard', function () {
        var expected = {
          query_string: {
            query: 'jpg*'
          }
        };

        var node = _node_types.nodeTypes.function.buildNode('is', null, 'jpg*');
        var result = is.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(result).to.eql(expected);
      });

      it('should return an ES bool query with a sub-query for each field when fieldName is "*"', function () {
        var node = _node_types.nodeTypes.function.buildNode('is', '*', 200);
        var result = is.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(result).to.have.property('bool');
        (0, _expect2.default)(result.bool.should).to.have.length(indexPattern.fields.length);
      });

      it('should return an ES exists query when value is "*"', function () {
        var expected = {
          bool: {
            should: [{ exists: { field: 'extension' } }],
            minimum_should_match: 1
          }
        };

        var node = _node_types.nodeTypes.function.buildNode('is', 'extension', '*');
        var result = is.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(result).to.eql(expected);
      });

      it('should return an ES match query when a concrete fieldName and value are provided', function () {
        var expected = {
          bool: {
            should: [{ match: { extension: 'jpg' } }],
            minimum_should_match: 1
          }
        };

        var node = _node_types.nodeTypes.function.buildNode('is', 'extension', 'jpg');
        var result = is.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(result).to.eql(expected);
      });

      it('should return an ES match query when a concrete fieldName and value are provided without an index pattern', function () {
        var expected = {
          bool: {
            should: [{ match: { extension: 'jpg' } }],
            minimum_should_match: 1
          }
        };

        var node = _node_types.nodeTypes.function.buildNode('is', 'extension', 'jpg');
        var result = is.toElasticsearchQuery(node);
        (0, _expect2.default)(result).to.eql(expected);
      });

      it('should support creation of phrase queries', function () {
        var expected = {
          bool: {
            should: [{ match_phrase: { extension: 'jpg' } }],
            minimum_should_match: 1
          }
        };

        var node = _node_types.nodeTypes.function.buildNode('is', 'extension', 'jpg', true);
        var result = is.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(result).to.eql(expected);
      });

      it('should create a query_string query for wildcard values', function () {
        var expected = {
          bool: {
            should: [{
              query_string: {
                fields: ['extension'],
                query: 'jpg*'
              }
            }],
            minimum_should_match: 1
          }
        };

        var node = _node_types.nodeTypes.function.buildNode('is', 'extension', 'jpg*');
        var result = is.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(result).to.eql(expected);
      });

      it('should support scripted fields', function () {
        var node = _node_types.nodeTypes.function.buildNode('is', 'script string', 'foo');
        var result = is.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(result.bool.should[0]).to.have.key('script');
      });
    });
  });
});