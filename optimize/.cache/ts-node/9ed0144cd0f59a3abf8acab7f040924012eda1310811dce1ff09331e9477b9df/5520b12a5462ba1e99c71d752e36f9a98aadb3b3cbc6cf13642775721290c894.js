"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const es_migration_apis_1 = require("../lib/es_migration_apis");
const es_version_precheck_1 = require("../lib/es_version_precheck");
function registerClusterCheckupRoutes(server) {
    const { callWithRequest } = server.plugins.elasticsearch.getCluster('admin');
    const isCloudEnabled = lodash_1.default.get(server.plugins, 'cloud.config.isCloudEnabled', false);
    server.route({
        path: '/api/upgrade_assistant/status',
        method: 'GET',
        options: {
            pre: [es_version_precheck_1.EsVersionPrecheck],
        },
        async handler(request) {
            try {
                return await es_migration_apis_1.getUpgradeAssistantStatus(callWithRequest, request, isCloudEnabled);
            }
            catch (e) {
                if (e.status === 403) {
                    return boom_1.default.forbidden(e.message);
                }
                return boom_1.default.boomify(e, {
                    statusCode: 500,
                });
            }
        },
    });
}
exports.registerClusterCheckupRoutes = registerClusterCheckupRoutes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXBncmFkZV9hc3Npc3RhbnQvc2VydmVyL3JvdXRlcy9jbHVzdGVyX2NoZWNrdXAudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3VwZ3JhZGVfYXNzaXN0YW50L3NlcnZlci9yb3V0ZXMvY2x1c3Rlcl9jaGVja3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCx3REFBd0I7QUFFeEIsNERBQXVCO0FBRXZCLGdFQUFxRTtBQUNyRSxvRUFBK0Q7QUFFL0QsU0FBZ0IsNEJBQTRCLENBQUMsTUFBcUI7SUFDaEUsTUFBTSxFQUFFLGVBQWUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3RSxNQUFNLGNBQWMsR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLDZCQUE2QixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRW5GLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDWCxJQUFJLEVBQUUsK0JBQStCO1FBQ3JDLE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFO1lBQ1AsR0FBRyxFQUFFLENBQUMsdUNBQWlCLENBQUM7U0FDekI7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU87WUFDbkIsSUFBSTtnQkFDRixPQUFPLE1BQU0sNkNBQXlCLENBQUMsZUFBZSxFQUFFLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQzthQUNsRjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7b0JBQ3BCLE9BQU8sY0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ2xDO2dCQUVELE9BQU8sY0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUU7b0JBQ3JCLFVBQVUsRUFBRSxHQUFHO2lCQUNoQixDQUFDLENBQUM7YUFDSjtRQUNILENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBeEJELG9FQXdCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBCb29tIGZyb20gJ2Jvb20nO1xuaW1wb3J0IHsgTGVnYWN5IH0gZnJvbSAna2liYW5hJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7IGdldFVwZ3JhZGVBc3Npc3RhbnRTdGF0dXMgfSBmcm9tICcuLi9saWIvZXNfbWlncmF0aW9uX2FwaXMnO1xuaW1wb3J0IHsgRXNWZXJzaW9uUHJlY2hlY2sgfSBmcm9tICcuLi9saWIvZXNfdmVyc2lvbl9wcmVjaGVjayc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckNsdXN0ZXJDaGVja3VwUm91dGVzKHNlcnZlcjogTGVnYWN5LlNlcnZlcikge1xuICBjb25zdCB7IGNhbGxXaXRoUmVxdWVzdCB9ID0gc2VydmVyLnBsdWdpbnMuZWxhc3RpY3NlYXJjaC5nZXRDbHVzdGVyKCdhZG1pbicpO1xuICBjb25zdCBpc0Nsb3VkRW5hYmxlZCA9IF8uZ2V0KHNlcnZlci5wbHVnaW5zLCAnY2xvdWQuY29uZmlnLmlzQ2xvdWRFbmFibGVkJywgZmFsc2UpO1xuXG4gIHNlcnZlci5yb3V0ZSh7XG4gICAgcGF0aDogJy9hcGkvdXBncmFkZV9hc3Npc3RhbnQvc3RhdHVzJyxcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHByZTogW0VzVmVyc2lvblByZWNoZWNrXSxcbiAgICB9LFxuICAgIGFzeW5jIGhhbmRsZXIocmVxdWVzdCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGdldFVwZ3JhZGVBc3Npc3RhbnRTdGF0dXMoY2FsbFdpdGhSZXF1ZXN0LCByZXF1ZXN0LCBpc0Nsb3VkRW5hYmxlZCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlLnN0YXR1cyA9PT0gNDAzKSB7XG4gICAgICAgICAgcmV0dXJuIEJvb20uZm9yYmlkZGVuKGUubWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQm9vbS5ib29taWZ5KGUsIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiA1MDAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gIH0pO1xufVxuIl19