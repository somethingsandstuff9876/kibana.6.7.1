"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filebeatMySQLRules = [
    {
        // pre-ECS
        when: {
            exists: ['mysql.error.message'],
        },
        format: [
            {
                constant: '[MySQL][error] ',
            },
            {
                field: 'mysql.error.message',
            },
        ],
    },
    {
        // ECS
        when: {
            exists: ['ecs.version', 'mysql.slowlog.query'],
        },
        format: [
            {
                constant: '[MySQL][slowlog] ',
            },
            {
                field: 'user.name',
            },
            {
                constant: '@',
            },
            {
                field: 'source.domain',
            },
            {
                constant: ' [',
            },
            {
                field: 'source.ip',
            },
            {
                constant: '] ',
            },
            {
                constant: ' - ',
            },
            {
                field: 'event.duration',
            },
            {
                constant: ' ns - ',
            },
            {
                field: 'mysql.slowlog.query',
            },
        ],
    },
    {
        // pre-ECS
        when: {
            exists: ['mysql.slowlog.user', 'mysql.slowlog.query_time.sec', 'mysql.slowlog.query'],
        },
        format: [
            {
                constant: '[MySQL][slowlog] ',
            },
            {
                field: 'mysql.slowlog.user',
            },
            {
                constant: '@',
            },
            {
                field: 'mysql.slowlog.host',
            },
            {
                constant: ' [',
            },
            {
                field: 'mysql.slowlog.ip',
            },
            {
                constant: '] ',
            },
            {
                constant: ' - ',
            },
            {
                field: 'mysql.slowlog.query_time.sec',
            },
            {
                constant: ' s - ',
            },
            {
                field: 'mysql.slowlog.query',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X215c3FsLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2RvbWFpbnMvbG9nX2VudHJpZXNfZG9tYWluL2J1aWx0aW5fcnVsZXMvZmlsZWJlYXRfbXlzcWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRVUsUUFBQSxrQkFBa0IsR0FBRztJQUNoQztRQUNFLFVBQVU7UUFDVixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztTQUNoQztRQUNELE1BQU0sRUFBRTtZQUNOO2dCQUNFLFFBQVEsRUFBRSxpQkFBaUI7YUFDNUI7WUFDRDtnQkFDRSxLQUFLLEVBQUUscUJBQXFCO2FBQzdCO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsTUFBTTtRQUNOLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxDQUFDLGFBQWEsRUFBRSxxQkFBcUIsQ0FBQztTQUMvQztRQUNELE1BQU0sRUFBRTtZQUNOO2dCQUNFLFFBQVEsRUFBRSxtQkFBbUI7YUFDOUI7WUFDRDtnQkFDRSxLQUFLLEVBQUUsV0FBVzthQUNuQjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxHQUFHO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsZUFBZTthQUN2QjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsV0FBVzthQUNuQjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxRQUFRLEVBQUUsS0FBSzthQUNoQjtZQUNEO2dCQUNFLEtBQUssRUFBRSxnQkFBZ0I7YUFDeEI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsUUFBUTthQUNuQjtZQUNEO2dCQUNFLEtBQUssRUFBRSxxQkFBcUI7YUFDN0I7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxVQUFVO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLENBQUMsb0JBQW9CLEVBQUUsOEJBQThCLEVBQUUscUJBQXFCLENBQUM7U0FDdEY7UUFDRCxNQUFNLEVBQUU7WUFDTjtnQkFDRSxRQUFRLEVBQUUsbUJBQW1CO2FBQzlCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLG9CQUFvQjthQUM1QjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxHQUFHO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsb0JBQW9CO2FBQzVCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLEtBQUssRUFBRSxrQkFBa0I7YUFDMUI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLEtBQUs7YUFDaEI7WUFDRDtnQkFDRSxLQUFLLEVBQUUsOEJBQThCO2FBQ3RDO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLE9BQU87YUFDbEI7WUFDRDtnQkFDRSxLQUFLLEVBQUUscUJBQXFCO2FBQzdCO1NBQ0Y7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY29uc3QgZmlsZWJlYXRNeVNRTFJ1bGVzID0gW1xuICB7XG4gICAgLy8gcHJlLUVDU1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydteXNxbC5lcnJvci5tZXNzYWdlJ10sXG4gICAgfSxcbiAgICBmb3JtYXQ6IFtcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdbTXlTUUxdW2Vycm9yXSAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdteXNxbC5lcnJvci5tZXNzYWdlJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIC8vIEVDU1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydlY3MudmVyc2lvbicsICdteXNxbC5zbG93bG9nLnF1ZXJ5J10sXG4gICAgfSxcbiAgICBmb3JtYXQ6IFtcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdbTXlTUUxdW3Nsb3dsb2ddICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ3VzZXIubmFtZScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ0AnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdzb3VyY2UuZG9tYWluJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnIFsnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdzb3VyY2UuaXAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICddICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAtICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2V2ZW50LmR1cmF0aW9uJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnIG5zIC0gJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnbXlzcWwuc2xvd2xvZy5xdWVyeScsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICAvLyBwcmUtRUNTXG4gICAgd2hlbjoge1xuICAgICAgZXhpc3RzOiBbJ215c3FsLnNsb3dsb2cudXNlcicsICdteXNxbC5zbG93bG9nLnF1ZXJ5X3RpbWUuc2VjJywgJ215c3FsLnNsb3dsb2cucXVlcnknXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1tNeVNRTF1bc2xvd2xvZ10gJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnbXlzcWwuc2xvd2xvZy51c2VyJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnQCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ215c3FsLnNsb3dsb2cuaG9zdCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyBbJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnbXlzcWwuc2xvd2xvZy5pcCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ10gJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnIC0gJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnbXlzcWwuc2xvd2xvZy5xdWVyeV90aW1lLnNlYycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyBzIC0gJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnbXlzcWwuc2xvd2xvZy5xdWVyeScsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5dO1xuIl19