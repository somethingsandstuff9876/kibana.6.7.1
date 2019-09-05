"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filebeatApache2Rules = [
    {
        when: {
            exists: ['apache2.access'],
        },
        format: [
            {
                constant: '[Apache][access] ',
            },
            {
                field: 'apache2.access.remote_ip',
            },
            {
                constant: ' ',
            },
            {
                field: 'apache2.access.user_name',
            },
            {
                constant: ' "',
            },
            {
                field: 'apache2.access.method',
            },
            {
                constant: ' ',
            },
            {
                field: 'apache2.access.url',
            },
            {
                constant: ' HTTP/',
            },
            {
                field: 'apache2.access.http_version',
            },
            {
                constant: '" ',
            },
            {
                field: 'apache2.access.response_code',
            },
            {
                constant: ' ',
            },
            {
                field: 'apache2.access.body_sent.bytes',
            },
        ],
    },
    {
        when: {
            exists: ['apache2.error.message'],
        },
        format: [
            {
                constant: '[Apache][',
            },
            {
                field: 'apache2.error.level',
            },
            {
                constant: '] ',
            },
            {
                field: 'apache2.error.message',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X2FwYWNoZTIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvZG9tYWlucy9sb2dfZW50cmllc19kb21haW4vYnVpbHRpbl9ydWxlcy9maWxlYmVhdF9hcGFjaGUyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVVLFFBQUEsb0JBQW9CLEdBQUc7SUFDbEM7UUFDRSxJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztTQUMzQjtRQUNELE1BQU0sRUFBRTtZQUNOO2dCQUNFLFFBQVEsRUFBRSxtQkFBbUI7YUFDOUI7WUFDRDtnQkFDRSxLQUFLLEVBQUUsMEJBQTBCO2FBQ2xDO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLEdBQUc7YUFDZDtZQUNEO2dCQUNFLEtBQUssRUFBRSwwQkFBMEI7YUFDbEM7WUFDRDtnQkFDRSxRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHVCQUF1QjthQUMvQjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxHQUFHO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsb0JBQW9CO2FBQzVCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLFFBQVE7YUFDbkI7WUFDRDtnQkFDRSxLQUFLLEVBQUUsNkJBQTZCO2FBQ3JDO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLEtBQUssRUFBRSw4QkFBOEI7YUFDdEM7WUFDRDtnQkFDRSxRQUFRLEVBQUUsR0FBRzthQUNkO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLGdDQUFnQzthQUN4QztTQUNGO0tBQ0Y7SUFDRDtRQUNFLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxDQUFDLHVCQUF1QixDQUFDO1NBQ2xDO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsUUFBUSxFQUFFLFdBQVc7YUFDdEI7WUFDRDtnQkFDRSxLQUFLLEVBQUUscUJBQXFCO2FBQzdCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLEtBQUssRUFBRSx1QkFBdUI7YUFDL0I7U0FDRjtLQUNGO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCBjb25zdCBmaWxlYmVhdEFwYWNoZTJSdWxlcyA9IFtcbiAge1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydhcGFjaGUyLmFjY2VzcyddLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnW0FwYWNoZV1bYWNjZXNzXSAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdhcGFjaGUyLmFjY2Vzcy5yZW1vdGVfaXAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnYXBhY2hlMi5hY2Nlc3MudXNlcl9uYW1lJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnIFwiJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnYXBhY2hlMi5hY2Nlc3MubWV0aG9kJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2FwYWNoZTIuYWNjZXNzLnVybCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyBIVFRQLycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2FwYWNoZTIuYWNjZXNzLmh0dHBfdmVyc2lvbicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1wiICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2FwYWNoZTIuYWNjZXNzLnJlc3BvbnNlX2NvZGUnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnYXBhY2hlMi5hY2Nlc3MuYm9keV9zZW50LmJ5dGVzJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydhcGFjaGUyLmVycm9yLm1lc3NhZ2UnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1tBcGFjaGVdWycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2FwYWNoZTIuZXJyb3IubGV2ZWwnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICddICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2FwYWNoZTIuZXJyb3IubWVzc2FnZScsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5dO1xuIl19