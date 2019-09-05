'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _geo_bounding_box = require('../geo_bounding_box');

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

  describe('geo_bounding_box filter', function () {

    it('should return a kuery node equivalent to the given filter', function () {
      var filter = {
        meta: {
          type: 'geo_bounding_box',
          key: 'foo',
          params: {
            topLeft: {
              lat: 10,
              lon: 20
            },
            bottomRight: {
              lat: 30,
              lon: 40
            }
          }
        }
      };
      var result = (0, _geo_bounding_box.convertGeoBoundingBox)(filter);

      (0, _expect2.default)(result).to.have.property('type', 'function');
      (0, _expect2.default)(result).to.have.property('function', 'geoBoundingBox');

      var _result$arguments = _toArray(result.arguments),
          fieldName = _result$arguments[0].value,
          args = _result$arguments.slice(1);

      (0, _expect2.default)(fieldName).to.be('foo');

      var argByName = _lodash2.default.mapKeys(args, 'name');
      (0, _expect2.default)(argByName.topLeft.value.value).to.be('10, 20');
      (0, _expect2.default)(argByName.bottomRight.value.value).to.be('30, 40');
    });

    it('should throw an exception if the given filter is not of type "geo_bounding_box"', function () {
      var filter = {
        meta: {
          type: 'foo'
        }
      };

      (0, _expect2.default)(_geo_bounding_box.convertGeoBoundingBox).withArgs(filter).to.throwException(/Expected filter of type "geo_bounding_box", got "foo"/);
    });
  });
});