'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _geo_polygon = require('../geo_polygon');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); } /*
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

describe('filter to kuery migration', function () {

  describe('geo_polygon filter', function () {

    it('should return a kuery node equivalent to the given filter', function () {
      var filter = {
        meta: {
          type: 'geo_polygon',
          key: 'foo',
          params: {
            points: [{
              lat: 10,
              lon: 20
            }, {
              lat: 30,
              lon: 40
            }]
          }
        }
      };
      var result = (0, _geo_polygon.convertGeoPolygon)(filter);

      (0, _expect2.default)(result).to.have.property('type', 'function');
      (0, _expect2.default)(result).to.have.property('function', 'geoPolygon');

      var _result$arguments = _toArray(result.arguments),
          fieldName = _result$arguments[0].value,
          args = _result$arguments.slice(1);

      (0, _expect2.default)(fieldName).to.be('foo');

      (0, _expect2.default)(args[0].value).to.be('10, 20');
      (0, _expect2.default)(args[1].value).to.be('30, 40');
    });

    it('should throw an exception if the given filter is not of type "geo_polygon"', function () {
      var filter = {
        meta: {
          type: 'foo'
        }
      };

      (0, _expect2.default)(_geo_polygon.convertGeoPolygon).withArgs(filter).to.throwException(/Expected filter of type "geo_polygon", got "foo"/);
    });
  });
});