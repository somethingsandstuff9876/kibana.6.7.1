"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const GraphiQL = tslib_1.__importStar(require("apollo-server-module-graphiql"));
const boom_1 = tslib_1.__importDefault(require("boom"));
const apollo_server_core_1 = require("apollo-server-core");
exports.graphqlHapi = {
    name: 'graphql',
    register: (server, options) => {
        if (!options || !options.graphqlOptions) {
            throw new Error('Apollo Server requires options.');
        }
        server.route({
            options: options.route || {},
            handler: async (request, h) => {
                try {
                    const query = request.method === 'post'
                        ? request.payload
                        : request.query;
                    const gqlResponse = await apollo_server_core_1.runHttpQuery([request], {
                        method: request.method.toUpperCase(),
                        options: options.graphqlOptions,
                        query,
                    });
                    return h.response(gqlResponse).type('application/json');
                }
                catch (error) {
                    if ('HttpQueryError' !== error.name) {
                        const queryError = boom_1.default.boomify(error);
                        queryError.output.payload.message = error.message;
                        return queryError;
                    }
                    if (error.isGraphQLError === true) {
                        return h
                            .response(error.message)
                            .code(error.statusCode)
                            .type('application/json');
                    }
                    const genericError = new boom_1.default(error.message, { statusCode: error.statusCode });
                    if (error.headers) {
                        Object.keys(error.headers).forEach(header => {
                            genericError.output.headers[header] = error.headers[header];
                        });
                    }
                    // Boom hides the error when status code is 500
                    genericError.output.payload.message = error.message;
                    throw genericError;
                }
            },
            method: ['GET', 'POST'],
            path: options.path || '/graphql',
            vhost: options.vhost || undefined,
        });
    },
};
exports.graphiqlHapi = {
    name: 'graphiql',
    register: (server, options) => {
        if (!options || !options.graphiqlOptions) {
            throw new Error('Apollo Server GraphiQL requires options.');
        }
        server.route({
            options: options.route || {},
            handler: async (request, h) => {
                const graphiqlString = await GraphiQL.resolveGraphiQLString(request.query, options.graphiqlOptions, request);
                return h.response(graphiqlString).type('text/html');
            },
            method: 'GET',
            path: options.path || '/graphiql',
        });
    },
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9mcmFtZXdvcmsvYXBvbGxvX3NlcnZlcl9oYXBpLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL2ZyYW1ld29yay9hcG9sbG9fc2VydmVyX2hhcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILGdGQUEwRDtBQUMxRCx3REFBd0I7QUFHeEIsMkRBQWtFO0FBV3JELFFBQUEsV0FBVyxHQUFxQztJQUMzRCxJQUFJLEVBQUUsU0FBUztJQUNmLFFBQVEsRUFBRSxDQUFDLE1BQWMsRUFBRSxPQUFpQyxFQUFFLEVBQUU7UUFDOUQsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUU7WUFDdkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNYLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDNUIsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFnQixFQUFFLENBQWtCLEVBQUUsRUFBRTtnQkFDdEQsSUFBSTtvQkFDRixNQUFNLEtBQUssR0FDVCxPQUFPLENBQUMsTUFBTSxLQUFLLE1BQU07d0JBQ3ZCLENBQUMsQ0FBRSxPQUFPLENBQUMsT0FBK0I7d0JBQzFDLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBNkIsQ0FBQztvQkFFN0MsTUFBTSxXQUFXLEdBQUcsTUFBTSxpQ0FBWSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ2hELE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRTt3QkFDcEMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxjQUFjO3dCQUMvQixLQUFLO3FCQUNOLENBQUMsQ0FBQztvQkFFSCxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7aUJBQ3pEO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNkLElBQUksZ0JBQWdCLEtBQUssS0FBSyxDQUFDLElBQUksRUFBRTt3QkFDbkMsTUFBTSxVQUFVLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFFdkMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7d0JBRWxELE9BQU8sVUFBVSxDQUFDO3FCQUNuQjtvQkFFRCxJQUFJLEtBQUssQ0FBQyxjQUFjLEtBQUssSUFBSSxFQUFFO3dCQUNqQyxPQUFPLENBQUM7NkJBQ0wsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7NkJBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDOzZCQUN0QixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztxQkFDN0I7b0JBRUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxjQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztvQkFFL0UsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO3dCQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7NEJBQzFDLFlBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQzlELENBQUMsQ0FBQyxDQUFDO3FCQUNKO29CQUVELCtDQUErQztvQkFFL0MsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7b0JBRXBELE1BQU0sWUFBWSxDQUFDO2lCQUNwQjtZQUNILENBQUM7WUFDRCxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDO1lBQ3ZCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxJQUFJLFVBQVU7WUFDaEMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLElBQUksU0FBUztTQUNsQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YsQ0FBQztBQWNXLFFBQUEsWUFBWSxHQUFzQztJQUM3RCxJQUFJLEVBQUUsVUFBVTtJQUNoQixRQUFRLEVBQUUsQ0FBQyxNQUFjLEVBQUUsT0FBa0MsRUFBRSxFQUFFO1FBQy9ELElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFO1lBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztTQUM3RDtRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDWCxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzVCLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBZ0IsRUFBRSxDQUFrQixFQUFFLEVBQUU7Z0JBQ3RELE1BQU0sY0FBYyxHQUFHLE1BQU0sUUFBUSxDQUFDLHFCQUFxQixDQUN6RCxPQUFPLENBQUMsS0FBSyxFQUNiLE9BQU8sQ0FBQyxlQUFlLEVBQ3ZCLE9BQU8sQ0FDUixDQUFDO2dCQUVGLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdEQsQ0FBQztZQUNELE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUksV0FBVztTQUNsQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAqIGFzIEdyYXBoaVFMIGZyb20gJ2Fwb2xsby1zZXJ2ZXItbW9kdWxlLWdyYXBoaXFsJztcbmltcG9ydCBCb29tIGZyb20gJ2Jvb20nO1xuaW1wb3J0IHsgUGx1Z2luLCBSZXF1ZXN0LCBSZXNwb25zZVRvb2xraXQsIFJvdXRlT3B0aW9ucywgU2VydmVyIH0gZnJvbSAnaGFwaSc7XG5cbmltcG9ydCB7IEdyYXBoUUxPcHRpb25zLCBydW5IdHRwUXVlcnkgfSBmcm9tICdhcG9sbG8tc2VydmVyLWNvcmUnO1xuXG5leHBvcnQgdHlwZSBIYXBpT3B0aW9uc0Z1bmN0aW9uID0gKHJlcTogUmVxdWVzdCkgPT4gR3JhcGhRTE9wdGlvbnMgfCBQcm9taXNlPEdyYXBoUUxPcHRpb25zPjtcblxuZXhwb3J0IGludGVyZmFjZSBIYXBpR3JhcGhRTFBsdWdpbk9wdGlvbnMge1xuICBwYXRoOiBzdHJpbmc7XG4gIHZob3N0Pzogc3RyaW5nO1xuICByb3V0ZT86IFJvdXRlT3B0aW9ucztcbiAgZ3JhcGhxbE9wdGlvbnM6IEdyYXBoUUxPcHRpb25zIHwgSGFwaU9wdGlvbnNGdW5jdGlvbjtcbn1cblxuZXhwb3J0IGNvbnN0IGdyYXBocWxIYXBpOiBQbHVnaW48SGFwaUdyYXBoUUxQbHVnaW5PcHRpb25zPiA9IHtcbiAgbmFtZTogJ2dyYXBocWwnLFxuICByZWdpc3RlcjogKHNlcnZlcjogU2VydmVyLCBvcHRpb25zOiBIYXBpR3JhcGhRTFBsdWdpbk9wdGlvbnMpID0+IHtcbiAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuZ3JhcGhxbE9wdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXBvbGxvIFNlcnZlciByZXF1aXJlcyBvcHRpb25zLicpO1xuICAgIH1cblxuICAgIHNlcnZlci5yb3V0ZSh7XG4gICAgICBvcHRpb25zOiBvcHRpb25zLnJvdXRlIHx8IHt9LFxuICAgICAgaGFuZGxlcjogYXN5bmMgKHJlcXVlc3Q6IFJlcXVlc3QsIGg6IFJlc3BvbnNlVG9vbGtpdCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHF1ZXJ5ID1cbiAgICAgICAgICAgIHJlcXVlc3QubWV0aG9kID09PSAncG9zdCdcbiAgICAgICAgICAgICAgPyAocmVxdWVzdC5wYXlsb2FkIGFzIFJlY29yZDxzdHJpbmcsIGFueT4pXG4gICAgICAgICAgICAgIDogKHJlcXVlc3QucXVlcnkgYXMgUmVjb3JkPHN0cmluZywgYW55Pik7XG5cbiAgICAgICAgICBjb25zdCBncWxSZXNwb25zZSA9IGF3YWl0IHJ1bkh0dHBRdWVyeShbcmVxdWVzdF0sIHtcbiAgICAgICAgICAgIG1ldGhvZDogcmVxdWVzdC5tZXRob2QudG9VcHBlckNhc2UoKSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnMuZ3JhcGhxbE9wdGlvbnMsXG4gICAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBoLnJlc3BvbnNlKGdxbFJlc3BvbnNlKS50eXBlKCdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgaWYgKCdIdHRwUXVlcnlFcnJvcicgIT09IGVycm9yLm5hbWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5RXJyb3IgPSBCb29tLmJvb21pZnkoZXJyb3IpO1xuXG4gICAgICAgICAgICBxdWVyeUVycm9yLm91dHB1dC5wYXlsb2FkLm1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuXG4gICAgICAgICAgICByZXR1cm4gcXVlcnlFcnJvcjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZXJyb3IuaXNHcmFwaFFMRXJyb3IgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBoXG4gICAgICAgICAgICAgIC5yZXNwb25zZShlcnJvci5tZXNzYWdlKVxuICAgICAgICAgICAgICAuY29kZShlcnJvci5zdGF0dXNDb2RlKVxuICAgICAgICAgICAgICAudHlwZSgnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGdlbmVyaWNFcnJvciA9IG5ldyBCb29tKGVycm9yLm1lc3NhZ2UsIHsgc3RhdHVzQ29kZTogZXJyb3Iuc3RhdHVzQ29kZSB9KTtcblxuICAgICAgICAgIGlmIChlcnJvci5oZWFkZXJzKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhlcnJvci5oZWFkZXJzKS5mb3JFYWNoKGhlYWRlciA9PiB7XG4gICAgICAgICAgICAgIGdlbmVyaWNFcnJvci5vdXRwdXQuaGVhZGVyc1toZWFkZXJdID0gZXJyb3IuaGVhZGVyc1toZWFkZXJdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQm9vbSBoaWRlcyB0aGUgZXJyb3Igd2hlbiBzdGF0dXMgY29kZSBpcyA1MDBcblxuICAgICAgICAgIGdlbmVyaWNFcnJvci5vdXRwdXQucGF5bG9hZC5tZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcblxuICAgICAgICAgIHRocm93IGdlbmVyaWNFcnJvcjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1ldGhvZDogWydHRVQnLCAnUE9TVCddLFxuICAgICAgcGF0aDogb3B0aW9ucy5wYXRoIHx8ICcvZ3JhcGhxbCcsXG4gICAgICB2aG9zdDogb3B0aW9ucy52aG9zdCB8fCB1bmRlZmluZWQsXG4gICAgfSk7XG4gIH0sXG59O1xuXG5leHBvcnQgdHlwZSBIYXBpR3JhcGhpUUxPcHRpb25zRnVuY3Rpb24gPSAoXG4gIHJlcT86IFJlcXVlc3RcbikgPT4gR3JhcGhpUUwuR3JhcGhpUUxEYXRhIHwgUHJvbWlzZTxHcmFwaGlRTC5HcmFwaGlRTERhdGE+O1xuXG5leHBvcnQgaW50ZXJmYWNlIEhhcGlHcmFwaGlRTFBsdWdpbk9wdGlvbnMge1xuICBwYXRoOiBzdHJpbmc7XG5cbiAgcm91dGU/OiBhbnk7XG5cbiAgZ3JhcGhpcWxPcHRpb25zOiBHcmFwaGlRTC5HcmFwaGlRTERhdGEgfCBIYXBpR3JhcGhpUUxPcHRpb25zRnVuY3Rpb247XG59XG5cbmV4cG9ydCBjb25zdCBncmFwaGlxbEhhcGk6IFBsdWdpbjxIYXBpR3JhcGhpUUxQbHVnaW5PcHRpb25zPiA9IHtcbiAgbmFtZTogJ2dyYXBoaXFsJyxcbiAgcmVnaXN0ZXI6IChzZXJ2ZXI6IFNlcnZlciwgb3B0aW9uczogSGFwaUdyYXBoaVFMUGx1Z2luT3B0aW9ucykgPT4ge1xuICAgIGlmICghb3B0aW9ucyB8fCAhb3B0aW9ucy5ncmFwaGlxbE9wdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXBvbGxvIFNlcnZlciBHcmFwaGlRTCByZXF1aXJlcyBvcHRpb25zLicpO1xuICAgIH1cblxuICAgIHNlcnZlci5yb3V0ZSh7XG4gICAgICBvcHRpb25zOiBvcHRpb25zLnJvdXRlIHx8IHt9LFxuICAgICAgaGFuZGxlcjogYXN5bmMgKHJlcXVlc3Q6IFJlcXVlc3QsIGg6IFJlc3BvbnNlVG9vbGtpdCkgPT4ge1xuICAgICAgICBjb25zdCBncmFwaGlxbFN0cmluZyA9IGF3YWl0IEdyYXBoaVFMLnJlc29sdmVHcmFwaGlRTFN0cmluZyhcbiAgICAgICAgICByZXF1ZXN0LnF1ZXJ5LFxuICAgICAgICAgIG9wdGlvbnMuZ3JhcGhpcWxPcHRpb25zLFxuICAgICAgICAgIHJlcXVlc3RcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gaC5yZXNwb25zZShncmFwaGlxbFN0cmluZykudHlwZSgndGV4dC9odG1sJyk7XG4gICAgICB9LFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHBhdGg6IG9wdGlvbnMucGF0aCB8fCAnL2dyYXBoaXFsJyxcbiAgICB9KTtcbiAgfSxcbn07XG4iXX0=