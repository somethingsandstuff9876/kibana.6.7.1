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

var _geo_polygon = require('../geo_polygon');

var geoPolygon = _interopRequireWildcard(_geo_polygon);

var _node_types = require('../../node_types');

var _index_pattern_response = require('../../../__fixtures__/index_pattern_response.json');

var _index_pattern_response2 = _interopRequireDefault(_index_pattern_response);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var indexPattern = void 0;
var points = [{
  lat: 69.77,
  lon: -171.56
}, {
  lat: 50.06,
  lon: -169.10
}, {
  lat: 69.16,
  lon: -125.85
}];

describe('kuery functions', function () {

  describe('geoPolygon', function () {

    beforeEach(function () {
      indexPattern = _index_pattern_response2.default;
    });

    describe('buildNodeParams', function () {

      it('should return an "arguments" param', function () {
        var result = geoPolygon.buildNodeParams('geo', points);
        (0, _expect2.default)(result).to.only.have.keys('arguments');
      });

      it('arguments should contain the provided fieldName as a literal', function () {
        var result = geoPolygon.buildNodeParams('geo', points);

        var _result$arguments = _slicedToArray(result.arguments, 1),
            fieldName = _result$arguments[0];

        (0, _expect2.default)(fieldName).to.have.property('type', 'literal');
        (0, _expect2.default)(fieldName).to.have.property('value', 'geo');
      });

      it('arguments should contain the provided points literal "lat, lon" string values', function () {
        var result = geoPolygon.buildNodeParams('geo', points);

        var _result$arguments2 = _toArray(result.arguments),
            args = _result$arguments2.slice(1);

        args.forEach(function (param, index) {
          (0, _expect2.default)(param).to.have.property('type', 'literal');
          var expectedPoint = points[index];
          var expectedLatLon = expectedPoint.lat + ', ' + expectedPoint.lon;
          (0, _expect2.default)(param.value).to.be(expectedLatLon);
        });
      });
    });

    describe('toElasticsearchQuery', function () {

      it('should return an ES geo_polygon query representing the given node', function () {
        var node = _node_types.nodeTypes.function.buildNode('geoPolygon', 'geo', points);
        var result = geoPolygon.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(result).to.have.property('geo_polygon');
        (0, _expect2.default)(result.geo_polygon.geo).to.have.property('points');

        result.geo_polygon.geo.points.forEach(function (point, index) {
          var expectedLatLon = points[index].lat + ', ' + points[index].lon;
          (0, _expect2.default)(point).to.be(expectedLatLon);
        });
      });

      it('should return an ES geo_polygon query without an index pattern', function () {
        var node = _node_types.nodeTypes.function.buildNode('geoPolygon', 'geo', points);
        var result = geoPolygon.toElasticsearchQuery(node);
        (0, _expect2.default)(result).to.have.property('geo_polygon');
        (0, _expect2.default)(result.geo_polygon.geo).to.have.property('points');

        result.geo_polygon.geo.points.forEach(function (point, index) {
          var expectedLatLon = points[index].lat + ', ' + points[index].lon;
          (0, _expect2.default)(point).to.be(expectedLatLon);
        });
      });

      it('should use the ignore_unmapped parameter', function () {
        var node = _node_types.nodeTypes.function.buildNode('geoPolygon', 'geo', points);
        var result = geoPolygon.toElasticsearchQuery(node, indexPattern);
        (0, _expect2.default)(result.geo_polygon.ignore_unmapped).to.be(true);
      });

      it('should throw an error for scripted fields', function () {
        var node = _node_types.nodeTypes.function.buildNode('geoPolygon', 'script number', points);
        (0, _expect2.default)(geoPolygon.toElasticsearchQuery).withArgs(node, indexPattern).to.throwException(/Geo polygon query does not support scripted fields/);
      });
    });
  });
});