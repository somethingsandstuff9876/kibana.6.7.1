'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

var number = exports.number = function number() {
  return {
    name: 'number',
    from: {
      null: function _null() {
        return 0;
      },
      boolean: function boolean(b) {
        return Number(b);
      },
      string: function string(n) {
        return Number(n);
      }
    },
    to: {
      render: function render(value) {
        var text = '' + value;
        return {
          type: 'render',
          as: 'text',
          value: { text: text }
        };
      },
      datatable: function datatable(value) {
        return {
          type: 'datatable',
          columns: [{ name: 'value', type: 'number' }],
          rows: [{ value: value }]
        };
      }
    }
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW4vdHlwZXMvbnVtYmVyLmpzIl0sIm5hbWVzIjpbIm51bWJlciIsIm5hbWUiLCJmcm9tIiwibnVsbCIsImJvb2xlYW4iLCJOdW1iZXIiLCJiIiwic3RyaW5nIiwibiIsInRvIiwicmVuZGVyIiwidGV4dCIsInZhbHVlIiwidHlwZSIsImFzIiwiZGF0YXRhYmxlIiwiY29sdW1ucyIsInJvd3MiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQk8sSUFBTUEsMEJBQVMsU0FBVEEsTUFBUztBQUFBLFNBQU87QUFDM0JDLFVBQU0sUUFEcUI7QUFFM0JDLFVBQU07QUFDSkMsWUFBTTtBQUFBLGVBQU0sQ0FBTjtBQUFBLE9BREY7QUFFSkMsZUFBUztBQUFBLGVBQUtDLE9BQU9DLENBQVAsQ0FBTDtBQUFBLE9BRkw7QUFHSkMsY0FBUTtBQUFBLGVBQUtGLE9BQU9HLENBQVAsQ0FBTDtBQUFBO0FBSEosS0FGcUI7QUFPM0JDLFFBQUk7QUFDRkMsY0FBUSx1QkFBUztBQUNmLFlBQU1DLFlBQVVDLEtBQWhCO0FBQ0EsZUFBTztBQUNMQyxnQkFBTSxRQUREO0FBRUxDLGNBQUksTUFGQztBQUdMRixpQkFBTyxFQUFFRCxVQUFGO0FBSEYsU0FBUDtBQUtELE9BUkM7QUFTRkksaUJBQVc7QUFBQSxlQUFVO0FBQ25CRixnQkFBTSxXQURhO0FBRW5CRyxtQkFBUyxDQUFDLEVBQUVmLE1BQU0sT0FBUixFQUFpQlksTUFBTSxRQUF2QixFQUFELENBRlU7QUFHbkJJLGdCQUFNLENBQUMsRUFBRUwsWUFBRixFQUFEO0FBSGEsU0FBVjtBQUFBO0FBVFQ7QUFQdUIsR0FBUDtBQUFBLENBQWYiLCJmaWxlIjoibnVtYmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIExpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmUgb3IgbW9yZSBjb250cmlidXRvclxuICogbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAqIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0XG4gKiBvd25lcnNoaXAuIEVsYXN0aWNzZWFyY2ggQi5WLiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyXG4gKiB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5XG4gKiBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCBjb25zdCBudW1iZXIgPSAoKSA9PiAoe1xuICBuYW1lOiAnbnVtYmVyJyxcbiAgZnJvbToge1xuICAgIG51bGw6ICgpID0+IDAsXG4gICAgYm9vbGVhbjogYiA9PiBOdW1iZXIoYiksXG4gICAgc3RyaW5nOiBuID0+IE51bWJlcihuKSxcbiAgfSxcbiAgdG86IHtcbiAgICByZW5kZXI6IHZhbHVlID0+IHtcbiAgICAgIGNvbnN0IHRleHQgPSBgJHt2YWx1ZX1gO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ3JlbmRlcicsXG4gICAgICAgIGFzOiAndGV4dCcsXG4gICAgICAgIHZhbHVlOiB7IHRleHQgfSxcbiAgICAgIH07XG4gICAgfSxcbiAgICBkYXRhdGFibGU6IHZhbHVlID0+ICh7XG4gICAgICB0eXBlOiAnZGF0YXRhYmxlJyxcbiAgICAgIGNvbHVtbnM6IFt7IG5hbWU6ICd2YWx1ZScsIHR5cGU6ICdudW1iZXInIH1dLFxuICAgICAgcm93czogW3sgdmFsdWUgfV0sXG4gICAgfSksXG4gIH0sXG59KTtcbiJdfQ==