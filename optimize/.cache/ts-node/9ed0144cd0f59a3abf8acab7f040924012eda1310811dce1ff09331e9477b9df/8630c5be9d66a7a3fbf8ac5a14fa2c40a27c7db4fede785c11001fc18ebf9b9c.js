"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const lodash_1 = require("lodash");
class BackendFrameworkLib {
    constructor(adapter) {
        this.adapter = adapter;
        this.log = this.adapter.log;
        this.on = this.adapter.on.bind(this.adapter);
        this.exposeStaticDir = this.adapter.exposeStaticDir;
        this.internalUser = this.adapter.internalUser;
        this.validateConfig();
    }
    registerRoute(route) {
        this.adapter.registerRoute({
            ...route,
            handler: this.wrapRouteWithSecurity(route.handler, route.licenseRequired || [], route.requiredRoles),
        });
    }
    getSetting(setting) {
        return this.adapter.getSetting(`xpack.beats.${setting}`);
    }
    /**
     * Expired `null` happens when we have no xpack info
     */
    get license() {
        return {
            type: this.adapter.info ? this.adapter.info.license.type : 'unknown',
            expired: this.adapter.info ? this.adapter.info.license.expired : null,
        };
    }
    get securityIsEnabled() {
        return this.adapter.info ? this.adapter.info.security.enabled : false;
    }
    validateConfig() {
        const encryptionKey = this.adapter.getSetting('xpack.beats.encryptionKey');
        if (!encryptionKey) {
            this.adapter.log('Using a default encryption key for xpack.beats.encryptionKey. It is recommended that you set xpack.beats.encryptionKey in kibana.yml with a unique token');
        }
    }
    wrapRouteWithSecurity(handler, requiredLicense, requiredRoles) {
        return async (request, h) => {
            if (requiredLicense.length > 0 &&
                (this.license.expired || !requiredLicense.includes(this.license.type))) {
                return boom_1.default.forbidden(`Your ${this.license.type} license does not support this API or is expired. Please upgrade your license.`);
            }
            if (requiredRoles) {
                if (request.user.kind !== 'authenticated') {
                    return h.response().code(403);
                }
                if (request.user.kind === 'authenticated' &&
                    !request.user.roles.includes('superuser') &&
                    lodash_1.difference(requiredRoles, request.user.roles).length !== 0) {
                    return h.response().code(403);
                }
            }
            return await handler(request, h);
        };
    }
}
exports.BackendFrameworkLib = BackendFrameworkLib;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvbGliL2ZyYW1ld29yay50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYmVhdHNfbWFuYWdlbWVudC9zZXJ2ZXIvbGliL2ZyYW1ld29yay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7O0FBRUgsd0RBQXdCO0FBQ3hCLG1DQUFvQztBQVNwQyxNQUFhLG1CQUFtQjtJQUs5QixZQUE2QixPQUFnQztRQUFoQyxZQUFPLEdBQVAsT0FBTyxDQUF5QjtRQUp0RCxRQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDdkIsT0FBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEMsb0JBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztRQUMvQyxpQkFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBRTlDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRU0sYUFBYSxDQUdsQixLQUF5RDtRQUN6RCxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUN6QixHQUFHLEtBQUs7WUFDUixPQUFPLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUNqQyxLQUFLLENBQUMsT0FBTyxFQUNiLEtBQUssQ0FBQyxlQUFlLElBQUksRUFBRSxFQUMzQixLQUFLLENBQUMsYUFBYSxDQUNwQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFLTSxVQUFVLENBQ2YsT0FBOEU7UUFFOUUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxlQUFlLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxPQUFPO1FBQ1QsT0FBTztZQUNMLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUztZQUNwRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUk7U0FDdEUsQ0FBQztJQUNKLENBQUM7SUFFRCxJQUFJLGlCQUFpQjtRQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDeEUsQ0FBQztJQUVPLGNBQWM7UUFDcEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUUzRSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUNkLDBKQUEwSixDQUMzSixDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBRU8scUJBQXFCLENBQzNCLE9BQXdDLEVBQ3hDLGVBQXlCLEVBQ3pCLGFBQXdCO1FBRXhCLE9BQU8sS0FBSyxFQUFFLE9BQXlCLEVBQUUsQ0FBTSxFQUFFLEVBQUU7WUFDakQsSUFDRSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQzFCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDdEU7Z0JBQ0EsT0FBTyxjQUFJLENBQUMsU0FBUyxDQUNuQixRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFDZixnRkFBZ0YsQ0FDakYsQ0FBQzthQUNIO1lBRUQsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssZUFBZSxFQUFFO29CQUN6QyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQy9CO2dCQUVELElBQ0UsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssZUFBZTtvQkFDckMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO29CQUN6QyxtQkFBVSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQzFEO29CQUNBLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDL0I7YUFDRjtZQUNELE9BQU8sTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXpGRCxrREF5RkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgQm9vbSBmcm9tICdib29tJztcbmltcG9ydCB7IGRpZmZlcmVuY2UgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgQmFja2VuZEZyYW1ld29ya0FkYXB0ZXIsXG4gIEZyYW1ld29ya1JlcXVlc3QsXG4gIEZyYW1ld29ya1Jlc3BvbnNlLFxuICBGcmFtZXdvcmtSb3V0ZUhhbmRsZXIsXG4gIEZyYW1ld29ya1JvdXRlT3B0aW9ucyxcbn0gZnJvbSAnLi9hZGFwdGVycy9mcmFtZXdvcmsvYWRhcHRlcl90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBCYWNrZW5kRnJhbWV3b3JrTGliIHtcbiAgcHVibGljIGxvZyA9IHRoaXMuYWRhcHRlci5sb2c7XG4gIHB1YmxpYyBvbiA9IHRoaXMuYWRhcHRlci5vbi5iaW5kKHRoaXMuYWRhcHRlcik7XG4gIHB1YmxpYyBleHBvc2VTdGF0aWNEaXIgPSB0aGlzLmFkYXB0ZXIuZXhwb3NlU3RhdGljRGlyO1xuICBwdWJsaWMgaW50ZXJuYWxVc2VyID0gdGhpcy5hZGFwdGVyLmludGVybmFsVXNlcjtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBhZGFwdGVyOiBCYWNrZW5kRnJhbWV3b3JrQWRhcHRlcikge1xuICAgIHRoaXMudmFsaWRhdGVDb25maWcoKTtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlclJvdXRlPFxuICAgIFJvdXRlUmVxdWVzdCBleHRlbmRzIEZyYW1ld29ya1JlcXVlc3QsXG4gICAgUm91dGVSZXNwb25zZSBleHRlbmRzIEZyYW1ld29ya1Jlc3BvbnNlXG4gID4ocm91dGU6IEZyYW1ld29ya1JvdXRlT3B0aW9uczxSb3V0ZVJlcXVlc3QsIFJvdXRlUmVzcG9uc2U+KSB7XG4gICAgdGhpcy5hZGFwdGVyLnJlZ2lzdGVyUm91dGUoe1xuICAgICAgLi4ucm91dGUsXG4gICAgICBoYW5kbGVyOiB0aGlzLndyYXBSb3V0ZVdpdGhTZWN1cml0eShcbiAgICAgICAgcm91dGUuaGFuZGxlcixcbiAgICAgICAgcm91dGUubGljZW5zZVJlcXVpcmVkIHx8IFtdLFxuICAgICAgICByb3V0ZS5yZXF1aXJlZFJvbGVzXG4gICAgICApLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldFNldHRpbmcoc2V0dGluZzogJ2VuY3J5cHRpb25LZXknKTogc3RyaW5nO1xuICBwdWJsaWMgZ2V0U2V0dGluZyhzZXR0aW5nOiAnZW5yb2xsbWVudFRva2Vuc1R0bEluU2Vjb25kcycpOiBudW1iZXI7XG4gIHB1YmxpYyBnZXRTZXR0aW5nKHNldHRpbmc6ICdkZWZhdWx0VXNlclJvbGVzJyk6IHN0cmluZ1tdO1xuICBwdWJsaWMgZ2V0U2V0dGluZyhcbiAgICBzZXR0aW5nOiAnZW5jcnlwdGlvbktleScgfCAnZW5yb2xsbWVudFRva2Vuc1R0bEluU2Vjb25kcycgfCAnZGVmYXVsdFVzZXJSb2xlcydcbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRTZXR0aW5nKGB4cGFjay5iZWF0cy4ke3NldHRpbmd9YCk7XG4gIH1cblxuICAvKipcbiAgICogRXhwaXJlZCBgbnVsbGAgaGFwcGVucyB3aGVuIHdlIGhhdmUgbm8geHBhY2sgaW5mb1xuICAgKi9cbiAgZ2V0IGxpY2Vuc2UoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHRoaXMuYWRhcHRlci5pbmZvID8gdGhpcy5hZGFwdGVyLmluZm8ubGljZW5zZS50eXBlIDogJ3Vua25vd24nLFxuICAgICAgZXhwaXJlZDogdGhpcy5hZGFwdGVyLmluZm8gPyB0aGlzLmFkYXB0ZXIuaW5mby5saWNlbnNlLmV4cGlyZWQgOiBudWxsLFxuICAgIH07XG4gIH1cblxuICBnZXQgc2VjdXJpdHlJc0VuYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5pbmZvID8gdGhpcy5hZGFwdGVyLmluZm8uc2VjdXJpdHkuZW5hYmxlZCA6IGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZUNvbmZpZygpIHtcbiAgICBjb25zdCBlbmNyeXB0aW9uS2V5ID0gdGhpcy5hZGFwdGVyLmdldFNldHRpbmcoJ3hwYWNrLmJlYXRzLmVuY3J5cHRpb25LZXknKTtcblxuICAgIGlmICghZW5jcnlwdGlvbktleSkge1xuICAgICAgdGhpcy5hZGFwdGVyLmxvZyhcbiAgICAgICAgJ1VzaW5nIGEgZGVmYXVsdCBlbmNyeXB0aW9uIGtleSBmb3IgeHBhY2suYmVhdHMuZW5jcnlwdGlvbktleS4gSXQgaXMgcmVjb21tZW5kZWQgdGhhdCB5b3Ugc2V0IHhwYWNrLmJlYXRzLmVuY3J5cHRpb25LZXkgaW4ga2liYW5hLnltbCB3aXRoIGEgdW5pcXVlIHRva2VuJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHdyYXBSb3V0ZVdpdGhTZWN1cml0eShcbiAgICBoYW5kbGVyOiBGcmFtZXdvcmtSb3V0ZUhhbmRsZXI8YW55LCBhbnk+LFxuICAgIHJlcXVpcmVkTGljZW5zZTogc3RyaW5nW10sXG4gICAgcmVxdWlyZWRSb2xlcz86IHN0cmluZ1tdXG4gICkge1xuICAgIHJldHVybiBhc3luYyAocmVxdWVzdDogRnJhbWV3b3JrUmVxdWVzdCwgaDogYW55KSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIHJlcXVpcmVkTGljZW5zZS5sZW5ndGggPiAwICYmXG4gICAgICAgICh0aGlzLmxpY2Vuc2UuZXhwaXJlZCB8fCAhcmVxdWlyZWRMaWNlbnNlLmluY2x1ZGVzKHRoaXMubGljZW5zZS50eXBlKSlcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gQm9vbS5mb3JiaWRkZW4oXG4gICAgICAgICAgYFlvdXIgJHtcbiAgICAgICAgICAgIHRoaXMubGljZW5zZS50eXBlXG4gICAgICAgICAgfSBsaWNlbnNlIGRvZXMgbm90IHN1cHBvcnQgdGhpcyBBUEkgb3IgaXMgZXhwaXJlZC4gUGxlYXNlIHVwZ3JhZGUgeW91ciBsaWNlbnNlLmBcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlcXVpcmVkUm9sZXMpIHtcbiAgICAgICAgaWYgKHJlcXVlc3QudXNlci5raW5kICE9PSAnYXV0aGVudGljYXRlZCcpIHtcbiAgICAgICAgICByZXR1cm4gaC5yZXNwb25zZSgpLmNvZGUoNDAzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICByZXF1ZXN0LnVzZXIua2luZCA9PT0gJ2F1dGhlbnRpY2F0ZWQnICYmXG4gICAgICAgICAgIXJlcXVlc3QudXNlci5yb2xlcy5pbmNsdWRlcygnc3VwZXJ1c2VyJykgJiZcbiAgICAgICAgICBkaWZmZXJlbmNlKHJlcXVpcmVkUm9sZXMsIHJlcXVlc3QudXNlci5yb2xlcykubGVuZ3RoICE9PSAwXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiBoLnJlc3BvbnNlKCkuY29kZSg0MDMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYXdhaXQgaGFuZGxlcihyZXF1ZXN0LCBoKTtcbiAgICB9O1xuICB9XG59XG4iXX0=