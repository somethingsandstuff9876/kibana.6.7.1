"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.hostCpuUsage = (timeField, indexPattern, interval) => ({
    id: 'hostCpuUsage',
    requires: ['system.cpu'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'user',
            metrics: [
                {
                    field: 'system.cpu.user.pct',
                    id: 'avg-cpu-user',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
                {
                    field: 'system.cpu.cores',
                    id: 'max-cpu-cores',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    id: 'calc-avg-cores',
                    script: 'params.avg / params.cores',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'max-cpu-cores',
                            id: 'var-cores',
                            name: 'cores',
                        },
                        {
                            field: 'avg-cpu-user',
                            id: 'var-avg',
                            name: 'avg',
                        },
                    ],
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'system',
            metrics: [
                {
                    field: 'system.cpu.system.pct',
                    id: 'avg-cpu-system',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
                {
                    field: 'system.cpu.cores',
                    id: 'max-cpu-cores',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    id: 'calc-avg-cores',
                    script: 'params.avg / params.cores',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'max-cpu-cores',
                            id: 'var-cores',
                            name: 'cores',
                        },
                        {
                            field: 'avg-cpu-system',
                            id: 'var-avg',
                            name: 'avg',
                        },
                    ],
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'steal',
            metrics: [
                {
                    field: 'system.cpu.steal.pct',
                    id: 'avg-cpu-steal',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
                {
                    field: 'system.cpu.cores',
                    id: 'max-cpu-cores',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    id: 'calc-avg-cores',
                    script: 'params.avg / params.cores',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'avg-cpu-steal',
                            id: 'var-avg',
                            name: 'avg',
                        },
                        {
                            field: 'max-cpu-cores',
                            id: 'var-cores',
                            name: 'cores',
                        },
                    ],
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'irq',
            metrics: [
                {
                    field: 'system.cpu.irq.pct',
                    id: 'avg-cpu-irq',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
                {
                    field: 'system.cpu.cores',
                    id: 'max-cpu-cores',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    id: 'calc-avg-cores',
                    script: 'params.avg / params.cores',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'max-cpu-cores',
                            id: 'var-cores',
                            name: 'cores',
                        },
                        {
                            field: 'avg-cpu-irq',
                            id: 'var-avg',
                            name: 'avg',
                        },
                    ],
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'softirq',
            metrics: [
                {
                    field: 'system.cpu.softirq.pct',
                    id: 'avg-cpu-softirq',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
                {
                    field: 'system.cpu.cores',
                    id: 'max-cpu-cores',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    id: 'calc-avg-cores',
                    script: 'params.avg / params.cores',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'max-cpu-cores',
                            id: 'var-cores',
                            name: 'cores',
                        },
                        {
                            field: 'avg-cpu-softirq',
                            id: 'var-avg',
                            name: 'avg',
                        },
                    ],
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'iowait',
            metrics: [
                {
                    field: 'system.cpu.iowait.pct',
                    id: 'avg-cpu-iowait',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
                {
                    field: 'system.cpu.cores',
                    id: 'max-cpu-cores',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    id: 'calc-avg-cores',
                    script: 'params.avg / params.cores',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'max-cpu-cores',
                            id: 'var-cores',
                            name: 'cores',
                        },
                        {
                            field: 'avg-cpu-iowait',
                            id: 'var-avg',
                            name: 'avg',
                        },
                    ],
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'nice',
            metrics: [
                {
                    field: 'system.cpu.nice.pct',
                    id: 'avg-cpu-nice',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
                {
                    field: 'system.cpu.cores',
                    id: 'max-cpu-cores',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    id: 'calc-avg-cores',
                    script: 'params.avg / params.cores',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'max-cpu-cores',
                            id: 'var-cores',
                            name: 'cores',
                        },
                        {
                            field: 'avg-cpu-nice',
                            id: 'var-avg',
                            name: 'avg',
                        },
                    ],
                },
            ],
            split_mode: 'everything',
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9ob3N0L2hvc3RfY3B1X3VzYWdlLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL21ldHJpY3MvbW9kZWxzL2hvc3QvaG9zdF9jcHVfdXNhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsdURBQTBGO0FBRTdFLFFBQUEsWUFBWSxHQUE0QixDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNGLEVBQUUsRUFBRSxjQUFjO0lBQ2xCLFFBQVEsRUFBRSxDQUFDLFlBQVksQ0FBQztJQUN4QixhQUFhLEVBQUUsWUFBWTtJQUMzQixRQUFRO0lBQ1IsVUFBVSxFQUFFLFNBQVM7SUFDckIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsTUFBTSxFQUFFO1FBQ047WUFDRSxFQUFFLEVBQUUsTUFBTTtZQUNWLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUscUJBQXFCO29CQUM1QixFQUFFLEVBQUUsY0FBYztvQkFDbEIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLEdBQUc7aUJBQ3JDO2dCQUNEO29CQUNFLEtBQUssRUFBRSxrQkFBa0I7b0JBQ3pCLEVBQUUsRUFBRSxlQUFlO29CQUNuQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLGdCQUFnQjtvQkFDcEIsTUFBTSxFQUFFLDJCQUEyQjtvQkFDbkMsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFdBQVc7b0JBQzVDLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxLQUFLLEVBQUUsZUFBZTs0QkFDdEIsRUFBRSxFQUFF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QUFFLFNBQVM7NEJBQ2IsSUFBSSxFQUFFLEtBQUs7eUJBQ1o7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELFVBQVUsRUFBRSxZQUFZO1NBQ3pCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsTUFBTTtZQUNWLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUscUJBQXFCO29CQUM1QixFQUFFLEVBQUUsY0FBYztvQkFDbEIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLEdBQUc7aUJBQ3JDO2dCQUNEO29CQUNFLEtBQUssRUFBRSxrQkFBa0I7b0JBQ3pCLEVBQUUsRUFBRSxlQUFlO29CQUNuQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLGdCQUFnQjtvQkFDcEIsTUFBTSxFQUFFLDJCQUEyQjtvQkFDbkMsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFdBQVc7b0JBQzVDLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxLQUFLLEVBQUUsZUFBZTs0QkFDdEIsRUFBRSxFQUFFLFdBQVc7NEJBQ2YsSUFBSSxFQUFFLE9BQU87eUJBQ2Q7d0JBQ0Q7NEJBQ0UsS0FBSyxFQUFFLGNBQWM7NEJBQ3JCLEVBQUUsRUFBRSxTQUFTOzRCQUNiLElBQUksRUFBRSxLQUFLO3lCQUNaO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRCxVQUFVLEVBQUUsWUFBWTtTQUN6QjtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5mcmFNZXRyaWNNb2RlbENyZWF0b3IsIEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlIH0gZnJvbSAnLi4vLi4vYWRhcHRlcl90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBob3N0Q3B1VXNhZ2U6IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yID0gKHRpbWVGaWVsZCwgaW5kZXhQYXR0ZXJuLCBpbnRlcnZhbCkgPT4gKHtcbiAgaWQ6ICdob3N0Q3B1VXNhZ2UnLFxuICByZXF1aXJlczogWydzeXN0ZW0uY3B1J10sXG4gIGluZGV4X3BhdHRlcm46IGluZGV4UGF0dGVybixcbiAgaW50ZXJ2YWwsXG4gIHRpbWVfZmllbGQ6IHRpbWVGaWVsZCxcbiAgdHlwZTogJ3RpbWVzZXJpZXMnLFxuICBzZXJpZXM6IFtcbiAgICB7XG4gICAgICBpZDogJ3VzZXInLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdzeXN0ZW0uY3B1LnVzZXIucGN0JyxcbiAgICAgICAgICBpZDogJ2F2Zy1jcHUtdXNlcicsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdzeXN0ZW0uY3B1LmNvcmVzJyxcbiAgICAgICAgICBpZDogJ21heC1jcHUtY29yZXMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnY2FsYy1hdmctY29yZXMnLFxuICAgICAgICAgIHNjcmlwdDogJ3BhcmFtcy5hdmcgLyBwYXJhbXMuY29yZXMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmNhbGN1bGF0aW9uLFxuICAgICAgICAgIHZhcmlhYmxlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDogJ21heC1jcHUtY29yZXMnLFxuICAgICAgICAgICAgICBpZDogJ3Zhci1jb3JlcycsXG4gICAgICAgICAgICAgIG5hbWU6ICdjb3JlcycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDogJ2F2Zy1jcHUtdXNlcicsXG4gICAgICAgICAgICAgIGlkOiAndmFyLWF2ZycsXG4gICAgICAgICAgICAgIG5hbWU6ICdhdmcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnc3lzdGVtJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnc3lzdGVtLmNwdS5zeXN0ZW0ucGN0JyxcbiAgICAgICAgICBpZDogJ2F2Zy1jcHUtc3lzdGVtJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5hdmcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ3N5c3RlbS5jcHUuY29yZXMnLFxuICAgICAgICAgIGlkOiAnbWF4LWNwdS1jb3JlcycsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUubWF4LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdjYWxjLWF2Zy1jb3JlcycsXG4gICAgICAgICAgc2NyaXB0OiAncGFyYW1zLmF2ZyAvIHBhcmFtcy5jb3JlcycsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY2FsY3VsYXRpb24sXG4gICAgICAgICAgdmFyaWFibGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnbWF4LWNwdS1jb3JlcycsXG4gICAgICAgICAgICAgIGlkOiAndmFyLWNvcmVzJyxcbiAgICAgICAgICAgICAgbmFtZTogJ2NvcmVzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnYXZnLWNwdS1zeXN0ZW0nLFxuICAgICAgICAgICAgICBpZDogJ3Zhci1hdmcnLFxuICAgICAgICAgICAgICBuYW1lOiAnYXZnJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ3N0ZWFsJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnc3lzdGVtLmNwdS5zdGVhbC5wY3QnLFxuICAgICAgICAgIGlkOiAnYXZnLWNwdS1zdGVhbCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdzeXN0ZW0uY3B1LmNvcmVzJyxcbiAgICAgICAgICBpZDogJ21heC1jcHUtY29yZXMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnY2FsYy1hdmctY29yZXMnLFxuICAgICAgICAgIHNjcmlwdDogJ3BhcmFtcy5hdmcgLyBwYXJhbXMuY29yZXMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmNhbGN1bGF0aW9uLFxuICAgICAgICAgIHZhcmlhYmxlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDogJ2F2Zy1jcHUtc3RlYWwnLFxuICAgICAgICAgICAgICBpZDogJ3Zhci1hdmcnLFxuICAgICAgICAgICAgICBuYW1lOiAnYXZnJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnbWF4LWNwdS1jb3JlcycsXG4gICAgICAgICAgICAgIGlkOiAndmFyLWNvcmVzJyxcbiAgICAgICAgICAgICAgbmFtZTogJ2NvcmVzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ2lycScsXG4gICAgICBtZXRyaWNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ3N5c3RlbS5jcHUuaXJxLnBjdCcsXG4gICAgICAgICAgaWQ6ICdhdmctY3B1LWlycScsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdzeXN0ZW0uY3B1LmNvcmVzJyxcbiAgICAgICAgICBpZDogJ21heC1jcHUtY29yZXMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnY2FsYy1hdmctY29yZXMnLFxuICAgICAgICAgIHNjcmlwdDogJ3BhcmFtcy5hdmcgLyBwYXJhbXMuY29yZXMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmNhbGN1bGF0aW9uLFxuICAgICAgICAgIHZhcmlhYmxlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDogJ21heC1jcHUtY29yZXMnLFxuICAgICAgICAgICAgICBpZDogJ3Zhci1jb3JlcycsXG4gICAgICAgICAgICAgIG5hbWU6ICdjb3JlcycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDogJ2F2Zy1jcHUtaXJxJyxcbiAgICAgICAgICAgICAgaWQ6ICd2YXItYXZnJyxcbiAgICAgICAgICAgICAgbmFtZTogJ2F2ZycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdzb2Z0aXJxJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnc3lzdGVtLmNwdS5zb2Z0aXJxLnBjdCcsXG4gICAgICAgICAgaWQ6ICdhdmctY3B1LXNvZnRpcnEnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmF2ZyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnc3lzdGVtLmNwdS5jb3JlcycsXG4gICAgICAgICAgaWQ6ICdtYXgtY3B1LWNvcmVzJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5tYXgsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2NhbGMtYXZnLWNvcmVzJyxcbiAgICAgICAgICBzY3JpcHQ6ICdwYXJhbXMuYXZnIC8gcGFyYW1zLmNvcmVzJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5jYWxjdWxhdGlvbixcbiAgICAgICAgICB2YXJpYWJsZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdtYXgtY3B1LWNvcmVzJyxcbiAgICAgICAgICAgICAgaWQ6ICd2YXItY29yZXMnLFxuICAgICAgICAgICAgICBuYW1lOiAnY29yZXMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdhdmctY3B1LXNvZnRpcnEnLFxuICAgICAgICAgICAgICBpZDogJ3Zhci1hdmcnLFxuICAgICAgICAgICAgICBuYW1lOiAnYXZnJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ2lvd2FpdCcsXG4gICAgICBtZXRyaWNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ3N5c3RlbS5jcHUuaW93YWl0LnBjdCcsXG4gICAgICAgICAgaWQ6ICdhdmctY3B1LWlvd2FpdCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdzeXN0ZW0uY3B1LmNvcmVzJyxcbiAgICAgICAgICBpZDogJ21heC1jcHUtY29yZXMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnY2FsYy1hdmctY29yZXMnLFxuICAgICAgICAgIHNjcmlwdDogJ3BhcmFtcy5hdmcgLyBwYXJhbXMuY29yZXMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmNhbGN1bGF0aW9uLFxuICAgICAgICAgIHZhcmlhYmxlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDogJ21heC1jcHUtY29yZXMnLFxuICAgICAgICAgICAgICBpZDogJ3Zhci1jb3JlcycsXG4gICAgICAgICAgICAgIG5hbWU6ICdjb3JlcycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDogJ2F2Zy1jcHUtaW93YWl0JyxcbiAgICAgICAgICAgICAgaWQ6ICd2YXItYXZnJyxcbiAgICAgICAgICAgICAgbmFtZTogJ2F2ZycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICduaWNlJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnc3lzdGVtLmNwdS5uaWNlLnBjdCcsXG4gICAgICAgICAgaWQ6ICdhdmctY3B1LW5pY2UnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmF2ZyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnc3lzdGVtLmNwdS5jb3JlcycsXG4gICAgICAgICAgaWQ6ICdtYXgtY3B1LWNvcmVzJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5tYXgsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2NhbGMtYXZnLWNvcmVzJyxcbiAgICAgICAgICBzY3JpcHQ6ICdwYXJhbXMuYXZnIC8gcGFyYW1zLmNvcmVzJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5jYWxjdWxhdGlvbixcbiAgICAgICAgICB2YXJpYWJsZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdtYXgtY3B1LWNvcmVzJyxcbiAgICAgICAgICAgICAgaWQ6ICd2YXItY29yZXMnLFxuICAgICAgICAgICAgICBuYW1lOiAnY29yZXMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdhdmctY3B1LW5pY2UnLFxuICAgICAgICAgICAgICBpZDogJ3Zhci1hdmcnLFxuICAgICAgICAgICAgICBuYW1lOiAnYXZnJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgfSxcbiAgXSxcbn0pO1xuIl19