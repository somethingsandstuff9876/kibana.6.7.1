'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Registry = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash.clone');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Registry = exports.Registry = function () {
  function Registry() {
    var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'name';
    (0, _classCallCheck3.default)(this, Registry);

    if (typeof prop !== 'string') throw new Error('Registry property name must be a string');
    this._prop = prop;
    this._indexed = new Object();
  }

  (0, _createClass3.default)(Registry, [{
    key: 'wrapper',
    value: function wrapper(obj) {
      return obj;
    }
  }, {
    key: 'register',
    value: function register(fn) {
      if (typeof fn !== 'function') throw new Error('Register requires an function');

      var obj = fn();

      if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object' || !obj[this._prop]) {
        throw new Error('Registered functions must return an object with a ' + this._prop + ' property');
      }

      this._indexed[obj[this._prop].toLowerCase()] = this.wrapper(obj);
    }
  }, {
    key: 'toJS',
    value: function toJS() {
      var _this = this;

      return Object.keys(this._indexed).reduce(function (acc, key) {
        acc[key] = _this.get(key);
        return acc;
      }, {});
    }
  }, {
    key: 'toArray',
    value: function toArray() {
      var _this2 = this;

      return Object.keys(this._indexed).map(function (key) {
        return _this2.get(key);
      });
    }
  }, {
    key: 'get',
    value: function get(name) {
      if (name === undefined) return null;
      var lowerCaseName = name.toLowerCase();
      return this._indexed[lowerCaseName] ? (0, _lodash2.default)(this._indexed[lowerCaseName]) : null;
    }
  }, {
    key: 'getProp',
    value: function getProp() {
      return this._prop;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this._indexed = new Object();
    }
  }]);
  return Registry;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vbGliL3JlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbIlJlZ2lzdHJ5IiwicHJvcCIsIkVycm9yIiwiX3Byb3AiLCJfaW5kZXhlZCIsIk9iamVjdCIsIm9iaiIsImZuIiwidG9Mb3dlckNhc2UiLCJ3cmFwcGVyIiwia2V5cyIsInJlZHVjZSIsImFjYyIsImtleSIsImdldCIsIm1hcCIsIm5hbWUiLCJ1bmRlZmluZWQiLCJsb3dlckNhc2VOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBOzs7Ozs7SUFFYUEsUSxXQUFBQSxRO0FBQ1gsc0JBQTJCO0FBQUEsUUFBZkMsSUFBZSx1RUFBUixNQUFRO0FBQUE7O0FBQ3pCLFFBQUksT0FBT0EsSUFBUCxLQUFnQixRQUFwQixFQUE4QixNQUFNLElBQUlDLEtBQUosQ0FBVSx5Q0FBVixDQUFOO0FBQzlCLFNBQUtDLEtBQUwsR0FBYUYsSUFBYjtBQUNBLFNBQUtHLFFBQUwsR0FBZ0IsSUFBSUMsTUFBSixFQUFoQjtBQUNEOzs7OzRCQUVPQyxHLEVBQUs7QUFDWCxhQUFPQSxHQUFQO0FBQ0Q7Ozs2QkFFUUMsRSxFQUFJO0FBQ1gsVUFBSSxPQUFPQSxFQUFQLEtBQWMsVUFBbEIsRUFBOEIsTUFBTSxJQUFJTCxLQUFKLGlDQUFOOztBQUU5QixVQUFNSSxNQUFNQyxJQUFaOztBQUVBLFVBQUksUUFBT0QsR0FBUCx1REFBT0EsR0FBUCxPQUFlLFFBQWYsSUFBMkIsQ0FBQ0EsSUFBSSxLQUFLSCxLQUFULENBQWhDLEVBQWlEO0FBQy9DLGNBQU0sSUFBSUQsS0FBSix3REFBK0QsS0FBS0MsS0FBcEUsZUFBTjtBQUNEOztBQUVELFdBQUtDLFFBQUwsQ0FBY0UsSUFBSSxLQUFLSCxLQUFULEVBQWdCSyxXQUFoQixFQUFkLElBQStDLEtBQUtDLE9BQUwsQ0FBYUgsR0FBYixDQUEvQztBQUNEOzs7MkJBRU07QUFBQTs7QUFDTCxhQUFPRCxPQUFPSyxJQUFQLENBQVksS0FBS04sUUFBakIsRUFBMkJPLE1BQTNCLENBQWtDLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ3JERCxZQUFJQyxHQUFKLElBQVcsTUFBS0MsR0FBTCxDQUFTRCxHQUFULENBQVg7QUFDQSxlQUFPRCxHQUFQO0FBQ0QsT0FITSxFQUdKLEVBSEksQ0FBUDtBQUlEOzs7OEJBRVM7QUFBQTs7QUFDUixhQUFPUCxPQUFPSyxJQUFQLENBQVksS0FBS04sUUFBakIsRUFBMkJXLEdBQTNCLENBQStCO0FBQUEsZUFBTyxPQUFLRCxHQUFMLENBQVNELEdBQVQsQ0FBUDtBQUFBLE9BQS9CLENBQVA7QUFDRDs7O3dCQUVHRyxJLEVBQU07QUFDUixVQUFJQSxTQUFTQyxTQUFiLEVBQXdCLE9BQU8sSUFBUDtBQUN4QixVQUFNQyxnQkFBZ0JGLEtBQUtSLFdBQUwsRUFBdEI7QUFDQSxhQUFPLEtBQUtKLFFBQUwsQ0FBY2MsYUFBZCxJQUErQixzQkFBTSxLQUFLZCxRQUFMLENBQWNjLGFBQWQsQ0FBTixDQUEvQixHQUFxRSxJQUE1RTtBQUNEOzs7OEJBRVM7QUFDUixhQUFPLEtBQUtmLEtBQVo7QUFDRDs7OzRCQUVPO0FBQ04sV0FBS0MsUUFBTCxHQUFnQixJQUFJQyxNQUFKLEVBQWhCO0FBQ0Q7OztLQW5FSCIsImZpbGUiOiJyZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgY2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lJztcblxuZXhwb3J0IGNsYXNzIFJlZ2lzdHJ5IHtcbiAgY29uc3RydWN0b3IocHJvcCA9ICduYW1lJykge1xuICAgIGlmICh0eXBlb2YgcHJvcCAhPT0gJ3N0cmluZycpIHRocm93IG5ldyBFcnJvcignUmVnaXN0cnkgcHJvcGVydHkgbmFtZSBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gICAgdGhpcy5fcHJvcCA9IHByb3A7XG4gICAgdGhpcy5faW5kZXhlZCA9IG5ldyBPYmplY3QoKTtcbiAgfVxuXG4gIHdyYXBwZXIob2JqKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHJlZ2lzdGVyKGZuKSB7XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IEVycm9yKGBSZWdpc3RlciByZXF1aXJlcyBhbiBmdW5jdGlvbmApO1xuXG4gICAgY29uc3Qgb2JqID0gZm4oKTtcblxuICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCAhb2JqW3RoaXMuX3Byb3BdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlZ2lzdGVyZWQgZnVuY3Rpb25zIG11c3QgcmV0dXJuIGFuIG9iamVjdCB3aXRoIGEgJHt0aGlzLl9wcm9wfSBwcm9wZXJ0eWApO1xuICAgIH1cblxuICAgIHRoaXMuX2luZGV4ZWRbb2JqW3RoaXMuX3Byb3BdLnRvTG93ZXJDYXNlKCldID0gdGhpcy53cmFwcGVyKG9iaik7XG4gIH1cblxuICB0b0pTKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9pbmRleGVkKS5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICBhY2Nba2V5XSA9IHRoaXMuZ2V0KGtleSk7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX2luZGV4ZWQpLm1hcChrZXkgPT4gdGhpcy5nZXQoa2V5KSk7XG4gIH1cblxuICBnZXQobmFtZSkge1xuICAgIGlmIChuYW1lID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IGxvd2VyQ2FzZU5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIHRoaXMuX2luZGV4ZWRbbG93ZXJDYXNlTmFtZV0gPyBjbG9uZSh0aGlzLl9pbmRleGVkW2xvd2VyQ2FzZU5hbWVdKSA6IG51bGw7XG4gIH1cblxuICBnZXRQcm9wKCkge1xuICAgIHJldHVybiB0aGlzLl9wcm9wO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5faW5kZXhlZCA9IG5ldyBPYmplY3QoKTtcbiAgfVxufVxuIl19