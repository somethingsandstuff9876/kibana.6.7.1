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

var _ast = require('../ast');

var ast = _interopRequireWildcard(_ast);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _index = require('../../node_types/index');

var _index_pattern_response = require('../../../__fixtures__/index_pattern_response.json');

var _index_pattern_response2 = _interopRequireDefault(_index_pattern_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Helpful utility allowing us to test the PEG parser by simply checking for deep equality between
// the nodes the parser generates and the nodes our constructor functions generate.
function fromLegacyKueryExpressionNoMeta(text) {
  return ast.fromLegacyKueryExpression(text, { includeMetadata: false });
}

var indexPattern = void 0;

describe('kuery AST API', function () {

  beforeEach(function () {
    indexPattern = _index_pattern_response2.default;
  });

  describe('fromLegacyKueryExpression', function () {

    it('should return location and text metadata for each AST node', function () {
      var notNode = ast.fromLegacyKueryExpression('!foo:bar');
      (0, _expect2.default)(notNode).to.have.property('text', '!foo:bar');
      (0, _expect2.default)(notNode.location).to.eql({ min: 0, max: 8 });

      var isNode = notNode.arguments[0];
      (0, _expect2.default)(isNode).to.have.property('text', 'foo:bar');
      (0, _expect2.default)(isNode.location).to.eql({ min: 1, max: 8 });

      var _isNode$arguments = _slicedToArray(isNode.arguments, 2),
          argNode1 = _isNode$arguments[0],
          argNode2 = _isNode$arguments[1];

      (0, _expect2.default)(argNode1).to.have.property('text', 'foo');
      (0, _expect2.default)(argNode1.location).to.eql({ min: 1, max: 4 });

      (0, _expect2.default)(argNode2).to.have.property('text', 'bar');
      (0, _expect2.default)(argNode2.location).to.eql({ min: 5, max: 8 });
    });

    it('should return a match all "is" function for whitespace', function () {
      var expected = _index.nodeTypes.function.buildNode('is', '*', '*');
      var actual = fromLegacyKueryExpressionNoMeta('  ');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should return an "and" function for single literals', function () {
      var expected = _index.nodeTypes.function.buildNode('and', [_index.nodeTypes.literal.buildNode('foo')]);
      var actual = fromLegacyKueryExpressionNoMeta('foo');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should ignore extraneous whitespace at the beginning and end of the query', function () {
      var expected = _index.nodeTypes.function.buildNode('and', [_index.nodeTypes.literal.buildNode('foo')]);
      var actual = fromLegacyKueryExpressionNoMeta('  foo ');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('literals and queries separated by whitespace should be joined by an implicit "and"', function () {
      var expected = _index.nodeTypes.function.buildNode('and', [_index.nodeTypes.literal.buildNode('foo'), _index.nodeTypes.literal.buildNode('bar')]);
      var actual = fromLegacyKueryExpressionNoMeta('foo bar');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should also support explicit "and"s as a binary operator', function () {
      var expected = _index.nodeTypes.function.buildNode('and', [_index.nodeTypes.literal.buildNode('foo'), _index.nodeTypes.literal.buildNode('bar')]);
      var actual = fromLegacyKueryExpressionNoMeta('foo and bar');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should also support "and" as a function', function () {
      var expected = _index.nodeTypes.function.buildNode('and', [_index.nodeTypes.literal.buildNode('foo'), _index.nodeTypes.literal.buildNode('bar')], 'function');
      var actual = fromLegacyKueryExpressionNoMeta('and(foo, bar)');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support "or" as a binary operator', function () {
      var expected = _index.nodeTypes.function.buildNode('or', [_index.nodeTypes.literal.buildNode('foo'), _index.nodeTypes.literal.buildNode('bar')]);
      var actual = fromLegacyKueryExpressionNoMeta('foo or bar');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support "or" as a function', function () {
      var expected = _index.nodeTypes.function.buildNode('or', [_index.nodeTypes.literal.buildNode('foo'), _index.nodeTypes.literal.buildNode('bar')]);
      var actual = fromLegacyKueryExpressionNoMeta('or(foo, bar)');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support negation of queries with a "!" prefix', function () {
      var expected = _index.nodeTypes.function.buildNode('not', _index.nodeTypes.function.buildNode('or', [_index.nodeTypes.literal.buildNode('foo'), _index.nodeTypes.literal.buildNode('bar')]));
      var actual = fromLegacyKueryExpressionNoMeta('!or(foo, bar)');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('"and" should have a higher precedence than "or"', function () {
      var expected = _index.nodeTypes.function.buildNode('or', [_index.nodeTypes.literal.buildNode('foo'), _index.nodeTypes.function.buildNode('or', [_index.nodeTypes.function.buildNode('and', [_index.nodeTypes.literal.buildNode('bar'), _index.nodeTypes.literal.buildNode('baz')]), _index.nodeTypes.literal.buildNode('qux')])]);
      var actual = fromLegacyKueryExpressionNoMeta('foo or bar and baz or qux');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support grouping to override default precedence', function () {
      var expected = _index.nodeTypes.function.buildNode('and', [_index.nodeTypes.function.buildNode('or', [_index.nodeTypes.literal.buildNode('foo'), _index.nodeTypes.literal.buildNode('bar')]), _index.nodeTypes.literal.buildNode('baz')]);
      var actual = fromLegacyKueryExpressionNoMeta('(foo or bar) and baz');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support a shorthand operator syntax for "is" functions', function () {
      var expected = _index.nodeTypes.function.buildNode('is', 'foo', 'bar', true);
      var actual = fromLegacyKueryExpressionNoMeta('foo:bar');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support a shorthand operator syntax for inclusive "range" functions', function () {
      var argumentNodes = [_index.nodeTypes.literal.buildNode('bytes'), _index.nodeTypes.literal.buildNode(1000), _index.nodeTypes.literal.buildNode(8000)];
      var expected = _index.nodeTypes.function.buildNodeWithArgumentNodes('range', argumentNodes);
      var actual = fromLegacyKueryExpressionNoMeta('bytes:[1000 to 8000]');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support functions with named arguments', function () {
      var expected = _index.nodeTypes.function.buildNode('range', 'bytes', { gt: 1000, lt: 8000 });
      var actual = fromLegacyKueryExpressionNoMeta('range(bytes, gt=1000, lt=8000)');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should throw an error for unknown functions', function () {
      (0, _expect2.default)(ast.fromLegacyKueryExpression).withArgs('foo(bar)').to.throwException(/Unknown function "foo"/);
    });
  });

  describe('fromKueryExpression', function () {

    it('should return a match all "is" function for whitespace', function () {
      var expected = _index.nodeTypes.function.buildNode('is', '*', '*');
      var actual = ast.fromKueryExpression('  ');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should return an "is" function with a null field for single literals', function () {
      var expected = _index.nodeTypes.function.buildNode('is', null, 'foo');
      var actual = ast.fromKueryExpression('foo');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should ignore extraneous whitespace at the beginning and end of the query', function () {
      var expected = _index.nodeTypes.function.buildNode('is', null, 'foo');
      var actual = ast.fromKueryExpression('  foo ');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should not split on whitespace', function () {
      var expected = _index.nodeTypes.function.buildNode('is', null, 'foo bar');
      var actual = ast.fromKueryExpression('foo bar');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support "and" as a binary operator', function () {
      var expected = _index.nodeTypes.function.buildNode('and', [_index.nodeTypes.function.buildNode('is', null, 'foo'), _index.nodeTypes.function.buildNode('is', null, 'bar')]);
      var actual = ast.fromKueryExpression('foo and bar');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support "or" as a binary operator', function () {
      var expected = _index.nodeTypes.function.buildNode('or', [_index.nodeTypes.function.buildNode('is', null, 'foo'), _index.nodeTypes.function.buildNode('is', null, 'bar')]);
      var actual = ast.fromKueryExpression('foo or bar');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support negation of queries with a "not" prefix', function () {
      var expected = _index.nodeTypes.function.buildNode('not', _index.nodeTypes.function.buildNode('or', [_index.nodeTypes.function.buildNode('is', null, 'foo'), _index.nodeTypes.function.buildNode('is', null, 'bar')]));
      var actual = ast.fromKueryExpression('not (foo or bar)');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('"and" should have a higher precedence than "or"', function () {
      var expected = _index.nodeTypes.function.buildNode('or', [_index.nodeTypes.function.buildNode('is', null, 'foo'), _index.nodeTypes.function.buildNode('or', [_index.nodeTypes.function.buildNode('and', [_index.nodeTypes.function.buildNode('is', null, 'bar'), _index.nodeTypes.function.buildNode('is', null, 'baz')]), _index.nodeTypes.function.buildNode('is', null, 'qux')])]);
      var actual = ast.fromKueryExpression('foo or bar and baz or qux');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support grouping to override default precedence', function () {
      var expected = _index.nodeTypes.function.buildNode('and', [_index.nodeTypes.function.buildNode('or', [_index.nodeTypes.function.buildNode('is', null, 'foo'), _index.nodeTypes.function.buildNode('is', null, 'bar')]), _index.nodeTypes.function.buildNode('is', null, 'baz')]);
      var actual = ast.fromKueryExpression('(foo or bar) and baz');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support matching against specific fields', function () {
      var expected = _index.nodeTypes.function.buildNode('is', 'foo', 'bar');
      var actual = ast.fromKueryExpression('foo:bar');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should also not split on whitespace when matching specific fields', function () {
      var expected = _index.nodeTypes.function.buildNode('is', 'foo', 'bar baz');
      var actual = ast.fromKueryExpression('foo:bar baz');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should treat quoted values as phrases', function () {
      var expected = _index.nodeTypes.function.buildNode('is', 'foo', 'bar baz', true);
      var actual = ast.fromKueryExpression('foo:"bar baz"');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support a shorthand for matching multiple values against a single field', function () {
      var expected = _index.nodeTypes.function.buildNode('or', [_index.nodeTypes.function.buildNode('is', 'foo', 'bar'), _index.nodeTypes.function.buildNode('is', 'foo', 'baz')]);
      var actual = ast.fromKueryExpression('foo:(bar or baz)');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support "and" and "not" operators and grouping in the shorthand as well', function () {
      var expected = _index.nodeTypes.function.buildNode('and', [_index.nodeTypes.function.buildNode('or', [_index.nodeTypes.function.buildNode('is', 'foo', 'bar'), _index.nodeTypes.function.buildNode('is', 'foo', 'baz')]), _index.nodeTypes.function.buildNode('not', _index.nodeTypes.function.buildNode('is', 'foo', 'qux'))]);
      var actual = ast.fromKueryExpression('foo:((bar or baz) and not qux)');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support exclusive range operators', function () {
      var expected = _index.nodeTypes.function.buildNode('and', [_index.nodeTypes.function.buildNode('range', 'bytes', {
        gt: 1000
      }), _index.nodeTypes.function.buildNode('range', 'bytes', {
        lt: 8000
      })]);
      var actual = ast.fromKueryExpression('bytes > 1000 and bytes < 8000');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support inclusive range operators', function () {
      var expected = _index.nodeTypes.function.buildNode('and', [_index.nodeTypes.function.buildNode('range', 'bytes', {
        gte: 1000
      }), _index.nodeTypes.function.buildNode('range', 'bytes', {
        lte: 8000
      })]);
      var actual = ast.fromKueryExpression('bytes >= 1000 and bytes <= 8000');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support wildcards in field names', function () {
      var expected = _index.nodeTypes.function.buildNode('is', 'machine*', 'osx');
      var actual = ast.fromKueryExpression('machine*:osx');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support wildcards in values', function () {
      var expected = _index.nodeTypes.function.buildNode('is', 'foo', 'ba*');
      var actual = ast.fromKueryExpression('foo:ba*');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should create an exists "is" query when a field is given and "*" is the value', function () {
      var expected = _index.nodeTypes.function.buildNode('is', 'foo', '*');
      var actual = ast.fromKueryExpression('foo:*');
      (0, _expect2.default)(actual).to.eql(expected);
    });
  });

  describe('fromLiteralExpression', function () {

    it('should create literal nodes for unquoted values with correct primitive types', function () {
      var stringLiteral = _index.nodeTypes.literal.buildNode('foo');
      var booleanFalseLiteral = _index.nodeTypes.literal.buildNode(false);
      var booleanTrueLiteral = _index.nodeTypes.literal.buildNode(true);
      var numberLiteral = _index.nodeTypes.literal.buildNode(42);

      (0, _expect2.default)(ast.fromLiteralExpression('foo')).to.eql(stringLiteral);
      (0, _expect2.default)(ast.fromLiteralExpression('true')).to.eql(booleanTrueLiteral);
      (0, _expect2.default)(ast.fromLiteralExpression('false')).to.eql(booleanFalseLiteral);
      (0, _expect2.default)(ast.fromLiteralExpression('42')).to.eql(numberLiteral);
    });

    it('should allow escaping of special characters with a backslash', function () {
      var expected = _index.nodeTypes.literal.buildNode('\\():<>"*');
      // yo dawg
      var actual = ast.fromLiteralExpression('\\\\\\(\\)\\:\\<\\>\\"\\*');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support double quoted strings that do not need escapes except for quotes', function () {
      var expected = _index.nodeTypes.literal.buildNode('\\():<>"*');
      var actual = ast.fromLiteralExpression('"\\():<>\\"*"');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should support escaped backslashes inside quoted strings', function () {
      var expected = _index.nodeTypes.literal.buildNode('\\');
      var actual = ast.fromLiteralExpression('"\\\\"');
      (0, _expect2.default)(actual).to.eql(expected);
    });

    it('should detect wildcards and build wildcard AST nodes', function () {
      var expected = _index.nodeTypes.wildcard.buildNode('foo*bar');
      var actual = ast.fromLiteralExpression('foo*bar');
      (0, _expect2.default)(actual).to.eql(expected);
    });
  });

  describe('toElasticsearchQuery', function () {

    it('should return the given node type\'s ES query representation', function () {
      var node = _index.nodeTypes.function.buildNode('exists', 'response');
      var expected = _index.nodeTypes.function.toElasticsearchQuery(node, indexPattern);
      var result = ast.toElasticsearchQuery(node, indexPattern);
      (0, _expect2.default)(result).to.eql(expected);
    });

    it('should return an empty "and" function for undefined nodes and unknown node types', function () {
      var expected = _index.nodeTypes.function.toElasticsearchQuery(_index.nodeTypes.function.buildNode('and', []));

      (0, _expect2.default)(ast.toElasticsearchQuery()).to.eql(expected);

      var noTypeNode = _index.nodeTypes.function.buildNode('exists', 'foo');
      delete noTypeNode.type;
      (0, _expect2.default)(ast.toElasticsearchQuery(noTypeNode)).to.eql(expected);

      var unknownTypeNode = _index.nodeTypes.function.buildNode('exists', 'foo');
      unknownTypeNode.type = 'notValid';
      (0, _expect2.default)(ast.toElasticsearchQuery(unknownTypeNode)).to.eql(expected);
    });
  });
});