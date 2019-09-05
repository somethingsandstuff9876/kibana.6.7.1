"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filebeatRedisRules = [
    {
        when: {
            exists: ['redis.log.message'],
        },
        format: [
            {
                constant: '[Redis]',
            },
            {
                constant: '[',
            },
            {
                field: 'redis.log.level',
            },
            {
                constant: '] ',
            },
            {
                field: 'redis.log.message',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X3JlZGlzLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2RvbWFpbnMvbG9nX2VudHJpZXNfZG9tYWluL2J1aWx0aW5fcnVsZXMvZmlsZWJlYXRfcmVkaXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRVUsUUFBQSxrQkFBa0IsR0FBRztJQUNoQztRQUNFLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxDQUFDLG1CQUFtQixDQUFDO1NBQzlCO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsUUFBUSxFQUFFLFNBQVM7YUFDcEI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsR0FBRzthQUNkO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLGlCQUFpQjthQUN6QjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsbUJBQW1CO2FBQzNCO1NBQ0Y7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY29uc3QgZmlsZWJlYXRSZWRpc1J1bGVzID0gW1xuICB7XG4gICAgd2hlbjoge1xuICAgICAgZXhpc3RzOiBbJ3JlZGlzLmxvZy5tZXNzYWdlJ10sXG4gICAgfSxcbiAgICBmb3JtYXQ6IFtcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdbUmVkaXNdJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnWycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ3JlZGlzLmxvZy5sZXZlbCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ10gJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAncmVkaXMubG9nLm1lc3NhZ2UnLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXTtcbiJdfQ==