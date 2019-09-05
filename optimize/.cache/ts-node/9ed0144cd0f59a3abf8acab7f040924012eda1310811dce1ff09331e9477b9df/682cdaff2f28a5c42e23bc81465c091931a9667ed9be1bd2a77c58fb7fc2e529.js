"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filebeatSystemRules = [
    {
        when: {
            exists: ['system.syslog.message'],
        },
        format: [
            {
                constant: '[System][syslog] ',
            },
            {
                field: 'system.syslog.program',
            },
            {
                constant: ' - ',
            },
            {
                field: 'system.syslog.message',
            },
        ],
    },
    {
        when: {
            exists: ['system.auth.message'],
        },
        format: [
            {
                constant: '[System][auth] ',
            },
            {
                field: 'system.syslog.program',
            },
            {
                constant: ' - ',
            },
            {
                field: 'system.auth.message',
            },
        ],
    },
    {
        when: {
            exists: ['system.auth.ssh.event'],
        },
        format: [
            {
                constant: '[System][auth][ssh]',
            },
            {
                constant: ' ',
            },
            {
                field: 'system.auth.ssh.event',
            },
            {
                constant: ' user ',
            },
            {
                field: 'system.auth.user',
            },
            {
                constant: ' from ',
            },
            {
                field: 'system.auth.ssh.ip',
            },
        ],
    },
    {
        when: {
            exists: ['system.auth.ssh.dropped_ip'],
        },
        format: [
            {
                constant: '[System][auth][ssh]',
            },
            {
                constant: ' Dropped connection from ',
            },
            {
                field: 'system.auth.ssh.dropped_ip',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X3N5c3RlbS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X3N5c3RlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFVSxRQUFBLG1CQUFtQixHQUFHO0lBQ2pDO1FBQ0UsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLENBQUMsdUJBQXVCLENBQUM7U0FDbEM7UUFDRCxNQUFNLEVBQUU7WUFDTjtnQkFDRSxRQUFRLEVBQUUsbUJBQW1CO2FBQzlCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHVCQUF1QjthQUMvQjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxLQUFLO2FBQ2hCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHVCQUF1QjthQUMvQjtTQUNGO0tBQ0Y7SUFDRDtRQUNFLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxDQUFDLHFCQUFxQixDQUFDO1NBQ2hDO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsUUFBUSxFQUFFLGlCQUFpQjthQUM1QjtZQUNEO2dCQUNFLEtBQUssRUFBRSx1QkFBdUI7YUFDL0I7WUFDRDtnQkFDRSxRQUFRLEVBQUUsS0FBSzthQUNoQjtZQUNEO2dCQUNFLEtBQUssRUFBRSxxQkFBcUI7YUFDN0I7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztTQUNsQztRQUNELE1BQU0sRUFBRTtZQUNOO2dCQUNFLFFBQVEsRUFBRSxxQkFBcUI7YUFDaEM7WUFDRDtnQkFDRSxRQUFRLEVBQUUsR0FBRzthQUNkO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHVCQUF1QjthQUMvQjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxRQUFRO2FBQ25CO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLGtCQUFrQjthQUMxQjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxRQUFRO2FBQ25CO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLG9CQUFvQjthQUM1QjtTQUNGO0tBQ0Y7SUFDRDtRQUNFLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxDQUFDLDRCQUE0QixDQUFDO1NBQ3ZDO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsUUFBUSxFQUFFLHFCQUFxQjthQUNoQztZQUNEO2dCQUNFLFFBQVEsRUFBRSwyQkFBMkI7YUFDdEM7WUFDRDtnQkFDRSxLQUFLLEVBQUUsNEJBQTRCO2FBQ3BDO1NBQ0Y7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY29uc3QgZmlsZWJlYXRTeXN0ZW1SdWxlcyA9IFtcbiAge1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydzeXN0ZW0uc3lzbG9nLm1lc3NhZ2UnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1tTeXN0ZW1dW3N5c2xvZ10gJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnc3lzdGVtLnN5c2xvZy5wcm9ncmFtJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnIC0gJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnc3lzdGVtLnN5c2xvZy5tZXNzYWdlJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydzeXN0ZW0uYXV0aC5tZXNzYWdlJ10sXG4gICAgfSxcbiAgICBmb3JtYXQ6IFtcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdbU3lzdGVtXVthdXRoXSAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdzeXN0ZW0uc3lzbG9nLnByb2dyYW0nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgLSAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdzeXN0ZW0uYXV0aC5tZXNzYWdlJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydzeXN0ZW0uYXV0aC5zc2guZXZlbnQnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1tTeXN0ZW1dW2F1dGhdW3NzaF0nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnc3lzdGVtLmF1dGguc3NoLmV2ZW50JyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnIHVzZXIgJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnc3lzdGVtLmF1dGgudXNlcicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyBmcm9tICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ3N5c3RlbS5hdXRoLnNzaC5pcCcsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICB3aGVuOiB7XG4gICAgICBleGlzdHM6IFsnc3lzdGVtLmF1dGguc3NoLmRyb3BwZWRfaXAnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1tTeXN0ZW1dW2F1dGhdW3NzaF0nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgRHJvcHBlZCBjb25uZWN0aW9uIGZyb20gJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnc3lzdGVtLmF1dGguc3NoLmRyb3BwZWRfaXAnLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXTtcbiJdfQ==