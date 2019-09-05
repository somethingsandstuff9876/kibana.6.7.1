"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.nginxActiveConnections = (timeField, indexPattern, interval) => ({
    id: 'nginxActiveConnections',
    requires: ['nginx.stubstatus'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'connections',
            metrics: [
                {
                    field: 'nginx.stubstatus.active',
                    id: 'avg-active',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
            split_mode: 'everything',
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9uZ2lueC9uZ2lueF9hY3RpdmVfY29ubmVjdGlvbnMudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvYWRhcHRlcnMvbWV0cmljcy9tb2RlbHMvbmdpbngvbmdpbnhfYWN0aXZlX2Nvbm5lY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILHVEQUEwRjtBQUU3RSxRQUFBLHNCQUFzQixHQUE0QixDQUM3RCxTQUFTLEVBQ1QsWUFBWSxFQUNaLFFBQVEsRUFDUixFQUFFLENBQUMsQ0FBQztJQUNKLEVBQUUsRUFBRSx3QkFBd0I7SUFDNUIsUUFBUSxFQUFFLENBQUMsa0JBQWtCLENBQUM7SUFDOUIsYUFBYSxFQUFFLFlBQVk7SUFDM0IsUUFBUTtJQUNSLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLElBQUksRUFBRSxZQUFZO0lBQ2xCLE1BQU0sRUFBRTtRQUNOO1lBQ0UsRUFBRSxFQUFFLGFBQWE7WUFDakIsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSx5QkFBeUI7b0JBQ2hDLEVBQUUsRUFBRSxZQUFZO29CQUNoQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7YUFDRjtZQUNELFVBQVUsRUFBRSxZQUFZO1NBQ3pCO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciwgSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUgfSBmcm9tICcuLi8uLi9hZGFwdGVyX3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IG5naW54QWN0aXZlQ29ubmVjdGlvbnM6IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yID0gKFxuICB0aW1lRmllbGQsXG4gIGluZGV4UGF0dGVybixcbiAgaW50ZXJ2YWxcbikgPT4gKHtcbiAgaWQ6ICduZ2lueEFjdGl2ZUNvbm5lY3Rpb25zJyxcbiAgcmVxdWlyZXM6IFsnbmdpbnguc3R1YnN0YXR1cyddLFxuICBpbmRleF9wYXR0ZXJuOiBpbmRleFBhdHRlcm4sXG4gIGludGVydmFsLFxuICB0aW1lX2ZpZWxkOiB0aW1lRmllbGQsXG4gIHR5cGU6ICd0aW1lc2VyaWVzJyxcbiAgc2VyaWVzOiBbXG4gICAge1xuICAgICAgaWQ6ICdjb25uZWN0aW9ucycsXG4gICAgICBtZXRyaWNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ25naW54LnN0dWJzdGF0dXMuYWN0aXZlJyxcbiAgICAgICAgICBpZDogJ2F2Zy1hY3RpdmUnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmF2ZyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgfSxcbiAgXSxcbn0pO1xuIl19