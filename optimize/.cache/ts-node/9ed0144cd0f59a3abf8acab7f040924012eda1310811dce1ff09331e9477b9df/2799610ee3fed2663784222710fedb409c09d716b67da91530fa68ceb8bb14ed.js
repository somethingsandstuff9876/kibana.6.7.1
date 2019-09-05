"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.nginxHits = (timeField, indexPattern, interval) => ({
    id: 'nginxHits',
    requires: ['nginx.access'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: '200s',
            metrics: [
                {
                    id: 'count-200',
                    type: adapter_types_1.InfraMetricModelMetricType.count,
                },
            ],
            split_mode: 'filter',
            filter: 'nginx.access.response_code:[200 TO 299]',
        },
        {
            id: '300s',
            metrics: [
                {
                    id: 'count-300',
                    type: adapter_types_1.InfraMetricModelMetricType.count,
                },
            ],
            split_mode: 'filter',
            filter: 'nginx.access.response_code:[300 TO 399]',
        },
        {
            id: '400s',
            metrics: [
                {
                    id: 'count-400',
                    type: adapter_types_1.InfraMetricModelMetricType.count,
                },
            ],
            split_mode: 'filter',
            filter: 'nginx.access.response_code:[400 TO 499]',
        },
        {
            id: '500s',
            metrics: [
                {
                    id: 'count-500',
                    type: adapter_types_1.InfraMetricModelMetricType.count,
                },
            ],
            split_mode: 'filter',
            filter: 'nginx.access.response_code:[500 TO 599]',
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9uZ2lueC9uZ2lueF9oaXRzLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL21ldHJpY3MvbW9kZWxzL25naW54L25naW54X2hpdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsdURBQTBGO0FBRTdFLFFBQUEsU0FBUyxHQUE0QixDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hGLEVBQUUsRUFBRSxXQUFXO0lBQ2YsUUFBUSxFQUFFLENBQUMsY0FBYyxDQUFDO0lBQzFCLGFBQWEsRUFBRSxZQUFZO0lBQzNCLFFBQVE7SUFDUixVQUFVLEVBQUUsU0FBUztJQUNyQixJQUFJLEVBQUUsWUFBWTtJQUNsQixNQUFNLEVBQUU7UUFDTjtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEVBQUUsRUFBRSxXQUFXO29CQUNmLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxLQUFLO2lCQUN2QzthQUNGO1lBQ0QsVUFBVSxFQUFFLFFBQVE7WUFDcEIsTUFBTSxFQUFFLHlDQUF5QztTQUNsRDtRQUNEO1lBQ0UsRUFBRSxFQUFFLE1BQU07WUFDVixPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsRUFBRSxFQUFFLFdBQVc7b0JBQ2YsSUFBSSxFQUFFLDBDQUEwQixDQUFDLEtBQUs7aUJBQ3ZDO2FBQ0Y7WUFDRCxVQUFVLEVBQUUsUUFBUTtZQUNwQixNQUFNLEVBQUUseUNBQXlDO1NBQ2xEO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsTUFBTTtZQUNWLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxFQUFFLEVBQUUsV0FBVztvQkFDZixJQUFJLEVBQUUsMENBQTBCLENBQUMsS0FBSztpQkFDdkM7YUFDRjtZQUNELFVBQVUsRUFBRSxRQUFRO1lBQ3BCLE1BQU0sRUFBRSx5Q0FBeUM7U0FDbEQ7UUFDRDtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEVBQUUsRUFBRSxXQUFXO29CQUNmLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxLQUFLO2lCQUN2QzthQUNGO1lBQ0QsVUFBVSxFQUFFLFFBQVE7WUFDcEIsTUFBTSxFQUFFLHlDQUF5QztTQUNsRDtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5mcmFNZXRyaWNNb2RlbENyZWF0b3IsIEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlIH0gZnJvbSAnLi4vLi4vYWRhcHRlcl90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBuZ2lueEhpdHM6IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yID0gKHRpbWVGaWVsZCwgaW5kZXhQYXR0ZXJuLCBpbnRlcnZhbCkgPT4gKHtcbiAgaWQ6ICduZ2lueEhpdHMnLFxuICByZXF1aXJlczogWyduZ2lueC5hY2Nlc3MnXSxcbiAgaW5kZXhfcGF0dGVybjogaW5kZXhQYXR0ZXJuLFxuICBpbnRlcnZhbCxcbiAgdGltZV9maWVsZDogdGltZUZpZWxkLFxuICB0eXBlOiAndGltZXNlcmllcycsXG4gIHNlcmllczogW1xuICAgIHtcbiAgICAgIGlkOiAnMjAwcycsXG4gICAgICBtZXRyaWNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2NvdW50LTIwMCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY291bnQsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgc3BsaXRfbW9kZTogJ2ZpbHRlcicsXG4gICAgICBmaWx0ZXI6ICduZ2lueC5hY2Nlc3MucmVzcG9uc2VfY29kZTpbMjAwIFRPIDI5OV0nLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICczMDBzJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnY291bnQtMzAwJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5jb3VudCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBzcGxpdF9tb2RlOiAnZmlsdGVyJyxcbiAgICAgIGZpbHRlcjogJ25naW54LmFjY2Vzcy5yZXNwb25zZV9jb2RlOlszMDAgVE8gMzk5XScsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJzQwMHMnLFxuICAgICAgbWV0cmljczogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdjb3VudC00MDAnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmNvdW50LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHNwbGl0X21vZGU6ICdmaWx0ZXInLFxuICAgICAgZmlsdGVyOiAnbmdpbnguYWNjZXNzLnJlc3BvbnNlX2NvZGU6WzQwMCBUTyA0OTldJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnNTAwcycsXG4gICAgICBtZXRyaWNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2NvdW50LTUwMCcsXG4gICAgICAgICAgdHlwZTogSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUuY291bnQsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgc3BsaXRfbW9kZTogJ2ZpbHRlcicsXG4gICAgICBmaWx0ZXI6ICduZ2lueC5hY2Nlc3MucmVzcG9uc2VfY29kZTpbNTAwIFRPIDU5OV0nLFxuICAgIH0sXG4gIF0sXG59KTtcbiJdfQ==