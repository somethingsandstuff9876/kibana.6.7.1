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
const config_schema_1 = require("@kbn/config-schema");
const ssl_config_1 = require("./ssl_config");
const validBasePathRegex = /(^$|^\/.*[^\/]$)/;
const match = (regex, errorMsg) => (str) => regex.test(str) ? undefined : errorMsg;
const createHttpSchema = config_schema_1.schema.object({
    autoListen: config_schema_1.schema.boolean({ defaultValue: true }),
    basePath: config_schema_1.schema.maybe(config_schema_1.schema.string({
        validate: match(validBasePathRegex, "must start with a slash, don't end with one"),
    })),
    cors: config_schema_1.schema.conditional(config_schema_1.schema.contextRef('dev'), true, config_schema_1.schema.object({
        origin: config_schema_1.schema.arrayOf(config_schema_1.schema.string()),
    }, {
        defaultValue: {
            origin: ['*://localhost:9876'],
        },
    }), config_schema_1.schema.boolean({ defaultValue: false })),
    host: config_schema_1.schema.string({
        defaultValue: 'localhost',
        hostname: true,
    }),
    maxPayload: config_schema_1.schema.byteSize({
        defaultValue: '1048576b',
    }),
    port: config_schema_1.schema.number({
        defaultValue: 5601,
    }),
    rewriteBasePath: config_schema_1.schema.boolean({ defaultValue: false }),
    ssl: ssl_config_1.SslConfig.schema,
}, {
    validate: config => {
        if (!config.basePath && config.rewriteBasePath) {
            return 'cannot use [rewriteBasePath] when [basePath] is not specified';
        }
        if (config.ssl.enabled &&
            config.ssl.redirectHttpFromPort !== undefined &&
            config.ssl.redirectHttpFromPort === config.port) {
            return ('Kibana does not accept http traffic to [port] when ssl is ' +
                'enabled (only https is allowed), so [ssl.redirectHttpFromPort] ' +
                `cannot be configured to the same value. Both are [${config.port}].`);
        }
    },
});
class HttpConfig {
    /**
     * @internal
     */
    constructor(config, env) {
        this.autoListen = config.autoListen;
        this.host = config.host;
        this.port = config.port;
        this.cors = config.cors;
        this.maxPayload = config.maxPayload;
        this.basePath = config.basePath;
        this.rewriteBasePath = config.rewriteBasePath;
        this.publicDir = env.staticFilesDir;
        this.ssl = new ssl_config_1.SslConfig(config.ssl);
    }
}
/**
 * @internal
 */
HttpConfig.schema = createHttpSchema;
exports.HttpConfig = HttpConfig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2h0dHAvaHR0cF9jb25maWcudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9jb3JlL3NlcnZlci9odHRwL2h0dHBfY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBRUgsc0RBQW1FO0FBRW5FLDZDQUF5QztBQUV6QyxNQUFNLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO0FBRTlDLE1BQU0sS0FBSyxHQUFHLENBQUMsS0FBYSxFQUFFLFFBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FDakUsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFFekMsTUFBTSxnQkFBZ0IsR0FBRyxzQkFBTSxDQUFDLE1BQU0sQ0FDcEM7SUFDRSxVQUFVLEVBQUUsc0JBQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDbEQsUUFBUSxFQUFFLHNCQUFNLENBQUMsS0FBSyxDQUNwQixzQkFBTSxDQUFDLE1BQU0sQ0FBQztRQUNaLFFBQVEsRUFBRSxLQUFLLENBQUMsa0JBQWtCLEVBQUUsNkNBQTZDLENBQUM7S0FDbkYsQ0FBQyxDQUNIO0lBQ0QsSUFBSSxFQUFFLHNCQUFNLENBQUMsV0FBVyxDQUN0QixzQkFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFDeEIsSUFBSSxFQUNKLHNCQUFNLENBQUMsTUFBTSxDQUNYO1FBQ0UsTUFBTSxFQUFFLHNCQUFNLENBQUMsT0FBTyxDQUFDLHNCQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDeEMsRUFDRDtRQUNFLFlBQVksRUFBRTtZQUNaLE1BQU0sRUFBRSxDQUFDLG9CQUFvQixDQUFDO1NBQy9CO0tBQ0YsQ0FDRixFQUNELHNCQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQ3hDO0lBQ0QsSUFBSSxFQUFFLHNCQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLFlBQVksRUFBRSxXQUFXO1FBQ3pCLFFBQVEsRUFBRSxJQUFJO0tBQ2YsQ0FBQztJQUNGLFVBQVUsRUFBRSxzQkFBTSxDQUFDLFFBQVEsQ0FBQztRQUMxQixZQUFZLEVBQUUsVUFBVTtLQUN6QixDQUFDO0lBQ0YsSUFBSSxFQUFFLHNCQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLFlBQVksRUFBRSxJQUFJO0tBQ25CLENBQUM7SUFDRixlQUFlLEVBQUUsc0JBQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDeEQsR0FBRyxFQUFFLHNCQUFTLENBQUMsTUFBTTtDQUN0QixFQUNEO0lBQ0UsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxlQUFlLEVBQUU7WUFDOUMsT0FBTywrREFBK0QsQ0FBQztTQUN4RTtRQUVELElBQ0UsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPO1lBQ2xCLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEtBQUssU0FBUztZQUM3QyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQy9DO1lBQ0EsT0FBTyxDQUNMLDREQUE0RDtnQkFDNUQsaUVBQWlFO2dCQUNqRSxxREFBcUQsTUFBTSxDQUFDLElBQUksSUFBSSxDQUNyRSxDQUFDO1NBQ0g7SUFDSCxDQUFDO0NBQ0YsQ0FDRixDQUFDO0FBSUYsTUFBYSxVQUFVO0lBZ0JyQjs7T0FFRztJQUNILFlBQVksTUFBc0IsRUFBRSxHQUFRO1FBQzFDLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNwQyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQztRQUM5QyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUM7UUFDcEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLHNCQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7O0FBNUJEOztHQUVHO0FBQ1csaUJBQU0sR0FBRyxnQkFBZ0IsQ0FBQztBQUoxQyxnQ0E4QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQnl0ZVNpemVWYWx1ZSwgc2NoZW1hLCBUeXBlT2YgfSBmcm9tICdAa2JuL2NvbmZpZy1zY2hlbWEnO1xuaW1wb3J0IHsgRW52IH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7IFNzbENvbmZpZyB9IGZyb20gJy4vc3NsX2NvbmZpZyc7XG5cbmNvbnN0IHZhbGlkQmFzZVBhdGhSZWdleCA9IC8oXiR8XlxcLy4qW15cXC9dJCkvO1xuXG5jb25zdCBtYXRjaCA9IChyZWdleDogUmVnRXhwLCBlcnJvck1zZzogc3RyaW5nKSA9PiAoc3RyOiBzdHJpbmcpID0+XG4gIHJlZ2V4LnRlc3Qoc3RyKSA/IHVuZGVmaW5lZCA6IGVycm9yTXNnO1xuXG5jb25zdCBjcmVhdGVIdHRwU2NoZW1hID0gc2NoZW1hLm9iamVjdChcbiAge1xuICAgIGF1dG9MaXN0ZW46IHNjaGVtYS5ib29sZWFuKHsgZGVmYXVsdFZhbHVlOiB0cnVlIH0pLFxuICAgIGJhc2VQYXRoOiBzY2hlbWEubWF5YmUoXG4gICAgICBzY2hlbWEuc3RyaW5nKHtcbiAgICAgICAgdmFsaWRhdGU6IG1hdGNoKHZhbGlkQmFzZVBhdGhSZWdleCwgXCJtdXN0IHN0YXJ0IHdpdGggYSBzbGFzaCwgZG9uJ3QgZW5kIHdpdGggb25lXCIpLFxuICAgICAgfSlcbiAgICApLFxuICAgIGNvcnM6IHNjaGVtYS5jb25kaXRpb25hbChcbiAgICAgIHNjaGVtYS5jb250ZXh0UmVmKCdkZXYnKSxcbiAgICAgIHRydWUsXG4gICAgICBzY2hlbWEub2JqZWN0KFxuICAgICAgICB7XG4gICAgICAgICAgb3JpZ2luOiBzY2hlbWEuYXJyYXlPZihzY2hlbWEuc3RyaW5nKCkpLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZGVmYXVsdFZhbHVlOiB7XG4gICAgICAgICAgICBvcmlnaW46IFsnKjovL2xvY2FsaG9zdDo5ODc2J10sIC8vIGthcm1hIHRlc3Qgc2VydmVyXG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgIHNjaGVtYS5ib29sZWFuKHsgZGVmYXVsdFZhbHVlOiBmYWxzZSB9KVxuICAgICksXG4gICAgaG9zdDogc2NoZW1hLnN0cmluZyh7XG4gICAgICBkZWZhdWx0VmFsdWU6ICdsb2NhbGhvc3QnLFxuICAgICAgaG9zdG5hbWU6IHRydWUsXG4gICAgfSksXG4gICAgbWF4UGF5bG9hZDogc2NoZW1hLmJ5dGVTaXplKHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogJzEwNDg1NzZiJyxcbiAgICB9KSxcbiAgICBwb3J0OiBzY2hlbWEubnVtYmVyKHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogNTYwMSxcbiAgICB9KSxcbiAgICByZXdyaXRlQmFzZVBhdGg6IHNjaGVtYS5ib29sZWFuKHsgZGVmYXVsdFZhbHVlOiBmYWxzZSB9KSxcbiAgICBzc2w6IFNzbENvbmZpZy5zY2hlbWEsXG4gIH0sXG4gIHtcbiAgICB2YWxpZGF0ZTogY29uZmlnID0+IHtcbiAgICAgIGlmICghY29uZmlnLmJhc2VQYXRoICYmIGNvbmZpZy5yZXdyaXRlQmFzZVBhdGgpIHtcbiAgICAgICAgcmV0dXJuICdjYW5ub3QgdXNlIFtyZXdyaXRlQmFzZVBhdGhdIHdoZW4gW2Jhc2VQYXRoXSBpcyBub3Qgc3BlY2lmaWVkJztcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBjb25maWcuc3NsLmVuYWJsZWQgJiZcbiAgICAgICAgY29uZmlnLnNzbC5yZWRpcmVjdEh0dHBGcm9tUG9ydCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIGNvbmZpZy5zc2wucmVkaXJlY3RIdHRwRnJvbVBvcnQgPT09IGNvbmZpZy5wb3J0XG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAnS2liYW5hIGRvZXMgbm90IGFjY2VwdCBodHRwIHRyYWZmaWMgdG8gW3BvcnRdIHdoZW4gc3NsIGlzICcgK1xuICAgICAgICAgICdlbmFibGVkIChvbmx5IGh0dHBzIGlzIGFsbG93ZWQpLCBzbyBbc3NsLnJlZGlyZWN0SHR0cEZyb21Qb3J0XSAnICtcbiAgICAgICAgICBgY2Fubm90IGJlIGNvbmZpZ3VyZWQgdG8gdGhlIHNhbWUgdmFsdWUuIEJvdGggYXJlIFske2NvbmZpZy5wb3J0fV0uYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG4gIH1cbik7XG5cbnR5cGUgSHR0cENvbmZpZ1R5cGUgPSBUeXBlT2Y8dHlwZW9mIGNyZWF0ZUh0dHBTY2hlbWE+O1xuXG5leHBvcnQgY2xhc3MgSHR0cENvbmZpZyB7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc2NoZW1hID0gY3JlYXRlSHR0cFNjaGVtYTtcblxuICBwdWJsaWMgYXV0b0xpc3RlbjogYm9vbGVhbjtcbiAgcHVibGljIGhvc3Q6IHN0cmluZztcbiAgcHVibGljIHBvcnQ6IG51bWJlcjtcbiAgcHVibGljIGNvcnM6IGJvb2xlYW4gfCB7IG9yaWdpbjogc3RyaW5nW10gfTtcbiAgcHVibGljIG1heFBheWxvYWQ6IEJ5dGVTaXplVmFsdWU7XG4gIHB1YmxpYyBiYXNlUGF0aD86IHN0cmluZztcbiAgcHVibGljIHJld3JpdGVCYXNlUGF0aDogYm9vbGVhbjtcbiAgcHVibGljIHB1YmxpY0Rpcjogc3RyaW5nO1xuICBwdWJsaWMgc3NsOiBTc2xDb25maWc7XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgY29uc3RydWN0b3IoY29uZmlnOiBIdHRwQ29uZmlnVHlwZSwgZW52OiBFbnYpIHtcbiAgICB0aGlzLmF1dG9MaXN0ZW4gPSBjb25maWcuYXV0b0xpc3RlbjtcbiAgICB0aGlzLmhvc3QgPSBjb25maWcuaG9zdDtcbiAgICB0aGlzLnBvcnQgPSBjb25maWcucG9ydDtcbiAgICB0aGlzLmNvcnMgPSBjb25maWcuY29ycztcbiAgICB0aGlzLm1heFBheWxvYWQgPSBjb25maWcubWF4UGF5bG9hZDtcbiAgICB0aGlzLmJhc2VQYXRoID0gY29uZmlnLmJhc2VQYXRoO1xuICAgIHRoaXMucmV3cml0ZUJhc2VQYXRoID0gY29uZmlnLnJld3JpdGVCYXNlUGF0aDtcbiAgICB0aGlzLnB1YmxpY0RpciA9IGVudi5zdGF0aWNGaWxlc0RpcjtcbiAgICB0aGlzLnNzbCA9IG5ldyBTc2xDb25maWcoY29uZmlnLnNzbCk7XG4gIH1cbn1cbiJdfQ==