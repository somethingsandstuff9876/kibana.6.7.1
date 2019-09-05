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
const spaces_url_parser_1 = require("../../../lib/spaces_url_parser");
const lib_1 = require("../../lib");
function initPrivateSpacesApi(server, routePreCheckLicenseFn) {
    server.route({
        method: 'POST',
        path: '/api/spaces/v1/space/{id}/select',
        async handler(request) {
            const { SavedObjectsClient } = server.savedObjects;
            const spacesClient = server.plugins.spaces.spacesClient.getScopedClient(request);
            const id = request.params.id;
            try {
                const existingSpace = await lib_1.getSpaceById(spacesClient, id, SavedObjectsClient.errors);
                if (!existingSpace) {
                    return boom_1.default.notFound();
                }
                const config = server.config();
                return {
                    location: spaces_url_parser_1.addSpaceIdToPath(config.get('server.basePath'), existingSpace.id, config.get('server.defaultRoute')),
                };
            }
            catch (error) {
                return errors_1.wrapError(error);
            }
        },
        config: {
            pre: [routePreCheckLicenseFn],
        },
    });
}
exports.initPrivateSpacesApi = initPrivateSpacesApi;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9yb3V0ZXMvYXBpL3YxL3NwYWNlcy50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9yb3V0ZXMvYXBpL3YxL3NwYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7O0FBRUgsd0RBQXdCO0FBRXhCLGdEQUFnRDtBQUVoRCxzRUFBa0U7QUFDbEUsbUNBQXlDO0FBRXpDLFNBQWdCLG9CQUFvQixDQUFDLE1BQVcsRUFBRSxzQkFBMkI7SUFDM0UsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNYLE1BQU0sRUFBRSxNQUFNO1FBQ2QsSUFBSSxFQUFFLGtDQUFrQztRQUN4QyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQVk7WUFDeEIsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztZQUNuRCxNQUFNLFlBQVksR0FBaUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FDbkYsT0FBTyxDQUNSLENBQUM7WUFFRixNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUU3QixJQUFJO2dCQUNGLE1BQU0sYUFBYSxHQUFpQixNQUFNLGtCQUFZLENBQ3BELFlBQVksRUFDWixFQUFFLEVBQ0Ysa0JBQWtCLENBQUMsTUFBTSxDQUMxQixDQUFDO2dCQUNGLElBQUksQ0FBQyxhQUFhLEVBQUU7b0JBQ2xCLE9BQU8sY0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUN4QjtnQkFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBRS9CLE9BQU87b0JBQ0wsUUFBUSxFQUFFLG9DQUFnQixDQUN4QixNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEVBQzdCLGFBQWEsQ0FBQyxFQUFFLEVBQ2hCLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FDbEM7aUJBQ0YsQ0FBQzthQUNIO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsT0FBTyxrQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3pCO1FBQ0gsQ0FBQztRQUNELE1BQU0sRUFBRTtZQUNOLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixDQUFDO1NBQzlCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXZDRCxvREF1Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgQm9vbSBmcm9tICdib29tJztcbmltcG9ydCB7IFNwYWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29tbW9uL21vZGVsL3NwYWNlJztcbmltcG9ydCB7IHdyYXBFcnJvciB9IGZyb20gJy4uLy4uLy4uL2xpYi9lcnJvcnMnO1xuaW1wb3J0IHsgU3BhY2VzQ2xpZW50IH0gZnJvbSAnLi4vLi4vLi4vbGliL3NwYWNlc19jbGllbnQnO1xuaW1wb3J0IHsgYWRkU3BhY2VJZFRvUGF0aCB9IGZyb20gJy4uLy4uLy4uL2xpYi9zcGFjZXNfdXJsX3BhcnNlcic7XG5pbXBvcnQgeyBnZXRTcGFjZUJ5SWQgfSBmcm9tICcuLi8uLi9saWInO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFByaXZhdGVTcGFjZXNBcGkoc2VydmVyOiBhbnksIHJvdXRlUHJlQ2hlY2tMaWNlbnNlRm46IGFueSkge1xuICBzZXJ2ZXIucm91dGUoe1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHBhdGg6ICcvYXBpL3NwYWNlcy92MS9zcGFjZS97aWR9L3NlbGVjdCcsXG4gICAgYXN5bmMgaGFuZGxlcihyZXF1ZXN0OiBhbnkpIHtcbiAgICAgIGNvbnN0IHsgU2F2ZWRPYmplY3RzQ2xpZW50IH0gPSBzZXJ2ZXIuc2F2ZWRPYmplY3RzO1xuICAgICAgY29uc3Qgc3BhY2VzQ2xpZW50OiBTcGFjZXNDbGllbnQgPSBzZXJ2ZXIucGx1Z2lucy5zcGFjZXMuc3BhY2VzQ2xpZW50LmdldFNjb3BlZENsaWVudChcbiAgICAgICAgcmVxdWVzdFxuICAgICAgKTtcblxuICAgICAgY29uc3QgaWQgPSByZXF1ZXN0LnBhcmFtcy5pZDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdTcGFjZTogU3BhY2UgfCBudWxsID0gYXdhaXQgZ2V0U3BhY2VCeUlkKFxuICAgICAgICAgIHNwYWNlc0NsaWVudCxcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBTYXZlZE9iamVjdHNDbGllbnQuZXJyb3JzXG4gICAgICAgICk7XG4gICAgICAgIGlmICghZXhpc3RpbmdTcGFjZSkge1xuICAgICAgICAgIHJldHVybiBCb29tLm5vdEZvdW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb25maWcgPSBzZXJ2ZXIuY29uZmlnKCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsb2NhdGlvbjogYWRkU3BhY2VJZFRvUGF0aChcbiAgICAgICAgICAgIGNvbmZpZy5nZXQoJ3NlcnZlci5iYXNlUGF0aCcpLFxuICAgICAgICAgICAgZXhpc3RpbmdTcGFjZS5pZCxcbiAgICAgICAgICAgIGNvbmZpZy5nZXQoJ3NlcnZlci5kZWZhdWx0Um91dGUnKVxuICAgICAgICAgICksXG4gICAgICAgIH07XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gd3JhcEVycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbmZpZzoge1xuICAgICAgcHJlOiBbcm91dGVQcmVDaGVja0xpY2Vuc2VGbl0sXG4gICAgfSxcbiAgfSk7XG59XG4iXX0=