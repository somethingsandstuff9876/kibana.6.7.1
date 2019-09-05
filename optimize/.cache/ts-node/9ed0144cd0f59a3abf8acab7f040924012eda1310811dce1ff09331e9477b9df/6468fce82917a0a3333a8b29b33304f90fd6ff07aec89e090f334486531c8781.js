"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filebeatNginxRules = [
    {
        when: {
            exists: ['nginx.access.method'],
        },
        format: [
            {
                constant: '[Nginx][access] ',
            },
            {
                field: 'nginx.access.remote_ip',
            },
            {
                constant: ' ',
            },
            {
                field: 'nginx.access.user_name',
            },
            {
                constant: ' "',
            },
            {
                field: 'nginx.access.method',
            },
            {
                constant: ' ',
            },
            {
                field: 'nginx.access.url',
            },
            {
                constant: ' HTTP/',
            },
            {
                field: 'nginx.access.http_version',
            },
            {
                constant: '" ',
            },
            {
                field: 'nginx.access.response_code',
            },
            {
                constant: ' ',
            },
            {
                field: 'nginx.access.body_sent.bytes',
            },
        ],
    },
    {
        when: {
            exists: ['nginx.error.message'],
        },
        format: [
            {
                constant: '[Nginx]',
            },
            {
                constant: '[',
            },
            {
                field: 'nginx.error.level',
            },
            {
                constant: '] ',
            },
            {
                field: 'nginx.error.message',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X25naW54LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2RvbWFpbnMvbG9nX2VudHJpZXNfZG9tYWluL2J1aWx0aW5fcnVsZXMvZmlsZWJlYXRfbmdpbngudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRVUsUUFBQSxrQkFBa0IsR0FBRztJQUNoQztRQUNFLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxDQUFDLHFCQUFxQixDQUFDO1NBQ2hDO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsUUFBUSxFQUFFLGtCQUFrQjthQUM3QjtZQUNEO2dCQUNFLEtBQUssRUFBRSx3QkFBd0I7YUFDaEM7WUFDRDtnQkFDRSxRQUFRLEVBQUUsR0FBRzthQUNkO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHdCQUF3QjthQUNoQztZQUNEO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUscUJBQXFCO2FBQzdCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLEdBQUc7YUFDZDtZQUNEO2dCQUNFLEtBQUssRUFBRSxrQkFBa0I7YUFDMUI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsUUFBUTthQUNuQjtZQUNEO2dCQUNFLEtBQUssRUFBRSwyQkFBMkI7YUFDbkM7WUFDRDtnQkFDRSxRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLDRCQUE0QjthQUNwQztZQUNEO2dCQUNFLFFBQVEsRUFBRSxHQUFHO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsOEJBQThCO2FBQ3RDO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLENBQUMscUJBQXFCLENBQUM7U0FDaEM7UUFDRCxNQUFNLEVBQUU7WUFDTjtnQkFDRSxRQUFRLEVBQUUsU0FBUzthQUNwQjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxHQUFHO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsbUJBQW1CO2FBQzNCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLEtBQUssRUFBRSxxQkFBcUI7YUFDN0I7U0FDRjtLQUNGO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCBjb25zdCBmaWxlYmVhdE5naW54UnVsZXMgPSBbXG4gIHtcbiAgICB3aGVuOiB7XG4gICAgICBleGlzdHM6IFsnbmdpbnguYWNjZXNzLm1ldGhvZCddLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnW05naW54XVthY2Nlc3NdICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ25naW54LmFjY2Vzcy5yZW1vdGVfaXAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnbmdpbnguYWNjZXNzLnVzZXJfbmFtZScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyBcIicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ25naW54LmFjY2Vzcy5tZXRob2QnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnbmdpbnguYWNjZXNzLnVybCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyBIVFRQLycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ25naW54LmFjY2Vzcy5odHRwX3ZlcnNpb24nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdcIiAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICduZ2lueC5hY2Nlc3MucmVzcG9uc2VfY29kZScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICduZ2lueC5hY2Nlc3MuYm9keV9zZW50LmJ5dGVzJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWyduZ2lueC5lcnJvci5tZXNzYWdlJ10sXG4gICAgfSxcbiAgICBmb3JtYXQ6IFtcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdbTmdpbnhdJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnWycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ25naW54LmVycm9yLmxldmVsJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnXSAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICduZ2lueC5lcnJvci5tZXNzYWdlJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbl07XG4iXX0=