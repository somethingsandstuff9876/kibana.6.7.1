"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filebeatIcingaRules = [
    {
        // pre-ECS
        when: {
            exists: ['icinga.main.message'],
        },
        format: [
            {
                constant: '[Icinga][',
            },
            {
                field: 'icinga.main.facility',
            },
            {
                constant: '][',
            },
            {
                field: 'icinga.main.severity',
            },
            {
                constant: '] ',
            },
            {
                field: 'icinga.main.message',
            },
        ],
    },
    {
        // pre-ECS
        when: {
            exists: ['icinga.debug.message'],
        },
        format: [
            {
                constant: '[Icinga][',
            },
            {
                field: 'icinga.debug.facility',
            },
            {
                constant: '][',
            },
            {
                field: 'icinga.debug.severity',
            },
            {
                constant: '] ',
            },
            {
                field: 'icinga.debug.message',
            },
        ],
    },
    {
        // pre-ECS
        when: {
            exists: ['icinga.startup.message'],
        },
        format: [
            {
                constant: '[Icinga][',
            },
            {
                field: 'icinga.startup.facility',
            },
            {
                constant: '][',
            },
            {
                field: 'icinga.startup.severity',
            },
            {
                constant: '] ',
            },
            {
                field: 'icinga.startup.message',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X2ljaW5nYS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X2ljaW5nYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFVSxRQUFBLG1CQUFtQixHQUFHO0lBQ2pDO1FBQ0UsVUFBVTtRQUNWLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxDQUFDLHFCQUFxQixDQUFDO1NBQ2hDO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsUUFBUSxFQUFFLFdBQVc7YUFDdEI7WUFDRDtnQkFDRSxLQUFLLEVBQUUsc0JBQXNCO2FBQzlCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLEtBQUssRUFBRSxzQkFBc0I7YUFDOUI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHFCQUFxQjthQUM3QjtTQUNGO0tBQ0Y7SUFDRDtRQUNFLFVBQVU7UUFDVixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztTQUNqQztRQUNELE1BQU0sRUFBRTtZQUNOO2dCQUNFLFFBQVEsRUFBRSxXQUFXO2FBQ3RCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHVCQUF1QjthQUMvQjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsdUJBQXVCO2FBQy9CO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLEtBQUssRUFBRSxzQkFBc0I7YUFDOUI7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxVQUFVO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLENBQUMsd0JBQXdCLENBQUM7U0FDbkM7UUFDRCxNQUFNLEVBQUU7WUFDTjtnQkFDRSxRQUFRLEVBQUUsV0FBVzthQUN0QjtZQUNEO2dCQUNFLEtBQUssRUFBRSx5QkFBeUI7YUFDakM7WUFDRDtnQkFDRSxRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHlCQUF5QjthQUNqQztZQUNEO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsd0JBQXdCO2FBQ2hDO1NBQ0Y7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY29uc3QgZmlsZWJlYXRJY2luZ2FSdWxlcyA9IFtcbiAge1xuICAgIC8vIHByZS1FQ1NcbiAgICB3aGVuOiB7XG4gICAgICBleGlzdHM6IFsnaWNpbmdhLm1haW4ubWVzc2FnZSddLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnW0ljaW5nYV1bJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaWNpbmdhLm1haW4uZmFjaWxpdHknLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICddWycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2ljaW5nYS5tYWluLnNldmVyaXR5JyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnXSAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdpY2luZ2EubWFpbi5tZXNzYWdlJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIC8vIHByZS1FQ1NcbiAgICB3aGVuOiB7XG4gICAgICBleGlzdHM6IFsnaWNpbmdhLmRlYnVnLm1lc3NhZ2UnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1tJY2luZ2FdWycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2ljaW5nYS5kZWJ1Zy5mYWNpbGl0eScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ11bJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaWNpbmdhLmRlYnVnLnNldmVyaXR5JyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnXSAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdpY2luZ2EuZGVidWcubWVzc2FnZScsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICAvLyBwcmUtRUNTXG4gICAgd2hlbjoge1xuICAgICAgZXhpc3RzOiBbJ2ljaW5nYS5zdGFydHVwLm1lc3NhZ2UnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1tJY2luZ2FdWycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2ljaW5nYS5zdGFydHVwLmZhY2lsaXR5JyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnXVsnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdpY2luZ2Euc3RhcnR1cC5zZXZlcml0eScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ10gJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaWNpbmdhLnN0YXJ0dXAubWVzc2FnZScsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5dO1xuIl19