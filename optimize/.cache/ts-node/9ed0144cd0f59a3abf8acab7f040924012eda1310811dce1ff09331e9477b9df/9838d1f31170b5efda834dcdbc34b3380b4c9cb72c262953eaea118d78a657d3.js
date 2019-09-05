"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.hostK8sCpuCap = (timeField, indexPattern, interval) => ({
    id: 'hostK8sCpuCap',
    map_field_to: 'kubernetes.node.name',
    requires: ['kubernetes.node'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'capacity',
            metrics: [
                {
                    field: 'kubernetes.node.cpu.allocatable.cores',
                    id: 'max-cpu-cap',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    id: 'calc-nanocores',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            id: 'var-cores',
                            field: 'max-cpu-cap',
                            name: 'cores',
                        },
                    ],
                    script: 'params.cores * 1000000000',
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'used',
            metrics: [
                {
                    field: 'kubernetes.node.cpu.usage.nanocores',
                    id: 'avg-cpu-usage',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
            split_mode: 'everything',
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9ob3N0L2hvc3RfazhzX2NwdV9jYXAudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvYWRhcHRlcnMvbWV0cmljcy9tb2RlbHMvaG9zdC9ob3N0X2s4c19jcHVfY2FwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILHVEQUEwRjtBQUU3RSxRQUFBLGFBQWEsR0FBNEIsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM1RixFQUFFLEVBQUUsZUFBZTtJQUNuQixZQUFZLEVBQUUsc0JBQXNCO0lBQ3BDLFFBQVEsRUFBRSxDQUFDLGlCQUFpQixDQUFDO0lBQzdCLGFBQWEsRUFBRSxZQUFZO0lBQzNCLFFBQVE7SUFDUixVQUFVLEVBQUUsU0FBUztJQUNyQixJQUFJLEVBQUUsWUFBWTtJQUNsQixNQUFNLEVBQUU7UUFDTjtZQUNFLEVBQUUsRUFBRSxVQUFVO1lBQ2QsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSx1Q0FBdUM7b0JBQzlDLEVBQUUsRUFBRSxhQUFhO29CQUNqQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLGdCQUFnQjtvQkFDcEIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFdBQVc7b0JBQzVDLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxFQUFFLEVBQUUsV0FBVzs0QkFDZixLQUFLLEVBQUUsYUFBYTs0QkFDcEIsSUFBSSxFQUFFLE9BQU87eUJBQ2Q7cUJBQ0Y7b0JBQ0QsTUFBTSxFQUFFLDJCQUEyQjtpQkFDcEM7YUFDRjtZQUNELFVBQVUsRUFBRSxZQUFZO1NBQ3pCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsTUFBTTtZQUNWLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUscUNBQXFDO29CQUM1QyxFQUFFLEVBQUUsZUFBZTtvQkFDbkIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLEdBQUc7aUJBQ3JDO2FBQ0Y7WUFDRCxVQUFVLEVBQUUsWUFBWTtTQUN6QjtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5mcmFNZXRyaWNNb2RlbENyZWF0b3IsIEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlIH0gZnJvbSAnLi4vLi4vYWRhcHRlcl90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBob3N0SzhzQ3B1Q2FwOiBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciA9ICh0aW1lRmllbGQsIGluZGV4UGF0dGVybiwgaW50ZXJ2YWwpID0+ICh7XG4gIGlkOiAnaG9zdEs4c0NwdUNhcCcsXG4gIG1hcF9maWVsZF90bzogJ2t1YmVybmV0ZXMubm9kZS5uYW1lJyxcbiAgcmVxdWlyZXM6IFsna3ViZXJuZXRlcy5ub2RlJ10sXG4gIGluZGV4X3BhdHRlcm46IGluZGV4UGF0dGVybixcbiAgaW50ZXJ2YWwsXG4gIHRpbWVfZmllbGQ6IHRpbWVGaWVsZCxcbiAgdHlwZTogJ3RpbWVzZXJpZXMnLFxuICBzZXJpZXM6IFtcbiAgICB7XG4gICAgICBpZDogJ2NhcGFjaXR5JyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAna3ViZXJuZXRlcy5ub2RlLmNwdS5hbGxvY2F0YWJsZS5jb3JlcycsXG4gICAgICAgICAgaWQ6ICdtYXgtY3B1LWNhcCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUubWF4LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdjYWxjLW5hbm9jb3JlcycsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY2FsY3VsYXRpb24sXG4gICAgICAgICAgdmFyaWFibGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiAndmFyLWNvcmVzJyxcbiAgICAgICAgICAgICAgZmllbGQ6ICdtYXgtY3B1LWNhcCcsXG4gICAgICAgICAgICAgIG5hbWU6ICdjb3JlcycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgc2NyaXB0OiAncGFyYW1zLmNvcmVzICogMTAwMDAwMDAwMCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICd1c2VkJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAna3ViZXJuZXRlcy5ub2RlLmNwdS51c2FnZS5uYW5vY29yZXMnLFxuICAgICAgICAgIGlkOiAnYXZnLWNwdS11c2FnZScsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICB9LFxuICBdLFxufSk7XG4iXX0=