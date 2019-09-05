"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.hostFilesystem = (timeField, indexPattern, interval) => ({
    id: 'hostFilesystem',
    requires: ['system.filesystem'],
    filter: 'system.filesystem.device_name:\\/*',
    index_pattern: indexPattern,
    time_field: timeField,
    interval,
    type: 'timeseries',
    series: [
        {
            id: 'used',
            metrics: [
                {
                    field: 'system.filesystem.used.pct',
                    id: 'avg-filesystem-used',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
            split_mode: 'terms',
            terms_field: 'system.filesystem.device_name',
            terms_order_by: 'used',
            terms_size: 5,
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9ob3N0L2hvc3RfZmlsZXN5c3RlbS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9ob3N0L2hvc3RfZmlsZXN5c3RlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCx1REFBMEY7QUFFN0UsUUFBQSxjQUFjLEdBQTRCLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDN0YsRUFBRSxFQUFFLGdCQUFnQjtJQUNwQixRQUFRLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztJQUMvQixNQUFNLEVBQUUsb0NBQW9DO0lBQzVDLGFBQWEsRUFBRSxZQUFZO0lBQzNCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLFFBQVE7SUFDUixJQUFJLEVBQUUsWUFBWTtJQUNsQixNQUFNLEVBQUU7UUFDTjtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSw0QkFBNEI7b0JBQ25DLEVBQUUsRUFBRSxxQkFBcUI7b0JBQ3pCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQzthQUNGO1lBQ0QsVUFBVSxFQUFFLE9BQU87WUFDbkIsV0FBVyxFQUFFLCtCQUErQjtZQUM1QyxjQUFjLEVBQUUsTUFBTTtZQUN0QixVQUFVLEVBQUUsQ0FBQztTQUNkO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciwgSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUgfSBmcm9tICcuLi8uLi9hZGFwdGVyX3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IGhvc3RGaWxlc3lzdGVtOiBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciA9ICh0aW1lRmllbGQsIGluZGV4UGF0dGVybiwgaW50ZXJ2YWwpID0+ICh7XG4gIGlkOiAnaG9zdEZpbGVzeXN0ZW0nLFxuICByZXF1aXJlczogWydzeXN0ZW0uZmlsZXN5c3RlbSddLFxuICBmaWx0ZXI6ICdzeXN0ZW0uZmlsZXN5c3RlbS5kZXZpY2VfbmFtZTpcXFxcLyonLFxuICBpbmRleF9wYXR0ZXJuOiBpbmRleFBhdHRlcm4sXG4gIHRpbWVfZmllbGQ6IHRpbWVGaWVsZCxcbiAgaW50ZXJ2YWwsXG4gIHR5cGU6ICd0aW1lc2VyaWVzJyxcbiAgc2VyaWVzOiBbXG4gICAge1xuICAgICAgaWQ6ICd1c2VkJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnc3lzdGVtLmZpbGVzeXN0ZW0udXNlZC5wY3QnLFxuICAgICAgICAgIGlkOiAnYXZnLWZpbGVzeXN0ZW0tdXNlZCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHNwbGl0X21vZGU6ICd0ZXJtcycsXG4gICAgICB0ZXJtc19maWVsZDogJ3N5c3RlbS5maWxlc3lzdGVtLmRldmljZV9uYW1lJyxcbiAgICAgIHRlcm1zX29yZGVyX2J5OiAndXNlZCcsXG4gICAgICB0ZXJtc19zaXplOiA1LFxuICAgIH0sXG4gIF0sXG59KTtcbiJdfQ==