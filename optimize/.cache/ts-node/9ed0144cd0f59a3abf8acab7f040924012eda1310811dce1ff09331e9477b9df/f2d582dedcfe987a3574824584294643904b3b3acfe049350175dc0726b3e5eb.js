"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.hostK8sOverview = (timeField, indexPattern, interval) => ({
    id: 'hostK8sOverview',
    requires: ['kubernetes'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'gauge',
    series: [
        {
            id: 'cpucap',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'kubernetes.node.cpu.allocatable.cores',
                    id: 'max-cpu-cap',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'kubernetes.node.cpu.usage.nanocores',
                    id: 'avg-cpu-usage',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
                {
                    id: 'calc-used-cap',
                    script: 'params.used / (params.cap * 1000000000)',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'max-cpu-cap',
                            id: 'var-cap',
                            name: 'cap',
                        },
                        {
                            field: 'avg-cpu-usage',
                            id: 'var-used',
                            name: 'used',
                        },
                    ],
                },
            ],
        },
        {
            id: 'diskcap',
            metrics: [
                {
                    field: 'kubernetes.node.fs.capacity.bytes',
                    id: 'max-fs-cap',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'kubernetes.node.fs.used.bytes',
                    id: 'avg-fs-used',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
                {
                    id: 'calc-used-cap',
                    script: 'params.used / params.cap',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'max-fs-cap',
                            id: 'var-cap',
                            name: 'cap',
                        },
                        {
                            field: 'avg-fs-used',
                            id: 'var-used',
                            name: 'used',
                        },
                    ],
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'memorycap',
            metrics: [
                {
                    field: 'kubernetes.node.memory.allocatable.bytes',
                    id: 'max-memory-cap',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'kubernetes.node.memory.usage.bytes',
                    id: 'avg-memory-usage',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
                {
                    id: 'calc-used-cap',
                    script: 'params.used / params.cap',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'max-memory-cap',
                            id: 'var-cap',
                            name: 'cap',
                        },
                        {
                            field: 'avg-memory-usage',
                            id: 'var-used',
                            name: 'used',
                        },
                    ],
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'podcap',
            metrics: [
                {
                    field: 'kubernetes.node.pod.capacity.total',
                    id: 'max-pod-cap',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'kubernetes.pod.name',
                    id: 'card-pod-name',
                    type: adapter_types_1.InfraMetricModelMetricType.cardinality,
                },
                {
                    id: 'calc-used-cap',
                    script: 'params.used / params.cap',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'max-pod-cap',
                            id: 'var-cap',
                            name: 'cap',
                        },
                        {
                            field: 'card-pod-name',
                            id: 'var-used',
                            name: 'used',
                        },
                    ],
                },
            ],
            split_mode: 'everything',
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9ob3N0L2hvc3RfazhzX292ZXJ2aWV3LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL21ldHJpY3MvbW9kZWxzL2hvc3QvaG9zdF9rOHNfb3ZlcnZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsdURBQTBGO0FBRTdFLFFBQUEsZUFBZSxHQUE0QixDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzlGLEVBQUUsRUFBRSxpQkFBaUI7SUFDckIsUUFBUSxFQUFFLENBQUMsWUFBWSxDQUFDO0lBQ3hCLGFBQWEsRUFBRSxZQUFZO0lBQzNCLFFBQVE7SUFDUixVQUFVLEVBQUUsU0FBUztJQUNyQixJQUFJLEVBQUUsT0FBTztJQUNiLE1BQU0sRUFBRTtRQUNOO1lBQ0UsRUFBRSxFQUFFLFFBQVE7WUFDWixVQUFVLEVBQUUsWUFBWTtZQUN4QixPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsS0FBSyxFQUFFLHVDQUF1QztvQkFDOUMsRUFBRSxFQUFFLGFBQWE7b0JBQ2pCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQztnQkFDRDtvQkFDRSxLQUFLLEVBQUUscUNBQXFDO29CQUM1QyxFQUFFLEVBQUUsZUFBZTtvQkFDbkIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLEdBQUc7aUJBQ3JDO2dCQUNEO29CQUNFLEVBQUUsRUFBRSxlQUFlO29CQUNuQixNQUFNLEVBQUUseUNBQXlDO29CQUNqRCxJQUFJLEVBQUUsMENBQTBCLENBQUMsV0FBVztvQkFDNUMsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLEtBQUss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LlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yLCBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZSB9IGZyb20gJy4uLy4uL2FkYXB0ZXJfdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgaG9zdEs4c092ZXJ2aWV3OiBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciA9ICh0aW1lRmllbGQsIGluZGV4UGF0dGVybiwgaW50ZXJ2YWwpID0+ICh7XG4gIGlkOiAnaG9zdEs4c092ZXJ2aWV3JyxcbiAgcmVxdWlyZXM6IFsna3ViZXJuZXRlcyddLFxuICBpbmRleF9wYXR0ZXJuOiBpbmRleFBhdHRlcm4sXG4gIGludGVydmFsLFxuICB0aW1lX2ZpZWxkOiB0aW1lRmllbGQsXG4gIHR5cGU6ICdnYXVnZScsXG4gIHNlcmllczogW1xuICAgIHtcbiAgICAgIGlkOiAnY3B1Y2FwJyxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAna3ViZXJuZXRlcy5ub2RlLmNwdS5hbGxvY2F0YWJsZS5jb3JlcycsXG4gICAgICAgICAgaWQ6ICdtYXgtY3B1LWNhcCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUubWF4LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdrdWJlcm5ldGVzLm5vZGUuY3B1LnVzYWdlLm5hbm9jb3JlcycsXG4gICAgICAgICAgaWQ6ICdhdmctY3B1LXVzYWdlJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5hdmcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2NhbGMtdXNlZC1jYXAnLFxuICAgICAgICAgIHNjcmlwdDogJ3BhcmFtcy51c2VkIC8gKHBhcmFtcy5jYXAgKiAxMDAwMDAwMDAwKScsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY2FsY3VsYXRpb24sXG4gICAgICAgICAgdmFyaWFibGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnbWF4LWNwdS1jYXAnLFxuICAgICAgICAgICAgICBpZDogJ3Zhci1jYXAnLFxuICAgICAgICAgICAgICBuYW1lOiAnY2FwJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnYXZnLWNwdS11c2FnZScsXG4gICAgICAgICAgICAgIGlkOiAndmFyLXVzZWQnLFxuICAgICAgICAgICAgICBuYW1lOiAndXNlZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdkaXNrY2FwJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAna3ViZXJuZXRlcy5ub2RlLmZzLmNhcGFjaXR5LmJ5dGVzJyxcbiAgICAgICAgICBpZDogJ21heC1mcy1jYXAnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAna3ViZXJuZXRlcy5ub2RlLmZzLnVzZWQuYnl0ZXMnLFxuICAgICAgICAgIGlkOiAnYXZnLWZzLXVzZWQnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmF2ZyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnY2FsYy11c2VkLWNhcCcsXG4gICAgICAgICAgc2NyaXB0OiAncGFyYW1zLnVzZWQgLyBwYXJhbXMuY2FwJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5jYWxjdWxhdGlvbixcbiAgICAgICAgICB2YXJpYWJsZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdtYXgtZnMtY2FwJyxcbiAgICAgICAgICAgICAgaWQ6ICd2YXItY2FwJyxcbiAgICAgICAgICAgICAgbmFtZTogJ2NhcCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDogJ2F2Zy1mcy11c2VkJyxcbiAgICAgICAgICAgICAgaWQ6ICd2YXItdXNlZCcsXG4gICAgICAgICAgICAgIG5hbWU6ICd1c2VkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ21lbW9yeWNhcCcsXG4gICAgICBtZXRyaWNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ2t1YmVybmV0ZXMubm9kZS5tZW1vcnkuYWxsb2NhdGFibGUuYnl0ZXMnLFxuICAgICAgICAgIGlkOiAnbWF4LW1lbW9yeS1jYXAnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAna3ViZXJuZXRlcy5ub2RlLm1lbW9yeS51c2FnZS5ieXRlcycsXG4gICAgICAgICAgaWQ6ICdhdmctbWVtb3J5LXVzYWdlJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5hdmcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2NhbGMtdXNlZC1jYXAnLFxuICAgICAgICAgIHNjcmlwdDogJ3BhcmFtcy51c2VkIC8gcGFyYW1zLmNhcCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY2FsY3VsYXRpb24sXG4gICAgICAgICAgdmFyaWFibGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnbWF4LW1lbW9yeS1jYXAnLFxuICAgICAgICAgICAgICBpZDogJ3Zhci1jYXAnLFxuICAgICAgICAgICAgICBuYW1lOiAnY2FwJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnYXZnLW1lbW9yeS11c2FnZScsXG4gICAgICAgICAgICAgIGlkOiAndmFyLXVzZWQnLFxuICAgICAgICAgICAgICBuYW1lOiAndXNlZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdwb2RjYXAnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdrdWJlcm5ldGVzLm5vZGUucG9kLmNhcGFjaXR5LnRvdGFsJyxcbiAgICAgICAgICBpZDogJ21heC1wb2QtY2FwJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5tYXgsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ2t1YmVybmV0ZXMucG9kLm5hbWUnLFxuICAgICAgICAgIGlkOiAnY2FyZC1wb2QtbmFtZScsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY2FyZGluYWxpdHksXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2NhbGMtdXNlZC1jYXAnLFxuICAgICAgICAgIHNjcmlwdDogJ3BhcmFtcy51c2VkIC8gcGFyYW1zLmNhcCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY2FsY3VsYXRpb24sXG4gICAgICAgICAgdmFyaWFibGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnbWF4LXBvZC1jYXAnLFxuICAgICAgICAgICAgICBpZDogJ3Zhci1jYXAnLFxuICAgICAgICAgICAgICBuYW1lOiAnY2FwJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnY2FyZC1wb2QtbmFtZScsXG4gICAgICAgICAgICAgIGlkOiAndmFyLXVzZWQnLFxuICAgICAgICAgICAgICBuYW1lOiAndXNlZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgIH0sXG4gIF0sXG59KTtcbiJdfQ==