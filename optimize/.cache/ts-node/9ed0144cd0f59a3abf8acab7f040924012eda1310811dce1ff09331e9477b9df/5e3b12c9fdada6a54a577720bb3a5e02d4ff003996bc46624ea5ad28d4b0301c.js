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
const lodash_1 = require("lodash");
/**
 * Allows plain javascript object to behave like `RawConfig` instance.
 * @internal
 */
class ObjectToConfigAdapter {
    constructor(rawConfig) {
        this.rawConfig = rawConfig;
    }
    has(configPath) {
        return lodash_1.has(this.rawConfig, configPath);
    }
    get(configPath) {
        return lodash_1.get(this.rawConfig, configPath);
    }
    set(configPath, value) {
        lodash_1.set(this.rawConfig, configPath, value);
    }
    getFlattenedPaths() {
        return [...flattenObjectKeys(this.rawConfig)];
    }
    toRaw() {
        return lodash_1.cloneDeep(this.rawConfig);
    }
}
exports.ObjectToConfigAdapter = ObjectToConfigAdapter;
function* flattenObjectKeys(obj, path = '') {
    if (typeof obj !== 'object' || obj === null) {
        yield path;
    }
    else {
        for (const [key, value] of Object.entries(obj)) {
            const newPath = path !== '' ? `${path}.${key}` : key;
            yield* flattenObjectKeys(value, newPath);
        }
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2NvbmZpZy9vYmplY3RfdG9fY29uZmlnX2FkYXB0ZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9jb3JlL3NlcnZlci9jb25maWcvb2JqZWN0X3RvX2NvbmZpZ19hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBRUgsbUNBQWtEO0FBSWxEOzs7R0FHRztBQUNILE1BQWEscUJBQXFCO0lBQ2hDLFlBQTZCLFNBQThCO1FBQTlCLGNBQVMsR0FBVCxTQUFTLENBQXFCO0lBQUcsQ0FBQztJQUV4RCxHQUFHLENBQUMsVUFBc0I7UUFDL0IsT0FBTyxZQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sR0FBRyxDQUFDLFVBQXNCO1FBQy9CLE9BQU8sWUFBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVNLEdBQUcsQ0FBQyxVQUFzQixFQUFFLEtBQVU7UUFDM0MsWUFBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTSxpQkFBaUI7UUFDdEIsT0FBTyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLEtBQUs7UUFDVixPQUFPLGtCQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7Q0FDRjtBQXRCRCxzREFzQkM7QUFFRCxRQUFRLENBQUMsQ0FBQyxpQkFBaUIsQ0FDekIsR0FBMkIsRUFDM0IsT0FBZSxFQUFFO0lBRWpCLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFDM0MsTUFBTSxJQUFJLENBQUM7S0FDWjtTQUFNO1FBQ0wsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDOUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUNyRCxLQUFLLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDMUM7S0FDRjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgY2xvbmVEZWVwLCBnZXQsIGhhcywgc2V0IH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgQ29uZmlnLCBDb25maWdQYXRoIH0gZnJvbSAnLi8nO1xuXG4vKipcbiAqIEFsbG93cyBwbGFpbiBqYXZhc2NyaXB0IG9iamVjdCB0byBiZWhhdmUgbGlrZSBgUmF3Q29uZmlnYCBpbnN0YW5jZS5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY2xhc3MgT2JqZWN0VG9Db25maWdBZGFwdGVyIGltcGxlbWVudHMgQ29uZmlnIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSByYXdDb25maWc6IFJlY29yZDxzdHJpbmcsIGFueT4pIHt9XG5cbiAgcHVibGljIGhhcyhjb25maWdQYXRoOiBDb25maWdQYXRoKSB7XG4gICAgcmV0dXJuIGhhcyh0aGlzLnJhd0NvbmZpZywgY29uZmlnUGF0aCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0KGNvbmZpZ1BhdGg6IENvbmZpZ1BhdGgpIHtcbiAgICByZXR1cm4gZ2V0KHRoaXMucmF3Q29uZmlnLCBjb25maWdQYXRoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQoY29uZmlnUGF0aDogQ29uZmlnUGF0aCwgdmFsdWU6IGFueSkge1xuICAgIHNldCh0aGlzLnJhd0NvbmZpZywgY29uZmlnUGF0aCwgdmFsdWUpO1xuICB9XG5cbiAgcHVibGljIGdldEZsYXR0ZW5lZFBhdGhzKCkge1xuICAgIHJldHVybiBbLi4uZmxhdHRlbk9iamVjdEtleXModGhpcy5yYXdDb25maWcpXTtcbiAgfVxuXG4gIHB1YmxpYyB0b1JhdygpIHtcbiAgICByZXR1cm4gY2xvbmVEZWVwKHRoaXMucmF3Q29uZmlnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiogZmxhdHRlbk9iamVjdEtleXMoXG4gIG9iajogeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcbiAgcGF0aDogc3RyaW5nID0gJydcbik6IEl0ZXJhYmxlSXRlcmF0b3I8c3RyaW5nPiB7XG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCBvYmogPT09IG51bGwpIHtcbiAgICB5aWVsZCBwYXRoO1xuICB9IGVsc2Uge1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iaikpIHtcbiAgICAgIGNvbnN0IG5ld1BhdGggPSBwYXRoICE9PSAnJyA/IGAke3BhdGh9LiR7a2V5fWAgOiBrZXk7XG4gICAgICB5aWVsZCogZmxhdHRlbk9iamVjdEtleXModmFsdWUsIG5ld1BhdGgpO1xuICAgIH1cbiAgfVxufVxuIl19