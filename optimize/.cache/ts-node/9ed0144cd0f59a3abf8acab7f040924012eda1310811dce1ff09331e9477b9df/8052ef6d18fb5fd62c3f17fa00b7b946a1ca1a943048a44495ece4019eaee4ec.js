"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.containerDiskIOOps = (timeField, indexPattern, interval) => ({
    id: 'containerDiskIOOps',
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
                    field: 'docker.diskio.read.ops',
                    id: 'max-diskio-read-ops',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'max-diskio-read-ops',
                    id: 'deriv-max-diskio-read-ops',
                    type: adapter_types_1.InfraMetricModelMetricType.derivative,
                    unit: '1s',
                },
                {
                    id: 'posonly-deriv-max-diskio-read-ops',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [{ id: 'var-rate', name: 'rate', field: 'deriv-max-diskio-read-ops' }],
                    script: 'params.rate > 0.0 ? params.rate : 0.0',
                },
            ],
        },
        {
            id: 'write',
            split_mode: 'everything',
            metrics: [
                {
                    field: 'docker.diskio.write.ops',
                    id: 'max-diskio-write-ops',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'max-diskio-write-ops',
                    id: 'deriv-max-diskio-write-ops',
                    type: adapter_types_1.InfraMetricModelMetricType.derivative,
                    unit: '1s',
                },
                {
                    id: 'posonly-deriv-max-diskio-write-ops',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [{ id: 'var-rate', name: 'rate', field: 'deriv-max-diskio-write-ops' }],
                    script: 'params.rate > 0.0 ? params.rate : 0.0',
                },
                {
                    id: 'calc-invert-rate',
                    script: 'params.rate * -1',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'posonly-deriv-max-diskio-write-ops',
                            id: 'var-rate',
                            name: 'rate',
                        },
                    ],
                },
            ],
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9jb250YWluZXIvY29udGFpbmVyX2Rpc2tpb19vcHMudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvYWRhcHRlcnMvbWV0cmljcy9tb2RlbHMvY29udGFpbmVyL2NvbnRhaW5lcl9kaXNraW9fb3BzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILHVEQUEwRjtBQUU3RSxRQUFBLGtCQUFrQixHQUE0QixDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2pHLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsUUFBUSxFQUFFLENBQUMsYUFBYSxDQUFDO0lBQ3pCLGFBQWEsRUFBRSxZQUFZO0lBQzNCLFFBQVE7SUFDUixVQUFVLEVBQUUsU0FBUztJQUNyQixJQUFJLEVBQUUsWUFBWTtJQUNsQixNQUFNLEVBQUU7UUFDTjtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsVUFBVSxFQUFFLFlBQVk7WUFDeEIsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSx3QkFBd0I7b0JBQy9CLEVBQUUsRUFBRSxxQkFBcUI7b0JBQ3pCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQztnQkFDRDtvQkFDRSxLQUFLLEVBQUUscUJBQXFCO29CQUM1QixFQUFFLEVBQUUsMkJBQTJCO29CQUMvQixJQUFJLEVBQUUsMENBQTBCLENBQUMsVUFBVTtvQkFDM0MsSUFBSSxFQUFFLElBQUk7aUJBQ1g7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLG1DQUFtQztvQkFDdkMsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFdBQVc7b0JBQzVDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSwyQkFBMkIsRUFBRSxDQUFDO29CQUNqRixNQUFNLEVBQUUsdUNBQXVDO2lCQUNoRDthQUNGO1NBQ0Y7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsVUFBVSxFQUFFLFlBQVk7WUFDeEIsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSx5QkFBeUI7b0JBQ2hDLEVBQUUsRUFBRSxzQkFBc0I7b0JBQzFCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQztnQkFDRDtvQkFDRSxLQUFLLEVBQUUsc0JBQXNCO29CQUM3QixFQUFFLEVBQUUsNEJBQTRCO29CQUNoQyxJQUFJLEVBQUUsMENBQTBCLENBQUMsVUFBVTtvQkFDM0MsSUFBSSxFQUFFLElBQUk7aUJBQ1g7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLG9DQUFvQztvQkFDeEMsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFdBQVc7b0JBQzVDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSw0QkFBNEIsRUFBRSxDQUFDO29CQUNsRixNQUFNLEVBQUUsdUNBQXVDO2lCQUNoRDtnQkFDRDtvQkFDRSxFQUFFLEVBQUUsa0JBQWtCO29CQUN0QixNQUFNLEVBQUUsa0JBQWtCO29CQUMxQixJQUFJLEVBQUUsMENBQTBCLENBQUMsV0FBVztvQkFDNUMsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLEtBQUssRUFBRSxvQ0FBb0M7NEJBQzNDLEVBQUUsRUFBRSxVQUFVOzRCQUNkLElBQUksRUFBRSxNQUFNO3lCQUNiO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5mcmFNZXRyaWNNb2RlbENyZWF0b3IsIEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlIH0gZnJvbSAnLi4vLi4vYWRhcHRlcl90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBjb250YWluZXJEaXNrSU9PcHM6IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yID0gKHRpbWVGaWVsZCwgaW5kZXhQYXR0ZXJuLCBpbnRlcnZhbCkgPT4gKHtcbiAgaWQ6ICdjb250YWluZXJEaXNrSU9PcHMnLFxuICByZXF1aXJlczogWydkb2NrZXIuZGlzayddLFxuICBpbmRleF9wYXR0ZXJuOiBpbmRleFBhdHRlcm4sXG4gIGludGVydmFsLFxuICB0aW1lX2ZpZWxkOiB0aW1lRmllbGQsXG4gIHR5cGU6ICd0aW1lc2VyaWVzJyxcbiAgc2VyaWVzOiBbXG4gICAge1xuICAgICAgaWQ6ICdyZWFkJyxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnZG9ja2VyLmRpc2tpby5yZWFkLm9wcycsXG4gICAgICAgICAgaWQ6ICdtYXgtZGlza2lvLXJlYWQtb3BzJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5tYXgsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ21heC1kaXNraW8tcmVhZC1vcHMnLFxuICAgICAgICAgIGlkOiAnZGVyaXYtbWF4LWRpc2tpby1yZWFkLW9wcycsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuZGVyaXZhdGl2ZSxcbiAgICAgICAgICB1bml0OiAnMXMnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdwb3Nvbmx5LWRlcml2LW1heC1kaXNraW8tcmVhZC1vcHMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmNhbGN1bGF0aW9uLFxuICAgICAgICAgIHZhcmlhYmxlczogW3sgaWQ6ICd2YXItcmF0ZScsIG5hbWU6ICdyYXRlJywgZmllbGQ6ICdkZXJpdi1tYXgtZGlza2lvLXJlYWQtb3BzJyB9XSxcbiAgICAgICAgICBzY3JpcHQ6ICdwYXJhbXMucmF0ZSA+IDAuMCA/IHBhcmFtcy5yYXRlIDogMC4wJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ3dyaXRlJyxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnZG9ja2VyLmRpc2tpby53cml0ZS5vcHMnLFxuICAgICAgICAgIGlkOiAnbWF4LWRpc2tpby13cml0ZS1vcHMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnbWF4LWRpc2tpby13cml0ZS1vcHMnLFxuICAgICAgICAgIGlkOiAnZGVyaXYtbWF4LWRpc2tpby13cml0ZS1vcHMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmRlcml2YXRpdmUsXG4gICAgICAgICAgdW5pdDogJzFzJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAncG9zb25seS1kZXJpdi1tYXgtZGlza2lvLXdyaXRlLW9wcycsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY2FsY3VsYXRpb24sXG4gICAgICAgICAgdmFyaWFibGVzOiBbeyBpZDogJ3Zhci1yYXRlJywgbmFtZTogJ3JhdGUnLCBmaWVsZDogJ2Rlcml2LW1heC1kaXNraW8td3JpdGUtb3BzJyB9XSxcbiAgICAgICAgICBzY3JpcHQ6ICdwYXJhbXMucmF0ZSA+IDAuMCA/IHBhcmFtcy5yYXRlIDogMC4wJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnY2FsYy1pbnZlcnQtcmF0ZScsXG4gICAgICAgICAgc2NyaXB0OiAncGFyYW1zLnJhdGUgKiAtMScsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY2FsY3VsYXRpb24sXG4gICAgICAgICAgdmFyaWFibGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpZWxkOiAncG9zb25seS1kZXJpdi1tYXgtZGlza2lvLXdyaXRlLW9wcycsXG4gICAgICAgICAgICAgIGlkOiAndmFyLXJhdGUnLFxuICAgICAgICAgICAgICBuYW1lOiAncmF0ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59KTtcbiJdfQ==