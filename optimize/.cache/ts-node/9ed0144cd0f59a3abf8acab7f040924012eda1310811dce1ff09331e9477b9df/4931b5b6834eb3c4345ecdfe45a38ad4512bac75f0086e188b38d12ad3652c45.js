"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const commonPrefixFields = [
    { constant: '[' },
    { field: 'event.module' },
    { constant: '][access] ' },
];
exports.genericWebserverRules = [
    {
        // ECS with parsed url
        when: {
            exists: ['ecs.version', 'http.response.status_code', 'url.path'],
        },
        format: [
            ...commonPrefixFields,
            {
                field: 'source.ip',
            },
            {
                constant: ' ',
            },
            {
                field: 'user.name',
            },
            {
                constant: ' "',
            },
            {
                field: 'http.request.method',
            },
            {
                constant: ' ',
            },
            {
                field: 'url.path',
            },
            {
                constant: '?',
            },
            {
                field: 'url.query',
            },
            {
                constant: ' HTTP/',
            },
            {
                field: 'http.version',
            },
            {
                constant: '" ',
            },
            {
                field: 'http.response.status_code',
            },
            {
                constant: ' ',
            },
            {
                field: 'http.response.body.bytes',
            },
        ],
    },
    {
        // ECS with original url
        when: {
            exists: ['ecs.version', 'http.response.status_code'],
        },
        format: [
            ...commonPrefixFields,
            {
                field: 'source.ip',
            },
            {
                constant: ' ',
            },
            {
                field: 'user.name',
            },
            {
                constant: ' "',
            },
            {
                field: 'http.request.method',
            },
            {
                constant: ' ',
            },
            {
                field: 'url.original',
            },
            {
                constant: ' HTTP/',
            },
            {
                field: 'http.version',
            },
            {
                constant: '" ',
            },
            {
                field: 'http.response.status_code',
            },
            {
                constant: ' ',
            },
            {
                field: 'http.response.body.bytes',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2dlbmVyaWNfd2Vic2VydmVyLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2RvbWFpbnMvbG9nX2VudHJpZXNfZG9tYWluL2J1aWx0aW5fcnVsZXMvZ2VuZXJpY193ZWJzZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsTUFBTSxrQkFBa0IsR0FBRztJQUN6QixFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDakIsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFO0lBQ3pCLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRTtDQUMzQixDQUFDO0FBRVcsUUFBQSxxQkFBcUIsR0FBRztJQUNuQztRQUNFLHNCQUFzQjtRQUN0QixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsQ0FBQyxhQUFhLEVBQUUsMkJBQTJCLEVBQUUsVUFBVSxDQUFDO1NBQ2pFO1FBQ0QsTUFBTSxFQUFFO1lBQ04sR0FBRyxrQkFBa0I7WUFDckI7Z0JBQ0UsS0FBSyxFQUFFLFdBQVc7YUFDbkI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsR0FBRzthQUNkO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLFdBQVc7YUFDbkI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHFCQUFxQjthQUM3QjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxHQUFHO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsVUFBVTthQUNsQjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxHQUFHO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsV0FBVzthQUNuQjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxRQUFRO2FBQ25CO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLGNBQWM7YUFDdEI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLDJCQUEyQjthQUNuQztZQUNEO2dCQUNFLFFBQVEsRUFBRSxHQUFHO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsMEJBQTBCO2FBQ2xDO1NBQ0Y7S0FDRjtJQUNEO1FBQ0Usd0JBQXdCO1FBQ3hCLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxDQUFDLGFBQWEsRUFBRSwyQkFBMkIsQ0FBQztTQUNyRDtRQUNELE1BQU0sRUFBRTtZQUNOLEdBQUcsa0JBQWtCO1lBQ3JCO2dCQUNFLEtBQUssRUFBRSxXQUFXO2FBQ25CO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLEdBQUc7YUFDZDtZQUNEO2dCQUNFLEtBQUssRUFBRSxXQUFXO2FBQ25CO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLEtBQUssRUFBRSxxQkFBcUI7YUFDN0I7WUFDRDtnQkFDRSxRQUFRLEVBQUUsR0FBRzthQUNkO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLGNBQWM7YUFDdEI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsUUFBUTthQUNuQjtZQUNEO2dCQUNFLEtBQUssRUFBRSxjQUFjO2FBQ3RCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLEtBQUssRUFBRSwyQkFBMkI7YUFDbkM7WUFDRDtnQkFDRSxRQUFRLEVBQUUsR0FBRzthQUNkO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLDBCQUEwQjthQUNsQztTQUNGO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuY29uc3QgY29tbW9uUHJlZml4RmllbGRzID0gW1xuICB7IGNvbnN0YW50OiAnWycgfSxcbiAgeyBmaWVsZDogJ2V2ZW50Lm1vZHVsZScgfSxcbiAgeyBjb25zdGFudDogJ11bYWNjZXNzXSAnIH0sXG5dO1xuXG5leHBvcnQgY29uc3QgZ2VuZXJpY1dlYnNlcnZlclJ1bGVzID0gW1xuICB7XG4gICAgLy8gRUNTIHdpdGggcGFyc2VkIHVybFxuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydlY3MudmVyc2lvbicsICdodHRwLnJlc3BvbnNlLnN0YXR1c19jb2RlJywgJ3VybC5wYXRoJ10sXG4gICAgfSxcbiAgICBmb3JtYXQ6IFtcbiAgICAgIC4uLmNvbW1vblByZWZpeEZpZWxkcyxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdzb3VyY2UuaXAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAndXNlci5uYW1lJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnIFwiJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaHR0cC5yZXF1ZXN0Lm1ldGhvZCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICd1cmwucGF0aCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJz8nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICd1cmwucXVlcnknLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgSFRUUC8nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdodHRwLnZlcnNpb24nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdcIiAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdodHRwLnJlc3BvbnNlLnN0YXR1c19jb2RlJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2h0dHAucmVzcG9uc2UuYm9keS5ieXRlcycsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICAvLyBFQ1Mgd2l0aCBvcmlnaW5hbCB1cmxcbiAgICB3aGVuOiB7XG4gICAgICBleGlzdHM6IFsnZWNzLnZlcnNpb24nLCAnaHR0cC5yZXNwb25zZS5zdGF0dXNfY29kZSddLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICAuLi5jb21tb25QcmVmaXhGaWVsZHMsXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnc291cmNlLmlwJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ3VzZXIubmFtZScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyBcIicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2h0dHAucmVxdWVzdC5tZXRob2QnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAndXJsLm9yaWdpbmFsJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnIEhUVFAvJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaHR0cC52ZXJzaW9uJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnXCIgJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaHR0cC5yZXNwb25zZS5zdGF0dXNfY29kZScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdodHRwLnJlc3BvbnNlLmJvZHkuYnl0ZXMnLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXTtcbiJdfQ==