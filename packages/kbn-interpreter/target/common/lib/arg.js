'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Arg = Arg;

var _lodash = require('lodash');

function Arg(config) {
  var _this = this;

  if (config.name === '_') throw Error('Arg names must not be _. Use it in aliases instead.');
  this.name = config.name;
  this.required = config.required || false;
  this.help = config.help || '';
  this.types = config.types || [];
  this.default = config.default;
  this.aliases = config.aliases || [];
  this.multi = config.multi == null ? false : config.multi;
  this.resolve = config.resolve == null ? true : config.resolve;
  this.options = config.options || [];
  this.accepts = function (type) {
    if (!_this.types.length) return true;
    return (0, _lodash.includes)(config.types, type);
  };
} /*
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vbGliL2FyZy5qcyJdLCJuYW1lcyI6WyJBcmciLCJjb25maWciLCJuYW1lIiwiRXJyb3IiLCJyZXF1aXJlZCIsImhlbHAiLCJ0eXBlcyIsImRlZmF1bHQiLCJhbGlhc2VzIiwibXVsdGkiLCJyZXNvbHZlIiwib3B0aW9ucyIsImFjY2VwdHMiLCJsZW5ndGgiLCJ0eXBlIl0sIm1hcHBpbmdzIjoiOzs7OztRQXFCZ0JBLEcsR0FBQUEsRzs7QUFGaEI7O0FBRU8sU0FBU0EsR0FBVCxDQUFhQyxNQUFiLEVBQXFCO0FBQUE7O0FBQzFCLE1BQUlBLE9BQU9DLElBQVAsS0FBZ0IsR0FBcEIsRUFBeUIsTUFBTUMsTUFBTSxxREFBTixDQUFOO0FBQ3pCLE9BQUtELElBQUwsR0FBWUQsT0FBT0MsSUFBbkI7QUFDQSxPQUFLRSxRQUFMLEdBQWdCSCxPQUFPRyxRQUFQLElBQW1CLEtBQW5DO0FBQ0EsT0FBS0MsSUFBTCxHQUFZSixPQUFPSSxJQUFQLElBQWUsRUFBM0I7QUFDQSxPQUFLQyxLQUFMLEdBQWFMLE9BQU9LLEtBQVAsSUFBZ0IsRUFBN0I7QUFDQSxPQUFLQyxPQUFMLEdBQWVOLE9BQU9NLE9BQXRCO0FBQ0EsT0FBS0MsT0FBTCxHQUFlUCxPQUFPTyxPQUFQLElBQWtCLEVBQWpDO0FBQ0EsT0FBS0MsS0FBTCxHQUFhUixPQUFPUSxLQUFQLElBQWdCLElBQWhCLEdBQXVCLEtBQXZCLEdBQStCUixPQUFPUSxLQUFuRDtBQUNBLE9BQUtDLE9BQUwsR0FBZVQsT0FBT1MsT0FBUCxJQUFrQixJQUFsQixHQUF5QixJQUF6QixHQUFnQ1QsT0FBT1MsT0FBdEQ7QUFDQSxPQUFLQyxPQUFMLEdBQWVWLE9BQU9VLE9BQVAsSUFBa0IsRUFBakM7QUFDQSxPQUFLQyxPQUFMLEdBQWUsZ0JBQVE7QUFDckIsUUFBSSxDQUFDLE1BQUtOLEtBQUwsQ0FBV08sTUFBaEIsRUFBd0IsT0FBTyxJQUFQO0FBQ3hCLFdBQU8sc0JBQVNaLE9BQU9LLEtBQWhCLEVBQXVCUSxJQUF2QixDQUFQO0FBQ0QsR0FIRDtBQUlELEMsQ0FwQ0QiLCJmaWxlIjoiYXJnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIExpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmUgb3IgbW9yZSBjb250cmlidXRvclxuICogbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAqIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0XG4gKiBvd25lcnNoaXAuIEVsYXN0aWNzZWFyY2ggQi5WLiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyXG4gKiB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5XG4gKiBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IGluY2x1ZGVzIH0gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFyZyhjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5uYW1lID09PSAnXycpIHRocm93IEVycm9yKCdBcmcgbmFtZXMgbXVzdCBub3QgYmUgXy4gVXNlIGl0IGluIGFsaWFzZXMgaW5zdGVhZC4nKTtcbiAgdGhpcy5uYW1lID0gY29uZmlnLm5hbWU7XG4gIHRoaXMucmVxdWlyZWQgPSBjb25maWcucmVxdWlyZWQgfHwgZmFsc2U7XG4gIHRoaXMuaGVscCA9IGNvbmZpZy5oZWxwIHx8ICcnO1xuICB0aGlzLnR5cGVzID0gY29uZmlnLnR5cGVzIHx8IFtdO1xuICB0aGlzLmRlZmF1bHQgPSBjb25maWcuZGVmYXVsdDtcbiAgdGhpcy5hbGlhc2VzID0gY29uZmlnLmFsaWFzZXMgfHwgW107XG4gIHRoaXMubXVsdGkgPSBjb25maWcubXVsdGkgPT0gbnVsbCA/IGZhbHNlIDogY29uZmlnLm11bHRpO1xuICB0aGlzLnJlc29sdmUgPSBjb25maWcucmVzb2x2ZSA9PSBudWxsID8gdHJ1ZSA6IGNvbmZpZy5yZXNvbHZlO1xuICB0aGlzLm9wdGlvbnMgPSBjb25maWcub3B0aW9ucyB8fCBbXTtcbiAgdGhpcy5hY2NlcHRzID0gdHlwZSA9PiB7XG4gICAgaWYgKCF0aGlzLnR5cGVzLmxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGluY2x1ZGVzKGNvbmZpZy50eXBlcywgdHlwZSk7XG4gIH07XG59XG4iXX0=