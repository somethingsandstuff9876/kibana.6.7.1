"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.hostSystemOverview = (timeField, indexPattern, interval) => ({
    id: 'hostSystemOverview',
    requires: ['system.cpu', 'system.memory', 'system.load', 'system.network'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'gauge',
    series: [
        {
            id: 'cpu',
            split_mode: 'everything',
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
                    field: 'system.cpu.system.pct',
                    id: 'avg-cpu-system',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
                {
                    id: 'calc-user-system-cores',
                    script: '(params.users + params.system) / params.cores',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'avg-cpu-user',
                            id: 'var-users',
                            name: 'users',
                        },
                        {
                            field: 'avg-cpu-system',
                            id: 'var-system',
                            name: 'system',
                        },
                        {
                            field: 'max-cpu-cores',
                            id: 'var-cores',
                            name: 'cores',
                        },
                    ],
                },
            ],
        },
        {
            id: 'load',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'system.load.5',
                    id: 'avg-load-5m',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
        },
        {
            id: 'memory',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'system.memory.actual.used.pct',
                    id: 'avg-memory-actual-used',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
        },
        {
            id: 'rx',
            split_mode: 'terms',
            terms_field: 'system.network.name',
            metrics: [
                {
                    field: 'system.network.in.bytes',
                    id: 'max-net-in',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'max-net-in',
                    id: 'deriv-max-net-in',
                    type: adapter_types_1.InfraMetricModelMetricType.derivative,
                    unit: '1s',
                },
                {
                    id: 'posonly-deriv-max-net-in',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [{ id: 'var-rate', name: 'rate', field: 'deriv-max-net-in' }],
                    script: 'params.rate > 0.0 ? params.rate : 0.0',
                },
                {
                    function: 'sum',
                    id: 'seriesagg-sum',
                    type: adapter_types_1.InfraMetricModelMetricType.series_agg,
                },
            ],
        },
        {
            id: 'tx',
            split_mode: 'terms',
            terms_field: 'system.network.name',
            metrics: [
                {
                    field: 'system.network.out.bytes',
                    id: 'max-net-out',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'max-net-out',
                    id: 'deriv-max-net-out',
                    type: adapter_types_1.InfraMetricModelMetricType.derivative,
                    unit: '1s',
                },
                {
                    id: 'posonly-deriv-max-net-out',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [{ id: 'var-rate', name: 'rate', field: 'deriv-max-net-out' }],
                    script: 'params.rate > 0.0 ? params.rate : 0.0',
                },
                {
                    function: 'sum',
                    id: 'seriesagg-sum',
                    type: adapter_types_1.InfraMetricModelMetricType.series_agg,
                },
            ],
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9ob3N0L2hvc3Rfc3lzdGVtX292ZXJ2aWV3LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL21ldHJpY3MvbW9kZWxzL2hvc3QvaG9zdF9zeXN0ZW1fb3ZlcnZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsdURBQTBGO0FBRTdFLFFBQUEsa0JBQWtCLEdBQTRCLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDakcsRUFBRSxFQUFFLG9CQUFvQjtJQUN4QixRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQztJQUMxRSxhQUFhLEVBQUUsWUFBWTtJQUMzQixRQUFRO0lBQ1IsVUFBVSxFQUFFLFNBQVM7SUFDckIsSUFBSSxFQUFFLE9BQU87SUFDYixNQUFNLEVBQUU7UUFDTjtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsVUFBVSxFQUFFLFlBQVk7WUFDeEIsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSxxQkFBcUI7b0JBQzVCLEVBQUUsRUFBRSxjQUFjO29CQUNsQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7Z0JBQ0Q7b0JBQ0UsS0FBSyxFQUFFLGtCQUFrQjtvQkFDekIsRUFBRSxFQUFFLGVBQWU7b0JBQ25CLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQztnQkFDRDtvQkFDRSxLQUFLLEVBQUUsdUJBQXVCO29CQUM5QixFQUFFLEVBQUUsZ0JBQWdCO29CQUNwQixJQUFJLEVBQUUsMENBQTBCLENB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QkFDbkIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFVBQVU7aUJBQzVDO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5mcmFNZXRyaWNNb2RlbENyZWF0b3IsIEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlIH0gZnJvbSAnLi4vLi4vYWRhcHRlcl90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBob3N0U3lzdGVtT3ZlcnZpZXc6IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yID0gKHRpbWVGaWVsZCwgaW5kZXhQYXR0ZXJuLCBpbnRlcnZhbCkgPT4gKHtcbiAgaWQ6ICdob3N0U3lzdGVtT3ZlcnZpZXcnLFxuICByZXF1aXJlczogWydzeXN0ZW0uY3B1JywgJ3N5c3RlbS5tZW1vcnknLCAnc3lzdGVtLmxvYWQnLCAnc3lzdGVtLm5ldHdvcmsnXSxcbiAgaW5kZXhfcGF0dGVybjogaW5kZXhQYXR0ZXJuLFxuICBpbnRlcnZhbCxcbiAgdGltZV9maWVsZDogdGltZUZpZWxkLFxuICB0eXBlOiAnZ2F1Z2UnLFxuICBzZXJpZXM6IFtcbiAgICB7XG4gICAgICBpZDogJ2NwdScsXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgICBtZXRyaWNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ3N5c3RlbS5jcHUudXNlci5wY3QnLFxuICAgICAgICAgIGlkOiAnYXZnLWNwdS11c2VyJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5hdmcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ3N5c3RlbS5jcHUuY29yZXMnLFxuICAgICAgICAgIGlkOiAnbWF4LWNwdS1jb3JlcycsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUubWF4LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdzeXN0ZW0uY3B1LnN5c3RlbS5wY3QnLFxuICAgICAgICAgIGlkOiAnYXZnLWNwdS1zeXN0ZW0nLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmF2ZyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnY2FsYy11c2VyLXN5c3RlbS1jb3JlcycsXG4gICAgICAgICAgc2NyaXB0OiAnKHBhcmFtcy51c2VycyArIHBhcmFtcy5zeXN0ZW0pIC8gcGFyYW1zLmNvcmVzJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5jYWxjdWxhdGlvbixcbiAgICAgICAgICB2YXJpYWJsZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdhdmctY3B1LXVzZXInLFxuICAgICAgICAgICAgICBpZDogJ3Zhci11c2VycycsXG4gICAgICAgICAgICAgIG5hbWU6ICd1c2VycycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDogJ2F2Zy1jcHUtc3lzdGVtJyxcbiAgICAgICAgICAgICAgaWQ6ICd2YXItc3lzdGVtJyxcbiAgICAgICAgICAgICAgbmFtZTogJ3N5c3RlbScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDogJ21heC1jcHUtY29yZXMnLFxuICAgICAgICAgICAgICBpZDogJ3Zhci1jb3JlcycsXG4gICAgICAgICAgICAgIG5hbWU6ICdjb3JlcycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdsb2FkJyxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnc3lzdGVtLmxvYWQuNScsXG4gICAgICAgICAgaWQ6ICdhdmctbG9hZC01bScsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnbWVtb3J5JyxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnc3lzdGVtLm1lbW9yeS5hY3R1YWwudXNlZC5wY3QnLFxuICAgICAgICAgIGlkOiAnYXZnLW1lbW9yeS1hY3R1YWwtdXNlZCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAncngnLFxuICAgICAgc3BsaXRfbW9kZTogJ3Rlcm1zJyxcbiAgICAgIHRlcm1zX2ZpZWxkOiAnc3lzdGVtLm5ldHdvcmsubmFtZScsXG4gICAgICBtZXRyaWNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ3N5c3RlbS5uZXR3b3JrLmluLmJ5dGVzJyxcbiAgICAgICAgICBpZDogJ21heC1uZXQtaW4nLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnbWF4LW5ldC1pbicsXG4gICAgICAgICAgaWQ6ICdkZXJpdi1tYXgtbmV0LWluJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5kZXJpdmF0aXZlLFxuICAgICAgICAgIHVuaXQ6ICcxcycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ3Bvc29ubHktZGVyaXYtbWF4LW5ldC1pbicsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY2FsY3VsYXRpb24sXG4gICAgICAgICAgdmFyaWFibGVzOiBbeyBpZDogJ3Zhci1yYXRlJywgbmFtZTogJ3JhdGUnLCBmaWVsZDogJ2Rlcml2LW1heC1uZXQtaW4nIH1dLFxuICAgICAgICAgIHNjcmlwdDogJ3BhcmFtcy5yYXRlID4gMC4wID8gcGFyYW1zLnJhdGUgOiAwLjAnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZnVuY3Rpb246ICdzdW0nLFxuICAgICAgICAgIGlkOiAnc2VyaWVzYWdnLXN1bScsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuc2VyaWVzX2FnZyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ3R4JyxcbiAgICAgIHNwbGl0X21vZGU6ICd0ZXJtcycsXG4gICAgICB0ZXJtc19maWVsZDogJ3N5c3RlbS5uZXR3b3JrLm5hbWUnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdzeXN0ZW0ubmV0d29yay5vdXQuYnl0ZXMnLFxuICAgICAgICAgIGlkOiAnbWF4LW5ldC1vdXQnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnbWF4LW5ldC1vdXQnLFxuICAgICAgICAgIGlkOiAnZGVyaXYtbWF4LW5ldC1vdXQnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmRlcml2YXRpdmUsXG4gICAgICAgICAgdW5pdDogJzFzJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAncG9zb25seS1kZXJpdi1tYXgtbmV0LW91dCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY2FsY3VsYXRpb24sXG4gICAgICAgICAgdmFyaWFibGVzOiBbeyBpZDogJ3Zhci1yYXRlJywgbmFtZTogJ3JhdGUnLCBmaWVsZDogJ2Rlcml2LW1heC1uZXQtb3V0JyB9XSxcbiAgICAgICAgICBzY3JpcHQ6ICdwYXJhbXMucmF0ZSA+IDAuMCA/IHBhcmFtcy5yYXRlIDogMC4wJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZ1bmN0aW9uOiAnc3VtJyxcbiAgICAgICAgICBpZDogJ3Nlcmllc2FnZy1zdW0nLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLnNlcmllc19hZ2csXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59KTtcbiJdfQ==