"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = (nodeType) => {
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
    };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9ub2Rlcy9tZXRyaWNfYWdncmVnYXRpb25fY3JlYXRvcnMvY291bnQudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9saWIvYWRhcHRlcnMvbm9kZXMvbWV0cmljX2FnZ3JlZ2F0aW9uX2NyZWF0b3JzL2NvdW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUlVLFFBQUEsS0FBSyxHQUFzQixDQUFDLFFBQXVCLEVBQUUsRUFBRTtJQUNsRSxPQUFPO1FBQ0wsS0FBSyxFQUFFO1lBQ0wsYUFBYSxFQUFFO2dCQUNiLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7Z0JBQ2pDLE1BQU0sRUFBRTtvQkFDTixNQUFNLEVBQUUsV0FBVztvQkFDbkIsSUFBSSxFQUFFLFlBQVk7aUJBQ25CO2dCQUNELFVBQVUsRUFBRSxNQUFNO2FBQ25CO1NBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5mcmFOb2RlTWV0cmljRm4sIEluZnJhTm9kZVR5cGUgfSBmcm9tICcuLi9hZGFwdGVyX3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IGNvdW50OiBJbmZyYU5vZGVNZXRyaWNGbiA9IChub2RlVHlwZTogSW5mcmFOb2RlVHlwZSkgPT4ge1xuICByZXR1cm4ge1xuICAgIGNvdW50OiB7XG4gICAgICBidWNrZXRfc2NyaXB0OiB7XG4gICAgICAgIGJ1Y2tldHNfcGF0aDogeyBjb3VudDogJ19jb3VudCcgfSxcbiAgICAgICAgc2NyaXB0OiB7XG4gICAgICAgICAgc291cmNlOiAnY291bnQgKiAxJyxcbiAgICAgICAgICBsYW5nOiAnZXhwcmVzc2lvbicsXG4gICAgICAgIH0sXG4gICAgICAgIGdhcF9wb2xpY3k6ICdza2lwJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn07XG4iXX0=