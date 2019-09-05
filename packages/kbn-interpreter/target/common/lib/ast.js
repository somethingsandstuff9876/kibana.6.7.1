'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.fromExpression = fromExpression;
exports.safeElementFromExpression = safeElementFromExpression;
exports.toExpression = toExpression;

var _get_type = require('./get_type');

var _grammar = require('./grammar');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function getArgumentString(arg, argKey) {
  var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var type = (0, _get_type.getType)(arg);

  function maybeArgKey(argKey, argString) {
    return argKey == null || argKey === '_' ? argString : argKey + '=' + argString;
  }

  if (type === 'string') {
    // correctly (re)escape double quotes
    var escapedArg = arg.replace(/[\\"]/g, '\\$&'); // $& means the whole matched string
    return maybeArgKey(argKey, '"' + escapedArg + '"');
  }

  if (type === 'boolean' || type === 'null' || type === 'number') {
    // use values directly
    return maybeArgKey(argKey, '' + arg);
  }

  if (type === 'expression') {
    // build subexpressions
    return maybeArgKey(argKey, '{' + getExpression(arg.chain, level + 1) + '}');
  }

  // unknown type, throw with type value
  throw new Error('Invalid argument type in AST: ' + type);
}

function getExpressionArgs(block) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var args = block.arguments;
  var hasValidArgs = (typeof args === 'undefined' ? 'undefined' : (0, _typeof3.default)(args)) === 'object' && args != null && !Array.isArray(args);

  if (!hasValidArgs) throw new Error('Arguments can only be an object');

  var argKeys = Object.keys(args);
  var MAX_LINE_LENGTH = 80; // length before wrapping arguments
  return argKeys.map(function (argKey) {
    return args[argKey].reduce(function (acc, arg) {
      var argString = getArgumentString(arg, argKey, level);
      var lineLength = acc.split('\n').pop().length;

      // if arg values are too long, move it to the next line
      if (level === 0 && lineLength + argString.length > MAX_LINE_LENGTH) {
        return acc + '\n  ' + argString;
      }

      // append arg values to existing arg values
      if (lineLength > 0) return acc + ' ' + argString;

      // start the accumulator with the first arg value
      return argString;
    }, '');
  });
}

function fnWithArgs(fnName, args) {
  if (!args || args.length === 0) return fnName;
  return fnName + ' ' + args.join(' ');
}

function getExpression(chain) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!chain) throw new Error('Expressions must contain a chain');

  // break new functions onto new lines if we're not in a nested/sub-expression
  var separator = level > 0 ? ' | ' : '\n| ';

  return chain.map(function (chainObj) {
    var type = (0, _get_type.getType)(chainObj);

    if (type === 'function') {
      var fn = chainObj.function;
      if (!fn || fn.length === 0) throw new Error('Functions must have a function name');

      var expArgs = getExpressionArgs(chainObj, level);

      return fnWithArgs(fn, expArgs);
    }
  }, []).join(separator);
}

function fromExpression(expression) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'expression';

  try {
    return (0, _grammar.parse)(String(expression), { startRule: type });
  } catch (e) {
    throw new Error('Unable to parse expression: ' + e.message);
  }
}

// TODO: OMG This is so bad, we need to talk about the right way to handle bad expressions since some are element based and others not
function safeElementFromExpression(expression) {
  try {
    return fromExpression(expression);
  } catch (e) {
    return fromExpression('markdown\n"## Crud.\nCanvas could not parse this element\'s expression. I am so sorry this error isn\'t more useful. I promise it will be soon.\n\nThanks for understanding,\n#### Management\n"');
  }
}

// TODO: Respect the user's existing formatting
function toExpression(astObj) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'expression';

  if (type === 'argument') return getArgumentString(astObj);

  var validType = ['expression', 'function'].includes((0, _get_type.getType)(astObj));
  if (!validType) throw new Error('Expression must be an expression or argument function');

  if ((0, _get_type.getType)(astObj) === 'expression') {
    if (!Array.isArray(astObj.chain)) throw new Error('Expressions must contain a chain');

    return getExpression(astObj.chain);
  }

  var expArgs = getExpressionArgs(astObj);
  return fnWithArgs(astObj.function, expArgs);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vbGliL2FzdC5qcyJdLCJuYW1lcyI6WyJmcm9tRXhwcmVzc2lvbiIsInNhZmVFbGVtZW50RnJvbUV4cHJlc3Npb24iLCJ0b0V4cHJlc3Npb24iLCJnZXRBcmd1bWVudFN0cmluZyIsImFyZyIsImFyZ0tleSIsImxldmVsIiwidHlwZSIsIm1heWJlQXJnS2V5IiwiYXJnU3RyaW5nIiwiZXNjYXBlZEFyZyIsInJlcGxhY2UiLCJnZXRFeHByZXNzaW9uIiwiY2hhaW4iLCJFcnJvciIsImdldEV4cHJlc3Npb25BcmdzIiwiYmxvY2siLCJhcmdzIiwiYXJndW1lbnRzIiwiaGFzVmFsaWRBcmdzIiwiQXJyYXkiLCJpc0FycmF5IiwiYXJnS2V5cyIsIk9iamVjdCIsImtleXMiLCJNQVhfTElORV9MRU5HVEgiLCJtYXAiLCJyZWR1Y2UiLCJhY2MiLCJsaW5lTGVuZ3RoIiwic3BsaXQiLCJwb3AiLCJsZW5ndGgiLCJmbldpdGhBcmdzIiwiZm5OYW1lIiwiam9pbiIsInNlcGFyYXRvciIsImNoYWluT2JqIiwiZm4iLCJmdW5jdGlvbiIsImV4cEFyZ3MiLCJleHByZXNzaW9uIiwiU3RyaW5nIiwic3RhcnRSdWxlIiwiZSIsIm1lc3NhZ2UiLCJhc3RPYmoiLCJ2YWxpZFR5cGUiLCJpbmNsdWRlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztRQXVHZ0JBLGMsR0FBQUEsYztRQVNBQyx5QixHQUFBQSx5QjtRQWlCQUMsWSxHQUFBQSxZOztBQTlHaEI7O0FBQ0E7Ozs7QUFwQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkEsU0FBU0MsaUJBQVQsQ0FBMkJDLEdBQTNCLEVBQWdDQyxNQUFoQyxFQUFtRDtBQUFBLE1BQVhDLEtBQVcsdUVBQUgsQ0FBRzs7QUFDakQsTUFBTUMsT0FBTyx1QkFBUUgsR0FBUixDQUFiOztBQUVBLFdBQVNJLFdBQVQsQ0FBcUJILE1BQXJCLEVBQTZCSSxTQUE3QixFQUF3QztBQUN0QyxXQUFPSixVQUFVLElBQVYsSUFB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QVIsTUFBb0IsWUFBeEIsRUFBc0M7QUFDcEMsUUFBSSxDQUFDMUIsTUFBTUMsT0FBTixDQUFjeUIsT0FBT2pDLEtBQXJCLENBQUwsRUFBa0MsTUFBTSxJQUFJQyxLQUFKLENBQVUsa0NBQVYsQ0FBTjs7QUFFbEMsV0FBT0YsY0FBY2tDLE9BQU9qQyxLQUFyQixDQUFQO0FBQ0Q7O0FBRUQsTUFBTTJCLFVBQVV6QixrQkFBa0IrQixNQUFsQixDQUFoQjtBQUNBLFNBQU9iLFdBQVdhLE9BQU9QLFFBQWxCLEVBQTRCQyxPQUE1QixDQUFQO0FBQ0QiLCJmaWxlIjoiYXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIExpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmUgb3IgbW9yZSBjb250cmlidXRvclxuICogbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAqIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0XG4gKiBvd25lcnNoaXAuIEVsYXN0aWNzZWFyY2ggQi5WLiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyXG4gKiB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5XG4gKiBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IGdldFR5cGUgfSBmcm9tICcuL2dldF90eXBlJztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAnLi9ncmFtbWFyJztcblxuZnVuY3Rpb24gZ2V0QXJndW1lbnRTdHJpbmcoYXJnLCBhcmdLZXksIGxldmVsID0gMCkge1xuICBjb25zdCB0eXBlID0gZ2V0VHlwZShhcmcpO1xuXG4gIGZ1bmN0aW9uIG1heWJlQXJnS2V5KGFyZ0tleSwgYXJnU3RyaW5nKSB7XG4gICAgcmV0dXJuIGFyZ0tleSA9PSBudWxsIHx8IGFyZ0tleSA9PT0gJ18nID8gYXJnU3RyaW5nIDogYCR7YXJnS2V5fT0ke2FyZ1N0cmluZ31gO1xuICB9XG5cbiAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgLy8gY29ycmVjdGx5IChyZSllc2NhcGUgZG91YmxlIHF1b3Rlc1xuICAgIGNvbnN0IGVzY2FwZWRBcmcgPSBhcmcucmVwbGFjZSgvW1xcXFxcIl0vZywgJ1xcXFwkJicpOyAvLyAkJiBtZWFucyB0aGUgd2hvbGUgbWF0Y2hlZCBzdHJpbmdcbiAgICByZXR1cm4gbWF5YmVBcmdLZXkoYXJnS2V5LCBgXCIke2VzY2FwZWRBcmd9XCJgKTtcbiAgfVxuXG4gIGlmICh0eXBlID09PSAnYm9vbGVhbicgfHwgdHlwZSA9PT0gJ251bGwnIHx8IHR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgLy8gdXNlIHZhbHVlcyBkaXJlY3RseVxuICAgIHJldHVybiBtYXliZUFyZ0tleShhcmdLZXksIGAke2FyZ31gKTtcbiAgfVxuXG4gIGlmICh0eXBlID09PSAnZXhwcmVzc2lvbicpIHtcbiAgICAvLyBidWlsZCBzdWJleHByZXNzaW9uc1xuICAgIHJldHVybiBtYXliZUFyZ0tleShhcmdLZXksIGB7JHtnZXRFeHByZXNzaW9uKGFyZy5jaGFpbiwgbGV2ZWwgKyAxKX19YCk7XG4gIH1cblxuICAvLyB1bmtub3duIHR5cGUsIHRocm93IHdpdGggdHlwZSB2YWx1ZVxuICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYXJndW1lbnQgdHlwZSBpbiBBU1Q6ICR7dHlwZX1gKTtcbn1cblxuZnVuY3Rpb24gZ2V0RXhwcmVzc2lvbkFyZ3MoYmxvY2ssIGxldmVsID0gMCkge1xuICBjb25zdCBhcmdzID0gYmxvY2suYXJndW1lbnRzO1xuICBjb25zdCBoYXNWYWxpZEFyZ3MgPSB0eXBlb2YgYXJncyA9PT0gJ29iamVjdCcgJiYgYXJncyAhPSBudWxsICYmICFBcnJheS5pc0FycmF5KGFyZ3MpO1xuXG4gIGlmICghaGFzVmFsaWRBcmdzKSB0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50cyBjYW4gb25seSBiZSBhbiBvYmplY3QnKTtcblxuICBjb25zdCBhcmdLZXlzID0gT2JqZWN0LmtleXMoYXJncyk7XG4gIGNvbnN0IE1BWF9MSU5FX0xFTkdUSCA9IDgwOyAvLyBsZW5ndGggYmVmb3JlIHdyYXBwaW5nIGFyZ3VtZW50c1xuICByZXR1cm4gYXJnS2V5cy5tYXAoYXJnS2V5ID0+XG4gICAgYXJnc1thcmdLZXldLnJlZHVjZSgoYWNjLCBhcmcpID0+IHtcbiAgICAgIGNvbnN0IGFyZ1N0cmluZyA9IGdldEFyZ3VtZW50U3RyaW5nKGFyZywgYXJnS2V5LCBsZXZlbCk7XG4gICAgICBjb25zdCBsaW5lTGVuZ3RoID0gYWNjLnNwbGl0KCdcXG4nKS5wb3AoKS5sZW5ndGg7XG5cbiAgICAgIC8vIGlmIGFyZyB2YWx1ZXMgYXJlIHRvbyBsb25nLCBtb3ZlIGl0IHRvIHRoZSBuZXh0IGxpbmVcbiAgICAgIGlmIChsZXZlbCA9PT0gMCAmJiBsaW5lTGVuZ3RoICsgYXJnU3RyaW5nLmxlbmd0aCA+IE1BWF9MSU5FX0xFTkdUSCkge1xuICAgICAgICByZXR1cm4gYCR7YWNjfVxcbiAgJHthcmdTdHJpbmd9YDtcbiAgICAgIH1cblxuICAgICAgLy8gYXBwZW5kIGFyZyB2YWx1ZXMgdG8gZXhpc3RpbmcgYXJnIHZhbHVlc1xuICAgICAgaWYgKGxpbmVMZW5ndGggPiAwKSByZXR1cm4gYCR7YWNjfSAke2FyZ1N0cmluZ31gO1xuXG4gICAgICAvLyBzdGFydCB0aGUgYWNjdW11bGF0b3Igd2l0aCB0aGUgZmlyc3QgYXJnIHZhbHVlXG4gICAgICByZXR1cm4gYXJnU3RyaW5nO1xuICAgIH0sICcnKVxuICApO1xufVxuXG5mdW5jdGlvbiBmbldpdGhBcmdzKGZuTmFtZSwgYXJncykge1xuICBpZiAoIWFyZ3MgfHwgYXJncy5sZW5ndGggPT09IDApIHJldHVybiBmbk5hbWU7XG4gIHJldHVybiBgJHtmbk5hbWV9ICR7YXJncy5qb2luKCcgJyl9YDtcbn1cblxuZnVuY3Rpb24gZ2V0RXhwcmVzc2lvbihjaGFpbiwgbGV2ZWwgPSAwKSB7XG4gIGlmICghY2hhaW4pIHRocm93IG5ldyBFcnJvcignRXhwcmVzc2lvbnMgbXVzdCBjb250YWluIGEgY2hhaW4nKTtcblxuICAvLyBicmVhayBuZXcgZnVuY3Rpb25zIG9udG8gbmV3IGxpbmVzIGlmIHdlJ3JlIG5vdCBpbiBhIG5lc3RlZC9zdWItZXhwcmVzc2lvblxuICBjb25zdCBzZXBhcmF0b3IgPSBsZXZlbCA+IDAgPyAnIHwgJyA6ICdcXG58ICc7XG5cbiAgcmV0dXJuIGNoYWluXG4gICAgLm1hcChjaGFpbk9iaiA9PiB7XG4gICAgICBjb25zdCB0eXBlID0gZ2V0VHlwZShjaGFpbk9iaik7XG5cbiAgICAgIGlmICh0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IGZuID0gY2hhaW5PYmouZnVuY3Rpb247XG4gICAgICAgIGlmICghZm4gfHwgZm4ubGVuZ3RoID09PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ0Z1bmN0aW9ucyBtdXN0IGhhdmUgYSBmdW5jdGlvbiBuYW1lJyk7XG5cbiAgICAgICAgY29uc3QgZXhwQXJncyA9IGdldEV4cHJlc3Npb25BcmdzKGNoYWluT2JqLCBsZXZlbCk7XG5cbiAgICAgICAgcmV0dXJuIGZuV2l0aEFyZ3MoZm4sIGV4cEFyZ3MpO1xuICAgICAgfVxuICAgIH0sIFtdKVxuICAgIC5qb2luKHNlcGFyYXRvcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXhwcmVzc2lvbihleHByZXNzaW9uLCB0eXBlID0gJ2V4cHJlc3Npb24nKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHBhcnNlKFN0cmluZyhleHByZXNzaW9uKSwgeyBzdGFydFJ1bGU6IHR5cGUgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBwYXJzZSBleHByZXNzaW9uOiAke2UubWVzc2FnZX1gKTtcbiAgfVxufVxuXG4vLyBUT0RPOiBPTUcgVGhpcyBpcyBzbyBiYWQsIHdlIG5lZWQgdG8gdGFsayBhYm91dCB0aGUgcmlnaHQgd2F5IHRvIGhhbmRsZSBiYWQgZXhwcmVzc2lvbnMgc2luY2Ugc29tZSBhcmUgZWxlbWVudCBiYXNlZCBhbmQgb3RoZXJzIG5vdFxuZXhwb3J0IGZ1bmN0aW9uIHNhZmVFbGVtZW50RnJvbUV4cHJlc3Npb24oZXhwcmVzc2lvbikge1xuICB0cnkge1xuICAgIHJldHVybiBmcm9tRXhwcmVzc2lvbihleHByZXNzaW9uKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmcm9tRXhwcmVzc2lvbihcbiAgICAgIGBtYXJrZG93blxuXCIjIyBDcnVkLlxuQ2FudmFzIGNvdWxkIG5vdCBwYXJzZSB0aGlzIGVsZW1lbnQncyBleHByZXNzaW9uLiBJIGFtIHNvIHNvcnJ5IHRoaXMgZXJyb3IgaXNuJ3QgbW9yZSB1c2VmdWwuIEkgcHJvbWlzZSBpdCB3aWxsIGJlIHNvb24uXG5cblRoYW5rcyBmb3IgdW5kZXJzdGFuZGluZyxcbiMjIyMgTWFuYWdlbWVudFxuXCJgXG4gICAgKTtcbiAgfVxufVxuXG4vLyBUT0RPOiBSZXNwZWN0IHRoZSB1c2VyJ3MgZXhpc3RpbmcgZm9ybWF0dGluZ1xuZXhwb3J0IGZ1bmN0aW9uIHRvRXhwcmVzc2lvbihhc3RPYmosIHR5cGUgPSAnZXhwcmVzc2lvbicpIHtcbiAgaWYgKHR5cGUgPT09ICdhcmd1bWVudCcpIHJldHVybiBnZXRBcmd1bWVudFN0cmluZyhhc3RPYmopO1xuXG4gIGNvbnN0IHZhbGlkVHlwZSA9IFsnZXhwcmVzc2lvbicsICdmdW5jdGlvbiddLmluY2x1ZGVzKGdldFR5cGUoYXN0T2JqKSk7XG4gIGlmICghdmFsaWRUeXBlKSB0aHJvdyBuZXcgRXJyb3IoJ0V4cHJlc3Npb24gbXVzdCBiZSBhbiBleHByZXNzaW9uIG9yIGFyZ3VtZW50IGZ1bmN0aW9uJyk7XG5cbiAgaWYgKGdldFR5cGUoYXN0T2JqKSA9PT0gJ2V4cHJlc3Npb24nKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFzdE9iai5jaGFpbikpIHRocm93IG5ldyBFcnJvcignRXhwcmVzc2lvbnMgbXVzdCBjb250YWluIGEgY2hhaW4nKTtcblxuICAgIHJldHVybiBnZXRFeHByZXNzaW9uKGFzdE9iai5jaGFpbik7XG4gIH1cblxuICBjb25zdCBleHBBcmdzID0gZ2V0RXhwcmVzc2lvbkFyZ3MoYXN0T2JqKTtcbiAgcmV0dXJuIGZuV2l0aEFyZ3MoYXN0T2JqLmZ1bmN0aW9uLCBleHBBcmdzKTtcbn1cbiJdfQ==