'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Runs the specified batch of functions on the server, then resolves
 * the related promises.
 */
var processBatch = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(kfetch, batch) {
    var _ref4, results;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return kfetch({
              pathname: _consts.FUNCTIONS_URL,
              method: 'POST',
              body: JSON.stringify({
                functions: Object.values(batch).map(function (_ref5) {
                  var request = _ref5.request;
                  return request;
                })
              })
            });

          case 3:
            _ref4 = _context.sent;
            results = _ref4.results;


            results.forEach(function (_ref6) {
              var id = _ref6.id,
                  result = _ref6.result;
              var future = batch[id].future;

              if (result.statusCode && result.err) {
                future.reject(result);
              } else {
                future.resolve(result);
              }
            });
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](0);

            Object.values(batch).forEach(function (_ref7) {
              var future = _ref7.future;

              future.reject(_context.t0);
            });

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 8]]);
  }));

  return function processBatch(_x, _x2) {
    return _ref3.apply(this, arguments);
  };
}();

exports.batchedFetch = batchedFetch;

var _consts = require('./consts');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a function which executes an Expression function on the
 * server as part of a larger batch of executions.
 */
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

function batchedFetch(_ref) {
  var kfetch = _ref.kfetch,
      serialize = _ref.serialize,
      _ref$ms = _ref.ms,
      ms = _ref$ms === undefined ? 10 : _ref$ms;

  // Uniquely identifies each function call in a batch operation
  // so that the appropriate promise can be resolved / rejected later.
  var id = 0;

  // A map like { id: { future, request } }, which is used to
  // track all of the function calls in a batch operation.
  var batch = {};
  var timeout = void 0;

  var nextId = function nextId() {
    return ++id;
  };

  var reset = function reset() {
    id = 0;
    batch = {};
    timeout = undefined;
  };

  var runBatch = function runBatch() {
    processBatch(kfetch, batch);
    reset();
  };

  return function (_ref2) {
    var functionName = _ref2.functionName,
        context = _ref2.context,
        args = _ref2.args;

    if (!timeout) {
      timeout = setTimeout(runBatch, ms);
    }

    var request = {
      functionName: functionName,
      args: args,
      context: serialize(context)
    };

    // Check to see if this is a duplicate server function.
    var duplicate = Object.values(batch).find(function (batchedRequest) {
      return _lodash2.default.isMatch(batchedRequest.request, request);
    });

    // If it is, just return the promise of the duplicated request.
    if (duplicate) {
      return duplicate.future.promise;
    }

    // If not, create a new promise, id, and add it to the batched collection.
    var future = createFuture();
    var id = nextId();
    request.id = id;

    batch[id] = {
      future: future,
      request: request
    };

    return future.promise;
  };
}

/**
 * An externally resolvable / rejectable promise, used to make sure
 * individual batch responses go to the correct caller.
 */
function createFuture() {
  var _resolve = void 0;
  var _reject = void 0;

  return {
    resolve: function resolve(val) {
      return _resolve(val);
    },
    reject: function reject(val) {
      return _reject(val);
    },

    promise: new Promise(function (res, rej) {
      _resolve = res;
      _reject = rej;
    })
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wdWJsaWMvYmF0Y2hlZF9mZXRjaC5qcyJdLCJuYW1lcyI6WyJrZmV0Y2giLCJiYXRjaCIsInBhdGhuYW1lIiwibWV0aG9kIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJmdW5jdGlvbnMiLCJPYmplY3QiLCJ2YWx1ZXMiLCJtYXAiLCJyZXF1ZXN0IiwicmVzdWx0cyIsImZvckVhY2giLCJpZCIsInJlc3VsdCIsImZ1dHVyZSIsInN0YXR1c0NvZGUiLCJlcnIiLCJyZWplY3QiLCJyZXNvbHZlIiwicHJvY2Vzc0JhdGNoIiwiYmF0Y2hlZEZldGNoIiwic2VyaWFsaXplIiwibXMiLCJ0aW1lb3V0IiwibmV4dElkIiwicmVzZXQiLCJ1bmRlZmluZWQiLCJydW5CYXRjaCIsImZ1bmN0aW9uTmFtZSIsImNvbnRleHQiLCJhcmdzIiwic2V0VGltZW91dCIsImR1cGxpY2F0ZSIsImZpbmQiLCJpc01hdGNoIiwiYmF0Y2hlZFJlcXVlc3QiLCJwcm9taXNlIiwiY3JlYXRlRnV0dXJlIiwidmFsIiwiUHJvbWlzZSIsInJlcyIsInJlaiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFzR0E7Ozs7O3VGQUlBLGlCQUE0QkEsTUFBNUIsRUFBb0NDLEtBQXBDO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBRThCRCxPQUFPO0FBQy9CRSw2Q0FEK0I7QUFFL0JDLHNCQUFRLE1BRnVCO0FBRy9CQyxvQkFBTUMsS0FBS0MsU0FBTCxDQUFlO0FBQ25CQywyQkFBV0MsT0FBT0MsTUFBUCxDQUFjUixLQUFkLEVBQXFCUyxHQUFyQixDQUF5QjtBQUFBLHNCQUFHQyxPQUFILFNBQUdBLE9BQUg7QUFBQSx5QkFBaUJBLE9BQWpCO0FBQUEsaUJBQXpCO0FBRFEsZUFBZjtBQUh5QixhQUFQLENBRjlCOztBQUFBO0FBQUE7QUFFWUMsbUJBRlosU0FFWUEsT0FGWjs7O0FBVUlBLG9CQUFRQyxPQUFSLENBQWdCLGlCQUFvQjtBQUFB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QixHQUFQLENBQVA7QUFBcUIsS0FGOUI7O0FBR0xGLGFBQVMsSUFBSUcsT0FBSixDQUFZLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ2pDdkIsaUJBQVVzQixHQUFWO0FBQ0F2QixnQkFBU3dCLEdBQVQ7QUFDRCxLQUhRO0FBSEosR0FBUDtBQVFEIiwiZmlsZSI6ImJhdGNoZWRfZmV0Y2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgRlVOQ1RJT05TX1VSTCB9IGZyb20gJy4vY29uc3RzJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbi8qKlxuICogQ3JlYXRlIGEgZnVuY3Rpb24gd2hpY2ggZXhlY3V0ZXMgYW4gRXhwcmVzc2lvbiBmdW5jdGlvbiBvbiB0aGVcbiAqIHNlcnZlciBhcyBwYXJ0IG9mIGEgbGFyZ2VyIGJhdGNoIG9mIGV4ZWN1dGlvbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiYXRjaGVkRmV0Y2goeyBrZmV0Y2gsIHNlcmlhbGl6ZSwgbXMgPSAxMCB9KSB7XG4gIC8vIFVuaXF1ZWx5IGlkZW50aWZpZXMgZWFjaCBmdW5jdGlvbiBjYWxsIGluIGEgYmF0Y2ggb3BlcmF0aW9uXG4gIC8vIHNvIHRoYXQgdGhlIGFwcHJvcHJpYXRlIHByb21pc2UgY2FuIGJlIHJlc29sdmVkIC8gcmVqZWN0ZWQgbGF0ZXIuXG4gIGxldCBpZCA9IDA7XG5cbiAgLy8gQSBtYXAgbGlrZSB7IGlkOiB7IGZ1dHVyZSwgcmVxdWVzdCB9IH0sIHdoaWNoIGlzIHVzZWQgdG9cbiAgLy8gdHJhY2sgYWxsIG9mIHRoZSBmdW5jdGlvbiBjYWxscyBpbiBhIGJhdGNoIG9wZXJhdGlvbi5cbiAgbGV0IGJhdGNoID0ge307XG4gIGxldCB0aW1lb3V0O1xuXG4gIGNvbnN0IG5leHRJZCA9ICgpID0+ICsraWQ7XG5cbiAgY29uc3QgcmVzZXQgPSAoKSA9PiB7XG4gICAgaWQgPSAwO1xuICAgIGJhdGNoID0ge307XG4gICAgdGltZW91dCA9IHVuZGVmaW5lZDtcbiAgfTtcblxuICBjb25zdCBydW5CYXRjaCA9ICgpID0+IHtcbiAgICBwcm9jZXNzQmF0Y2goa2ZldGNoLCBiYXRjaCk7XG4gICAgcmVzZXQoKTtcbiAgfTtcblxuICByZXR1cm4gKHsgZnVuY3Rpb25OYW1lLCBjb250ZXh0LCBhcmdzIH0pID0+IHtcbiAgICBpZiAoIXRpbWVvdXQpIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KHJ1bkJhdGNoLCBtcyk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVxdWVzdCA9IHtcbiAgICAgIGZ1bmN0aW9uTmFtZSxcbiAgICAgIGFyZ3MsXG4gICAgICBjb250ZXh0OiBzZXJpYWxpemUoY29udGV4dCksXG4gICAgfTtcblxuICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGlzIGlzIGEgZHVwbGljYXRlIHNlcnZlciBmdW5jdGlvbi5cbiAgICBjb25zdCBkdXBsaWNhdGUgPSBPYmplY3QudmFsdWVzKGJhdGNoKS5maW5kKGJhdGNoZWRSZXF1ZXN0ID0+XG4gICAgICBfLmlzTWF0Y2goYmF0Y2hlZFJlcXVlc3QucmVxdWVzdCwgcmVxdWVzdClcbiAgICApO1xuXG4gICAgLy8gSWYgaXQgaXMsIGp1c3QgcmV0dXJuIHRoZSBwcm9taXNlIG9mIHRoZSBkdXBsaWNhdGVkIHJlcXVlc3QuXG4gICAgaWYgKGR1cGxpY2F0ZSkge1xuICAgICAgcmV0dXJuIGR1cGxpY2F0ZS5mdXR1cmUucHJvbWlzZTtcbiAgICB9XG5cbiAgICAvLyBJZiBub3QsIGNyZWF0ZSBhIG5ldyBwcm9taXNlLCBpZCwgYW5kIGFkZCBpdCB0byB0aGUgYmF0Y2hlZCBjb2xsZWN0aW9uLlxuICAgIGNvbnN0IGZ1dHVyZSA9IGNyZWF0ZUZ1dHVyZSgpO1xuICAgIGNvbnN0IGlkID0gbmV4dElkKCk7XG4gICAgcmVxdWVzdC5pZCA9IGlkO1xuXG4gICAgYmF0Y2hbaWRdID0ge1xuICAgICAgZnV0dXJlLFxuICAgICAgcmVxdWVzdCxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGZ1dHVyZS5wcm9taXNlO1xuICB9O1xufVxuXG4vKipcbiAqIEFuIGV4dGVybmFsbHkgcmVzb2x2YWJsZSAvIHJlamVjdGFibGUgcHJvbWlzZSwgdXNlZCB0byBtYWtlIHN1cmVcbiAqIGluZGl2aWR1YWwgYmF0Y2ggcmVzcG9uc2VzIGdvIHRvIHRoZSBjb3JyZWN0IGNhbGxlci5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRnV0dXJlKCkge1xuICBsZXQgcmVzb2x2ZTtcbiAgbGV0IHJlamVjdDtcblxuICByZXR1cm4ge1xuICAgIHJlc29sdmUodmFsKSB7IHJldHVybiByZXNvbHZlKHZhbCk7IH0sXG4gICAgcmVqZWN0KHZhbCkgeyByZXR1cm4gcmVqZWN0KHZhbCk7IH0sXG4gICAgcHJvbWlzZTogbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICByZXNvbHZlID0gcmVzO1xuICAgICAgcmVqZWN0ID0gcmVqO1xuICAgIH0pLFxuICB9O1xufVxuXG4vKipcbiAqIFJ1bnMgdGhlIHNwZWNpZmllZCBiYXRjaCBvZiBmdW5jdGlvbnMgb24gdGhlIHNlcnZlciwgdGhlbiByZXNvbHZlc1xuICogdGhlIHJlbGF0ZWQgcHJvbWlzZXMuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NCYXRjaChrZmV0Y2gsIGJhdGNoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyByZXN1bHRzIH0gPSBhd2FpdCBrZmV0Y2goe1xuICAgICAgcGF0aG5hbWU6IEZVTkNUSU9OU19VUkwsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgZnVuY3Rpb25zOiBPYmplY3QudmFsdWVzKGJhdGNoKS5tYXAoKHsgcmVxdWVzdCB9KSA9PiByZXF1ZXN0KSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgcmVzdWx0cy5mb3JFYWNoKCh7IGlkLCByZXN1bHQgfSkgPT4ge1xuICAgICAgY29uc3QgeyBmdXR1cmUgfSA9IGJhdGNoW2lkXTtcbiAgICAgIGlmIChyZXN1bHQuc3RhdHVzQ29kZSAmJiByZXN1bHQuZXJyKSB7XG4gICAgICAgIGZ1dHVyZS5yZWplY3QocmVzdWx0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1dHVyZS5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIE9iamVjdC52YWx1ZXMoYmF0Y2gpLmZvckVhY2goKHsgZnV0dXJlIH0pID0+IHtcbiAgICAgIGZ1dHVyZS5yZWplY3QoZXJyKTtcbiAgICB9KTtcbiAgfVxufVxuIl19