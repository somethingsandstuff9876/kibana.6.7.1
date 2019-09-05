"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const errors_1 = require("../../../lib/errors");
function initGetSpacesApi(server, routePreCheckLicenseFn) {
    server.route({
        method: 'GET',
        path: '/api/spaces/space',
        async handler(request) {
            const spacesClient = server.plugins.spaces.spacesClient.getScopedClient(request);
            let spaces;
            try {
                spaces = await spacesClient.getAll();
            }
            catch (error) {
                return errors_1.wrapError(error);
            }
            return spaces;
        },
        config: {
            pre: [routePreCheckLicenseFn],
        },
    });
    server.route({
        method: 'GET',
        path: '/api/spaces/space/{id}',
        async handler(request) {
            const spaceId = request.params.id;
            const { SavedObjectsClient } = server.savedObjects;
            const spacesClient = server.plugins.spaces.spacesClient.getScopedClient(request);
            try {
                return await spacesClient.get(spaceId);
            }
            catch (error) {
                if (SavedObjectsClient.errors.isNotFoundError(error)) {
                    return boom_1.default.notFound();
                }
                return errors_1.wrapError(error);
            }
        },
        config: {
            pre: [routePreCheckLicenseFn],
        },
    });
}
exports.initGetSpacesApi = initGetSpacesApi;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9yb3V0ZXMvYXBpL3B1YmxpYy9nZXQudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3NwYWNlcy9zZXJ2ZXIvcm91dGVzL2FwaS9wdWJsaWMvZ2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCx3REFBd0I7QUFFeEIsZ0RBQWdEO0FBR2hELFNBQWdCLGdCQUFnQixDQUFDLE1BQVcsRUFBRSxzQkFBMkI7SUFDdkUsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNYLE1BQU0sRUFBRSxLQUFLO1FBQ2IsSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixLQUFLLENBQUMsT0FBTyxDQUFDLE9BQVk7WUFDeEIsTUFBTSxZQUFZLEdBQWlCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQ25GLE9BQU8sQ0FDUixDQUFDO1lBRUYsSUFBSSxNQUFlLENBQUM7WUFFcEIsSUFBSTtnQkFDRixNQUFNLEdBQUcsTUFBTSxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDdEM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxPQUFPLGtCQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDekI7WUFFRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBQ0QsTUFBTSxFQUFFO1lBQ04sR0FBRyxFQUFFLENBQUMsc0JBQXNCLENBQUM7U0FDOUI7S0FDRixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ1gsTUFBTSxFQUFFLEtBQUs7UUFDYixJQUFJLEVBQUUsd0JBQXdCO1FBQzlCLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBWTtZQUN4QixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUVsQyxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO1lBQ25ELE1BQU0sWUFBWSxHQUFpQixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUNuRixPQUFPLENBQ1IsQ0FBQztZQUVGLElBQUk7Z0JBQ0YsT0FBTyxNQUFNLFlBQVksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDeEM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxJQUFJLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ3BELE9BQU8sY0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUN4QjtnQkFDRCxPQUFPLGtCQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDekI7UUFDSCxDQUFDO1FBQ0QsTUFBTSxFQUFFO1lBQ04sR0FBRyxFQUFFLENBQUMsc0JBQXNCLENBQUM7U0FDOUI7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBaERELDRDQWdEQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBCb29tIGZyb20gJ2Jvb20nO1xuaW1wb3J0IHsgU3BhY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9jb21tb24vbW9kZWwvc3BhY2UnO1xuaW1wb3J0IHsgd3JhcEVycm9yIH0gZnJvbSAnLi4vLi4vLi4vbGliL2Vycm9ycyc7XG5pbXBvcnQgeyBTcGFjZXNDbGllbnQgfSBmcm9tICcuLi8uLi8uLi9saWIvc3BhY2VzX2NsaWVudCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0R2V0U3BhY2VzQXBpKHNlcnZlcjogYW55LCByb3V0ZVByZUNoZWNrTGljZW5zZUZuOiBhbnkpIHtcbiAgc2VydmVyLnJvdXRlKHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHBhdGg6ICcvYXBpL3NwYWNlcy9zcGFjZScsXG4gICAgYXN5bmMgaGFuZGxlcihyZXF1ZXN0OiBhbnkpIHtcbiAgICAgIGNvbnN0IHNwYWNlc0NsaWVudDogU3BhY2VzQ2xpZW50ID0gc2VydmVyLnBsdWdpbnMuc3BhY2VzLnNwYWNlc0NsaWVudC5nZXRTY29wZWRDbGllbnQoXG4gICAgICAgIHJlcXVlc3RcbiAgICAgICk7XG5cbiAgICAgIGxldCBzcGFjZXM6IFNwYWNlW107XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHNwYWNlcyA9IGF3YWl0IHNwYWNlc0NsaWVudC5nZXRBbGwoKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB3cmFwRXJyb3IoZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3BhY2VzO1xuICAgIH0sXG4gICAgY29uZmlnOiB7XG4gICAgICBwcmU6IFtyb3V0ZVByZUNoZWNrTGljZW5zZUZuXSxcbiAgICB9LFxuICB9KTtcblxuICBzZXJ2ZXIucm91dGUoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgcGF0aDogJy9hcGkvc3BhY2VzL3NwYWNlL3tpZH0nLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxdWVzdDogYW55KSB7XG4gICAgICBjb25zdCBzcGFjZUlkID0gcmVxdWVzdC5wYXJhbXMuaWQ7XG5cbiAgICAgIGNvbnN0IHsgU2F2ZWRPYmplY3RzQ2xpZW50IH0gPSBzZXJ2ZXIuc2F2ZWRPYmplY3RzO1xuICAgICAgY29uc3Qgc3BhY2VzQ2xpZW50OiBTcGFjZXNDbGllbnQgPSBzZXJ2ZXIucGx1Z2lucy5zcGFjZXMuc3BhY2VzQ2xpZW50LmdldFNjb3BlZENsaWVudChcbiAgICAgICAgcmVxdWVzdFxuICAgICAgKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHNwYWNlc0NsaWVudC5nZXQoc3BhY2VJZCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoU2F2ZWRPYmplY3RzQ2xpZW50LmVycm9ycy5pc05vdEZvdW5kRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgcmV0dXJuIEJvb20ubm90Rm91bmQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd3JhcEVycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbmZpZzoge1xuICAgICAgcHJlOiBbcm91dGVQcmVDaGVja0xpY2Vuc2VGbl0sXG4gICAgfSxcbiAgfSk7XG59XG4iXX0=