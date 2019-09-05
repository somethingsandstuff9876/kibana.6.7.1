"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.podNetworkTraffic = (timeField, indexPattern, interval) => ({
    id: 'podNetworkTraffic',
    requires: ['kubernetes.pod'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'tx',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'kubernetes.pod.network.tx.bytes',
                    id: 'max-network-tx',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'max-network-tx',
                    id: 'deriv-max-network-tx',
                    type: adapter_types_1.InfraMetricModelMetricType.derivative,
                    unit: '1s',
                },
                {
                    id: 'posonly-deriv-max-net-tx',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [{ id: 'var-rate', name: 'rate', field: 'deriv-max-network-tx' }],
                    script: 'params.rate > 0.0 ? params.rate : 0.0',
                },
            ],
        },
        {
            id: 'rx',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'kubernetes.pod.network.rx.bytes',
                    id: 'max-network-rx',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'max-network-rx',
                    id: 'deriv-max-network-rx',
                    type: adapter_types_1.InfraMetricModelMetricType.derivative,
                    unit: '1s',
                },
                {
                    id: 'posonly-deriv-max-net-tx',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [{ id: 'var-rate', name: 'rate', field: 'deriv-max-network-tx' }],
                    script: 'params.rate > 0.0 ? params.rate : 0.0',
                },
                {
                    id: 'invert-posonly-deriv-max-network-rx',
                    script: 'params.rate * -1',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'posonly-deriv-max-network-rx',
                            id: 'var-rate',
                            name: 'rate',
                        },
                    ],
                },
            ],
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9wb2QvcG9kX25ldHdvcmtfdHJhZmZpYy50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9wb2QvcG9kX25ldHdvcmtfdHJhZmZpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCx1REFBMEY7QUFFN0UsUUFBQSxpQkFBaUIsR0FBNEIsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNoRyxFQUFFLEVBQUUsbUJBQW1CO0lBQ3ZCLFFBQVEsRUFBRSxDQUFDLGdCQUFnQixDQUFDO0lBQzVCLGFBQWEsRUFBRSxZQUFZO0lBQzNCLFFBQVE7SUFDUixVQUFVLEVBQUUsU0FBUztJQUNyQixJQUFJLEVBQUUsWUFBWTtJQUNsQixNQUFNLEVBQUU7UUFDTjtZQUNFLEVBQUUsRUFBRSxJQUFJO1lBQ1IsVUFBVSxFQUFFLFlBQVk7WUFDeEIsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSxpQ0FBaUM7b0JBQ3hDLEVBQUUsRUFBRSxnQkFBZ0I7b0JBQ3BCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQztnQkFDRDtvQkFDRSxLQUFLLEVBQUUsZ0JBQWdCO29CQUN2QixFQUFFLEVBQUUsc0JBQXNCO29CQUMxQixJQUFJLEVBQUUsMENBQTBCLENBQUMsVUFBVTtvQkFDM0MsSUFBSSxFQUFFLElBQUk7aUJBQ1g7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLDBCQUEwQjtvQkFDOUIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFdBQVc7b0JBQzVDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxzQkFBc0IsRUFBRSxDQUFDO29CQUM1RSxNQUFNLEVBQUUsdUNBQXVDO2lCQUNoRDthQUNGO1NBQ0Y7UUFDRDtZQUNFLEVBQUUsRUFBRSxJQUFJO1lBQ1IsVUFBVSxFQUFFLFlBQVk7WUFDeEIsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSxpQ0FBaUM7b0JBQ3hDLEVBQUUsRUFBRSxnQkFBZ0I7b0JBQ3BCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQztnQkFDRDtvQkFDRSxLQUFLLEVBQUUsZ0JBQWdCO29CQUN2QixFQUFFLEVBQUUsc0JBQXNCO29CQUMxQixJQUFJLEVBQUUsMENBQTBCLENBQUMsVUFBVTtvQkFDM0MsSUFBSSxFQUFFLElBQUk7aUJBQ1g7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLDBCQUEwQjtvQkFDOUIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFdBQVc7b0JBQzVDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxzQkFBc0IsRUFBRSxDQUFDO29CQUM1RSxNQUFNLEVBQUUsdUNBQXVDO2lCQUNoRDtnQkFDRDtvQkFDRSxFQUFFLEVBQUUscUNBQXFDO29CQUN6QyxNQUFNLEVBQUUsa0JBQWtCO29CQUMxQixJQUFJLEVBQUUsMENBQTBCLENBQUMsV0FBVztvQkFDNUMsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLEtBQUssRUFBRSw4QkFBOEI7NEJBQ3JDLEVBQUUsRUFBRSxVQUFVOzRCQUNkLElBQUksRUFBRSxNQUFNO3lCQUNiO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5mcmFNZXRyaWNNb2RlbENyZWF0b3IsIEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlIH0gZnJvbSAnLi4vLi4vYWRhcHRlcl90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBwb2ROZXR3b3JrVHJhZmZpYzogSW5mcmFNZXRyaWNNb2RlbENyZWF0b3IgPSAodGltZUZpZWxkLCBpbmRleFBhdHRlcm4sIGludGVydmFsKSA9PiAoe1xuICBpZDogJ3BvZE5ldHdvcmtUcmFmZmljJyxcbiAgcmVxdWlyZXM6IFsna3ViZXJuZXRlcy5wb2QnXSxcbiAgaW5kZXhfcGF0dGVybjogaW5kZXhQYXR0ZXJuLFxuICBpbnRlcnZhbCxcbiAgdGltZV9maWVsZDogdGltZUZpZWxkLFxuICB0eXBlOiAndGltZXNlcmllcycsXG4gIHNlcmllczogW1xuICAgIHtcbiAgICAgIGlkOiAndHgnLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdrdWJlcm5ldGVzLnBvZC5uZXR3b3JrLnR4LmJ5dGVzJyxcbiAgICAgICAgICBpZDogJ21heC1uZXR3b3JrLXR4JyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5tYXgsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ21heC1uZXR3b3JrLXR4JyxcbiAgICAgICAgICBpZDogJ2Rlcml2LW1heC1uZXR3b3JrLXR4JyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5kZXJpdmF0aXZlLFxuICAgICAgICAgIHVuaXQ6ICcxcycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ3Bvc29ubHktZGVyaXYtbWF4LW5ldC10eCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY2FsY3VsYXRpb24sXG4gICAgICAgICAgdmFyaWFibGVzOiBbeyBpZDogJ3Zhci1yYXRlJywgbmFtZTogJ3JhdGUnLCBmaWVsZDogJ2Rlcml2LW1heC1uZXR3b3JrLXR4JyB9XSxcbiAgICAgICAgICBzY3JpcHQ6ICdwYXJhbXMucmF0ZSA+IDAuMCA/IHBhcmFtcy5yYXRlIDogMC4wJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ3J4JyxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAna3ViZXJuZXRlcy5wb2QubmV0d29yay5yeC5ieXRlcycsXG4gICAgICAgICAgaWQ6ICdtYXgtbmV0d29yay1yeCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUubWF4LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdtYXgtbmV0d29yay1yeCcsXG4gICAgICAgICAgaWQ6ICdkZXJpdi1tYXgtbmV0d29yay1yeCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuZGVyaXZhdGl2ZSxcbiAgICAgICAgICB1bml0OiAnMXMnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdwb3Nvbmx5LWRlcml2LW1heC1uZXQtdHgnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmNhbGN1bGF0aW9uLFxuICAgICAgICAgIHZhcmlhYmxlczogW3sgaWQ6ICd2YXItcmF0ZScsIG5hbWU6ICdyYXRlJywgZmllbGQ6ICdkZXJpdi1tYXgtbmV0d29yay10eCcgfV0sXG4gICAgICAgICAgc2NyaXB0OiAncGFyYW1zLnJhdGUgPiAwLjAgPyBwYXJhbXMucmF0ZSA6IDAuMCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2ludmVydC1wb3Nvbmx5LWRlcml2LW1heC1uZXR3b3JrLXJ4JyxcbiAgICAgICAgICBzY3JpcHQ6ICdwYXJhbXMucmF0ZSAqIC0xJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5jYWxjdWxhdGlvbixcbiAgICAgICAgICB2YXJpYWJsZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdwb3Nvbmx5LWRlcml2LW1heC1uZXR3b3JrLXJ4JyxcbiAgICAgICAgICAgICAgaWQ6ICd2YXItcmF0ZScsXG4gICAgICAgICAgICAgIG5hbWU6ICdyYXRlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbn0pO1xuIl19