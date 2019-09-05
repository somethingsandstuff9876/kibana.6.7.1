"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidNode = async (search, indexPattern, field, id) => {
    const params = {
        index: indexPattern,
        rest_total_hits_as_int: true,
        terminateAfter: 1,
        body: {
            size: 0,
            query: {
                match: {
                    [field]: id,
                },
            },
        },
    };
    return (await search(params)).hits.total > 0;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xpYi9hZGFwdGVycy9tZXRyaWNzL2xpYi9jaGVja192YWxpZF9ub2RlLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbGliL2FkYXB0ZXJzL21ldHJpY3MvbGliL2NoZWNrX3ZhbGlkX25vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBSVUsUUFBQSxjQUFjLEdBQUcsS0FBSyxFQUNqQyxNQUErRixFQUMvRixZQUErQixFQUMvQixLQUFhLEVBQ2IsRUFBVSxFQUNRLEVBQUU7SUFDcEIsTUFBTSxNQUFNLEdBQUc7UUFDYixLQUFLLEVBQUUsWUFBWTtRQUNuQixzQkFBc0IsRUFBRSxJQUFJO1FBQzVCLGNBQWMsRUFBRSxDQUFDO1FBQ2pCLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxDQUFDO1lBQ1AsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRTtvQkFDTCxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUU7aUJBQ1o7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUNGLE9BQU8sQ0FBQyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQy9DLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluZnJhRGF0YWJhc2VTZWFyY2hSZXNwb25zZSB9IGZyb20gJy4uLy4uL2ZyYW1ld29yayc7XG5cbmV4cG9ydCBjb25zdCBjaGVja1ZhbGlkTm9kZSA9IGFzeW5jIChcbiAgc2VhcmNoOiA8QWdncmVnYXRpb24+KG9wdGlvbnM6IG9iamVjdCkgPT4gUHJvbWlzZTxJbmZyYURhdGFiYXNlU2VhcmNoUmVzcG9uc2U8e30sIEFnZ3JlZ2F0aW9uPj4sXG4gIGluZGV4UGF0dGVybjogc3RyaW5nIHwgc3RyaW5nW10sXG4gIGZpZWxkOiBzdHJpbmcsXG4gIGlkOiBzdHJpbmdcbik6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICBjb25zdCBwYXJhbXMgPSB7XG4gICAgaW5kZXg6IGluZGV4UGF0dGVybixcbiAgICByZXN0X3RvdGFsX2hpdHNfYXNfaW50OiB0cnVlLFxuICAgIHRlcm1pbmF0ZUFmdGVyOiAxLFxuICAgIGJvZHk6IHtcbiAgICAgIHNpemU6IDAsXG4gICAgICBxdWVyeToge1xuICAgICAgICBtYXRjaDoge1xuICAgICAgICAgIFtmaWVsZF06IGlkLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xuICByZXR1cm4gKGF3YWl0IHNlYXJjaChwYXJhbXMpKS5oaXRzLnRvdGFsID4gMDtcbn07XG4iXX0=