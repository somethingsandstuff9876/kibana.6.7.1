'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Type = Type;

var _lodash = require('lodash');

var _get_type = require('./get_type');

// TODO: Currently all casting functions must be syncronous.

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

// All types must be universal and be castable on the client or on the server
function Type(config) {
  var _this = this;

  // Required
  this.name = config.name;

  // Optional
  this.help = config.help || ''; // A short help text

  // Optional type validation, useful for checking function output
  this.validate = config.validate || function validate() {};

  // Optional
  this.create = config.create;

  // Optional serialization (used when passing context around client/server)
  this.serialize = config.serialize;
  this.deserialize = config.deserialize;

  var getToFn = function getToFn(type) {
    return (0, _lodash.get)(config, ['to', type]) || (0, _lodash.get)(config, ['to', '*']);
  };
  var getFromFn = function getFromFn(type) {
    return (0, _lodash.get)(config, ['from', type]) || (0, _lodash.get)(config, ['from', '*']);
  };

  this.castsTo = function (type) {
    return typeof getToFn(type) === 'function';
  };
  this.castsFrom = function (type) {
    return typeof getFromFn(type) === 'function';
  };

  this.to = function (node, toTypeName, types) {
    var typeName = (0, _get_type.getType)(node);
    if (typeName !== _this.name) {
      throw new Error('Can not cast object of type \'' + typeName + '\' using \'' + _this.name + '\'');
    } else if (!_this.castsTo(toTypeName)) {
      throw new Error('Can not cast \'' + typeName + '\' to \'' + toTypeName + '\'');
    }

    return getToFn(toTypeName)(node, types);
  };

  this.from = function (node, types) {
    var typeName = (0, _get_type.getType)(node);
    if (!_this.castsFrom(typeName)) throw new Error('Can not cast \'' + _this.name + '\' from ' + typeName);

    return getFromFn(typeName)(node, types);
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vbGliL3R5cGUuanMiXSwibmFtZXMiOlsiVHlwZSIsImNvbmZpZyIsIm5hbWUiLCJoZWxwIiwidmFsaWRhdGUiLCJjcmVhdGUiLCJzZXJpYWxpemUiLCJkZXNlcmlhbGl6ZSIsImdldFRvRm4iLCJ0eXBlIiwiZ2V0RnJvbUZuIiwiY2FzdHNUbyIsImNhc3RzRnJvbSIsInRvIiwibm9kZSIsInRvVHlwZU5hbWUiLCJ0eXBlcyIsInR5cGVOYW1lIiwiRXJyb3IiLCJmcm9tIl0sIm1hcHBpbmdzIjoiOzs7OztRQXlCZ0JBLEksR0FBQUEsSTs7QUFMaEI7O0FBQ0E7O0FBRUE7O0FBdkJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBO0FBTU8sU0FBU0EsSUFBVCxDQUFjQyxNQUFkLEVBQXNCO0FBQUE7O0FBQzNCO0FBQ0EsT0FBS0MsSUFBTCxHQUFZRCxPQUFPQyxJQUFuQjs7QUFFQTtBQUNBLE9BQUtDLElBQUwsR0FBWUYsT0FBT0UsSUFBUCxJQUFlLEVBQTNCLENBTDJCLENBS0k7O0FBRS9CO0FBQ0EsT0FBS0MsUUFBTCxHQUFnQkgsT0FBT0csUUFBUCxJQUFtQixTQUFTQSxRQUFULEdBQW9CLENBQUUsQ0FBekQ7O0FBRUE7QUFDQSxPQUFLQyxNQUFMLEdBQWNKLE9BQU9JLE1BQXJCOztBQUVBO0FBQ0EsT0FBS0MsU0FBTCxHQUFpQkwsT0FBT0ssU0FBeEI7QUFDQSxPQUFLQyxXQUFMLEdBQW1CTixPQUFPTSxXQUExQjs7QUFFQSxNQUFNQyxVQUFVLFNBQVZBLE9BQVU7QUFBQSxXQUFRLGlCQUFJUCxNQUFKLEVBQVksQ0FBQyxJQUFELEVBQU9RLElBQVAsQ0FBWixLQUE2QixpQkFBSVIsTUFBSixFQUFZLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FBWixDQUFyQztBQUFBLEdBQWhCO0FBQ0EsTUFBTVMsWUFBWSxTQUFaQSxTQUFZO0FBQUEsV0FBUSxpQkFBSVQsTUFBSixFQUFZLENBQUMsTUFBRCxFQUFTUSxJQUFULENBQVosS0FBK0IsaUJBQUlSLE1BQUosRUFBWSxDQUFDLE1BQUQsRUFBUyxHQUFULENBQVosQ0FBdkM7QUFBQSxHQUFsQjs7QUFFQSxPQUFLVSxPQUFMLEdBQWU7QUFBQSxXQUFRLE9BQU9ILFFBQVFDLElBQVIsQ0FBUCxLQUF5QixVQUFqQztBQUFBLEdBQWY7QUFDQSxPQUFLRyxTQUFMLEdBQWlCO0FBQUEsV0FBUSxPQUFPRixVQUFVRCxJQUFWLENBQVAsS0FBMkIsVUFBbkM7QUFBQSxHQUFqQjs7QUFFQSxPQUFLSSxFQUFMLEdBQVUsVUFBQ0MsSUFBRCxFQUFPQyxVQUFQLEVBQW1CQyxLQUFuQixFQUE2QjtBQUNyQyxRQUFNQyxXQUFXLHVCQUFRSCxJQUFSLENBQWpCO0FBQ0EsUUFBSUcsYUFBYSxNQUFLZixJQUF0QixFQUE0QjtBQUMxQixZQUFNLElBQUlnQixLQUFKLG9DQUEwQ0QsUUFBMUMsbUJBQThELE1BQUtmLElBQW5FLFFBQU47QUFDRCxLQUZELE1BR0ssSUFBSSxDQUFDLE1BQUtTLE9BQUwsQ0FBYUksVUFBYixDQUFMLEVBQStCO0FBQ2xDLFlBQU0sSUFBSUcsS0FBSixxQkFBMkJELFFBQTNCLGdCQUE0Q0YsVUFBNUMsUUFBTjtBQUNEOztBQUVELFdBQU9QLFFBQVFPLFVBQVIsRUFBb0JELElBQXBCLEVBQTBCRSxLQUExQixDQUFQO0FBQ0QsR0FWRDs7QUFZQSxPQUFLRyxJQUFMLEdBQVksVUFBQ0wsSUFBRCxFQUFPRSxLQUFQLEVBQWlCO0FBQzNCLFFBQU1DLFdBQVcsdUJBQVFILElBQVIsQ0FBakI7QUFDQSxRQUFJLENBQUMsTUFBS0YsU0FBTCxDQUFlSyxRQUFmLENBQUwsRUFBK0IsTUFBTSxJQUFJQyxLQUFKLHFCQUEyQixNQUFLaEIsSUFBaEMsZ0JBQThDZSxRQUE5QyxDQUFOOztBQUUvQixXQUFPUCxVQUFVTyxRQUFWLEVBQW9CSCxJQUFwQixFQUEwQkUsS0FBMUIsQ0FBUDtBQUNELEdBTEQ7QUFNRCIsImZpbGUiOiJ0eXBlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIExpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmUgb3IgbW9yZSBjb250cmlidXRvclxuICogbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAqIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0XG4gKiBvd25lcnNoaXAuIEVsYXN0aWNzZWFyY2ggQi5WLiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyXG4gKiB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5XG4gKiBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8vIEFsbCB0eXBlcyBtdXN0IGJlIHVuaXZlcnNhbCBhbmQgYmUgY2FzdGFibGUgb24gdGhlIGNsaWVudCBvciBvbiB0aGUgc2VydmVyXG5pbXBvcnQgeyBnZXQgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgZ2V0VHlwZSB9IGZyb20gJy4vZ2V0X3R5cGUnO1xuXG4vLyBUT0RPOiBDdXJyZW50bHkgYWxsIGNhc3RpbmcgZnVuY3Rpb25zIG11c3QgYmUgc3luY3Jvbm91cy5cblxuZXhwb3J0IGZ1bmN0aW9uIFR5cGUoY29uZmlnKSB7XG4gIC8vIFJlcXVpcmVkXG4gIHRoaXMubmFtZSA9IGNvbmZpZy5uYW1lO1xuXG4gIC8vIE9wdGlvbmFsXG4gIHRoaXMuaGVscCA9IGNvbmZpZy5oZWxwIHx8ICcnOyAvLyBBIHNob3J0IGhlbHAgdGV4dFxuXG4gIC8vIE9wdGlvbmFsIHR5cGUgdmFsaWRhdGlvbiwgdXNlZnVsIGZvciBjaGVja2luZyBmdW5jdGlvbiBvdXRwdXRcbiAgdGhpcy52YWxpZGF0ZSA9IGNvbmZpZy52YWxpZGF0ZSB8fCBmdW5jdGlvbiB2YWxpZGF0ZSgpIHt9O1xuXG4gIC8vIE9wdGlvbmFsXG4gIHRoaXMuY3JlYXRlID0gY29uZmlnLmNyZWF0ZTtcblxuICAvLyBPcHRpb25hbCBzZXJpYWxpemF0aW9uICh1c2VkIHdoZW4gcGFzc2luZyBjb250ZXh0IGFyb3VuZCBjbGllbnQvc2VydmVyKVxuICB0aGlzLnNlcmlhbGl6ZSA9IGNvbmZpZy5zZXJpYWxpemU7XG4gIHRoaXMuZGVzZXJpYWxpemUgPSBjb25maWcuZGVzZXJpYWxpemU7XG5cbiAgY29uc3QgZ2V0VG9GbiA9IHR5cGUgPT4gZ2V0KGNvbmZpZywgWyd0bycsIHR5cGVdKSB8fCBnZXQoY29uZmlnLCBbJ3RvJywgJyonXSk7XG4gIGNvbnN0IGdldEZyb21GbiA9IHR5cGUgPT4gZ2V0KGNvbmZpZywgWydmcm9tJywgdHlwZV0pIHx8IGdldChjb25maWcsIFsnZnJvbScsICcqJ10pO1xuXG4gIHRoaXMuY2FzdHNUbyA9IHR5cGUgPT4gdHlwZW9mIGdldFRvRm4odHlwZSkgPT09ICdmdW5jdGlvbic7XG4gIHRoaXMuY2FzdHNGcm9tID0gdHlwZSA9PiB0eXBlb2YgZ2V0RnJvbUZuKHR5cGUpID09PSAnZnVuY3Rpb24nO1xuXG4gIHRoaXMudG8gPSAobm9kZSwgdG9UeXBlTmFtZSwgdHlwZXMpID0+IHtcbiAgICBjb25zdCB0eXBlTmFtZSA9IGdldFR5cGUobm9kZSk7XG4gICAgaWYgKHR5cGVOYW1lICE9PSB0aGlzLm5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2FuIG5vdCBjYXN0IG9iamVjdCBvZiB0eXBlICcke3R5cGVOYW1lfScgdXNpbmcgJyR7dGhpcy5uYW1lfSdgKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIXRoaXMuY2FzdHNUbyh0b1R5cGVOYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW4gbm90IGNhc3QgJyR7dHlwZU5hbWV9JyB0byAnJHt0b1R5cGVOYW1lfSdgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0VG9Gbih0b1R5cGVOYW1lKShub2RlLCB0eXBlcyk7XG4gIH07XG5cbiAgdGhpcy5mcm9tID0gKG5vZGUsIHR5cGVzKSA9PiB7XG4gICAgY29uc3QgdHlwZU5hbWUgPSBnZXRUeXBlKG5vZGUpO1xuICAgIGlmICghdGhpcy5jYXN0c0Zyb20odHlwZU5hbWUpKSB0aHJvdyBuZXcgRXJyb3IoYENhbiBub3QgY2FzdCAnJHt0aGlzLm5hbWV9JyBmcm9tICR7dHlwZU5hbWV9YCk7XG5cbiAgICByZXR1cm4gZ2V0RnJvbUZuKHR5cGVOYW1lKShub2RlLCB0eXBlcyk7XG4gIH07XG59XG4iXX0=