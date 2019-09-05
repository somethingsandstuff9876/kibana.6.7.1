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
const es_version_precheck_1 = require("../lib/es_version_precheck");
const query_default_field_1 = require("../lib/query_default_field");
/**
 * Adds routes for detecting and fixing 6.x Metricbeat indices that need the
 * `index.query.default_field` index setting added.
 *
 * @param server
 */
function registerQueryDefaultFieldRoutes(server) {
    const { callWithRequest } = server.plugins.elasticsearch.getCluster('admin');
    server.route({
        path: '/api/upgrade_assistant/add_query_default_field/{indexName}',
        method: 'POST',
        options: {
            pre: [es_version_precheck_1.EsVersionPrecheck],
            validate: {
                params: joi_1.default.object({
                    indexName: joi_1.default.string().required(),
                }),
                payload: joi_1.default.object({
                    fieldTypes: joi_1.default.array()
                        .items(joi_1.default.string())
                        .required(),
                    otherFields: joi_1.default.array().items(joi_1.default.string()),
                }),
            },
        },
        async handler(request) {
            try {
                const { indexName } = request.params;
                const { fieldTypes, otherFields } = request.payload;
                return await query_default_field_1.addDefaultField(callWithRequest, request, indexName, new Set(fieldTypes), otherFields ? new Set(otherFields) : undefined);
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
exports.registerQueryDefaultFieldRoutes = registerQueryDefaultFieldRoutes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXBncmFkZV9hc3Npc3RhbnQvc2VydmVyL3JvdXRlcy9xdWVyeV9kZWZhdWx0X2ZpZWxkLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy91cGdyYWRlX2Fzc2lzdGFudC9zZXJ2ZXIvcm91dGVzL3F1ZXJ5X2RlZmF1bHRfZmllbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILHdEQUF3QjtBQUN4QixzREFBc0I7QUFJdEIsb0VBQStEO0FBQy9ELG9FQUE2RDtBQUU3RDs7Ozs7R0FLRztBQUNILFNBQWdCLCtCQUErQixDQUFDLE1BQXFCO0lBQ25FLE1BQU0sRUFBRSxlQUFlLEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFN0UsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNYLElBQUksRUFBRSw0REFBNEQ7UUFDbEUsTUFBTSxFQUFFLE1BQU07UUFDZCxPQUFPLEVBQUU7WUFDUCxHQUFHLEVBQUUsQ0FBQyx1Q0FBaUIsQ0FBQztZQUN4QixRQUFRLEVBQUU7Z0JBQ1IsTUFBTSxFQUFFLGFBQUcsQ0FBQyxNQUFNLENBQUM7b0JBQ2pCLFNBQVMsRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO2lCQUNuQyxDQUFDO2dCQUNGLE9BQU8sRUFBRSxhQUFHLENBQUMsTUFBTSxDQUFDO29CQUNsQixVQUFVLEVBQUUsYUFBRyxDQUFDLEtBQUssRUFBRTt5QkFDcEIsS0FBSyxDQUFDLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQzt5QkFDbkIsUUFBUSxFQUFFO29CQUNiLFdBQVcsRUFBRSxhQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDN0MsQ0FBQzthQUNIO1NBQ0Y7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU87WUFDbkIsSUFBSTtnQkFDRixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztnQkFDckMsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsR0FBRyxPQUFPLENBQUMsT0FHM0MsQ0FBQztnQkFFRixPQUFPLE1BQU0scUNBQWUsQ0FDMUIsZUFBZSxFQUNmLE9BQU8sRUFDUCxTQUFTLEVBQ1QsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQ25CLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FDL0MsQ0FBQzthQUNIO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtvQkFDcEIsT0FBTyxjQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDbEM7Z0JBRUQsT0FBTyxjQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRTtvQkFDckIsVUFBVSxFQUFFLEdBQUc7aUJBQ2hCLENBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQztLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUE5Q0QsMEVBOENDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IEJvb20gZnJvbSAnYm9vbSc7XG5pbXBvcnQgSm9pIGZyb20gJ2pvaSc7XG5pbXBvcnQgeyBMZWdhY3kgfSBmcm9tICdraWJhbmEnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgRXNWZXJzaW9uUHJlY2hlY2sgfSBmcm9tICcuLi9saWIvZXNfdmVyc2lvbl9wcmVjaGVjayc7XG5pbXBvcnQgeyBhZGREZWZhdWx0RmllbGQgfSBmcm9tICcuLi9saWIvcXVlcnlfZGVmYXVsdF9maWVsZCc7XG5cbi8qKlxuICogQWRkcyByb3V0ZXMgZm9yIGRldGVjdGluZyBhbmQgZml4aW5nIDYueCBNZXRyaWNiZWF0IGluZGljZXMgdGhhdCBuZWVkIHRoZVxuICogYGluZGV4LnF1ZXJ5LmRlZmF1bHRfZmllbGRgIGluZGV4IHNldHRpbmcgYWRkZWQuXG4gKlxuICogQHBhcmFtIHNlcnZlclxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJRdWVyeURlZmF1bHRGaWVsZFJvdXRlcyhzZXJ2ZXI6IExlZ2FjeS5TZXJ2ZXIpIHtcbiAgY29uc3QgeyBjYWxsV2l0aFJlcXVlc3QgfSA9IHNlcnZlci5wbHVnaW5zLmVsYXN0aWNzZWFyY2guZ2V0Q2x1c3RlcignYWRtaW4nKTtcblxuICBzZXJ2ZXIucm91dGUoe1xuICAgIHBhdGg6ICcvYXBpL3VwZ3JhZGVfYXNzaXN0YW50L2FkZF9xdWVyeV9kZWZhdWx0X2ZpZWxkL3tpbmRleE5hbWV9JyxcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICBvcHRpb25zOiB7XG4gICAgICBwcmU6IFtFc1ZlcnNpb25QcmVjaGVja10sXG4gICAgICB2YWxpZGF0ZToge1xuICAgICAgICBwYXJhbXM6IEpvaS5vYmplY3Qoe1xuICAgICAgICAgIGluZGV4TmFtZTogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gICAgICAgIH0pLFxuICAgICAgICBwYXlsb2FkOiBKb2kub2JqZWN0KHtcbiAgICAgICAgICBmaWVsZFR5cGVzOiBKb2kuYXJyYXkoKVxuICAgICAgICAgICAgLml0ZW1zKEpvaS5zdHJpbmcoKSlcbiAgICAgICAgICAgIC5yZXF1aXJlZCgpLFxuICAgICAgICAgIG90aGVyRmllbGRzOiBKb2kuYXJyYXkoKS5pdGVtcyhKb2kuc3RyaW5nKCkpLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcXVlc3QpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgaW5kZXhOYW1lIH0gPSByZXF1ZXN0LnBhcmFtcztcbiAgICAgICAgY29uc3QgeyBmaWVsZFR5cGVzLCBvdGhlckZpZWxkcyB9ID0gcmVxdWVzdC5wYXlsb2FkIGFzIHtcbiAgICAgICAgICBmaWVsZFR5cGVzOiBzdHJpbmdbXTtcbiAgICAgICAgICBvdGhlckZpZWxkcz86IHN0cmluZ1tdO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBhd2FpdCBhZGREZWZhdWx0RmllbGQoXG4gICAgICAgICAgY2FsbFdpdGhSZXF1ZXN0LFxuICAgICAgICAgIHJlcXVlc3QsXG4gICAgICAgICAgaW5kZXhOYW1lLFxuICAgICAgICAgIG5ldyBTZXQoZmllbGRUeXBlcyksXG4gICAgICAgICAgb3RoZXJGaWVsZHMgPyBuZXcgU2V0KG90aGVyRmllbGRzKSA6IHVuZGVmaW5lZFxuICAgICAgICApO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZS5zdGF0dXMgPT09IDQwMykge1xuICAgICAgICAgIHJldHVybiBCb29tLmZvcmJpZGRlbihlLm1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEJvb20uYm9vbWlmeShlLCB7XG4gICAgICAgICAgc3RhdHVzQ29kZTogNTAwLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICB9KTtcbn1cbiJdfQ==