"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_core_1 = require("apollo-server-core");
const graphql_1 = require("../../../graphql");
exports.uptimeGraphQLHapiPlugin = {
    name: 'uptimeGraphQL',
    register: (server, options) => {
        server.route({
            options: options.route,
            handler: async (request, h) => {
                try {
                    const { method } = request;
                    const query = method === 'post'
                        ? request.payload
                        : request.query;
                    const graphQLResponse = await apollo_server_core_1.runHttpQuery([request], {
                        method: method.toUpperCase(),
                        options: options.graphQLOptions,
                        query,
                    });
                    return h.response(graphQLResponse).type('application/json');
                }
                catch (error) {
                    if (error.isGraphQLError === true) {
                        return h
                            .response(error.message)
                            .code(error.statusCode)
                            .type('application/json');
                    }
                    return h.response(error).type('application/json');
                }
            },
            method: ['get', 'post'],
            path: options.path || graphql_1.DEFAULT_GRAPHQL_PATH,
            vhost: options.vhost || undefined,
        });
    },
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXB0aW1lL3NlcnZlci9saWIvYWRhcHRlcnMvZnJhbWV3b3JrL2Fwb2xsb19mcmFtZXdvcmtfYWRhcHRlci50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXB0aW1lL3NlcnZlci9saWIvYWRhcHRlcnMvZnJhbWV3b3JrL2Fwb2xsb19mcmFtZXdvcmtfYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCwyREFBa0Q7QUFHbEQsOENBQXdEO0FBRzNDLFFBQUEsdUJBQXVCLEdBQXVDO0lBQ3pFLElBQUksRUFBRSxlQUFlO0lBQ3JCLFFBQVEsRUFBRSxDQUFDLE1BQWMsRUFBRSxPQUFtQyxFQUFFLEVBQUU7UUFDaEUsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNYLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSztZQUN0QixPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQWdCLEVBQUUsQ0FBa0IsRUFBRSxFQUFFO2dCQUN0RCxJQUFJO29CQUNGLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUM7b0JBQzNCLE1BQU0sS0FBSyxHQUNULE1BQU0sS0FBSyxNQUFNO3dCQUNmLENBQUMsQ0FBRSxPQUFPLENBQUMsT0FBK0I7d0JBQzFDLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBNkIsQ0FBQztvQkFFN0MsTUFBTSxlQUFlLEdBQUcsTUFBTSxpQ0FBWSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ3BELE1BQU0sRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFO3dCQUM1QixPQUFPLEVBQUUsT0FBTyxDQUFDLGNBQWM7d0JBQy9CLEtBQUs7cUJBQ04sQ0FBQyxDQUFDO29CQUVILE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztpQkFDN0Q7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ2QsSUFBSSxLQUFLLENBQUMsY0FBYyxLQUFLLElBQUksRUFBRTt3QkFDakMsT0FBTyxDQUFDOzZCQUNMLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDOzZCQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQzs2QkFDdEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7cUJBQzdCO29CQUNELE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztpQkFDbkQ7WUFDSCxDQUFDO1lBQ0QsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztZQUN2QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksSUFBSSw4QkFBb0I7WUFDMUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLElBQUksU0FBUztTQUNsQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IHJ1bkh0dHBRdWVyeSB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItY29yZSc7XG5pbXBvcnQgeyBQbHVnaW4sIFJlc3BvbnNlVG9vbGtpdCB9IGZyb20gJ2hhcGknO1xuaW1wb3J0IHsgUmVxdWVzdCwgU2VydmVyIH0gZnJvbSAnaGFwaSc7XG5pbXBvcnQgeyBERUZBVUxUX0dSQVBIUUxfUEFUSCB9IGZyb20gJy4uLy4uLy4uL2dyYXBocWwnO1xuaW1wb3J0IHsgVU1IYXBpR3JhcGhRTFBsdWdpbk9wdGlvbnMgfSBmcm9tICcuL2FkYXB0ZXJfdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgdXB0aW1lR3JhcGhRTEhhcGlQbHVnaW46IFBsdWdpbjxVTUhhcGlHcmFwaFFMUGx1Z2luT3B0aW9ucz4gPSB7XG4gIG5hbWU6ICd1cHRpbWVHcmFwaFFMJyxcbiAgcmVnaXN0ZXI6IChzZXJ2ZXI6IFNlcnZlciwgb3B0aW9uczogVU1IYXBpR3JhcGhRTFBsdWdpbk9wdGlvbnMpID0+IHtcbiAgICBzZXJ2ZXIucm91dGUoe1xuICAgICAgb3B0aW9uczogb3B0aW9ucy5yb3V0ZSxcbiAgICAgIGhhbmRsZXI6IGFzeW5jIChyZXF1ZXN0OiBSZXF1ZXN0LCBoOiBSZXNwb25zZVRvb2xraXQpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCB7IG1ldGhvZCB9ID0gcmVxdWVzdDtcbiAgICAgICAgICBjb25zdCBxdWVyeSA9XG4gICAgICAgICAgICBtZXRob2QgPT09ICdwb3N0J1xuICAgICAgICAgICAgICA/IChyZXF1ZXN0LnBheWxvYWQgYXMgUmVjb3JkPHN0cmluZywgYW55PilcbiAgICAgICAgICAgICAgOiAocmVxdWVzdC5xdWVyeSBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KTtcblxuICAgICAgICAgIGNvbnN0IGdyYXBoUUxSZXNwb25zZSA9IGF3YWl0IHJ1bkh0dHBRdWVyeShbcmVxdWVzdF0sIHtcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zLmdyYXBoUUxPcHRpb25zLFxuICAgICAgICAgICAgcXVlcnksXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gaC5yZXNwb25zZShncmFwaFFMUmVzcG9uc2UpLnR5cGUoJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBpZiAoZXJyb3IuaXNHcmFwaFFMRXJyb3IgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBoXG4gICAgICAgICAgICAgIC5yZXNwb25zZShlcnJvci5tZXNzYWdlKVxuICAgICAgICAgICAgICAuY29kZShlcnJvci5zdGF0dXNDb2RlKVxuICAgICAgICAgICAgICAudHlwZSgnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gaC5yZXNwb25zZShlcnJvcikudHlwZSgnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbWV0aG9kOiBbJ2dldCcsICdwb3N0J10sXG4gICAgICBwYXRoOiBvcHRpb25zLnBhdGggfHwgREVGQVVMVF9HUkFQSFFMX1BBVEgsXG4gICAgICB2aG9zdDogb3B0aW9ucy52aG9zdCB8fCB1bmRlZmluZWQsXG4gICAgfSk7XG4gIH0sXG59O1xuIl19