'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.datatable = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var datatable = exports.datatable = function datatable() {
  return {
    name: 'datatable',
    validate: function validate(datatable) {
      // TODO: Check columns types. Only string, boolean, number, date, allowed for now.
      if (!datatable.columns) {
        throw new Error('datatable must have a columns array, even if it is empty');
      }

      if (!datatable.rows) throw new Error('datatable must have a rows array, even if it is empty');
    },
    serialize: function serialize(datatable) {
      var columns = datatable.columns,
          rows = datatable.rows;

      return (0, _extends3.default)({}, datatable, {
        rows: rows.map(function (row) {
          return columns.map(function (column) {
            return row[column.name];
          });
        })
      });
    },
    deserialize: function deserialize(datatable) {
      var columns = datatable.columns,
          rows = datatable.rows;

      return (0, _extends3.default)({}, datatable, {
        rows: rows.map(function (row) {
          return (0, _lodash.zipObject)((0, _lodash.map)(columns, 'name'), row);
        })
      });
    },
    from: {
      null: function _null() {
        return {
          type: 'datatable',
          rows: [],
          columns: []
        };
      },
      pointseries: function pointseries(context) {
        return {
          type: 'datatable',
          rows: context.rows,
          columns: (0, _lodash.map)(context.columns, function (val, name) {
            return { name: name, type: val.type, role: val.role };
          })
        };
      }
    },
    to: {
      render: function render(datatable) {
        return {
          type: 'render',
          as: 'table',
          value: {
            datatable: datatable,
            paginate: true,
            perPage: 10,
            showHeader: true
          }
        };
      },
      pointseries: function pointseries(datatable) {
        // datatable columns are an array that looks like [{ name: "one", type: "string" }, { name: "two", type: "string" }]
        // rows look like [{ one: 1, two: 2}, { one: 3, two: 4}, ...]
        var validFields = ['x', 'y', 'color', 'size', 'text'];
        var columns = datatable.columns.filter(function (column) {
          return validFields.includes(column.name);
        });
        var rows = datatable.rows.map(function (row) {
          return (0, _lodash.pick)(row, validFields);
        });

        return {
          type: 'pointseries',
          columns: columns.reduce(function (acc, column) {
            /* pointseries columns are an object that looks like this
             * {
             *   x: { type: "string", expression: "x", role: "dimension" },
             *   y: { type: "string", expression: "y", role: "dimension" }
             * }
             */
            acc[column.name] = {
              type: column.type,
              expression: column.name,
              role: 'dimension'
            };

            return acc;
          }, {}),
          rows: rows
        };
      }
    }
  };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW4vdHlwZXMvZGF0YXRhYmxlLmpzIl0sIm5hbWVzIjpbImRhdGF0YWJsZSIsIm5hbWUiLCJ2YWxpZGF0ZSIsImNvbHVtbnMiLCJFcnJvciIsInJvd3MiLCJzZXJpYWxpemUiLCJtYXAiLCJyb3ciLCJjb2x1bW4iLCJkZXNlcmlhbGl6ZSIsImZyb20iLCJudWxsIiwidHlwZSIsInBvaW50c2VyaWVzIiwiY29udGV4dCIsInZhbCIsInJvbGUiLCJ0byIsInJlbmRlciIsImFzIiwidmFsdWUiLCJwYWdpbmF0ZSIsInBlclBhZ2UiLCJzaG93SGVhZGVyIiwidmFsaWRGaWVsZHMiLCJmaWx0ZXIiLCJpbmNsdWRlcyIsInJlZHVjZSIsImFjYyIsImV4cHJlc3Npb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBbUJBOzs7O0FBRU8sSUFBTUEsZ0NBQVksU0FBWkEsU0FBWTtBQUFBLFNBQU87QUFDOUJDLFVBQU0sV0FEd0I7QUFFOUJDLGNBQVUsNkJBQWE7QUFDckI7QUFDQSxVQUFJLENBQUNGLFVBQVVHLE9BQWYsRUFBd0I7QUFDdEIsY0FBTSxJQUFJQyxLQUFKLENBQVUsMERBQVYsQ0FBTjtBQUNEOztBQUVELFVBQUksQ0FBQ0osVUFBVUssSUFBZixFQUFxQixNQUFNLElBQUlELEtBQUosQ0FBVSx1REFBVixDQUFOO0FBQ3RCLEtBVDZCO0FBVTlCRSxlQUFXLDhCQUFhO0FBQUEsVUFDZEgsT0FEYyxHQUNJSCxTQURKLENBQ2RHLE9BRGM7QUFBQSxVQUNMRSxJQURLLEdBQ0lMLFNBREosQ0FDTEssSUFESzs7QUFFdEIsd0NBQ0tMLFNBREw7QUFFRUssY0FBTUEsS0FBS0UsR0FBTCxDQUFTLGVBQU87QUFDcEIsaUJBQU9KLFFBQVFJLEdBQVIsQ0FBWTtBQUFBLG1CQUFVQyxJQUFJQyxPQUFPUixJQUFYLENBQVY7QUFBQSxXQUFaLENBQVA7QUFDRCxTQUZLO0FBRlI7QUFNRCxLQWxCNkI7QUFtQjlCUyxpQkFBYSxnQ0FBYTtBQUFBLFVBQ2hCUCxPQURnQixHQUNFSCxTQURGLENBQ2hCRyxPQURnQjtBQUFBLFVBQ1BFLElBRE8sR0FDRUwsU0FERixDQUNQSyxJQURPOztBQUV4Qix3Q0FDS0wsU0FETDtBQUVFSyxjQUFNQSxLQUFLRSxHQUFMLENBQVMsZUFBTztBQUNwQixpQkFBTyx1QkFBVSxpQkFBSUosT0FBSixFQUFhLE1BQWIsQ0FBVixFQUFnQ0ssR0FBaEMsQ0FBUDtBQUNELFNBRks7QUFGUjtBQU1ELEtBM0I2QjtBQTRCOUJHLFVBQU07QUFDSkMsWUFBTSxpQkFBTTtBQUNWLGVBQU87QUFDTEMsZ0JBQU0sV0FERDtBQUVMUixnQkFBTSxFQUZEO0FBR0xGLG1CQUFTO0FBSEosU0FBUDtBQUtELE9BUEc7QUFRSlcsbUJBQWEsOEJBQVc7QUFDdEIsZUFBTztBQUNMRCxnQkFBTSxXQUREO0FBRUxSLGdCQUFNVSxRQUFRVixJQUZUO0FBR0xGLG1CQUFTLGlCQUFJWSxRQUFRWixPQUFaLEVBQXFCLFVBQUNhLEdBQUQsRUFBTWYsSUFBTixFQUFlO0FBQzNDLG1CQUFPLEVBQUVBLE1BQU1BLElBQVIsRUFBY1ksTUFBTUcsSUFBSUgsSUFBeEIsRUFBOEJJLE1BQU1ELElBQUlDLElBQXhDLEVBQVA7QUFDRCxXQUZRO0FBSEosU0FBUDtBQU9EO0FBaEJHLEtBNUJ3QjtBQThDOUJDLFFBQUk7QUFDRkMsY0FBUSwyQkFBYTtBQUNuQixlQUFPO0FBQ0xOLGdCQUFNLFFBREQ7QUFFTE8sY0FBSSxPQUZDO0FBR0xDLGlCQUFPO0FBQ0xyQixnQ0FESztBQUVMc0Isc0JBQVUsSUFGTDtBQUdMQyxxQkFBUyxFQUhKO0FBSUxDLHdCQUFZO0FBSlA7QUFIRixTQUFQO0FBVUQsT0FaQztBQWFGVixtQkFBYSxnQ0FBYTtBQUN4QjtBQUNBO0FBQ0EsWUFBTVcsY0FBYyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsT0FBWCxFQUFvQixNQUFwQixFQUE0QixNQUE1QixDQUFwQjtBQUNBLFlBQU10QixVQUFVSCxVQUFVRyxPQUFWLENBQWtCdUIsTUFBbEIsQ0FBeUI7QUFBQSxpQkFBVUQsWUFBWUUsUUFBWixDQUFxQmxCLE9BQU9SLElBQTVCLENBQVY7QUFBQSxTQUF6QixDQUFoQjtBQUNBLFlBQU1JLE9BQU9MLFVBQVVLLElBQVYsQ0FBZUUsR0FBZixDQUFtQjtBQUFBLGlCQUFPLGtCQUFLQyxHQUFMLEVBQVVpQixXQUFWLENBQVA7QUFBQSxTQUFuQixDQUFiOztBQUVBLGVBQU87QUFDTFosZ0JBQU0sYUFERDtBQUVMVixtQkFBU0EsUUFBUXlCLE1BQVIsQ0FBZSxVQUFDQyxHQUFELEVBQU1wQixNQUFOLEVBQWlCO0FBQ3ZDOzs7Ozs7QUFNQW9CLGdCQUFJcEIsT0FBT1IsSUFBWCxJQUFtQjtBQUNqQlksb0JBQU1KLE9BQU9JLElBREk7QUFFakJpQiwwQkFBWXJCLE9BQU9SLElBRkY7QUFHakJnQixvQkFBTTtBQUhXLGFBQW5COztBQU1BLG1CQUFPWSxHQUFQO0FBQ0QsV0FkUSxFQWNOLEVBZE0sQ0FGSjtBQWlCTHhCO0FBakJLLFNBQVA7QUFtQkQ7QUF2Q0M7QUE5QzBCLEdBQVA7QUFBQSxDQUFsQixDLENBckJQIiwiZmlsZSI6ImRhdGF0YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBtYXAsIHBpY2ssIHppcE9iamVjdCB9IGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBjb25zdCBkYXRhdGFibGUgPSAoKSA9PiAoe1xuICBuYW1lOiAnZGF0YXRhYmxlJyxcbiAgdmFsaWRhdGU6IGRhdGF0YWJsZSA9PiB7XG4gICAgLy8gVE9ETzogQ2hlY2sgY29sdW1ucyB0eXBlcy4gT25seSBzdHJpbmcsIGJvb2xlYW4sIG51bWJlciwgZGF0ZSwgYWxsb3dlZCBmb3Igbm93LlxuICAgIGlmICghZGF0YXRhYmxlLmNvbHVtbnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZGF0YXRhYmxlIG11c3QgaGF2ZSBhIGNvbHVtbnMgYXJyYXksIGV2ZW4gaWYgaXQgaXMgZW1wdHknKTtcbiAgICB9XG5cbiAgICBpZiAoIWRhdGF0YWJsZS5yb3dzKSB0aHJvdyBuZXcgRXJyb3IoJ2RhdGF0YWJsZSBtdXN0IGhhdmUgYSByb3dzIGFycmF5LCBldmVuIGlmIGl0IGlzIGVtcHR5Jyk7XG4gIH0sXG4gIHNlcmlhbGl6ZTogZGF0YXRhYmxlID0+IHtcbiAgICBjb25zdCB7IGNvbHVtbnMsIHJvd3MgfSA9IGRhdGF0YWJsZTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uZGF0YXRhYmxlLFxuICAgICAgcm93czogcm93cy5tYXAocm93ID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbnMubWFwKGNvbHVtbiA9PiByb3dbY29sdW1uLm5hbWVdKTtcbiAgICAgIH0pLFxuICAgIH07XG4gIH0sXG4gIGRlc2VyaWFsaXplOiBkYXRhdGFibGUgPT4ge1xuICAgIGNvbnN0IHsgY29sdW1ucywgcm93cyB9ID0gZGF0YXRhYmxlO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5kYXRhdGFibGUsXG4gICAgICByb3dzOiByb3dzLm1hcChyb3cgPT4ge1xuICAgICAgICByZXR1cm4gemlwT2JqZWN0KG1hcChjb2x1bW5zLCAnbmFtZScpLCByb3cpO1xuICAgICAgfSksXG4gICAgfTtcbiAgfSxcbiAgZnJvbToge1xuICAgIG51bGw6ICgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdkYXRhdGFibGUnLFxuICAgICAgICByb3dzOiBbXSxcbiAgICAgICAgY29sdW1uczogW10sXG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9pbnRzZXJpZXM6IGNvbnRleHQgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2RhdGF0YWJsZScsXG4gICAgICAgIHJvd3M6IGNvbnRleHQucm93cyxcbiAgICAgICAgY29sdW1uczogbWFwKGNvbnRleHQuY29sdW1ucywgKHZhbCwgbmFtZSkgPT4ge1xuICAgICAgICAgIHJldHVybiB7IG5hbWU6IG5hbWUsIHR5cGU6IHZhbC50eXBlLCByb2xlOiB2YWwucm9sZSB9O1xuICAgICAgICB9KSxcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbiAgdG86IHtcbiAgICByZW5kZXI6IGRhdGF0YWJsZSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAncmVuZGVyJyxcbiAgICAgICAgYXM6ICd0YWJsZScsXG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgZGF0YXRhYmxlLFxuICAgICAgICAgIHBhZ2luYXRlOiB0cnVlLFxuICAgICAgICAgIHBlclBhZ2U6IDEwLFxuICAgICAgICAgIHNob3dIZWFkZXI6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9pbnRzZXJpZXM6IGRhdGF0YWJsZSA9PiB7XG4gICAgICAvLyBkYXRhdGFibGUgY29sdW1ucyBhcmUgYW4gYXJyYXkgdGhhdCBsb29rcyBsaWtlIFt7IG5hbWU6IFwib25lXCIsIHR5cGU6IFwic3RyaW5nXCIgfSwgeyBuYW1lOiBcInR3b1wiLCB0eXBlOiBcInN0cmluZ1wiIH1dXG4gICAgICAvLyByb3dzIGxvb2sgbGlrZSBbeyBvbmU6IDEsIHR3bzogMn0sIHsgb25lOiAzLCB0d286IDR9LCAuLi5dXG4gICAgICBjb25zdCB2YWxpZEZpZWxkcyA9IFsneCcsICd5JywgJ2NvbG9yJywgJ3NpemUnLCAndGV4dCddO1xuICAgICAgY29uc3QgY29sdW1ucyA9IGRhdGF0YWJsZS5jb2x1bW5zLmZpbHRlcihjb2x1bW4gPT4gdmFsaWRGaWVsZHMuaW5jbHVkZXMoY29sdW1uLm5hbWUpKTtcbiAgICAgIGNvbnN0IHJvd3MgPSBkYXRhdGFibGUucm93cy5tYXAocm93ID0+IHBpY2socm93LCB2YWxpZEZpZWxkcykpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAncG9pbnRzZXJpZXMnLFxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLnJlZHVjZSgoYWNjLCBjb2x1bW4pID0+IHtcbiAgICAgICAgICAvKiBwb2ludHNlcmllcyBjb2x1bW5zIGFyZSBhbiBvYmplY3QgdGhhdCBsb29rcyBsaWtlIHRoaXNcbiAgICAgICAgICAgKiB7XG4gICAgICAgICAgICogICB4OiB7IHR5cGU6IFwic3RyaW5nXCIsIGV4cHJlc3Npb246IFwieFwiLCByb2xlOiBcImRpbWVuc2lvblwiIH0sXG4gICAgICAgICAgICogICB5OiB7IHR5cGU6IFwic3RyaW5nXCIsIGV4cHJlc3Npb246IFwieVwiLCByb2xlOiBcImRpbWVuc2lvblwiIH1cbiAgICAgICAgICAgKiB9XG4gICAgICAgICAgICovXG4gICAgICAgICAgYWNjW2NvbHVtbi5uYW1lXSA9IHtcbiAgICAgICAgICAgIHR5cGU6IGNvbHVtbi50eXBlLFxuICAgICAgICAgICAgZXhwcmVzc2lvbjogY29sdW1uLm5hbWUsXG4gICAgICAgICAgICByb2xlOiAnZGltZW5zaW9uJyxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pLFxuICAgICAgICByb3dzLFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxufSk7XG4iXX0=