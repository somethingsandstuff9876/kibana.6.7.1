"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.hostK8sDiskCap = (timeField, indexPattern, interval) => ({
    id: 'hostK8sDiskCap',
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
                    field: 'kubernetes.node.fs.capacity.bytes',
                    id: 'max-fs-cap',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'used',
            metrics: [
                {
                    field: 'kubernetes.node.fs.used.bytes',
                    id: 'avg-fs-used',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
            split_mode: 'everything',
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9ob3N0L2hvc3RfazhzX2Rpc2tfY2FwLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL21ldHJpY3MvbW9kZWxzL2hvc3QvaG9zdF9rOHNfZGlza19jYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsdURBQTBGO0FBRTdFLFFBQUEsY0FBYyxHQUE0QixDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzdGLEVBQUUsRUFBRSxnQkFBZ0I7SUFDcEIsWUFBWSxFQUFFLHNCQUFzQjtJQUNwQyxRQUFRLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztJQUM3QixhQUFhLEVBQUUsWUFBWTtJQUMzQixRQUFRO0lBQ1IsVUFBVSxFQUFFLFNBQVM7SUFDckIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsTUFBTSxFQUFFO1FBQ047WUFDRSxFQUFFLEVBQUUsVUFBVTtZQUNkLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUsbUNBQW1DO29CQUMxQyxFQUFFLEVBQUUsWUFBWTtvQkFDaEIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLEdBQUc7aUJBQ3JDO2FBQ0Y7WUFDRCxVQUFVLEVBQUUsWUFBWTtTQUN6QjtRQUNEO1lBQ0UsRUFBRSxFQUFFLE1BQU07WUFDVixPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsS0FBSyxFQUFFLCtCQUErQjtvQkFDdEMsRUFBRSxFQUFFLGFBQWE7b0JBQ2pCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQzthQUNGO1lBQ0QsVUFBVSxFQUFFLFlBQVk7U0FDekI7S0FDRjtDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yLCBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZSB9IGZyb20gJy4uLy4uL2FkYXB0ZXJfdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgaG9zdEs4c0Rpc2tDYXA6IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yID0gKHRpbWVGaWVsZCwgaW5kZXhQYXR0ZXJuLCBpbnRlcnZhbCkgPT4gKHtcbiAgaWQ6ICdob3N0SzhzRGlza0NhcCcsXG4gIG1hcF9maWVsZF90bzogJ2t1YmVybmV0ZXMubm9kZS5uYW1lJyxcbiAgcmVxdWlyZXM6IFsna3ViZXJuZXRlcy5ub2RlJ10sXG4gIGluZGV4X3BhdHRlcm46IGluZGV4UGF0dGVybixcbiAgaW50ZXJ2YWwsXG4gIHRpbWVfZmllbGQ6IHRpbWVGaWVsZCxcbiAgdHlwZTogJ3RpbWVzZXJpZXMnLFxuICBzZXJpZXM6IFtcbiAgICB7XG4gICAgICBpZDogJ2NhcGFjaXR5JyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAna3ViZXJuZXRlcy5ub2RlLmZzLmNhcGFjaXR5LmJ5dGVzJyxcbiAgICAgICAgICBpZDogJ21heC1mcy1jYXAnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ3VzZWQnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdrdWJlcm5ldGVzLm5vZGUuZnMudXNlZC5ieXRlcycsXG4gICAgICAgICAgaWQ6ICdhdmctZnMtdXNlZCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICB9LFxuICBdLFxufSk7XG4iXX0=