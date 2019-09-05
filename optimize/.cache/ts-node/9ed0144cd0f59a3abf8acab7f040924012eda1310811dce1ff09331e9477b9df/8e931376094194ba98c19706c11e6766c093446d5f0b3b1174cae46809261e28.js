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
const config_1 = require("../../config");
/**
 * Represents adapter between config provided by legacy platform and `Config`
 * supported by the current platform.
 * @internal
 */
class LegacyObjectToConfigAdapter extends config_1.ObjectToConfigAdapter {
    static transformLogging(configValue = {}) {
        const loggingConfig = {
            appenders: {
                default: { kind: 'legacy-appender', legacyLoggingConfig: configValue },
            },
            root: { level: 'info' },
        };
        if (configValue.silent) {
            loggingConfig.root.level = 'off';
        }
        else if (configValue.quiet) {
            loggingConfig.root.level = 'error';
        }
        else if (configValue.verbose) {
            loggingConfig.root.level = 'all';
        }
        return loggingConfig;
    }
    static transformServer(configValue = {}) {
        // TODO: New platform uses just a subset of `server` config from the legacy platform,
        // new values will be exposed once we need them (eg. customResponseHeaders or xsrf).
        return {
            autoListen: configValue.autoListen,
            basePath: configValue.basePath,
            cors: configValue.cors,
            host: configValue.host,
            maxPayload: configValue.maxPayloadBytes,
            port: configValue.port,
            rewriteBasePath: configValue.rewriteBasePath,
            ssl: configValue.ssl && LegacyObjectToConfigAdapter.transformSSL(configValue.ssl),
        };
    }
    static transformSSL(configValue) {
        // `server.ssl.cert` is deprecated, legacy platform will issue deprecation warning.
        if (configValue.cert) {
            configValue.certificate = configValue.cert;
            delete configValue.cert;
        }
        // Enabling ssl by only specifying server.ssl.certificate and server.ssl.key is deprecated,
        // legacy platform will issue deprecation warning.
        if (typeof configValue.enabled !== 'boolean' && configValue.certificate && configValue.key) {
            configValue.enabled = true;
        }
        return configValue;
    }
    static transformPlugins(configValue) {
        // This property is the only one we use from the existing `plugins` config node
        // since `scanDirs` and `paths` aren't respected by new platform plugin discovery.
        return {
            initialize: configValue.initialize,
        };
    }
    get(configPath) {
        const configValue = super.get(configPath);
        switch (configPath) {
            case 'logging':
                return LegacyObjectToConfigAdapter.transformLogging(configValue);
            case 'server':
                return LegacyObjectToConfigAdapter.transformServer(configValue);
            case 'plugins':
                return LegacyObjectToConfigAdapter.transformPlugins(configValue);
            default:
                return configValue;
        }
    }
}
exports.LegacyObjectToConfigAdapter = LegacyObjectToConfigAdapter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2xlZ2FjeV9jb21wYXQvY29uZmlnL2xlZ2FjeV9vYmplY3RfdG9fY29uZmlnX2FkYXB0ZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9jb3JlL3NlcnZlci9sZWdhY3lfY29tcGF0L2NvbmZpZy9sZWdhY3lfb2JqZWN0X3RvX2NvbmZpZ19hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBRUgseUNBQWlFO0FBY2pFOzs7O0dBSUc7QUFDSCxNQUFhLDJCQUE0QixTQUFRLDhCQUFxQjtJQUM1RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsY0FBbUMsRUFBRTtRQUNuRSxNQUFNLGFBQWEsR0FBRztZQUNwQixTQUFTLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRTthQUN2RTtZQUNELElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7U0FDeEIsQ0FBQztRQUVGLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtZQUN0QixhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDbEM7YUFBTSxJQUFJLFdBQVcsQ0FBQyxLQUFLLEVBQUU7WUFDNUIsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1NBQ3BDO2FBQU0sSUFBSSxXQUFXLENBQUMsT0FBTyxFQUFFO1lBQzlCLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUNsQztRQUVELE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFFTyxNQUFNLENBQUMsZUFBZSxDQUFDLGNBQW1CLEVBQUU7UUFDbEQscUZBQXFGO1FBQ3JGLG9GQUFvRjtRQUNwRixPQUFPO1lBQ0wsVUFBVSxFQUFFLFdBQVcsQ0FBQyxVQUFVO1lBQ2xDLFFBQVEsRUFBRSxXQUFXLENBQUMsUUFBUTtZQUM5QixJQUFJLEVBQUUsV0FBVyxDQUFDLElBQUk7WUFDdEIsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJO1lBQ3RCLFVBQVUsRUFBRSxXQUFXLENBQUMsZUFBZTtZQUN2QyxJQUFJLEVBQUUsV0FBVyxDQUFDLElBQUk7WUFDdEIsZUFBZSxFQUFFLFdBQVcsQ0FBQyxlQUFlO1lBQzVDLEdBQUcsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFJLDJCQUEyQixDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDO1NBQ2xGLENBQUM7SUFDSixDQUFDO0lBRU8sTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFnQztRQUMxRCxtRkFBbUY7UUFDbkYsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFO1lBQ3BCLFdBQVcsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQztZQUMzQyxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUM7U0FDekI7UUFFRCwyRkFBMkY7UUFDM0Ysa0RBQWtEO1FBQ2xELElBQUksT0FBTyxXQUFXLENBQUMsT0FBTyxLQUFLLFNBQVMsSUFBSSxXQUFXLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxHQUFHLEVBQUU7WUFDMUYsV0FBVyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDNUI7UUFFRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRU8sTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQWdDO1FBQzlELCtFQUErRTtRQUMvRSxrRkFBa0Y7UUFDbEYsT0FBTztZQUNMLFVBQVUsRUFBRSxXQUFXLENBQUMsVUFBVTtTQUNuQyxDQUFDO0lBQ0osQ0FBQztJQUVNLEdBQUcsQ0FBQyxVQUFzQjtRQUMvQixNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFDLFFBQVEsVUFBVSxFQUFFO1lBQ2xCLEtBQUssU0FBUztnQkFDWixPQUFPLDJCQUEyQixDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25FLEtBQUssUUFBUTtnQkFDWCxPQUFPLDJCQUEyQixDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsRSxLQUFLLFNBQVM7Z0JBQ1osT0FBTywyQkFBMkIsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNuRTtnQkFDRSxPQUFPLFdBQVcsQ0FBQztTQUN0QjtJQUNILENBQUM7Q0FDRjtBQXhFRCxrRUF3RUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ29uZmlnUGF0aCwgT2JqZWN0VG9Db25maWdBZGFwdGVyIH0gZnJvbSAnLi4vLi4vY29uZmlnJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGxvZ2dpbmcgY29uZmlnIHN1cHBvcnRlZCBieSB0aGUgbGVnYWN5IHBsYXRmb3JtLlxuICovXG5pbnRlcmZhY2UgTGVnYWN5TG9nZ2luZ0NvbmZpZyB7XG4gIHNpbGVudD86IGJvb2xlYW47XG4gIHZlcmJvc2U/OiBib29sZWFuO1xuICBxdWlldD86IGJvb2xlYW47XG4gIGRlc3Q/OiBzdHJpbmc7XG4gIGpzb24/OiBib29sZWFuO1xuICBldmVudHM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYWRhcHRlciBiZXR3ZWVuIGNvbmZpZyBwcm92aWRlZCBieSBsZWdhY3kgcGxhdGZvcm0gYW5kIGBDb25maWdgXG4gKiBzdXBwb3J0ZWQgYnkgdGhlIGN1cnJlbnQgcGxhdGZvcm0uXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNsYXNzIExlZ2FjeU9iamVjdFRvQ29uZmlnQWRhcHRlciBleHRlbmRzIE9iamVjdFRvQ29uZmlnQWRhcHRlciB7XG4gIHByaXZhdGUgc3RhdGljIHRyYW5zZm9ybUxvZ2dpbmcoY29uZmlnVmFsdWU6IExlZ2FjeUxvZ2dpbmdDb25maWcgPSB7fSkge1xuICAgIGNvbnN0IGxvZ2dpbmdDb25maWcgPSB7XG4gICAgICBhcHBlbmRlcnM6IHtcbiAgICAgICAgZGVmYXVsdDogeyBraW5kOiAnbGVnYWN5LWFwcGVuZGVyJywgbGVnYWN5TG9nZ2luZ0NvbmZpZzogY29uZmlnVmFsdWUgfSxcbiAgICAgIH0sXG4gICAgICByb290OiB7IGxldmVsOiAnaW5mbycgfSxcbiAgICB9O1xuXG4gICAgaWYgKGNvbmZpZ1ZhbHVlLnNpbGVudCkge1xuICAgICAgbG9nZ2luZ0NvbmZpZy5yb290LmxldmVsID0gJ29mZic7XG4gICAgfSBlbHNlIGlmIChjb25maWdWYWx1ZS5xdWlldCkge1xuICAgICAgbG9nZ2luZ0NvbmZpZy5yb290LmxldmVsID0gJ2Vycm9yJztcbiAgICB9IGVsc2UgaWYgKGNvbmZpZ1ZhbHVlLnZlcmJvc2UpIHtcbiAgICAgIGxvZ2dpbmdDb25maWcucm9vdC5sZXZlbCA9ICdhbGwnO1xuICAgIH1cblxuICAgIHJldHVybiBsb2dnaW5nQ29uZmlnO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgdHJhbnNmb3JtU2VydmVyKGNvbmZpZ1ZhbHVlOiBhbnkgPSB7fSkge1xuICAgIC8vIFRPRE86IE5ldyBwbGF0Zm9ybSB1c2VzIGp1c3QgYSBzdWJzZXQgb2YgYHNlcnZlcmAgY29uZmlnIGZyb20gdGhlIGxlZ2FjeSBwbGF0Zm9ybSxcbiAgICAvLyBuZXcgdmFsdWVzIHdpbGwgYmUgZXhwb3NlZCBvbmNlIHdlIG5lZWQgdGhlbSAoZWcuIGN1c3RvbVJlc3BvbnNlSGVhZGVycyBvciB4c3JmKS5cbiAgICByZXR1cm4ge1xuICAgICAgYXV0b0xpc3RlbjogY29uZmlnVmFsdWUuYXV0b0xpc3RlbixcbiAgICAgIGJhc2VQYXRoOiBjb25maWdWYWx1ZS5iYXNlUGF0aCxcbiAgICAgIGNvcnM6IGNvbmZpZ1ZhbHVlLmNvcnMsXG4gICAgICBob3N0OiBjb25maWdWYWx1ZS5ob3N0LFxuICAgICAgbWF4UGF5bG9hZDogY29uZmlnVmFsdWUubWF4UGF5bG9hZEJ5dGVzLFxuICAgICAgcG9ydDogY29uZmlnVmFsdWUucG9ydCxcbiAgICAgIHJld3JpdGVCYXNlUGF0aDogY29uZmlnVmFsdWUucmV3cml0ZUJhc2VQYXRoLFxuICAgICAgc3NsOiBjb25maWdWYWx1ZS5zc2wgJiYgTGVnYWN5T2JqZWN0VG9Db25maWdBZGFwdGVyLnRyYW5zZm9ybVNTTChjb25maWdWYWx1ZS5zc2wpLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyB0cmFuc2Zvcm1TU0woY29uZmlnVmFsdWU6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICAvLyBgc2VydmVyLnNzbC5jZXJ0YCBpcyBkZXByZWNhdGVkLCBsZWdhY3kgcGxhdGZvcm0gd2lsbCBpc3N1ZSBkZXByZWNhdGlvbiB3YXJuaW5nLlxuICAgIGlmIChjb25maWdWYWx1ZS5jZXJ0KSB7XG4gICAgICBjb25maWdWYWx1ZS5jZXJ0aWZpY2F0ZSA9IGNvbmZpZ1ZhbHVlLmNlcnQ7XG4gICAgICBkZWxldGUgY29uZmlnVmFsdWUuY2VydDtcbiAgICB9XG5cbiAgICAvLyBFbmFibGluZyBzc2wgYnkgb25seSBzcGVjaWZ5aW5nIHNlcnZlci5zc2wuY2VydGlmaWNhdGUgYW5kIHNlcnZlci5zc2wua2V5IGlzIGRlcHJlY2F0ZWQsXG4gICAgLy8gbGVnYWN5IHBsYXRmb3JtIHdpbGwgaXNzdWUgZGVwcmVjYXRpb24gd2FybmluZy5cbiAgICBpZiAodHlwZW9mIGNvbmZpZ1ZhbHVlLmVuYWJsZWQgIT09ICdib29sZWFuJyAmJiBjb25maWdWYWx1ZS5jZXJ0aWZpY2F0ZSAmJiBjb25maWdWYWx1ZS5rZXkpIHtcbiAgICAgIGNvbmZpZ1ZhbHVlLmVuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBjb25maWdWYWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHRyYW5zZm9ybVBsdWdpbnMoY29uZmlnVmFsdWU6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICAvLyBUaGlzIHByb3BlcnR5IGlzIHRoZSBvbmx5IG9uZSB3ZSB1c2UgZnJvbSB0aGUgZXhpc3RpbmcgYHBsdWdpbnNgIGNvbmZpZyBub2RlXG4gICAgLy8gc2luY2UgYHNjYW5EaXJzYCBhbmQgYHBhdGhzYCBhcmVuJ3QgcmVzcGVjdGVkIGJ5IG5ldyBwbGF0Zm9ybSBwbHVnaW4gZGlzY292ZXJ5LlxuICAgIHJldHVybiB7XG4gICAgICBpbml0aWFsaXplOiBjb25maWdWYWx1ZS5pbml0aWFsaXplLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZ2V0KGNvbmZpZ1BhdGg6IENvbmZpZ1BhdGgpIHtcbiAgICBjb25zdCBjb25maWdWYWx1ZSA9IHN1cGVyLmdldChjb25maWdQYXRoKTtcbiAgICBzd2l0Y2ggKGNvbmZpZ1BhdGgpIHtcbiAgICAgIGNhc2UgJ2xvZ2dpbmcnOlxuICAgICAgICByZXR1cm4gTGVnYWN5T2JqZWN0VG9Db25maWdBZGFwdGVyLnRyYW5zZm9ybUxvZ2dpbmcoY29uZmlnVmFsdWUpO1xuICAgICAgY2FzZSAnc2VydmVyJzpcbiAgICAgICAgcmV0dXJuIExlZ2FjeU9iamVjdFRvQ29uZmlnQWRhcHRlci50cmFuc2Zvcm1TZXJ2ZXIoY29uZmlnVmFsdWUpO1xuICAgICAgY2FzZSAncGx1Z2lucyc6XG4gICAgICAgIHJldHVybiBMZWdhY3lPYmplY3RUb0NvbmZpZ0FkYXB0ZXIudHJhbnNmb3JtUGx1Z2lucyhjb25maWdWYWx1ZSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gY29uZmlnVmFsdWU7XG4gICAgfVxuICB9XG59XG4iXX0=