"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.nginxRequestsPerConnection = (timeField, indexPattern, interval) => ({
    id: 'nginxRequestsPerConnection',
    requires: ['nginx.stubstatus'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'reqPerConns',
            metrics: [
                {
                    field: 'nginx.stubstatus.handled',
                    id: 'max-handled',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'nginx.stubstatus.requests',
                    id: 'max-requests',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    id: 'reqs-per-connection',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        { id: 'var-handled', name: 'handled', field: 'max-handled' },
                        { id: 'var-requests', name: 'requests', field: 'max-requests' },
                    ],
                    script: 'params.handled > 0.0 && params.requests > 0.0 ? params.handled / params.requests : 0.0',
                },
            ],
            split_mode: 'everything',
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9uZ2lueC9uZ2lueF9yZXF1ZXN0c19wZXJfY29ubmVjdGlvbi50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9uZ2lueC9uZ2lueF9yZXF1ZXN0c19wZXJfY29ubmVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCx1REFBMEY7QUFFN0UsUUFBQSwwQkFBMEIsR0FBNEIsQ0FDakUsU0FBUyxFQUNULFlBQVksRUFDWixRQUFRLEVBQ1IsRUFBRSxDQUFDLENBQUM7SUFDSixFQUFFLEVBQUUsNEJBQTRCO0lBQ2hDLFFBQVEsRUFBRSxDQUFDLGtCQUFrQixDQUFDO0lBQzlCLGFBQWEsRUFBRSxZQUFZO0lBQzNCLFFBQVE7SUFDUixVQUFVLEVBQUUsU0FBUztJQUNyQixJQUFJLEVBQUUsWUFBWTtJQUNsQixNQUFNLEVBQUU7UUFDTjtZQUNFLEVBQUUsRUFBRSxhQUFhO1lBQ2pCLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUsMEJBQTBCO29CQUNqQyxFQUFFLEVBQUUsYUFBYTtvQkFDakIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLEdBQUc7aUJBQ3JDO2dCQUNEO29CQUNFLEtBQUssRUFBRSwyQkFBMkI7b0JBQ2xDLEVBQUUsRUFBRSxjQUFjO29CQUNsQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLHFCQUFxQjtvQkFDekIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFdBQVc7b0JBQzVDLFNBQVMsRUFBRTt3QkFDVCxFQUFFLEVBQUUsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFO3dCQUM1RCxFQUFFLEVBQUUsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFO3FCQUNoRTtvQkFDRCxNQUFNLEVBQ0osd0ZBQXdGO2lCQUMzRjthQUNGO1lBQ0QsVUFBVSxFQUFFLFlBQVk7U0FDekI7S0FDRjtDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yLCBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZSB9IGZyb20gJy4uLy4uL2FkYXB0ZXJfdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgbmdpbnhSZXF1ZXN0c1BlckNvbm5lY3Rpb246IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yID0gKFxuICB0aW1lRmllbGQsXG4gIGluZGV4UGF0dGVybixcbiAgaW50ZXJ2YWxcbikgPT4gKHtcbiAgaWQ6ICduZ2lueFJlcXVlc3RzUGVyQ29ubmVjdGlvbicsXG4gIHJlcXVpcmVzOiBbJ25naW54LnN0dWJzdGF0dXMnXSxcbiAgaW5kZXhfcGF0dGVybjogaW5kZXhQYXR0ZXJuLFxuICBpbnRlcnZhbCxcbiAgdGltZV9maWVsZDogdGltZUZpZWxkLFxuICB0eXBlOiAndGltZXNlcmllcycsXG4gIHNlcmllczogW1xuICAgIHtcbiAgICAgIGlkOiAncmVxUGVyQ29ubnMnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICduZ2lueC5zdHVic3RhdHVzLmhhbmRsZWQnLFxuICAgICAgICAgIGlkOiAnbWF4LWhhbmRsZWQnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnbmdpbnguc3R1YnN0YXR1cy5yZXF1ZXN0cycsXG4gICAgICAgICAgaWQ6ICdtYXgtcmVxdWVzdHMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAncmVxcy1wZXItY29ubmVjdGlvbicsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY2FsY3VsYXRpb24sXG4gICAgICAgICAgdmFyaWFibGVzOiBbXG4gICAgICAgICAgICB7IGlkOiAndmFyLWhhbmRsZWQnLCBuYW1lOiAnaGFuZGxlZCcsIGZpZWxkOiAnbWF4LWhhbmRsZWQnIH0sXG4gICAgICAgICAgICB7IGlkOiAndmFyLXJlcXVlc3RzJywgbmFtZTogJ3JlcXVlc3RzJywgZmllbGQ6ICdtYXgtcmVxdWVzdHMnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBzY3JpcHQ6XG4gICAgICAgICAgICAncGFyYW1zLmhhbmRsZWQgPiAwLjAgJiYgcGFyYW1zLnJlcXVlc3RzID4gMC4wID8gcGFyYW1zLmhhbmRsZWQgLyBwYXJhbXMucmVxdWVzdHMgOiAwLjAnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICB9LFxuICBdLFxufSk7XG4iXX0=