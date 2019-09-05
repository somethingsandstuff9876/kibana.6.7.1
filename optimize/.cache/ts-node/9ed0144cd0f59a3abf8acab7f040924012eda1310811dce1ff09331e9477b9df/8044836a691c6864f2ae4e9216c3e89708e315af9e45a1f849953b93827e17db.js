"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.hostLoad = (timeField, indexPattern, interval) => ({
    id: 'hostLoad',
    requires: ['system.cpu'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'load_1m',
            metrics: [
                {
                    field: 'system.load.1',
                    id: 'avg-load-1m',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'load_5m',
            metrics: [
                {
                    field: 'system.load.5',
                    id: 'avg-load-5m',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'load_15m',
            metrics: [
                {
                    field: 'system.load.15',
                    id: 'avg-load-15m',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
            split_mode: 'everything',
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9ob3N0L2hvc3RfbG9hZC50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9ob3N0L2hvc3RfbG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCx1REFBMEY7QUFFN0UsUUFBQSxRQUFRLEdBQTRCLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdkYsRUFBRSxFQUFFLFVBQVU7SUFDZCxRQUFRLEVBQUUsQ0FBQyxZQUFZLENBQUM7SUFDeEIsYUFBYSxFQUFFLFlBQVk7SUFDM0IsUUFBUTtJQUNSLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLElBQUksRUFBRSxZQUFZO0lBQ2xCLE1BQU0sRUFBRTtRQUNOO1lBQ0UsRUFBRSxFQUFFLFNBQVM7WUFDYixPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsS0FBSyxFQUFFLGVBQWU7b0JBQ3RCLEVBQUUsRUFBRSxhQUFhO29CQUNqQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7YUFDRjtZQUNELFVBQVUsRUFBRSxZQUFZO1NBQ3pCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsU0FBUztZQUNiLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUsZUFBZTtvQkFDdEIsRUFBRSxFQUFFLGFBQWE7b0JBQ2pCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQzthQUNGO1lBQ0QsVUFBVSxFQUFFLFlBQVk7U0FDekI7UUFDRDtZQUNFLEVBQUUsRUFBRSxVQUFVO1lBQ2QsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSxnQkFBZ0I7b0JBQ3ZCLEVBQUUsRUFBRSxjQUFjO29CQUNsQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7YUFDRjtZQUNELFVBQVUsRUFBRSxZQUFZO1NBQ3pCO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciwgSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUgfSBmcm9tICcuLi8uLi9hZGFwdGVyX3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IGhvc3RMb2FkOiBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciA9ICh0aW1lRmllbGQsIGluZGV4UGF0dGVybiwgaW50ZXJ2YWwpID0+ICh7XG4gIGlkOiAnaG9zdExvYWQnLFxuICByZXF1aXJlczogWydzeXN0ZW0uY3B1J10sXG4gIGluZGV4X3BhdHRlcm46IGluZGV4UGF0dGVybixcbiAgaW50ZXJ2YWwsXG4gIHRpbWVfZmllbGQ6IHRpbWVGaWVsZCxcbiAgdHlwZTogJ3RpbWVzZXJpZXMnLFxuICBzZXJpZXM6IFtcbiAgICB7XG4gICAgICBpZDogJ2xvYWRfMW0nLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdzeXN0ZW0ubG9hZC4xJyxcbiAgICAgICAgICBpZDogJ2F2Zy1sb2FkLTFtJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5hdmcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdsb2FkXzVtJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnc3lzdGVtLmxvYWQuNScsXG4gICAgICAgICAgaWQ6ICdhdmctbG9hZC01bScsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnbG9hZF8xNW0nLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdzeXN0ZW0ubG9hZC4xNScsXG4gICAgICAgICAgaWQ6ICdhdmctbG9hZC0xNW0nLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmF2ZyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgfSxcbiAgXSxcbn0pO1xuIl19