"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.hostK8sMemoryCap = (timeField, indexPattern, interval) => ({
    id: 'hostK8sMemoryCap',
    map_field_to: 'kubernetes.node.name',
    requires: ['kubernetes.node'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'capacity',
            metrics: [
                {
                    field: 'kubernetes.node.memory.allocatable.bytes',
                    id: 'max-memory-cap',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'used',
            metrics: [
                {
                    field: 'kubernetes.node.memory.usage.bytes',
                    id: 'avg-memory-usage',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
            split_mode: 'everything',
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9ob3N0L2hvc3RfazhzX21lbW9yeV9jYXAudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvYWRhcHRlcnMvbWV0cmljcy9tb2RlbHMvaG9zdC9ob3N0X2s4c19tZW1vcnlfY2FwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILHVEQUEwRjtBQUU3RSxRQUFBLGdCQUFnQixHQUE0QixDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9GLEVBQUUsRUFBRSxrQkFBa0I7SUFDdEIsWUFBWSxFQUFFLHNCQUFzQjtJQUNwQyxRQUFRLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztJQUM3QixhQUFhLEVBQUUsWUFBWTtJQUMzQixRQUFRO0lBQ1IsVUFBVSxFQUFFLFNBQVM7SUFDckIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsTUFBTSxFQUFFO1FBQ047WUFDRSxFQUFFLEVBQUUsVUFBVTtZQUNkLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUsMENBQTBDO29CQUNqRCxFQUFFLEVBQUUsZ0JBQWdCO29CQUNwQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7YUFDRjtZQUNELFVBQVUsRUFBRSxZQUFZO1NBQ3pCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsTUFBTTtZQUNWLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUsb0NBQW9DO29CQUMzQyxFQUFFLEVBQUUsa0JBQWtCO29CQUN0QixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7YUFDRjtZQUNELFVBQVUsRUFBRSxZQUFZO1NBQ3pCO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciwgSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUgfSBmcm9tICcuLi8uLi9hZGFwdGVyX3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IGhvc3RLOHNNZW1vcnlDYXA6IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yID0gKHRpbWVGaWVsZCwgaW5kZXhQYXR0ZXJuLCBpbnRlcnZhbCkgPT4gKHtcbiAgaWQ6ICdob3N0SzhzTWVtb3J5Q2FwJyxcbiAgbWFwX2ZpZWxkX3RvOiAna3ViZXJuZXRlcy5ub2RlLm5hbWUnLFxuICByZXF1aXJlczogWydrdWJlcm5ldGVzLm5vZGUnXSxcbiAgaW5kZXhfcGF0dGVybjogaW5kZXhQYXR0ZXJuLFxuICBpbnRlcnZhbCxcbiAgdGltZV9maWVsZDogdGltZUZpZWxkLFxuICB0eXBlOiAndGltZXNlcmllcycsXG4gIHNlcmllczogW1xuICAgIHtcbiAgICAgIGlkOiAnY2FwYWNpdHknLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdrdWJlcm5ldGVzLm5vZGUubWVtb3J5LmFsbG9jYXRhYmxlLmJ5dGVzJyxcbiAgICAgICAgICBpZDogJ21heC1tZW1vcnktY2FwJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5tYXgsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICd1c2VkJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAna3ViZXJuZXRlcy5ub2RlLm1lbW9yeS51c2FnZS5ieXRlcycsXG4gICAgICAgICAgaWQ6ICdhdmctbWVtb3J5LXVzYWdlJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5hdmcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgIH0sXG4gIF0sXG59KTtcbiJdfQ==