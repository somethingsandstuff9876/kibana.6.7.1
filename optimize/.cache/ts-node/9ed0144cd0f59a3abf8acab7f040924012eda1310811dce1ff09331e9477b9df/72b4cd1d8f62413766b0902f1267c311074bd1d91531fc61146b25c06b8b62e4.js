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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const dev_1 = require("../dev");
const http_1 = require("../http");
const legacy_platform_proxy_1 = require("./legacy_platform_proxy");
/** @internal */
class LegacyService {
    constructor(coreContext) {
        this.coreContext = coreContext;
        this.log = coreContext.logger.get('legacy-service');
    }
    async start(deps) {
        this.log.debug('starting legacy service');
        const update$ = this.coreContext.configService.getConfig$().pipe(operators_1.tap(config => {
            if (this.kbnServer !== undefined) {
                this.kbnServer.applyLoggingConfiguration(config.toRaw());
            }
        }), operators_1.tap({ error: err => this.log.error(err) }), operators_1.publishReplay(1));
        this.configSubscription = update$.connect();
        // Receive initial config and create kbnServer/ClusterManager.
        this.kbnServer = await update$
            .pipe(operators_1.first(), operators_1.mergeMap(async (config) => {
            if (this.coreContext.env.isDevClusterMaster) {
                await this.createClusterManager(config);
                return;
            }
            return await this.createKbnServer(config, deps);
        }))
            .toPromise();
    }
    async stop() {
        this.log.debug('stopping legacy service');
        if (this.configSubscription !== undefined) {
            this.configSubscription.unsubscribe();
            this.configSubscription = undefined;
        }
        if (this.kbnServer !== undefined) {
            await this.kbnServer.close();
            this.kbnServer = undefined;
        }
    }
    async createClusterManager(config) {
        const basePathProxy$ = this.coreContext.env.cliArgs.basePath
            ? rxjs_1.combineLatest(this.coreContext.configService.atPath('dev', dev_1.DevConfig), this.coreContext.configService.atPath('server', http_1.HttpConfig)).pipe(operators_1.first(), operators_1.map(([devConfig, httpConfig]) => new http_1.BasePathProxyServer(this.coreContext.logger.get('server'), httpConfig, devConfig)))
            : rxjs_1.EMPTY;
        require('../../../cli/cluster/cluster_manager').create(this.coreContext.env.cliArgs, config.toRaw(), await basePathProxy$.toPromise());
    }
    async createKbnServer(config, deps) {
        const KbnServer = require('../../../server/kbn_server');
        const kbnServer = new KbnServer(config.toRaw(), {
            // If core HTTP service is run we'll receive internal server reference and
            // options that were used to create that server so that we can properly
            // bridge with the "legacy" Kibana. If server isn't run (e.g. if process is
            // managed by ClusterManager or optimizer) then we won't have that info,
            // so we can't start "legacy" server either.
            serverOptions: deps.http !== undefined
                ? {
                    ...deps.http.options,
                    listener: this.setupProxyListener(deps.http.server),
                }
                : { autoListen: false },
            handledConfigPaths: await this.coreContext.configService.getUsedPaths(),
            plugins: deps.plugins,
        });
        const httpConfig = await this.coreContext.configService
            .atPath('server', http_1.HttpConfig)
            .pipe(operators_1.first())
            .toPromise();
        if (httpConfig.autoListen) {
            try {
                await kbnServer.listen();
            }
            catch (err) {
                await kbnServer.close();
                throw err;
            }
        }
        else {
            await kbnServer.ready();
        }
        return kbnServer;
    }
    setupProxyListener(server) {
        const legacyProxy = new legacy_platform_proxy_1.LegacyPlatformProxy(this.coreContext.logger.get('legacy-proxy'), server.listener);
        // We register Kibana proxy middleware right before we start server to allow
        // all new platform plugins register their routes, so that `legacyProxy`
        // handles only requests that aren't handled by the new platform.
        server.route({
            path: '/{p*}',
            method: '*',
            options: {
                payload: {
                    output: 'stream',
                    parse: false,
                    timeout: false,
                    // Having such a large value here will allow legacy routes to override
                    // maximum allowed payload size set in the core http server if needed.
                    maxBytes: Number.MAX_SAFE_INTEGER,
                },
            },
            handler: async ({ raw: { req, res } }, responseToolkit) => {
                if (this.kbnServer === undefined) {
                    this.log.debug(`Kibana server is not ready yet ${req.method}:${req.url}.`);
                    // If legacy server is not ready yet (e.g. it's still in optimization phase),
                    // we should let client know that and ask to retry after 30 seconds.
                    return responseToolkit
                        .response('Kibana server is not ready yet')
                        .code(503)
                        .header('Retry-After', '30');
                }
                this.log.trace(`Request will be handled by proxy ${req.method}:${req.url}.`);
                // Forward request and response objects to the legacy platform. This method
                // is used whenever new platform doesn't know how to handle the request.
                legacyProxy.emit('request', req, res);
                return responseToolkit.abandon;
            },
        });
        return legacyProxy;
    }
}
exports.LegacyService = LegacyService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2xlZ2FjeV9jb21wYXQvbGVnYWN5X3NlcnZpY2UudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9jb3JlL3NlcnZlci9sZWdhY3lfY29tcGF0L2xlZ2FjeV9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBR0gsK0JBQWlGO0FBQ2pGLDhDQUEwRTtBQUcxRSxnQ0FBbUM7QUFDbkMsa0NBQW9GO0FBR3BGLG1FQUE4RDtBQWM5RCxnQkFBZ0I7QUFDaEIsTUFBYSxhQUFhO0lBS3hCLFlBQTZCLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ25ELElBQUksQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRU0sS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFVO1FBQzNCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFFMUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUM5RCxlQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDWCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFO2dCQUNoQyxJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2FBQzFEO1FBQ0gsQ0FBQyxDQUFDLEVBQ0YsZUFBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUMxQyx5QkFBYSxDQUFDLENBQUMsQ0FBQyxDQUNnQixDQUFDO1FBRW5DLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFNUMsOERBQThEO1FBQzlELElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxPQUFPO2FBQzNCLElBQUksQ0FDSCxpQkFBSyxFQUFFLEVBQ1Asb0JBQVEsQ0FBQyxLQUFLLEVBQUMsTUFBTSxFQUFDLEVBQUU7WUFDdEIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRTtnQkFDM0MsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3hDLE9BQU87YUFDUjtZQUVELE9BQU8sTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsRCxDQUFDLENBQUMsQ0FDSDthQUNBLFNBQVMsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSTtRQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFFMUMsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEtBQUssU0FBUyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUNoQyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7U0FDNUI7SUFDSCxDQUFDO0lBRU8sS0FBSyxDQUFDLG9CQUFvQixDQUFDLE1BQWM7UUFDL0MsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVE7WUFDMUQsQ0FBQyxDQUFDLG9CQUFhLENBQ1gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxlQUFTLENBQUMsRUFDdkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxpQkFBVSxDQUFDLENBQzVELENBQUMsSUFBSSxDQUNKLGlCQUFLLEVBQUUsRUFDUCxlQUFHLENBQ0QsQ0FBQyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsRUFBRSxFQUFFLENBQzFCLElBQUksMEJBQW1CLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FDeEYsQ0FDRjtZQUNILENBQUMsQ0FBQyxZQUFLLENBQUM7UUFFVixPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQyxNQUFNLENBQ3BELElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFDNUIsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUNkLE1BQU0sY0FBYyxDQUFDLFNBQVMsRUFBRSxDQUNqQyxDQUFDO0lBQ0osQ0FBQztJQUVPLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBYyxFQUFFLElBQVU7UUFDdEQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDeEQsTUFBTSxTQUFTLEdBQW9CLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUMvRCwwRUFBMEU7WUFDMUUsdUVBQXVFO1lBQ3ZFLDJFQUEyRTtZQUMzRSx3RUFBd0U7WUFDeEUsNENBQTRDO1lBQzVDLGFBQWEsRUFDWCxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVM7Z0JBQ3JCLENBQUMsQ0FBQztvQkFDRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTztvQkFDcEIsUUFBUSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztpQkFDcEQ7Z0JBQ0gsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRTtZQUMzQixrQkFBa0IsRUFBRSxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRTtZQUN2RSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDdEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWE7YUFDcEQsTUFBTSxDQUFDLFFBQVEsRUFBRSxpQkFBVSxDQUFDO2FBQzVCLElBQUksQ0FBQyxpQkFBSyxFQUFFLENBQUM7YUFDYixTQUFTLEVBQUUsQ0FBQztRQUVmLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRTtZQUN6QixJQUFJO2dCQUNGLE1BQU0sU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQzFCO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osTUFBTSxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3hCLE1BQU0sR0FBRyxDQUFDO2FBQ1g7U0FDRjthQUFNO1lBQ0wsTUFBTSxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDekI7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRU8sa0JBQWtCLENBQUMsTUFBa0I7UUFDM0MsTUFBTSxXQUFXLEdBQUcsSUFBSSwyQ0FBbUIsQ0FDekMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxFQUMzQyxNQUFNLENBQUMsUUFBUSxDQUNoQixDQUFDO1FBRUYsNEVBQTRFO1FBQzVFLHdFQUF3RTtRQUN4RSxpRUFBaUU7UUFDakUsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNYLElBQUksRUFBRSxPQUFPO1lBQ2IsTUFBTSxFQUFFLEdBQUc7WUFDWCxPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFO29CQUNQLE1BQU0sRUFBRSxRQUFRO29CQUNoQixLQUFLLEVBQUUsS0FBSztvQkFDWixPQUFPLEVBQUUsS0FBSztvQkFDZCxzRUFBc0U7b0JBQ3RFLHNFQUFzRTtvQkFDdEUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxnQkFBZ0I7aUJBQ2xDO2FBQ0Y7WUFDRCxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsZUFBZSxFQUFFLEVBQUU7Z0JBQ3hELElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7b0JBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUUzRSw2RUFBNkU7b0JBQzdFLG9FQUFvRTtvQkFDcEUsT0FBTyxlQUFlO3lCQUNuQixRQUFRLENBQUMsZ0NBQWdDLENBQUM7eUJBQzFDLElBQUksQ0FBQyxHQUFHLENBQUM7eUJBQ1QsTUFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDaEM7Z0JBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBRTdFLDJFQUEyRTtnQkFDM0Usd0VBQXdFO2dCQUN4RSxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBRXRDLE9BQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQztZQUNqQyxDQUFDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztDQUNGO0FBL0pELHNDQStKQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBTZXJ2ZXIgYXMgSGFwaVNlcnZlciB9IGZyb20gJ2hhcGknO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCwgQ29ubmVjdGFibGVPYnNlcnZhYmxlLCBFTVBUWSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaXJzdCwgbWFwLCBtZXJnZU1hcCwgcHVibGlzaFJlcGxheSwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ29yZUNvbnRleHQsIENvcmVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7IERldkNvbmZpZyB9IGZyb20gJy4uL2Rldic7XG5pbXBvcnQgeyBCYXNlUGF0aFByb3h5U2VydmVyLCBIdHRwQ29uZmlnLCBIdHRwU2VydmljZVN0YXJ0Q29udHJhY3QgfSBmcm9tICcuLi9odHRwJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4uL2xvZ2dpbmcnO1xuaW1wb3J0IHsgUGx1Z2luc1NlcnZpY2VTdGFydENvbnRyYWN0IH0gZnJvbSAnLi4vcGx1Z2lucy9wbHVnaW5zX3NlcnZpY2UnO1xuaW1wb3J0IHsgTGVnYWN5UGxhdGZvcm1Qcm94eSB9IGZyb20gJy4vbGVnYWN5X3BsYXRmb3JtX3Byb3h5JztcblxuaW50ZXJmYWNlIExlZ2FjeUtiblNlcnZlciB7XG4gIGFwcGx5TG9nZ2luZ0NvbmZpZ3VyYXRpb246IChzZXR0aW5nczogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgYW55Pj4pID0+IHZvaWQ7XG4gIGxpc3RlbjogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgcmVhZHk6ICgpID0+IFByb21pc2U8dm9pZD47XG4gIGNsb3NlOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuXG5pbnRlcmZhY2UgRGVwcyB7XG4gIGh0dHA/OiBIdHRwU2VydmljZVN0YXJ0Q29udHJhY3Q7XG4gIHBsdWdpbnM6IFBsdWdpbnNTZXJ2aWNlU3RhcnRDb250cmFjdDtcbn1cblxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IGNsYXNzIExlZ2FjeVNlcnZpY2UgaW1wbGVtZW50cyBDb3JlU2VydmljZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbG9nOiBMb2dnZXI7XG4gIHByaXZhdGUga2JuU2VydmVyPzogTGVnYWN5S2JuU2VydmVyO1xuICBwcml2YXRlIGNvbmZpZ1N1YnNjcmlwdGlvbj86IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvcmVDb250ZXh0OiBDb3JlQ29udGV4dCkge1xuICAgIHRoaXMubG9nID0gY29yZUNvbnRleHQubG9nZ2VyLmdldCgnbGVnYWN5LXNlcnZpY2UnKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzdGFydChkZXBzOiBEZXBzKSB7XG4gICAgdGhpcy5sb2cuZGVidWcoJ3N0YXJ0aW5nIGxlZ2FjeSBzZXJ2aWNlJyk7XG5cbiAgICBjb25zdCB1cGRhdGUkID0gdGhpcy5jb3JlQ29udGV4dC5jb25maWdTZXJ2aWNlLmdldENvbmZpZyQoKS5waXBlKFxuICAgICAgdGFwKGNvbmZpZyA9PiB7XG4gICAgICAgIGlmICh0aGlzLmtiblNlcnZlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5rYm5TZXJ2ZXIuYXBwbHlMb2dnaW5nQ29uZmlndXJhdGlvbihjb25maWcudG9SYXcoKSk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGFwKHsgZXJyb3I6IGVyciA9PiB0aGlzLmxvZy5lcnJvcihlcnIpIH0pLFxuICAgICAgcHVibGlzaFJlcGxheSgxKVxuICAgICkgYXMgQ29ubmVjdGFibGVPYnNlcnZhYmxlPENvbmZpZz47XG5cbiAgICB0aGlzLmNvbmZpZ1N1YnNjcmlwdGlvbiA9IHVwZGF0ZSQuY29ubmVjdCgpO1xuXG4gICAgLy8gUmVjZWl2ZSBpbml0aWFsIGNvbmZpZyBhbmQgY3JlYXRlIGtiblNlcnZlci9DbHVzdGVyTWFuYWdlci5cbiAgICB0aGlzLmtiblNlcnZlciA9IGF3YWl0IHVwZGF0ZSRcbiAgICAgIC5waXBlKFxuICAgICAgICBmaXJzdCgpLFxuICAgICAgICBtZXJnZU1hcChhc3luYyBjb25maWcgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmNvcmVDb250ZXh0LmVudi5pc0RldkNsdXN0ZXJNYXN0ZXIpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY3JlYXRlQ2x1c3Rlck1hbmFnZXIoY29uZmlnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jcmVhdGVLYm5TZXJ2ZXIoY29uZmlnLCBkZXBzKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC50b1Byb21pc2UoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzdG9wKCkge1xuICAgIHRoaXMubG9nLmRlYnVnKCdzdG9wcGluZyBsZWdhY3kgc2VydmljZScpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnU3Vic2NyaXB0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuY29uZmlnU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLmNvbmZpZ1N1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5rYm5TZXJ2ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYXdhaXQgdGhpcy5rYm5TZXJ2ZXIuY2xvc2UoKTtcbiAgICAgIHRoaXMua2JuU2VydmVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY3JlYXRlQ2x1c3Rlck1hbmFnZXIoY29uZmlnOiBDb25maWcpIHtcbiAgICBjb25zdCBiYXNlUGF0aFByb3h5JCA9IHRoaXMuY29yZUNvbnRleHQuZW52LmNsaUFyZ3MuYmFzZVBhdGhcbiAgICAgID8gY29tYmluZUxhdGVzdChcbiAgICAgICAgICB0aGlzLmNvcmVDb250ZXh0LmNvbmZpZ1NlcnZpY2UuYXRQYXRoKCdkZXYnLCBEZXZDb25maWcpLFxuICAgICAgICAgIHRoaXMuY29yZUNvbnRleHQuY29uZmlnU2VydmljZS5hdFBhdGgoJ3NlcnZlcicsIEh0dHBDb25maWcpXG4gICAgICAgICkucGlwZShcbiAgICAgICAgICBmaXJzdCgpLFxuICAgICAgICAgIG1hcChcbiAgICAgICAgICAgIChbZGV2Q29uZmlnLCBodHRwQ29uZmlnXSkgPT5cbiAgICAgICAgICAgICAgbmV3IEJhc2VQYXRoUHJveHlTZXJ2ZXIodGhpcy5jb3JlQ29udGV4dC5sb2dnZXIuZ2V0KCdzZXJ2ZXInKSwgaHR0cENvbmZpZywgZGV2Q29uZmlnKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgOiBFTVBUWTtcblxuICAgIHJlcXVpcmUoJy4uLy4uLy4uL2NsaS9jbHVzdGVyL2NsdXN0ZXJfbWFuYWdlcicpLmNyZWF0ZShcbiAgICAgIHRoaXMuY29yZUNvbnRleHQuZW52LmNsaUFyZ3MsXG4gICAgICBjb25maWcudG9SYXcoKSxcbiAgICAgIGF3YWl0IGJhc2VQYXRoUHJveHkkLnRvUHJvbWlzZSgpXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY3JlYXRlS2JuU2VydmVyKGNvbmZpZzogQ29uZmlnLCBkZXBzOiBEZXBzKSB7XG4gICAgY29uc3QgS2JuU2VydmVyID0gcmVxdWlyZSgnLi4vLi4vLi4vc2VydmVyL2tibl9zZXJ2ZXInKTtcbiAgICBjb25zdCBrYm5TZXJ2ZXI6IExlZ2FjeUtiblNlcnZlciA9IG5ldyBLYm5TZXJ2ZXIoY29uZmlnLnRvUmF3KCksIHtcbiAgICAgIC8vIElmIGNvcmUgSFRUUCBzZXJ2aWNlIGlzIHJ1biB3ZSdsbCByZWNlaXZlIGludGVybmFsIHNlcnZlciByZWZlcmVuY2UgYW5kXG4gICAgICAvLyBvcHRpb25zIHRoYXQgd2VyZSB1c2VkIHRvIGNyZWF0ZSB0aGF0IHNlcnZlciBzbyB0aGF0IHdlIGNhbiBwcm9wZXJseVxuICAgICAgLy8gYnJpZGdlIHdpdGggdGhlIFwibGVnYWN5XCIgS2liYW5hLiBJZiBzZXJ2ZXIgaXNuJ3QgcnVuIChlLmcuIGlmIHByb2Nlc3MgaXNcbiAgICAgIC8vIG1hbmFnZWQgYnkgQ2x1c3Rlck1hbmFnZXIgb3Igb3B0aW1pemVyKSB0aGVuIHdlIHdvbid0IGhhdmUgdGhhdCBpbmZvLFxuICAgICAgLy8gc28gd2UgY2FuJ3Qgc3RhcnQgXCJsZWdhY3lcIiBzZXJ2ZXIgZWl0aGVyLlxuICAgICAgc2VydmVyT3B0aW9uczpcbiAgICAgICAgZGVwcy5odHRwICE9PSB1bmRlZmluZWRcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgLi4uZGVwcy5odHRwLm9wdGlvbnMsXG4gICAgICAgICAgICAgIGxpc3RlbmVyOiB0aGlzLnNldHVwUHJveHlMaXN0ZW5lcihkZXBzLmh0dHAuc2VydmVyKSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA6IHsgYXV0b0xpc3RlbjogZmFsc2UgfSxcbiAgICAgIGhhbmRsZWRDb25maWdQYXRoczogYXdhaXQgdGhpcy5jb3JlQ29udGV4dC5jb25maWdTZXJ2aWNlLmdldFVzZWRQYXRocygpLFxuICAgICAgcGx1Z2luczogZGVwcy5wbHVnaW5zLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaHR0cENvbmZpZyA9IGF3YWl0IHRoaXMuY29yZUNvbnRleHQuY29uZmlnU2VydmljZVxuICAgICAgLmF0UGF0aCgnc2VydmVyJywgSHR0cENvbmZpZylcbiAgICAgIC5waXBlKGZpcnN0KCkpXG4gICAgICAudG9Qcm9taXNlKCk7XG5cbiAgICBpZiAoaHR0cENvbmZpZy5hdXRvTGlzdGVuKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBrYm5TZXJ2ZXIubGlzdGVuKCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgYXdhaXQga2JuU2VydmVyLmNsb3NlKCk7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQga2JuU2VydmVyLnJlYWR5KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGtiblNlcnZlcjtcbiAgfVxuXG4gIHByaXZhdGUgc2V0dXBQcm94eUxpc3RlbmVyKHNlcnZlcjogSGFwaVNlcnZlcikge1xuICAgIGNvbnN0IGxlZ2FjeVByb3h5ID0gbmV3IExlZ2FjeVBsYXRmb3JtUHJveHkoXG4gICAgICB0aGlzLmNvcmVDb250ZXh0LmxvZ2dlci5nZXQoJ2xlZ2FjeS1wcm94eScpLFxuICAgICAgc2VydmVyLmxpc3RlbmVyXG4gICAgKTtcblxuICAgIC8vIFdlIHJlZ2lzdGVyIEtpYmFuYSBwcm94eSBtaWRkbGV3YXJlIHJpZ2h0IGJlZm9yZSB3ZSBzdGFydCBzZXJ2ZXIgdG8gYWxsb3dcbiAgICAvLyBhbGwgbmV3IHBsYXRmb3JtIHBsdWdpbnMgcmVnaXN0ZXIgdGhlaXIgcm91dGVzLCBzbyB0aGF0IGBsZWdhY3lQcm94eWBcbiAgICAvLyBoYW5kbGVzIG9ubHkgcmVxdWVzdHMgdGhhdCBhcmVuJ3QgaGFuZGxlZCBieSB0aGUgbmV3IHBsYXRmb3JtLlxuICAgIHNlcnZlci5yb3V0ZSh7XG4gICAgICBwYXRoOiAnL3twKn0nLFxuICAgICAgbWV0aG9kOiAnKicsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICBvdXRwdXQ6ICdzdHJlYW0nLFxuICAgICAgICAgIHBhcnNlOiBmYWxzZSxcbiAgICAgICAgICB0aW1lb3V0OiBmYWxzZSxcbiAgICAgICAgICAvLyBIYXZpbmcgc3VjaCBhIGxhcmdlIHZhbHVlIGhlcmUgd2lsbCBhbGxvdyBsZWdhY3kgcm91dGVzIHRvIG92ZXJyaWRlXG4gICAgICAgICAgLy8gbWF4aW11bSBhbGxvd2VkIHBheWxvYWQgc2l6ZSBzZXQgaW4gdGhlIGNvcmUgaHR0cCBzZXJ2ZXIgaWYgbmVlZGVkLlxuICAgICAgICAgIG1heEJ5dGVzOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBoYW5kbGVyOiBhc3luYyAoeyByYXc6IHsgcmVxLCByZXMgfSB9LCByZXNwb25zZVRvb2xraXQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMua2JuU2VydmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZyhgS2liYW5hIHNlcnZlciBpcyBub3QgcmVhZHkgeWV0ICR7cmVxLm1ldGhvZH06JHtyZXEudXJsfS5gKTtcblxuICAgICAgICAgIC8vIElmIGxlZ2FjeSBzZXJ2ZXIgaXMgbm90IHJlYWR5IHlldCAoZS5nLiBpdCdzIHN0aWxsIGluIG9wdGltaXphdGlvbiBwaGFzZSksXG4gICAgICAgICAgLy8gd2Ugc2hvdWxkIGxldCBjbGllbnQga25vdyB0aGF0IGFuZCBhc2sgdG8gcmV0cnkgYWZ0ZXIgMzAgc2Vjb25kcy5cbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2VUb29sa2l0XG4gICAgICAgICAgICAucmVzcG9uc2UoJ0tpYmFuYSBzZXJ2ZXIgaXMgbm90IHJlYWR5IHlldCcpXG4gICAgICAgICAgICAuY29kZSg1MDMpXG4gICAgICAgICAgICAuaGVhZGVyKCdSZXRyeS1BZnRlcicsICczMCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb2cudHJhY2UoYFJlcXVlc3Qgd2lsbCBiZSBoYW5kbGVkIGJ5IHByb3h5ICR7cmVxLm1ldGhvZH06JHtyZXEudXJsfS5gKTtcblxuICAgICAgICAvLyBGb3J3YXJkIHJlcXVlc3QgYW5kIHJlc3BvbnNlIG9iamVjdHMgdG8gdGhlIGxlZ2FjeSBwbGF0Zm9ybS4gVGhpcyBtZXRob2RcbiAgICAgICAgLy8gaXMgdXNlZCB3aGVuZXZlciBuZXcgcGxhdGZvcm0gZG9lc24ndCBrbm93IGhvdyB0byBoYW5kbGUgdGhlIHJlcXVlc3QuXG4gICAgICAgIGxlZ2FjeVByb3h5LmVtaXQoJ3JlcXVlc3QnLCByZXEsIHJlcyk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlVG9vbGtpdC5hYmFuZG9uO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiBsZWdhY3lQcm94eTtcbiAgfVxufVxuIl19