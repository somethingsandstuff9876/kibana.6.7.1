'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registries = undefined;

var _common = require('../common');

var _browser = require('../plugin/functions/browser');

var _types = require('../plugin/types');

var registries = exports.registries = {
  browserFunctions: new _common.FunctionsRegistry(),
  types: new _common.TypesRegistry()
}; /*
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

(0, _common.register)(registries, {
  browserFunctions: _browser.browserFunctions,
  types: _types.typeSpecs
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wdWJsaWMvcmVnaXN0cmllcy5qcyJdLCJuYW1lcyI6WyJyZWdpc3RyaWVzIiwiYnJvd3NlckZ1bmN0aW9ucyIsInR5cGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBbUJBOztBQUNBOztBQUNBOztBQUVPLElBQU1BLGtDQUFhO0FBQ3hCQyxvQkFBa0IsK0JBRE07QUFFeEJDLFNBQU87QUFGaUIsQ0FBbkIsQyxDQXZCUDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCQSxzQkFBU0YsVUFBVCxFQUFxQjtBQUNuQkMsNkNBRG1CO0FBRW5CQztBQUZtQixDQUFyQiIsImZpbGUiOiJyZWdpc3RyaWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIExpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmUgb3IgbW9yZSBjb250cmlidXRvclxuICogbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAqIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0XG4gKiBvd25lcnNoaXAuIEVsYXN0aWNzZWFyY2ggQi5WLiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyXG4gKiB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5XG4gKiBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IHJlZ2lzdGVyLCBGdW5jdGlvbnNSZWdpc3RyeSwgVHlwZXNSZWdpc3RyeSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBicm93c2VyRnVuY3Rpb25zIH0gZnJvbSAnLi4vcGx1Z2luL2Z1bmN0aW9ucy9icm93c2VyJztcbmltcG9ydCB7IHR5cGVTcGVjcyB9IGZyb20gJy4uL3BsdWdpbi90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCByZWdpc3RyaWVzID0ge1xuICBicm93c2VyRnVuY3Rpb25zOiBuZXcgRnVuY3Rpb25zUmVnaXN0cnkoKSxcbiAgdHlwZXM6IG5ldyBUeXBlc1JlZ2lzdHJ5KCksXG59O1xuXG5yZWdpc3RlcihyZWdpc3RyaWVzLCB7XG4gIGJyb3dzZXJGdW5jdGlvbnMsXG4gIHR5cGVzOiB0eXBlU3BlY3MsXG59KTtcbiJdfQ==