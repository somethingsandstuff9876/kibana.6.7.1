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

var pointseries = exports.pointseries = function pointseries() {
  return {
    name: 'pointseries',
    from: {
      null: function _null() {
        return {
          type: 'pointseries',
          rows: [],
          columns: {}
        };
      }
    },
    to: {
      render: function render(pointseries, types) {
        var datatable = types.datatable.from(pointseries, types);
        return {
          type: 'render',
          as: 'table',
          value: {
            datatable: datatable,
            showHeader: true
          }
        };
      }
    }
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW4vdHlwZXMvcG9pbnRzZXJpZXMuanMiXSwibmFtZXMiOlsicG9pbnRzZXJpZXMiLCJuYW1lIiwiZnJvbSIsIm51bGwiLCJ0eXBlIiwicm93cyIsImNvbHVtbnMiLCJ0byIsInJlbmRlciIsInR5cGVzIiwiZGF0YXRhYmxlIiwiYXMiLCJ2YWx1ZSIsInNob3dIZWFkZXIiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQk8sSUFBTUEsb0NBQWMsU0FBZEEsV0FBYztBQUFBLFNBQU87QUFDaENDLFVBQU0sYUFEMEI7QUFFaENDLFVBQU07QUFDSkMsWUFBTSxpQkFBTTtBQUNWLGVBQU87QUFDTEMsZ0JBQU0sYUFERDtBQUVMQyxnQkFBTSxFQUZEO0FBR0xDLG1CQUFTO0FBSEosU0FBUDtBQUtEO0FBUEcsS0FGMEI7QUFXaENDLFFBQUk7QUFDRkMsY0FBUSxnQkFBQ1IsV0FBRCxFQUFjUyxLQUFkLEVBQXdCO0FBQzlCLFlBQU1DLFlBQVlELE1BQU1DLFNBQU4sQ0FBZ0JSLElBQWhCLENBQXFCRixXQUFyQixFQUFrQ1MsS0FBbEMsQ0FBbEI7QUFDQSxlQUFPO0FBQ0xMLGdCQUFNLFFBREQ7QUFFTE8sY0FBSSxPQUZDO0FBR0xDLGlCQUFPO0FBQ0xGLGdDQURLO0FBRUxHLHdCQUFZO0FBRlA7QUFIRixTQUFQO0FBUUQ7QUFYQztBQVg0QixHQUFQO0FBQUEsQ0FBcEIiLCJmaWxlIjoicG9pbnRzZXJpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0IGNvbnN0IHBvaW50c2VyaWVzID0gKCkgPT4gKHtcbiAgbmFtZTogJ3BvaW50c2VyaWVzJyxcbiAgZnJvbToge1xuICAgIG51bGw6ICgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdwb2ludHNlcmllcycsXG4gICAgICAgIHJvd3M6IFtdLFxuICAgICAgICBjb2x1bW5zOiB7fSxcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbiAgdG86IHtcbiAgICByZW5kZXI6IChwb2ludHNlcmllcywgdHlwZXMpID0+IHtcbiAgICAgIGNvbnN0IGRhdGF0YWJsZSA9IHR5cGVzLmRhdGF0YWJsZS5mcm9tKHBvaW50c2VyaWVzLCB0eXBlcyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAncmVuZGVyJyxcbiAgICAgICAgYXM6ICd0YWJsZScsXG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgZGF0YXRhYmxlLFxuICAgICAgICAgIHNob3dIZWFkZXI6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG59KTtcbiJdfQ==