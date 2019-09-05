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
function initPutSpacesApi(server, routePreCheckLicenseFn) {
    server.route({
        method: 'PUT',
        path: '/api/spaces/space/{id}',
        async handler(request) {
            const { SavedObjectsClient } = server.savedObjects;
            const spacesClient = server.plugins.spaces.spacesClient.getScopedClient(request);
            const space = request.payload;
            const id = request.params.id;
            let result;
            try {
                result = await spacesClient.update(id, { ...space });
            }
            catch (error) {
                if (SavedObjectsClient.errors.isNotFoundError(error)) {
                    return boom_1.default.notFound();
                }
                return errors_1.wrapError(error);
            }
            return result;
        },
        config: {
            validate: {
                payload: space_schema_1.spaceSchema,
            },
            pre: [routePreCheckLicenseFn],
        },
    });
}
exports.initPutSpacesApi = initPutSpacesApi;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9yb3V0ZXMvYXBpL3B1YmxpYy9wdXQudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3NwYWNlcy9zZXJ2ZXIvcm91dGVzL2FwaS9wdWJsaWMvcHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCx3REFBd0I7QUFFeEIsZ0RBQWdEO0FBQ2hELDREQUF3RDtBQUd4RCxTQUFnQixnQkFBZ0IsQ0FBQyxNQUFXLEVBQUUsc0JBQTJCO0lBQ3ZFLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDWCxNQUFNLEVBQUUsS0FBSztRQUNiLElBQUksRUFBRSx3QkFBd0I7UUFDOUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFZO1lBQ3hCLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7WUFDbkQsTUFBTSxZQUFZLEdBQWlCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQ25GLE9BQU8sQ0FDUixDQUFDO1lBRUYsTUFBTSxLQUFLLEdBQVUsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUNyQyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUU3QixJQUFJLE1BQWEsQ0FBQztZQUNsQixJQUFJO2dCQUNGLE1BQU0sR0FBRyxNQUFNLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2FBQ3REO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNwRCxPQUFPLGNBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztpQkFDeEI7Z0JBQ0QsT0FBTyxrQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3pCO1lBRUQsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztRQUNELE1BQU0sRUFBRTtZQUNOLFFBQVEsRUFBRTtnQkFDUixPQUFPLEVBQUUsMEJBQVc7YUFDckI7WUFDRCxHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztTQUM5QjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUFoQ0QsNENBZ0NDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IEJvb20gZnJvbSAnYm9vbSc7XG5pbXBvcnQgeyBTcGFjZSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbW1vbi9tb2RlbC9zcGFjZSc7XG5pbXBvcnQgeyB3cmFwRXJyb3IgfSBmcm9tICcuLi8uLi8uLi9saWIvZXJyb3JzJztcbmltcG9ydCB7IHNwYWNlU2NoZW1hIH0gZnJvbSAnLi4vLi4vLi4vbGliL3NwYWNlX3NjaGVtYSc7XG5pbXBvcnQgeyBTcGFjZXNDbGllbnQgfSBmcm9tICcuLi8uLi8uLi9saWIvc3BhY2VzX2NsaWVudCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0UHV0U3BhY2VzQXBpKHNlcnZlcjogYW55LCByb3V0ZVByZUNoZWNrTGljZW5zZUZuOiBhbnkpIHtcbiAgc2VydmVyLnJvdXRlKHtcbiAgICBtZXRob2Q6ICdQVVQnLFxuICAgIHBhdGg6ICcvYXBpL3NwYWNlcy9zcGFjZS97aWR9JyxcbiAgICBhc3luYyBoYW5kbGVyKHJlcXVlc3Q6IGFueSkge1xuICAgICAgY29uc3QgeyBTYXZlZE9iamVjdHNDbGllbnQgfSA9IHNlcnZlci5zYXZlZE9iamVjdHM7XG4gICAgICBjb25zdCBzcGFjZXNDbGllbnQ6IFNwYWNlc0NsaWVudCA9IHNlcnZlci5wbHVnaW5zLnNwYWNlcy5zcGFjZXNDbGllbnQuZ2V0U2NvcGVkQ2xpZW50KFxuICAgICAgICByZXF1ZXN0XG4gICAgICApO1xuXG4gICAgICBjb25zdCBzcGFjZTogU3BhY2UgPSByZXF1ZXN0LnBheWxvYWQ7XG4gICAgICBjb25zdCBpZCA9IHJlcXVlc3QucGFyYW1zLmlkO1xuXG4gICAgICBsZXQgcmVzdWx0OiBTcGFjZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGF3YWl0IHNwYWNlc0NsaWVudC51cGRhdGUoaWQsIHsgLi4uc3BhY2UgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoU2F2ZWRPYmplY3RzQ2xpZW50LmVycm9ycy5pc05vdEZvdW5kRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgcmV0dXJuIEJvb20ubm90Rm91bmQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd3JhcEVycm9yKGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIGNvbmZpZzoge1xuICAgICAgdmFsaWRhdGU6IHtcbiAgICAgICAgcGF5bG9hZDogc3BhY2VTY2hlbWEsXG4gICAgICB9LFxuICAgICAgcHJlOiBbcm91dGVQcmVDaGVja0xpY2Vuc2VGbl0sXG4gICAgfSxcbiAgfSk7XG59XG4iXX0=