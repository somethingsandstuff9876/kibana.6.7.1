"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.containerNetworkTraffic = (timeField, indexPattern, interval) => ({
    id: 'containerNetworkTraffic',
    requires: ['docker.network'],
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
                {
                    id: 'invert-posonly-deriv-max-network-in',
                    script: 'params.rate * -1',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'avg-network-in',
                            id: 'var-rate',
                            name: 'rate',
                        },
                    ],
                },
            ],
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9jb250YWluZXIvY29udGFpbmVyX25ldHdvcmtfdHJhZmZpYy50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9jb250YWluZXIvY29udGFpbmVyX25ldHdvcmtfdHJhZmZpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCx1REFBMEY7QUFFN0UsUUFBQSx1QkFBdUIsR0FBNEIsQ0FDOUQsU0FBUyxFQUNULFlBQVksRUFDWixRQUFRLEVBQ1IsRUFBRSxDQUFDLENBQUM7SUFDSixFQUFFLEVBQUUseUJBQXlCO0lBQzdCLFFBQVEsRUFBRSxDQUFDLGdCQUFnQixDQUFDO0lBQzVCLGFBQWEsRUFBRSxZQUFZO0lBQzNCLFFBQVE7SUFDUixVQUFVLEVBQUUsU0FBUztJQUNyQixJQUFJLEVBQUUsWUFBWTtJQUNsQixNQUFNLEVBQUU7UUFDTjtZQUNFLEVBQUUsRUFBRSxJQUFJO1lBQ1IsVUFBVSxFQUFFLFlBQVk7WUFDeEIsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSwwQkFBMEI7b0JBQ2pDLEVBQUUsRUFBRSxpQkFBaUI7b0JBQ3JCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQzthQUNGO1NBQ0Y7UUFDRDtZQUNFLEVBQUUsRUFBRSxJQUFJO1lBQ1IsVUFBVSxFQUFFLFlBQVk7WUFDeEIsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSx5QkFBeUI7b0JBQ2hDLEVBQUUsRUFBRSxnQkFBZ0I7b0JBQ3BCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQztnQkFDRDtvQkFDRSxFQUFFLEVBQUUscUNBQXFDO29CQUN6QyxNQUFNLEVBQUUsa0JBQWtCO29CQUMxQixJQUFJLEVBQUUsMENBQTBCLENBQUMsV0FBVztvQkFDNUMsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLEtBQUssRUFBRSxnQkFBZ0I7NEJBQ3ZCLEVBQUUsRUFBRSxVQUFVOzRCQUNkLElBQUksRUFBRSxNQUFNO3lCQUNiO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5mcmFNZXRyaWNNb2RlbENyZWF0b3IsIEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlIH0gZnJvbSAnLi4vLi4vYWRhcHRlcl90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBjb250YWluZXJOZXR3b3JrVHJhZmZpYzogSW5mcmFNZXRyaWNNb2RlbENyZWF0b3IgPSAoXG4gIHRpbWVGaWVsZCxcbiAgaW5kZXhQYXR0ZXJuLFxuICBpbnRlcnZhbFxuKSA9PiAoe1xuICBpZDogJ2NvbnRhaW5lck5ldHdvcmtUcmFmZmljJyxcbiAgcmVxdWlyZXM6IFsnZG9ja2VyLm5ldHdvcmsnXSxcbiAgaW5kZXhfcGF0dGVybjogaW5kZXhQYXR0ZXJuLFxuICBpbnRlcnZhbCxcbiAgdGltZV9maWVsZDogdGltZUZpZWxkLFxuICB0eXBlOiAndGltZXNlcmllcycsXG4gIHNlcmllczogW1xuICAgIHtcbiAgICAgIGlkOiAndHgnLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdkb2NrZXIubmV0d29yay5vdXQuYnl0ZXMnLFxuICAgICAgICAgIGlkOiAnYXZnLW5ldHdvcmstb3V0JyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5hdmcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdyeCcsXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgICBtZXRyaWNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ2RvY2tlci5uZXR3b3JrLmluLmJ5dGVzJyxcbiAgICAgICAgICBpZDogJ2F2Zy1uZXR3b3JrLWluJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5hdmcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2ludmVydC1wb3Nvbmx5LWRlcml2LW1heC1uZXR3b3JrLWluJyxcbiAgICAgICAgICBzY3JpcHQ6ICdwYXJhbXMucmF0ZSAqIC0xJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5jYWxjdWxhdGlvbixcbiAgICAgICAgICB2YXJpYWJsZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdhdmctbmV0d29yay1pbicsXG4gICAgICAgICAgICAgIGlkOiAndmFyLXJhdGUnLFxuICAgICAgICAgICAgICBuYW1lOiAncmF0ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59KTtcbiJdfQ==