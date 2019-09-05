"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../service/lib/errors");
const base64_1 = require("./base64");
/**
 * Decode the "opaque" version string to the sequence params we
 * can use to activate optimistic concurrency in Elasticsearch
 */
function decodeVersion(version) {
    try {
        if (typeof version !== 'string') {
            throw new TypeError();
        }
        const seqParams = JSON.parse(base64_1.decodeBase64(version));
        if (!Array.isArray(seqParams) ||
            seqParams.length !== 2 ||
            !Number.isInteger(seqParams[0]) ||
            !Number.isInteger(seqParams[1])) {
            throw new TypeError();
        }
        return {
            _seq_no: seqParams[0],
            _primary_term: seqParams[1],
        };
    }
    catch (_) {
        throw errors_1.createInvalidVersionError(version);
    }
}
exports.decodeVersion = decodeVersion;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3NlcnZlci9zYXZlZF9vYmplY3RzL3ZlcnNpb24vZGVjb2RlX3ZlcnNpb24udHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9zZXJ2ZXIvc2F2ZWRfb2JqZWN0cy92ZXJzaW9uL2RlY29kZV92ZXJzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBRUgsa0RBQWtFO0FBQ2xFLHFDQUF3QztBQUV4Qzs7O0dBR0c7QUFDSCxTQUFnQixhQUFhLENBQUMsT0FBZ0I7SUFDNUMsSUFBSTtRQUNGLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQy9CLE1BQU0sSUFBSSxTQUFTLEVBQUUsQ0FBQztTQUN2QjtRQUVELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQVksQ0FBQyxPQUFPLENBQUMsQ0FBcUIsQ0FBQztRQUV4RSxJQUNFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDekIsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQ3RCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUMvQjtZQUNBLE1BQU0sSUFBSSxTQUFTLEVBQUUsQ0FBQztTQUN2QjtRQUVELE9BQU87WUFDTCxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNyQixhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUM1QixDQUFDO0tBQ0g7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE1BQU0sa0NBQXlCLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDMUM7QUFDSCxDQUFDO0FBeEJELHNDQXdCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBjcmVhdGVJbnZhbGlkVmVyc2lvbkVycm9yIH0gZnJvbSAnLi4vc2VydmljZS9saWIvZXJyb3JzJztcbmltcG9ydCB7IGRlY29kZUJhc2U2NCB9IGZyb20gJy4vYmFzZTY0JztcblxuLyoqXG4gKiBEZWNvZGUgdGhlIFwib3BhcXVlXCIgdmVyc2lvbiBzdHJpbmcgdG8gdGhlIHNlcXVlbmNlIHBhcmFtcyB3ZVxuICogY2FuIHVzZSB0byBhY3RpdmF0ZSBvcHRpbWlzdGljIGNvbmN1cnJlbmN5IGluIEVsYXN0aWNzZWFyY2hcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZVZlcnNpb24odmVyc2lvbj86IHN0cmluZykge1xuICB0cnkge1xuICAgIGlmICh0eXBlb2YgdmVyc2lvbiAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICB9XG5cbiAgICBjb25zdCBzZXFQYXJhbXMgPSBKU09OLnBhcnNlKGRlY29kZUJhc2U2NCh2ZXJzaW9uKSkgYXMgW251bWJlciwgbnVtYmVyXTtcblxuICAgIGlmIChcbiAgICAgICFBcnJheS5pc0FycmF5KHNlcVBhcmFtcykgfHxcbiAgICAgIHNlcVBhcmFtcy5sZW5ndGggIT09IDIgfHxcbiAgICAgICFOdW1iZXIuaXNJbnRlZ2VyKHNlcVBhcmFtc1swXSkgfHxcbiAgICAgICFOdW1iZXIuaXNJbnRlZ2VyKHNlcVBhcmFtc1sxXSlcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgX3NlcV9ubzogc2VxUGFyYW1zWzBdLFxuICAgICAgX3ByaW1hcnlfdGVybTogc2VxUGFyYW1zWzFdLFxuICAgIH07XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICB0aHJvdyBjcmVhdGVJbnZhbGlkVmVyc2lvbkVycm9yKHZlcnNpb24pO1xuICB9XG59XG4iXX0=