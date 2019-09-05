"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Boom = tslib_1.__importStar(require("boom"));
const Joi = tslib_1.__importStar(require("joi"));
const converters_1 = require("./converters");
const schemas_1 = require("./schemas");
exports.initSearchSummaryRoutes = (framework) => {
    const callWithRequest = framework.callWithRequest;
    framework.registerRoute({
        options: {
            validate: {
                payload: Joi.object().keys({
                    bucketSize: schemas_1.summaryBucketSizeSchema.required(),
                    end: schemas_1.timestampSchema.required(),
                    fields: schemas_1.logEntryFieldsMappingSchema.required(),
                    indices: schemas_1.indicesSchema.required(),
                    query: Joi.string().required(),
                    start: schemas_1.timestampSchema.required(),
                }),
            },
        },
        handler: async (request) => {
            const timings = {
                esRequestSent: Date.now(),
                esResponseProcessed: 0,
            };
            try {
                const search = (params) => callWithRequest(request, 'search', params);
                const summaryBuckets = await fetchSummaryBuckets(search, request.payload.indices, request.payload.fields, request.payload.start, request.payload.end, request.payload.bucketSize, request.payload.query);
                timings.esResponseProcessed = Date.now();
                return {
                    buckets: summaryBuckets,
                    timings,
                };
            }
            catch (requestError) {
                throw Boom.boomify(requestError);
            }
        },
        method: 'POST',
        path: '/api/logging/search-summary',
    });
};
async function fetchSummaryBuckets(search, indices, fields, start, end, bucketSize, query) {
    const response = await search({
        allowNoIndices: true,
        body: {
            aggregations: {
                count_by_date: {
                    aggregations: {
                        top_entries: {
                            top_hits: {
                                _source: [fields.message],
                                size: 1,
                                sort: [{ [fields.time]: 'desc' }, { [fields.tiebreaker]: 'desc' }],
                            },
                        },
                    },
                    date_histogram: {
                        extended_bounds: {
                            max: end,
                            min: start,
                        },
                        field: fields.time,
                        interval: `${bucketSize.value}${bucketSize.unit}`,
                        min_doc_count: 0,
                    },
                },
            },
            query: {
                bool: {
                    filter: [
                        {
                            query_string: {
                                default_field: fields.message,
                                default_operator: 'AND',
                                query,
                            },
                        },
                        {
                            range: {
                                [fields.time]: {
                                    format: 'epoch_millis',
                                    gte: start,
                                    lt: end,
                                },
                            },
                        },
                    ],
                },
            },
            size: 0,
        },
        ignoreUnavailable: true,
        index: indices,
    });
    if (response.aggregations && response.aggregations.count_by_date) {
        return converters_1.convertDateHistogramToSearchSummaryBuckets(fields, end)(response.aggregations.count_by_date.buckets);
    }
    else {
        return [];
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xvZ2dpbmdfbGVnYWN5L3NlYXJjaF9zdW1tYXJ5LnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbG9nZ2luZ19sZWdhY3kvc2VhcmNoX3N1bW1hcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILG1EQUE2QjtBQUU3QixpREFBMkI7QUFXM0IsNkNBQTBFO0FBRTFFLHVDQUttQjtBQUVOLFFBQUEsdUJBQXVCLEdBQUcsQ0FBQyxTQUF1QyxFQUFFLEVBQUU7SUFDakYsTUFBTSxlQUFlLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQztJQUVsRCxTQUFTLENBQUMsYUFBYSxDQUdyQjtRQUNBLE9BQU8sRUFBRTtZQUNQLFFBQVEsRUFBRTtnQkFDUixPQUFPLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQztvQkFDekIsVUFBVSxFQUFFLGlDQUF1QixDQUFDLFFBQVEsRUFBRTtvQkFDOUMsR0FBRyxFQUFFLHlCQUFlLENBQUMsUUFBUSxFQUFFO29CQUMvQixNQUFNLEVBQUUscUNBQTJCLENBQUMsUUFBUSxFQUFFO29CQUM5QyxPQUFPLEVBQUUsdUJBQWEsQ0FBQyxRQUFRLEVBQUU7b0JBQ2pDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO29CQUM5QixLQUFLLEVBQUUseUJBQWUsQ0FBQyxRQUFRLEVBQUU7aUJBQ2xDLENBQUM7YUFDSDtTQUNGO1FBQ0QsT0FBTyxFQUFFLEtBQUssRUFBQyxPQUFPLEVBQUMsRUFBRTtZQUN2QixNQUFNLE9BQU8sR0FBRztnQkFDZCxhQUFhLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDekIsbUJBQW1CLEVBQUUsQ0FBQzth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WUFBWSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQzVDLENBQUM7S0FDSDtTQUFNO1FBQ0wsT0FBTyxFQUFFLENBQUM7S0FDWDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBCb29tIGZyb20gJ2Jvb20nO1xuaW1wb3J0IHsgU2VhcmNoUGFyYW1zIH0gZnJvbSAnZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQgKiBhcyBKb2kgZnJvbSAnam9pJztcblxuaW1wb3J0IHsgU2VhcmNoU3VtbWFyeUFwaVBvc3RQYXlsb2FkLCBTZWFyY2hTdW1tYXJ5QXBpUG9zdFJlc3BvbnNlIH0gZnJvbSAnLi4vLi4vY29tbW9uL2h0dHBfYXBpJztcbmltcG9ydCB7IExvZ0VudHJ5RmllbGRzTWFwcGluZyB9IGZyb20gJy4uLy4uL2NvbW1vbi9sb2dfZW50cnknO1xuaW1wb3J0IHsgU2VhcmNoU3VtbWFyeUJ1Y2tldCB9IGZyb20gJy4uLy4uL2NvbW1vbi9sb2dfc2VhcmNoX3N1bW1hcnknO1xuaW1wb3J0IHsgU3VtbWFyeUJ1Y2tldFNpemUgfSBmcm9tICcuLi8uLi9jb21tb24vbG9nX3N1bW1hcnknO1xuaW1wb3J0IHtcbiAgSW5mcmFCYWNrZW5kRnJhbWV3b3JrQWRhcHRlcixcbiAgSW5mcmFEYXRhYmFzZVNlYXJjaFJlc3BvbnNlLFxuICBJbmZyYVdyYXBwYWJsZVJlcXVlc3QsXG59IGZyb20gJy4uL2xpYi9hZGFwdGVycy9mcmFtZXdvcmsnO1xuaW1wb3J0IHsgY29udmVydERhdGVIaXN0b2dyYW1Ub1NlYXJjaFN1bW1hcnlCdWNrZXRzIH0gZnJvbSAnLi9jb252ZXJ0ZXJzJztcbmltcG9ydCB7IERhdGVIaXN0b2dyYW1SZXNwb25zZSB9IGZyb20gJy4vZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQge1xuICBpbmRpY2VzU2NoZW1hLFxuICBsb2dFbnRyeUZpZWxkc01hcHBpbmdTY2hlbWEsXG4gIHN1bW1hcnlCdWNrZXRTaXplU2NoZW1hLFxuICB0aW1lc3RhbXBTY2hlbWEsXG59IGZyb20gJy4vc2NoZW1hcyc7XG5cbmV4cG9ydCBjb25zdCBpbml0U2VhcmNoU3VtbWFyeVJvdXRlcyA9IChmcmFtZXdvcms6IEluZnJhQmFja2VuZEZyYW1ld29ya0FkYXB0ZXIpID0+IHtcbiAgY29uc3QgY2FsbFdpdGhSZXF1ZXN0ID0gZnJhbWV3b3JrLmNhbGxXaXRoUmVxdWVzdDtcblxuICBmcmFtZXdvcmsucmVnaXN0ZXJSb3V0ZTxcbiAgICBJbmZyYVdyYXBwYWJsZVJlcXVlc3Q8U2VhcmNoU3VtbWFyeUFwaVBvc3RQYXlsb2FkLCB7fSwge30+LFxuICAgIFByb21pc2U8U2VhcmNoU3VtbWFyeUFwaVBvc3RSZXNwb25zZT5cbiAgPih7XG4gICAgb3B0aW9uczoge1xuICAgICAgdmFsaWRhdGU6IHtcbiAgICAgICAgcGF5bG9hZDogSm9pLm9iamVjdCgpLmtleXMoe1xuICAgICAgICAgIGJ1Y2tldFNpemU6IHN1bW1hcnlCdWNrZXRTaXplU2NoZW1hLnJlcXVpcmVkKCksXG4gICAgICAgICAgZW5kOiB0aW1lc3RhbXBTY2hlbWEucmVxdWlyZWQoKSxcbiAgICAgICAgICBmaWVsZHM6IGxvZ0VudHJ5RmllbGRzTWFwcGluZ1NjaGVtYS5yZXF1aXJlZCgpLFxuICAgICAgICAgIGluZGljZXM6IGluZGljZXNTY2hlbWEucmVxdWlyZWQoKSxcbiAgICAgICAgICBxdWVyeTogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gICAgICAgICAgc3RhcnQ6IHRpbWVzdGFtcFNjaGVtYS5yZXF1aXJlZCgpLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBoYW5kbGVyOiBhc3luYyByZXF1ZXN0ID0+IHtcbiAgICAgIGNvbnN0IHRpbWluZ3MgPSB7XG4gICAgICAgIGVzUmVxdWVzdFNlbnQ6IERhdGUubm93KCksXG4gICAgICAgIGVzUmVzcG9uc2VQcm9jZXNzZWQ6IDAsXG4gICAgICB9O1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBzZWFyY2ggPSA8SGl0LCBBZ2dyZWdhdGlvbnM+KHBhcmFtczogU2VhcmNoUGFyYW1zKSA9PlxuICAgICAgICAgIGNhbGxXaXRoUmVxdWVzdDxIaXQsIEFnZ3JlZ2F0aW9ucz4ocmVxdWVzdCwgJ3NlYXJjaCcsIHBhcmFtcyk7XG4gICAgICAgIGNvbnN0IHN1bW1hcnlCdWNrZXRzID0gYXdhaXQgZmV0Y2hTdW1tYXJ5QnVja2V0cyhcbiAgICAgICAgICBzZWFyY2gsXG4gICAgICAgICAgcmVxdWVzdC5wYXlsb2FkLmluZGljZXMsXG4gICAgICAgICAgcmVxdWVzdC5wYXlsb2FkLmZpZWxkcyxcbiAgICAgICAgICByZXF1ZXN0LnBheWxvYWQuc3RhcnQsXG4gICAgICAgICAgcmVxdWVzdC5wYXlsb2FkLmVuZCxcbiAgICAgICAgICByZXF1ZXN0LnBheWxvYWQuYnVja2V0U2l6ZSxcbiAgICAgICAgICByZXF1ZXN0LnBheWxvYWQucXVlcnlcbiAgICAgICAgKTtcblxuICAgICAgICB0aW1pbmdzLmVzUmVzcG9uc2VQcm9jZXNzZWQgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgYnVja2V0czogc3VtbWFyeUJ1Y2tldHMsXG4gICAgICAgICAgdGltaW5ncyxcbiAgICAgICAgfTtcbiAgICAgIH0gY2F0Y2ggKHJlcXVlc3RFcnJvcikge1xuICAgICAgICB0aHJvdyBCb29tLmJvb21pZnkocmVxdWVzdEVycm9yKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHBhdGg6ICcvYXBpL2xvZ2dpbmcvc2VhcmNoLXN1bW1hcnknLFxuICB9KTtcbn07XG5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoU3VtbWFyeUJ1Y2tldHMoXG4gIHNlYXJjaDogPEhpdCwgQWdncmVnYXRpb25zPihcbiAgICBwYXJhbXM6IFNlYXJjaFBhcmFtc1xuICApID0+IFByb21pc2U8SW5mcmFEYXRhYmFzZVNlYXJjaFJlc3BvbnNlPEhpdCwgQWdncmVnYXRpb25zPj4sXG4gIGluZGljZXM6IHN0cmluZ1tdLFxuICBmaWVsZHM6IExvZ0VudHJ5RmllbGRzTWFwcGluZyxcbiAgc3RhcnQ6IG51bWJlcixcbiAgZW5kOiBudW1iZXIsXG4gIGJ1Y2tldFNpemU6IHtcbiAgICB1bml0OiBTdW1tYXJ5QnVja2V0U2l6ZTtcbiAgICB2YWx1ZTogbnVtYmVyO1xuICB9LFxuICBxdWVyeTogc3RyaW5nXG4pOiBQcm9taXNlPFNlYXJjaFN1bW1hcnlCdWNrZXRbXT4ge1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlYXJjaDxhbnksIHsgY291bnRfYnlfZGF0ZT86IERhdGVIaXN0b2dyYW1SZXNwb25zZSB9Pih7XG4gICAgYWxsb3dOb0luZGljZXM6IHRydWUsXG4gICAgYm9keToge1xuICAgICAgYWdncmVnYXRpb25zOiB7XG4gICAgICAgIGNvdW50X2J5X2RhdGU6IHtcbiAgICAgICAgICBhZ2dyZWdhdGlvbnM6IHtcbiAgICAgICAgICAgIHRvcF9lbnRyaWVzOiB7XG4gICAgICAgICAgICAgIHRvcF9oaXRzOiB7XG4gICAgICAgICAgICAgICAgX3NvdXJjZTogW2ZpZWxkcy5tZXNzYWdlXSxcbiAgICAgICAgICAgICAgICBzaXplOiAxLFxuICAgICAgICAgICAgICAgIHNvcnQ6IFt7IFtmaWVsZHMudGltZV06ICdkZXNjJyB9LCB7IFtmaWVsZHMudGllYnJlYWtlcl06ICdkZXNjJyB9XSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRlX2hpc3RvZ3JhbToge1xuICAgICAgICAgICAgZXh0ZW5kZWRfYm91bmRzOiB7XG4gICAgICAgICAgICAgIG1heDogZW5kLFxuICAgICAgICAgICAgICBtaW46IHN0YXJ0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZpZWxkOiBmaWVsZHMudGltZSxcbiAgICAgICAgICAgIGludGVydmFsOiBgJHtidWNrZXRTaXplLnZhbHVlfSR7YnVja2V0U2l6ZS51bml0fWAsXG4gICAgICAgICAgICBtaW5fZG9jX2NvdW50OiAwLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgYm9vbDoge1xuICAgICAgICAgIGZpbHRlcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBxdWVyeV9zdHJpbmc6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0X2ZpZWxkOiBmaWVsZHMubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0X29wZXJhdG9yOiAnQU5EJyxcbiAgICAgICAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgW2ZpZWxkcy50aW1lXToge1xuICAgICAgICAgICAgICAgICAgZm9ybWF0OiAnZXBvY2hfbWlsbGlzJyxcbiAgICAgICAgICAgICAgICAgIGd0ZTogc3RhcnQsXG4gICAgICAgICAgICAgICAgICBsdDogZW5kLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc2l6ZTogMCxcbiAgICB9LFxuICAgIGlnbm9yZVVuYXZhaWxhYmxlOiB0cnVlLFxuICAgIGluZGV4OiBpbmRpY2VzLFxuICB9KTtcblxuICBpZiAocmVzcG9uc2UuYWdncmVnYXRpb25zICYmIHJlc3BvbnNlLmFnZ3JlZ2F0aW9ucy5jb3VudF9ieV9kYXRlKSB7XG4gICAgcmV0dXJuIGNvbnZlcnREYXRlSGlzdG9ncmFtVG9TZWFyY2hTdW1tYXJ5QnVja2V0cyhmaWVsZHMsIGVuZCkoXG4gICAgICByZXNwb25zZS5hZ2dyZWdhdGlvbnMuY291bnRfYnlfZGF0ZS5idWNrZXRzXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW107XG4gIH1cbn1cbiJdfQ==