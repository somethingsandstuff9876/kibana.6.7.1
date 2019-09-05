"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_types_1 = require("../adapter_types");
exports.rate = (id, fields) => (nodeType) => {
    const field = fields[nodeType];
    if (field) {
        return {
            [`${id}_max`]: { max: { field } },
            [`${id}_deriv`]: {
                derivative: {
                    buckets_path: `${id}_max`,
                    gap_policy: 'skip',
                    unit: '1s',
                },
            },
            [id]: {
                bucket_script: {
                    buckets_path: { value: `${id}_deriv[normalized_value]` },
                    script: {
                        source: 'params.value > 0.0 ? params.value : 0.0',
                        lang: 'painless',
                    },
                    gap_policy: 'skip',
                },
            },
        };
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9ub2Rlcy9tZXRyaWNfYWdncmVnYXRpb25fY3JlYXRvcnMvcmF0ZS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9ub2Rlcy9tZXRyaWNfYWdncmVnYXRpb25fY3JlYXRvcnMvcmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFFSCxvREFBb0U7QUFRdkQsUUFBQSxJQUFJLEdBQUcsQ0FBQyxFQUFVLEVBQUUsTUFBYyxFQUFxQixFQUFFLENBQUMsQ0FDckUsUUFBdUIsRUFDdkIsRUFBRTtJQUNGLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMvQixJQUFJLEtBQUssRUFBRTtRQUNULE9BQU87WUFDTCxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ2pDLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxFQUFFO2dCQUNmLFVBQVUsRUFBRTtvQkFDVixZQUFZLEVBQUUsR0FBRyxFQUFFLE1BQU07b0JBQ3pCLFVBQVUsRUFBRSxNQUFNO29CQUNsQixJQUFJLEVBQUUsSUFBSTtpQkFDWDthQUNGO1lBQ0QsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDSixhQUFhLEVBQUU7b0JBQ2IsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSwwQkFBMEIsRUFBRTtvQkFDeEQsTUFBTSxFQUFFO3dCQUNOLE1BQU0sRUFBRSx5Q0FBeUM7d0JBQ2pELElBQUksRUFBRSxVQUFVO3FCQUNqQjtvQkFDRCxVQUFVLEVBQUUsTUFBTTtpQkFDbkI7YUFDRjtTQUNGLENBQUM7S0FDSDtBQUNILENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluZnJhTm9kZU1ldHJpY0ZuLCBJbmZyYU5vZGVUeXBlIH0gZnJvbSAnLi4vYWRhcHRlcl90eXBlcyc7XG5cbmludGVyZmFjZSBGaWVsZHMge1xuICBbSW5mcmFOb2RlVHlwZS5jb250YWluZXJdOiBzdHJpbmc7XG4gIFtJbmZyYU5vZGVUeXBlLnBvZF06IHN0cmluZztcbiAgW0luZnJhTm9kZVR5cGUuaG9zdF06IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IHJhdGUgPSAoaWQ6IHN0cmluZywgZmllbGRzOiBGaWVsZHMpOiBJbmZyYU5vZGVNZXRyaWNGbiA9PiAoXG4gIG5vZGVUeXBlOiBJbmZyYU5vZGVUeXBlXG4pID0+IHtcbiAgY29uc3QgZmllbGQgPSBmaWVsZHNbbm9kZVR5cGVdO1xuICBpZiAoZmllbGQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW2Ake2lkfV9tYXhgXTogeyBtYXg6IHsgZmllbGQgfSB9LFxuICAgICAgW2Ake2lkfV9kZXJpdmBdOiB7XG4gICAgICAgIGRlcml2YXRpdmU6IHtcbiAgICAgICAgICBidWNrZXRzX3BhdGg6IGAke2lkfV9tYXhgLFxuICAgICAgICAgIGdhcF9wb2xpY3k6ICdza2lwJyxcbiAgICAgICAgICB1bml0OiAnMXMnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFtpZF06IHtcbiAgICAgICAgYnVja2V0X3NjcmlwdDoge1xuICAgICAgICAgIGJ1Y2tldHNfcGF0aDogeyB2YWx1ZTogYCR7aWR9X2Rlcml2W25vcm1hbGl6ZWRfdmFsdWVdYCB9LFxuICAgICAgICAgIHNjcmlwdDoge1xuICAgICAgICAgICAgc291cmNlOiAncGFyYW1zLnZhbHVlID4gMC4wID8gcGFyYW1zLnZhbHVlIDogMC4wJyxcbiAgICAgICAgICAgIGxhbmc6ICdwYWlubGVzcycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnYXBfcG9saWN5OiAnc2tpcCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn07XG4iXX0=