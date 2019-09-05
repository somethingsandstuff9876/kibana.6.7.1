"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filebeatTraefikRules = [
    {
        // pre-ECS
        when: {
            exists: ['traefik.access.method'],
        },
        format: [
            {
                constant: '[traefik][access] ',
            },
            {
                field: 'traefik.access.remote_ip',
            },
            {
                constant: ' ',
            },
            {
                field: 'traefik.access.frontend_name',
            },
            {
                constant: ' -> ',
            },
            {
                field: 'traefik.access.backend_url',
            },
            {
                constant: ' "',
            },
            {
                field: 'traefik.access.method',
            },
            {
                constant: ' ',
            },
            {
                field: 'traefik.access.url',
            },
            {
                constant: ' HTTP/',
            },
            {
                field: 'traefik.access.http_version',
            },
            {
                constant: '" ',
            },
            {
                field: 'traefik.access.response_code',
            },
            {
                constant: ' ',
            },
            {
                field: 'traefik.access.body_sent.bytes',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X3RyYWVmaWsudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvZG9tYWlucy9sb2dfZW50cmllc19kb21haW4vYnVpbHRpbl9ydWxlcy9maWxlYmVhdF90cmFlZmlrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVVLFFBQUEsb0JBQW9CLEdBQUc7SUFDbEM7UUFDRSxVQUFVO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLENBQUMsdUJBQXVCLENBQUM7U0FDbEM7UUFDRCxNQUFNLEVBQUU7WUFDTjtnQkFDRSxRQUFRLEVBQUUsb0JBQW9CO2FBQy9CO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLDBCQUEwQjthQUNsQztZQUNEO2dCQUNFLFFBQVEsRUFBRSxHQUFHO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsOEJBQThCO2FBQ3RDO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLE1BQU07YUFDakI7WUFDRDtnQkFDRSxLQUFLLEVBQUUsNEJBQTRCO2FBQ3BDO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLEtBQUssRUFBRSx1QkFBdUI7YUFDL0I7WUFDRDtnQkFDRSxRQUFRLEVBQUUsR0FBRzthQUNkO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLG9CQUFvQjthQUM1QjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxRQUFRO2FBQ25CO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLDZCQUE2QjthQUNyQztZQUNEO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsOEJBQThCO2FBQ3RDO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLEdBQUc7YUFDZDtZQUNEO2dCQUNFLEtBQUssRUFBRSxnQ0FBZ0M7YUFDeEM7U0FDRjtLQUNGO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCBjb25zdCBmaWxlYmVhdFRyYWVmaWtSdWxlcyA9IFtcbiAge1xuICAgIC8vIHByZS1FQ1NcbiAgICB3aGVuOiB7XG4gICAgICBleGlzdHM6IFsndHJhZWZpay5hY2Nlc3MubWV0aG9kJ10sXG4gICAgfSxcbiAgICBmb3JtYXQ6IFtcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdbdHJhZWZpa11bYWNjZXNzXSAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICd0cmFlZmlrLmFjY2Vzcy5yZW1vdGVfaXAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAndHJhZWZpay5hY2Nlc3MuZnJvbnRlbmRfbmFtZScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAtPiAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICd0cmFlZmlrLmFjY2Vzcy5iYWNrZW5kX3VybCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyBcIicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ3RyYWVmaWsuYWNjZXNzLm1ldGhvZCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICd0cmFlZmlrLmFjY2Vzcy51cmwnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgSFRUUC8nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICd0cmFlZmlrLmFjY2Vzcy5odHRwX3ZlcnNpb24nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdcIiAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICd0cmFlZmlrLmFjY2Vzcy5yZXNwb25zZV9jb2RlJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ3RyYWVmaWsuYWNjZXNzLmJvZHlfc2VudC5ieXRlcycsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5dO1xuIl19