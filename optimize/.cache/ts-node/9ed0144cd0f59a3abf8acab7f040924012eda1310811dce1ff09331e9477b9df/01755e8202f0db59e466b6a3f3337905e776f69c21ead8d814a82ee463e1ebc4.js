"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.hostMemoryUsage = (timeField, indexPattern, interval) => ({
    id: 'hostMemoryUsage',
    requires: ['system.memory'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'free',
            metrics: [
                {
                    field: 'system.memory.free',
                    id: 'avg-memory-free',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'used',
            metrics: [
                {
                    field: 'system.memory.actual.used.bytes',
                    id: 'avg-memory-used',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
            ],
            split_mode: 'everything',
        },
        {
            id: 'cache',
            metrics: [
                {
                    field: 'system.memory.actual.used.bytes',
                    id: 'avg-memory-actual-used',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
                {
                    field: 'system.memory.used.bytes',
                    id: 'avg-memory-used',
                    type: adapter_types_1.InfraMetricModelMetricType.avg,
                },
                {
                    id: 'calc-used-actual',
                    script: 'params.used - params.actual',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [
                        {
                            field: 'avg-memory-actual-used',
                            id: 'var-actual',
                            name: 'actual',
                        },
                        {
                            field: 'avg-memory-used',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9ob3N0L2hvc3RfbWVtb3J5X3VzYWdlLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL21ldHJpY3MvbW9kZWxzL2hvc3QvaG9zdF9tZW1vcnlfdXNhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsdURBQTBGO0FBRTdFLFFBQUEsZUFBZSxHQUE0QixDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzlGLEVBQUUsRUFBRSxpQkFBaUI7SUFDckIsUUFBUSxFQUFFLENBQUMsZUFBZSxDQUFDO0lBQzNCLGFBQWEsRUFBRSxZQUFZO0lBQzNCLFFBQVE7SUFDUixVQUFVLEVBQUUsU0FBUztJQUNyQixJQUFJLEVBQUUsWUFBWTtJQUNsQixNQUFNLEVBQUU7UUFDTjtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSxvQkFBb0I7b0JBQzNCLEVBQUUsRUFBRSxpQkFBaUI7b0JBQ3JCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQzthQUNGO1lBQ0QsVUFBVSxFQUFFLFlBQVk7U0FDekI7UUFDRDtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSxpQ0FBaUM7b0JBQ3hDLEVBQUUsRUFBRSxpQkFBaUI7b0JBQ3JCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQzthQUNGO1lBQ0QsVUFBVSxFQUFFLFlBQVk7U0FDekI7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSxpQ0FBaUM7b0JBQ3hDLEVBQUUsRUFBRSx3QkFBd0I7b0JBQzVCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQztnQkFDRDtvQkFDRSxLQUFLLEVBQUUsMEJBQTBCO29CQUNqQyxFQUFFLEVBQUUsaUJBQWlCO29CQUNyQixJQUFJLEVBQUUsMENBQTBCLENBQUMsR0FBRztpQkFDckM7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLGtCQUFrQjtvQkFDdEIsTUFBTSxFQUFFLDZCQUE2QjtvQkFDckMsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFdBQVc7b0JBQzVDLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxLQUFLLEVBQUUsd0JBQXdCOzRCQUMvQixFQUFFLEVBQUUsWUFBWTs0QkFDaEIsSUFBSSxFQUFFLFFBQVE7eUJBQ2Y7d0JBQ0Q7NEJBQ0UsS0FBSyxFQUFFLGlCQUFpQjs0QkFDeEIsRUFBRSxFQUFFLFVBQVU7NEJBQ2QsSUFBSSxFQUFFLE1BQU07eUJBQ2I7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELFVBQVUsRUFBRSxZQUFZO1NBQ3pCO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciwgSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUgfSBmcm9tICcuLi8uLi9hZGFwdGVyX3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IGhvc3RNZW1vcnlVc2FnZTogSW5mcmFNZXRyaWNNb2RlbENyZWF0b3IgPSAodGltZUZpZWxkLCBpbmRleFBhdHRlcm4sIGludGVydmFsKSA9PiAoe1xuICBpZDogJ2hvc3RNZW1vcnlVc2FnZScsXG4gIHJlcXVpcmVzOiBbJ3N5c3RlbS5tZW1vcnknXSxcbiAgaW5kZXhfcGF0dGVybjogaW5kZXhQYXR0ZXJuLFxuICBpbnRlcnZhbCxcbiAgdGltZV9maWVsZDogdGltZUZpZWxkLFxuICB0eXBlOiAndGltZXNlcmllcycsXG4gIHNlcmllczogW1xuICAgIHtcbiAgICAgIGlkOiAnZnJlZScsXG4gICAgICBtZXRyaWNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZDogJ3N5c3RlbS5tZW1vcnkuZnJlZScsXG4gICAgICAgICAgaWQ6ICdhdmctbWVtb3J5LWZyZWUnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmF2ZyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ3VzZWQnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdzeXN0ZW0ubWVtb3J5LmFjdHVhbC51c2VkLmJ5dGVzJyxcbiAgICAgICAgICBpZDogJ2F2Zy1tZW1vcnktdXNlZCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHNwbGl0X21vZGU6ICdldmVyeXRoaW5nJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnY2FjaGUnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGQ6ICdzeXN0ZW0ubWVtb3J5LmFjdHVhbC51c2VkLmJ5dGVzJyxcbiAgICAgICAgICBpZDogJ2F2Zy1tZW1vcnktYWN0dWFsLXVzZWQnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmF2ZyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnc3lzdGVtLm1lbW9yeS51c2VkLmJ5dGVzJyxcbiAgICAgICAgICBpZDogJ2F2Zy1tZW1vcnktdXNlZCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuYXZnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdjYWxjLXVzZWQtYWN0dWFsJyxcbiAgICAgICAgICBzY3JpcHQ6ICdwYXJhbXMudXNlZCAtIHBhcmFtcy5hY3R1YWwnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmNhbGN1bGF0aW9uLFxuICAgICAgICAgIHZhcmlhYmxlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDogJ2F2Zy1tZW1vcnktYWN0dWFsLXVzZWQnLFxuICAgICAgICAgICAgICBpZDogJ3Zhci1hY3R1YWwnLFxuICAgICAgICAgICAgICBuYW1lOiAnYWN0dWFsJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnYXZnLW1lbW9yeS11c2VkJyxcbiAgICAgICAgICAgICAgaWQ6ICd2YXItdXNlZCcsXG4gICAgICAgICAgICAgIG5hbWU6ICd1c2VkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBzcGxpdF9tb2RlOiAnZXZlcnl0aGluZycsXG4gICAgfSxcbiAgXSxcbn0pO1xuIl19