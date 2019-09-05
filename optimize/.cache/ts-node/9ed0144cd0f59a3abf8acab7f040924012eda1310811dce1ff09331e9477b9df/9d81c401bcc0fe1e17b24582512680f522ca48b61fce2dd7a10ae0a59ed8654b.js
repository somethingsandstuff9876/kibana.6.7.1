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
const url_1 = require("url");
const http_tools_1 = require("./http_tools");
class HttpsRedirectServer {
    constructor(log) {
        this.log = log;
    }
    async start(config) {
        this.log.debug('starting http --> https redirect server');
        if (!config.ssl.enabled || config.ssl.redirectHttpFromPort === undefined) {
            throw new Error('Redirect server cannot be started when [ssl.enabled] is set to `false`' +
                ' or [ssl.redirectHttpFromPort] is not specified.');
        }
        // Redirect server is configured in the same way as any other HTTP server
        // within the platform with the only exception that it should always be a
        // plain HTTP server, so we just ignore `tls` part of options.
        this.server = http_tools_1.createServer({
            ...http_tools_1.getServerOptions(config, { configureTLS: false }),
            port: config.ssl.redirectHttpFromPort,
        });
        this.server.ext('onRequest', (request, responseToolkit) => {
            return responseToolkit
                .redirect(url_1.format({
                hostname: config.host,
                pathname: request.url.pathname,
                port: config.port,
                protocol: 'https',
                search: request.url.search,
            }))
                .takeover();
        });
        try {
            await this.server.start();
            this.log.debug(`http --> https redirect server running at ${this.server.info.uri}`);
        }
        catch (err) {
            if (err.code === 'EADDRINUSE') {
                throw new Error('The redirect server failed to start up because port ' +
                    `${config.ssl.redirectHttpFromPort} is already in use. Ensure the port specified ` +
                    'in `server.ssl.redirectHttpFromPort` is available.');
            }
            else {
                throw err;
            }
        }
    }
    async stop() {
        if (this.server === undefined) {
            return;
        }
        this.log.debug('stopping http --> https redirect server');
        await this.server.stop();
        this.server = undefined;
    }
}
exports.HttpsRedirectServer = HttpsRedirectServer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2h0dHAvaHR0cHNfcmVkaXJlY3Rfc2VydmVyLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS9zcmMvY29yZS9zZXJ2ZXIvaHR0cC9odHRwc19yZWRpcmVjdF9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRzs7QUFHSCw2QkFBMEM7QUFJMUMsNkNBQThEO0FBRTlELE1BQWEsbUJBQW1CO0lBRzlCLFlBQTZCLEdBQVc7UUFBWCxRQUFHLEdBQUgsR0FBRyxDQUFRO0lBQUcsQ0FBQztJQUVyQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQWtCO1FBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7UUFFMUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEtBQUssU0FBUyxFQUFFO1lBQ3hFLE1BQU0sSUFBSSxLQUFLLENBQ2Isd0VBQXdFO2dCQUN0RSxrREFBa0QsQ0FDckQsQ0FBQztTQUNIO1FBRUQseUVBQXlFO1FBQ3pFLHlFQUF5RTtRQUN6RSw4REFBOEQ7UUFDOUQsSUFBSSxDQUFDLE1BQU0sR0FBRyx5QkFBWSxDQUFDO1lBQ3pCLEdBQUcsNkJBQWdCLENBQUMsTUFBTSxFQUFFLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxDQUFDO1lBQ3BELElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQjtTQUN0QyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFnQixFQUFFLGVBQWdDLEVBQUUsRUFBRTtZQUNsRixPQUFPLGVBQWU7aUJBQ25CLFFBQVEsQ0FDUCxZQUFTLENBQUM7Z0JBQ1IsUUFBUSxFQUFFLE1BQU0sQ0FBQyxJQUFJO2dCQUNyQixRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRO2dCQUM5QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7Z0JBQ2pCLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNO2FBQzNCLENBQUMsQ0FDSDtpQkFDQSxRQUFRLEVBQUUsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztRQUVILElBQUk7WUFDRixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsNkNBQTZDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDckY7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxZQUFZLEVBQUU7Z0JBQzdCLE1BQU0sSUFBSSxLQUFLLENBQ2Isc0RBQXNEO29CQUNwRCxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLGdEQUFnRDtvQkFDbEYsb0RBQW9ELENBQ3ZELENBQUM7YUFDSDtpQkFBTTtnQkFDTCxNQUFNLEdBQUcsQ0FBQzthQUNYO1NBQ0Y7SUFDSCxDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUk7UUFDZixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQzdCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7UUFDMUQsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0lBQzFCLENBQUM7Q0FDRjtBQTlERCxrREE4REMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZSBvciBtb3JlIGNvbnRyaWJ1dG9yXG4gKiBsaWNlbnNlIGFncmVlbWVudHMuIFNlZSB0aGUgTk9USUNFIGZpbGUgZGlzdHJpYnV0ZWQgd2l0aFxuICogdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHJlZ2FyZGluZyBjb3B5cmlnaHRcbiAqIG93bmVyc2hpcC4gRWxhc3RpY3NlYXJjaCBCLlYuIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXJcbiAqIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXlcbiAqIG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2VUb29sa2l0LCBTZXJ2ZXIgfSBmcm9tICdoYXBpJztcbmltcG9ydCB7IGZvcm1hdCBhcyBmb3JtYXRVcmwgfSBmcm9tICd1cmwnO1xuXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi9sb2dnaW5nJztcbmltcG9ydCB7IEh0dHBDb25maWcgfSBmcm9tICcuL2h0dHBfY29uZmlnJztcbmltcG9ydCB7IGNyZWF0ZVNlcnZlciwgZ2V0U2VydmVyT3B0aW9ucyB9IGZyb20gJy4vaHR0cF90b29scyc7XG5cbmV4cG9ydCBjbGFzcyBIdHRwc1JlZGlyZWN0U2VydmVyIHtcbiAgcHJpdmF0ZSBzZXJ2ZXI/OiBTZXJ2ZXI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBsb2c6IExvZ2dlcikge31cblxuICBwdWJsaWMgYXN5bmMgc3RhcnQoY29uZmlnOiBIdHRwQ29uZmlnKSB7XG4gICAgdGhpcy5sb2cuZGVidWcoJ3N0YXJ0aW5nIGh0dHAgLS0+IGh0dHBzIHJlZGlyZWN0IHNlcnZlcicpO1xuXG4gICAgaWYgKCFjb25maWcuc3NsLmVuYWJsZWQgfHwgY29uZmlnLnNzbC5yZWRpcmVjdEh0dHBGcm9tUG9ydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdSZWRpcmVjdCBzZXJ2ZXIgY2Fubm90IGJlIHN0YXJ0ZWQgd2hlbiBbc3NsLmVuYWJsZWRdIGlzIHNldCB0byBgZmFsc2VgJyArXG4gICAgICAgICAgJyBvciBbc3NsLnJlZGlyZWN0SHR0cEZyb21Qb3J0XSBpcyBub3Qgc3BlY2lmaWVkLidcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gUmVkaXJlY3Qgc2VydmVyIGlzIGNvbmZpZ3VyZWQgaW4gdGhlIHNhbWUgd2F5IGFzIGFueSBvdGhlciBIVFRQIHNlcnZlclxuICAgIC8vIHdpdGhpbiB0aGUgcGxhdGZvcm0gd2l0aCB0aGUgb25seSBleGNlcHRpb24gdGhhdCBpdCBzaG91bGQgYWx3YXlzIGJlIGFcbiAgICAvLyBwbGFpbiBIVFRQIHNlcnZlciwgc28gd2UganVzdCBpZ25vcmUgYHRsc2AgcGFydCBvZiBvcHRpb25zLlxuICAgIHRoaXMuc2VydmVyID0gY3JlYXRlU2VydmVyKHtcbiAgICAgIC4uLmdldFNlcnZlck9wdGlvbnMoY29uZmlnLCB7IGNvbmZpZ3VyZVRMUzogZmFsc2UgfSksXG4gICAgICBwb3J0OiBjb25maWcuc3NsLnJlZGlyZWN0SHR0cEZyb21Qb3J0LFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXJ2ZXIuZXh0KCdvblJlcXVlc3QnLCAocmVxdWVzdDogUmVxdWVzdCwgcmVzcG9uc2VUb29sa2l0OiBSZXNwb25zZVRvb2xraXQpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZVRvb2xraXRcbiAgICAgICAgLnJlZGlyZWN0KFxuICAgICAgICAgIGZvcm1hdFVybCh7XG4gICAgICAgICAgICBob3N0bmFtZTogY29uZmlnLmhvc3QsXG4gICAgICAgICAgICBwYXRobmFtZTogcmVxdWVzdC51cmwucGF0aG5hbWUsXG4gICAgICAgICAgICBwb3J0OiBjb25maWcucG9ydCxcbiAgICAgICAgICAgIHByb3RvY29sOiAnaHR0cHMnLFxuICAgICAgICAgICAgc2VhcmNoOiByZXF1ZXN0LnVybC5zZWFyY2gsXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgICAudGFrZW92ZXIoKTtcbiAgICB9KTtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLnNlcnZlci5zdGFydCgpO1xuICAgICAgdGhpcy5sb2cuZGVidWcoYGh0dHAgLS0+IGh0dHBzIHJlZGlyZWN0IHNlcnZlciBydW5uaW5nIGF0ICR7dGhpcy5zZXJ2ZXIuaW5mby51cml9YCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoZXJyLmNvZGUgPT09ICdFQUREUklOVVNFJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1RoZSByZWRpcmVjdCBzZXJ2ZXIgZmFpbGVkIHRvIHN0YXJ0IHVwIGJlY2F1c2UgcG9ydCAnICtcbiAgICAgICAgICAgIGAke2NvbmZpZy5zc2wucmVkaXJlY3RIdHRwRnJvbVBvcnR9IGlzIGFscmVhZHkgaW4gdXNlLiBFbnN1cmUgdGhlIHBvcnQgc3BlY2lmaWVkIGAgK1xuICAgICAgICAgICAgJ2luIGBzZXJ2ZXIuc3NsLnJlZGlyZWN0SHR0cEZyb21Qb3J0YCBpcyBhdmFpbGFibGUuJ1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzdG9wKCkge1xuICAgIGlmICh0aGlzLnNlcnZlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sb2cuZGVidWcoJ3N0b3BwaW5nIGh0dHAgLS0+IGh0dHBzIHJlZGlyZWN0IHNlcnZlcicpO1xuICAgIGF3YWl0IHRoaXMuc2VydmVyLnN0b3AoKTtcbiAgICB0aGlzLnNlcnZlciA9IHVuZGVmaW5lZDtcbiAgfVxufVxuIl19