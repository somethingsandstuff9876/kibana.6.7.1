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
const fs_1 = require("fs");
const hapi_1 = require("hapi");
const hoek_1 = tslib_1.__importDefault(require("hoek"));
/**
 * Converts Kibana `HttpConfig` into `ServerOptions` that are accepted by the Hapi server.
 */
function getServerOptions(config, { configureTLS = true } = {}) {
    // Note that all connection options configured here should be exactly the same
    // as in the legacy platform server (see `src/server/http/index`). Any change
    // SHOULD BE applied in both places. The only exception is TLS-specific options,
    // that are configured only here.
    const options = {
        host: config.host,
        port: config.port,
        routes: {
            cors: config.cors,
            payload: {
                maxBytes: config.maxPayload.getValueInBytes(),
            },
            validate: {
                failAction: defaultValidationErrorHandler,
                options: {
                    abortEarly: false,
                },
            },
        },
        state: {
            strictHeader: false,
            isHttpOnly: true,
            isSameSite: false,
        },
    };
    if (configureTLS && config.ssl.enabled) {
        const ssl = config.ssl;
        // TODO: Hapi types have a typo in `tls` property type definition: `https.RequestOptions` is used instead of
        // `https.ServerOptions`, and `honorCipherOrder` isn't presented in `https.RequestOptions`.
        const tlsOptions = {
            ca: config.ssl.certificateAuthorities &&
                config.ssl.certificateAuthorities.map(caFilePath => fs_1.readFileSync(caFilePath)),
            cert: fs_1.readFileSync(ssl.certificate),
            ciphers: config.ssl.cipherSuites.join(':'),
            // We use the server's cipher order rather than the client's to prevent the BEAST attack.
            honorCipherOrder: true,
            key: fs_1.readFileSync(ssl.key),
            passphrase: ssl.keyPassphrase,
            secureOptions: ssl.getSecureOptions(),
        };
        options.tls = tlsOptions;
    }
    return options;
}
exports.getServerOptions = getServerOptions;
function createServer(options) {
    const server = new hapi_1.Server(options);
    // Revert to previous 120 seconds keep-alive timeout in Node < 8.
    server.listener.keepAliveTimeout = 120e3;
    server.listener.on('clientError', (err, socket) => {
        if (socket.writable) {
            socket.end(Buffer.from('HTTP/1.1 400 Bad Request\r\n\r\n', 'ascii'));
        }
        else {
            socket.destroy(err);
        }
    });
    return server;
}
exports.createServer = createServer;
/**
 * Used to replicate Hapi v16 and below's validation responses. Should be used in the routes.validate.failAction key.
 */
function defaultValidationErrorHandler(request, h, err) {
    // Newer versions of Joi don't format the key for missing params the same way. This shim
    // provides backwards compatibility. Unfortunately, Joi doesn't export it's own Error class
    // in JS so we have to rely on the `name` key before we can cast it.
    //
    // The Hapi code we're 'overwriting' can be found here:
    //     https://github.com/hapijs/hapi/blob/master/lib/validation.js#L102
    if (err && err.name === 'ValidationError' && err.hasOwnProperty('output')) {
        const validationError = err;
        const validationKeys = [];
        validationError.details.forEach(detail => {
            if (detail.path.length > 0) {
                validationKeys.push(hoek_1.default.escapeHtml(detail.path.join('.')));
            }
            else {
                // If no path, use the value sigil to signal the entire value had an issue.
                validationKeys.push('value');
            }
        });
        validationError.output.payload.validation.keys = validationKeys;
    }
    throw err;
}
exports.defaultValidationErrorHandler = defaultValidationErrorHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2h0dHAvaHR0cF90b29scy50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2h0dHAvaHR0cF90b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOzs7QUFFSCwyQkFBa0M7QUFDbEMsK0JBQXdGO0FBQ3hGLHdEQUF3QjtBQUt4Qjs7R0FFRztBQUNILFNBQWdCLGdCQUFnQixDQUFDLE1BQWtCLEVBQUUsRUFBRSxZQUFZLEdBQUcsSUFBSSxFQUFFLEdBQUcsRUFBRTtJQUMvRSw4RUFBOEU7SUFDOUUsNkVBQTZFO0lBQzdFLGdGQUFnRjtJQUNoRixpQ0FBaUM7SUFDakMsTUFBTSxPQUFPLEdBQWtCO1FBQzdCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtRQUNqQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7UUFDakIsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1lBQ2pCLE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUU7YUFDOUM7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsVUFBVSxFQUFFLDZCQUE2QjtnQkFDekMsT0FBTyxFQUFFO29CQUNQLFVBQVUsRUFBRSxLQUFLO2lCQUNsQjthQUNGO1NBQ0Y7UUFDRCxLQUFLLEVBQUU7WUFDTCxZQUFZLEVBQUUsS0FBSztZQUNuQixVQUFVLEVBQUUsSUFBSTtZQUNoQixVQUFVLEVBQUUsS0FBSztTQUNsQjtLQUNGLENBQUM7SUFFRixJQUFJLFlBQVksSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTtRQUN0QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBRXZCLDRHQUE0RztRQUM1RywyRkFBMkY7UUFDM0YsTUFBTSxVQUFVLEdBQWU7WUFDN0IsRUFBRSxFQUNBLE1BQU0sQ0FBQyxHQUFHLENBQUMsc0JBQXNCO2dCQUNqQyxNQUFNLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLGlCQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDL0UsSUFBSSxFQUFFLGlCQUFZLENBQUMsR0FBRyxDQUFDLFdBQVksQ0FBQztZQUNwQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUMxQyx5RkFBeUY7WUFDekYsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixHQUFHLEVBQUUsaUJBQVksQ0FBQyxHQUFHLENBQUMsR0FBSSxDQUFDO1lBQzNCLFVBQVUsRUFBRSxHQUFHLENBQUMsYUFBYTtZQUM3QixhQUFhLEVBQUUsR0FBRyxDQUFDLGdCQUFnQixFQUFFO1NBQ3RDLENBQUM7UUFFRixPQUFPLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQztLQUMxQjtJQUVELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFqREQsNENBaURDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLE9BQXNCO0lBQ2pELE1BQU0sTUFBTSxHQUFHLElBQUksYUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRW5DLGlFQUFpRTtJQUNqRSxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztJQUN6QyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDaEQsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQ25CLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ3RFO2FBQU07WUFDTCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBZEQsb0NBY0M7QUFxQkQ7O0dBRUc7QUFDSCxTQUFnQiw2QkFBNkIsQ0FDM0MsT0FBZ0IsRUFDaEIsQ0FBa0IsRUFDbEIsR0FBVztJQUVYLHdGQUF3RjtJQUN4RiwyRkFBMkY7SUFDM0Ysb0VBQW9FO0lBQ3BFLEVBQUU7SUFDRix1REFBdUQ7SUFDdkQsd0VBQXdFO0lBQ3hFLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssaUJBQWlCLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUN6RSxNQUFNLGVBQWUsR0FBd0IsR0FBMEIsQ0FBQztRQUN4RSxNQUFNLGNBQWMsR0FBYSxFQUFFLENBQUM7UUFFcEMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDdkMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzFCLGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDN0Q7aUJBQU07Z0JBQ0wsMkVBQTJFO2dCQUMzRSxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzlCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQztLQUNqRTtJQUVELE1BQU0sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQTVCRCxzRUE0QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlLCBSZXF1ZXN0LCBSZXNwb25zZVRvb2xraXQsIFNlcnZlciwgU2VydmVyT3B0aW9ucywgVXRpbCB9IGZyb20gJ2hhcGknO1xuaW1wb3J0IEhvZWsgZnJvbSAnaG9layc7XG5pbXBvcnQgeyBTZXJ2ZXJPcHRpb25zIGFzIFRMU09wdGlvbnMgfSBmcm9tICdodHRwcyc7XG5pbXBvcnQgeyBWYWxpZGF0aW9uRXJyb3IgfSBmcm9tICdqb2knO1xuaW1wb3J0IHsgSHR0cENvbmZpZyB9IGZyb20gJy4vaHR0cF9jb25maWcnO1xuXG4vKipcbiAqIENvbnZlcnRzIEtpYmFuYSBgSHR0cENvbmZpZ2AgaW50byBgU2VydmVyT3B0aW9uc2AgdGhhdCBhcmUgYWNjZXB0ZWQgYnkgdGhlIEhhcGkgc2VydmVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VydmVyT3B0aW9ucyhjb25maWc6IEh0dHBDb25maWcsIHsgY29uZmlndXJlVExTID0gdHJ1ZSB9ID0ge30pIHtcbiAgLy8gTm90ZSB0aGF0IGFsbCBjb25uZWN0aW9uIG9wdGlvbnMgY29uZmlndXJlZCBoZXJlIHNob3VsZCBiZSBleGFjdGx5IHRoZSBzYW1lXG4gIC8vIGFzIGluIHRoZSBsZWdhY3kgcGxhdGZvcm0gc2VydmVyIChzZWUgYHNyYy9zZXJ2ZXIvaHR0cC9pbmRleGApLiBBbnkgY2hhbmdlXG4gIC8vIFNIT1VMRCBCRSBhcHBsaWVkIGluIGJvdGggcGxhY2VzLiBUaGUgb25seSBleGNlcHRpb24gaXMgVExTLXNwZWNpZmljIG9wdGlvbnMsXG4gIC8vIHRoYXQgYXJlIGNvbmZpZ3VyZWQgb25seSBoZXJlLlxuICBjb25zdCBvcHRpb25zOiBTZXJ2ZXJPcHRpb25zID0ge1xuICAgIGhvc3Q6IGNvbmZpZy5ob3N0LFxuICAgIHBvcnQ6IGNvbmZpZy5wb3J0LFxuICAgIHJvdXRlczoge1xuICAgICAgY29yczogY29uZmlnLmNvcnMsXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIG1heEJ5dGVzOiBjb25maWcubWF4UGF5bG9hZC5nZXRWYWx1ZUluQnl0ZXMoKSxcbiAgICAgIH0sXG4gICAgICB2YWxpZGF0ZToge1xuICAgICAgICBmYWlsQWN0aW9uOiBkZWZhdWx0VmFsaWRhdGlvbkVycm9ySGFuZGxlcixcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGFib3J0RWFybHk6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHN0YXRlOiB7XG4gICAgICBzdHJpY3RIZWFkZXI6IGZhbHNlLFxuICAgICAgaXNIdHRwT25seTogdHJ1ZSxcbiAgICAgIGlzU2FtZVNpdGU6IGZhbHNlLCAvLyBuZWNlc3NhcnkgdG8gYWxsb3cgdXNpbmcgS2liYW5hIGluc2lkZSBhbiBpZnJhbWVcbiAgICB9LFxuICB9O1xuXG4gIGlmIChjb25maWd1cmVUTFMgJiYgY29uZmlnLnNzbC5lbmFibGVkKSB7XG4gICAgY29uc3Qgc3NsID0gY29uZmlnLnNzbDtcblxuICAgIC8vIFRPRE86IEhhcGkgdHlwZXMgaGF2ZSBhIHR5cG8gaW4gYHRsc2AgcHJvcGVydHkgdHlwZSBkZWZpbml0aW9uOiBgaHR0cHMuUmVxdWVzdE9wdGlvbnNgIGlzIHVzZWQgaW5zdGVhZCBvZlxuICAgIC8vIGBodHRwcy5TZXJ2ZXJPcHRpb25zYCwgYW5kIGBob25vckNpcGhlck9yZGVyYCBpc24ndCBwcmVzZW50ZWQgaW4gYGh0dHBzLlJlcXVlc3RPcHRpb25zYC5cbiAgICBjb25zdCB0bHNPcHRpb25zOiBUTFNPcHRpb25zID0ge1xuICAgICAgY2E6XG4gICAgICAgIGNvbmZpZy5zc2wuY2VydGlmaWNhdGVBdXRob3JpdGllcyAmJlxuICAgICAgICBjb25maWcuc3NsLmNlcnRpZmljYXRlQXV0aG9yaXRpZXMubWFwKGNhRmlsZVBhdGggPT4gcmVhZEZpbGVTeW5jKGNhRmlsZVBhdGgpKSxcbiAgICAgIGNlcnQ6IHJlYWRGaWxlU3luYyhzc2wuY2VydGlmaWNhdGUhKSxcbiAgICAgIGNpcGhlcnM6IGNvbmZpZy5zc2wuY2lwaGVyU3VpdGVzLmpvaW4oJzonKSxcbiAgICAgIC8vIFdlIHVzZSB0aGUgc2VydmVyJ3MgY2lwaGVyIG9yZGVyIHJhdGhlciB0aGFuIHRoZSBjbGllbnQncyB0byBwcmV2ZW50IHRoZSBCRUFTVCBhdHRhY2suXG4gICAgICBob25vckNpcGhlck9yZGVyOiB0cnVlLFxuICAgICAga2V5OiByZWFkRmlsZVN5bmMoc3NsLmtleSEpLFxuICAgICAgcGFzc3BocmFzZTogc3NsLmtleVBhc3NwaHJhc2UsXG4gICAgICBzZWN1cmVPcHRpb25zOiBzc2wuZ2V0U2VjdXJlT3B0aW9ucygpLFxuICAgIH07XG5cbiAgICBvcHRpb25zLnRscyA9IHRsc09wdGlvbnM7XG4gIH1cblxuICByZXR1cm4gb3B0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNlcnZlcihvcHRpb25zOiBTZXJ2ZXJPcHRpb25zKSB7XG4gIGNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIob3B0aW9ucyk7XG5cbiAgLy8gUmV2ZXJ0IHRvIHByZXZpb3VzIDEyMCBzZWNvbmRzIGtlZXAtYWxpdmUgdGltZW91dCBpbiBOb2RlIDwgOC5cbiAgc2VydmVyLmxpc3RlbmVyLmtlZXBBbGl2ZVRpbWVvdXQgPSAxMjBlMztcbiAgc2VydmVyLmxpc3RlbmVyLm9uKCdjbGllbnRFcnJvcicsIChlcnIsIHNvY2tldCkgPT4ge1xuICAgIGlmIChzb2NrZXQud3JpdGFibGUpIHtcbiAgICAgIHNvY2tldC5lbmQoQnVmZmVyLmZyb20oJ0hUVFAvMS4xIDQwMCBCYWQgUmVxdWVzdFxcclxcblxcclxcbicsICdhc2NpaScpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc29ja2V0LmRlc3Ryb3koZXJyKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBzZXJ2ZXI7XG59XG5cbi8qKlxuICogSGFwaSBleHRlbmRzIHRoZSBWYWxpZGF0aW9uRXJyb3IgaW50ZXJmYWNlIHRvIGFkZCB0aGlzIG91dHB1dCBrZXkgd2l0aCBtb3JlIGRhdGEuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSGFwaVZhbGlkYXRpb25FcnJvciBleHRlbmRzIFZhbGlkYXRpb25FcnJvciB7XG4gIG91dHB1dDoge1xuICAgIHN0YXR1c0NvZGU6IG51bWJlcjtcbiAgICBoZWFkZXJzOiBVdGlsLkRpY3Rpb25hcnk8c3RyaW5nIHwgc3RyaW5nW10+O1xuICAgIHBheWxvYWQ6IHtcbiAgICAgIHN0YXR1c0NvZGU6IG51bWJlcjtcbiAgICAgIGVycm9yOiBzdHJpbmc7XG4gICAgICBtZXNzYWdlPzogc3RyaW5nO1xuICAgICAgdmFsaWRhdGlvbjoge1xuICAgICAgICBzb3VyY2U6IHN0cmluZztcbiAgICAgICAga2V5czogc3RyaW5nW107XG4gICAgICB9O1xuICAgIH07XG4gIH07XG59XG5cbi8qKlxuICogVXNlZCB0byByZXBsaWNhdGUgSGFwaSB2MTYgYW5kIGJlbG93J3MgdmFsaWRhdGlvbiByZXNwb25zZXMuIFNob3VsZCBiZSB1c2VkIGluIHRoZSByb3V0ZXMudmFsaWRhdGUuZmFpbEFjdGlvbiBrZXkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0VmFsaWRhdGlvbkVycm9ySGFuZGxlcihcbiAgcmVxdWVzdDogUmVxdWVzdCxcbiAgaDogUmVzcG9uc2VUb29sa2l0LFxuICBlcnI/OiBFcnJvclxuKTogTGlmZWN5Y2xlLlJldHVyblZhbHVlIHtcbiAgLy8gTmV3ZXIgdmVyc2lvbnMgb2YgSm9pIGRvbid0IGZvcm1hdCB0aGUga2V5IGZvciBtaXNzaW5nIHBhcmFtcyB0aGUgc2FtZSB3YXkuIFRoaXMgc2hpbVxuICAvLyBwcm92aWRlcyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS4gVW5mb3J0dW5hdGVseSwgSm9pIGRvZXNuJ3QgZXhwb3J0IGl0J3Mgb3duIEVycm9yIGNsYXNzXG4gIC8vIGluIEpTIHNvIHdlIGhhdmUgdG8gcmVseSBvbiB0aGUgYG5hbWVgIGtleSBiZWZvcmUgd2UgY2FuIGNhc3QgaXQuXG4gIC8vXG4gIC8vIFRoZSBIYXBpIGNvZGUgd2UncmUgJ292ZXJ3cml0aW5nJyBjYW4gYmUgZm91bmQgaGVyZTpcbiAgLy8gICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9oYXBpanMvaGFwaS9ibG9iL21hc3Rlci9saWIvdmFsaWRhdGlvbi5qcyNMMTAyXG4gIGlmIChlcnIgJiYgZXJyLm5hbWUgPT09ICdWYWxpZGF0aW9uRXJyb3InICYmIGVyci5oYXNPd25Qcm9wZXJ0eSgnb3V0cHV0JykpIHtcbiAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3I6IEhhcGlWYWxpZGF0aW9uRXJyb3IgPSBlcnIgYXMgSGFwaVZhbGlkYXRpb25FcnJvcjtcbiAgICBjb25zdCB2YWxpZGF0aW9uS2V5czogc3RyaW5nW10gPSBbXTtcblxuICAgIHZhbGlkYXRpb25FcnJvci5kZXRhaWxzLmZvckVhY2goZGV0YWlsID0+IHtcbiAgICAgIGlmIChkZXRhaWwucGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhbGlkYXRpb25LZXlzLnB1c2goSG9lay5lc2NhcGVIdG1sKGRldGFpbC5wYXRoLmpvaW4oJy4nKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWYgbm8gcGF0aCwgdXNlIHRoZSB2YWx1ZSBzaWdpbCB0byBzaWduYWwgdGhlIGVudGlyZSB2YWx1ZSBoYWQgYW4gaXNzdWUuXG4gICAgICAgIHZhbGlkYXRpb25LZXlzLnB1c2goJ3ZhbHVlJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YWxpZGF0aW9uRXJyb3Iub3V0cHV0LnBheWxvYWQudmFsaWRhdGlvbi5rZXlzID0gdmFsaWRhdGlvbktleXM7XG4gIH1cblxuICB0aHJvdyBlcnI7XG59XG4iXX0=