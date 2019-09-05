"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRate = (nodeType) => {
    return {
        count: {
            bucket_script: {
                buckets_path: { count: '_count' },
                script: {
                    source: 'count * 1',
                    lang: 'expression',
                },
                gap_policy: 'skip',
            },
        },
        cumsum: {
            cumulative_sum: {
                buckets_path: 'count',
            },
        },
        logRate: {
            derivative: {
                buckets_path: 'cumsum',
                gap_policy: 'skip',
                unit: '1s',
            },
        },
    };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9ub2Rlcy9tZXRyaWNfYWdncmVnYXRpb25fY3JlYXRvcnMvbG9nX3JhdGUudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvYWRhcHRlcnMvbm9kZXMvbWV0cmljX2FnZ3JlZ2F0aW9uX2NyZWF0b3JzL2xvZ19yYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUlVLFFBQUEsT0FBTyxHQUFzQixDQUFDLFFBQXVCLEVBQUUsRUFBRTtJQUNwRSxPQUFPO1FBQ0wsS0FBSyxFQUFFO1lBQ0wsYUFBYSxFQUFFO2dCQUNiLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7Z0JBQ2pDLE1BQU0sRUFBRTtvQkFDTixNQUFNLEVBQUUsV0FBVztvQkFDbkIsSUFBSSxFQUFFLFlBQVk7aUJBQ25CO2dCQUNELFVBQVUsRUFBRSxNQUFNO2FBQ25CO1NBQ0Y7UUFDRCxNQUFNLEVBQUU7WUFDTixjQUFjLEVBQUU7Z0JBQ2QsWUFBWSxFQUFFLE9BQU87YUFDdEI7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQLFVBQVUsRUFBRTtnQkFDVixZQUFZLEVBQUUsUUFBUTtnQkFDdEIsVUFBVSxFQUFFLE1BQU07Z0JBQ2xCLElBQUksRUFBRSxJQUFJO2FBQ1g7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmZyYU5vZGVNZXRyaWNGbiwgSW5mcmFOb2RlVHlwZSB9IGZyb20gJy4uL2FkYXB0ZXJfdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgbG9nUmF0ZTogSW5mcmFOb2RlTWV0cmljRm4gPSAobm9kZVR5cGU6IEluZnJhTm9kZVR5cGUpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBjb3VudDoge1xuICAgICAgYnVja2V0X3NjcmlwdDoge1xuICAgICAgICBidWNrZXRzX3BhdGg6IHsgY291bnQ6ICdfY291bnQnIH0sXG4gICAgICAgIHNjcmlwdDoge1xuICAgICAgICAgIHNvdXJjZTogJ2NvdW50ICogMScsXG4gICAgICAgICAgbGFuZzogJ2V4cHJlc3Npb24nLFxuICAgICAgICB9LFxuICAgICAgICBnYXBfcG9saWN5OiAnc2tpcCcsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY3Vtc3VtOiB7XG4gICAgICBjdW11bGF0aXZlX3N1bToge1xuICAgICAgICBidWNrZXRzX3BhdGg6ICdjb3VudCcsXG4gICAgICB9LFxuICAgIH0sXG4gICAgbG9nUmF0ZToge1xuICAgICAgZGVyaXZhdGl2ZToge1xuICAgICAgICBidWNrZXRzX3BhdGg6ICdjdW1zdW0nLFxuICAgICAgICBnYXBfcG9saWN5OiAnc2tpcCcsXG4gICAgICAgIHVuaXQ6ICcxcycsXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59O1xuIl19