'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.Fn = Fn;

var _lodash = require('lodash');

var _arg = require('./arg');

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

function Fn(config) {
  var _this = this;

  // Required
  this.name = config.name; // Name of function

  // Return type of function.
  // This SHOULD be supplied. We use it for UI and autocomplete hinting,
  // We may also use it for optimizations in the future.
  this.type = config.type;
  this.aliases = config.aliases || [];

  // Function to run function (context, args)
  this.fn = function () {
    return Promise.resolve(config.fn.apply(config, arguments));
  };

  // Optional
  this.help = config.help || ''; // A short help text
  this.args = (0, _lodash.mapValues)(config.args || {}, function (arg, name) {
    return new _arg.Arg((0, _extends3.default)({ name: name }, arg));
  });

  this.context = config.context || {};

  this.accepts = function (type) {
    if (!_this.context.types) return true; // If you don't tell us about context, we'll assume you don't care what you get
    return (0, _lodash.includes)(_this.context.types, type); // Otherwise, check it
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vbGliL2ZuLmpzIl0sIm5hbWVzIjpbIkZuIiwiY29uZmlnIiwibmFtZSIsInR5cGUiLCJhbGlhc2VzIiwiZm4iLCJQcm9taXNlIiwicmVzb2x2ZSIsImhlbHAiLCJhcmdzIiwiYXJnIiwiY29udGV4dCIsImFjY2VwdHMiLCJ0eXBlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztRQXNCZ0JBLEUsR0FBQUEsRTs7QUFIaEI7O0FBQ0E7Ozs7QUFwQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQk8sU0FBU0EsRUFBVCxDQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ3pCO0FBQ0EsT0FBS0MsSUFBTCxHQUFZRCxPQUFPQyxJQUFuQixDQUZ5QixDQUVBOztBQUV6QjtBQUNBO0FBQ0E7QUFDQSxPQUFLQyxJQUFMLEdBQVlGLE9BQU9FLElBQW5CO0FBQ0EsT0FBS0MsT0FBTCxHQUFlSCxPQUFPRyxPQUFQLElBQWtCLEVBQWpDOztBQUVBO0FBQ0EsT0FBS0MsRUFBTCxHQUFVO0FBQUEsV0FBYUMsUUFBUUMsT0FBUixDQUFnQk4sT0FBT0ksRUFBUCx5QkFBaEIsQ0FBYjtBQUFBLEdBQVY7O0FBRUE7QUFDQSxPQUFLRyxJQUFMLEdBQVlQLE9BQU9PLElBQVAsSUFBZSxFQUEzQixDQWR5QixDQWNNO0FBQy9CLE9BQUtDLElBQUwsR0FBWSx1QkFBVVIsT0FBT1EsSUFBUCxJQUFlLEVBQXpCLEVBQTZCLFVBQUNDLEdBQUQsRUFBTVIsSUFBTjtBQUFBLFdBQWUsc0NBQVVBLFVBQVYsSUFBbUJRLEdBQW5CLEVBQWY7QUFBQSxHQUE3QixDQUFaOztBQUVBLE9BQUtDLE9BQUwsR0FBZVYsT0FBT1UsT0FBUCxJQUFrQixFQUFqQzs7QUFFQSxPQUFLQyxPQUFMLEdBQWUsZ0JBQVE7QUFDckIsUUFBSSxDQUFDLE1BQUtELE9BQUwsQ0FBYUUsS0FBbEIsRUFBeUIsT0FBTyxJQUFQLENBREosQ0FDaUI7QUFDdEMsV0FBTyxzQkFBUyxNQUFLRixPQUFMLENBQWFFLEtBQXRCLEVBQTZCVixJQUE3QixDQUFQLENBRnFCLENBRXNCO0FBQzVDLEdBSEQ7QUFJRCIsImZpbGUiOiJmbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBtYXBWYWx1ZXMsIGluY2x1ZGVzIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IEFyZyB9IGZyb20gJy4vYXJnJztcblxuZXhwb3J0IGZ1bmN0aW9uIEZuKGNvbmZpZykge1xuICAvLyBSZXF1aXJlZFxuICB0aGlzLm5hbWUgPSBjb25maWcubmFtZTsgLy8gTmFtZSBvZiBmdW5jdGlvblxuXG4gIC8vIFJldHVybiB0eXBlIG9mIGZ1bmN0aW9uLlxuICAvLyBUaGlzIFNIT1VMRCBiZSBzdXBwbGllZC4gV2UgdXNlIGl0IGZvciBVSSBhbmQgYXV0b2NvbXBsZXRlIGhpbnRpbmcsXG4gIC8vIFdlIG1heSBhbHNvIHVzZSBpdCBmb3Igb3B0aW1pemF0aW9ucyBpbiB0aGUgZnV0dXJlLlxuICB0aGlzLnR5cGUgPSBjb25maWcudHlwZTtcbiAgdGhpcy5hbGlhc2VzID0gY29uZmlnLmFsaWFzZXMgfHwgW107XG5cbiAgLy8gRnVuY3Rpb24gdG8gcnVuIGZ1bmN0aW9uIChjb250ZXh0LCBhcmdzKVxuICB0aGlzLmZuID0gKC4uLmFyZ3MpID0+IFByb21pc2UucmVzb2x2ZShjb25maWcuZm4oLi4uYXJncykpO1xuXG4gIC8vIE9wdGlvbmFsXG4gIHRoaXMuaGVscCA9IGNvbmZpZy5oZWxwIHx8ICcnOyAvLyBBIHNob3J0IGhlbHAgdGV4dFxuICB0aGlzLmFyZ3MgPSBtYXBWYWx1ZXMoY29uZmlnLmFyZ3MgfHwge30sIChhcmcsIG5hbWUpID0+IG5ldyBBcmcoeyBuYW1lLCAuLi5hcmcgfSkpO1xuXG4gIHRoaXMuY29udGV4dCA9IGNvbmZpZy5jb250ZXh0IHx8IHt9O1xuXG4gIHRoaXMuYWNjZXB0cyA9IHR5cGUgPT4ge1xuICAgIGlmICghdGhpcy5jb250ZXh0LnR5cGVzKSByZXR1cm4gdHJ1ZTsgLy8gSWYgeW91IGRvbid0IHRlbGwgdXMgYWJvdXQgY29udGV4dCwgd2UnbGwgYXNzdW1lIHlvdSBkb24ndCBjYXJlIHdoYXQgeW91IGdldFxuICAgIHJldHVybiBpbmNsdWRlcyh0aGlzLmNvbnRleHQudHlwZXMsIHR5cGUpOyAvLyBPdGhlcndpc2UsIGNoZWNrIGl0XG4gIH07XG59XG4iXX0=