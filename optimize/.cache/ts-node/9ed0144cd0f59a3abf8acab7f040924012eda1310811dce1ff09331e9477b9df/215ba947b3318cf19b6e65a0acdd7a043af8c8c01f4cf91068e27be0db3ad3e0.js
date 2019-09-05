"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
// @ts-ignore
const url_1 = tslib_1.__importDefault(require("url"));
const get_absolute_url_1 = require("./get_absolute_url");
function getSavedObjectAbsoluteUrl(job, relativeUrl, server) {
    const getAbsoluteUrl = get_absolute_url_1.getAbsoluteUrlFactory(server);
    const { pathname: path, hash, search } = url_1.default.parse(relativeUrl);
    return getAbsoluteUrl({ basePath: job.basePath, path, hash, search });
}
exports.addForceNowQuerystring = async ({ job, conditionalHeaders, logo, server, }) => {
    // if no URLS then its from PNG which should only have one so put it in the array and process as PDF does
    if (!job.urls) {
        if (!job.relativeUrl) {
            throw new Error(`Unable to generate report. Url is not defined.`);
        }
        job.urls = [getSavedObjectAbsoluteUrl(job, job.relativeUrl, server)];
    }
    const urls = job.urls.map(jobUrl => {
        if (!job.forceNow) {
            return jobUrl;
        }
        const parsed = url_1.default.parse(jobUrl, true);
        const hash = url_1.default.parse(parsed.hash.replace(/^#/, ''), true);
        const transformedHash = url_1.default.format({
            pathname: hash.pathname,
            query: {
                ...hash.query,
                forceNow: job.forceNow,
            },
        });
        return url_1.default.format({
            ...parsed,
            hash: transformedHash,
        });
    });
    return { job, conditionalHeaders, logo, urls, server };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvcmVwb3J0aW5nL2V4cG9ydF90eXBlcy9jb21tb24vZXhlY3V0ZV9qb2IvYWRkX2ZvcmNlX25vd19xdWVyeV9zdHJpbmcudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3JlcG9ydGluZy9leHBvcnRfdHlwZXMvY29tbW9uL2V4ZWN1dGVfam9iL2FkZF9mb3JjZV9ub3dfcXVlcnlfc3RyaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7O0dBSUc7QUFDSCxhQUFhO0FBQ2Isc0RBQXNCO0FBRXRCLHlEQUEyRDtBQUUzRCxTQUFTLHlCQUF5QixDQUFDLEdBQWlCLEVBQUUsV0FBbUIsRUFBRSxNQUFpQjtJQUMxRixNQUFNLGNBQWMsR0FBUSx3Q0FBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUUxRCxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsYUFBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNoRSxPQUFPLGNBQWMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUN4RSxDQUFDO0FBRVksUUFBQSxzQkFBc0IsR0FBRyxLQUFLLEVBQUUsRUFDM0MsR0FBRyxFQUNILGtCQUFrQixFQUNsQixJQUFJLEVBQ0osTUFBTSxHQU1QLEVBQUUsRUFBRTtJQUNILHlHQUF5RztJQUN6RyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtRQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQztTQUNuRTtRQUNELEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ3RFO0lBRUQsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUU7WUFDakIsT0FBTyxNQUFNLENBQUM7U0FDZjtRQUVELE1BQU0sTUFBTSxHQUFRLGFBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVDLE1BQU0sSUFBSSxHQUFRLGFBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWpFLE1BQU0sZUFBZSxHQUFHLGFBQUcsQ0FBQyxNQUFNLENBQUM7WUFDakMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLEtBQUssRUFBRTtnQkFDTCxHQUFHLElBQUksQ0FBQyxLQUFLO2dCQUNiLFFBQVEsRUFBRSxHQUFHLENBQUMsUUFBUTthQUN2QjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU8sYUFBRyxDQUFDLE1BQU0sQ0FBQztZQUNoQixHQUFHLE1BQU07WUFDVCxJQUFJLEVBQUUsZUFBZTtTQUN0QixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sRUFBRSxHQUFHLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUN6RCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xuaW1wb3J0IHsgQ29uZGl0aW9uYWxIZWFkZXJzLCBLYm5TZXJ2ZXIsIFJlcG9ydGluZ0pvYiB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJztcbmltcG9ydCB7IGdldEFic29sdXRlVXJsRmFjdG9yeSB9IGZyb20gJy4vZ2V0X2Fic29sdXRlX3VybCc7XG5cbmZ1bmN0aW9uIGdldFNhdmVkT2JqZWN0QWJzb2x1dGVVcmwoam9iOiBSZXBvcnRpbmdKb2IsIHJlbGF0aXZlVXJsOiBzdHJpbmcsIHNlcnZlcjogS2JuU2VydmVyKSB7XG4gIGNvbnN0IGdldEFic29sdXRlVXJsOiBhbnkgPSBnZXRBYnNvbHV0ZVVybEZhY3Rvcnkoc2VydmVyKTtcblxuICBjb25zdCB7IHBhdGhuYW1lOiBwYXRoLCBoYXNoLCBzZWFyY2ggfSA9IHVybC5wYXJzZShyZWxhdGl2ZVVybCk7XG4gIHJldHVybiBnZXRBYnNvbHV0ZVVybCh7IGJhc2VQYXRoOiBqb2IuYmFzZVBhdGgsIHBhdGgsIGhhc2gsIHNlYXJjaCB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IGFkZEZvcmNlTm93UXVlcnlzdHJpbmcgPSBhc3luYyAoe1xuICBqb2IsXG4gIGNvbmRpdGlvbmFsSGVhZGVycyxcbiAgbG9nbyxcbiAgc2VydmVyLFxufToge1xuICBqb2I6IFJlcG9ydGluZ0pvYjtcbiAgY29uZGl0aW9uYWxIZWFkZXJzPzogQ29uZGl0aW9uYWxIZWFkZXJzO1xuICBsb2dvPzogYW55O1xuICBzZXJ2ZXI6IEtiblNlcnZlcjtcbn0pID0+IHtcbiAgLy8gaWYgbm8gVVJMUyB0aGVuIGl0cyBmcm9tIFBORyB3aGljaCBzaG91bGQgb25seSBoYXZlIG9uZSBzbyBwdXQgaXQgaW4gdGhlIGFycmF5IGFuZCBwcm9jZXNzIGFzIFBERiBkb2VzXG4gIGlmICgham9iLnVybHMpIHtcbiAgICBpZiAoIWpvYi5yZWxhdGl2ZVVybCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZ2VuZXJhdGUgcmVwb3J0LiBVcmwgaXMgbm90IGRlZmluZWQuYCk7XG4gICAgfVxuICAgIGpvYi51cmxzID0gW2dldFNhdmVkT2JqZWN0QWJzb2x1dGVVcmwoam9iLCBqb2IucmVsYXRpdmVVcmwsIHNlcnZlcildO1xuICB9XG5cbiAgY29uc3QgdXJscyA9IGpvYi51cmxzLm1hcChqb2JVcmwgPT4ge1xuICAgIGlmICgham9iLmZvcmNlTm93KSB7XG4gICAgICByZXR1cm4gam9iVXJsO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcnNlZDogYW55ID0gdXJsLnBhcnNlKGpvYlVybCwgdHJ1ZSk7XG4gICAgY29uc3QgaGFzaDogYW55ID0gdXJsLnBhcnNlKHBhcnNlZC5oYXNoLnJlcGxhY2UoL14jLywgJycpLCB0cnVlKTtcblxuICAgIGNvbnN0IHRyYW5zZm9ybWVkSGFzaCA9IHVybC5mb3JtYXQoe1xuICAgICAgcGF0aG5hbWU6IGhhc2gucGF0aG5hbWUsXG4gICAgICBxdWVyeToge1xuICAgICAgICAuLi5oYXNoLnF1ZXJ5LFxuICAgICAgICBmb3JjZU5vdzogam9iLmZvcmNlTm93LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiB1cmwuZm9ybWF0KHtcbiAgICAgIC4uLnBhcnNlZCxcbiAgICAgIGhhc2g6IHRyYW5zZm9ybWVkSGFzaCxcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHsgam9iLCBjb25kaXRpb25hbEhlYWRlcnMsIGxvZ28sIHVybHMsIHNlcnZlciB9O1xufTtcbiJdfQ==