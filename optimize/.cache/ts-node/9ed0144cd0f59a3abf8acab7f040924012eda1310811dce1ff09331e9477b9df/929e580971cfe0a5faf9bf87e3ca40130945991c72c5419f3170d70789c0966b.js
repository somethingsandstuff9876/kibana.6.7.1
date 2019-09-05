"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const PathReporter_1 = require("io-ts/lib/PathReporter");
const lodash_1 = require("lodash");
// @ts-ignore
const mirror_plugin_status_1 = require("../../../../../../server/lib/mirror_plugin_status");
const adapter_types_1 = require("./adapter_types");
class KibanaBackendFrameworkAdapter {
    constructor(PLUGIN_ID, server, CONFIG_PREFIX) {
        this.PLUGIN_ID = PLUGIN_ID;
        this.server = server;
        this.CONFIG_PREFIX = CONFIG_PREFIX;
        this.internalUser = adapter_types_1.internalUser;
        this.info = null;
        this.xpackInfoWasUpdatedHandler = (xpackInfo) => {
            let xpackInfoUnpacked;
            // If, for some reason, we cannot get the license information
            // from Elasticsearch, assume worst case and disable
            if (!xpackInfo || !xpackInfo.isAvailable()) {
                this.info = null;
                return;
            }
            try {
                xpackInfoUnpacked = {
                    kibana: {
                        version: lodash_1.get(this.server, 'plugins.kibana.status.plugin.version', 'unknown'),
                    },
                    license: {
                        type: xpackInfo.license.getType(),
                        expired: !xpackInfo.license.isActive(),
                        expiry_date_in_millis: xpackInfo.license.getExpiryDateInMillis() !== undefined
                            ? xpackInfo.license.getExpiryDateInMillis()
                            : -1,
                    },
                    security: {
                        enabled: !!xpackInfo.feature('security') && xpackInfo.feature('security').isEnabled(),
                        available: !!xpackInfo.feature('security'),
                    },
                    watcher: {
                        enabled: !!xpackInfo.feature('watcher') && xpackInfo.feature('watcher').isEnabled(),
                        available: !!xpackInfo.feature('watcher'),
                    },
                };
            }
            catch (e) {
                this.server.log(`Error accessing required xPackInfo in ${this.PLUGIN_ID} Kibana adapter`);
                throw e;
            }
            const assertData = adapter_types_1.RuntimeFrameworkInfo.decode(xpackInfoUnpacked);
            if (assertData.isLeft()) {
                throw new Error(`Error parsing xpack info in ${this.PLUGIN_ID},   ${PathReporter_1.PathReporter.report(assertData)[0]}`);
            }
            this.info = xpackInfoUnpacked;
            return {
                security: xpackInfoUnpacked.security,
                settings: this.getSetting(this.CONFIG_PREFIX || this.PLUGIN_ID),
            };
        };
        const xpackMainPlugin = this.server.plugins.xpack_main;
        const thisPlugin = this.server.plugins.beats_management;
        mirror_plugin_status_1.mirrorPluginStatus(xpackMainPlugin, thisPlugin);
        xpackMainPlugin.status.on('green', () => {
            this.xpackInfoWasUpdatedHandler(xpackMainPlugin.info);
            // Register a function that is called whenever the xpack info changes,
            // to re-compute the license check results for this plugin
            xpackMainPlugin.info
                .feature(this.PLUGIN_ID)
                .registerLicenseCheckResultsGenerator(this.xpackInfoWasUpdatedHandler);
        });
    }
    on(event, cb) {
        switch (event) {
            case 'xpack.status.green':
                this.server.plugins.xpack_main.status.on('green', cb);
            case 'elasticsearch.status.green':
                this.server.plugins.elasticsearch.status.on('green', cb);
        }
    }
    getSetting(settingPath) {
        return this.server.config().get(settingPath);
    }
    log(text) {
        this.server.log(text);
    }
    exposeStaticDir(urlPath, dir) {
        this.server.route({
            handler: {
                directory: {
                    path: dir,
                },
            },
            method: 'GET',
            path: urlPath,
        });
    }
    registerRoute(route) {
        this.server.route({
            handler: async (request, h) => {
                // Note, RuntimeKibanaServerRequest is avalaible to validate request, and its type *is* KibanaServerRequest
                // but is not used here for perf reasons. It's value here is not high enough...
                return await route.handler(await this.wrapRequest(request), h);
            },
            method: route.method,
            path: route.path,
            config: route.config,
        });
    }
    async wrapRequest(req) {
        const { params, payload, query, headers, info } = req;
        let isAuthenticated = headers.authorization != null;
        let user;
        if (isAuthenticated) {
            user = await this.getUser(req);
            if (!user) {
                isAuthenticated = false;
            }
        }
        return {
            user: isAuthenticated && user
                ? {
                    kind: 'authenticated',
                    [adapter_types_1.internalAuthData]: headers,
                    ...user,
                }
                : {
                    kind: 'unauthenticated',
                },
            headers,
            info,
            params,
            payload,
            query,
        };
    }
    async getUser(request) {
        let user;
        try {
            user = await this.server.plugins.security.getUser(request);
        }
        catch (e) {
            return null;
        }
        if (user === null) {
            return null;
        }
        const assertKibanaUser = adapter_types_1.RuntimeKibanaUser.decode(user);
        if (assertKibanaUser.isLeft()) {
            throw new Error(`Error parsing user info in ${this.PLUGIN_ID},   ${PathReporter_1.PathReporter.report(assertKibanaUser)[0]}`);
        }
        return user;
    }
}
exports.KibanaBackendFrameworkAdapter = KibanaBackendFrameworkAdapter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvbGliL2FkYXB0ZXJzL2ZyYW1ld29yay9raWJhbmFfZnJhbWV3b3JrX2FkYXB0ZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2JlYXRzX21hbmFnZW1lbnQvc2VydmVyL2xpYi9hZGFwdGVycy9mcmFtZXdvcmsva2liYW5hX2ZyYW1ld29ya19hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUdILHlEQUFzRDtBQUN0RCxtQ0FBNkI7QUFDN0IsYUFBYTtBQUNiLDRGQUF1RjtBQUN2RixtREFjeUI7QUFFekIsTUFBYSw2QkFBNkI7SUFJeEMsWUFDbUIsU0FBaUIsRUFDakIsTUFBMEIsRUFDMUIsYUFBc0I7UUFGdEIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNqQixXQUFNLEdBQU4sTUFBTSxDQUFvQjtRQUMxQixrQkFBYSxHQUFiLGFBQWEsQ0FBUztRQU56QixpQkFBWSxHQUFHLDRCQUFZLENBQUM7UUFDckMsU0FBSSxHQUF5QixJQUFJLENBQUM7UUF5SGpDLCtCQUEwQixHQUFHLENBQUMsU0FBb0IsRUFBRSxFQUFFO1lBQzVELElBQUksaUJBQWdDLENBQUM7WUFFckMsNkRBQTZEO1lBQzdELG9EQUFvRDtZQUNwRCxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxFQUFFO2dCQUMxQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDakIsT0FBTzthQUNSO1lBRUQsSUFBSTtnQkFDRixpQkFBaUIsR0FBRztvQkFDbEIsTUFBTSxFQUFFO3dCQUNOLE9BQU8sRUFBRSxZQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxzQ0FBc0MsRUFBRSxTQUFTLENBQUM7cUJBQzdF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QyxTQUFTLE9BQzFDLDJCQUFZLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUN6QyxFQUFFLENBQ0gsQ0FBQztTQUNIO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBb0RGO0FBN0tELHNFQTZLQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFJlc3BvbnNlVG9vbGtpdCB9IGZyb20gJ2hhcGknO1xuaW1wb3J0IHsgUGF0aFJlcG9ydGVyIH0gZnJvbSAnaW8tdHMvbGliL1BhdGhSZXBvcnRlcic7XG5pbXBvcnQgeyBnZXQgfSBmcm9tICdsb2Rhc2gnO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IHsgbWlycm9yUGx1Z2luU3RhdHVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vc2VydmVyL2xpYi9taXJyb3JfcGx1Z2luX3N0YXR1cyc7XG5pbXBvcnQge1xuICBCYWNrZW5kRnJhbWV3b3JrQWRhcHRlcixcbiAgRnJhbWV3b3JrSW5mbyxcbiAgRnJhbWV3b3JrUmVxdWVzdCxcbiAgRnJhbWV3b3JrUmVzcG9uc2UsXG4gIEZyYW1ld29ya1JvdXRlT3B0aW9ucyxcbiAgaW50ZXJuYWxBdXRoRGF0YSxcbiAgaW50ZXJuYWxVc2VyLFxuICBLaWJhbmFMZWdhY3lTZXJ2ZXIsXG4gIEtpYmFuYVNlcnZlclJlcXVlc3QsXG4gIEtpYmFuYVVzZXIsXG4gIFJ1bnRpbWVGcmFtZXdvcmtJbmZvLFxuICBSdW50aW1lS2liYW5hVXNlcixcbiAgWHBhY2tJbmZvLFxufSBmcm9tICcuL2FkYXB0ZXJfdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgS2liYW5hQmFja2VuZEZyYW1ld29ya0FkYXB0ZXIgaW1wbGVtZW50cyBCYWNrZW5kRnJhbWV3b3JrQWRhcHRlciB7XG4gIHB1YmxpYyByZWFkb25seSBpbnRlcm5hbFVzZXIgPSBpbnRlcm5hbFVzZXI7XG4gIHB1YmxpYyBpbmZvOiBudWxsIHwgRnJhbWV3b3JrSW5mbyA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBQTFVHSU5fSUQ6IHN0cmluZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNlcnZlcjogS2liYW5hTGVnYWN5U2VydmVyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ09ORklHX1BSRUZJWD86IHN0cmluZ1xuICApIHtcbiAgICBjb25zdCB4cGFja01haW5QbHVnaW4gPSB0aGlzLnNlcnZlci5wbHVnaW5zLnhwYWNrX21haW47XG4gICAgY29uc3QgdGhpc1BsdWdpbiA9IHRoaXMuc2VydmVyLnBsdWdpbnMuYmVhdHNfbWFuYWdlbWVudDtcblxuICAgIG1pcnJvclBsdWdpblN0YXR1cyh4cGFja01haW5QbHVnaW4sIHRoaXNQbHVnaW4pO1xuXG4gICAgeHBhY2tNYWluUGx1Z2luLnN0YXR1cy5vbignZ3JlZW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLnhwYWNrSW5mb1dhc1VwZGF0ZWRIYW5kbGVyKHhwYWNrTWFpblBsdWdpbi5pbmZvKTtcbiAgICAgIC8vIFJlZ2lzdGVyIGEgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHhwYWNrIGluZm8gY2hhbmdlcyxcbiAgICAgIC8vIHRvIHJlLWNvbXB1dGUgdGhlIGxpY2Vuc2UgY2hlY2sgcmVzdWx0cyBmb3IgdGhpcyBwbHVnaW5cbiAgICAgIHhwYWNrTWFpblBsdWdpbi5pbmZvXG4gICAgICAgIC5mZWF0dXJlKHRoaXMuUExVR0lOX0lEKVxuICAgICAgICAucmVnaXN0ZXJMaWNlbnNlQ2hlY2tSZXN1bHRzR2VuZXJhdG9yKHRoaXMueHBhY2tJbmZvV2FzVXBkYXRlZEhhbmRsZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uKGV2ZW50OiAneHBhY2suc3RhdHVzLmdyZWVuJyB8ICdlbGFzdGljc2VhcmNoLnN0YXR1cy5ncmVlbicsIGNiOiAoKSA9PiB2b2lkKSB7XG4gICAgc3dpdGNoIChldmVudCkge1xuICAgICAgY2FzZSAneHBhY2suc3RhdHVzLmdyZWVuJzpcbiAgICAgICAgdGhpcy5zZXJ2ZXIucGx1Z2lucy54cGFja19tYWluLnN0YXR1cy5vbignZ3JlZW4nLCBjYik7XG4gICAgICBjYXNlICdlbGFzdGljc2VhcmNoLnN0YXR1cy5ncmVlbic6XG4gICAgICAgIHRoaXMuc2VydmVyLnBsdWdpbnMuZWxhc3RpY3NlYXJjaC5zdGF0dXMub24oJ2dyZWVuJywgY2IpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRTZXR0aW5nKHNldHRpbmdQYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2ZXIuY29uZmlnKCkuZ2V0KHNldHRpbmdQYXRoKTtcbiAgfVxuXG4gIHB1YmxpYyBsb2codGV4dDogc3RyaW5nKSB7XG4gICAgdGhpcy5zZXJ2ZXIubG9nKHRleHQpO1xuICB9XG5cbiAgcHVibGljIGV4cG9zZVN0YXRpY0Rpcih1cmxQYXRoOiBzdHJpbmcsIGRpcjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zZXJ2ZXIucm91dGUoe1xuICAgICAgaGFuZGxlcjoge1xuICAgICAgICBkaXJlY3Rvcnk6IHtcbiAgICAgICAgICBwYXRoOiBkaXIsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHBhdGg6IHVybFBhdGgsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJSb3V0ZTxcbiAgICBSb3V0ZVJlcXVlc3QgZXh0ZW5kcyBGcmFtZXdvcmtSZXF1ZXN0LFxuICAgIFJvdXRlUmVzcG9uc2UgZXh0ZW5kcyBGcmFtZXdvcmtSZXNwb25zZVxuICA+KHJvdXRlOiBGcmFtZXdvcmtSb3V0ZU9wdGlvbnM8Um91dGVSZXF1ZXN0LCBSb3V0ZVJlc3BvbnNlPikge1xuICAgIHRoaXMuc2VydmVyLnJvdXRlKHtcbiAgICAgIGhhbmRsZXI6IGFzeW5jIChyZXF1ZXN0OiBLaWJhbmFTZXJ2ZXJSZXF1ZXN0LCBoOiBSZXNwb25zZVRvb2xraXQpID0+IHtcbiAgICAgICAgLy8gTm90ZSwgUnVudGltZUtpYmFuYVNlcnZlclJlcXVlc3QgaXMgYXZhbGFpYmxlIHRvIHZhbGlkYXRlIHJlcXVlc3QsIGFuZCBpdHMgdHlwZSAqaXMqIEtpYmFuYVNlcnZlclJlcXVlc3RcbiAgICAgICAgLy8gYnV0IGlzIG5vdCB1c2VkIGhlcmUgZm9yIHBlcmYgcmVhc29ucy4gSXQncyB2YWx1ZSBoZXJlIGlzIG5vdCBoaWdoIGVub3VnaC4uLlxuICAgICAgICByZXR1cm4gYXdhaXQgcm91dGUuaGFuZGxlcihhd2FpdCB0aGlzLndyYXBSZXF1ZXN0PFJvdXRlUmVxdWVzdD4ocmVxdWVzdCksIGgpO1xuICAgICAgfSxcbiAgICAgIG1ldGhvZDogcm91dGUubWV0aG9kLFxuICAgICAgcGF0aDogcm91dGUucGF0aCxcbiAgICAgIGNvbmZpZzogcm91dGUuY29uZmlnLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB3cmFwUmVxdWVzdDxJbnRlcm5hbFJlcXVlc3QgZXh0ZW5kcyBLaWJhbmFTZXJ2ZXJSZXF1ZXN0PihcbiAgICByZXE6IEtpYmFuYVNlcnZlclJlcXVlc3RcbiAgKTogUHJvbWlzZTxGcmFtZXdvcmtSZXF1ZXN0PEludGVybmFsUmVxdWVzdD4+IHtcbiAgICBjb25zdCB7IHBhcmFtcywgcGF5bG9hZCwgcXVlcnksIGhlYWRlcnMsIGluZm8gfSA9IHJlcTtcblxuICAgIGxldCBpc0F1dGhlbnRpY2F0ZWQgPSBoZWFkZXJzLmF1dGhvcml6YXRpb24gIT0gbnVsbDtcbiAgICBsZXQgdXNlcjtcbiAgICBpZiAoaXNBdXRoZW50aWNhdGVkKSB7XG4gICAgICB1c2VyID0gYXdhaXQgdGhpcy5nZXRVc2VyKHJlcSk7XG4gICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB1c2VyOlxuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQgJiYgdXNlclxuICAgICAgICAgID8ge1xuICAgICAgICAgICAgICBraW5kOiAnYXV0aGVudGljYXRlZCcsXG4gICAgICAgICAgICAgIFtpbnRlcm5hbEF1dGhEYXRhXTogaGVhZGVycyxcbiAgICAgICAgICAgICAgLi4udXNlcixcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAga2luZDogJ3VuYXV0aGVudGljYXRlZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgaGVhZGVycyxcbiAgICAgIGluZm8sXG4gICAgICBwYXJhbXMsXG4gICAgICBwYXlsb2FkLFxuICAgICAgcXVlcnksXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZ2V0VXNlcihyZXF1ZXN0OiBLaWJhbmFTZXJ2ZXJSZXF1ZXN0KTogUHJvbWlzZTxLaWJhbmFVc2VyIHwgbnVsbD4ge1xuICAgIGxldCB1c2VyO1xuICAgIHRyeSB7XG4gICAgICB1c2VyID0gYXdhaXQgdGhpcy5zZXJ2ZXIucGx1Z2lucy5zZWN1cml0eS5nZXRVc2VyKHJlcXVlc3QpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAodXNlciA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGFzc2VydEtpYmFuYVVzZXIgPSBSdW50aW1lS2liYW5hVXNlci5kZWNvZGUodXNlcik7XG4gICAgaWYgKGFzc2VydEtpYmFuYVVzZXIuaXNMZWZ0KCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEVycm9yIHBhcnNpbmcgdXNlciBpbmZvIGluICR7dGhpcy5QTFVHSU5fSUR9LCAgICR7XG4gICAgICAgICAgUGF0aFJlcG9ydGVyLnJlcG9ydChhc3NlcnRLaWJhbmFVc2VyKVswXVxuICAgICAgICB9YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXNlcjtcbiAgfVxuXG4gIHByaXZhdGUgeHBhY2tJbmZvV2FzVXBkYXRlZEhhbmRsZXIgPSAoeHBhY2tJbmZvOiBYcGFja0luZm8pID0+IHtcbiAgICBsZXQgeHBhY2tJbmZvVW5wYWNrZWQ6IEZyYW1ld29ya0luZm87XG5cbiAgICAvLyBJZiwgZm9yIHNvbWUgcmVhc29uLCB3ZSBjYW5ub3QgZ2V0IHRoZSBsaWNlbnNlIGluZm9ybWF0aW9uXG4gICAgLy8gZnJvbSBFbGFzdGljc2VhcmNoLCBhc3N1bWUgd29yc3QgY2FzZSBhbmQgZGlzYWJsZVxuICAgIGlmICgheHBhY2tJbmZvIHx8ICF4cGFja0luZm8uaXNBdmFpbGFibGUoKSkge1xuICAgICAgdGhpcy5pbmZvID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgeHBhY2tJbmZvVW5wYWNrZWQgPSB7XG4gICAgICAgIGtpYmFuYToge1xuICAgICAgICAgIHZlcnNpb246IGdldCh0aGlzLnNlcnZlciwgJ3BsdWdpbnMua2liYW5hLnN0YXR1cy5wbHVnaW4udmVyc2lvbicsICd1bmtub3duJyksXG4gICAgICAgIH0sXG4gICAgICAgIGxpY2Vuc2U6IHtcbiAgICAgICAgICB0eXBlOiB4cGFja0luZm8ubGljZW5zZS5nZXRUeXBlKCksXG4gICAgICAgICAgZXhwaXJlZDogIXhwYWNrSW5mby5saWNlbnNlLmlzQWN0aXZlKCksXG4gICAgICAgICAgZXhwaXJ5X2RhdGVfaW5fbWlsbGlzOlxuICAgICAgICAgICAgeHBhY2tJbmZvLmxpY2Vuc2UuZ2V0RXhwaXJ5RGF0ZUluTWlsbGlzKCkgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICA/IHhwYWNrSW5mby5saWNlbnNlLmdldEV4cGlyeURhdGVJbk1pbGxpcygpXG4gICAgICAgICAgICAgIDogLTEsXG4gICAgICAgIH0sXG4gICAgICAgIHNlY3VyaXR5OiB7XG4gICAgICAgICAgZW5hYmxlZDogISF4cGFja0luZm8uZmVhdHVyZSgnc2VjdXJpdHknKSAmJiB4cGFja0luZm8uZmVhdHVyZSgnc2VjdXJpdHknKS5pc0VuYWJsZWQoKSxcbiAgICAgICAgICBhdmFpbGFibGU6ICEheHBhY2tJbmZvLmZlYXR1cmUoJ3NlY3VyaXR5JyksXG4gICAgICAgIH0sXG4gICAgICAgIHdhdGNoZXI6IHtcbiAgICAgICAgICBlbmFibGVkOiAhIXhwYWNrSW5mby5mZWF0dXJlKCd3YXRjaGVyJykgJiYgeHBhY2tJbmZvLmZlYXR1cmUoJ3dhdGNoZXInKS5pc0VuYWJsZWQoKSxcbiAgICAgICAgICBhdmFpbGFibGU6ICEheHBhY2tJbmZvLmZlYXR1cmUoJ3dhdGNoZXInKSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5zZXJ2ZXIubG9nKGBFcnJvciBhY2Nlc3NpbmcgcmVxdWlyZWQgeFBhY2tJbmZvIGluICR7dGhpcy5QTFVHSU5fSUR9IEtpYmFuYSBhZGFwdGVyYCk7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIGNvbnN0IGFzc2VydERhdGEgPSBSdW50aW1lRnJhbWV3b3JrSW5mby5kZWNvZGUoeHBhY2tJbmZvVW5wYWNrZWQpO1xuICAgIGlmIChhc3NlcnREYXRhLmlzTGVmdCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBFcnJvciBwYXJzaW5nIHhwYWNrIGluZm8gaW4gJHt0aGlzLlBMVUdJTl9JRH0sICAgJHtQYXRoUmVwb3J0ZXIucmVwb3J0KGFzc2VydERhdGEpWzBdfWBcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuaW5mbyA9IHhwYWNrSW5mb1VucGFja2VkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNlY3VyaXR5OiB4cGFja0luZm9VbnBhY2tlZC5zZWN1cml0eSxcbiAgICAgIHNldHRpbmdzOiB0aGlzLmdldFNldHRpbmcodGhpcy5DT05GSUdfUFJFRklYIHx8IHRoaXMuUExVR0lOX0lEKSxcbiAgICB9O1xuICB9O1xufVxuIl19