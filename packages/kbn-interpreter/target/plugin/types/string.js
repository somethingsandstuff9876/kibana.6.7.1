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

var string = exports.string = function string() {
  return {
    name: 'string',
    from: {
      null: function _null() {
        return '';
      },
      boolean: function boolean(b) {
        return String(b);
      },
      number: function number(n) {
        return String(n);
      }
    },
    to: {
      render: function render(text) {
        return {
          type: 'render',
          as: 'text',
          value: { text: text }
        };
      },
      datatable: function datatable(value) {
        return {
          type: 'datatable',
          columns: [{ name: 'value', type: 'string' }],
          rows: [{ value: value }]
        };
      }
    }
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW4vdHlwZXMvc3RyaW5nLmpzIl0sIm5hbWVzIjpbInN0cmluZyIsIm5hbWUiLCJmcm9tIiwibnVsbCIsImJvb2xlYW4iLCJTdHJpbmciLCJiIiwibnVtYmVyIiwibiIsInRvIiwicmVuZGVyIiwidHlwZSIsImFzIiwidmFsdWUiLCJ0ZXh0IiwiZGF0YXRhYmxlIiwiY29sdW1ucyIsInJvd3MiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQk8sSUFBTUEsMEJBQVMsU0FBVEEsTUFBUztBQUFBLFNBQU87QUFDM0JDLFVBQU0sUUFEcUI7QUFFM0JDLFVBQU07QUFDSkMsWUFBTTtBQUFBLGVBQU0sRUFBTjtBQUFBLE9BREY7QUFFSkMsZUFBUztBQUFBLGVBQUtDLE9BQU9DLENBQVAsQ0FBTDtBQUFBLE9BRkw7QUFHSkMsY0FBUTtBQUFBLGVBQUtGLE9BQU9HLENBQVAsQ0FBTDtBQUFBO0FBSEosS0FGcUI7QUFPM0JDLFFBQUk7QUFDRkMsY0FBUSxzQkFBUTtBQUNkLGVBQU87QUFDTEMsZ0JBQU0sUUFERDtBQUVMQyxjQUFJLE1BRkM7QUFHTEMsaUJBQU8sRUFBRUMsVUFBRjtBQUhGLFNBQVA7QUFLRCxPQVBDO0FBUUZDLGlCQUFXO0FBQUEsZUFBVTtBQUNuQkosZ0JBQU0sV0FEYTtBQUVuQkssbUJBQVMsQ0FBQyxFQUFFZixNQUFNLE9BQVIsRUFBaUJVLE1BQU0sUUFBdkIsRUFBRCxDQUZVO0FBR25CTSxnQkFBTSxDQUFDLEVBQUVKLFlBQUYsRUFBRDtBQUhhLFNBQVY7QUFBQTtBQVJUO0FBUHVCLEdBQVA7QUFBQSxDQUFmIiwiZmlsZSI6InN0cmluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY29uc3Qgc3RyaW5nID0gKCkgPT4gKHtcbiAgbmFtZTogJ3N0cmluZycsXG4gIGZyb206IHtcbiAgICBudWxsOiAoKSA9PiAnJyxcbiAgICBib29sZWFuOiBiID0+IFN0cmluZyhiKSxcbiAgICBudW1iZXI6IG4gPT4gU3RyaW5nKG4pLFxuICB9LFxuICB0bzoge1xuICAgIHJlbmRlcjogdGV4dCA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAncmVuZGVyJyxcbiAgICAgICAgYXM6ICd0ZXh0JyxcbiAgICAgICAgdmFsdWU6IHsgdGV4dCB9LFxuICAgICAgfTtcbiAgICB9LFxuICAgIGRhdGF0YWJsZTogdmFsdWUgPT4gKHtcbiAgICAgIHR5cGU6ICdkYXRhdGFibGUnLFxuICAgICAgY29sdW1uczogW3sgbmFtZTogJ3ZhbHVlJywgdHlwZTogJ3N0cmluZycgfV0sXG4gICAgICByb3dzOiBbeyB2YWx1ZSB9XSxcbiAgICB9KSxcbiAgfSxcbn0pO1xuIl19