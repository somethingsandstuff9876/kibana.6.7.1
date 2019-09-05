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
const https_1 = require("https");
const lodash_1 = require("lodash");
const http_tools_1 = require("./http_tools");
const alphabet = 'abcdefghijklmnopqrztuvwxyz'.split('');
class BasePathProxyServer {
    constructor(log, httpConfig, devConfig) {
        this.log = log;
        this.httpConfig = httpConfig;
        this.devConfig = devConfig;
        const ONE_GIGABYTE = 1024 * 1024 * 1024;
        httpConfig.maxPayload = new config_schema_1.ByteSizeValue(ONE_GIGABYTE);
        if (!httpConfig.basePath) {
            httpConfig.basePath = `/${lodash_1.sample(alphabet, 3).join('')}`;
        }
    }
    get basePath() {
        return this.httpConfig.basePath;
    }
    get targetPort() {
        return this.devConfig.basePathProxyTargetPort;
    }
    async start(options) {
        this.log.debug('starting basepath proxy server');
        const serverOptions = http_tools_1.getServerOptions(this.httpConfig);
        this.server = http_tools_1.createServer(serverOptions);
        // Register hapi plugin that adds proxying functionality. It can be configured
        // through the route configuration object (see { handler: { proxy: ... } }).
        await this.server.register({ plugin: require('h2o2') });
        if (this.httpConfig.ssl.enabled) {
            const tlsOptions = serverOptions.tls;
            this.httpsAgent = new https_1.Agent({
                ca: tlsOptions.ca,
                cert: tlsOptions.cert,
                key: tlsOptions.key,
                passphrase: tlsOptions.passphrase,
                rejectUnauthorized: false,
            });
        }
        this.setupRoutes(options);
        await this.server.start();
        this.log.info(`basepath proxy server running at ${this.server.info.uri}${this.httpConfig.basePath}`);
    }
    async stop() {
        if (this.server === undefined) {
            return;
        }
        this.log.debug('stopping basepath proxy server');
        await this.server.stop();
        this.server = undefined;
        if (this.httpsAgent !== undefined) {
            this.httpsAgent.destroy();
            this.httpsAgent = undefined;
        }
    }
    setupRoutes({ blockUntil, shouldRedirectFromOldBasePath, }) {
        if (this.server === undefined) {
            throw new Error(`Routes cannot be set up since server is not initialized.`);
        }
        // Always redirect from root URL to the URL with basepath.
        this.server.route({
            handler: (request, responseToolkit) => {
                return responseToolkit.redirect(this.httpConfig.basePath);
            },
            method: 'GET',
            path: '/',
        });
        this.server.route({
            handler: {
                proxy: {
                    agent: this.httpsAgent,
                    host: this.server.info.host,
                    passThrough: true,
                    port: this.devConfig.basePathProxyTargetPort,
                    protocol: this.server.info.protocol,
                    xforward: true,
                },
            },
            method: '*',
            options: {
                pre: [
                    // Before we proxy request to a target port we may want to wait until some
                    // condition is met (e.g. until target listener is ready).
                    async (request, responseToolkit) => {
                        await blockUntil();
                        return responseToolkit.continue;
                    },
                ],
            },
            path: `${this.httpConfig.basePath}/{kbnPath*}`,
        });
        // It may happen that basepath has changed, but user still uses the old one,
        // so we can try to check if that's the case and just redirect user to the
        // same URL, but with valid basepath.
        this.server.route({
            handler: (request, responseToolkit) => {
                const { oldBasePath, kbnPath = '' } = request.params;
                const isGet = request.method === 'get';
                const isBasepathLike = oldBasePath.length === 3;
                return isGet && isBasepathLike && shouldRedirectFromOldBasePath(kbnPath)
                    ? responseToolkit.redirect(`${this.httpConfig.basePath}/${kbnPath}`)
                    : responseToolkit.response('Not Found').code(404);
            },
            method: '*',
            path: `/{oldBasePath}/{kbnPath*}`,
        });
    }
}
exports.BasePathProxyServer = BasePathProxyServer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2h0dHAvYmFzZV9wYXRoX3Byb3h5X3NlcnZlci50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2h0dHAvYmFzZV9wYXRoX3Byb3h5X3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOztBQUVILHNEQUFtRDtBQUVuRCxpQ0FBeUU7QUFDekUsbUNBQWdDO0FBSWhDLDZDQUE4RDtBQUU5RCxNQUFNLFFBQVEsR0FBRyw0QkFBNEIsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFPeEQsTUFBYSxtQkFBbUI7SUFZOUIsWUFDbUIsR0FBVyxFQUNYLFVBQXNCLEVBQ3RCLFNBQW9CO1FBRnBCLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFDWCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFFckMsTUFBTSxZQUFZLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7UUFDeEMsVUFBVSxDQUFDLFVBQVUsR0FBRyxJQUFJLDZCQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFeEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUU7WUFDeEIsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLGVBQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDMUQ7SUFDSCxDQUFDO0lBbkJELElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7SUFDbEMsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQztJQUNoRCxDQUFDO0lBZU0sS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUE2QztRQUM5RCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBRWpELE1BQU0sYUFBYSxHQUFHLDZCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsTUFBTSxHQUFHLHlCQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFMUMsOEVBQThFO1FBQzlFLDRFQUE0RTtRQUM1RSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFeEQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUU7WUFDL0IsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLEdBQWlCLENBQUM7WUFDbkQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGFBQVUsQ0FBQztnQkFDL0IsRUFBRSxFQUFFLFVBQVUsQ0FBQyxFQUFFO2dCQUNqQixJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUk7Z0JBQ3JCLEdBQUcsRUFBRSxVQUFVLENBQUMsR0FBRztnQkFDbkIsVUFBVSxFQUFFLFVBQVUsQ0FBQyxVQUFVO2dCQUNqQyxrQkFBa0IsRUFBRSxLQUFLO2FBQzFCLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxQixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQ1gsb0NBQW9DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUN0RixDQUFDO0lBQ0osQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJO1FBQ2YsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUM3QixPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztRQUV4QixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBRU8sV0FBVyxDQUFDLEVBQ2xCLFVBQVUsRUFDViw2QkFBNkIsR0FDUTtRQUNyQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztTQUM3RTtRQUVELDBEQUEwRDtRQUMxRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNoQixPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLEVBQUU7Z0JBQ3BDLE9BQU8sZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVELENBQUM7WUFDRCxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBRSxHQUFHO1NBQ1YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDaEIsT0FBTyxFQUFFO2dCQUNQLEtBQUssRUFBRTtvQkFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVU7b0JBQ3RCLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJO29CQUMzQixXQUFXLEVBQUUsSUFBSTtvQkFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQXVCO29CQUM1QyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUTtvQkFDbkMsUUFBUSxFQUFFLElBQUk7aUJBQ2Y7YUFDRjtZQUNELE1BQU0sRUFBRSxHQUFHO1lBQ1gsT0FBTyxFQUFFO2dCQUNQLEdBQUcsRUFBRTtvQkFDSCwwRUFBMEU7b0JBQzFFLDBEQUEwRDtvQkFDMUQsS0FBSyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsRUFBRTt3QkFDakMsTUFBTSxVQUFVLEVBQUUsQ0FBQzt3QkFDbkIsT0FBTyxlQUFlLENBQUMsUUFBUSxDQUFDO29CQUNsQyxDQUFDO2lCQUNGO2FBQ0Y7WUFDRCxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsYUFBYTtTQUMvQyxDQUFDLENBQUM7UUFFSCw0RUFBNEU7UUFDNUUsMEVBQTBFO1FBQzFFLHFDQUFxQztRQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNoQixPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLEVBQUU7Z0JBQ3BDLE1BQU0sRUFBRSxXQUFXLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0JBRXJELE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDO2dCQUN2QyxNQUFNLGNBQWMsR0FBRyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztnQkFFaEQsT0FBTyxLQUFLLElBQUksY0FBYyxJQUFJLDZCQUE2QixDQUFDLE9BQU8sQ0FBQztvQkFDdEUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsSUFBSSxPQUFPLEVBQUUsQ0FBQztvQkFDcEUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RELENBQUM7WUFDRCxNQUFNLEVBQUUsR0FBRztZQUNYLElBQUksRUFBRSwyQkFBMkI7U0FDbEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBbElELGtEQWtJQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBCeXRlU2l6ZVZhbHVlIH0gZnJvbSAnQGtibi9jb25maWctc2NoZW1hJztcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJ2hhcGknO1xuaW1wb3J0IHsgQWdlbnQgYXMgSHR0cHNBZ2VudCwgU2VydmVyT3B0aW9ucyBhcyBUbHNPcHRpb25zIH0gZnJvbSAnaHR0cHMnO1xuaW1wb3J0IHsgc2FtcGxlIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IERldkNvbmZpZyB9IGZyb20gJy4uL2Rldic7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi9sb2dnaW5nJztcbmltcG9ydCB7IEh0dHBDb25maWcgfSBmcm9tICcuL2h0dHBfY29uZmlnJztcbmltcG9ydCB7IGNyZWF0ZVNlcnZlciwgZ2V0U2VydmVyT3B0aW9ucyB9IGZyb20gJy4vaHR0cF90b29scyc7XG5cbmNvbnN0IGFscGhhYmV0ID0gJ2FiY2RlZmdoaWprbG1ub3Bxcnp0dXZ3eHl6Jy5zcGxpdCgnJyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFzZVBhdGhQcm94eVNlcnZlck9wdGlvbnMge1xuICBzaG91bGRSZWRpcmVjdEZyb21PbGRCYXNlUGF0aDogKHBhdGg6IHN0cmluZykgPT4gYm9vbGVhbjtcbiAgYmxvY2tVbnRpbDogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIEJhc2VQYXRoUHJveHlTZXJ2ZXIge1xuICBwcml2YXRlIHNlcnZlcj86IFNlcnZlcjtcbiAgcHJpdmF0ZSBodHRwc0FnZW50PzogSHR0cHNBZ2VudDtcblxuICBnZXQgYmFzZVBhdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cENvbmZpZy5iYXNlUGF0aDtcbiAgfVxuXG4gIGdldCB0YXJnZXRQb3J0KCkge1xuICAgIHJldHVybiB0aGlzLmRldkNvbmZpZy5iYXNlUGF0aFByb3h5VGFyZ2V0UG9ydDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbG9nOiBMb2dnZXIsXG4gICAgcHJpdmF0ZSByZWFkb25seSBodHRwQ29uZmlnOiBIdHRwQ29uZmlnLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGV2Q29uZmlnOiBEZXZDb25maWdcbiAgKSB7XG4gICAgY29uc3QgT05FX0dJR0FCWVRFID0gMTAyNCAqIDEwMjQgKiAxMDI0O1xuICAgIGh0dHBDb25maWcubWF4UGF5bG9hZCA9IG5ldyBCeXRlU2l6ZVZhbHVlKE9ORV9HSUdBQllURSk7XG5cbiAgICBpZiAoIWh0dHBDb25maWcuYmFzZVBhdGgpIHtcbiAgICAgIGh0dHBDb25maWcuYmFzZVBhdGggPSBgLyR7c2FtcGxlKGFscGhhYmV0LCAzKS5qb2luKCcnKX1gO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzdGFydChvcHRpb25zOiBSZWFkb25seTxCYXNlUGF0aFByb3h5U2VydmVyT3B0aW9ucz4pIHtcbiAgICB0aGlzLmxvZy5kZWJ1Zygnc3RhcnRpbmcgYmFzZXBhdGggcHJveHkgc2VydmVyJyk7XG5cbiAgICBjb25zdCBzZXJ2ZXJPcHRpb25zID0gZ2V0U2VydmVyT3B0aW9ucyh0aGlzLmh0dHBDb25maWcpO1xuICAgIHRoaXMuc2VydmVyID0gY3JlYXRlU2VydmVyKHNlcnZlck9wdGlvbnMpO1xuXG4gICAgLy8gUmVnaXN0ZXIgaGFwaSBwbHVnaW4gdGhhdCBhZGRzIHByb3h5aW5nIGZ1bmN0aW9uYWxpdHkuIEl0IGNhbiBiZSBjb25maWd1cmVkXG4gICAgLy8gdGhyb3VnaCB0aGUgcm91dGUgY29uZmlndXJhdGlvbiBvYmplY3QgKHNlZSB7IGhhbmRsZXI6IHsgcHJveHk6IC4uLiB9IH0pLlxuICAgIGF3YWl0IHRoaXMuc2VydmVyLnJlZ2lzdGVyKHsgcGx1Z2luOiByZXF1aXJlKCdoMm8yJykgfSk7XG5cbiAgICBpZiAodGhpcy5odHRwQ29uZmlnLnNzbC5lbmFibGVkKSB7XG4gICAgICBjb25zdCB0bHNPcHRpb25zID0gc2VydmVyT3B0aW9ucy50bHMgYXMgVGxzT3B0aW9ucztcbiAgICAgIHRoaXMuaHR0cHNBZ2VudCA9IG5ldyBIdHRwc0FnZW50KHtcbiAgICAgICAgY2E6IHRsc09wdGlvbnMuY2EsXG4gICAgICAgIGNlcnQ6IHRsc09wdGlvbnMuY2VydCxcbiAgICAgICAga2V5OiB0bHNPcHRpb25zLmtleSxcbiAgICAgICAgcGFzc3BocmFzZTogdGxzT3B0aW9ucy5wYXNzcGhyYXNlLFxuICAgICAgICByZWplY3RVbmF1dGhvcml6ZWQ6IGZhbHNlLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXR1cFJvdXRlcyhvcHRpb25zKTtcblxuICAgIGF3YWl0IHRoaXMuc2VydmVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLmxvZy5pbmZvKFxuICAgICAgYGJhc2VwYXRoIHByb3h5IHNlcnZlciBydW5uaW5nIGF0ICR7dGhpcy5zZXJ2ZXIuaW5mby51cml9JHt0aGlzLmh0dHBDb25maWcuYmFzZVBhdGh9YFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5zZXJ2ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubG9nLmRlYnVnKCdzdG9wcGluZyBiYXNlcGF0aCBwcm94eSBzZXJ2ZXInKTtcbiAgICBhd2FpdCB0aGlzLnNlcnZlci5zdG9wKCk7XG4gICAgdGhpcy5zZXJ2ZXIgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAodGhpcy5odHRwc0FnZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuaHR0cHNBZ2VudC5kZXN0cm95KCk7XG4gICAgICB0aGlzLmh0dHBzQWdlbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXR1cFJvdXRlcyh7XG4gICAgYmxvY2tVbnRpbCxcbiAgICBzaG91bGRSZWRpcmVjdEZyb21PbGRCYXNlUGF0aCxcbiAgfTogUmVhZG9ubHk8QmFzZVBhdGhQcm94eVNlcnZlck9wdGlvbnM+KSB7XG4gICAgaWYgKHRoaXMuc2VydmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUm91dGVzIGNhbm5vdCBiZSBzZXQgdXAgc2luY2Ugc2VydmVyIGlzIG5vdCBpbml0aWFsaXplZC5gKTtcbiAgICB9XG5cbiAgICAvLyBBbHdheXMgcmVkaXJlY3QgZnJvbSByb290IFVSTCB0byB0aGUgVVJMIHdpdGggYmFzZXBhdGguXG4gICAgdGhpcy5zZXJ2ZXIucm91dGUoe1xuICAgICAgaGFuZGxlcjogKHJlcXVlc3QsIHJlc3BvbnNlVG9vbGtpdCkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VUb29sa2l0LnJlZGlyZWN0KHRoaXMuaHR0cENvbmZpZy5iYXNlUGF0aCk7XG4gICAgICB9LFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHBhdGg6ICcvJyxcbiAgICB9KTtcblxuICAgIHRoaXMuc2VydmVyLnJvdXRlKHtcbiAgICAgIGhhbmRsZXI6IHtcbiAgICAgICAgcHJveHk6IHtcbiAgICAgICAgICBhZ2VudDogdGhpcy5odHRwc0FnZW50LFxuICAgICAgICAgIGhvc3Q6IHRoaXMuc2VydmVyLmluZm8uaG9zdCxcbiAgICAgICAgICBwYXNzVGhyb3VnaDogdHJ1ZSxcbiAgICAgICAgICBwb3J0OiB0aGlzLmRldkNvbmZpZy5iYXNlUGF0aFByb3h5VGFyZ2V0UG9ydCxcbiAgICAgICAgICBwcm90b2NvbDogdGhpcy5zZXJ2ZXIuaW5mby5wcm90b2NvbCxcbiAgICAgICAgICB4Zm9yd2FyZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBtZXRob2Q6ICcqJyxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgcHJlOiBbXG4gICAgICAgICAgLy8gQmVmb3JlIHdlIHByb3h5IHJlcXVlc3QgdG8gYSB0YXJnZXQgcG9ydCB3ZSBtYXkgd2FudCB0byB3YWl0IHVudGlsIHNvbWVcbiAgICAgICAgICAvLyBjb25kaXRpb24gaXMgbWV0IChlLmcuIHVudGlsIHRhcmdldCBsaXN0ZW5lciBpcyByZWFkeSkuXG4gICAgICAgICAgYXN5bmMgKHJlcXVlc3QsIHJlc3BvbnNlVG9vbGtpdCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgYmxvY2tVbnRpbCgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlVG9vbGtpdC5jb250aW51ZTtcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHBhdGg6IGAke3RoaXMuaHR0cENvbmZpZy5iYXNlUGF0aH0ve2tiblBhdGgqfWAsXG4gICAgfSk7XG5cbiAgICAvLyBJdCBtYXkgaGFwcGVuIHRoYXQgYmFzZXBhdGggaGFzIGNoYW5nZWQsIGJ1dCB1c2VyIHN0aWxsIHVzZXMgdGhlIG9sZCBvbmUsXG4gICAgLy8gc28gd2UgY2FuIHRyeSB0byBjaGVjayBpZiB0aGF0J3MgdGhlIGNhc2UgYW5kIGp1c3QgcmVkaXJlY3QgdXNlciB0byB0aGVcbiAgICAvLyBzYW1lIFVSTCwgYnV0IHdpdGggdmFsaWQgYmFzZXBhdGguXG4gICAgdGhpcy5zZXJ2ZXIucm91dGUoe1xuICAgICAgaGFuZGxlcjogKHJlcXVlc3QsIHJlc3BvbnNlVG9vbGtpdCkgPT4ge1xuICAgICAgICBjb25zdCB7IG9sZEJhc2VQYXRoLCBrYm5QYXRoID0gJycgfSA9IHJlcXVlc3QucGFyYW1zO1xuXG4gICAgICAgIGNvbnN0IGlzR2V0ID0gcmVxdWVzdC5tZXRob2QgPT09ICdnZXQnO1xuICAgICAgICBjb25zdCBpc0Jhc2VwYXRoTGlrZSA9IG9sZEJhc2VQYXRoLmxlbmd0aCA9PT0gMztcblxuICAgICAgICByZXR1cm4gaXNHZXQgJiYgaXNCYXNlcGF0aExpa2UgJiYgc2hvdWxkUmVkaXJlY3RGcm9tT2xkQmFzZVBhdGgoa2JuUGF0aClcbiAgICAgICAgICA/IHJlc3BvbnNlVG9vbGtpdC5yZWRpcmVjdChgJHt0aGlzLmh0dHBDb25maWcuYmFzZVBhdGh9LyR7a2JuUGF0aH1gKVxuICAgICAgICAgIDogcmVzcG9uc2VUb29sa2l0LnJlc3BvbnNlKCdOb3QgRm91bmQnKS5jb2RlKDQwNCk7XG4gICAgICB9LFxuICAgICAgbWV0aG9kOiAnKicsXG4gICAgICBwYXRoOiBgL3tvbGRCYXNlUGF0aH0ve2tiblBhdGgqfWAsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==