"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.podOverview = (timeField, indexPattern, interval) => ({
    id: 'podOverview',
    requires: ['kubernetes.pod'],
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
                    field: 'kubernetes.pod.cpu.usage.node.pct',
                    id: 'avg-cpu-usage',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
        },
        {
            id: 'memory',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'kubernetes.pod.memory.usage.node.pct',
                    id: 'avg-memory-usage',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
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
                    id: 'posonly-deriv-max-network-rx',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [{ id: 'var-rate', name: 'rate', field: 'deriv-max-network-rx' }],
                    script: 'params.rate > 0.0 ? params.rate : 0.0',
                },
            ],
        },
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
                    id: 'posonly-deriv-max-network-tx',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [{ id: 'var-rate', name: 'rate', field: 'deriv-max-network-tx' }],
                    script: 'params.rate > 0.0 ? params.rate : 0.0',
                },
            ],
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9wb2QvcG9kX292ZXJ2aWV3LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL21ldHJpY3MvbW9kZWxzL3BvZC9wb2Rfb3ZlcnZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsdURBQTBGO0FBRTdFLFFBQUEsV0FBVyxHQUE0QixDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzFGLEVBQUUsRUFBRSxhQUFhO0lBQ2pCLFFBQVEsRUFBRSxDQUFDLGdCQUFnQixDQUFDO0lBQzVCLGFBQWEsRUFBRSxZQUFZO0lBQzNCLFFBQVE7SUFDUixVQUFVLEVBQUUsU0FBUztJQUNyQixJQUFJLEVBQUUsWUFBWTtJQUNsQixNQUFNLEVBQUU7UUFDTjtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsVUFBVSxFQUFFLFlBQVk7WUFDeEIsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSxtQ0FBbUM7b0JBQzFDLEVBQUUsRUFBRSxlQUFlO29CQUNuQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsUUFBUTtZQUNaLFVBQVUsRUFBRSxZQUFZO1lBQ3hCLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUsc0NBQXNDO29CQUM3QyxFQUFFLEVBQUUsa0JBQWtCO29CQUN0QixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsSUFBSTtZQUNSLFVBQVUsRUFBRSxZQUFZO1lBQ3hCLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUsaUNBQWlDO29CQUN4QyxFQUFFLEVBQUUsZ0JBQWdCO29CQUNwQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7Z0JBQ0Q7b0JBQ0UsS0FBSyxFQUFFLGdCQUFnQjtvQkFDdkIsRUFBRSxFQUFFLHNCQUFzQjtvQkFDMUIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFVBQVU7b0JBQzNDLElBQUksRUFBRSxJQUFJO2lCQUNYO2dCQUNEO29CQUNFLEVBQUUsRUFBRSw4QkFBOEI7b0JBQ2xDLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxXQUFXO29CQUM1QyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsc0JBQXNCLEVBQUUsQ0FBQztvQkFDNUUsTUFBTSxFQUFFLHVDQUF1QztpQkFDaEQ7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsSUFBSTtZQUNSLFVBQVUsRUFBRSxZQUFZO1lBQ3hCLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUsaUNBQWlDO29CQUN4QyxFQUFFLEVBQUUsZ0JBQWdCO29CQUNwQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7Z0JBQ0Q7b0JBQ0UsS0FBSyxFQUFFLGdCQUFnQjtvQkFDdkIsRUFBRSxFQUFFLHNCQUFzQjtvQkFDMUIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFVBQVU7b0JBQzNDLElBQUksRUFBRSxJQUFJO2lCQUNYO2dCQUNEO29CQUNFLEVBQUUsRUFBRSw4QkFBOEI7b0JBQ2xDLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxXQUFXO29CQUM1QyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsc0JBQXNCLEVBQUUsQ0FBQztvQkFDNUUsTUFBTSxFQUFFLHVDQUF1QztpQkFDaEQ7YUFDRjtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciwgSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUgfSBmcm9tICcuLi8uLi9hZGFwdGVyX3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IHBvZE92ZXJ2aWV3OiBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciA9ICh0aW1lRmllbGQsIGluZGV4UGF0dGVybiwgaW50ZXJ2YWwpID0+ICh7XG4gIGlkOiAncG9kT3ZlcnZpZXcnLFxuICByZXF1aXJlczogWydrdWJlcm5ldGVzLnBvZCddLFxuICBpbmRleF9wYXR0ZXJuOiBpbmRleFBhdHRlcm4sXG4gIGludGVydmFsLFxuICB0aW1lX2ZpZWxkOiB0aW1lRmllbGQsXG4gIHR5cGU6ICd0aW1lc2VyaWVzJyxcbiAgc2VyaWVzOiBbXG4gICAge1xuICAgICAgaWQ6ICdjcHUnLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdrdWJlcm5ldGVzLnBvZC5jcHUudXNhZ2Uubm9kZS5wY3QnLFxuICAgICAgICAgIGlkOiAnYXZnLWNwdS11c2FnZScsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnbWVtb3J5JyxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAna3ViZXJuZXRlcy5wb2QubWVtb3J5LnVzYWdlLm5vZGUucGN0JyxcbiAgICAgICAgICBpZDogJ2F2Zy1tZW1vcnktdXNhZ2UnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmF2ZyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ3J4JyxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAna3ViZXJuZXRlcy5wb2QubmV0d29yay5yeC5ieXRlcycsXG4gICAgICAgICAgaWQ6ICdtYXgtbmV0d29yay1yeCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUubWF4LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdtYXgtbmV0d29yay1yeCcsXG4gICAgICAgICAgaWQ6ICdkZXJpdi1tYXgtbmV0d29yay1yeCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuZGVyaXZhdGl2ZSxcbiAgICAgICAgICB1bml0OiAnMXMnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdwb3Nvbmx5LWRlcml2LW1heC1uZXR3b3JrLXJ4JyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5jYWxjdWxhdGlvbixcbiAgICAgICAgICB2YXJpYWJsZXM6IFt7IGlkOiAndmFyLXJhdGUnLCBuYW1lOiAncmF0ZScsIGZpZWxkOiAnZGVyaXYtbWF4LW5ldHdvcmstcngnIH1dLFxuICAgICAgICAgIHNjcmlwdDogJ3BhcmFtcy5yYXRlID4gMC4wID8gcGFyYW1zLnJhdGUgOiAwLjAnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAndHgnLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdrdWJlcm5ldGVzLnBvZC5uZXR3b3JrLnR4LmJ5dGVzJyxcbiAgICAgICAgICBpZDogJ21heC1uZXR3b3JrLXR4JyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5tYXgsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ21heC1uZXR3b3JrLXR4JyxcbiAgICAgICAgICBpZDogJ2Rlcml2LW1heC1uZXR3b3JrLXR4JyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5kZXJpdmF0aXZlLFxuICAgICAgICAgIHVuaXQ6ICcxcycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ3Bvc29ubHktZGVyaXYtbWF4LW5ldHdvcmstdHgnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmNhbGN1bGF0aW9uLFxuICAgICAgICAgIHZhcmlhYmxlczogW3sgaWQ6ICd2YXItcmF0ZScsIG5hbWU6ICdyYXRlJywgZmllbGQ6ICdkZXJpdi1tYXgtbmV0d29yay10eCcgfV0sXG4gICAgICAgICAgc2NyaXB0OiAncGFyYW1zLnJhdGUgPiAwLjAgPyBwYXJhbXMucmF0ZSA6IDAuMCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59KTtcbiJdfQ==