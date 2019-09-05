'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registries = undefined;

var _types = require('../plugin/types');

var _common = require('../common');

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

var registries = exports.registries = {
  types: new _common.TypesRegistry(),
  serverFunctions: new _common.FunctionsRegistry()
};

(0, _common.register)(registries, {
  types: _types.typeSpecs
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvaW5kZXguanMiXSwibmFtZXMiOlsicmVnaXN0cmllcyIsInR5cGVzIiwic2VydmVyRnVuY3Rpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBbUJBOztBQUNBOztBQXBCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCTyxJQUFNQSxrQ0FBYTtBQUN4QkMsU0FBTywyQkFEaUI7QUFFeEJDLG1CQUFpQjtBQUZPLENBQW5COztBQUtQLHNCQUFTRixVQUFULEVBQXFCO0FBQ25CQztBQURtQixDQUFyQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyB0eXBlU3BlY3MgYXMgdHlwZXMgfSBmcm9tICcuLi9wbHVnaW4vdHlwZXMnO1xuaW1wb3J0IHsgcmVnaXN0ZXIsIFR5cGVzUmVnaXN0cnksIEZ1bmN0aW9uc1JlZ2lzdHJ5IH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IHJlZ2lzdHJpZXMgPSB7XG4gIHR5cGVzOiBuZXcgVHlwZXNSZWdpc3RyeSgpLFxuICBzZXJ2ZXJGdW5jdGlvbnM6IG5ldyBGdW5jdGlvbnNSZWdpc3RyeSgpLFxufTtcblxucmVnaXN0ZXIocmVnaXN0cmllcywge1xuICB0eXBlcyxcbn0pO1xuIl19