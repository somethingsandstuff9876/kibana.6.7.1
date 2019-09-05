"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.podLogUsage = (timeField, indexPattern, interval) => ({
    id: 'podLogUsage',
    requires: ['kubernetes.pod'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'logs',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'kubernetes.container.logs.used.bytes',
                    id: 'avg-log-used',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
                {
                    field: 'kubernetes.container.logs.capacity.bytes',
                    id: 'max-log-cap',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    id: 'calc-usage-limit',
                    script: 'params.usage / params.limit',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'avg-log-userd',
                            id: 'var-usage',
                            name: 'usage',
                        },
                        {
                            field: 'max-log-cap',
                            id: 'var-limit',
                            name: 'limit',
                        },
                    ],
                },
            ],
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9wb2QvcG9kX2xvZ191c2FnZS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9wb2QvcG9kX2xvZ191c2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCx1REFBMEY7QUFFN0UsUUFBQSxXQUFXLEdBQTRCLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDMUYsRUFBRSxFQUFFLGFBQWE7SUFDakIsUUFBUSxFQUFFLENBQUMsZ0JBQWdCLENBQUM7SUFDNUIsYUFBYSxFQUFFLFlBQVk7SUFDM0IsUUFBUTtJQUNSLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLElBQUksRUFBRSxZQUFZO0lBQ2xCLE1BQU0sRUFBRTtRQUNOO1lBQ0UsRUFBRSxFQUFFLE1BQU07WUFDVixVQUFVLEVBQUUsWUFBWTtZQUN4QixPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsS0FBSyxFQUFFLHNDQUFzQztvQkFDN0MsRUFBRSxFQUFFLGNBQWM7b0JBQ2xCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQztnQkFDRDtvQkFDRSxLQUFLLEVBQUUsMENBQTBDO29CQUNqRCxFQUFFLEVBQUUsYUFBYTtvQkFDakIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLEdBQUc7aUJBQ3JDO2dCQUNEO29CQUNFLEVBQUUsRUFBRSxrQkFBa0I7b0JBQ3RCLE1BQU0sRUFBRSw2QkFBNkI7b0JBQ3JDLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxXQUFXO29CQUM1QyxTQUFTLEVBQUU7d0JBQ1Q7NEJBQ0UsS0FBSyxFQUFFLGVBQWU7NEJBQ3RCLEVBQUUsRUFBRSxXQUFXOzRCQUNmLElBQUksRUFBRSxPQUFPO3lCQUNkO3dCQUNEOzRCQUNFLEtBQUssRUFBRSxhQUFhOzRCQUNwQixFQUFFLEVBQUUsV0FBVzs0QkFDZixJQUFJLEVBQUUsT0FBTzt5QkFDZDtxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yLCBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZSB9IGZyb20gJy4uLy4uL2FkYXB0ZXJfdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgcG9kTG9nVXNhZ2U6IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yID0gKHRpbWVGaWVsZCwgaW5kZXhQYXR0ZXJuLCBpbnRlcnZhbCkgPT4gKHtcbiAgaWQ6ICdwb2RMb2dVc2FnZScsXG4gIHJlcXVpcmVzOiBbJ2t1YmVybmV0ZXMucG9kJ10sXG4gIGluZGV4X3BhdHRlcm46IGluZGV4UGF0dGVybixcbiAgaW50ZXJ2YWwsXG4gIHRpbWVfZmllbGQ6IHRpbWVGaWVsZCxcbiAgdHlwZTogJ3RpbWVzZXJpZXMnLFxuICBzZXJpZXM6IFtcbiAgICB7XG4gICAgICBpZDogJ2xvZ3MnLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdrdWJlcm5ldGVzLmNvbnRhaW5lci5sb2dzLnVzZWQuYnl0ZXMnLFxuICAgICAgICAgIGlkOiAnYXZnLWxvZy11c2VkJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5hdmcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ2t1YmVybmV0ZXMuY29udGFpbmVyLmxvZ3MuY2FwYWNpdHkuYnl0ZXMnLFxuICAgICAgICAgIGlkOiAnbWF4LWxvZy1jYXAnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnY2FsYy11c2FnZS1saW1pdCcsXG4gICAgICAgICAgc2NyaXB0OiAncGFyYW1zLnVzYWdlIC8gcGFyYW1zLmxpbWl0JyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5jYWxjdWxhdGlvbixcbiAgICAgICAgICB2YXJpYWJsZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdhdmctbG9nLXVzZXJkJyxcbiAgICAgICAgICAgICAgaWQ6ICd2YXItdXNhZ2UnLFxuICAgICAgICAgICAgICBuYW1lOiAndXNhZ2UnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdtYXgtbG9nLWNhcCcsXG4gICAgICAgICAgICAgIGlkOiAndmFyLWxpbWl0JyxcbiAgICAgICAgICAgICAgbmFtZTogJ2xpbWl0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbn0pO1xuIl19