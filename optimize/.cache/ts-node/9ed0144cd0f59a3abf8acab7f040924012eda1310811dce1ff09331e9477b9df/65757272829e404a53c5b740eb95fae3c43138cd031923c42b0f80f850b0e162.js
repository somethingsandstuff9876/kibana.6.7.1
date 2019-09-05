"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../../adapter_types");
exports.nginxRequestRate = (timeField, indexPattern, interval) => ({
    id: 'nginxRequestRate',
    requires: ['nginx.stubstatus'],
    index_pattern: indexPattern,
    interval,
    time_field: timeField,
    type: 'timeseries',
    series: [
        {
            id: 'rate',
            metrics: [
                {
                    field: 'nginx.stubstatus.requests',
                    id: 'max-requests',
                    type: adapter_types_1.InfraMetricModelMetricType.max,
                },
                {
                    field: 'max-requests',
                    id: 'derv-max-requests',
                    type: adapter_types_1.InfraMetricModelMetricType.derivative,
                    unit: '1s',
                },
                {
                    id: 'posonly-derv-max-requests',
                    type: adapter_types_1.InfraMetricModelMetricType.calculation,
                    variables: [{ id: 'var-rate', name: 'rate', field: 'derv-max-requests' }],
                    script: 'params.rate > 0.0 ? params.rate : 0.0',
                },
            ],
            split_mode: 'everything',
        },
    ],
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL21vZGVscy9uZ2lueC9uZ2lueF9yZXF1ZXN0X3JhdGUudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvYWRhcHRlcnMvbWV0cmljcy9tb2RlbHMvbmdpbngvbmdpbnhfcmVxdWVzdF9yYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILHVEQUEwRjtBQUU3RSxRQUFBLGdCQUFnQixHQUE0QixDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9GLEVBQUUsRUFBRSxrQkFBa0I7SUFDdEIsUUFBUSxFQUFFLENBQUMsa0JBQWtCLENBQUM7SUFDOUIsYUFBYSxFQUFFLFlBQVk7SUFDM0IsUUFBUTtJQUNSLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLElBQUksRUFBRSxZQUFZO0lBQ2xCLE1BQU0sRUFBRTtRQUNOO1lBQ0UsRUFBRSxFQUFFLE1BQU07WUFDVixPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsS0FBSyxFQUFFLDJCQUEyQjtvQkFDbEMsRUFBRSxFQUFFLGNBQWM7b0JBQ2xCLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxHQUFHO2lCQUNyQztnQkFDRDtvQkFDRSxLQUFLLEVBQUUsY0FBYztvQkFDckIsRUFBRSxFQUFFLG1CQUFtQjtvQkFDdkIsSUFBSSxFQUFFLDBDQUEwQixDQUFDLFVBQVU7b0JBQzNDLElBQUksRUFBRSxJQUFJO2lCQUNYO2dCQUNEO29CQUNFLEVBQUUsRUFBRSwyQkFBMkI7b0JBQy9CLElBQUksRUFBRSwwQ0FBMEIsQ0FBQyxXQUFXO29CQUM1QyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQztvQkFDekUsTUFBTSxFQUFFLHVDQUF1QztpQkFDaEQ7YUFDRjtZQUNELFVBQVUsRUFBRSxZQUFZO1NBQ3pCO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmZyYU1ldHJpY01vZGVsQ3JlYXRvciwgSW5mcmFNZXRyaWNNb2RlbE1ldHJpY1R5cGUgfSBmcm9tICcuLi8uLi9hZGFwdGVyX3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IG5naW54UmVxdWVzdFJhdGU6IEluZnJhTWV0cmljTW9kZWxDcmVhdG9yID0gKHRpbWVGaWVsZCwgaW5kZXhQYXR0ZXJuLCBpbnRlcnZhbCkgPT4gKHtcbiAgaWQ6ICduZ2lueFJlcXVlc3RSYXRlJyxcbiAgcmVxdWlyZXM6IFsnbmdpbnguc3R1YnN0YXR1cyddLFxuICBpbmRleF9wYXR0ZXJuOiBpbmRleFBhdHRlcm4sXG4gIGludGVydmFsLFxuICB0aW1lX2ZpZWxkOiB0aW1lRmllbGQsXG4gIHR5cGU6ICd0aW1lc2VyaWVzJyxcbiAgc2VyaWVzOiBbXG4gICAge1xuICAgICAgaWQ6ICdyYXRlJyxcbiAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnbmdpbnguc3R1YnN0YXR1cy5yZXF1ZXN0cycsXG4gICAgICAgICAgaWQ6ICdtYXgtcmVxdWVzdHMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLm1heCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiAnbWF4LXJlcXVlc3RzJyxcbiAgICAgICAgICBpZDogJ2RlcnYtbWF4LXJlcXVlc3RzJyxcbiAgICAgICAgICB0eXBlOiBJbmZyYU1ldHJpY01vZGVsTWV0cmljVHlwZS5kZXJpdmF0aXZlLFxuICAgICAgICAgIHVuaXQ6ICcxcycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ3Bvc29ubHktZGVydi1tYXgtcmVxdWVzdHMnLFxuICAgICAgICAgIHR5cGU6IEluZnJhTWV0cmljTW9kZWxNZXRyaWNUeXBlLmNhbGN1bGF0aW9uLFxuICAgICAgICAgIHZhcmlhYmxlczogW3sgaWQ6ICd2YXItcmF0ZScsIG5hbWU6ICdyYXRlJywgZmllbGQ6ICdkZXJ2LW1heC1yZXF1ZXN0cycgfV0sXG4gICAgICAgICAgc2NyaXB0OiAncGFyYW1zLnJhdGUgPiAwLjAgPyBwYXJhbXMucmF0ZSA6IDAuMCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgc3BsaXRfbW9kZTogJ2V2ZXJ5dGhpbmcnLFxuICAgIH0sXG4gIF0sXG59KTtcbiJdfQ==