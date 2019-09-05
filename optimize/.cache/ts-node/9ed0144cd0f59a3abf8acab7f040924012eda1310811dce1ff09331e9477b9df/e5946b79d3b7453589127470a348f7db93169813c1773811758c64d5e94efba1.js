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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
var MigrationAction;
(function (MigrationAction) {
    MigrationAction[MigrationAction["None"] = 0] = "None";
    MigrationAction[MigrationAction["Patch"] = 1] = "Patch";
    MigrationAction[MigrationAction["Migrate"] = 2] = "Migrate";
})(MigrationAction = exports.MigrationAction || (exports.MigrationAction = {}));
/**
 * Provides logic that diffs the actual index mappings with the expected
 * mappings. It ignores differences in dynamic mappings.
 *
 * If mappings differ in a patchable way, the result is 'patch', if mappings
 * differ in a way that requires migration, the result is 'migrate', and if
 * the mappings are equivalent, the result is 'none'.
 */
function determineMigrationAction(actual, expected) {
    if (actual.doc.dynamic !== expected.doc.dynamic) {
        return MigrationAction.Migrate;
    }
    const actualProps = actual.doc.properties;
    const expectedProps = expected.doc.properties;
    // There's a special case for root-level properties: if a root property is in actual,
    // but not in expected, it is treated like a disabled plugin and requires no action.
    return Object.keys(expectedProps).reduce((acc, key) => {
        return Math.max(acc, diffSubProperty(actualProps[key], expectedProps[key]));
    }, MigrationAction.None);
}
exports.determineMigrationAction = determineMigrationAction;
function diffSubProperty(actual, expected) {
    // We've added a sub-property
    if (actual === undefined && expected !== undefined) {
        return MigrationAction.Patch;
    }
    // We've removed a sub property
    if (actual !== undefined && expected === undefined) {
        return MigrationAction.Migrate;
    }
    // If a property has changed to/from dynamic, we need to migrate,
    // otherwise, we ignore dynamic properties, as they can differ
    if (isDynamic(actual) || isDynamic(expected)) {
        return isDynamic(actual) !== isDynamic(expected)
            ? MigrationAction.Migrate
            : MigrationAction.None;
    }
    // We have a leaf property, so we do a comparison. A change (e.g. 'text' -> 'keyword')
    // should result in a migration.
    if (typeof actual !== 'object') {
        // We perform a string comparison here, because Elasticsearch coerces some primitives
        // to string (such as dynamic: true and dynamic: 'true'), so we report a mapping
        // equivalency if the string comparison checks out. This does mean that {} === '[object Object]'
        // by this logic, but that is an edge case which should not occur in mapping definitions.
        return `${actual}` === `${expected}` ? MigrationAction.None : MigrationAction.Migrate;
    }
    // Recursively compare the sub properties
    const keys = lodash_1.default.uniq(Object.keys(actual).concat(Object.keys(expected)));
    return keys.reduce((acc, key) => {
        return acc === MigrationAction.Migrate
            ? acc
            : Math.max(acc, diffSubProperty(actual[key], expected[key]));
    }, MigrationAction.None);
}
function isDynamic(prop) {
    return prop && `${prop.dynamic}` === 'true';
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3NlcnZlci9zYXZlZF9vYmplY3RzL21pZ3JhdGlvbnMvY29yZS9kZXRlcm1pbmVfbWlncmF0aW9uX2FjdGlvbi50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3NlcnZlci9zYXZlZF9vYmplY3RzL21pZ3JhdGlvbnMvY29yZS9kZXRlcm1pbmVfbWlncmF0aW9uX2FjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOzs7QUFFSCw0REFBdUI7QUFHdkIsSUFBWSxlQUlYO0FBSkQsV0FBWSxlQUFlO0lBQ3pCLHFEQUFRLENBQUE7SUFDUix1REFBUyxDQUFBO0lBQ1QsMkRBQVcsQ0FBQTtBQUNiLENBQUMsRUFKVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQUkxQjtBQUVEOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQix3QkFBd0IsQ0FDdEMsTUFBb0IsRUFDcEIsUUFBc0I7SUFFdEIsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTtRQUMvQyxPQUFPLGVBQWUsQ0FBQyxPQUFPLENBQUM7S0FDaEM7SUFFRCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztJQUMxQyxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztJQUU5QyxxRkFBcUY7SUFDckYsb0ZBQW9GO0lBQ3BGLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFXLEVBQUUsR0FBVyxFQUFFLEVBQUU7UUFDcEUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBaEJELDREQWdCQztBQUVELFNBQVMsZUFBZSxDQUFDLE1BQVcsRUFBRSxRQUFhO0lBQ2pELDZCQUE2QjtJQUM3QixJQUFJLE1BQU0sS0FBSyxTQUFTLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtRQUNsRCxPQUFPLGVBQWUsQ0FBQyxLQUFLLENBQUM7S0FDOUI7SUFFRCwrQkFBK0I7SUFDL0IsSUFBSSxNQUFNLEtBQUssU0FBUyxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7UUFDbEQsT0FBTyxlQUFlLENBQUMsT0FBTyxDQUFDO0tBQ2hDO0lBRUQsaUVBQWlFO0lBQ2pFLDhEQUE4RDtJQUM5RCxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDNUMsT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssU0FBUyxDQUFDLFFBQVEsQ0FBQztZQUM5QyxDQUFDLENBQUMsZUFBZSxDQUFDLE9BQU87WUFDekIsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7S0FDMUI7SUFFRCxzRkFBc0Y7SUFDdEYsZ0NBQWdDO0lBQ2hDLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO1FBQzlCLHFGQUFxRjtRQUNyRixnRkFBZ0Y7UUFDaEYsZ0dBQWdHO1FBQ2hHLHlGQUF5RjtRQUN6RixPQUFPLEdBQUcsTUFBTSxFQUFFLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQztLQUN2RjtJQUVELHlDQUF5QztJQUN6QyxNQUFNLElBQUksR0FBRyxnQkFBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFXLEVBQUUsR0FBVyxFQUFFLEVBQUU7UUFDOUMsT0FBTyxHQUFHLEtBQUssZUFBZSxDQUFDLE9BQU87WUFDcEMsQ0FBQyxDQUFDLEdBQUc7WUFDTCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUMsRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLElBQVM7SUFDMUIsT0FBTyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssTUFBTSxDQUFDO0FBQzlDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IEluZGV4TWFwcGluZyB9IGZyb20gJy4vY2FsbF9jbHVzdGVyJztcblxuZXhwb3J0IGVudW0gTWlncmF0aW9uQWN0aW9uIHtcbiAgTm9uZSA9IDAsXG4gIFBhdGNoID0gMSxcbiAgTWlncmF0ZSA9IDIsXG59XG5cbi8qKlxuICogUHJvdmlkZXMgbG9naWMgdGhhdCBkaWZmcyB0aGUgYWN0dWFsIGluZGV4IG1hcHBpbmdzIHdpdGggdGhlIGV4cGVjdGVkXG4gKiBtYXBwaW5ncy4gSXQgaWdub3JlcyBkaWZmZXJlbmNlcyBpbiBkeW5hbWljIG1hcHBpbmdzLlxuICpcbiAqIElmIG1hcHBpbmdzIGRpZmZlciBpbiBhIHBhdGNoYWJsZSB3YXksIHRoZSByZXN1bHQgaXMgJ3BhdGNoJywgaWYgbWFwcGluZ3NcbiAqIGRpZmZlciBpbiBhIHdheSB0aGF0IHJlcXVpcmVzIG1pZ3JhdGlvbiwgdGhlIHJlc3VsdCBpcyAnbWlncmF0ZScsIGFuZCBpZlxuICogdGhlIG1hcHBpbmdzIGFyZSBlcXVpdmFsZW50LCB0aGUgcmVzdWx0IGlzICdub25lJy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRldGVybWluZU1pZ3JhdGlvbkFjdGlvbihcbiAgYWN0dWFsOiBJbmRleE1hcHBpbmcsXG4gIGV4cGVjdGVkOiBJbmRleE1hcHBpbmdcbik6IE1pZ3JhdGlvbkFjdGlvbiB7XG4gIGlmIChhY3R1YWwuZG9jLmR5bmFtaWMgIT09IGV4cGVjdGVkLmRvYy5keW5hbWljKSB7XG4gICAgcmV0dXJuIE1pZ3JhdGlvbkFjdGlvbi5NaWdyYXRlO1xuICB9XG5cbiAgY29uc3QgYWN0dWFsUHJvcHMgPSBhY3R1YWwuZG9jLnByb3BlcnRpZXM7XG4gIGNvbnN0IGV4cGVjdGVkUHJvcHMgPSBleHBlY3RlZC5kb2MucHJvcGVydGllcztcblxuICAvLyBUaGVyZSdzIGEgc3BlY2lhbCBjYXNlIGZvciByb290LWxldmVsIHByb3BlcnRpZXM6IGlmIGEgcm9vdCBwcm9wZXJ0eSBpcyBpbiBhY3R1YWwsXG4gIC8vIGJ1dCBub3QgaW4gZXhwZWN0ZWQsIGl0IGlzIHRyZWF0ZWQgbGlrZSBhIGRpc2FibGVkIHBsdWdpbiBhbmQgcmVxdWlyZXMgbm8gYWN0aW9uLlxuICByZXR1cm4gT2JqZWN0LmtleXMoZXhwZWN0ZWRQcm9wcykucmVkdWNlKChhY2M6IG51bWJlciwga2V5OiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gTWF0aC5tYXgoYWNjLCBkaWZmU3ViUHJvcGVydHkoYWN0dWFsUHJvcHNba2V5XSwgZXhwZWN0ZWRQcm9wc1trZXldKSk7XG4gIH0sIE1pZ3JhdGlvbkFjdGlvbi5Ob25lKTtcbn1cblxuZnVuY3Rpb24gZGlmZlN1YlByb3BlcnR5KGFjdHVhbDogYW55LCBleHBlY3RlZDogYW55KTogTWlncmF0aW9uQWN0aW9uIHtcbiAgLy8gV2UndmUgYWRkZWQgYSBzdWItcHJvcGVydHlcbiAgaWYgKGFjdHVhbCA9PT0gdW5kZWZpbmVkICYmIGV4cGVjdGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gTWlncmF0aW9uQWN0aW9uLlBhdGNoO1xuICB9XG5cbiAgLy8gV2UndmUgcmVtb3ZlZCBhIHN1YiBwcm9wZXJ0eVxuICBpZiAoYWN0dWFsICE9PSB1bmRlZmluZWQgJiYgZXhwZWN0ZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBNaWdyYXRpb25BY3Rpb24uTWlncmF0ZTtcbiAgfVxuXG4gIC8vIElmIGEgcHJvcGVydHkgaGFzIGNoYW5nZWQgdG8vZnJvbSBkeW5hbWljLCB3ZSBuZWVkIHRvIG1pZ3JhdGUsXG4gIC8vIG90aGVyd2lzZSwgd2UgaWdub3JlIGR5bmFtaWMgcHJvcGVydGllcywgYXMgdGhleSBjYW4gZGlmZmVyXG4gIGlmIChpc0R5bmFtaWMoYWN0dWFsKSB8fCBpc0R5bmFtaWMoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGlzRHluYW1pYyhhY3R1YWwpICE9PSBpc0R5bmFtaWMoZXhwZWN0ZWQpXG4gICAgICA/IE1pZ3JhdGlvbkFjdGlvbi5NaWdyYXRlXG4gICAgICA6IE1pZ3JhdGlvbkFjdGlvbi5Ob25lO1xuICB9XG5cbiAgLy8gV2UgaGF2ZSBhIGxlYWYgcHJvcGVydHksIHNvIHdlIGRvIGEgY29tcGFyaXNvbi4gQSBjaGFuZ2UgKGUuZy4gJ3RleHQnIC0+ICdrZXl3b3JkJylcbiAgLy8gc2hvdWxkIHJlc3VsdCBpbiBhIG1pZ3JhdGlvbi5cbiAgaWYgKHR5cGVvZiBhY3R1YWwgIT09ICdvYmplY3QnKSB7XG4gICAgLy8gV2UgcGVyZm9ybSBhIHN0cmluZyBjb21wYXJpc29uIGhlcmUsIGJlY2F1c2UgRWxhc3RpY3NlYXJjaCBjb2VyY2VzIHNvbWUgcHJpbWl0aXZlc1xuICAgIC8vIHRvIHN0cmluZyAoc3VjaCBhcyBkeW5hbWljOiB0cnVlIGFuZCBkeW5hbWljOiAndHJ1ZScpLCBzbyB3ZSByZXBvcnQgYSBtYXBwaW5nXG4gICAgLy8gZXF1aXZhbGVuY3kgaWYgdGhlIHN0cmluZyBjb21wYXJpc29uIGNoZWNrcyBvdXQuIFRoaXMgZG9lcyBtZWFuIHRoYXQge30gPT09ICdbb2JqZWN0IE9iamVjdF0nXG4gICAgLy8gYnkgdGhpcyBsb2dpYywgYnV0IHRoYXQgaXMgYW4gZWRnZSBjYXNlIHdoaWNoIHNob3VsZCBub3Qgb2NjdXIgaW4gbWFwcGluZyBkZWZpbml0aW9ucy5cbiAgICByZXR1cm4gYCR7YWN0dWFsfWAgPT09IGAke2V4cGVjdGVkfWAgPyBNaWdyYXRpb25BY3Rpb24uTm9uZSA6IE1pZ3JhdGlvbkFjdGlvbi5NaWdyYXRlO1xuICB9XG5cbiAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSB0aGUgc3ViIHByb3BlcnRpZXNcbiAgY29uc3Qga2V5cyA9IF8udW5pcShPYmplY3Qua2V5cyhhY3R1YWwpLmNvbmNhdChPYmplY3Qua2V5cyhleHBlY3RlZCkpKTtcbiAgcmV0dXJuIGtleXMucmVkdWNlKChhY2M6IG51bWJlciwga2V5OiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gYWNjID09PSBNaWdyYXRpb25BY3Rpb24uTWlncmF0ZVxuICAgICAgPyBhY2NcbiAgICAgIDogTWF0aC5tYXgoYWNjLCBkaWZmU3ViUHJvcGVydHkoYWN0dWFsW2tleV0sIGV4cGVjdGVkW2tleV0pKTtcbiAgfSwgTWlncmF0aW9uQWN0aW9uLk5vbmUpO1xufVxuXG5mdW5jdGlvbiBpc0R5bmFtaWMocHJvcDogYW55KSB7XG4gIHJldHVybiBwcm9wICYmIGAke3Byb3AuZHluYW1pY31gID09PSAndHJ1ZSc7XG59XG4iXX0=