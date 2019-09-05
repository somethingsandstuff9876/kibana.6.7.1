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
const utils_1 = require("../../utils");
const http_tools_1 = require("./http_tools");
class HttpServer {
    constructor(log) {
        this.log = log;
        this.registeredRouters = new Set();
    }
    isListening() {
        return this.server !== undefined && this.server.listener.listening;
    }
    registerRouter(router) {
        if (this.isListening()) {
            throw new Error('Routers can be registered only when HTTP server is stopped.');
        }
        this.registeredRouters.add(router);
    }
    async start(config) {
        this.log.debug('starting http server');
        const serverOptions = http_tools_1.getServerOptions(config);
        this.server = http_tools_1.createServer(serverOptions);
        this.setupBasePathRewrite(this.server, config);
        for (const router of this.registeredRouters) {
            for (const route of router.getRoutes()) {
                this.server.route({
                    handler: route.handler,
                    method: route.method,
                    path: this.getRouteFullPath(router.path, route.path),
                });
            }
        }
        await this.server.start();
        this.log.debug(`http server running at ${this.server.info.uri}${config.rewriteBasePath ? config.basePath : ''}`);
        // Return server instance with the connection options so that we can properly
        // bridge core and the "legacy" Kibana internally. Once this bridge isn't
        // needed anymore we shouldn't return anything from this method.
        return { server: this.server, options: serverOptions };
    }
    async stop() {
        if (this.server === undefined) {
            return;
        }
        this.log.debug('stopping http server');
        await this.server.stop();
        this.server = undefined;
    }
    setupBasePathRewrite(server, config) {
        if (config.basePath === undefined || !config.rewriteBasePath) {
            return;
        }
        const basePath = config.basePath;
        server.ext('onRequest', (request, responseToolkit) => {
            const newURL = utils_1.modifyUrl(request.url.href, urlParts => {
                if (urlParts.pathname != null && urlParts.pathname.startsWith(basePath)) {
                    urlParts.pathname = urlParts.pathname.replace(basePath, '') || '/';
                }
                else {
                    return {};
                }
            });
            if (!newURL) {
                return responseToolkit
                    .response('Not Found')
                    .code(404)
                    .takeover();
            }
            request.setUrl(newURL);
            // We should update raw request as well since it can be proxied to the old platform
            // where base path isn't expected.
            request.raw.req.url = request.url.href;
            return responseToolkit.continue;
        });
    }
    getRouteFullPath(routerPath, routePath) {
        // If router's path ends with slash and route's path starts with slash,
        // we should omit one of them to have a valid concatenated path.
        const routePathStartIndex = routerPath.endsWith('/') && routePath.startsWith('/') ? 1 : 0;
        return `${routerPath}${routePath.slice(routePathStartIndex)}`;
    }
}
exports.HttpServer = HttpServer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2h0dHAvaHR0cF9zZXJ2ZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9jb3JlL3NlcnZlci9odHRwL2h0dHBfc2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBSUgsdUNBQXdDO0FBR3hDLDZDQUE4RDtBQVE5RCxNQUFhLFVBQVU7SUFJckIsWUFBNkIsR0FBVztRQUFYLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFGaEMsc0JBQWlCLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUM7SUFFUixDQUFDO0lBRXJDLFdBQVc7UUFDaEIsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7SUFDckUsQ0FBQztJQUVNLGNBQWMsQ0FBQyxNQUFjO1FBQ2xDLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQztTQUNoRjtRQUVELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVNLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBa0I7UUFDbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUV2QyxNQUFNLGFBQWEsR0FBRyw2QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxHQUFHLHlCQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFMUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFL0MsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDM0MsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO29CQUNoQixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87b0JBQ3RCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtvQkFDcEIsSUFBSSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUM7aUJBQ3JELENBQUMsQ0FBQzthQUNKO1NBQ0Y7UUFFRCxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQ1osMEJBQTBCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FDNUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFDN0MsRUFBRSxDQUNILENBQUM7UUFFRiw2RUFBNkU7UUFDN0UseUVBQXlFO1FBQ3pFLGdFQUFnRTtRQUNoRSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFDO0lBQ3pELENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSTtRQUNmLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDN0IsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUN2QyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVPLG9CQUFvQixDQUFDLE1BQWMsRUFBRSxNQUFrQjtRQUM3RCxJQUFJLE1BQU0sQ0FBQyxRQUFRLEtBQUssU0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRTtZQUM1RCxPQUFPO1NBQ1I7UUFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxFQUFFO1lBQ25ELE1BQU0sTUFBTSxHQUFHLGlCQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUU7Z0JBQ3JELElBQUksUUFBUSxDQUFDLFFBQVEsSUFBSSxJQUFJLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ3ZFLFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQztpQkFDcEU7cUJBQU07b0JBQ0wsT0FBTyxFQUFFLENBQUM7aUJBQ1g7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1gsT0FBTyxlQUFlO3FCQUNuQixRQUFRLENBQUMsV0FBVyxDQUFDO3FCQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDO3FCQUNULFFBQVEsRUFBRSxDQUFDO2FBQ2Y7WUFFRCxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZCLG1GQUFtRjtZQUNuRixrQ0FBa0M7WUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBRXZDLE9BQU8sZUFBZSxDQUFDLFFBQVEsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxVQUFrQixFQUFFLFNBQWlCO1FBQzVELHVFQUF1RTtRQUN2RSxnRUFBZ0U7UUFDaEUsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFGLE9BQU8sR0FBRyxVQUFVLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUM7SUFDaEUsQ0FBQztDQUNGO0FBakdELGdDQWlHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBTZXJ2ZXIsIFNlcnZlck9wdGlvbnMgfSBmcm9tICdoYXBpJztcblxuaW1wb3J0IHsgbW9kaWZ5VXJsIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi4vbG9nZ2luZyc7XG5pbXBvcnQgeyBIdHRwQ29uZmlnIH0gZnJvbSAnLi9odHRwX2NvbmZpZyc7XG5pbXBvcnQgeyBjcmVhdGVTZXJ2ZXIsIGdldFNlcnZlck9wdGlvbnMgfSBmcm9tICcuL2h0dHBfdG9vbHMnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnLi9yb3V0ZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIEh0dHBTZXJ2ZXJJbmZvIHtcbiAgc2VydmVyOiBTZXJ2ZXI7XG4gIG9wdGlvbnM6IFNlcnZlck9wdGlvbnM7XG59XG5cbmV4cG9ydCBjbGFzcyBIdHRwU2VydmVyIHtcbiAgcHJpdmF0ZSBzZXJ2ZXI/OiBTZXJ2ZXI7XG4gIHByaXZhdGUgcmVnaXN0ZXJlZFJvdXRlcnM6IFNldDxSb3V0ZXI+ID0gbmV3IFNldCgpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbG9nOiBMb2dnZXIpIHt9XG5cbiAgcHVibGljIGlzTGlzdGVuaW5nKCkge1xuICAgIHJldHVybiB0aGlzLnNlcnZlciAhPT0gdW5kZWZpbmVkICYmIHRoaXMuc2VydmVyLmxpc3RlbmVyLmxpc3RlbmluZztcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlclJvdXRlcihyb3V0ZXI6IFJvdXRlcikge1xuICAgIGlmICh0aGlzLmlzTGlzdGVuaW5nKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUm91dGVycyBjYW4gYmUgcmVnaXN0ZXJlZCBvbmx5IHdoZW4gSFRUUCBzZXJ2ZXIgaXMgc3RvcHBlZC4nKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlZ2lzdGVyZWRSb3V0ZXJzLmFkZChyb3V0ZXIpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHN0YXJ0KGNvbmZpZzogSHR0cENvbmZpZykge1xuICAgIHRoaXMubG9nLmRlYnVnKCdzdGFydGluZyBodHRwIHNlcnZlcicpO1xuXG4gICAgY29uc3Qgc2VydmVyT3B0aW9ucyA9IGdldFNlcnZlck9wdGlvbnMoY29uZmlnKTtcbiAgICB0aGlzLnNlcnZlciA9IGNyZWF0ZVNlcnZlcihzZXJ2ZXJPcHRpb25zKTtcblxuICAgIHRoaXMuc2V0dXBCYXNlUGF0aFJld3JpdGUodGhpcy5zZXJ2ZXIsIGNvbmZpZyk7XG5cbiAgICBmb3IgKGNvbnN0IHJvdXRlciBvZiB0aGlzLnJlZ2lzdGVyZWRSb3V0ZXJzKSB7XG4gICAgICBmb3IgKGNvbnN0IHJvdXRlIG9mIHJvdXRlci5nZXRSb3V0ZXMoKSkge1xuICAgICAgICB0aGlzLnNlcnZlci5yb3V0ZSh7XG4gICAgICAgICAgaGFuZGxlcjogcm91dGUuaGFuZGxlcixcbiAgICAgICAgICBtZXRob2Q6IHJvdXRlLm1ldGhvZCxcbiAgICAgICAgICBwYXRoOiB0aGlzLmdldFJvdXRlRnVsbFBhdGgocm91dGVyLnBhdGgsIHJvdXRlLnBhdGgpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLnNlcnZlci5zdGFydCgpO1xuXG4gICAgdGhpcy5sb2cuZGVidWcoXG4gICAgICBgaHR0cCBzZXJ2ZXIgcnVubmluZyBhdCAke3RoaXMuc2VydmVyLmluZm8udXJpfSR7XG4gICAgICAgIGNvbmZpZy5yZXdyaXRlQmFzZVBhdGggPyBjb25maWcuYmFzZVBhdGggOiAnJ1xuICAgICAgfWBcbiAgICApO1xuXG4gICAgLy8gUmV0dXJuIHNlcnZlciBpbnN0YW5jZSB3aXRoIHRoZSBjb25uZWN0aW9uIG9wdGlvbnMgc28gdGhhdCB3ZSBjYW4gcHJvcGVybHlcbiAgICAvLyBicmlkZ2UgY29yZSBhbmQgdGhlIFwibGVnYWN5XCIgS2liYW5hIGludGVybmFsbHkuIE9uY2UgdGhpcyBicmlkZ2UgaXNuJ3RcbiAgICAvLyBuZWVkZWQgYW55bW9yZSB3ZSBzaG91bGRuJ3QgcmV0dXJuIGFueXRoaW5nIGZyb20gdGhpcyBtZXRob2QuXG4gICAgcmV0dXJuIHsgc2VydmVyOiB0aGlzLnNlcnZlciwgb3B0aW9uczogc2VydmVyT3B0aW9ucyB9O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuc2VydmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxvZy5kZWJ1Zygnc3RvcHBpbmcgaHR0cCBzZXJ2ZXInKTtcbiAgICBhd2FpdCB0aGlzLnNlcnZlci5zdG9wKCk7XG4gICAgdGhpcy5zZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIHNldHVwQmFzZVBhdGhSZXdyaXRlKHNlcnZlcjogU2VydmVyLCBjb25maWc6IEh0dHBDb25maWcpIHtcbiAgICBpZiAoY29uZmlnLmJhc2VQYXRoID09PSB1bmRlZmluZWQgfHwgIWNvbmZpZy5yZXdyaXRlQmFzZVBhdGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlUGF0aCA9IGNvbmZpZy5iYXNlUGF0aDtcbiAgICBzZXJ2ZXIuZXh0KCdvblJlcXVlc3QnLCAocmVxdWVzdCwgcmVzcG9uc2VUb29sa2l0KSA9PiB7XG4gICAgICBjb25zdCBuZXdVUkwgPSBtb2RpZnlVcmwocmVxdWVzdC51cmwuaHJlZiEsIHVybFBhcnRzID0+IHtcbiAgICAgICAgaWYgKHVybFBhcnRzLnBhdGhuYW1lICE9IG51bGwgJiYgdXJsUGFydHMucGF0aG5hbWUuc3RhcnRzV2l0aChiYXNlUGF0aCkpIHtcbiAgICAgICAgICB1cmxQYXJ0cy5wYXRobmFtZSA9IHVybFBhcnRzLnBhdGhuYW1lLnJlcGxhY2UoYmFzZVBhdGgsICcnKSB8fCAnLyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKCFuZXdVUkwpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlVG9vbGtpdFxuICAgICAgICAgIC5yZXNwb25zZSgnTm90IEZvdW5kJylcbiAgICAgICAgICAuY29kZSg0MDQpXG4gICAgICAgICAgLnRha2VvdmVyKCk7XG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3Quc2V0VXJsKG5ld1VSTCk7XG4gICAgICAvLyBXZSBzaG91bGQgdXBkYXRlIHJhdyByZXF1ZXN0IGFzIHdlbGwgc2luY2UgaXQgY2FuIGJlIHByb3hpZWQgdG8gdGhlIG9sZCBwbGF0Zm9ybVxuICAgICAgLy8gd2hlcmUgYmFzZSBwYXRoIGlzbid0IGV4cGVjdGVkLlxuICAgICAgcmVxdWVzdC5yYXcucmVxLnVybCA9IHJlcXVlc3QudXJsLmhyZWY7XG5cbiAgICAgIHJldHVybiByZXNwb25zZVRvb2xraXQuY29udGludWU7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldFJvdXRlRnVsbFBhdGgocm91dGVyUGF0aDogc3RyaW5nLCByb3V0ZVBhdGg6IHN0cmluZykge1xuICAgIC8vIElmIHJvdXRlcidzIHBhdGggZW5kcyB3aXRoIHNsYXNoIGFuZCByb3V0ZSdzIHBhdGggc3RhcnRzIHdpdGggc2xhc2gsXG4gICAgLy8gd2Ugc2hvdWxkIG9taXQgb25lIG9mIHRoZW0gdG8gaGF2ZSBhIHZhbGlkIGNvbmNhdGVuYXRlZCBwYXRoLlxuICAgIGNvbnN0IHJvdXRlUGF0aFN0YXJ0SW5kZXggPSByb3V0ZXJQYXRoLmVuZHNXaXRoKCcvJykgJiYgcm91dGVQYXRoLnN0YXJ0c1dpdGgoJy8nKSA/IDEgOiAwO1xuICAgIHJldHVybiBgJHtyb3V0ZXJQYXRofSR7cm91dGVQYXRoLnNsaWNlKHJvdXRlUGF0aFN0YXJ0SW5kZXgpfWA7XG4gIH1cbn1cbiJdfQ==