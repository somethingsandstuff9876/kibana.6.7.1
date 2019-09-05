'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeProvider = serializeProvider;

var _lodash = require('lodash');

var _get_type = require('./get_type');

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

function serializeProvider(types) {
  return {
    serialize: provider('serialize'),
    deserialize: provider('deserialize')
  };

  function provider(key) {
    return function (context) {
      var type = (0, _get_type.getType)(context);
      var typeDef = types[type];
      var fn = (0, _lodash.get)(typeDef, key) || _lodash.identity;
      return fn(context);
    };
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vbGliL3NlcmlhbGl6ZS5qcyJdLCJuYW1lcyI6WyJzZXJpYWxpemVQcm92aWRlciIsInR5cGVzIiwic2VyaWFsaXplIiwicHJvdmlkZXIiLCJkZXNlcmlhbGl6ZSIsImtleSIsInR5cGUiLCJjb250ZXh0IiwidHlwZURlZiIsImZuIl0sIm1hcHBpbmdzIjoiOzs7OztRQXNCZ0JBLGlCLEdBQUFBLGlCOztBQUhoQjs7QUFDQTs7QUFwQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQk8sU0FBU0EsaUJBQVQsQ0FBMkJDLEtBQTNCLEVBQWtDO0FBQ3ZDLFNBQU87QUFDTEMsZUFBV0MsU0FBUyxXQUFULENBRE47QUFFTEMsaUJBQWFELFNBQVMsYUFBVDtBQUZSLEdBQVA7O0FBS0EsV0FBU0EsUUFBVCxDQUFrQkUsR0FBbEIsRUFBdUI7QUFDckIsV0FBTyxtQkFBVztBQUNoQixVQUFNQyxPQUFPLHVCQUFRQyxPQUFSLENBQWI7QUFDQSxVQUFNQyxVQUFVUCxNQUFNSyxJQUFOLENBQWhCO0FBQ0EsVUFBTUcsS0FBSyxpQkFBSUQsT0FBSixFQUFhSCxHQUFiLHFCQUFYO0FBQ0EsYUFBT0ksR0FBR0YsT0FBSCxDQUFQO0FBQ0QsS0FMRDtBQU1EO0FBQ0YiLCJmaWxlIjoic2VyaWFsaXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIExpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmUgb3IgbW9yZSBjb250cmlidXRvclxuICogbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAqIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0XG4gKiBvd25lcnNoaXAuIEVsYXN0aWNzZWFyY2ggQi5WLiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyXG4gKiB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5XG4gKiBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IGdldCwgaWRlbnRpdHkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgZ2V0VHlwZSB9IGZyb20gJy4vZ2V0X3R5cGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplUHJvdmlkZXIodHlwZXMpIHtcbiAgcmV0dXJuIHtcbiAgICBzZXJpYWxpemU6IHByb3ZpZGVyKCdzZXJpYWxpemUnKSxcbiAgICBkZXNlcmlhbGl6ZTogcHJvdmlkZXIoJ2Rlc2VyaWFsaXplJyksXG4gIH07XG5cbiAgZnVuY3Rpb24gcHJvdmlkZXIoa2V5KSB7XG4gICAgcmV0dXJuIGNvbnRleHQgPT4ge1xuICAgICAgY29uc3QgdHlwZSA9IGdldFR5cGUoY29udGV4dCk7XG4gICAgICBjb25zdCB0eXBlRGVmID0gdHlwZXNbdHlwZV07XG4gICAgICBjb25zdCBmbiA9IGdldCh0eXBlRGVmLCBrZXkpIHx8IGlkZW50aXR5O1xuICAgICAgcmV0dXJuIGZuKGNvbnRleHQpO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==