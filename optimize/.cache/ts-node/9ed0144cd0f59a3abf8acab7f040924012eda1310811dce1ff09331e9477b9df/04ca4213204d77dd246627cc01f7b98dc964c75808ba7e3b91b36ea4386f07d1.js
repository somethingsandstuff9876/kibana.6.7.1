"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const joi_1 = tslib_1.__importDefault(require("joi"));
const es_ui_open_apis_1 = require("../lib/telemetry/es_ui_open_apis");
const es_ui_reindex_apis_1 = require("../lib/telemetry/es_ui_reindex_apis");
function registerTelemetryRoutes(server) {
    server.route({
        path: '/api/upgrade_assistant/telemetry/ui_open',
        method: 'PUT',
        options: {
            validate: {
                payload: joi_1.default.object({
                    overview: joi_1.default.boolean().default(false),
                    cluster: joi_1.default.boolean().default(false),
                    indices: joi_1.default.boolean().default(false),
                }),
            },
        },
        async handler(request) {
            try {
                return await es_ui_open_apis_1.upsertUIOpenOption(server, request);
            }
            catch (e) {
                return boom_1.default.boomify(e, { statusCode: 500 });
            }
        },
    });
    server.route({
        path: '/api/upgrade_assistant/telemetry/ui_reindex',
        method: 'PUT',
        options: {
            validate: {
                payload: joi_1.default.object({
                    close: joi_1.default.boolean().default(false),
                    open: joi_1.default.boolean().default(false),
                    start: joi_1.default.boolean().default(false),
                    stop: joi_1.default.boolean().default(false),
                }),
            },
        },
        async handler(request) {
            try {
                return await es_ui_reindex_apis_1.upsertUIReindexOption(server, request);
            }
            catch (e) {
                return boom_1.default.boomify(e, { statusCode: 500 });
            }
        },
    });
}
exports.registerTelemetryRoutes = registerTelemetryRoutes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXBncmFkZV9hc3Npc3RhbnQvc2VydmVyL3JvdXRlcy90ZWxlbWV0cnkudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3VwZ3JhZGVfYXNzaXN0YW50L3NlcnZlci9yb3V0ZXMvdGVsZW1ldHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCx3REFBd0I7QUFDeEIsc0RBQXNCO0FBRXRCLHNFQUFzRTtBQUN0RSw0RUFBNEU7QUFFNUUsU0FBZ0IsdUJBQXVCLENBQUMsTUFBdUM7SUFDN0UsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNYLElBQUksRUFBRSwwQ0FBMEM7UUFDaEQsTUFBTSxFQUFFLEtBQUs7UUFDYixPQUFPLEVBQUU7WUFDUCxRQUFRLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLGFBQUcsQ0FBQyxNQUFNLENBQUM7b0JBQ2xCLFFBQVEsRUFBRSxhQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztvQkFDdEMsT0FBTyxFQUFFLGFBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO29CQUNyQyxPQUFPLEVBQUUsYUFBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7aUJBQ3RDLENBQUM7YUFDSDtTQUNGO1FBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPO1lBQ25CLElBQUk7Z0JBQ0YsT0FBTyxNQUFNLG9DQUFrQixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQzthQUNsRDtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLE9BQU8sY0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQzthQUM3QztRQUNILENBQUM7S0FDRixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ1gsSUFBSSxFQUFFLDZDQUE2QztRQUNuRCxNQUFNLEVBQUUsS0FBSztRQUNiLE9BQU8sRUFBRTtZQUNQLFFBQVEsRUFBRTtnQkFDUixPQUFPLEVBQUUsYUFBRyxDQUFDLE1BQU0sQ0FBQztvQkFDbEIsS0FBSyxFQUFFLGFBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO29CQUNuQyxJQUFJLEVBQUUsYUFBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7b0JBQ2xDLEtBQUssRUFBRSxhQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztvQkFDbkMsSUFBSSxFQUFFLGFBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO2lCQUNuQyxDQUFDO2FBQ0g7U0FDRjtRQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTztZQUNuQixJQUFJO2dCQUNGLE9BQU8sTUFBTSwwQ0FBcUIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDckQ7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixPQUFPLGNBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7YUFDN0M7UUFDSCxDQUFDO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTNDRCwwREEyQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgQm9vbSBmcm9tICdib29tJztcbmltcG9ydCBKb2kgZnJvbSAnam9pJztcbmltcG9ydCB7IFVwZ3JhZGVBc3Npc3RhbnRUZWxlbWV0cnlTZXJ2ZXIgfSBmcm9tICcuLi8uLi9jb21tb24vdHlwZXMnO1xuaW1wb3J0IHsgdXBzZXJ0VUlPcGVuT3B0aW9uIH0gZnJvbSAnLi4vbGliL3RlbGVtZXRyeS9lc191aV9vcGVuX2FwaXMnO1xuaW1wb3J0IHsgdXBzZXJ0VUlSZWluZGV4T3B0aW9uIH0gZnJvbSAnLi4vbGliL3RlbGVtZXRyeS9lc191aV9yZWluZGV4X2FwaXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJUZWxlbWV0cnlSb3V0ZXMoc2VydmVyOiBVcGdyYWRlQXNzaXN0YW50VGVsZW1ldHJ5U2VydmVyKSB7XG4gIHNlcnZlci5yb3V0ZSh7XG4gICAgcGF0aDogJy9hcGkvdXBncmFkZV9hc3Npc3RhbnQvdGVsZW1ldHJ5L3VpX29wZW4nLFxuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgb3B0aW9uczoge1xuICAgICAgdmFsaWRhdGU6IHtcbiAgICAgICAgcGF5bG9hZDogSm9pLm9iamVjdCh7XG4gICAgICAgICAgb3ZlcnZpZXc6IEpvaS5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG4gICAgICAgICAgY2x1c3RlcjogSm9pLmJvb2xlYW4oKS5kZWZhdWx0KGZhbHNlKSxcbiAgICAgICAgICBpbmRpY2VzOiBKb2kuYm9vbGVhbigpLmRlZmF1bHQoZmFsc2UpLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcXVlc3QpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB1cHNlcnRVSU9wZW5PcHRpb24oc2VydmVyLCByZXF1ZXN0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIEJvb20uYm9vbWlmeShlLCB7IHN0YXR1c0NvZGU6IDUwMCB9KTtcbiAgICAgIH1cbiAgICB9LFxuICB9KTtcblxuICBzZXJ2ZXIucm91dGUoe1xuICAgIHBhdGg6ICcvYXBpL3VwZ3JhZGVfYXNzaXN0YW50L3RlbGVtZXRyeS91aV9yZWluZGV4JyxcbiAgICBtZXRob2Q6ICdQVVQnLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHZhbGlkYXRlOiB7XG4gICAgICAgIHBheWxvYWQ6IEpvaS5vYmplY3Qoe1xuICAgICAgICAgIGNsb3NlOiBKb2kuYm9vbGVhbigpLmRlZmF1bHQoZmFsc2UpLFxuICAgICAgICAgIG9wZW46IEpvaS5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG4gICAgICAgICAgc3RhcnQ6IEpvaS5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG4gICAgICAgICAgc3RvcDogSm9pLmJvb2xlYW4oKS5kZWZhdWx0KGZhbHNlKSxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgIH0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXF1ZXN0KSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgdXBzZXJ0VUlSZWluZGV4T3B0aW9uKHNlcnZlciwgcmVxdWVzdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBCb29tLmJvb21pZnkoZSwgeyBzdGF0dXNDb2RlOiA1MDAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgfSk7XG59XG4iXX0=