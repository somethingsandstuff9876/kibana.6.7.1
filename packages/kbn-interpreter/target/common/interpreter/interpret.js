'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.interpreterProvider = interpreterProvider;

var _lodash = require('lodash.clone');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash');

var _get_type = require('../lib/get_type');

var _ast = require('../lib/ast');

var _get_by_alias = require('../lib/get_by_alias');

var _cast = require('./cast');

var _create_error = require('./create_error');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function interpreterProvider(config) {
  var interpret = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(node) {
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = (0, _get_type.getType)(node);
              _context.next = _context.t0 === 'expression' ? 3 : _context.t0 === 'string' ? 4 : _context.t0 === 'number' ? 4 : _context.t0 === 'null' ? 4 : _context.t0 === 'boolean' ? 4 : 5;
              break;

            case 3:
              return _context.abrupt('return', invokeChain(node.chain, context));

            case 4:
              return _context.abrupt('return', node);

            case 5:
              throw new Error('Unknown AST object: ' + JSON.stringify(node));

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function interpret(_x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var invokeChain = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(chainArr, context) {
      var chain, link, fnName, fnArgs, fnDef, _ref3, resolvedArgs, newContext;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (chainArr.length) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt('return', Promise.resolve(context));

            case 2:
              chain = (0, _lodash2.default)(chainArr);
              link = chain.shift(); // Every thing in the chain will always be a function right?

              fnName = link.function, fnArgs = link.arguments;
              fnDef = (0, _get_by_alias.getByAlias)(functions, fnName);

              if (fnDef) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt('return', (0, _create_error.createError)({ message: 'Function ' + fnName + ' could not be found.' }));

            case 8:
              _context2.prev = 8;
              _context2.next = 11;
              return resolveArgs(fnDef, context, fnArgs);

            case 11:
              _ref3 = _context2.sent;
              resolvedArgs = _ref3.resolvedArgs;
              _context2.next = 15;
              return invokeFunction(fnDef, context, resolvedArgs);

            case 15:
              newContext = _context2.sent;

              if (!((0, _get_type.getType)(newContext) === 'error')) {
                _context2.next = 18;
                break;
              }

              return _context2.abrupt('return', newContext);

            case 18:
              _context2.next = 20;
              return invokeChain(chain, newContext);

            case 20:
              return _context2.abrupt('return', _context2.sent);

            case 23:
              _context2.prev = 23;
              _context2.t0 = _context2['catch'](8);

              // Everything that throws from a function will hit this
              // The interpreter should *never* fail. It should always return a `{type: error}` on failure
              _context2.t0.message = '[' + fnName + '] > ' + _context2.t0.message;
              return _context2.abrupt('return', (0, _create_error.createError)(_context2.t0));

            case 27:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[8, 23]]);
    }));

    return function invokeChain(_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();

  var invokeFunction = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(fnDef, context, args) {
      var acceptableContext, fnOutput, returnType, expectedType, type;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              // Check function input.
              acceptableContext = cast(context, fnDef.context.types);
              _context3.next = 3;
              return fnDef.fn(acceptableContext, args, handlers);

            case 3:
              fnOutput = _context3.sent;


              // Validate that the function returned the type it said it would.
              // This isn't really required, but it keeps function developers honest.
              returnType = (0, _get_type.getType)(fnOutput);
              expectedType = fnDef.type;

              if (!(expectedType && returnType !== expectedType)) {
                _context3.next = 8;
                break;
              }

              throw new Error('Function \'' + fnDef.name + '\' should return \'' + expectedType + '\',' + (' actually returned \'' + returnType + '\''));

            case 8:

              // Validate the function output against the type definition's validate function
              type = handlers.types[fnDef.type];

              if (!(type && type.validate)) {
                _context3.next = 17;
                break;
              }

              _context3.prev = 10;

              type.validate(fnOutput);
              _context3.next = 17;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3['catch'](10);
              throw new Error('Output of \'' + fnDef.name + '\' is not a valid type \'' + fnDef.type + '\': ' + _context3.t0);

            case 17:
              return _context3.abrupt('return', fnOutput);

            case 18:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[10, 14]]);
    }));

    return function invokeFunction(_x5, _x6, _x7) {
      return _ref4.apply(this, arguments);
    };
  }();

  // Processes the multi-valued AST argument values into arguments that can be passed to the function


  var resolveArgs = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(fnDef, context, argAsts) {
      var _this = this;

      var argDefs, dealiasedArgAsts, argAstsWithDefaults, resolveArgFns, argNames, resolvedArgValues, resolvedMultiArgs, resolvedArgs;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              argDefs = fnDef.args;

              // Use the non-alias name from the argument definition

              dealiasedArgAsts = (0, _lodash3.reduce)(argAsts, function (argAsts, argAst, argName) {
                var argDef = (0, _get_by_alias.getByAlias)(argDefs, argName);
                // TODO: Implement a system to allow for undeclared arguments
                if (!argDef) {
                  throw new Error('Unknown argument \'' + argName + '\' passed to function \'' + fnDef.name + '\'');
                }

                argAsts[argDef.name] = (argAsts[argDef.name] || []).concat(argAst);
                return argAsts;
              }, {});

              // Check for missing required arguments

              (0, _lodash3.each)(argDefs, function (argDef) {
                var aliases = argDef.aliases,
                    argDefault = argDef.default,
                    argName = argDef.name,
                    required = argDef.required;

                if (typeof argDefault === 'undefined' && required && typeof dealiasedArgAsts[argName] === 'undefined') {
                  if (aliases.length === 0) {
                    throw new Error(fnDef.name + ' requires an argument');
                  } else {
                    var errorArg = argName === '_' ? aliases[0] : argName; // use an alias if _ is the missing arg
                    throw new Error(fnDef.name + ' requires an "' + errorArg + '" argument');
                  }
                }
              });

              // Fill in default values from argument definition
              argAstsWithDefaults = (0, _lodash3.reduce)(argDefs, function (argAsts, argDef, argName) {
                if (typeof argAsts[argName] === 'undefined' && typeof argDef.default !== 'undefined') {
                  argAsts[argName] = [(0, _ast.fromExpression)(argDef.default, 'argument')];
                }

                return argAsts;
              }, dealiasedArgAsts);

              // Create the functions to resolve the argument ASTs into values
              // These are what are passed to the actual functions if you opt out of resolving

              resolveArgFns = (0, _lodash3.mapValues)(argAstsWithDefaults, function (argAsts, argName) {
                return argAsts.map(function (argAst) {
                  return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                    var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : context;
                    var newContext;
                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            _context4.next = 2;
                            return interpret(argAst, ctx);

                          case 2:
                            newContext = _context4.sent;

                            if (!((0, _get_type.getType)(newContext) === 'error')) {
                              _context4.next = 5;
                              break;
                            }

                            throw newContext.error;

                          case 5:
                            return _context4.abrupt('return', cast(newContext, argDefs[argName].types));

                          case 6:
                          case 'end':
                            return _context4.stop();
                        }
                      }
                    }, _callee4, _this);
                  }));
                });
              });
              argNames = (0, _lodash3.keys)(resolveArgFns);

              // Actually resolve unless the argument definition says not to

              _context5.next = 8;
              return Promise.all(argNames.map(function (argName) {
                var interpretFns = resolveArgFns[argName];
                if (!argDefs[argName].resolve) return interpretFns;
                return Promise.all(interpretFns.map(function (fn) {
                  return fn();
                }));
              }));

            case 8:
              resolvedArgValues = _context5.sent;
              resolvedMultiArgs = (0, _lodash3.zipObject)(argNames, resolvedArgValues);

              // Just return the last unless the argument definition allows multiple

              resolvedArgs = (0, _lodash3.mapValues)(resolvedMultiArgs, function (argValues, argName) {
                if (argDefs[argName].multi) return argValues;
                return (0, _lodash3.last)(argValues);
              });

              // Return an object here because the arguments themselves might actually have a 'then'
              // function which would be treated as a promise

              return _context5.abrupt('return', { resolvedArgs: resolvedArgs });

            case 12:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function resolveArgs(_x8, _x9, _x10) {
      return _ref5.apply(this, arguments);
    };
  }();

  var functions = config.functions,
      types = config.types;

  var handlers = (0, _extends3.default)({}, config.handlers, { types: types });
  var cast = (0, _cast.castProvider)(types);

  return interpret;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vaW50ZXJwcmV0ZXIvaW50ZXJwcmV0LmpzIl0sIm5hbWVzIjpbImludGVycHJldGVyUHJvdmlkZXIiLCJjb25maWciLCJub2RlIiwiY29udGV4dCIsImludm9rZUNoYWluIiwiY2hhaW4iLCJFcnJvciIsIkpTT04iLCJzdHJpbmdpZnkiLCJpbnRlcnByZXQiLCJjaGFpbkFyciIsImxlbmd0aCIsIlByb21pc2UiLCJyZXNvbHZlIiwibGluayIsInNoaWZ0IiwiZm5OYW1lIiwiZnVuY3Rpb24iLCJmbkFyZ3MiLCJhcmd1bWVudHMiLCJmbkRlZiIsImZ1bmN0aW9ucyIsIm1lc3NhZ2UiLCJyZXNvbHZlQXJncyIsInJlc29sdmVkQXJncyIsImludm9rZUZ1bmN0aW9uIiwibmV3Q29udGV4dCIsImFyZ3MiLCJhY2NlcHRhYmxlQ29udGV4dCIsImNhc3QiLCJ0eXBlcyIsImZuIiwiaGFuZGxlcnMiLCJmbk91dHB1dCIsInJldHVyblR5cGUiLCJleHBlY3RlZFR5cGUiLCJ0eXBlIiwibmFtZSIsInZhbGlkYXRlIiwiYXJnQXN0cyIsImFyZ0RlZnMiLCJkZWFsaWFzZWRBcmdBc3RzIiwiYXJnQXN0IiwiYXJnTmFtZSIsImFyZ0RlZiIsImNvbmNhdCIsImFsaWFzZXMiLCJhcmdEZWZhdWx0IiwiZGVmYXVsdCIsInJlcXVpcmVkIiwiZXJyb3JBcmciLCJhcmdBc3RzV2l0aERlZmF1bHRzIiwicmVzb2x2ZUFyZ0ZucyIsIm1hcCIsImN0eCIsImVycm9yIiwiYXJnTmFtZXMiLCJhbGwiLCJpbnRlcnByZXRGbnMiLCJyZXNvbHZlZEFyZ1ZhbHVlcyIsInJlc29sdmVkTXVsdGlBcmdzIiwiYXJnVmFsdWVzIiwibXVsdGkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQTJCZ0JBLG1CLEdBQUFBLG1COztBQVJoQjs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sU0FBU0EsbUJBQVQsQ0FBNkJD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NkIsVUFBQ0MsU0FBRCxFQUFZbEIsT0FBWixFQUF3QjtBQUN4RSxvQkFBSUgsUUFBUUcsT0FBUixFQUFpQm1CLEtBQXJCLEVBQTRCLE9BQU9ELFNBQVA7QUFDNUIsdUJBQU8sbUJBQUtBLFNBQUwsQ0FBUDtBQUNELGVBSG9CLENBNUV2Qjs7QUFpRkU7QUFDQTs7QUFsRkYsZ0RBbUZTLEVBQUVyQywwQkFBRixFQW5GVDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQW5GMEM7O0FBQUEsb0JBbUYzQkQsV0FuRjJCO0FBQUE7QUFBQTtBQUFBOztBQUFBLE1BQ2xDRixTQURrQyxHQUNicEIsTUFEYSxDQUNsQ29CLFNBRGtDO0FBQUEsTUFDdkJTLEtBRHVCLEdBQ2I3QixNQURhLENBQ3ZCNkIsS0FEdUI7O0FBRTFDLE1BQU1FLHNDQUFnQi9CLE9BQU8rQixRQUF2QixJQUFpQ0YsWUFBakMsR0FBTjtBQUNBLE1BQU1ELE9BQU8sd0JBQWFDLEtBQWIsQ0FBYjs7QUFFQSxTQUFPckIsU0FBUDtBQW1LRCxDLENBbk1EIiwiZmlsZSI6ImludGVycHJldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgY2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lJztcbmltcG9ydCB7IGVhY2gsIGtleXMsIGxhc3QsIG1hcFZhbHVlcywgcmVkdWNlLCB6aXBPYmplY3QgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgZ2V0VHlwZSB9IGZyb20gJy4uL2xpYi9nZXRfdHlwZSc7XG5pbXBvcnQgeyBmcm9tRXhwcmVzc2lvbiB9IGZyb20gJy4uL2xpYi9hc3QnO1xuaW1wb3J0IHsgZ2V0QnlBbGlhcyB9IGZyb20gJy4uL2xpYi9nZXRfYnlfYWxpYXMnO1xuaW1wb3J0IHsgY2FzdFByb3ZpZGVyIH0gZnJvbSAnLi9jYXN0JztcbmltcG9ydCB7IGNyZWF0ZUVycm9yIH0gZnJvbSAnLi9jcmVhdGVfZXJyb3InO1xuXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJwcmV0ZXJQcm92aWRlcihjb25maWcpIHtcbiAgY29uc3QgeyBmdW5jdGlvbnMsIHR5cGVzIH0gPSBjb25maWc7XG4gIGNvbnN0IGhhbmRsZXJzID0geyAuLi5jb25maWcuaGFuZGxlcnMsIHR5cGVzIH07XG4gIGNvbnN0IGNhc3QgPSBjYXN0UHJvdmlkZXIodHlwZXMpO1xuXG4gIHJldHVybiBpbnRlcnByZXQ7XG5cbiAgYXN5bmMgZnVuY3Rpb24gaW50ZXJwcmV0KG5vZGUsIGNvbnRleHQgPSBudWxsKSB7XG4gICAgc3dpdGNoIChnZXRUeXBlKG5vZGUpKSB7XG4gICAgICBjYXNlICdleHByZXNzaW9uJzpcbiAgICAgICAgcmV0dXJuIGludm9rZUNoYWluKG5vZGUuY2hhaW4sIGNvbnRleHQpO1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICBjYXNlICdudWxsJzpcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBBU1Qgb2JqZWN0OiAke0pTT04uc3RyaW5naWZ5KG5vZGUpfWApO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGludm9rZUNoYWluKGNoYWluQXJyLCBjb250ZXh0KSB7XG4gICAgaWYgKCFjaGFpbkFyci5sZW5ndGgpIHJldHVybiBQcm9taXNlLnJlc29sdmUoY29udGV4dCk7XG5cbiAgICBjb25zdCBjaGFpbiA9IGNsb25lKGNoYWluQXJyKTtcbiAgICBjb25zdCBsaW5rID0gY2hhaW4uc2hpZnQoKTsgLy8gRXZlcnkgdGhpbmcgaW4gdGhlIGNoYWluIHdpbGwgYWx3YXlzIGJlIGEgZnVuY3Rpb24gcmlnaHQ/XG4gICAgY29uc3QgeyBmdW5jdGlvbjogZm5OYW1lLCBhcmd1bWVudHM6IGZuQXJncyB9ID0gbGluaztcbiAgICBjb25zdCBmbkRlZiA9IGdldEJ5QWxpYXMoZnVuY3Rpb25zLCBmbk5hbWUpO1xuXG4gICAgaWYgKCFmbkRlZikge1xuICAgICAgcmV0dXJuIGNyZWF0ZUVycm9yKHsgbWVzc2FnZTogYEZ1bmN0aW9uICR7Zm5OYW1lfSBjb3VsZCBub3QgYmUgZm91bmQuYCB9KTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gUmVzb2x2ZSBhcmd1bWVudHMgYmVmb3JlIHBhc3NpbmcgdG8gZnVuY3Rpb25cbiAgICAgIC8vIHJlc29sdmVBcmdzIHJldHVybnMgYW4gb2JqZWN0IGJlY2F1c2UgdGhlIGFyZ3VtZW50cyB0aGVtc2VsdmVzIG1pZ2h0XG4gICAgICAvLyBhY3R1YWxseSBoYXZlIGEgJ3RoZW4nIGZ1bmN0aW9uIHdoaWNoIHdvdWxkIGJlIHRyZWF0ZWQgYXMgYSBwcm9taXNlXG4gICAgICBjb25zdCB7IHJlc29sdmVkQXJncyB9ID0gYXdhaXQgcmVzb2x2ZUFyZ3MoZm5EZWYsIGNvbnRleHQsIGZuQXJncyk7XG4gICAgICBjb25zdCBuZXdDb250ZXh0ID0gYXdhaXQgaW52b2tlRnVuY3Rpb24oZm5EZWYsIGNvbnRleHQsIHJlc29sdmVkQXJncyk7XG5cbiAgICAgIC8vIGlmIHNvbWV0aGluZyBmYWlsZWQsIGp1c3QgcmV0dXJuIHRoZSBmYWlsdXJlXG4gICAgICBpZiAoZ2V0VHlwZShuZXdDb250ZXh0KSA9PT0gJ2Vycm9yJykgcmV0dXJuIG5ld0NvbnRleHQ7XG5cbiAgICAgIC8vIENvbnRpbnVlIHJlLWludm9raW5nIGNoYWluIHVudGlsIGl0J3MgZW1wdHlcbiAgICAgIHJldHVybiBhd2FpdCBpbnZva2VDaGFpbihjaGFpbiwgbmV3Q29udGV4dCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gRXZlcnl0aGluZyB0aGF0IHRocm93cyBmcm9tIGEgZnVuY3Rpb24gd2lsbCBoaXQgdGhpc1xuICAgICAgLy8gVGhlIGludGVycHJldGVyIHNob3VsZCAqbmV2ZXIqIGZhaWwuIEl0IHNob3VsZCBhbHdheXMgcmV0dXJuIGEgYHt0eXBlOiBlcnJvcn1gIG9uIGZhaWx1cmVcbiAgICAgIGUubWVzc2FnZSA9IGBbJHtmbk5hbWV9XSA+ICR7ZS5tZXNzYWdlfWA7XG4gICAgICByZXR1cm4gY3JlYXRlRXJyb3IoZSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gaW52b2tlRnVuY3Rpb24oZm5EZWYsIGNvbnRleHQsIGFyZ3MpIHtcbiAgICAvLyBDaGVjayBmdW5jdGlvbiBpbnB1dC5cbiAgICBjb25zdCBhY2NlcHRhYmxlQ29udGV4dCA9IGNhc3QoY29udGV4dCwgZm5EZWYuY29udGV4dC50eXBlcyk7XG4gICAgY29uc3QgZm5PdXRwdXQgPSBhd2FpdCBmbkRlZi5mbihhY2NlcHRhYmxlQ29udGV4dCwgYXJncywgaGFuZGxlcnMpO1xuXG4gICAgLy8gVmFsaWRhdGUgdGhhdCB0aGUgZnVuY3Rpb24gcmV0dXJuZWQgdGhlIHR5cGUgaXQgc2FpZCBpdCB3b3VsZC5cbiAgICAvLyBUaGlzIGlzbid0IHJlYWxseSByZXF1aXJlZCwgYnV0IGl0IGtlZXBzIGZ1bmN0aW9uIGRldmVsb3BlcnMgaG9uZXN0LlxuICAgIGNvbnN0IHJldHVyblR5cGUgPSBnZXRUeXBlKGZuT3V0cHV0KTtcbiAgICBjb25zdCBleHBlY3RlZFR5cGUgPSBmbkRlZi50eXBlO1xuICAgIGlmIChleHBlY3RlZFR5cGUgJiYgcmV0dXJuVHlwZSAhPT0gZXhwZWN0ZWRUeXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBGdW5jdGlvbiAnJHtmbkRlZi5uYW1lfScgc2hvdWxkIHJldHVybiAnJHtleHBlY3RlZFR5cGV9JyxgICtcbiAgICAgICAgICBgIGFjdHVhbGx5IHJldHVybmVkICcke3JldHVyblR5cGV9J2BcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gVmFsaWRhdGUgdGhlIGZ1bmN0aW9uIG91dHB1dCBhZ2FpbnN0IHRoZSB0eXBlIGRlZmluaXRpb24ncyB2YWxpZGF0ZSBmdW5jdGlvblxuICAgIGNvbnN0IHR5cGUgPSBoYW5kbGVycy50eXBlc1tmbkRlZi50eXBlXTtcbiAgICBpZiAodHlwZSAmJiB0eXBlLnZhbGlkYXRlKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0eXBlLnZhbGlkYXRlKGZuT3V0cHV0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBPdXRwdXQgb2YgJyR7Zm5EZWYubmFtZX0nIGlzIG5vdCBhIHZhbGlkIHR5cGUgJyR7Zm5EZWYudHlwZX0nOiAke2V9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZuT3V0cHV0O1xuICB9XG5cbiAgLy8gUHJvY2Vzc2VzIHRoZSBtdWx0aS12YWx1ZWQgQVNUIGFyZ3VtZW50IHZhbHVlcyBpbnRvIGFyZ3VtZW50cyB0aGF0IGNhbiBiZSBwYXNzZWQgdG8gdGhlIGZ1bmN0aW9uXG4gIGFzeW5jIGZ1bmN0aW9uIHJlc29sdmVBcmdzKGZuRGVmLCBjb250ZXh0LCBhcmdBc3RzKSB7XG4gICAgY29uc3QgYXJnRGVmcyA9IGZuRGVmLmFyZ3M7XG5cbiAgICAvLyBVc2UgdGhlIG5vbi1hbGlhcyBuYW1lIGZyb20gdGhlIGFyZ3VtZW50IGRlZmluaXRpb25cbiAgICBjb25zdCBkZWFsaWFzZWRBcmdBc3RzID0gcmVkdWNlKFxuICAgICAgYXJnQXN0cyxcbiAgICAgIChhcmdBc3RzLCBhcmdBc3QsIGFyZ05hbWUpID0+IHtcbiAgICAgICAgY29uc3QgYXJnRGVmID0gZ2V0QnlBbGlhcyhhcmdEZWZzLCBhcmdOYW1lKTtcbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGEgc3lzdGVtIHRvIGFsbG93IGZvciB1bmRlY2xhcmVkIGFyZ3VtZW50c1xuICAgICAgICBpZiAoIWFyZ0RlZikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBhcmd1bWVudCAnJHthcmdOYW1lfScgcGFzc2VkIHRvIGZ1bmN0aW9uICcke2ZuRGVmLm5hbWV9J2ApO1xuICAgICAgICB9XG5cbiAgICAgICAgYXJnQXN0c1thcmdEZWYubmFtZV0gPSAoYXJnQXN0c1thcmdEZWYubmFtZV0gfHwgW10pLmNvbmNhdChhcmdBc3QpO1xuICAgICAgICByZXR1cm4gYXJnQXN0cztcbiAgICAgIH0sXG4gICAgICB7fVxuICAgICk7XG5cbiAgICAvLyBDaGVjayBmb3IgbWlzc2luZyByZXF1aXJlZCBhcmd1bWVudHNcbiAgICBlYWNoKGFyZ0RlZnMsIGFyZ0RlZiA9PiB7XG4gICAgICBjb25zdCB7IGFsaWFzZXMsIGRlZmF1bHQ6IGFyZ0RlZmF1bHQsIG5hbWU6IGFyZ05hbWUsIHJlcXVpcmVkIH0gPSBhcmdEZWY7XG4gICAgICBpZiAoXG4gICAgICAgIHR5cGVvZiBhcmdEZWZhdWx0ID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICByZXF1aXJlZCAmJlxuICAgICAgICB0eXBlb2YgZGVhbGlhc2VkQXJnQXN0c1thcmdOYW1lXSA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICkge1xuICAgICAgICBpZiAoYWxpYXNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7Zm5EZWYubmFtZX0gcmVxdWlyZXMgYW4gYXJndW1lbnRgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBlcnJvckFyZyA9IGFyZ05hbWUgPT09ICdfJyA/IGFsaWFzZXNbMF0gOiBhcmdOYW1lOyAvLyB1c2UgYW4gYWxpYXMgaWYgXyBpcyB0aGUgbWlzc2luZyBhcmdcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7Zm5EZWYubmFtZX0gcmVxdWlyZXMgYW4gXCIke2Vycm9yQXJnfVwiIGFyZ3VtZW50YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEZpbGwgaW4gZGVmYXVsdCB2YWx1ZXMgZnJvbSBhcmd1bWVudCBkZWZpbml0aW9uXG4gICAgY29uc3QgYXJnQXN0c1dpdGhEZWZhdWx0cyA9IHJlZHVjZShcbiAgICAgIGFyZ0RlZnMsXG4gICAgICAoYXJnQXN0cywgYXJnRGVmLCBhcmdOYW1lKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJnQXN0c1thcmdOYW1lXSA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGFyZ0RlZi5kZWZhdWx0ICE9PSAndW5kZWZpbmVkJykgIHtcbiAgICAgICAgICBhcmdBc3RzW2FyZ05hbWVdID0gW2Zyb21FeHByZXNzaW9uKGFyZ0RlZi5kZWZhdWx0LCAnYXJndW1lbnQnKV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJnQXN0cztcbiAgICAgIH0sXG4gICAgICBkZWFsaWFzZWRBcmdBc3RzXG4gICAgKTtcblxuICAgIC8vIENyZWF0ZSB0aGUgZnVuY3Rpb25zIHRvIHJlc29sdmUgdGhlIGFyZ3VtZW50IEFTVHMgaW50byB2YWx1ZXNcbiAgICAvLyBUaGVzZSBhcmUgd2hhdCBhcmUgcGFzc2VkIHRvIHRoZSBhY3R1YWwgZnVuY3Rpb25zIGlmIHlvdSBvcHQgb3V0IG9mIHJlc29sdmluZ1xuICAgIGNvbnN0IHJlc29sdmVBcmdGbnMgPSBtYXBWYWx1ZXMoYXJnQXN0c1dpdGhEZWZhdWx0cywgKGFyZ0FzdHMsIGFyZ05hbWUpID0+IHtcbiAgICAgIHJldHVybiBhcmdBc3RzLm1hcChhcmdBc3QgPT4ge1xuICAgICAgICByZXR1cm4gYXN5bmMgKGN0eCA9IGNvbnRleHQpID0+IHtcbiAgICAgICAgICBjb25zdCBuZXdDb250ZXh0ID0gYXdhaXQgaW50ZXJwcmV0KGFyZ0FzdCwgY3R4KTtcbiAgICAgICAgICAvLyBUaGlzIGlzIHdoeSB3aGVuIGFueSBzdWItZXhwcmVzc2lvbiBlcnJvcnMsIHRoZSBlbnRpcmUgdGhpbmcgZXJyb3JzXG4gICAgICAgICAgaWYgKGdldFR5cGUobmV3Q29udGV4dCkgPT09ICdlcnJvcicpIHRocm93IG5ld0NvbnRleHQuZXJyb3I7XG4gICAgICAgICAgcmV0dXJuIGNhc3QobmV3Q29udGV4dCwgYXJnRGVmc1thcmdOYW1lXS50eXBlcyk7XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFyZ05hbWVzID0ga2V5cyhyZXNvbHZlQXJnRm5zKTtcblxuICAgIC8vIEFjdHVhbGx5IHJlc29sdmUgdW5sZXNzIHRoZSBhcmd1bWVudCBkZWZpbml0aW9uIHNheXMgbm90IHRvXG4gICAgY29uc3QgcmVzb2x2ZWRBcmdWYWx1ZXMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIGFyZ05hbWVzLm1hcChhcmdOYW1lID0+IHtcbiAgICAgICAgY29uc3QgaW50ZXJwcmV0Rm5zID0gcmVzb2x2ZUFyZ0Zuc1thcmdOYW1lXTtcbiAgICAgICAgaWYgKCFhcmdEZWZzW2FyZ05hbWVdLnJlc29sdmUpIHJldHVybiBpbnRlcnByZXRGbnM7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChpbnRlcnByZXRGbnMubWFwKGZuID0+IGZuKCkpKTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGNvbnN0IHJlc29sdmVkTXVsdGlBcmdzID0gemlwT2JqZWN0KGFyZ05hbWVzLCByZXNvbHZlZEFyZ1ZhbHVlcyk7XG5cbiAgICAvLyBKdXN0IHJldHVybiB0aGUgbGFzdCB1bmxlc3MgdGhlIGFyZ3VtZW50IGRlZmluaXRpb24gYWxsb3dzIG11bHRpcGxlXG4gICAgY29uc3QgcmVzb2x2ZWRBcmdzID0gbWFwVmFsdWVzKHJlc29sdmVkTXVsdGlBcmdzLCAoYXJnVmFsdWVzLCBhcmdOYW1lKSA9PiB7XG4gICAgICBpZiAoYXJnRGVmc1thcmdOYW1lXS5tdWx0aSkgcmV0dXJuIGFyZ1ZhbHVlcztcbiAgICAgIHJldHVybiBsYXN0KGFyZ1ZhbHVlcyk7XG4gICAgfSk7XG5cbiAgICAvLyBSZXR1cm4gYW4gb2JqZWN0IGhlcmUgYmVjYXVzZSB0aGUgYXJndW1lbnRzIHRoZW1zZWx2ZXMgbWlnaHQgYWN0dWFsbHkgaGF2ZSBhICd0aGVuJ1xuICAgIC8vIGZ1bmN0aW9uIHdoaWNoIHdvdWxkIGJlIHRyZWF0ZWQgYXMgYSBwcm9taXNlXG4gICAgcmV0dXJuIHsgcmVzb2x2ZWRBcmdzIH07XG4gIH1cbn1cbiJdfQ==