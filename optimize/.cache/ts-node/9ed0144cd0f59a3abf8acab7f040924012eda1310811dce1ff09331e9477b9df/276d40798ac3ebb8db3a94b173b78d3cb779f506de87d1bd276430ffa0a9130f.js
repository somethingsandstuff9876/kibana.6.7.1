"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.containerDiskIOBytes = (timeField, indexPattern, interval) => ({
    id: 'containerDiskIOBytes',
    requires: ['docker.disk'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'read',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'docker.diskio.read.bytes',
                    id: 'max-diskio-read-bytes',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'max-diskio-read-bytes',
                    id: 'deriv-max-diskio-read-bytes',
                    type: adapter_types_1.InfraMetricModelMetricType.derivative,
                    unit: '1s',
                },
                {
                    id: 'posonly-deriv-max-diskio-read-bytes',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [{ id: 'var-rate', name: 'rate', field: 'deriv-max-diskio-read-bytes' }],
                    script: 'params.rate > 0.0 ? params.rate : 0.0',
                },
            ],
        },
        {
            id: 'write',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'docker.diskio.write.bytes',
                    id: 'max-diskio-write-bytes',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'max-diskio-write-bytes',
                    id: 'deriv-max-diskio-write-bytes',
                    type: adapter_types_1.InfraMetricModelMetricType.derivative,
                    unit: '1s',
                },
                {
                    id: 'posonly-deriv-max-diskio-write-bytes',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [{ id: 'var-rate', name: 'rate', field: 'deriv-max-diskio-write-bytes' }],
                    script: 'params.rate > 0.0 ? params.rate : 0.0',
                },
                {
                    id: 'calc-invert-rate',
                    script: 'params.rate * -1',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'posonly-deriv-max-diskio-write-bytes',
                            id: 'var-rate',
                            name: 'rate',
                        },
                    ],
                },
            ],
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9jb250YWluZXIvY29udGFpbmVyX2Rpc2tfaW9fYnl0ZXMudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvYWRhcHRlcnMvbWV0cmljcy9tb2RlbHMvY29udGFpbmVyL2NvbnRhaW5lcl9kaXNrX2lvX2J5dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILHVEQUEwRjtBQUU3RSxRQUFBLG9CQUFvQixHQUE0QixDQUMzRCxTQUFTLEVBQ1QsWUFBWSxFQUNaLFFBQVEsRUFDUixFQUFFLENBQUMsQ0FBQztJQUNKLEVBQUUsRUFBRSxzQkFBc0I7SUFDMUIsUUFBUSxFQUFFLENBQUMsYUFBYSxDQUFDO0lBQ3pCLGFBQWEsRUFBRSxZQUFZO0lBQzNCLFFBQVE7SUFDUixVQUFVLEVBQUUsU0FBUztJQUNyQixJQUFJLEVBQUUsWUFBWTtJQUNsQixNQUFNLEVBQUU7UUFDTjtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsVUFBVSxFQUFFLFlBQVk7WUFDeEIsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSwwQkFBMEI7b0JBQ2pDLEVBQUUsRUFBRSx1QkFBdUI7b0JBQzNCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQztnQkFDRDtvQkFDRSxLQUFLLEVBQUUsdUJBQXVCO29CQUM5QixFQUFFLEVBQUUsNkJBQTZCO29CQUNqQyxJQUFJLEVBQUUsMENBQTBCLENBQUMsVUFBVTtvQkFDM0MsSUFBSSxFQUFFLElBQUk7aUJBQ1g7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLHFDQUFxQztvQkFDekMsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFdBQVc7b0JBQzVDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSw2QkFBNkIsRUFBRSxDQUFDO29CQUNuRixNQUFNLEVBQUUsdUNBQXVDO2lCQUNoRDthQUNGO1NBQ0Y7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsVUFBVSxFQUFFLFlBQVk7WUFDeEIsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSwyQkFBMkI7b0JBQ2xDLEVBQUUsRUFBRSx3QkFBd0I7b0JBQzVCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQztnQkFDRDtvQkFDRSxLQUFLLEVBQUUsd0JBQXdCO29CQUMvQixFQUFFLEVBQUUsOEJBQThCO29CQUNsQyxJQUFJLEVBQUUsMENBQTBCLENBQUMsVUFBVTtvQkFDM0MsSUFBSSxFQUFFLElBQUk7aUJBQ1g7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLHNDQUFzQztvQkFDMUMsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFdBQVc7b0JBQzVDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSw4QkFBOEIsRUFBRSxDQUFDO29CQUNwRixNQUFNLEVBQUUsdUNBQXVDO2lCQUNoRDtnQkFDRDtvQkFDRSxFQUFFLEVBQUUsa0JBQWtCO29CQUN0QixNQUFNLEVBQUUsa0JBQWtCO29CQUMxQixJQUFJLEVBQUUsMENBQTBCLENBQUMsV0FBVztvQkFDNUMsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLEtBQUssRUFBRSxzQ0FBc0M7NEJBQzdDLEVBQUUsRUFBRSxVQUFVOzRCQUNkLElBQUksRUFBRSxNQUFNO3lCQUNiO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5mcmFNZXRyaWNNb2RlbENyZWF0b3IsIEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlIH0gZnJvbSAnLi4vLi4vYWRhcHRlcl90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBjb250YWluZXJEaXNrSU9CeXRlczogSW5mcmFNZXRyaWNNb2RlbENyZWF0b3IgPSAoXG4gIHRpbWVGaWVsZCxcbiAgaW5kZXhQYXR0ZXJuLFxuICBpbnRlcnZhbFxuKSA9PiAoe1xuICBpZDogJ2NvbnRhaW5lckRpc2tJT0J5dGVzJyxcbiAgcmVxdWlyZXM6IFsnZG9ja2VyLmRpc2snXSxcbiAgaW5kZXhfcGF0dGVybjogaW5kZXhQYXR0ZXJuLFxuICBpbnRlcnZhbCxcbiAgdGltZV9maWVsZDogdGltZUZpZWxkLFxuICB0eXBlOiAndGltZXNlcmllcycsXG4gIHNlcmllczogW1xuICAgIHtcbiAgICAgIGlkOiAncmVhZCcsXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgICBtZXRyaWNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ2RvY2tlci5kaXNraW8ucmVhZC5ieXRlcycsXG4gICAgICAgICAgaWQ6ICdtYXgtZGlza2lvLXJlYWQtYnl0ZXMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnbWF4LWRpc2tpby1yZWFkLWJ5dGVzJyxcbiAgICAgICAgICBpZDogJ2Rlcml2LW1heC1kaXNraW8tcmVhZC1ieXRlcycsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuZGVyaXZhdGl2ZSxcbiAgICAgICAgICB1bml0OiAnMXMnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdwb3Nvbmx5LWRlcml2LW1heC1kaXNraW8tcmVhZC1ieXRlcycsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY2FsY3VsYXRpb24sXG4gICAgICAgICAgdmFyaWFibGVzOiBbeyBpZDogJ3Zhci1yYXRlJywgbmFtZTogJ3JhdGUnLCBmaWVsZDogJ2Rlcml2LW1heC1kaXNraW8tcmVhZC1ieXRlcycgfV0sXG4gICAgICAgICAgc2NyaXB0OiAncGFyYW1zLnJhdGUgPiAwLjAgPyBwYXJhbXMucmF0ZSA6IDAuMCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICd3cml0ZScsXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgICBtZXRyaWNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ2RvY2tlci5kaXNraW8ud3JpdGUuYnl0ZXMnLFxuICAgICAgICAgIGlkOiAnbWF4LWRpc2tpby13cml0ZS1ieXRlcycsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUubWF4LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdtYXgtZGlza2lvLXdyaXRlLWJ5dGVzJyxcbiAgICAgICAgICBpZDogJ2Rlcml2LW1heC1kaXNraW8td3JpdGUtYnl0ZXMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmRlcml2YXRpdmUsXG4gICAgICAgICAgdW5pdDogJzFzJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAncG9zb25seS1kZXJpdi1tYXgtZGlza2lvLXdyaXRlLWJ5dGVzJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5jYWxjdWxhdGlvbixcbiAgICAgICAgICB2YXJpYWJsZXM6IFt7IGlkOiAndmFyLXJhdGUnLCBuYW1lOiAncmF0ZScsIGZpZWxkOiAnZGVyaXYtbWF4LWRpc2tpby13cml0ZS1ieXRlcycgfV0sXG4gICAgICAgICAgc2NyaXB0OiAncGFyYW1zLnJhdGUgPiAwLjAgPyBwYXJhbXMucmF0ZSA6IDAuMCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2NhbGMtaW52ZXJ0LXJhdGUnLFxuICAgICAgICAgIHNjcmlwdDogJ3BhcmFtcy5yYXRlICogLTEnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmNhbGN1bGF0aW9uLFxuICAgICAgICAgIHZhcmlhYmxlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDogJ3Bvc29ubHktZGVyaXYtbWF4LWRpc2tpby13cml0ZS1ieXRlcycsXG4gICAgICAgICAgICAgIGlkOiAndmFyLXJhdGUnLFxuICAgICAgICAgICAgICBuYW1lOiAncmF0ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59KTtcbiJdfQ==