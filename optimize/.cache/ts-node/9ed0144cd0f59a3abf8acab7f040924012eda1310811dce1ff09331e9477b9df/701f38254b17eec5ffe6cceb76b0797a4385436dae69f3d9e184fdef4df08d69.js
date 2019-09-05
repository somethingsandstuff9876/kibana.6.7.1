"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ecsFrontendFields = [
    {
        field: 'source.address',
    },
    {
        constant: ':',
    },
    {
        field: 'source.port',
    },
    {
        constant: ' ',
    },
    {
        field: 'haproxy.frontend_name',
    },
];
const preEcsFrontendFields = [
    {
        field: 'haproxy.client.ip',
    },
    {
        constant: ':',
    },
    {
        field: 'haproxy.client.port',
    },
    {
        constant: ' ',
    },
    {
        field: 'haproxy.frontend_name',
    },
];
const commonBackendFields = [
    {
        constant: ' -> ',
    },
    {
        field: 'haproxy.backend_name',
    },
    {
        constant: '/',
    },
    {
        field: 'haproxy.server_name',
    },
];
const commonConnectionStatsFields = [
    {
        field: 'haproxy.connections.active',
    },
    {
        constant: '/',
    },
    {
        field: 'haproxy.connections.frontend',
    },
    {
        constant: '/',
    },
    {
        field: 'haproxy.connections.backend',
    },
    {
        constant: '/',
    },
    {
        field: 'haproxy.connections.server',
    },
    {
        constant: '/',
    },
    {
        field: 'haproxy.connections.retries',
    },
];
const commonQueueStatsFields = [
    {
        field: 'haproxy.server_queue',
    },
    {
        constant: '/',
    },
    {
        field: 'haproxy.backend_queue',
    },
];
exports.filebeatHaproxyRules = [
    {
        // ECS
        when: {
            exists: ['ecs.version', 'haproxy.http.request.raw_request_line'],
        },
        format: [
            {
                constant: '[HAProxy][http] ',
            },
            ...ecsFrontendFields,
            ...commonBackendFields,
            {
                constant: ' "',
            },
            {
                field: 'haproxy.http.request.raw_request_line',
            },
            {
                constant: '" ',
            },
            {
                field: 'http.response.status_code',
            },
            {
                constant: ' ',
            },
            {
                field: 'haproxy.http.request.time_wait_ms',
            },
            {
                constant: '/',
            },
            {
                field: 'event.duration',
            },
            {
                constant: '/',
            },
            {
                field: 'haproxy.connection_wait_time_ms',
            },
            {
                constant: '/',
            },
            {
                field: 'haproxy.http.request.time_wait_without_data_ms',
            },
            {
                constant: '/',
            },
            {
                field: 'event.duration',
            },
            {
                constant: ' ',
            },
            ...commonConnectionStatsFields,
            {
                constant: ' ',
            },
            ...commonQueueStatsFields,
        ],
    },
    {
        // ECS
        when: {
            exists: ['ecs.version', 'haproxy.connections.active'],
        },
        format: [
            {
                constant: '[HAProxy][tcp] ',
            },
            ...ecsFrontendFields,
            ...commonBackendFields,
            {
                constant: ' ',
            },
            ...commonConnectionStatsFields,
            {
                constant: ' ',
            },
            ...commonQueueStatsFields,
        ],
    },
    {
        // ECS
        when: {
            exists: ['ecs.version', 'haproxy.error_message'],
        },
        format: [
            {
                constant: '[HAProxy] ',
            },
            ...ecsFrontendFields,
            {
                constant: ' ',
            },
            {
                field: 'haproxy.error_message',
            },
        ],
    },
    {
        // ECS
        when: {
            exists: ['ecs.version', 'haproxy.frontend_name'],
        },
        format: [
            {
                constant: '[HAProxy] ',
            },
            ...ecsFrontendFields,
        ],
    },
    {
        // pre-ECS
        when: {
            exists: ['haproxy.http.request.raw_request_line'],
        },
        format: [
            {
                constant: '[HAProxy][http] ',
            },
            ...preEcsFrontendFields,
            ...commonBackendFields,
            {
                constant: ' "',
            },
            {
                field: 'haproxy.http.request.raw_request_line',
            },
            {
                constant: '" ',
            },
            {
                field: 'haproxy.http.response.status_code',
            },
            {
                constant: ' ',
            },
            {
                field: 'haproxy.http.request.time_wait_ms',
            },
            {
                constant: '/',
            },
            {
                field: 'haproxy.total_waiting_time_ms',
            },
            {
                constant: '/',
            },
            {
                field: 'haproxy.connection_wait_time_ms',
            },
            {
                constant: '/',
            },
            {
                field: 'haproxy.http.request.time_wait_without_data_ms',
            },
            {
                constant: '/',
            },
            {
                field: 'haproxy.http.request.time_active_ms',
            },
            {
                constant: ' ',
            },
            ...commonConnectionStatsFields,
            {
                constant: ' ',
            },
            ...commonQueueStatsFields,
        ],
    },
    {
        // pre-ECS
        when: {
            exists: ['haproxy.connections.active'],
        },
        format: [
            {
                constant: '[HAProxy][tcp] ',
            },
            ...preEcsFrontendFields,
            ...commonBackendFields,
            {
                constant: ' ',
            },
            ...commonConnectionStatsFields,
            {
                constant: ' ',
            },
            ...commonQueueStatsFields,
        ],
    },
    {
        // pre-ECS
        when: {
            exists: ['haproxy.error_message'],
        },
        format: [
            {
                constant: '[HAProxy] ',
            },
            ...preEcsFrontendFields,
            {
                constant: ' ',
            },
            {
                field: 'haproxy.error_message',
            },
        ],
    },
    {
        // pre-ECS
        when: {
            exists: ['haproxy.frontend_name'],
        },
        format: [
            {
                constant: '[HAProxy] ',
            },
            ...preEcsFrontendFields,
        ],
    },
];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9kb21haW5zL2xvZ19lbnRyaWVzX2RvbWFpbi9idWlsdGluX3J1bGVzL2ZpbGViZWF0X2hhcHJveHkudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvZG9tYWlucy9sb2dfZW50cmllc19kb21haW4vYnVpbHRpbl9ydWxlcy9maWxlYmVhdF9oYXByb3h5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILE1BQU0saUJBQWlCLEdBQUc7SUFDeEI7UUFDRSxLQUFLLEVBQUUsZ0JBQWdCO0tBQ3hCO0lBQ0Q7UUFDRSxRQUFRLEVBQUUsR0FBRztLQUNkO0lBQ0Q7UUFDRSxLQUFLLEVBQUUsYUFBYTtLQUNyQjtJQUNEO1FBQ0UsUUFBUSxFQUFFLEdBQUc7S0FDZDtJQUNEO1FBQ0UsS0FBSyxFQUFFLHVCQUF1QjtLQUMvQjtDQUNGLENBQUM7QUFFRixNQUFNLG9CQUFvQixHQUFHO0lBQzNCO1FBQ0UsS0FBSyxFQUFFLG1CQUFtQjtLQUMzQjtJQUNEO1FBQ0UsUUFBUSxFQUFFLEdBQUc7S0FDZDtJQUNEO1FBQ0UsS0FBSyxFQUFFLHFCQUFxQjtLQUM3QjtJQUNEO1FBQ0UsUUFBUSxFQUFFLEdBQUc7S0FDZDtJQUNEO1FBQ0UsS0FBSyxFQUFFLHVCQUF1QjtLQUMvQjtDQUNGLENBQUM7QUFFRixNQUFNLG1CQUFtQixHQUFHO0lBQzFCO1FBQ0UsUUFBUSxFQUFFLE1BQU07S0FDakI7SUFDRDtRQUNFLEtBQUssRUFBRSxzQkFBc0I7S0FDOUI7SUFDRDtRQUNFLFFBQVEsRUFBRSxHQUFHO0tBQ2Q7SUFDRDtRQUNFLEtBQUssRUFBRSxxQkFBcUI7S0FDN0I7Q0FDRixDQUFDO0FBRUYsTUFBTSwyQkFBMkIsR0FBRztJQUNs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RSxHQUFHO2FBQ2Q7WUFDRCxHQUFHLDJCQUEyQjtZQUM5QjtnQkFDRSxRQUFRLEVBQUUsR0FBRzthQUNkO1lBQ0QsR0FBRyxzQkFBc0I7U0FDMUI7S0FDRjtJQUNEO1FBQ0UsVUFBVTtRQUNWLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxDQUFDLHVCQUF1QixDQUFDO1NBQ2xDO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsUUFBUSxFQUFFLFlBQVk7YUFDdkI7WUFDRCxHQUFHLG9CQUFvQjtZQUN2QjtnQkFDRSxRQUFRLEVBQUUsR0FBRzthQUNkO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLHVCQUF1QjthQUMvQjtTQUNGO0tBQ0Y7SUFDRDtRQUNFLFVBQVU7UUFDVixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztTQUNsQztRQUNELE1BQU0sRUFBRTtZQUNOO2dCQUNFLFFBQVEsRUFBRSxZQUFZO2FBQ3ZCO1lBQ0QsR0FBRyxvQkFBb0I7U0FDeEI7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5jb25zdCBlY3NGcm9udGVuZEZpZWxkcyA9IFtcbiAge1xuICAgIGZpZWxkOiAnc291cmNlLmFkZHJlc3MnLFxuICB9LFxuICB7XG4gICAgY29uc3RhbnQ6ICc6JyxcbiAgfSxcbiAge1xuICAgIGZpZWxkOiAnc291cmNlLnBvcnQnLFxuICB9LFxuICB7XG4gICAgY29uc3RhbnQ6ICcgJyxcbiAgfSxcbiAge1xuICAgIGZpZWxkOiAnaGFwcm94eS5mcm9udGVuZF9uYW1lJyxcbiAgfSxcbl07XG5cbmNvbnN0IHByZUVjc0Zyb250ZW5kRmllbGRzID0gW1xuICB7XG4gICAgZmllbGQ6ICdoYXByb3h5LmNsaWVudC5pcCcsXG4gIH0sXG4gIHtcbiAgICBjb25zdGFudDogJzonLFxuICB9LFxuICB7XG4gICAgZmllbGQ6ICdoYXByb3h5LmNsaWVudC5wb3J0JyxcbiAgfSxcbiAge1xuICAgIGNvbnN0YW50OiAnICcsXG4gIH0sXG4gIHtcbiAgICBmaWVsZDogJ2hhcHJveHkuZnJvbnRlbmRfbmFtZScsXG4gIH0sXG5dO1xuXG5jb25zdCBjb21tb25CYWNrZW5kRmllbGRzID0gW1xuICB7XG4gICAgY29uc3RhbnQ6ICcgLT4gJyxcbiAgfSxcbiAge1xuICAgIGZpZWxkOiAnaGFwcm94eS5iYWNrZW5kX25hbWUnLFxuICB9LFxuICB7XG4gICAgY29uc3RhbnQ6ICcvJyxcbiAgfSxcbiAge1xuICAgIGZpZWxkOiAnaGFwcm94eS5zZXJ2ZXJfbmFtZScsXG4gIH0sXG5dO1xuXG5jb25zdCBjb21tb25Db25uZWN0aW9uU3RhdHNGaWVsZHMgPSBbXG4gIHtcbiAgICBmaWVsZDogJ2hhcHJveHkuY29ubmVjdGlvbnMuYWN0aXZlJyxcbiAgfSxcbiAge1xuICAgIGNvbnN0YW50OiAnLycsXG4gIH0sXG4gIHtcbiAgICBmaWVsZDogJ2hhcHJveHkuY29ubmVjdGlvbnMuZnJvbnRlbmQnLFxuICB9LFxuICB7XG4gICAgY29uc3RhbnQ6ICcvJyxcbiAgfSxcbiAge1xuICAgIGZpZWxkOiAnaGFwcm94eS5jb25uZWN0aW9ucy5iYWNrZW5kJyxcbiAgfSxcbiAge1xuICAgIGNvbnN0YW50OiAnLycsXG4gIH0sXG4gIHtcbiAgICBmaWVsZDogJ2hhcHJveHkuY29ubmVjdGlvbnMuc2VydmVyJyxcbiAgfSxcbiAge1xuICAgIGNvbnN0YW50OiAnLycsXG4gIH0sXG4gIHtcbiAgICBmaWVsZDogJ2hhcHJveHkuY29ubmVjdGlvbnMucmV0cmllcycsXG4gIH0sXG5dO1xuXG5jb25zdCBjb21tb25RdWV1ZVN0YXRzRmllbGRzID0gW1xuICB7XG4gICAgZmllbGQ6ICdoYXByb3h5LnNlcnZlcl9xdWV1ZScsXG4gIH0sXG4gIHtcbiAgICBjb25zdGFudDogJy8nLFxuICB9LFxuICB7XG4gICAgZmllbGQ6ICdoYXByb3h5LmJhY2tlbmRfcXVldWUnLFxuICB9LFxuXTtcblxuZXhwb3J0IGNvbnN0IGZpbGViZWF0SGFwcm94eVJ1bGVzID0gW1xuICB7XG4gICAgLy8gRUNTXG4gICAgd2hlbjoge1xuICAgICAgZXhpc3RzOiBbJ2Vjcy52ZXJzaW9uJywgJ2hhcHJveHkuaHR0cC5yZXF1ZXN0LnJhd19yZXF1ZXN0X2xpbmUnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1tIQVByb3h5XVtodHRwXSAnLFxuICAgICAgfSxcbiAgICAgIC4uLmVjc0Zyb250ZW5kRmllbGRzLFxuICAgICAgLi4uY29tbW9uQmFja2VuZEZpZWxkcyxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgXCInLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdoYXByb3h5Lmh0dHAucmVxdWVzdC5yYXdfcmVxdWVzdF9saW5lJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnXCIgJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaHR0cC5yZXNwb25zZS5zdGF0dXNfY29kZScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdoYXByb3h5Lmh0dHAucmVxdWVzdC50aW1lX3dhaXRfbXMnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcvJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnZXZlbnQuZHVyYXRpb24nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcvJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaGFwcm94eS5jb25uZWN0aW9uX3dhaXRfdGltZV9tcycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJy8nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdoYXByb3h5Lmh0dHAucmVxdWVzdC50aW1lX3dhaXRfd2l0aG91dF9kYXRhX21zJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnLycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2V2ZW50LmR1cmF0aW9uJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnICcsXG4gICAgICB9LFxuICAgICAgLi4uY29tbW9uQ29ubmVjdGlvblN0YXRzRmllbGRzLFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIC4uLmNvbW1vblF1ZXVlU3RhdHNGaWVsZHMsXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIC8vIEVDU1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydlY3MudmVyc2lvbicsICdoYXByb3h5LmNvbm5lY3Rpb25zLmFjdGl2ZSddLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnW0hBUHJveHldW3RjcF0gJyxcbiAgICAgIH0sXG4gICAgICAuLi5lY3NGcm9udGVuZEZpZWxkcyxcbiAgICAgIC4uLmNvbW1vbkJhY2tlbmRGaWVsZHMsXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnICcsXG4gICAgICB9LFxuICAgICAgLi4uY29tbW9uQ29ubmVjdGlvblN0YXRzRmllbGRzLFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIC4uLmNvbW1vblF1ZXVlU3RhdHNGaWVsZHMsXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIC8vIEVDU1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydlY3MudmVyc2lvbicsICdoYXByb3h5LmVycm9yX21lc3NhZ2UnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1tIQVByb3h5XSAnLFxuICAgICAgfSxcbiAgICAgIC4uLmVjc0Zyb250ZW5kRmllbGRzLFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdoYXByb3h5LmVycm9yX21lc3NhZ2UnLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgLy8gRUNTXG4gICAgd2hlbjoge1xuICAgICAgZXhpc3RzOiBbJ2Vjcy52ZXJzaW9uJywgJ2hhcHJveHkuZnJvbnRlbmRfbmFtZSddLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnW0hBUHJveHldICcsXG4gICAgICB9LFxuICAgICAgLi4uZWNzRnJvbnRlbmRGaWVsZHMsXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIC8vIHByZS1FQ1NcbiAgICB3aGVuOiB7XG4gICAgICBleGlzdHM6IFsnaGFwcm94eS5odHRwLnJlcXVlc3QucmF3X3JlcXVlc3RfbGluZSddLFxuICAgIH0sXG4gICAgZm9ybWF0OiBbXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnW0hBUHJveHldW2h0dHBdICcsXG4gICAgICB9LFxuICAgICAgLi4ucHJlRWNzRnJvbnRlbmRGaWVsZHMsXG4gICAgICAuLi5jb21tb25CYWNrZW5kRmllbGRzLFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyBcIicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2hhcHJveHkuaHR0cC5yZXF1ZXN0LnJhd19yZXF1ZXN0X2xpbmUnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdcIiAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdoYXByb3h5Lmh0dHAucmVzcG9uc2Uuc3RhdHVzX2NvZGUnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaGFwcm94eS5odHRwLnJlcXVlc3QudGltZV93YWl0X21zJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnLycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2hhcHJveHkudG90YWxfd2FpdGluZ190aW1lX21zJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnLycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogJ2hhcHJveHkuY29ubmVjdGlvbl93YWl0X3RpbWVfbXMnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcvJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiAnaGFwcm94eS5odHRwLnJlcXVlc3QudGltZV93YWl0X3dpdGhvdXRfZGF0YV9tcycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJy8nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdoYXByb3h5Lmh0dHAucmVxdWVzdC50aW1lX2FjdGl2ZV9tcycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIC4uLmNvbW1vbkNvbm5lY3Rpb25TdGF0c0ZpZWxkcyxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgJyxcbiAgICAgIH0sXG4gICAgICAuLi5jb21tb25RdWV1ZVN0YXRzRmllbGRzLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICAvLyBwcmUtRUNTXG4gICAgd2hlbjoge1xuICAgICAgZXhpc3RzOiBbJ2hhcHJveHkuY29ubmVjdGlvbnMuYWN0aXZlJ10sXG4gICAgfSxcbiAgICBmb3JtYXQ6IFtcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICdbSEFQcm94eV1bdGNwXSAnLFxuICAgICAgfSxcbiAgICAgIC4uLnByZUVjc0Zyb250ZW5kRmllbGRzLFxuICAgICAgLi4uY29tbW9uQmFja2VuZEZpZWxkcyxcbiAgICAgIHtcbiAgICAgICAgY29uc3RhbnQ6ICcgJyxcbiAgICAgIH0sXG4gICAgICAuLi5jb21tb25Db25uZWN0aW9uU3RhdHNGaWVsZHMsXG4gICAgICB7XG4gICAgICAgIGNvbnN0YW50OiAnICcsXG4gICAgICB9LFxuICAgICAgLi4uY29tbW9uUXVldWVTdGF0c0ZpZWxkcyxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgLy8gcHJlLUVDU1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydoYXByb3h5LmVycm9yX21lc3NhZ2UnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1tIQVByb3h5XSAnLFxuICAgICAgfSxcbiAgICAgIC4uLnByZUVjc0Zyb250ZW5kRmllbGRzLFxuICAgICAge1xuICAgICAgICBjb25zdGFudDogJyAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6ICdoYXByb3h5LmVycm9yX21lc3NhZ2UnLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgLy8gcHJlLUVDU1xuICAgIHdoZW46IHtcbiAgICAgIGV4aXN0czogWydoYXByb3h5LmZyb250ZW5kX25hbWUnXSxcbiAgICB9LFxuICAgIGZvcm1hdDogW1xuICAgICAge1xuICAgICAgICBjb25zdGFudDogJ1tIQVByb3h5XSAnLFxuICAgICAgfSxcbiAgICAgIC4uLnByZUVjc0Zyb250ZW5kRmllbGRzLFxuICAgIF0sXG4gIH0sXG5dO1xuIl19