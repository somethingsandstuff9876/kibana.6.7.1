"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.containerCpuUsage = (timeField, indexPattern, interval) => ({
    id: 'containerCpuUsage',
    requires: ['docker.cpu'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'cpu',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'docker.cpu.total.pct',
                    id: 'avg-cpu-total',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9jb250YWluZXIvY29udGFpbmVyX2NwdV91c2FnZS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9jb250YWluZXIvY29udGFpbmVyX2NwdV91c2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCx1REFBMEY7QUFFN0UsUUFBQSxpQkFBaUIsR0FBNEIsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNoRyxFQUFFLEVBQUUsbUJBQW1CO0lBQ3ZCLFFBQVEsRUFBRSxDQUFDLFlBQVksQ0FBQztJQUN4QixhQUFhLEVBQUUsWUFBWTtJQUMzQixRQUFRO0lBQ1IsVUFBVSxFQUFFLFNBQVM7SUFDckIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsTUFBTSxFQUFFO1FBQ047WUFDRSxFQUFFLEVBQUUsS0FBSztZQUNULFVBQVUsRUFBRSxZQUFZO1lBQ3hCLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUsc0JBQXNCO29CQUM3QixFQUFFLEVBQUUsZUFBZTtvQkFDbkIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLEdBQUc7aUJBQ3JDO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5mcmFNZXRyaWNNb2RlbENyZWF0b3IsIEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlIH0gZnJvbSAnLi4vLi4vYWRhcHRlcl90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBjb250YWluZXJDcHVVc2FnZTogSW5mcmFNZXRyaWNNb2RlbENyZWF0b3IgPSAodGltZUZpZWxkLCBpbmRleFBhdHRlcm4sIGludGVydmFsKSA9PiAoe1xuICBpZDogJ2NvbnRhaW5lckNwdVVzYWdlJyxcbiAgcmVxdWlyZXM6IFsnZG9ja2VyLmNwdSddLFxuICBpbmRleF9wYXR0ZXJuOiBpbmRleFBhdHRlcm4sXG4gIGludGVydmFsLFxuICB0aW1lX2ZpZWxkOiB0aW1lRmllbGQsXG4gIHR5cGU6ICd0aW1lc2VyaWVzJyxcbiAgc2VyaWVzOiBbXG4gICAge1xuICAgICAgaWQ6ICdjcHUnLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdkb2NrZXIuY3B1LnRvdGFsLnBjdCcsXG4gICAgICAgICAgaWQ6ICdhdmctY3B1LXRvdGFsJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5hdmcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59KTtcbiJdfQ==