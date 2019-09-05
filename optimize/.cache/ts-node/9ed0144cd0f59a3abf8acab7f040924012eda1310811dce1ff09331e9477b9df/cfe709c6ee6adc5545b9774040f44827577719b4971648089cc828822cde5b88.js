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
const es_deprecation_logging_apis_1 = require("../lib/es_deprecation_logging_apis");
const es_version_precheck_1 = require("../lib/es_version_precheck");
function registerDeprecationLoggingRoutes(server) {
    const { callWithRequest } = server.plugins.elasticsearch.getCluster('admin');
    server.route({
        path: '/api/upgrade_assistant/deprecation_logging',
        method: 'GET',
        options: {
            pre: [es_version_precheck_1.EsVersionPrecheck],
        },
        async handler(request) {
            try {
                return await es_deprecation_logging_apis_1.getDeprecationLoggingStatus(callWithRequest, request);
            }
            catch (e) {
                return boom_1.default.boomify(e, { statusCode: 500 });
            }
        },
    });
    server.route({
        path: '/api/upgrade_assistant/deprecation_logging',
        method: 'PUT',
        options: {
            pre: [es_version_precheck_1.EsVersionPrecheck],
            validate: {
                payload: joi_1.default.object({
                    isEnabled: joi_1.default.boolean(),
                }),
            },
        },
        async handler(request) {
            try {
                const { isEnabled } = request.payload;
                return await es_deprecation_logging_apis_1.setDeprecationLogging(callWithRequest, request, isEnabled);
            }
            catch (e) {
                return boom_1.default.boomify(e, { statusCode: 500 });
            }
        },
    });
}
exports.registerDeprecationLoggingRoutes = registerDeprecationLoggingRoutes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXBncmFkZV9hc3Npc3RhbnQvc2VydmVyL3JvdXRlcy9kZXByZWNhdGlvbl9sb2dnaW5nLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy91cGdyYWRlX2Fzc2lzdGFudC9zZXJ2ZXIvcm91dGVzL2RlcHJlY2F0aW9uX2xvZ2dpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILHdEQUF3QjtBQUN4QixzREFBc0I7QUFHdEIsb0ZBRzRDO0FBQzVDLG9FQUErRDtBQUUvRCxTQUFnQixnQ0FBZ0MsQ0FBQyxNQUFxQjtJQUNwRSxNQUFNLEVBQUUsZUFBZSxFQUFFLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRTdFLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDWCxJQUFJLEVBQUUsNENBQTRDO1FBQ2xELE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFO1lBQ1AsR0FBRyxFQUFFLENBQUMsdUNBQWlCLENBQUM7U0FDekI7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU87WUFDbkIsSUFBSTtnQkFDRixPQUFPLE1BQU0seURBQTJCLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ3BFO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsT0FBTyxjQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2FBQzdDO1FBQ0gsQ0FBQztLQUNGLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDWCxJQUFJLEVBQUUsNENBQTRDO1FBQ2xELE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFO1lBQ1AsR0FBRyxFQUFFLENBQUMsdUNBQWlCLENBQUM7WUFDeEIsUUFBUSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxhQUFHLENBQUMsTUFBTSxDQUFDO29CQUNsQixTQUFTLEVBQUUsYUFBRyxDQUFDLE9BQU8sRUFBRTtpQkFDekIsQ0FBQzthQUNIO1NBQ0Y7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU87WUFDbkIsSUFBSTtnQkFDRixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsT0FBTyxDQUFDLE9BQWlDLENBQUM7Z0JBQ2hFLE9BQU8sTUFBTSxtREFBcUIsQ0FBQyxlQUFlLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ3pFO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsT0FBTyxjQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2FBQzdDO1FBQ0gsQ0FBQztLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUF0Q0QsNEVBc0NDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IEJvb20gZnJvbSAnYm9vbSc7XG5pbXBvcnQgSm9pIGZyb20gJ2pvaSc7XG5pbXBvcnQgeyBMZWdhY3kgfSBmcm9tICdraWJhbmEnO1xuXG5pbXBvcnQge1xuICBnZXREZXByZWNhdGlvbkxvZ2dpbmdTdGF0dXMsXG4gIHNldERlcHJlY2F0aW9uTG9nZ2luZyxcbn0gZnJvbSAnLi4vbGliL2VzX2RlcHJlY2F0aW9uX2xvZ2dpbmdfYXBpcyc7XG5pbXBvcnQgeyBFc1ZlcnNpb25QcmVjaGVjayB9IGZyb20gJy4uL2xpYi9lc192ZXJzaW9uX3ByZWNoZWNrJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRGVwcmVjYXRpb25Mb2dnaW5nUm91dGVzKHNlcnZlcjogTGVnYWN5LlNlcnZlcikge1xuICBjb25zdCB7IGNhbGxXaXRoUmVxdWVzdCB9ID0gc2VydmVyLnBsdWdpbnMuZWxhc3RpY3NlYXJjaC5nZXRDbHVzdGVyKCdhZG1pbicpO1xuXG4gIHNlcnZlci5yb3V0ZSh7XG4gICAgcGF0aDogJy9hcGkvdXBncmFkZV9hc3Npc3RhbnQvZGVwcmVjYXRpb25fbG9nZ2luZycsXG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICBvcHRpb25zOiB7XG4gICAgICBwcmU6IFtFc1ZlcnNpb25QcmVjaGVja10sXG4gICAgfSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcXVlc3QpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBnZXREZXByZWNhdGlvbkxvZ2dpbmdTdGF0dXMoY2FsbFdpdGhSZXF1ZXN0LCByZXF1ZXN0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIEJvb20uYm9vbWlmeShlLCB7IHN0YXR1c0NvZGU6IDUwMCB9KTtcbiAgICAgIH1cbiAgICB9LFxuICB9KTtcblxuICBzZXJ2ZXIucm91dGUoe1xuICAgIHBhdGg6ICcvYXBpL3VwZ3JhZGVfYXNzaXN0YW50L2RlcHJlY2F0aW9uX2xvZ2dpbmcnLFxuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgb3B0aW9uczoge1xuICAgICAgcHJlOiBbRXNWZXJzaW9uUHJlY2hlY2tdLFxuICAgICAgdmFsaWRhdGU6IHtcbiAgICAgICAgcGF5bG9hZDogSm9pLm9iamVjdCh7XG4gICAgICAgICAgaXNFbmFibGVkOiBKb2kuYm9vbGVhbigpLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcXVlc3QpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgaXNFbmFibGVkIH0gPSByZXF1ZXN0LnBheWxvYWQgYXMgeyBpc0VuYWJsZWQ6IGJvb2xlYW4gfTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHNldERlcHJlY2F0aW9uTG9nZ2luZyhjYWxsV2l0aFJlcXVlc3QsIHJlcXVlc3QsIGlzRW5hYmxlZCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBCb29tLmJvb21pZnkoZSwgeyBzdGF0dXNDb2RlOiA1MDAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgfSk7XG59XG4iXX0=