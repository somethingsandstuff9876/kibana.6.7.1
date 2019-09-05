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

var error = exports.error = function error() {
  return {
    name: 'error',
    to: {
      render: function render(input) {
        var error = input.error,
            info = input.info;

        return {
          type: 'render',
          as: 'error',
          value: {
            error: error,
            info: info
          }
        };
      }
    }
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW4vdHlwZXMvZXJyb3IuanMiXSwibmFtZXMiOlsiZXJyb3IiLCJuYW1lIiwidG8iLCJyZW5kZXIiLCJpbnB1dCIsImluZm8iLCJ0eXBlIiwiYXMiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CTyxJQUFNQSx3QkFBUSxTQUFSQSxLQUFRO0FBQUEsU0FBTztBQUMxQkMsVUFBTSxPQURvQjtBQUUxQkMsUUFBSTtBQUNGQyxjQUFRLHVCQUFTO0FBQUEsWUFDUEgsS0FETyxHQUNTSSxLQURULENBQ1BKLEtBRE87QUFBQSxZQUNBSyxJQURBLEdBQ1NELEtBRFQsQ0FDQUMsSUFEQTs7QUFFZixlQUFPO0FBQ0xDLGdCQUFNLFFBREQ7QUFFTEMsY0FBSSxPQUZDO0FBR0xDLGlCQUFPO0FBQ0xSLHdCQURLO0FBRUxLO0FBRks7QUFIRixTQUFQO0FBUUQ7QUFYQztBQUZzQixHQUFQO0FBQUEsQ0FBZCIsImZpbGUiOiJlcnJvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY29uc3QgZXJyb3IgPSAoKSA9PiAoe1xuICBuYW1lOiAnZXJyb3InLFxuICB0bzoge1xuICAgIHJlbmRlcjogaW5wdXQgPT4ge1xuICAgICAgY29uc3QgeyBlcnJvciwgaW5mbyB9ID0gaW5wdXQ7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAncmVuZGVyJyxcbiAgICAgICAgYXM6ICdlcnJvcicsXG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgaW5mbyxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbn0pO1xuIl19