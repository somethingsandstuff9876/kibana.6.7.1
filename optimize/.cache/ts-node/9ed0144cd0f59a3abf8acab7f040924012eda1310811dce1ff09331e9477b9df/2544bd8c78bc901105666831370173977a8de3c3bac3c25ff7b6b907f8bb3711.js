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
const log_entry_1 = require("../../common/log_entry");
const converters_1 = require("./converters");
const elasticsearch_1 = require("./elasticsearch");
const schemas_1 = require("./schemas");
exports.initContainedSearchResultsRoutes = (framework) => {
    const callWithRequest = framework.callWithRequest;
    framework.registerRoute({
        options: {
            validate: {
                payload: Joi.object().keys({
                    end: schemas_1.logEntryTimeSchema.required(),
                    fields: schemas_1.logEntryFieldsMappingSchema.required(),
                    indices: schemas_1.indicesSchema.required(),
                    query: Joi.string().required(),
                    start: schemas_1.logEntryTimeSchema.required(),
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
                const searchResults = await fetchSearchResultsBetween(search, request.payload.indices, request.payload.fields, request.payload.start, request.payload.end, request.payload.query);
                timings.esResponseProcessed = Date.now();
                return {
                    results: searchResults,
                    timings,
                };
            }
            catch (requestError) {
                throw Boom.boomify(requestError);
            }
        },
        method: 'POST',
        path: '/api/logging/contained-search-results',
    });
};
async function fetchSearchResultsBetween(search, indices, fields, start, end, query) {
    const request = {
        allowNoIndices: true,
        body: {
            _source: false,
            highlight: {
                boundary_scanner: 'word',
                fields: {
                    [fields.message]: {},
                },
                fragment_size: 1,
                number_of_fragments: 100,
                post_tags: [''],
                pre_tags: [''],
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
                                    gte: start.time,
                                    lte: end.time,
                                },
                            },
                        },
                    ],
                },
            },
            search_after: [start.time, start.tiebreaker - 1],
            size: 10000,
            sort: [{ [fields.time]: 'asc' }, { [fields.tiebreaker]: 'asc' }],
        },
        ignoreUnavailable: true,
        index: indices,
    };
    const response = await search(request);
    const hits = response.hits.hits;
    const filteredHits = hits
        .filter(hit => log_entry_1.isLessOrEqual({ time: hit.sort[0], tiebreaker: hit.sort[1] }, end))
        .filter(elasticsearch_1.isHighlightedHit);
    return filteredHits.map(converters_1.convertHitToSearchResult(fields));
}
exports.fetchSearchResultsBetween = fetchSearchResultsBetween;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xvZ2dpbmdfbGVnYWN5L2NvbnRhaW5lZF9zZWFyY2hfcmVzdWx0cy50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xvZ2dpbmdfbGVnYWN5L2NvbnRhaW5lZF9zZWFyY2hfcmVzdWx0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7O0FBRUgsbURBQTZCO0FBRTdCLGlEQUEyQjtBQU0zQixzREFBNEY7QUFPNUYsNkNBQXdEO0FBQ3hELG1EQUE4RDtBQUM5RCx1Q0FBMkY7QUFFOUUsUUFBQSxnQ0FBZ0MsR0FBRyxDQUFDLFNBQXVDLEVBQUUsRUFBRTtJQUMxRixNQUFNLGVBQWUsR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDO0lBRWxELFNBQVMsQ0FBQyxhQUFhLENBR3JCO1FBQ0EsT0FBTyxFQUFFO1lBQ1AsUUFBUSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDO29CQUN6QixHQUFHLEVBQUUsNEJBQWtCLENBQUMsUUFBUSxFQUFFO29CQUNsQyxNQUFNLEVBQUUscUNBQTJCLENBQUMsUUFBUSxFQUFFO29CQUM5QyxPQUFPLEVBQUUsdUJBQWEsQ0FBQyxRQUFRLEVBQUU7b0JBQ2pDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO29CQUM5QixLQUFLLEVBQUUsNEJBQWtCLENBQUMsUUFBUSxFQUFFO2lCQUNyQyxDQUFDO2FBQ0g7U0FDRjtRQUNELE9BQU8sRUFBRSxLQUFLLEVBQUMsT0FBTyxFQUFDLEVBQUU7WUFDdkIsTUFBTSxPQUFPLEdBQUc7Z0JBQ2QsYUFBYSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ3pCLG1CQUFtQixF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LENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDakYsTUFBTSxDQUFDLGdDQUFnQixDQUFDLENBQUM7SUFDNUIsT0FBTyxZQUFZLENBQUMsR0FBRyxDQUFDLHFDQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDNUQsQ0FBQztBQXpERCw4REF5REMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBCb29tIGZyb20gJ2Jvb20nO1xuaW1wb3J0IHsgU2VhcmNoUGFyYW1zIH0gZnJvbSAnZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQgKiBhcyBKb2kgZnJvbSAnam9pJztcblxuaW1wb3J0IHtcbiAgQ29udGFpbmVkU2VhcmNoUmVzdWx0c0FwaVBvc3RQYXlsb2FkLFxuICBDb250YWluZWRTZWFyY2hSZXN1bHRzQXBpUG9zdFJlc3BvbnNlLFxufSBmcm9tICcuLi8uLi9jb21tb24vaHR0cF9hcGknO1xuaW1wb3J0IHsgaXNMZXNzT3JFcXVhbCwgTG9nRW50cnlGaWVsZHNNYXBwaW5nLCBMb2dFbnRyeVRpbWUgfSBmcm9tICcuLi8uLi9jb21tb24vbG9nX2VudHJ5JztcbmltcG9ydCB7IFNlYXJjaFJlc3VsdCB9IGZyb20gJy4uLy4uL2NvbW1vbi9sb2dfc2VhcmNoX3Jlc3VsdCc7XG5pbXBvcnQge1xuICBJbmZyYUJhY2tlbmRGcmFtZXdvcmtBZGFwdGVyLFxuICBJbmZyYURhdGFiYXNlU2VhcmNoUmVzcG9uc2UsXG4gIEluZnJhV3JhcHBhYmxlUmVxdWVzdCxcbn0gZnJvbSAnLi4vbGliL2FkYXB0ZXJzL2ZyYW1ld29yayc7XG5pbXBvcnQgeyBjb252ZXJ0SGl0VG9TZWFyY2hSZXN1bHQgfSBmcm9tICcuL2NvbnZlcnRlcnMnO1xuaW1wb3J0IHsgaXNIaWdobGlnaHRlZEhpdCwgU29ydGVkSGl0IH0gZnJvbSAnLi9lbGFzdGljc2VhcmNoJztcbmltcG9ydCB7IGluZGljZXNTY2hlbWEsIGxvZ0VudHJ5RmllbGRzTWFwcGluZ1NjaGVtYSwgbG9nRW50cnlUaW1lU2NoZW1hIH0gZnJvbSAnLi9zY2hlbWFzJztcblxuZXhwb3J0IGNvbnN0IGluaXRDb250YWluZWRTZWFyY2hSZXN1bHRzUm91dGVzID0gKGZyYW1ld29yazogSW5mcmFCYWNrZW5kRnJhbWV3b3JrQWRhcHRlcikgPT4ge1xuICBjb25zdCBjYWxsV2l0aFJlcXVlc3QgPSBmcmFtZXdvcmsuY2FsbFdpdGhSZXF1ZXN0O1xuXG4gIGZyYW1ld29yay5yZWdpc3RlclJvdXRlPFxuICAgIEluZnJhV3JhcHBhYmxlUmVxdWVzdDxDb250YWluZWRTZWFyY2hSZXN1bHRzQXBpUG9zdFBheWxvYWQ+LFxuICAgIFByb21pc2U8Q29udGFpbmVkU2VhcmNoUmVzdWx0c0FwaVBvc3RSZXNwb25zZT5cbiAgPih7XG4gICAgb3B0aW9uczoge1xuICAgICAgdmFsaWRhdGU6IHtcbiAgICAgICAgcGF5bG9hZDogSm9pLm9iamVjdCgpLmtleXMoe1xuICAgICAgICAgIGVuZDogbG9nRW50cnlUaW1lU2NoZW1hLnJlcXVpcmVkKCksXG4gICAgICAgICAgZmllbGRzOiBsb2dFbnRyeUZpZWxkc01hcHBpbmdTY2hlbWEucmVxdWlyZWQoKSxcbiAgICAgICAgICBpbmRpY2VzOiBpbmRpY2VzU2NoZW1hLnJlcXVpcmVkKCksXG4gICAgICAgICAgcXVlcnk6IEpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICAgICAgICAgIHN0YXJ0OiBsb2dFbnRyeVRpbWVTY2hlbWEucmVxdWlyZWQoKSxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgIH0sXG4gICAgaGFuZGxlcjogYXN5bmMgcmVxdWVzdCA9PiB7XG4gICAgICBjb25zdCB0aW1pbmdzID0ge1xuICAgICAgICBlc1JlcXVlc3RTZW50OiBEYXRlLm5vdygpLFxuICAgICAgICBlc1Jlc3BvbnNlUHJvY2Vzc2VkOiAwLFxuICAgICAgfTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gPEhpdD4ocGFyYW1zOiBTZWFyY2hQYXJhbXMpID0+XG4gICAgICAgICAgY2FsbFdpdGhSZXF1ZXN0PEhpdD4ocmVxdWVzdCwgJ3NlYXJjaCcsIHBhcmFtcyk7XG5cbiAgICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0cyA9IGF3YWl0IGZldGNoU2VhcmNoUmVzdWx0c0JldHdlZW4oXG4gICAgICAgICAgc2VhcmNoLFxuICAgICAgICAgIHJlcXVlc3QucGF5bG9hZC5pbmRpY2VzLFxuICAgICAgICAgIHJlcXVlc3QucGF5bG9hZC5maWVsZHMsXG4gICAgICAgICAgcmVxdWVzdC5wYXlsb2FkLnN0YXJ0LFxuICAgICAgICAgIHJlcXVlc3QucGF5bG9hZC5lbmQsXG4gICAgICAgICAgcmVxdWVzdC5wYXlsb2FkLnF1ZXJ5XG4gICAgICAgICk7XG5cbiAgICAgICAgdGltaW5ncy5lc1Jlc3BvbnNlUHJvY2Vzc2VkID0gRGF0ZS5ub3coKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlc3VsdHM6IHNlYXJjaFJlc3VsdHMsXG4gICAgICAgICAgdGltaW5ncyxcbiAgICAgICAgfTtcbiAgICAgIH0gY2F0Y2ggKHJlcXVlc3RFcnJvcikge1xuICAgICAgICB0aHJvdyBCb29tLmJvb21pZnkocmVxdWVzdEVycm9yKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHBhdGg6ICcvYXBpL2xvZ2dpbmcvY29udGFpbmVkLXNlYXJjaC1yZXN1bHRzJyxcbiAgfSk7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hTZWFyY2hSZXN1bHRzQmV0d2VlbihcbiAgc2VhcmNoOiA8SGl0PihwYXJhbXM6IFNlYXJjaFBhcmFtcykgPT4gUHJvbWlzZTxJbmZyYURhdGFiYXNlU2VhcmNoUmVzcG9uc2U8SGl0LCBhbnk+PixcbiAgaW5kaWNlczogc3RyaW5nW10sXG4gIGZpZWxkczogTG9nRW50cnlGaWVsZHNNYXBwaW5nLFxuICBzdGFydDogTG9nRW50cnlUaW1lLFxuICBlbmQ6IExvZ0VudHJ5VGltZSxcbiAgcXVlcnk6IHN0cmluZ1xuKTogUHJvbWlzZTxTZWFyY2hSZXN1bHRbXT4ge1xuICBjb25zdCByZXF1ZXN0ID0ge1xuICAgIGFsbG93Tm9JbmRpY2VzOiB0cnVlLFxuICAgIGJvZHk6IHtcbiAgICAgIF9zb3VyY2U6IGZhbHNlLFxuICAgICAgaGlnaGxpZ2h0OiB7XG4gICAgICAgIGJvdW5kYXJ5X3NjYW5uZXI6ICd3b3JkJyxcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgW2ZpZWxkcy5tZXNzYWdlXToge30sXG4gICAgICAgIH0sXG4gICAgICAgIGZyYWdtZW50X3NpemU6IDEsXG4gICAgICAgIG51bWJlcl9vZl9mcmFnbWVudHM6IDEwMCxcbiAgICAgICAgcG9zdF90YWdzOiBbJyddLFxuICAgICAgICBwcmVfdGFnczogWycnXSxcbiAgICAgIH0sXG4gICAgICBxdWVyeToge1xuICAgICAgICBib29sOiB7XG4gICAgICAgICAgZmlsdGVyOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHF1ZXJ5X3N0cmluZzoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRfZmllbGQ6IGZpZWxkcy5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRfb3BlcmF0b3I6ICdBTkQnLFxuICAgICAgICAgICAgICAgIHF1ZXJ5LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRzLnRpbWVdOiB7XG4gICAgICAgICAgICAgICAgICBndGU6IHN0YXJ0LnRpbWUsXG4gICAgICAgICAgICAgICAgICBsdGU6IGVuZC50aW1lLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc2VhcmNoX2FmdGVyOiBbc3RhcnQudGltZSwgc3RhcnQudGllYnJlYWtlciAtIDFdLFxuICAgICAgc2l6ZTogMTAwMDAsXG4gICAgICBzb3J0OiBbeyBbZmllbGRzLnRpbWVdOiAnYXNjJyB9LCB7IFtmaWVsZHMudGllYnJlYWtlcl06ICdhc2MnIH1dLFxuICAgIH0sXG4gICAgaWdub3JlVW5hdmFpbGFibGU6IHRydWUsXG4gICAgaW5kZXg6IGluZGljZXMsXG4gIH07XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VhcmNoPFNvcnRlZEhpdD4ocmVxdWVzdCk7XG5cbiAgY29uc3QgaGl0cyA9IHJlc3BvbnNlLmhpdHMuaGl0cyBhcyBTb3J0ZWRIaXRbXTtcbiAgY29uc3QgZmlsdGVyZWRIaXRzID0gaGl0c1xuICAgIC5maWx0ZXIoaGl0ID0+IGlzTGVzc09yRXF1YWwoeyB0aW1lOiBoaXQuc29ydFswXSwgdGllYnJlYWtlcjogaGl0LnNvcnRbMV0gfSwgZW5kKSlcbiAgICAuZmlsdGVyKGlzSGlnaGxpZ2h0ZWRIaXQpO1xuICByZXR1cm4gZmlsdGVyZWRIaXRzLm1hcChjb252ZXJ0SGl0VG9TZWFyY2hSZXN1bHQoZmllbGRzKSk7XG59XG4iXX0=