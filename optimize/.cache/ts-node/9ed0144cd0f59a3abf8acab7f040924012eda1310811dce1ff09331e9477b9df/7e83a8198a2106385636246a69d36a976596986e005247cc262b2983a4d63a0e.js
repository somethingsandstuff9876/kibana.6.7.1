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
function initDeleteSpacesApi(server, routePreCheckLicenseFn) {
    server.route({
        method: 'DELETE',
        path: '/api/spaces/space/{id}',
        async handler(request, h) {
            const { SavedObjectsClient } = server.savedObjects;
            const spacesClient = server.plugins.spaces.spacesClient.getScopedClient(request);
            const id = request.params.id;
            let result;
            try {
                result = await spacesClient.delete(id);
            }
            catch (error) {
                if (SavedObjectsClient.errors.isNotFoundError(error)) {
                    return boom_1.default.notFound();
                }
                return errors_1.wrapError(error);
            }
            return h.response(result).code(204);
        },
        config: {
            pre: [routePreCheckLicenseFn],
        },
    });
}
exports.initDeleteSpacesApi = initDeleteSpacesApi;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9yb3V0ZXMvYXBpL3B1YmxpYy9kZWxldGUudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3NwYWNlcy9zZXJ2ZXIvcm91dGVzL2FwaS9wdWJsaWMvZGVsZXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCx3REFBd0I7QUFDeEIsZ0RBQWdEO0FBR2hELFNBQWdCLG1CQUFtQixDQUFDLE1BQVcsRUFBRSxzQkFBMkI7SUFDMUUsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNYLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLElBQUksRUFBRSx3QkFBd0I7UUFDOUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFZLEVBQUUsQ0FBTTtZQUNoQyxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO1lBQ25ELE1BQU0sWUFBWSxHQUFpQixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUNuRixPQUFPLENBQ1IsQ0FBQztZQUVGLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBRTdCLElBQUksTUFBTSxDQUFDO1lBRVgsSUFBSTtnQkFDRixNQUFNLEdBQUcsTUFBTSxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ3hDO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNwRCxPQUFPLGNBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztpQkFDeEI7Z0JBQ0QsT0FBTyxrQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3pCO1lBRUQsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQ0QsTUFBTSxFQUFFO1lBQ04sR0FBRyxFQUFFLENBQUMsc0JBQXNCLENBQUM7U0FDOUI7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBN0JELGtEQTZCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBCb29tIGZyb20gJ2Jvb20nO1xuaW1wb3J0IHsgd3JhcEVycm9yIH0gZnJvbSAnLi4vLi4vLi4vbGliL2Vycm9ycyc7XG5pbXBvcnQgeyBTcGFjZXNDbGllbnQgfSBmcm9tICcuLi8uLi8uLi9saWIvc3BhY2VzX2NsaWVudCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0RGVsZXRlU3BhY2VzQXBpKHNlcnZlcjogYW55LCByb3V0ZVByZUNoZWNrTGljZW5zZUZuOiBhbnkpIHtcbiAgc2VydmVyLnJvdXRlKHtcbiAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgIHBhdGg6ICcvYXBpL3NwYWNlcy9zcGFjZS97aWR9JyxcbiAgICBhc3luYyBoYW5kbGVyKHJlcXVlc3Q6IGFueSwgaDogYW55KSB7XG4gICAgICBjb25zdCB7IFNhdmVkT2JqZWN0c0NsaWVudCB9ID0gc2VydmVyLnNhdmVkT2JqZWN0cztcbiAgICAgIGNvbnN0IHNwYWNlc0NsaWVudDogU3BhY2VzQ2xpZW50ID0gc2VydmVyLnBsdWdpbnMuc3BhY2VzLnNwYWNlc0NsaWVudC5nZXRTY29wZWRDbGllbnQoXG4gICAgICAgIHJlcXVlc3RcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGlkID0gcmVxdWVzdC5wYXJhbXMuaWQ7XG5cbiAgICAgIGxldCByZXN1bHQ7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGF3YWl0IHNwYWNlc0NsaWVudC5kZWxldGUoaWQpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKFNhdmVkT2JqZWN0c0NsaWVudC5lcnJvcnMuaXNOb3RGb3VuZEVycm9yKGVycm9yKSkge1xuICAgICAgICAgIHJldHVybiBCb29tLm5vdEZvdW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHdyYXBFcnJvcihlcnJvcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoLnJlc3BvbnNlKHJlc3VsdCkuY29kZSgyMDQpO1xuICAgIH0sXG4gICAgY29uZmlnOiB7XG4gICAgICBwcmU6IFtyb3V0ZVByZUNoZWNrTGljZW5zZUZuXSxcbiAgICB9LFxuICB9KTtcbn1cbiJdfQ==