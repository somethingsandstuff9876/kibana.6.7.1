'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeInterpreter = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var initializeInterpreter = exports.initializeInterpreter = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(kfetch, typesRegistry, functionsRegistry) {
    var _this = this;

    var serverFunctionList, types, _serializeProvider, serialize, batch, interpretAst;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return kfetch({ pathname: _consts.FUNCTIONS_URL });

          case 2:
            serverFunctionList = _context2.sent;
            types = typesRegistry.toJS();
            _serializeProvider = (0, _serialize.serializeProvider)(types), serialize = _serializeProvider.serialize;
            batch = (0, _batched_fetch.batchedFetch)({ kfetch: kfetch, serialize: serialize });

            // For every sever-side function, register a client-side
            // function that matches its definition, but which simply
            // calls the server-side function endpoint.

            Object.keys(serverFunctionList).forEach(function (functionName) {
              functionsRegistry.register(function () {
                return (0, _extends3.default)({}, serverFunctionList[functionName], {
                  fn: function fn(context, args) {
                    return batch({ functionName: functionName, args: args, context: context });
                  }
                });
              });
            });

            interpretAst = function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ast, context, handlers) {
                var interpretFn;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _interpret.interpreterProvider)({
                          types: typesRegistry.toJS(),
                          handlers: (0, _extends3.default)({}, handlers, (0, _create_handlers.createHandlers)()),
                          functions: functionsRegistry.toJS()
                        });

                      case 2:
                        interpretFn = _context.sent;
                        return _context.abrupt('return', interpretFn(ast, context));

                      case 4:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function interpretAst(_x4, _x5, _x6) {
                return _ref2.apply(this, arguments);
              };
            }();

            return _context2.abrupt('return', { interpretAst: interpretAst });

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function initializeInterpreter(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}(); /*
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

var _interpret = require('../common/interpreter/interpret');

var _serialize = require('../common/lib/serialize');

var _create_handlers = require('./create_handlers');

var _batched_fetch = require('./batched_fetch');

var _consts = require('./consts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wdWJsaWMvaW50ZXJwcmV0ZXIuanMiXSwibmFtZXMiOlsia2ZldGNoIiwidHlwZXNSZWdpc3RyeSIsImZ1bmN0aW9uc1JlZ2lzdHJ5IiwicGF0aG5hbWUiLCJzZXJ2ZXJGdW5jdGlvbkxpc3QiLCJ0eXBlcyIsInRvSlMiLCJzZXJpYWxpemUiLCJiYXRjaCIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwicmVnaXN0ZXIiLCJmdW5jdGlvbk5hbWUiLCJmbiIsImNvbnRleHQiLCJhcmdzIiwiaW50ZXJwcmV0QXN0IiwiYXN0IiwiaGFuZGxlcnMiLCJmdW5jdGlvbnMiLCJpbnRlcnByZXRGbiIsImluaXRpYWxpemVJbnRlcnByZXRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0ZBeUJPLGtCQUFxQ0EsTUFBckMsRUFBNkNDLGFBQTdDLEVBQTREQyxpQkFBNUQ7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQzRCRixPQUFPLEVBQUVHLCtCQUFGLEVBQVAsQ0FENUI7O0FBQUE7QUFDQ0MsOEJBREQ7QUFFQ0MsaUJBRkQsR0FFU0osY0FBY0ssSUFBZCxFQUZUO0FBQUEsaUNBR2lCLGtDQUFrQkQsS0FBbEIsQ0FIakIsRUFHR0UsU0FISCxzQkFHR0EsU0FISDtBQUlDQyxpQkFKRCxHQUlTLGlDQUFhLEVBQUVSLGNBQUYsRUFBVU8sb0JBQVYsRUFBYixDQUpUOztBQU1MO0FBQ0E7QUFDQTs7QUFDQUUsbUJBQU9DLElBQVAsQ0FBWU4sa0JBQVosRUFBZ0NPLE9BQWhDLENBQXdDLHdCQUFnQjtBQUN0RFQsZ0NBQWtCVSxRQUFsQixDQUEyQjtBQUFBLGtEQUN0QlIsbUJBQW1CUyxZQUFuQixDQURzQjtBQUV6QkMsc0JBQUksWUFBQ0MsT0FBRCxFQUFVQyxJQUFWO0FBQUEsMkJBQW1CUixNQUFNLEVBQUVLLDBCQUFGLEVBQWdCRyxVQUFoQixFQUFzQkQsZ0JBQXRCLEVBQU4sQ0FBbkI7QUFBQTtBQUZxQjtBQUFBLGVBQTNCO0FBSUQsYUFMRDs7QUFPTUUsd0JBaEJEO0FBQUEsbUdBZ0JnQixpQkFBT0MsR0FBUCxFQUFZSCxPQUFaLEVBQXFCSSxRQUFyQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLCtCQUNPLG9DQUFvQjtBQUM1Q2QsaUNBQU9KLGNBQWNLLElBQWQsRUFEcUM7QUFFNUNhLCtEQUFlQSxRQUFmLEVBQTRCLHNDQUE1QixDQUY0QztBQUc1Q0MscUNBQVdsQixrQkFBa0JJLElBQWxCO0FBSGlDLHlCQUFwQixDQURQOztBQUFBO0FBQ2JlLG1DQURhO0FBQUEseURBTVpBLFlBQVlILEdBQVosRUFBaUJILE9BQWpCLENBTlk7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFoQmhCOztBQUFBLDhCQWdCQ0UsWUFoQkQ7QUFBQTtBQUFBO0FBQUE7O0FBQUEsOENBeUJFLEVBQUVBLDBCQUFGLEVBekJGOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7O2tCQUFlSyxxQjs7O0tBekJ0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQSIsImZpbGUiOiJpbnRlcnByZXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBpbnRlcnByZXRlclByb3ZpZGVyIH0gZnJvbSAnLi4vY29tbW9uL2ludGVycHJldGVyL2ludGVycHJldCc7XG5pbXBvcnQgeyBzZXJpYWxpemVQcm92aWRlciB9IGZyb20gJy4uL2NvbW1vbi9saWIvc2VyaWFsaXplJztcbmltcG9ydCB7IGNyZWF0ZUhhbmRsZXJzIH0gZnJvbSAnLi9jcmVhdGVfaGFuZGxlcnMnO1xuaW1wb3J0IHsgYmF0Y2hlZEZldGNoIH0gZnJvbSAnLi9iYXRjaGVkX2ZldGNoJztcbmltcG9ydCB7IEZVTkNUSU9OU19VUkwgfSBmcm9tICcuL2NvbnN0cyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplSW50ZXJwcmV0ZXIoa2ZldGNoLCB0eXBlc1JlZ2lzdHJ5LCBmdW5jdGlvbnNSZWdpc3RyeSkge1xuICBjb25zdCBzZXJ2ZXJGdW5jdGlvbkxpc3QgPSBhd2FpdCBrZmV0Y2goeyBwYXRobmFtZTogRlVOQ1RJT05TX1VSTCB9KTtcbiAgY29uc3QgdHlwZXMgPSB0eXBlc1JlZ2lzdHJ5LnRvSlMoKTtcbiAgY29uc3QgeyBzZXJpYWxpemUgfSA9IHNlcmlhbGl6ZVByb3ZpZGVyKHR5cGVzKTtcbiAgY29uc3QgYmF0Y2ggPSBiYXRjaGVkRmV0Y2goeyBrZmV0Y2gsIHNlcmlhbGl6ZSB9KTtcblxuICAvLyBGb3IgZXZlcnkgc2V2ZXItc2lkZSBmdW5jdGlvbiwgcmVnaXN0ZXIgYSBjbGllbnQtc2lkZVxuICAvLyBmdW5jdGlvbiB0aGF0IG1hdGNoZXMgaXRzIGRlZmluaXRpb24sIGJ1dCB3aGljaCBzaW1wbHlcbiAgLy8gY2FsbHMgdGhlIHNlcnZlci1zaWRlIGZ1bmN0aW9uIGVuZHBvaW50LlxuICBPYmplY3Qua2V5cyhzZXJ2ZXJGdW5jdGlvbkxpc3QpLmZvckVhY2goZnVuY3Rpb25OYW1lID0+IHtcbiAgICBmdW5jdGlvbnNSZWdpc3RyeS5yZWdpc3RlcigoKSA9PiAoe1xuICAgICAgLi4uc2VydmVyRnVuY3Rpb25MaXN0W2Z1bmN0aW9uTmFtZV0sXG4gICAgICBmbjogKGNvbnRleHQsIGFyZ3MpID0+IGJhdGNoKHsgZnVuY3Rpb25OYW1lLCBhcmdzLCBjb250ZXh0IH0pLFxuICAgIH0pKTtcbiAgfSk7XG5cbiAgY29uc3QgaW50ZXJwcmV0QXN0ID0gYXN5bmMgKGFzdCwgY29udGV4dCwgaGFuZGxlcnMpID0+IHtcbiAgICBjb25zdCBpbnRlcnByZXRGbiA9IGF3YWl0IGludGVycHJldGVyUHJvdmlkZXIoe1xuICAgICAgdHlwZXM6IHR5cGVzUmVnaXN0cnkudG9KUygpLFxuICAgICAgaGFuZGxlcnM6IHsgLi4uaGFuZGxlcnMsIC4uLmNyZWF0ZUhhbmRsZXJzKCkgfSxcbiAgICAgIGZ1bmN0aW9uczogZnVuY3Rpb25zUmVnaXN0cnkudG9KUygpLFxuICAgIH0pO1xuICAgIHJldHVybiBpbnRlcnByZXRGbihhc3QsIGNvbnRleHQpO1xuICB9O1xuXG4gIHJldHVybiB7IGludGVycHJldEFzdCB9O1xufVxuXG4iXX0=