'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _wildcard = require('../wildcard');

var wildcard = _interopRequireWildcard(_wildcard);

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

  describe('wildcard', function () {

    describe('buildNode', function () {

      it('should accept a string argument representing a wildcard string', function () {
        var wildcardValue = 'foo' + wildcard.wildcardSymbol + 'bar';
        var result = wildcard.buildNode(wildcardValue);
        (0, _expect2.default)(result).to.have.property('type', 'wildcard');
        (0, _expect2.default)(result).to.have.property('value', wildcardValue);
      });

      it('should accept and parse a wildcard string', function () {
        var result = wildcard.buildNode('foo*bar');
        (0, _expect2.default)(result).to.have.property('type', 'wildcard');
        (0, _expect2.default)(result.value).to.be('foo' + wildcard.wildcardSymbol + 'bar');
      });
    });

    describe('toElasticsearchQuery', function () {

      it('should return the string representation of the wildcard literal', function () {
        var node = wildcard.buildNode('foo*bar');
        var result = wildcard.toElasticsearchQuery(node);
        (0, _expect2.default)(result).to.be('foo*bar');
      });
    });

    describe('toQueryStringQuery', function () {

      it('should return the string representation of the wildcard literal', function () {
        var node = wildcard.buildNode('foo*bar');
        var result = wildcard.toQueryStringQuery(node);
        (0, _expect2.default)(result).to.be('foo*bar');
      });

      it('should escape query_string query special characters other than wildcard', function () {
        var node = wildcard.buildNode('+foo*bar');
        var result = wildcard.toQueryStringQuery(node);
        (0, _expect2.default)(result).to.be('\\+foo*bar');
      });
    });

    describe('test', function () {

      it('should return a boolean indicating whether the string matches the given wildcard node', function () {
        var node = wildcard.buildNode('foo*bar');
        (0, _expect2.default)(wildcard.test(node, 'foobar')).to.be(true);
        (0, _expect2.default)(wildcard.test(node, 'foobazbar')).to.be(true);
        (0, _expect2.default)(wildcard.test(node, 'foobar')).to.be(true);

        (0, _expect2.default)(wildcard.test(node, 'fooqux')).to.be(false);
        (0, _expect2.default)(wildcard.test(node, 'bazbar')).to.be(false);
      });

      it('should return a true even when the string has newlines or tabs', function () {
        var node = wildcard.buildNode('foo*bar');
        (0, _expect2.default)(wildcard.test(node, 'foo\nbar')).to.be(true);
        (0, _expect2.default)(wildcard.test(node, 'foo\tbar')).to.be(true);
      });
    });

    describe('hasLeadingWildcard', function () {
      it('should determine whether a wildcard node contains a leading wildcard', function () {
        var node = wildcard.buildNode('foo*bar');
        (0, _expect2.default)(wildcard.hasLeadingWildcard(node)).to.be(false);

        var leadingWildcardNode = wildcard.buildNode('*foobar');
        (0, _expect2.default)(wildcard.hasLeadingWildcard(leadingWildcardNode)).to.be(true);
      });

      // Lone wildcards become exists queries, so we aren't worried about their performance
      it('should not consider a lone wildcard to be a leading wildcard', function () {
        var leadingWildcardNode = wildcard.buildNode('*');
        (0, _expect2.default)(wildcard.hasLeadingWildcard(leadingWildcardNode)).to.be(false);
      });
    });
  });
});