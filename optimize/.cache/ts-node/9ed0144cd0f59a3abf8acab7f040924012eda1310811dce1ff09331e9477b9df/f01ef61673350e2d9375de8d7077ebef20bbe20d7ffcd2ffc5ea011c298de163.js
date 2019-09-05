"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("./adapter_types");
const apollo_server_hapi_1 = require("./apollo_server_hapi");
class InfraKibanaBackendFrameworkAdapter {
    constructor(server) {
        this.server = server;
        this.version = server.plugins.kibana.status.plugin.version;
    }
    exposeStaticDir(urlPath, dir) {
        this.server.route({
            handler: {
                directory: {
                    path: dir,
                },
            },
            method: 'GET',
            path: urlPath,
        });
    }
    registerGraphQLEndpoint(routePath, schema) {
        this.server.register({
            options: {
                graphqlOptions: (req) => ({
                    context: { req: wrapRequest(req) },
                    schema,
                }),
                path: routePath,
            },
            plugin: apollo_server_hapi_1.graphqlHapi,
        });
        this.server.register({
            options: {
                graphiqlOptions: request => ({
                    endpointURL: request ? `${request.getBasePath()}${routePath}` : routePath,
                    passHeader: `'kbn-version': '${this.version}'`,
                }),
                path: `${routePath}/graphiql`,
            },
            plugin: apollo_server_hapi_1.graphiqlHapi,
        });
    }
    registerRoute(route) {
        const wrappedHandler = (request, h) => route.handler(wrapRequest(request), h);
        this.server.route({
            handler: wrappedHandler,
            method: route.method,
            path: route.path,
        });
    }
    async callWithRequest(req, endpoint, params, ...rest) {
        const internalRequest = req[adapter_types_1.internalInfraFrameworkRequest];
        const { elasticsearch } = internalRequest.server.plugins;
        const { callWithRequest } = elasticsearch.getCluster('data');
        const includeFrozen = await internalRequest.getUiSettingsService().get('search:includeFrozen');
        if (endpoint === 'msearch') {
            const maxConcurrentShardRequests = await internalRequest
                .getUiSettingsService()
                .get('courier:maxConcurrentShardRequests');
            if (maxConcurrentShardRequests > 0) {
                params = { ...params, max_concurrent_shard_requests: maxConcurrentShardRequests };
            }
        }
        const fields = await callWithRequest(internalRequest, endpoint, { ...params, ignore_throttled: !includeFrozen }, ...rest);
        return fields;
    }
    getIndexPatternsService(request) {
        return this.server.indexPatternsServiceFactory({
            callCluster: async (method, args, ...rest) => {
                const fieldCaps = await this.callWithRequest(request, method, { ...args, allowNoIndices: true }, ...rest);
                return fieldCaps;
            },
        });
    }
    getSavedObjectsService() {
        return this.server.savedObjects;
    }
    async makeTSVBRequest(req, model, timerange, filters) {
        const internalRequest = req[adapter_types_1.internalInfraFrameworkRequest];
        const server = internalRequest.server;
        const request = {
            url: '/api/metrics/vis/data',
            method: 'POST',
            headers: internalRequest.headers,
            payload: {
                timerange,
                panels: [model],
                filters,
            },
        };
        const res = await server.inject(request);
        if (res.statusCode !== 200) {
            throw res;
        }
        return res.result;
    }
}
exports.InfraKibanaBackendFrameworkAdapter = InfraKibanaBackendFrameworkAdapter;
function wrapRequest(req) {
    const { params, payload, query } = req;
    return {
        [adapter_types_1.internalInfraFrameworkRequest]: req,
        params,
        payload,
        query,
    };
}
exports.wrapRequest = wrapRequest;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9mcmFtZXdvcmsva2liYW5hX2ZyYW1ld29ya19hZGFwdGVyLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL2ZyYW1ld29yay9raWJhbmFfZnJhbWV3b3JrX2FkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBT0gsbURBUXlCO0FBQ3pCLDZEQUs4QjtBQU05QixNQUFhLGtDQUFrQztJQUc3QyxZQUFvQixNQUFxQjtRQUFyQixXQUFNLEdBQU4sTUFBTSxDQUFlO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDN0QsQ0FBQztJQUVNLGVBQWUsQ0FBQyxPQUFlLEVBQUUsR0FBVztRQUNqRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNoQixPQUFPLEVBQUU7Z0JBQ1AsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxHQUFHO2lCQUNWO2FBQ0Y7WUFDRCxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLHVCQUF1QixDQUFDLFNBQWlCLEVBQUUsTUFBcUI7UUFDckUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQTJCO1lBQzdDLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQUUsQ0FBQyxHQUFtQixFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUN4QyxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNsQyxNQUFNO2lCQUNQLENBQUM7Z0JB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QUMxQixHQUEwQyxFQUMxQyxLQUF1QixFQUN2QixTQUF1QyxFQUN2QyxPQUFjO1FBRWQsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLDZDQUE2QixDQUFDLENBQUM7UUFDM0QsTUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQztRQUN0QyxNQUFNLE9BQU8sR0FBRztZQUNkLEdBQUcsRUFBRSx1QkFBdUI7WUFDNUIsTUFBTSxFQUFFLE1BQU07WUFDZCxPQUFPLEVBQUUsZUFBZSxDQUFDLE9BQU87WUFDaEMsT0FBTyxFQUFFO2dCQUNQLFNBQVM7Z0JBQ1QsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO2dCQUNmLE9BQU87YUFDUjtTQUNGLENBQUM7UUFFRixNQUFNLEdBQUcsR0FBRyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekMsSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLEdBQUcsRUFBRTtZQUMxQixNQUFNLEdBQUcsQ0FBQztTQUNYO1FBRUQsT0FBTyxHQUFHLENBQUMsTUFBMkIsQ0FBQztJQUN6QyxDQUFDO0NBQ0Y7QUFuSUQsZ0ZBbUlDO0FBRUQsU0FBZ0IsV0FBVyxDQUN6QixHQUFvQjtJQUVwQixNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxHQUFHLENBQUM7SUFFdkMsT0FBTztRQUNMLENBQUMsNkNBQTZCLENBQUMsRUFBRSxHQUFHO1FBQ3BDLE1BQU07UUFDTixPQUFPO1FBQ1AsS0FBSztLQUNOLENBQUM7QUFDSixDQUFDO0FBWEQsa0NBV0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBHZW5lcmljUGFyYW1zIH0gZnJvbSAnZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQgeyBHcmFwaFFMU2NoZW1hIH0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgeyBMZWdhY3kgfSBmcm9tICdraWJhbmEnO1xuXG5pbXBvcnQgeyBJbmZyYU1ldHJpY01vZGVsIH0gZnJvbSAnLi4vbWV0cmljcy9hZGFwdGVyX3R5cGVzJztcbmltcG9ydCB7XG4gIEluZnJhQmFja2VuZEZyYW1ld29ya0FkYXB0ZXIsXG4gIEluZnJhRnJhbWV3b3JrUmVxdWVzdCxcbiAgSW5mcmFGcmFtZXdvcmtSb3V0ZU9wdGlvbnMsXG4gIEluZnJhUmVzcG9uc2UsXG4gIEluZnJhVFNWQlJlc3BvbnNlLFxuICBJbmZyYVdyYXBwYWJsZVJlcXVlc3QsXG4gIGludGVybmFsSW5mcmFGcmFtZXdvcmtSZXF1ZXN0LFxufSBmcm9tICcuL2FkYXB0ZXJfdHlwZXMnO1xuaW1wb3J0IHtcbiAgZ3JhcGhpcWxIYXBpLFxuICBncmFwaHFsSGFwaSxcbiAgSGFwaUdyYXBoaVFMUGx1Z2luT3B0aW9ucyxcbiAgSGFwaUdyYXBoUUxQbHVnaW5PcHRpb25zLFxufSBmcm9tICcuL2Fwb2xsb19zZXJ2ZXJfaGFwaSc7XG5cbmludGVyZmFjZSBDYWxsV2l0aFJlcXVlc3RQYXJhbXMgZXh0ZW5kcyBHZW5lcmljUGFyYW1zIHtcbiAgbWF4X2NvbmN1cnJlbnRfc2hhcmRfcmVxdWVzdHM/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBJbmZyYUtpYmFuYUJhY2tlbmRGcmFtZXdvcmtBZGFwdGVyIGltcGxlbWVudHMgSW5mcmFCYWNrZW5kRnJhbWV3b3JrQWRhcHRlciB7XG4gIHB1YmxpYyB2ZXJzaW9uOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2ZXI6IExlZ2FjeS5TZXJ2ZXIpIHtcbiAgICB0aGlzLnZlcnNpb24gPSBzZXJ2ZXIucGx1Z2lucy5raWJhbmEuc3RhdHVzLnBsdWdpbi52ZXJzaW9uO1xuICB9XG5cbiAgcHVibGljIGV4cG9zZVN0YXRpY0Rpcih1cmxQYXRoOiBzdHJpbmcsIGRpcjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zZXJ2ZXIucm91dGUoe1xuICAgICAgaGFuZGxlcjoge1xuICAgICAgICBkaXJlY3Rvcnk6IHtcbiAgICAgICAgICBwYXRoOiBkaXIsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHBhdGg6IHVybFBhdGgsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJHcmFwaFFMRW5kcG9pbnQocm91dGVQYXRoOiBzdHJpbmcsIHNjaGVtYTogR3JhcGhRTFNjaGVtYSk6IHZvaWQge1xuICAgIHRoaXMuc2VydmVyLnJlZ2lzdGVyPEhhcGlHcmFwaFFMUGx1Z2luT3B0aW9ucz4oe1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBncmFwaHFsT3B0aW9uczogKHJlcTogTGVnYWN5LlJlcXVlc3QpID0+ICh7XG4gICAgICAgICAgY29udGV4dDogeyByZXE6IHdyYXBSZXF1ZXN0KHJlcSkgfSxcbiAgICAgICAgICBzY2hlbWEsXG4gICAgICAgIH0pLFxuICAgICAgICBwYXRoOiByb3V0ZVBhdGgsXG4gICAgICB9LFxuICAgICAgcGx1Z2luOiBncmFwaHFsSGFwaSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2VydmVyLnJlZ2lzdGVyPEhhcGlHcmFwaGlRTFBsdWdpbk9wdGlvbnM+KHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgZ3JhcGhpcWxPcHRpb25zOiByZXF1ZXN0ID0+ICh7XG4gICAgICAgICAgZW5kcG9pbnRVUkw6IHJlcXVlc3QgPyBgJHtyZXF1ZXN0LmdldEJhc2VQYXRoKCl9JHtyb3V0ZVBhdGh9YCA6IHJvdXRlUGF0aCxcbiAgICAgICAgICBwYXNzSGVhZGVyOiBgJ2tibi12ZXJzaW9uJzogJyR7dGhpcy52ZXJzaW9ufSdgLFxuICAgICAgICB9KSxcbiAgICAgICAgcGF0aDogYCR7cm91dGVQYXRofS9ncmFwaGlxbGAsXG4gICAgICB9LFxuICAgICAgcGx1Z2luOiBncmFwaGlxbEhhcGksXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJSb3V0ZTxcbiAgICBSb3V0ZVJlcXVlc3QgZXh0ZW5kcyBJbmZyYVdyYXBwYWJsZVJlcXVlc3QsXG4gICAgUm91dGVSZXNwb25zZSBleHRlbmRzIEluZnJhUmVzcG9uc2VcbiAgPihyb3V0ZTogSW5mcmFGcmFtZXdvcmtSb3V0ZU9wdGlvbnM8Um91dGVSZXF1ZXN0LCBSb3V0ZVJlc3BvbnNlPikge1xuICAgIGNvbnN0IHdyYXBwZWRIYW5kbGVyID0gKHJlcXVlc3Q6IGFueSwgaDogTGVnYWN5LlJlc3BvbnNlVG9vbGtpdCkgPT5cbiAgICAgIHJvdXRlLmhhbmRsZXIod3JhcFJlcXVlc3QocmVxdWVzdCksIGgpO1xuXG4gICAgdGhpcy5zZXJ2ZXIucm91dGUoe1xuICAgICAgaGFuZGxlcjogd3JhcHBlZEhhbmRsZXIsXG4gICAgICBtZXRob2Q6IHJvdXRlLm1ldGhvZCxcbiAgICAgIHBhdGg6IHJvdXRlLnBhdGgsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgY2FsbFdpdGhSZXF1ZXN0KFxuICAgIHJlcTogSW5mcmFGcmFtZXdvcmtSZXF1ZXN0PExlZ2FjeS5SZXF1ZXN0PixcbiAgICBlbmRwb2ludDogc3RyaW5nLFxuICAgIHBhcmFtczogQ2FsbFdpdGhSZXF1ZXN0UGFyYW1zLFxuICAgIC4uLnJlc3Q6IGFueVtdXG4gICkge1xuICAgIGNvbnN0IGludGVybmFsUmVxdWVzdCA9IHJlcVtpbnRlcm5hbEluZnJhRnJhbWV3b3JrUmVxdWVzdF07XG4gICAgY29uc3QgeyBlbGFzdGljc2VhcmNoIH0gPSBpbnRlcm5hbFJlcXVlc3Quc2VydmVyLnBsdWdpbnM7XG4gICAgY29uc3QgeyBjYWxsV2l0aFJlcXVlc3QgfSA9IGVsYXN0aWNzZWFyY2guZ2V0Q2x1c3RlcignZGF0YScpO1xuICAgIGNvbnN0IGluY2x1ZGVGcm96ZW4gPSBhd2FpdCBpbnRlcm5hbFJlcXVlc3QuZ2V0VWlTZXR0aW5nc1NlcnZpY2UoKS5nZXQoJ3NlYXJjaDppbmNsdWRlRnJvemVuJyk7XG4gICAgaWYgKGVuZHBvaW50ID09PSAnbXNlYXJjaCcpIHtcbiAgICAgIGNvbnN0IG1heENvbmN1cnJlbnRTaGFyZFJlcXVlc3RzID0gYXdhaXQgaW50ZXJuYWxSZXF1ZXN0XG4gICAgICAgIC5nZXRVaVNldHRpbmdzU2VydmljZSgpXG4gICAgICAgIC5nZXQoJ2NvdXJpZXI6bWF4Q29uY3VycmVudFNoYXJkUmVxdWVzdHMnKTtcbiAgICAgIGlmIChtYXhDb25jdXJyZW50U2hhcmRSZXF1ZXN0cyA+IDApIHtcbiAgICAgICAgcGFyYW1zID0geyAuLi5wYXJhbXMsIG1heF9jb25jdXJyZW50X3NoYXJkX3JlcXVlc3RzOiBtYXhDb25jdXJyZW50U2hhcmRSZXF1ZXN0cyB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZpZWxkcyA9IGF3YWl0IGNhbGxXaXRoUmVxdWVzdChcbiAgICAgIGludGVybmFsUmVxdWVzdCxcbiAgICAgIGVuZHBvaW50LFxuICAgICAgeyAuLi5wYXJhbXMsIGlnbm9yZV90aHJvdHRsZWQ6ICFpbmNsdWRlRnJvemVuIH0sXG4gICAgICAuLi5yZXN0XG4gICAgKTtcbiAgICByZXR1cm4gZmllbGRzO1xuICB9XG5cbiAgcHVibGljIGdldEluZGV4UGF0dGVybnNTZXJ2aWNlKFxuICAgIHJlcXVlc3Q6IEluZnJhRnJhbWV3b3JrUmVxdWVzdDxMZWdhY3kuUmVxdWVzdD5cbiAgKTogTGVnYWN5LkluZGV4UGF0dGVybnNTZXJ2aWNlIHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2ZXIuaW5kZXhQYXR0ZXJuc1NlcnZpY2VGYWN0b3J5KHtcbiAgICAgIGNhbGxDbHVzdGVyOiBhc3luYyAobWV0aG9kOiBzdHJpbmcsIGFyZ3M6IFtHZW5lcmljUGFyYW1zXSwgLi4ucmVzdDogYW55W10pID0+IHtcbiAgICAgICAgY29uc3QgZmllbGRDYXBzID0gYXdhaXQgdGhpcy5jYWxsV2l0aFJlcXVlc3QoXG4gICAgICAgICAgcmVxdWVzdCxcbiAgICAgICAgICBtZXRob2QsXG4gICAgICAgICAgeyAuLi5hcmdzLCBhbGxvd05vSW5kaWNlczogdHJ1ZSB9IGFzIEdlbmVyaWNQYXJhbXMsXG4gICAgICAgICAgLi4ucmVzdFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZmllbGRDYXBzO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTYXZlZE9iamVjdHNTZXJ2aWNlKCkge1xuICAgIHJldHVybiB0aGlzLnNlcnZlci5zYXZlZE9iamVjdHM7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgbWFrZVRTVkJSZXF1ZXN0KFxuICAgIHJlcTogSW5mcmFGcmFtZXdvcmtSZXF1ZXN0PExlZ2FjeS5SZXF1ZXN0PixcbiAgICBtb2RlbDogSW5mcmFNZXRyaWNNb2RlbCxcbiAgICB0aW1lcmFuZ2U6IHsgbWluOiBudW1iZXI7IG1heDogbnVtYmVyIH0sXG4gICAgZmlsdGVyczogYW55W11cbiAgKSB7XG4gICAgY29uc3QgaW50ZXJuYWxSZXF1ZXN0ID0gcmVxW2ludGVybmFsSW5mcmFGcmFtZXdvcmtSZXF1ZXN0XTtcbiAgICBjb25zdCBzZXJ2ZXIgPSBpbnRlcm5hbFJlcXVlc3Quc2VydmVyO1xuICAgIGNvbnN0IHJlcXVlc3QgPSB7XG4gICAgICB1cmw6ICcvYXBpL21ldHJpY3MvdmlzL2RhdGEnLFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBoZWFkZXJzOiBpbnRlcm5hbFJlcXVlc3QuaGVhZGVycyxcbiAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgdGltZXJhbmdlLFxuICAgICAgICBwYW5lbHM6IFttb2RlbF0sXG4gICAgICAgIGZpbHRlcnMsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCBzZXJ2ZXIuaW5qZWN0KHJlcXVlc3QpO1xuICAgIGlmIChyZXMuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4gICAgICB0aHJvdyByZXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5yZXN1bHQgYXMgSW5mcmFUU1ZCUmVzcG9uc2U7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXBSZXF1ZXN0PEludGVybmFsUmVxdWVzdCBleHRlbmRzIEluZnJhV3JhcHBhYmxlUmVxdWVzdD4oXG4gIHJlcTogSW50ZXJuYWxSZXF1ZXN0XG4pOiBJbmZyYUZyYW1ld29ya1JlcXVlc3Q8SW50ZXJuYWxSZXF1ZXN0PiB7XG4gIGNvbnN0IHsgcGFyYW1zLCBwYXlsb2FkLCBxdWVyeSB9ID0gcmVxO1xuXG4gIHJldHVybiB7XG4gICAgW2ludGVybmFsSW5mcmFGcmFtZXdvcmtSZXF1ZXN0XTogcmVxLFxuICAgIHBhcmFtcyxcbiAgICBwYXlsb2FkLFxuICAgIHF1ZXJ5LFxuICB9O1xufVxuIl19