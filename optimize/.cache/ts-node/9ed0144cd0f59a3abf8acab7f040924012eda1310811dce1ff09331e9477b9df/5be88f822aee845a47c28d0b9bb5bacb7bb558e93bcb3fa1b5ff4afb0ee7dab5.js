"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filebeatIisRules = [
    {
        // pre-ECS
        when: {
            exists: ['iis.access.method'],
        },
        format: [
            {
                constant: '[iis][access] ',
            },
            {
                field: 'iis.access.remote_ip',
            },
            {
                constant: ' ',
            },
            {
                field: 'iis.access.user_name',
            },
            {
                constant: ' "',
            },
            {
                field: 'iis.access.method',
            },
            {
                constant: ' ',
            },
            {
                field: 'iis.access.url',
            },
            {
                constant: ' HTTP/',
            },
            {
                field: 'iis.access.http_version',
            },
            {
                constant: '" ',
            },
            {
                field: 'iis.access.response_code',
            },
            {
                constant: ' ',
            },
            {
                field: 'iis.access.body_sent.bytes',
            },
        ],
    },
    {
        // pre-ECS
        when: {
            exists: ['iis.error.url'],
        },
        format: [
            {
                constant: '[iis][error] ',
            },
            {
                field: 'iis.error.remote_ip',
            },
            {
                constant: ' "',
            },
            {
                field: 'iis.error.method',
            },
            {
                constant: ' ',
            },
            {
                field: 'iis.error.url',
            },
            {
                constant: ' HTTP/',
            },
            {
                field: 'iis.error.http_version',
            },
            {
                constant: '" ',
            },
            {
                field: 'iis.error.response_code',
            },
            {
                constant: ' ',
            },
            {
                field: 'iis.error.reason_phrase',
            },
        ],
    },
    {
        // ECS
        when: {
            exists: ['ecs.version', 'iis.error.reason_phrase'],
        },
        format: [
            {
                constant: '[iis][error] ',
            },
            {
                field: 'source.ip',
            },
            {
                constant: ' ',
            },
            {
                field: 'iis.error.reason_phrase',
            },
        ],
    },
    {
        // pre-ECS
        when: {
            exists: ['iis.error.reason_phrase'],
        },
        format: [
            {
                constant: '[iis][error] ',
            },
            {
                field: 'iis.error.remote_ip',
            },
            {
                constant: ' ',
            },
            {
                field: 'iis.error.reason_phrase',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X2lpcy50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X2lpcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFVSxRQUFBLGdCQUFnQixHQUFHO0lBQzlCO1FBQ0UsVUFBVTtRQUNWLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxDQUFDLG1CQUFtQixDQUFDO1NBQzlCO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsUUFBUSxFQUFFLGdCQUFnQjthQUMzQjtZQUNEO2dCQUNFLEtBQUssRUFBRSxzQkFBc0I7YUFDOUI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsR0FBRzthQUNkO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHNCQUFzQjthQUM5QjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsbUJBQW1CO2FBQzNCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLEdBQUc7YUFDZDtZQUNEO2dCQUNFLEtBQUssRUFBRSxnQkFBZ0I7YUFDeEI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsUUFBUTthQUNuQjtZQUNEO2dCQUNFLEtBQUssRUFBRSx5QkFBeUI7YUFDakM7WUFDRDtnQkFDRSxRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLDBCQUEwQjthQUNsQztZQUNEO2dCQUNFLFFBQVEsRUFBRSxHQUFHO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsNEJBQTRCO2FBQ3BDO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsVUFBVTtRQUNWLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxDQUFDLGVBQWUsQ0FBQztTQUMxQjtRQUNELE1BQU0sRUFBRTtZQUNOO2dCQUNFLFFBQVEsRUFBRSxlQUFlO2FBQzFCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHFCQUFxQjthQUM3QjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsa0JBQWtCO2FBQzFCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLEdBQUc7YUFDZDtZQUNEO2dCQUNFLEtBQUssRUFBRSxlQUFlO2FBQ3ZCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLFFBQVE7YUFDbkI7WUFDRDtnQkFDRSxLQUFLLEVBQUUsd0JBQXdCO2FBQ2hDO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLEtBQUssRUFBRSx5QkFBeUI7YUFDakM7WUFDRDtnQkFDRSxRQUFRLEVBQUUsR0FBRzthQUNkO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHlCQUF5QjthQUNqQztTQUNGO0tBQ0Y7SUFDRDtRQUNFLE1BQU07UUFDTixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsQ0FBQyxhQUFhLEVBQUUseUJBQXlCLENBQUM7U0FDbkQ7UUFDRCxNQUFNLEVBQUU7WUFDTjtnQkFDRSxRQUFRLEVBQUUsZUFBZTthQUMxQjtZQUNEO2dCQUNFLEtBQUssRUFBRSxXQUFXO2FBQ25CO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLEdBQUc7YUFDZDtZQUNEO2dCQUNFLEtBQUssRUFBRSx5QkFBeUI7YUFDakM7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxVQUFVO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLENBQUMseUJBQXlCLENBQUM7U0FDcEM7UUFDRCxNQUFNLEVBQUU7WUFDTjtnQkFDRSxRQUFRLEVBQUUsZUFBZTthQUMxQjtZQUNEO2dCQUNFLEtBQUssRUFBRSxxQkFBcUI7YUFDN0I7WUFDRDtnQkFDRSxRQUFRLEVBQUUsR0FBRzthQUNkO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHlCQUF5QjthQUNqQztTQUNGO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0IGNvbnN0IGZpbGViZWF0SWlzUnVsZXMgPSBbXG4gIHtcbiAgICAvLyBwcmUtRUNTXG4gICAgd2hlbjoge1xuICAgICAgZXhpc3RzOiBbJ2lpcy5hY2Nlc3MubWV0aG9kJ10sXG4gICAgfSxcbiAgICBmb3JtYXQ6IFtcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdbaWlzXVthY2Nlc3NdICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2lpcy5hY2Nlc3MucmVtb3RlX2lwJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2lpcy5hY2Nlc3MudXNlcl9uYW1lJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnIFwiJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaWlzLmFjY2Vzcy5tZXRob2QnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaWlzLmFjY2Vzcy51cmwnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgSFRUUC8nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdpaXMuYWNjZXNzLmh0dHBfdmVyc2lvbicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1wiICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2lpcy5hY2Nlc3MucmVzcG9uc2VfY29kZScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdpaXMuYWNjZXNzLmJvZHlfc2VudC5ieXRlcycsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICAvLyBwcmUtRUNTXG4gICAgd2hlbjoge1xuICAgICAgZXhpc3RzOiBbJ2lpcy5lcnJvci51cmwnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1tpaXNdW2Vycm9yXSAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdpaXMuZXJyb3IucmVtb3RlX2lwJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnIFwiJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaWlzLmVycm9yLm1ldGhvZCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdpaXMuZXJyb3IudXJsJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnIEhUVFAvJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaWlzLmVycm9yLmh0dHBfdmVyc2lvbicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1wiICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2lpcy5lcnJvci5yZXNwb25zZV9jb2RlJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2lpcy5lcnJvci5yZWFzb25fcGhyYXNlJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIC8vIEVDU1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydlY3MudmVyc2lvbicsICdpaXMuZXJyb3IucmVhc29uX3BocmFzZSddLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnW2lpc11bZXJyb3JdICcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ3NvdXJjZS5pcCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdpaXMuZXJyb3IucmVhc29uX3BocmFzZScsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICAvLyBwcmUtRUNTXG4gICAgd2hlbjoge1xuICAgICAgZXhpc3RzOiBbJ2lpcy5lcnJvci5yZWFzb25fcGhyYXNlJ10sXG4gICAgfSxcbiAgICBmb3JtYXQ6IFtcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdbaWlzXVtlcnJvcl0gJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaWlzLmVycm9yLnJlbW90ZV9pcCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdpaXMuZXJyb3IucmVhc29uX3BocmFzZScsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5dO1xuIl19