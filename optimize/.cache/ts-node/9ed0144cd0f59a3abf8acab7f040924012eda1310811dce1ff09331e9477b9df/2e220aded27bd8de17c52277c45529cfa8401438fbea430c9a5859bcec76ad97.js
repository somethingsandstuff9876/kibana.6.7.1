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
const operators_1 = require("rxjs/operators");
const http_server_1 = require("./http_server");
const https_redirect_server_1 = require("./https_redirect_server");
/** @internal */
class HttpService {
    constructor(config$, logger) {
        this.config$ = config$;
        this.log = logger.get('http');
        this.httpServer = new http_server_1.HttpServer(logger.get('http', 'server'));
        this.httpsRedirectServer = new https_redirect_server_1.HttpsRedirectServer(logger.get('http', 'redirect', 'server'));
    }
    async start() {
        this.configSubscription = this.config$.subscribe(() => {
            if (this.httpServer.isListening()) {
                // If the server is already running we can't make any config changes
                // to it, so we warn and don't allow the config to pass through.
                this.log.warn('Received new HTTP config after server was started. ' + 'Config will **not** be applied.');
            }
        });
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        // If a redirect port is specified, we start an HTTP server at this port and
        // redirect all requests to the SSL port.
        if (config.ssl.enabled && config.ssl.redirectHttpFromPort !== undefined) {
            await this.httpsRedirectServer.start(config);
        }
        return await this.httpServer.start(config);
    }
    async stop() {
        if (this.configSubscription === undefined) {
            return;
        }
        this.configSubscription.unsubscribe();
        this.configSubscription = undefined;
        await this.httpServer.stop();
        await this.httpsRedirectServer.stop();
    }
    registerRouter(router) {
        if (this.httpServer.isListening()) {
            // If the server is already running we can't make any config changes
            // to it, so we warn and don't allow the config to pass through.
            // TODO Should we throw instead?
            this.log.error(`Received new router [${router.path}] after server was started. ` +
                'Router will **not** be applied.');
        }
        else {
            this.log.debug(`registering route handler for [${router.path}]`);
            this.httpServer.registerRouter(router);
        }
    }
}
exports.HttpService = HttpService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2NvcmUvc2VydmVyL2h0dHAvaHR0cF9zZXJ2aWNlLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS9zcmMvY29yZS9zZXJ2ZXIvaHR0cC9odHRwX3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRzs7QUFHSCw4Q0FBdUM7QUFLdkMsK0NBQTJEO0FBQzNELG1FQUE4RDtBQU05RCxnQkFBZ0I7QUFDaEIsTUFBYSxXQUFXO0lBT3RCLFlBQTZCLE9BQStCLEVBQUUsTUFBcUI7UUFBdEQsWUFBTyxHQUFQLE9BQU8sQ0FBd0I7UUFDMUQsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSx3QkFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksMkNBQW1CLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVNLEtBQUssQ0FBQyxLQUFLO1FBQ2hCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDcEQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxFQUFFO2dCQUNqQyxvRUFBb0U7Z0JBQ3BFLGdFQUFnRTtnQkFDaEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQ1gscURBQXFELEdBQUcsaUNBQWlDLENBQzFGLENBQUM7YUFDSDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBSyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUU1RCw0RUFBNEU7UUFDNUUseUNBQXlDO1FBQ3pDLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLEVBQUU7WUFDdkUsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzlDO1FBRUQsT0FBTyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSTtRQUNmLElBQUksSUFBSSxDQUFDLGtCQUFrQixLQUFLLFNBQVMsRUFBRTtZQUN6QyxPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztRQUVwQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0IsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVNLGNBQWMsQ0FBQyxNQUFjO1FBQ2xDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUNqQyxvRUFBb0U7WUFDcEUsZ0VBQWdFO1lBQ2hFLGdDQUFnQztZQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FDWix3QkFBd0IsTUFBTSxDQUFDLElBQUksOEJBQThCO2dCQUMvRCxpQ0FBaUMsQ0FDcEMsQ0FBQztTQUNIO2FBQU07WUFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDeEM7SUFDSCxDQUFDO0NBQ0Y7QUE5REQsa0NBOERDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIExpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmUgb3IgbW9yZSBjb250cmlidXRvclxuICogbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAqIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0XG4gKiBvd25lcnNoaXAuIEVsYXN0aWNzZWFyY2ggQi5WLiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyXG4gKiB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5XG4gKiBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IENvcmVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHsgTG9nZ2VyLCBMb2dnZXJGYWN0b3J5IH0gZnJvbSAnLi4vbG9nZ2luZyc7XG5pbXBvcnQgeyBIdHRwQ29uZmlnIH0gZnJvbSAnLi9odHRwX2NvbmZpZyc7XG5pbXBvcnQgeyBIdHRwU2VydmVyLCBIdHRwU2VydmVySW5mbyB9IGZyb20gJy4vaHR0cF9zZXJ2ZXInO1xuaW1wb3J0IHsgSHR0cHNSZWRpcmVjdFNlcnZlciB9IGZyb20gJy4vaHR0cHNfcmVkaXJlY3Rfc2VydmVyJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJy4vcm91dGVyJztcblxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHR5cGUgSHR0cFNlcnZpY2VTdGFydENvbnRyYWN0ID0gSHR0cFNlcnZlckluZm87XG5cbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCBjbGFzcyBIdHRwU2VydmljZSBpbXBsZW1lbnRzIENvcmVTZXJ2aWNlPEh0dHBTZXJ2ZXJJbmZvPiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgaHR0cFNlcnZlcjogSHR0cFNlcnZlcjtcbiAgcHJpdmF0ZSByZWFkb25seSBodHRwc1JlZGlyZWN0U2VydmVyOiBIdHRwc1JlZGlyZWN0U2VydmVyO1xuICBwcml2YXRlIGNvbmZpZ1N1YnNjcmlwdGlvbj86IFN1YnNjcmlwdGlvbjtcblxuICBwcml2YXRlIHJlYWRvbmx5IGxvZzogTG9nZ2VyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29uZmlnJDogT2JzZXJ2YWJsZTxIdHRwQ29uZmlnPiwgbG9nZ2VyOiBMb2dnZXJGYWN0b3J5KSB7XG4gICAgdGhpcy5sb2cgPSBsb2dnZXIuZ2V0KCdodHRwJyk7XG5cbiAgICB0aGlzLmh0dHBTZXJ2ZXIgPSBuZXcgSHR0cFNlcnZlcihsb2dnZXIuZ2V0KCdodHRwJywgJ3NlcnZlcicpKTtcbiAgICB0aGlzLmh0dHBzUmVkaXJlY3RTZXJ2ZXIgPSBuZXcgSHR0cHNSZWRpcmVjdFNlcnZlcihsb2dnZXIuZ2V0KCdodHRwJywgJ3JlZGlyZWN0JywgJ3NlcnZlcicpKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzdGFydCgpIHtcbiAgICB0aGlzLmNvbmZpZ1N1YnNjcmlwdGlvbiA9IHRoaXMuY29uZmlnJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaHR0cFNlcnZlci5pc0xpc3RlbmluZygpKSB7XG4gICAgICAgIC8vIElmIHRoZSBzZXJ2ZXIgaXMgYWxyZWFkeSBydW5uaW5nIHdlIGNhbid0IG1ha2UgYW55IGNvbmZpZyBjaGFuZ2VzXG4gICAgICAgIC8vIHRvIGl0LCBzbyB3ZSB3YXJuIGFuZCBkb24ndCBhbGxvdyB0aGUgY29uZmlnIHRvIHBhc3MgdGhyb3VnaC5cbiAgICAgICAgdGhpcy5sb2cud2FybihcbiAgICAgICAgICAnUmVjZWl2ZWQgbmV3IEhUVFAgY29uZmlnIGFmdGVyIHNlcnZlciB3YXMgc3RhcnRlZC4gJyArICdDb25maWcgd2lsbCAqKm5vdCoqIGJlIGFwcGxpZWQuJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29uZmlnID0gYXdhaXQgdGhpcy5jb25maWckLnBpcGUoZmlyc3QoKSkudG9Qcm9taXNlKCk7XG5cbiAgICAvLyBJZiBhIHJlZGlyZWN0IHBvcnQgaXMgc3BlY2lmaWVkLCB3ZSBzdGFydCBhbiBIVFRQIHNlcnZlciBhdCB0aGlzIHBvcnQgYW5kXG4gICAgLy8gcmVkaXJlY3QgYWxsIHJlcXVlc3RzIHRvIHRoZSBTU0wgcG9ydC5cbiAgICBpZiAoY29uZmlnLnNzbC5lbmFibGVkICYmIGNvbmZpZy5zc2wucmVkaXJlY3RIdHRwRnJvbVBvcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYXdhaXQgdGhpcy5odHRwc1JlZGlyZWN0U2VydmVyLnN0YXJ0KGNvbmZpZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuaHR0cFNlcnZlci5zdGFydChjb25maWcpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuY29uZmlnU3Vic2NyaXB0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuY29uZmlnU3Vic2NyaXB0aW9uID0gdW5kZWZpbmVkO1xuXG4gICAgYXdhaXQgdGhpcy5odHRwU2VydmVyLnN0b3AoKTtcbiAgICBhd2FpdCB0aGlzLmh0dHBzUmVkaXJlY3RTZXJ2ZXIuc3RvcCgpO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyUm91dGVyKHJvdXRlcjogUm91dGVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaHR0cFNlcnZlci5pc0xpc3RlbmluZygpKSB7XG4gICAgICAvLyBJZiB0aGUgc2VydmVyIGlzIGFscmVhZHkgcnVubmluZyB3ZSBjYW4ndCBtYWtlIGFueSBjb25maWcgY2hhbmdlc1xuICAgICAgLy8gdG8gaXQsIHNvIHdlIHdhcm4gYW5kIGRvbid0IGFsbG93IHRoZSBjb25maWcgdG8gcGFzcyB0aHJvdWdoLlxuICAgICAgLy8gVE9ETyBTaG91bGQgd2UgdGhyb3cgaW5zdGVhZD9cbiAgICAgIHRoaXMubG9nLmVycm9yKFxuICAgICAgICBgUmVjZWl2ZWQgbmV3IHJvdXRlciBbJHtyb3V0ZXIucGF0aH1dIGFmdGVyIHNlcnZlciB3YXMgc3RhcnRlZC4gYCArXG4gICAgICAgICAgJ1JvdXRlciB3aWxsICoqbm90KiogYmUgYXBwbGllZC4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZy5kZWJ1ZyhgcmVnaXN0ZXJpbmcgcm91dGUgaGFuZGxlciBmb3IgWyR7cm91dGVyLnBhdGh9XWApO1xuICAgICAgdGhpcy5odHRwU2VydmVyLnJlZ2lzdGVyUm91dGVyKHJvdXRlcik7XG4gICAgfVxuICB9XG59XG4iXX0=