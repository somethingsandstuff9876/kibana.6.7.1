"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.containerOverview = (timeField, indexPattern, interval) => ({
    id: 'containerOverview',
    requires: ['docker'],
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
        {
            id: 'memory',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'docker.memory.usage.pct',
                    id: 'avg-memory',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
        },
        {
            id: 'tx',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'docker.network.out.bytes',
                    id: 'avg-network-out',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
        },
        {
            id: 'rx',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'docker.network.in.bytes',
                    id: 'avg-network-in',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9jb250YWluZXIvY29udGFpbmVyX292ZXJ2aWV3LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL21ldHJpY3MvbW9kZWxzL2NvbnRhaW5lci9jb250YWluZXJfb3ZlcnZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsdURBQTBGO0FBRTdFLFFBQUEsaUJBQWlCLEdBQTRCLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEcsRUFBRSxFQUFFLG1CQUFtQjtJQUN2QixRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUM7SUFDcEIsYUFBYSxFQUFFLFlBQVk7SUFDM0IsUUFBUTtJQUNSLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLElBQUksRUFBRSxZQUFZO0lBQ2xCLE1BQU0sRUFBRTtRQUNOO1lBQ0UsRUFBRSxFQUFFLEtBQUs7WUFDVCxVQUFVLEVBQUUsWUFBWTtZQUN4QixPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsS0FBSyxFQUFFLHNCQUFzQjtvQkFDN0IsRUFBRSxFQUFFLGVBQWU7b0JBQ25CLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQzthQUNGO1NBQ0Y7UUFDRDtZQUNFLEVBQUUsRUFBRSxRQUFRO1lBQ1osVUFBVSxFQUFFLFlBQVk7WUFDeEIsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSx5QkFBeUI7b0JBQ2hDLEVBQUUsRUFBRSxZQUFZO29CQUNoQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsSUFBSTtZQUNSLFVBQVUsRUFBRSxZQUFZO1lBQ3hCLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUsMEJBQTBCO29CQUNqQyxFQUFFLEVBQUUsaUJBQWlCO29CQUNyQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsSUFBSTtZQUNSLFVBQVUsRUFBRSxZQUFZO1lBQ3hCLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUseUJBQXlCO29CQUNoQyxFQUFFLEVBQUUsZ0JBQWdCO29CQUNwQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7YUFDRjtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciwgSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUgfSBmcm9tICcuLi8uLi9hZGFwdGVyX3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IGNvbnRhaW5lck92ZXJ2aWV3OiBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciA9ICh0aW1lRmllbGQsIGluZGV4UGF0dGVybiwgaW50ZXJ2YWwpID0+ICh7XG4gIGlkOiAnY29udGFpbmVyT3ZlcnZpZXcnLFxuICByZXF1aXJlczogWydkb2NrZXInXSxcbiAgaW5kZXhfcGF0dGVybjogaW5kZXhQYXR0ZXJuLFxuICBpbnRlcnZhbCxcbiAgdGltZV9maWVsZDogdGltZUZpZWxkLFxuICB0eXBlOiAndGltZXNlcmllcycsXG4gIHNlcmllczogW1xuICAgIHtcbiAgICAgIGlkOiAnY3B1JyxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnZG9ja2VyLmNwdS50b3RhbC5wY3QnLFxuICAgICAgICAgIGlkOiAnYXZnLWNwdS10b3RhbCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnbWVtb3J5JyxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnZG9ja2VyLm1lbW9yeS51c2FnZS5wY3QnLFxuICAgICAgICAgIGlkOiAnYXZnLW1lbW9yeScsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAndHgnLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdkb2NrZXIubmV0d29yay5vdXQuYnl0ZXMnLFxuICAgICAgICAgIGlkOiAnYXZnLW5ldHdvcmstb3V0JyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5hdmcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdyeCcsXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgICBtZXRyaWNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ2RvY2tlci5uZXR3b3JrLmluLmJ5dGVzJyxcbiAgICAgICAgICBpZDogJ2F2Zy1uZXR3b3JrLWluJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5hdmcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59KTtcbiJdfQ==