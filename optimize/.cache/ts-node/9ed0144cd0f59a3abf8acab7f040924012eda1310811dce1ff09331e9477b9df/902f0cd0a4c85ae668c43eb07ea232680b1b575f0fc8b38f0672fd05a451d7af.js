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
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const type_detect_1 = tslib_1.__importDefault(require("type-detect"));
const object_to_config_adapter_1 = require("./object_to_config_adapter");
const read_config_1 = require("./read_config");
/** @internal */
class RawConfigService {
    constructor(configFiles, configAdapter = rawConfig => new object_to_config_adapter_1.ObjectToConfigAdapter(rawConfig)) {
        this.configFiles = configFiles;
        /**
         * The stream of configs read from the config file.
         *
         * This is the _raw_ config before any overrides are applied.
         */
        this.rawConfigFromFile$ = new rxjs_1.ReplaySubject(1);
        this.config$ = this.rawConfigFromFile$.pipe(operators_1.map(rawConfig => {
            if (lodash_1.isPlainObject(rawConfig)) {
                // TODO Make config consistent, e.g. handle dots in keys
                return configAdapter(lodash_1.cloneDeep(rawConfig));
            }
            throw new Error(`the raw config must be an object, got [${type_detect_1.default(rawConfig)}]`);
        }));
    }
    /**
     * Read the initial Kibana config.
     */
    loadConfig() {
        this.rawConfigFromFile$.next(read_config_1.getConfigFromFiles(this.configFiles));
    }
    stop() {
        this.rawConfigFromFile$.complete();
    }
    /**
     * Re-read the Kibana config.
     */
    reloadConfig() {
        this.loadConfig();
    }
    getConfig$() {
        return this.config$;
    }
}
exports.RawConfigService = RawConfigService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2NvbmZpZy9yYXdfY29uZmlnX3NlcnZpY2UudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9jb3JlL3NlcnZlci9jb25maWcvcmF3X2NvbmZpZ19zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7OztBQUVILG1DQUFrRDtBQUNsRCwrQkFBaUQ7QUFDakQsOENBQXFDO0FBQ3JDLHNFQUFxQztBQUdyQyx5RUFBbUU7QUFDbkUsK0NBQW1EO0FBRW5ELGdCQUFnQjtBQUNoQixNQUFhLGdCQUFnQjtJQVUzQixZQUNXLFdBQWtDLEVBQzNDLGdCQUE0RCxTQUFTLENBQUMsRUFBRSxDQUN0RSxJQUFJLGdEQUFxQixDQUFDLFNBQVMsQ0FBQztRQUY3QixnQkFBVyxHQUFYLFdBQVcsQ0FBdUI7UUFWN0M7Ozs7V0FJRztRQUNjLHVCQUFrQixHQUF1QyxJQUFJLG9CQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFTN0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUN6QyxlQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDZCxJQUFJLHNCQUFhLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQzVCLHdEQUF3RDtnQkFDeEQsT0FBTyxhQUFhLENBQUMsa0JBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2FBQzVDO1lBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQywwQ0FBMEMscUJBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEYsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFRDs7T0FFRztJQUNJLFVBQVU7UUFDZixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGdDQUFrQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFTSxJQUFJO1FBQ1QsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7T0FFRztJQUNJLFlBQVk7UUFDakIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxVQUFVO1FBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7Q0FDRjtBQWhERCw0Q0FnREMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgY2xvbmVEZWVwLCBpc1BsYWluT2JqZWN0IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFJlcGxheVN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB0eXBlRGV0ZWN0IGZyb20gJ3R5cGUtZGV0ZWN0JztcblxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgT2JqZWN0VG9Db25maWdBZGFwdGVyIH0gZnJvbSAnLi9vYmplY3RfdG9fY29uZmlnX2FkYXB0ZXInO1xuaW1wb3J0IHsgZ2V0Q29uZmlnRnJvbUZpbGVzIH0gZnJvbSAnLi9yZWFkX2NvbmZpZyc7XG5cbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCBjbGFzcyBSYXdDb25maWdTZXJ2aWNlIHtcbiAgLyoqXG4gICAqIFRoZSBzdHJlYW0gb2YgY29uZmlncyByZWFkIGZyb20gdGhlIGNvbmZpZyBmaWxlLlxuICAgKlxuICAgKiBUaGlzIGlzIHRoZSBfcmF3XyBjb25maWcgYmVmb3JlIGFueSBvdmVycmlkZXMgYXJlIGFwcGxpZWQuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHJhd0NvbmZpZ0Zyb21GaWxlJDogUmVwbGF5U3ViamVjdDxSZWNvcmQ8c3RyaW5nLCBhbnk+PiA9IG5ldyBSZXBsYXlTdWJqZWN0KDEpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgY29uZmlnJDogT2JzZXJ2YWJsZTxDb25maWc+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IGNvbmZpZ0ZpbGVzOiBSZWFkb25seUFycmF5PHN0cmluZz4sXG4gICAgY29uZmlnQWRhcHRlcjogKHJhd0NvbmZpZzogUmVjb3JkPHN0cmluZywgYW55PikgPT4gQ29uZmlnID0gcmF3Q29uZmlnID0+XG4gICAgICBuZXcgT2JqZWN0VG9Db25maWdBZGFwdGVyKHJhd0NvbmZpZylcbiAgKSB7XG4gICAgdGhpcy5jb25maWckID0gdGhpcy5yYXdDb25maWdGcm9tRmlsZSQucGlwZShcbiAgICAgIG1hcChyYXdDb25maWcgPT4ge1xuICAgICAgICBpZiAoaXNQbGFpbk9iamVjdChyYXdDb25maWcpKSB7XG4gICAgICAgICAgLy8gVE9ETyBNYWtlIGNvbmZpZyBjb25zaXN0ZW50LCBlLmcuIGhhbmRsZSBkb3RzIGluIGtleXNcbiAgICAgICAgICByZXR1cm4gY29uZmlnQWRhcHRlcihjbG9uZURlZXAocmF3Q29uZmlnKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHRoZSByYXcgY29uZmlnIG11c3QgYmUgYW4gb2JqZWN0LCBnb3QgWyR7dHlwZURldGVjdChyYXdDb25maWcpfV1gKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkIHRoZSBpbml0aWFsIEtpYmFuYSBjb25maWcuXG4gICAqL1xuICBwdWJsaWMgbG9hZENvbmZpZygpIHtcbiAgICB0aGlzLnJhd0NvbmZpZ0Zyb21GaWxlJC5uZXh0KGdldENvbmZpZ0Zyb21GaWxlcyh0aGlzLmNvbmZpZ0ZpbGVzKSk7XG4gIH1cblxuICBwdWJsaWMgc3RvcCgpIHtcbiAgICB0aGlzLnJhd0NvbmZpZ0Zyb21GaWxlJC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlLXJlYWQgdGhlIEtpYmFuYSBjb25maWcuXG4gICAqL1xuICBwdWJsaWMgcmVsb2FkQ29uZmlnKCkge1xuICAgIHRoaXMubG9hZENvbmZpZygpO1xuICB9XG5cbiAgcHVibGljIGdldENvbmZpZyQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnJDtcbiAgfVxufVxuIl19