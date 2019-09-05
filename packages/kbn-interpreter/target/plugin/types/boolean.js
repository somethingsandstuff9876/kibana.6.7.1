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

var boolean = exports.boolean = function boolean() {
  return {
    name: 'boolean',
    from: {
      null: function _null() {
        return false;
      },
      number: function number(n) {
        return Boolean(n);
      },
      string: function string(s) {
        return Boolean(s);
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
          columns: [{ name: 'value', type: 'boolean' }],
          rows: [{ value: value }]
        };
      }
    }
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW4vdHlwZXMvYm9vbGVhbi5qcyJdLCJuYW1lcyI6WyJib29sZWFuIiwibmFtZSIsImZyb20iLCJudWxsIiwibnVtYmVyIiwiQm9vbGVhbiIsIm4iLCJzdHJpbmciLCJzIiwidG8iLCJyZW5kZXIiLCJ0ZXh0IiwidmFsdWUiLCJ0eXBlIiwiYXMiLCJkYXRhdGFibGUiLCJjb2x1bW5zIiwicm93cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CTyxJQUFNQSw0QkFBVSxTQUFWQSxPQUFVO0FBQUEsU0FBTztBQUM1QkMsVUFBTSxTQURzQjtBQUU1QkMsVUFBTTtBQUNKQyxZQUFNO0FBQUEsZUFBTSxLQUFOO0FBQUEsT0FERjtBQUVKQyxjQUFRO0FBQUEsZUFBS0MsUUFBUUMsQ0FBUixDQUFMO0FBQUEsT0FGSjtBQUdKQyxjQUFRO0FBQUEsZUFBS0YsUUFBUUcsQ0FBUixDQUFMO0FBQUE7QUFISixLQUZzQjtBQU81QkMsUUFBSTtBQUNGQyxjQUFRLHVCQUFTO0FBQ2YsWUFBTUMsWUFBVUMsS0FBaEI7QUFDQSxlQUFPO0FBQ0xDLGdCQUFNLFFBREQ7QUFFTEMsY0FBSSxNQUZDO0FBR0xGLGlCQUFPLEVBQUVELFVBQUY7QUFIRixTQUFQO0FBS0QsT0FSQztBQVNGSSxpQkFBVztBQUFBLGVBQVU7QUFDbkJGLGdCQUFNLFdBRGE7QUFFbkJHLG1CQUFTLENBQUMsRUFBRWYsTUFBTSxPQUFSLEVBQWlCWSxNQUFNLFNBQXZCLEVBQUQsQ0FGVTtBQUduQkksZ0JBQU0sQ0FBQyxFQUFFTCxZQUFGLEVBQUQ7QUFIYSxTQUFWO0FBQUE7QUFUVDtBQVB3QixHQUFQO0FBQUEsQ0FBaEIiLCJmaWxlIjoiYm9vbGVhbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY29uc3QgYm9vbGVhbiA9ICgpID0+ICh7XG4gIG5hbWU6ICdib29sZWFuJyxcbiAgZnJvbToge1xuICAgIG51bGw6ICgpID0+IGZhbHNlLFxuICAgIG51bWJlcjogbiA9PiBCb29sZWFuKG4pLFxuICAgIHN0cmluZzogcyA9PiBCb29sZWFuKHMpLFxuICB9LFxuICB0bzoge1xuICAgIHJlbmRlcjogdmFsdWUgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9IGAke3ZhbHVlfWA7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAncmVuZGVyJyxcbiAgICAgICAgYXM6ICd0ZXh0JyxcbiAgICAgICAgdmFsdWU6IHsgdGV4dCB9LFxuICAgICAgfTtcbiAgICB9LFxuICAgIGRhdGF0YWJsZTogdmFsdWUgPT4gKHtcbiAgICAgIHR5cGU6ICdkYXRhdGFibGUnLFxuICAgICAgY29sdW1uczogW3sgbmFtZTogJ3ZhbHVlJywgdHlwZTogJ2Jvb2xlYW4nIH1dLFxuICAgICAgcm93czogW3sgdmFsdWUgfV0sXG4gICAgfSksXG4gIH0sXG59KTtcbiJdfQ==