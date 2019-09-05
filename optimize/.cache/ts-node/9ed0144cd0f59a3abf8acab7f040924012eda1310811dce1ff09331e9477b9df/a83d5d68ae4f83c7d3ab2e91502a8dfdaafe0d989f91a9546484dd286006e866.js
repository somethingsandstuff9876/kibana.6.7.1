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
const space_schema_1 = require("../../../lib/space_schema");
function initPostSpacesApi(server, routePreCheckLicenseFn) {
    server.route({
        method: 'POST',
        path: '/api/spaces/space',
        async handler(request) {
            const { SavedObjectsClient } = server.savedObjects;
            const spacesClient = server.plugins.spaces.spacesClient.getScopedClient(request);
            const space = request.payload;
            try {
                return await spacesClient.create(space);
            }
            catch (error) {
                if (SavedObjectsClient.errors.isConflictError(error)) {
                    return boom_1.default.conflict(`A space with the identifier ${space.id} already exists.`);
                }
                return errors_1.wrapError(error);
            }
        },
        config: {
            validate: {
                payload: space_schema_1.spaceSchema,
            },
            pre: [routePreCheckLicenseFn],
        },
    });
}
exports.initPostSpacesApi = initPostSpacesApi;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9yb3V0ZXMvYXBpL3B1YmxpYy9wb3N0LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9zcGFjZXMvc2VydmVyL3JvdXRlcy9hcGkvcHVibGljL3Bvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILHdEQUF3QjtBQUN4QixnREFBZ0Q7QUFDaEQsNERBQXdEO0FBR3hELFNBQWdCLGlCQUFpQixDQUFDLE1BQVcsRUFBRSxzQkFBMkI7SUFDeEUsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNYLE1BQU0sRUFBRSxNQUFNO1FBQ2QsSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixLQUFLLENBQUMsT0FBTyxDQUFDLE9BQVk7WUFDeEIsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztZQUNuRCxNQUFNLFlBQVksR0FBaUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FDbkYsT0FBTyxDQUNSLENBQUM7WUFFRixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBRTlCLElBQUk7Z0JBQ0YsT0FBTyxNQUFNLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDekM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxJQUFJLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ3BELE9BQU8sY0FBSSxDQUFDLFFBQVEsQ0FBQywrQkFBK0IsS0FBSyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztpQkFDakY7Z0JBQ0QsT0FBTyxrQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3pCO1FBQ0gsQ0FBQztRQUNELE1BQU0sRUFBRTtZQUNOLFFBQVEsRUFBRTtnQkFDUixPQUFPLEVBQUUsMEJBQVc7YUFDckI7WUFDRCxHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztTQUM5QjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUE1QkQsOENBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IEJvb20gZnJvbSAnYm9vbSc7XG5pbXBvcnQgeyB3cmFwRXJyb3IgfSBmcm9tICcuLi8uLi8uLi9saWIvZXJyb3JzJztcbmltcG9ydCB7IHNwYWNlU2NoZW1hIH0gZnJvbSAnLi4vLi4vLi4vbGliL3NwYWNlX3NjaGVtYSc7XG5pbXBvcnQgeyBTcGFjZXNDbGllbnQgfSBmcm9tICcuLi8uLi8uLi9saWIvc3BhY2VzX2NsaWVudCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0UG9zdFNwYWNlc0FwaShzZXJ2ZXI6IGFueSwgcm91dGVQcmVDaGVja0xpY2Vuc2VGbjogYW55KSB7XG4gIHNlcnZlci5yb3V0ZSh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgcGF0aDogJy9hcGkvc3BhY2VzL3NwYWNlJyxcbiAgICBhc3luYyBoYW5kbGVyKHJlcXVlc3Q6IGFueSkge1xuICAgICAgY29uc3QgeyBTYXZlZE9iamVjdHNDbGllbnQgfSA9IHNlcnZlci5zYXZlZE9iamVjdHM7XG4gICAgICBjb25zdCBzcGFjZXNDbGllbnQ6IFNwYWNlc0NsaWVudCA9IHNlcnZlci5wbHVnaW5zLnNwYWNlcy5zcGFjZXNDbGllbnQuZ2V0U2NvcGVkQ2xpZW50KFxuICAgICAgICByZXF1ZXN0XG4gICAgICApO1xuXG4gICAgICBjb25zdCBzcGFjZSA9IHJlcXVlc3QucGF5bG9hZDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHNwYWNlc0NsaWVudC5jcmVhdGUoc3BhY2UpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKFNhdmVkT2JqZWN0c0NsaWVudC5lcnJvcnMuaXNDb25mbGljdEVycm9yKGVycm9yKSkge1xuICAgICAgICAgIHJldHVybiBCb29tLmNvbmZsaWN0KGBBIHNwYWNlIHdpdGggdGhlIGlkZW50aWZpZXIgJHtzcGFjZS5pZH0gYWxyZWFkeSBleGlzdHMuYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHdyYXBFcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgfSxcbiAgICBjb25maWc6IHtcbiAgICAgIHZhbGlkYXRlOiB7XG4gICAgICAgIHBheWxvYWQ6IHNwYWNlU2NoZW1hLFxuICAgICAgfSxcbiAgICAgIHByZTogW3JvdXRlUHJlQ2hlY2tMaWNlbnNlRm5dLFxuICAgIH0sXG4gIH0pO1xufVxuIl19