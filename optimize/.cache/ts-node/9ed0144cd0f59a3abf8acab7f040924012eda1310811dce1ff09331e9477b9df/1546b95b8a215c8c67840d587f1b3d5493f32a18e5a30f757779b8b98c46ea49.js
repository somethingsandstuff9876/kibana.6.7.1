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
const tslib_1 = require("tslib");
/*
 * This file contains logic to build the index mappings for a migration.
 */
const lodash_1 = tslib_1.__importDefault(require("lodash"));
/**
 * Creates an index mapping with the core properties required by saved object
 * indices, as well as the specified additional properties.
 *
 * @param {Opts} opts
 * @prop {MappingDefinition} properties - The mapping's properties
 * @returns {IndexMapping}
 */
function buildActiveMappings({ properties, }) {
    const mapping = defaultMapping();
    return lodash_1.default.cloneDeep({
        doc: {
            ...mapping.doc,
            properties: validateAndMerge(mapping.doc.properties, properties),
        },
    });
}
exports.buildActiveMappings = buildActiveMappings;
/**
 * These mappings are required for any saved object index.
 *
 * @returns {IndexMapping}
 */
function defaultMapping() {
    return {
        doc: {
            dynamic: 'strict',
            properties: {
                config: {
                    dynamic: 'true',
                    properties: {
                        buildNum: {
                            type: 'keyword',
                        },
                    },
                },
                migrationVersion: {
                    dynamic: 'true',
                    type: 'object',
                },
                type: {
                    type: 'keyword',
                },
                namespace: {
                    type: 'keyword',
                },
                updated_at: {
                    type: 'date',
                },
            },
        },
    };
}
function validateAndMerge(dest, source) {
    Object.keys(source).forEach(k => {
        if (k.startsWith('_')) {
            throw new Error(`Invalid mapping "${k}". Mappings cannot start with _.`);
        }
        if (dest.hasOwnProperty(k)) {
            throw new Error(`Cannot redefine core mapping "${k}".`);
        }
    });
    return Object.assign(dest, source);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3NlcnZlci9zYXZlZF9vYmplY3RzL21pZ3JhdGlvbnMvY29yZS9idWlsZF9hY3RpdmVfbWFwcGluZ3MudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9zZXJ2ZXIvc2F2ZWRfb2JqZWN0cy9taWdyYXRpb25zL2NvcmUvYnVpbGRfYWN0aXZlX21hcHBpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7OztBQUVIOztHQUVHO0FBRUgsNERBQXVCO0FBR3ZCOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQixtQkFBbUIsQ0FBQyxFQUNsQyxVQUFVLEdBR1g7SUFDQyxNQUFNLE9BQU8sR0FBRyxjQUFjLEVBQUUsQ0FBQztJQUNqQyxPQUFPLGdCQUFDLENBQUMsU0FBUyxDQUFDO1FBQ2pCLEdBQUcsRUFBRTtZQUNILEdBQUcsT0FBTyxDQUFDLEdBQUc7WUFDZCxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO1NBQ2pFO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVpELGtEQVlDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsY0FBYztJQUNyQixPQUFPO1FBQ0wsR0FBRyxFQUFFO1lBQ0gsT0FBTyxFQUFFLFFBQVE7WUFDakIsVUFBVSxFQUFFO2dCQUNWLE1BQU0sRUFBRTtvQkFDTixPQUFPLEVBQUUsTUFBTTtvQkFDZixVQUFVLEVBQUU7d0JBQ1YsUUFBUSxFQUFFOzRCQUNSLElBQUksRUFBRSxTQUFTO3lCQUNoQjtxQkFDRjtpQkFDRjtnQkFDRCxnQkFBZ0IsRUFBRTtvQkFDaEIsT0FBTyxFQUFFLE1BQU07b0JBQ2YsSUFBSSxFQUFFLFFBQVE7aUJBQ2Y7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxTQUFTO2lCQUNoQjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFNBQVM7aUJBQ2hCO2dCQUNELFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsTUFBTTtpQkFDYjthQUNGO1NBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsSUFBdUIsRUFBRSxNQUF5QjtJQUMxRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUM5QixJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1NBQzFFO1FBRUQsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekQ7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIGxvZ2ljIHRvIGJ1aWxkIHRoZSBpbmRleCBtYXBwaW5ncyBmb3IgYSBtaWdyYXRpb24uXG4gKi9cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IEluZGV4TWFwcGluZywgTWFwcGluZ1Byb3BlcnRpZXMgfSBmcm9tICcuL2NhbGxfY2x1c3Rlcic7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBpbmRleCBtYXBwaW5nIHdpdGggdGhlIGNvcmUgcHJvcGVydGllcyByZXF1aXJlZCBieSBzYXZlZCBvYmplY3RcbiAqIGluZGljZXMsIGFzIHdlbGwgYXMgdGhlIHNwZWNpZmllZCBhZGRpdGlvbmFsIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPcHRzfSBvcHRzXG4gKiBAcHJvcCB7TWFwcGluZ0RlZmluaXRpb259IHByb3BlcnRpZXMgLSBUaGUgbWFwcGluZydzIHByb3BlcnRpZXNcbiAqIEByZXR1cm5zIHtJbmRleE1hcHBpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEFjdGl2ZU1hcHBpbmdzKHtcbiAgcHJvcGVydGllcyxcbn06IHtcbiAgcHJvcGVydGllczogTWFwcGluZ1Byb3BlcnRpZXM7XG59KTogSW5kZXhNYXBwaW5nIHtcbiAgY29uc3QgbWFwcGluZyA9IGRlZmF1bHRNYXBwaW5nKCk7XG4gIHJldHVybiBfLmNsb25lRGVlcCh7XG4gICAgZG9jOiB7XG4gICAgICAuLi5tYXBwaW5nLmRvYyxcbiAgICAgIHByb3BlcnRpZXM6IHZhbGlkYXRlQW5kTWVyZ2UobWFwcGluZy5kb2MucHJvcGVydGllcywgcHJvcGVydGllcyksXG4gICAgfSxcbiAgfSk7XG59XG5cbi8qKlxuICogVGhlc2UgbWFwcGluZ3MgYXJlIHJlcXVpcmVkIGZvciBhbnkgc2F2ZWQgb2JqZWN0IGluZGV4LlxuICpcbiAqIEByZXR1cm5zIHtJbmRleE1hcHBpbmd9XG4gKi9cbmZ1bmN0aW9uIGRlZmF1bHRNYXBwaW5nKCk6IEluZGV4TWFwcGluZyB7XG4gIHJldHVybiB7XG4gICAgZG9jOiB7XG4gICAgICBkeW5hbWljOiAnc3RyaWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgZHluYW1pYzogJ3RydWUnLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIGJ1aWxkTnVtOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdrZXl3b3JkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgbWlncmF0aW9uVmVyc2lvbjoge1xuICAgICAgICAgIGR5bmFtaWM6ICd0cnVlJyxcbiAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgfSxcbiAgICAgICAgdHlwZToge1xuICAgICAgICAgIHR5cGU6ICdrZXl3b3JkJyxcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZXNwYWNlOiB7XG4gICAgICAgICAgdHlwZTogJ2tleXdvcmQnLFxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVkX2F0OiB7XG4gICAgICAgICAgdHlwZTogJ2RhdGUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUFuZE1lcmdlKGRlc3Q6IE1hcHBpbmdQcm9wZXJ0aWVzLCBzb3VyY2U6IE1hcHBpbmdQcm9wZXJ0aWVzKSB7XG4gIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChrID0+IHtcbiAgICBpZiAoay5zdGFydHNXaXRoKCdfJykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtYXBwaW5nIFwiJHtrfVwiLiBNYXBwaW5ncyBjYW5ub3Qgc3RhcnQgd2l0aCBfLmApO1xuICAgIH1cblxuICAgIGlmIChkZXN0Lmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZWRlZmluZSBjb3JlIG1hcHBpbmcgXCIke2t9XCIuYCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbihkZXN0LCBzb3VyY2UpO1xufVxuIl19