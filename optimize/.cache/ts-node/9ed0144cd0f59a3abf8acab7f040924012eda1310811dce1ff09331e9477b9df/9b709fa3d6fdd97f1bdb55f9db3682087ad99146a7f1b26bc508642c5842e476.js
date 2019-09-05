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
const separator = '.';
/**
 * Recursively traverses through the object's properties and expands ones with
 * dot-separated names into nested objects (eg. { a.b: 'c'} -> { a: { b: 'c' }).
 * @param obj Object to traverse through.
 * @returns Same object instance with expanded properties.
 */
function ensureDeepObject(obj) {
    if (obj == null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => ensureDeepObject(item));
    }
    return Object.keys(obj).reduce((fullObject, propertyKey) => {
        const propertyValue = obj[propertyKey];
        if (!propertyKey.includes(separator)) {
            fullObject[propertyKey] = ensureDeepObject(propertyValue);
        }
        else {
            walk(fullObject, propertyKey.split(separator), propertyValue);
        }
        return fullObject;
    }, {});
}
exports.ensureDeepObject = ensureDeepObject;
function walk(obj, keys, value) {
    const key = keys.shift();
    if (keys.length === 0) {
        obj[key] = value;
        return;
    }
    if (obj[key] === undefined) {
        obj[key] = {};
    }
    walk(obj[key], keys, ensureDeepObject(value));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2NvbmZpZy9lbnN1cmVfZGVlcF9vYmplY3QudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9jb3JlL3NlcnZlci9jb25maWcvZW5zdXJlX2RlZXBfb2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBRUgsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBRXRCOzs7OztHQUtHO0FBQ0gsU0FBZ0IsZ0JBQWdCLENBQUMsR0FBUTtJQUN2QyxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1FBQzFDLE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDdEIsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNoRDtJQUVELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQzVCLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxFQUFFO1FBQzFCLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNwQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDM0Q7YUFBTTtZQUNMLElBQUksQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztTQUMvRDtRQUVELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUMsRUFDRCxFQUFTLENBQ1YsQ0FBQztBQUNKLENBQUM7QUF0QkQsNENBc0JDO0FBRUQsU0FBUyxJQUFJLENBQUMsR0FBUSxFQUFFLElBQWMsRUFBRSxLQUFVO0lBQ2hELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUcsQ0FBQztJQUMxQixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3JCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDakIsT0FBTztLQUNSO0lBRUQsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFFO1FBQzFCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDZjtJQUVELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5jb25zdCBzZXBhcmF0b3IgPSAnLic7XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgdHJhdmVyc2VzIHRocm91Z2ggdGhlIG9iamVjdCdzIHByb3BlcnRpZXMgYW5kIGV4cGFuZHMgb25lcyB3aXRoXG4gKiBkb3Qtc2VwYXJhdGVkIG5hbWVzIGludG8gbmVzdGVkIG9iamVjdHMgKGVnLiB7IGEuYjogJ2MnfSAtPiB7IGE6IHsgYjogJ2MnIH0pLlxuICogQHBhcmFtIG9iaiBPYmplY3QgdG8gdHJhdmVyc2UgdGhyb3VnaC5cbiAqIEByZXR1cm5zIFNhbWUgb2JqZWN0IGluc3RhbmNlIHdpdGggZXhwYW5kZWQgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZURlZXBPYmplY3Qob2JqOiBhbnkpOiBhbnkge1xuICBpZiAob2JqID09IG51bGwgfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgIHJldHVybiBvYmoubWFwKGl0ZW0gPT4gZW5zdXJlRGVlcE9iamVjdChpdGVtKSk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5yZWR1Y2UoXG4gICAgKGZ1bGxPYmplY3QsIHByb3BlcnR5S2V5KSA9PiB7XG4gICAgICBjb25zdCBwcm9wZXJ0eVZhbHVlID0gb2JqW3Byb3BlcnR5S2V5XTtcbiAgICAgIGlmICghcHJvcGVydHlLZXkuaW5jbHVkZXMoc2VwYXJhdG9yKSkge1xuICAgICAgICBmdWxsT2JqZWN0W3Byb3BlcnR5S2V5XSA9IGVuc3VyZURlZXBPYmplY3QocHJvcGVydHlWYWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3YWxrKGZ1bGxPYmplY3QsIHByb3BlcnR5S2V5LnNwbGl0KHNlcGFyYXRvciksIHByb3BlcnR5VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnVsbE9iamVjdDtcbiAgICB9LFxuICAgIHt9IGFzIGFueVxuICApO1xufVxuXG5mdW5jdGlvbiB3YWxrKG9iajogYW55LCBrZXlzOiBzdHJpbmdbXSwgdmFsdWU6IGFueSkge1xuICBjb25zdCBrZXkgPSBrZXlzLnNoaWZ0KCkhO1xuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChvYmpba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgb2JqW2tleV0gPSB7fTtcbiAgfVxuXG4gIHdhbGsob2JqW2tleV0sIGtleXMsIGVuc3VyZURlZXBPYmplY3QodmFsdWUpKTtcbn1cbiJdfQ==