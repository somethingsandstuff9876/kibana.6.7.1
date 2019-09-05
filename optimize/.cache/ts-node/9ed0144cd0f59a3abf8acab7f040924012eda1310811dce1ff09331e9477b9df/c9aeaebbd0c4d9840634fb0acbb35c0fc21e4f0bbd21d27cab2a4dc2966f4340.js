"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filebeatLogstashRules = [
    {
        // pre-ECS
        when: {
            exists: ['logstash.log.message'],
        },
        format: [
            {
                constant: '[Logstash][',
            },
            {
                field: 'logstash.log.level',
            },
            {
                constant: '] ',
            },
            {
                field: 'logstash.log.module',
            },
            {
                constant: ' - ',
            },
            {
                field: 'logstash.log.message',
            },
        ],
    },
    {
        // ECS
        when: {
            exists: ['ecs.version', 'logstash.slowlog'],
        },
        format: [
            {
                constant: '[Logstash][',
            },
            {
                field: 'log.level',
            },
            {
                constant: '] ',
            },
            {
                field: 'logstash.slowlog',
            },
        ],
    },
    {
        // pre-ECS
        when: {
            exists: ['logstash.slowlog.message'],
        },
        format: [
            {
                constant: '[Logstash][',
            },
            {
                field: 'logstash.slowlog.level',
            },
            {
                constant: '] ',
            },
            {
                field: 'logstash.slowlog.module',
            },
            {
                constant: ' - ',
            },
            {
                field: 'logstash.slowlog.message',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X2xvZ3N0YXNoLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2RvbWFpbnMvbG9nX2VudHJpZXNfZG9tYWluL2J1aWx0aW5fcnVsZXMvZmlsZWJlYXRfbG9nc3Rhc2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRVUsUUFBQSxxQkFBcUIsR0FBRztJQUNuQztRQUNFLFVBQVU7UUFDVixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztTQUNqQztRQUNELE1BQU0sRUFBRTtZQUNOO2dCQUNFLFFBQVEsRUFBRSxhQUFhO2FBQ3hCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLG9CQUFvQjthQUM1QjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUscUJBQXFCO2FBQzdCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLEtBQUs7YUFDaEI7WUFDRDtnQkFDRSxLQUFLLEVBQUUsc0JBQXNCO2FBQzlCO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsTUFBTTtRQUNOLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQztTQUM1QztRQUNELE1BQU0sRUFBRTtZQUNOO2dCQUNFLFFBQVEsRUFBRSxhQUFhO2FBQ3hCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLFdBQVc7YUFDbkI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLGtCQUFrQjthQUMxQjtTQUNGO0tBQ0Y7SUFDRDtRQUNFLFVBQVU7UUFDVixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQztTQUNyQztRQUNELE1BQU0sRUFBRTtZQUNOO2dCQUNFLFFBQVEsRUFBRSxhQUFhO2FBQ3hCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHdCQUF3QjthQUNoQztZQUNEO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUseUJBQXlCO2FBQ2pDO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLEtBQUs7YUFDaEI7WUFDRDtnQkFDRSxLQUFLLEVBQUUsMEJBQTBCO2FBQ2xDO1NBQ0Y7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY29uc3QgZmlsZWJlYXRMb2dzdGFzaFJ1bGVzID0gW1xuICB7XG4gICAgLy8gcHJlLUVDU1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydsb2dzdGFzaC5sb2cubWVzc2FnZSddLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnW0xvZ3N0YXNoXVsnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdsb2dzdGFzaC5sb2cubGV2ZWwnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICddICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2xvZ3N0YXNoLmxvZy5tb2R1bGUnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgLSAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdsb2dzdGFzaC5sb2cubWVzc2FnZScsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICAvLyBFQ1NcbiAgICB3aGVuOiB7XG4gICAgICBleGlzdHM6IFsnZWNzLnZlcnNpb24nLCAnbG9nc3Rhc2guc2xvd2xvZyddLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnW0xvZ3N0YXNoXVsnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdsb2cubGV2ZWwnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICddICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2xvZ3N0YXNoLnNsb3dsb2cnLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgLy8gcHJlLUVDU1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydsb2dzdGFzaC5zbG93bG9nLm1lc3NhZ2UnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1tMb2dzdGFzaF1bJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnbG9nc3Rhc2guc2xvd2xvZy5sZXZlbCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ10gJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnbG9nc3Rhc2guc2xvd2xvZy5tb2R1bGUnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgLSAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdsb2dzdGFzaC5zbG93bG9nLm1lc3NhZ2UnLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXTtcbiJdfQ==