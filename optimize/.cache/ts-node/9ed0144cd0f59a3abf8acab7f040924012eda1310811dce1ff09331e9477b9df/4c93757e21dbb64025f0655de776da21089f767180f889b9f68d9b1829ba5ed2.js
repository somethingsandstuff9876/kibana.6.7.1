"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
function registerDeleteTasksRoutes(server) {
    const { callWithRequest } = server.plugins.elasticsearch.getCluster('admin');
    server.route({
        path: '/api/upgrade_assistant/delete_tasks_index',
        method: 'POST',
        async handler(request) {
            try {
                const { acknowledged } = await callWithRequest(request, 'indices.delete', {
                    index: '.tasks',
                });
                if (!acknowledged) {
                    throw new Error('Could not delete .tasks index');
                }
                return { success: true };
            }
            catch (e) {
                if (!e.isBoom) {
                    return boom_1.default.boomify(e, { statusCode: 500 });
                }
                return e;
            }
        },
    });
}
exports.registerDeleteTasksRoutes = registerDeleteTasksRoutes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXBncmFkZV9hc3Npc3RhbnQvc2VydmVyL3JvdXRlcy9kZWxldGVfdGFza3MudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3VwZ3JhZGVfYXNzaXN0YW50L3NlcnZlci9yb3V0ZXMvZGVsZXRlX3Rhc2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCx3REFBd0I7QUFHeEIsU0FBZ0IseUJBQXlCLENBQUMsTUFBYztJQUN0RCxNQUFNLEVBQUUsZUFBZSxFQUFFLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRTdFLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDWCxJQUFJLEVBQUUsMkNBQTJDO1FBQ2pELE1BQU0sRUFBRSxNQUFNO1FBQ2QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPO1lBQ25CLElBQUk7Z0JBQ0YsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLE1BQU0sZUFBZSxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRTtvQkFDeEUsS0FBSyxFQUFFLFFBQVE7aUJBQ2hCLENBQUMsQ0FBQztnQkFFSCxJQUFJLENBQUMsWUFBWSxFQUFFO29CQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7aUJBQ2xEO2dCQUVELE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7YUFDMUI7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtvQkFDYixPQUFPLGNBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7aUJBQzdDO2dCQUVELE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7UUFDSCxDQUFDO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTFCRCw4REEwQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgQm9vbSBmcm9tICdib29tJztcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJ2hhcGknO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJEZWxldGVUYXNrc1JvdXRlcyhzZXJ2ZXI6IFNlcnZlcikge1xuICBjb25zdCB7IGNhbGxXaXRoUmVxdWVzdCB9ID0gc2VydmVyLnBsdWdpbnMuZWxhc3RpY3NlYXJjaC5nZXRDbHVzdGVyKCdhZG1pbicpO1xuXG4gIHNlcnZlci5yb3V0ZSh7XG4gICAgcGF0aDogJy9hcGkvdXBncmFkZV9hc3Npc3RhbnQvZGVsZXRlX3Rhc2tzX2luZGV4JyxcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICBhc3luYyBoYW5kbGVyKHJlcXVlc3QpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgYWNrbm93bGVkZ2VkIH0gPSBhd2FpdCBjYWxsV2l0aFJlcXVlc3QocmVxdWVzdCwgJ2luZGljZXMuZGVsZXRlJywge1xuICAgICAgICAgIGluZGV4OiAnLnRhc2tzJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFhY2tub3dsZWRnZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBkZWxldGUgLnRhc2tzIGluZGV4Jyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmICghZS5pc0Jvb20pIHtcbiAgICAgICAgICByZXR1cm4gQm9vbS5ib29taWZ5KGUsIHsgc3RhdHVzQ29kZTogNTAwIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGU7XG4gICAgICB9XG4gICAgfSxcbiAgfSk7XG59XG4iXX0=