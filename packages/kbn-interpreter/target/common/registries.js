"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addRegistries = addRegistries;
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

/**
 * Add a new set of registries to an existing set of registries.
 *
 * @param {*} registries - The existing set of registries
 * @param {*} newRegistries - The new set of registries
 */
function addRegistries(registries, newRegistries) {
  Object.keys(newRegistries).forEach(function (registryName) {
    if (registries[registryName]) {
      throw new Error("There is already a registry named \"" + registryName + "\".");
    }
    registries[registryName] = newRegistries[registryName];
  });

  return registries;
}

/**
 * Register a set of interpreter specs (functions, types, renderers, etc)
 *
 * @param {*} registries - The set of registries
 * @param {*} specs - The specs to be regsitered (e.g. { types: [], browserFunctions: [] })
 */
function _register(registries, specs) {
  Object.keys(specs).forEach(function (registryName) {
    if (!registries[registryName]) {
      throw new Error("There is no registry named \"" + registryName + "\".");
    }

    if (!registries[registryName].register) {
      throw new Error("Registry \"" + registryName + "\" must have a register function.");
    }
    specs[registryName].forEach(function (f) {
      return registries[registryName].register(f);
    });
  });

  return registries;
}

/**
 * A convenience function for exposing registries and register in a plugin-friendly way
 * as a global in the browser, and as server.plugins.interpreter.register | registries
 * on the server.
 *
 * @param {*} registries - The registries to wrap.
 */
exports.register = _register;
function registryFactory(_registries) {
  return {
    // This is a getter function. We can't make it a property or a proper
    // getter, because Kibana server will improperly clone it.
    registries: function registries() {
      return _registries;
    },
    register: function register(specs) {
      return _register(_registries, specs);
    }
  };
}
exports.registryFactory = registryFactory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tb24vcmVnaXN0cmllcy5qcyJdLCJuYW1lcyI6WyJhZGRSZWdpc3RyaWVzIiwicmVnaXN0cmllcyIsIm5ld1JlZ2lzdHJpZXMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsInJlZ2lzdHJ5TmFtZSIsIkVycm9yIiwicmVnaXN0ZXIiLCJzcGVjcyIsImYiLCJyZWdpc3RyeUZhY3RvcnkiXSwibWFwcGluZ3MiOiI7Ozs7O1FBMEJnQkEsYSxHQUFBQSxhO0FBMUJoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7Ozs7O0FBTU8sU0FBU0EsYUFBVCxDQUF1QkMsVUFBdkIsRUFBbUNDLGFBQW5DLEVBQWtEO0FBQ3ZEQyxTQUFPQyxJQUFQLENBQVlGLGFBQVosRUFBMkJHLE9BQTNCLENBQW1DLHdCQUFnQjtBQUNqRCxRQUFJSixXQUFXSyxZQUFYLENBQUosRUFBOEI7QUFDNUIsWUFBTSxJQUFJQyxLQUFKLDBDQUFnREQsWUFBaEQsU0FBTjtBQUNEO0FBQ0RMLGVBQVdLLFlBQVgsSUFBMkJKLGNBQWNJLFlBQWQsQ0FBM0I7QUFDRCxHQUxEOztBQU9BLFNBQU9MLFVBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBTU8sU0FBU08sU0FBVCxDQUFrQlAsVUFBbEIsRUFBOEJRLEtBQTlCLEVBQXFDO0FBQzFDTixTQUFPQyxJQUFQLENBQVlLLEtBQVosRUFBbUJKLE9BQW5CLENBQTJCLHdCQUFnQjtBQUN6QyxRQUFJLENBQUNKLFdBQVdLLFlBQVgsQ0FBTCxFQUErQjtBQUM3QixZQUFNLElBQUlDLEtBQUosbUNBQXlDRCxZQUF6QyxTQUFOO0FBQ0Q7O0FBRUQsUUFBSSxDQUFDTCxXQUFXSyxZQUFYLEVBQXlCRSxRQUE5QixFQUF3QztBQUN0QyxZQUFNLElBQUlELEtBQUosaUJBQXVCRCxZQUF2Qix1Q0FBTjtBQUNEO0FBQ0RHLFVBQU1ILFlBQU4sRUFBb0JELE9BQXBCLENBQTRCO0FBQUEsYUFBS0osV0FBV0ssWUFBWCxFQUF5QkUsUUFBekIsQ0FBa0NFLENBQWxDLENBQUw7QUFBQSxLQUE1QjtBQUNELEdBVEQ7O0FBV0EsU0FBT1QsVUFBUDtBQUNEOztBQUVEOzs7Ozs7OztBQU9PLFNBQVNVLGVBQVQsQ0FBeUJWLFdBQXpCLEVBQXFDO0FBQzFDLFNBQU87QUFDTDtBQUNBO0FBQ0FBLGNBSEssd0JBR1E7QUFDWCxhQUFPQSxXQUFQO0FBQ0QsS0FMSTtBQU9MTyxZQVBLLG9CQU9JQyxLQVBKLEVBT1c7QUFDZCxhQUFPRCxVQUFTUCxXQUFULEVBQXFCUSxLQUFyQixDQUFQO0FBQ0Q7QUFUSSxHQUFQO0FBV0QiLCJmaWxlIjoicmVnaXN0cmllcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5cbi8qKlxuICogQWRkIGEgbmV3IHNldCBvZiByZWdpc3RyaWVzIHRvIGFuIGV4aXN0aW5nIHNldCBvZiByZWdpc3RyaWVzLlxuICpcbiAqIEBwYXJhbSB7Kn0gcmVnaXN0cmllcyAtIFRoZSBleGlzdGluZyBzZXQgb2YgcmVnaXN0cmllc1xuICogQHBhcmFtIHsqfSBuZXdSZWdpc3RyaWVzIC0gVGhlIG5ldyBzZXQgb2YgcmVnaXN0cmllc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkUmVnaXN0cmllcyhyZWdpc3RyaWVzLCBuZXdSZWdpc3RyaWVzKSB7XG4gIE9iamVjdC5rZXlzKG5ld1JlZ2lzdHJpZXMpLmZvckVhY2gocmVnaXN0cnlOYW1lID0+IHtcbiAgICBpZiAocmVnaXN0cmllc1tyZWdpc3RyeU5hbWVdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIGlzIGFscmVhZHkgYSByZWdpc3RyeSBuYW1lZCBcIiR7cmVnaXN0cnlOYW1lfVwiLmApO1xuICAgIH1cbiAgICByZWdpc3RyaWVzW3JlZ2lzdHJ5TmFtZV0gPSBuZXdSZWdpc3RyaWVzW3JlZ2lzdHJ5TmFtZV07XG4gIH0pO1xuXG4gIHJldHVybiByZWdpc3RyaWVzO1xufVxuXG4vKipcbiAqIFJlZ2lzdGVyIGEgc2V0IG9mIGludGVycHJldGVyIHNwZWNzIChmdW5jdGlvbnMsIHR5cGVzLCByZW5kZXJlcnMsIGV0YylcbiAqXG4gKiBAcGFyYW0geyp9IHJlZ2lzdHJpZXMgLSBUaGUgc2V0IG9mIHJlZ2lzdHJpZXNcbiAqIEBwYXJhbSB7Kn0gc3BlY3MgLSBUaGUgc3BlY3MgdG8gYmUgcmVnc2l0ZXJlZCAoZS5nLiB7IHR5cGVzOiBbXSwgYnJvd3NlckZ1bmN0aW9uczogW10gfSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyKHJlZ2lzdHJpZXMsIHNwZWNzKSB7XG4gIE9iamVjdC5rZXlzKHNwZWNzKS5mb3JFYWNoKHJlZ2lzdHJ5TmFtZSA9PiB7XG4gICAgaWYgKCFyZWdpc3RyaWVzW3JlZ2lzdHJ5TmFtZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgaXMgbm8gcmVnaXN0cnkgbmFtZWQgXCIke3JlZ2lzdHJ5TmFtZX1cIi5gKTtcbiAgICB9XG5cbiAgICBpZiAoIXJlZ2lzdHJpZXNbcmVnaXN0cnlOYW1lXS5yZWdpc3Rlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZWdpc3RyeSBcIiR7cmVnaXN0cnlOYW1lfVwiIG11c3QgaGF2ZSBhIHJlZ2lzdGVyIGZ1bmN0aW9uLmApO1xuICAgIH1cbiAgICBzcGVjc1tyZWdpc3RyeU5hbWVdLmZvckVhY2goZiA9PiByZWdpc3RyaWVzW3JlZ2lzdHJ5TmFtZV0ucmVnaXN0ZXIoZikpO1xuICB9KTtcblxuICByZXR1cm4gcmVnaXN0cmllcztcbn1cblxuLyoqXG4gKiBBIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBleHBvc2luZyByZWdpc3RyaWVzIGFuZCByZWdpc3RlciBpbiBhIHBsdWdpbi1mcmllbmRseSB3YXlcbiAqIGFzIGEgZ2xvYmFsIGluIHRoZSBicm93c2VyLCBhbmQgYXMgc2VydmVyLnBsdWdpbnMuaW50ZXJwcmV0ZXIucmVnaXN0ZXIgfCByZWdpc3RyaWVzXG4gKiBvbiB0aGUgc2VydmVyLlxuICpcbiAqIEBwYXJhbSB7Kn0gcmVnaXN0cmllcyAtIFRoZSByZWdpc3RyaWVzIHRvIHdyYXAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RyeUZhY3RvcnkocmVnaXN0cmllcykge1xuICByZXR1cm4ge1xuICAgIC8vIFRoaXMgaXMgYSBnZXR0ZXIgZnVuY3Rpb24uIFdlIGNhbid0IG1ha2UgaXQgYSBwcm9wZXJ0eSBvciBhIHByb3BlclxuICAgIC8vIGdldHRlciwgYmVjYXVzZSBLaWJhbmEgc2VydmVyIHdpbGwgaW1wcm9wZXJseSBjbG9uZSBpdC5cbiAgICByZWdpc3RyaWVzKCkge1xuICAgICAgcmV0dXJuIHJlZ2lzdHJpZXM7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyKHNwZWNzKSB7XG4gICAgICByZXR1cm4gcmVnaXN0ZXIocmVnaXN0cmllcywgc3BlY3MpO1xuICAgIH0sXG4gIH07XG59XG4iXX0=