"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
class InfraKibanaConfigurationAdapter {
    constructor(server) {
        if (!isServerWithConfig(server)) {
            throw new Error('Failed to find configuration on server.');
        }
        this.server = server;
    }
    async get() {
        const config = this.server.config();
        if (!isKibanaConfiguration(config)) {
            throw new Error('Failed to access configuration of server.');
        }
        const configuration = config.get('xpack.infra') || {};
        const configurationWithDefaults = {
            enabled: true,
            query: {
                partitionSize: 75,
                partitionFactor: 1.2,
                ...(configuration.query || {}),
            },
            ...configuration,
        };
        // we assume this to be the configuration because Kibana would have already validated it
        return configurationWithDefaults;
    }
}
exports.InfraKibanaConfigurationAdapter = InfraKibanaConfigurationAdapter;
function isServerWithConfig(maybeServer) {
    return (joi_1.default.validate(maybeServer, joi_1.default.object({
        config: joi_1.default.func().required(),
    }).unknown()).error === null);
}
function isKibanaConfiguration(maybeConfiguration) {
    return (joi_1.default.validate(maybeConfiguration, joi_1.default.object({
        get: joi_1.default.func().required(),
    }).unknown()).error === null);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9jb25maWd1cmF0aW9uL2tpYmFuYV9jb25maWd1cmF0aW9uX2FkYXB0ZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvYWRhcHRlcnMvY29uZmlndXJhdGlvbi9raWJhbmFfY29uZmlndXJhdGlvbl9hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCxzREFBc0I7QUFJdEIsTUFBYSwrQkFBK0I7SUFHMUMsWUFBWSxNQUFXO1FBQ3JCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7U0FDNUQ7UUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRU0sS0FBSyxDQUFDLEdBQUc7UUFDZCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXBDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7U0FDOUQ7UUFFRCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0RCxNQUFNLHlCQUF5QixHQUEyQjtZQUN4RCxPQUFPLEVBQUUsSUFBSTtZQUNiLEtBQUssRUFBRTtnQkFDTCxhQUFhLEVBQUUsRUFBRTtnQkFDakIsZUFBZSxFQUFFLEdBQUc7Z0JBQ3BCLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQzthQUMvQjtZQUNELEdBQUcsYUFBYTtTQUNqQixDQUFDO1FBRUYsd0ZBQXdGO1FBQ3hGLE9BQU8seUJBQXlCLENBQUM7SUFDbkMsQ0FBQztDQUNGO0FBaENELDBFQWdDQztBQU1ELFNBQVMsa0JBQWtCLENBQUMsV0FBZ0I7SUFDMUMsT0FBTyxDQUNMLGFBQUcsQ0FBQyxRQUFRLENBQ1YsV0FBVyxFQUNYLGFBQUcsQ0FBQyxNQUFNLENBQUM7UUFDVCxNQUFNLEVBQUUsYUFBRyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtLQUM5QixDQUFDLENBQUMsT0FBTyxFQUFFLENBQ2IsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUNqQixDQUFDO0FBQ0osQ0FBQztBQU1ELFNBQVMscUJBQXFCLENBQUMsa0JBQXVCO0lBQ3BELE9BQU8sQ0FDTCxhQUFHLENBQUMsUUFBUSxDQUNWLGtCQUFrQixFQUNsQixhQUFHLENBQUMsTUFBTSxDQUFDO1FBQ1QsR0FBRyxFQUFFLGFBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7S0FDM0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUNiLENBQUMsS0FBSyxLQUFLLElBQUksQ0FDakIsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgSm9pIGZyb20gJ2pvaSc7XG5cbmltcG9ydCB7IEluZnJhQmFzZUNvbmZpZ3VyYXRpb24sIEluZnJhQ29uZmlndXJhdGlvbkFkYXB0ZXIgfSBmcm9tICcuL2FkYXB0ZXJfdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgSW5mcmFLaWJhbmFDb25maWd1cmF0aW9uQWRhcHRlciBpbXBsZW1lbnRzIEluZnJhQ29uZmlndXJhdGlvbkFkYXB0ZXIge1xuICBwcml2YXRlIHJlYWRvbmx5IHNlcnZlcjogU2VydmVyV2l0aENvbmZpZztcblxuICBjb25zdHJ1Y3RvcihzZXJ2ZXI6IGFueSkge1xuICAgIGlmICghaXNTZXJ2ZXJXaXRoQ29uZmlnKHNlcnZlcikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGZpbmQgY29uZmlndXJhdGlvbiBvbiBzZXJ2ZXIuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0KCkge1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuc2VydmVyLmNvbmZpZygpO1xuXG4gICAgaWYgKCFpc0tpYmFuYUNvbmZpZ3VyYXRpb24oY29uZmlnKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gYWNjZXNzIGNvbmZpZ3VyYXRpb24gb2Ygc2VydmVyLicpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbmZpZ3VyYXRpb24gPSBjb25maWcuZ2V0KCd4cGFjay5pbmZyYScpIHx8IHt9O1xuICAgIGNvbnN0IGNvbmZpZ3VyYXRpb25XaXRoRGVmYXVsdHM6IEluZnJhQmFzZUNvbmZpZ3VyYXRpb24gPSB7XG4gICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgcGFydGl0aW9uU2l6ZTogNzUsXG4gICAgICAgIHBhcnRpdGlvbkZhY3RvcjogMS4yLFxuICAgICAgICAuLi4oY29uZmlndXJhdGlvbi5xdWVyeSB8fCB7fSksXG4gICAgICB9LFxuICAgICAgLi4uY29uZmlndXJhdGlvbixcbiAgICB9O1xuXG4gICAgLy8gd2UgYXNzdW1lIHRoaXMgdG8gYmUgdGhlIGNvbmZpZ3VyYXRpb24gYmVjYXVzZSBLaWJhbmEgd291bGQgaGF2ZSBhbHJlYWR5IHZhbGlkYXRlZCBpdFxuICAgIHJldHVybiBjb25maWd1cmF0aW9uV2l0aERlZmF1bHRzO1xuICB9XG59XG5cbmludGVyZmFjZSBTZXJ2ZXJXaXRoQ29uZmlnIHtcbiAgY29uZmlnKCk6IGFueTtcbn1cblxuZnVuY3Rpb24gaXNTZXJ2ZXJXaXRoQ29uZmlnKG1heWJlU2VydmVyOiBhbnkpOiBtYXliZVNlcnZlciBpcyBTZXJ2ZXJXaXRoQ29uZmlnIHtcbiAgcmV0dXJuIChcbiAgICBKb2kudmFsaWRhdGUoXG4gICAgICBtYXliZVNlcnZlcixcbiAgICAgIEpvaS5vYmplY3Qoe1xuICAgICAgICBjb25maWc6IEpvaS5mdW5jKCkucmVxdWlyZWQoKSxcbiAgICAgIH0pLnVua25vd24oKVxuICAgICkuZXJyb3IgPT09IG51bGxcbiAgKTtcbn1cblxuaW50ZXJmYWNlIEtpYmFuYUNvbmZpZ3VyYXRpb24ge1xuICBnZXQoa2V5OiBzdHJpbmcpOiBhbnk7XG59XG5cbmZ1bmN0aW9uIGlzS2liYW5hQ29uZmlndXJhdGlvbihtYXliZUNvbmZpZ3VyYXRpb246IGFueSk6IG1heWJlQ29uZmlndXJhdGlvbiBpcyBLaWJhbmFDb25maWd1cmF0aW9uIHtcbiAgcmV0dXJuIChcbiAgICBKb2kudmFsaWRhdGUoXG4gICAgICBtYXliZUNvbmZpZ3VyYXRpb24sXG4gICAgICBKb2kub2JqZWN0KHtcbiAgICAgICAgZ2V0OiBKb2kuZnVuYygpLnJlcXVpcmVkKCksXG4gICAgICB9KS51bmtub3duKClcbiAgICApLmVycm9yID09PSBudWxsXG4gICk7XG59XG4iXX0=