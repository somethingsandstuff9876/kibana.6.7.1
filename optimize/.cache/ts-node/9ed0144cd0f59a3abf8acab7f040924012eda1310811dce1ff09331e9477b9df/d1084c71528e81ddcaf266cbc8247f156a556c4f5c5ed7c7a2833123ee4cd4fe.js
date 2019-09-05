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
const elasticsearch_1 = require("./elasticsearch");
const latest_log_entries_1 = require("./latest_log_entries");
const schemas_1 = require("./schemas");
const INITIAL_HORIZON_OFFSET = 1000 * 60 * 60 * 24;
const MAX_HORIZON = 9999999999999;
exports.initAdjacentSearchResultsRoutes = (framework) => {
    const callWithRequest = framework.callWithRequest;
    framework.registerRoute({
        options: {
            validate: {
                payload: Joi.object().keys({
                    after: Joi.number()
                        .min(0)
                        .default(0),
                    before: Joi.number()
                        .min(0)
                        .default(0),
                    fields: schemas_1.logEntryFieldsMappingSchema.required(),
                    indices: schemas_1.indicesSchema.required(),
                    query: Joi.string().required(),
                    target: schemas_1.logEntryTimeSchema.required(),
                }),
            },
        },
        handler: async (request, h) => {
            const timings = {
                esRequestSent: Date.now(),
                esResponseProcessed: 0,
            };
            try {
                const search = (params) => callWithRequest(request, 'search', params);
                const latestTime = await latest_log_entries_1.fetchLatestTime(search, request.payload.indices, request.payload.fields.time);
                const searchResultsAfterTarget = await fetchSearchResults(search, request.payload.indices, request.payload.fields, {
                    tiebreaker: request.payload.target.tiebreaker - 1,
                    time: request.payload.target.time,
                }, request.payload.after, 'asc', request.payload.query, request.payload.target.time + INITIAL_HORIZON_OFFSET, latestTime);
                const searchResultsBeforeTarget = (await fetchSearchResults(search, request.payload.indices, request.payload.fields, request.payload.target, request.payload.before, 'desc', request.payload.query, request.payload.target.time - INITIAL_HORIZON_OFFSET)).reverse();
                timings.esResponseProcessed = Date.now();
                return {
                    results: {
                        after: searchResultsAfterTarget,
                        before: searchResultsBeforeTarget,
                    },
                    timings,
                };
            }
            catch (requestError) {
                throw Boom.boomify(requestError);
            }
        },
        method: 'POST',
        path: '/api/logging/adjacent-search-results',
    });
};
async function fetchSearchResults(search, indices, fields, target, size, direction, query, horizon, maxHorizon = MAX_HORIZON) {
    if (size <= 0) {
        return [];
    }
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
                                    [direction === 'asc' ? 'gte' : 'lte']: target.time,
                                    [direction === 'asc' ? 'lte' : 'gte']: horizon,
                                },
                            },
                        },
                    ],
                },
            },
            search_after: [target.time, target.tiebreaker],
            size,
            sort: [{ [fields.time]: direction }, { [fields.tiebreaker]: direction }],
        },
        ignoreUnavailable: true,
        index: indices,
    };
    const response = await search(request);
    const hits = response.hits.hits;
    const nextHorizon = horizon + (horizon - target.time);
    if (hits.length >= size || nextHorizon < 0 || nextHorizon > maxHorizon) {
        const filteredHits = hits.filter(elasticsearch_1.isHighlightedHit);
        return filteredHits.map(converters_1.convertHitToSearchResult(fields));
    }
    else {
        return fetchSearchResults(search, indices, fields, target, size, direction, query, nextHorizon, maxHorizon);
    }
}
exports.fetchSearchResults = fetchSearchResults;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xvZ2dpbmdfbGVnYWN5L2FkamFjZW50X3NlYXJjaF9yZXN1bHRzLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9pbmZyYS9zZXJ2ZXIvbG9nZ2luZ19sZWdhY3kvYWRqYWNlbnRfc2VhcmNoX3Jlc3VsdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILG1EQUE2QjtBQUU3QixpREFBMkI7QUFhM0IsNkNBQXdEO0FBQ3hELG1EQUE4RDtBQUM5RCw2REFBdUQ7QUFDdkQsdUNBQTJGO0FBRTNGLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ25ELE1BQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQztBQUVyQixRQUFBLCtCQUErQixHQUFHLENBQUMsU0FBdUMsRUFBRSxFQUFFO0lBQ3pGLE1BQU0sZUFBZSxHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUM7SUFFbEQsU0FBUyxDQUFDLGFBQWEsQ0FHckI7UUFDQSxPQUFPLEVBQUU7WUFDUCxRQUFRLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUM7b0JBQ3pCLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFO3lCQUNoQixHQUFHLENBQUMsQ0FBQyxDQUFDO3lCQUNOLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ2IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUU7eUJBQ2pCLEdBQUcsQ0FBQyxDQUFDLENBQUM7eUJBQ04sT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDYixNQUFNLEVBQUUscUNBQTJCLENBQUMsUUFBUSxFQUFFO29CQUM5QyxPQUFPLEVBQUUsdUJBQWEsQ0FBQyxRQUFR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QVEsQ0FBQyxJQUFJLENBQUMsSUFBbUIsQ0FBQztJQUMvQyxNQUFNLFdBQVcsR0FBRyxPQUFPLEdBQUcsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXRELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLElBQUksV0FBVyxHQUFHLENBQUMsSUFBSSxXQUFXLEdBQUcsVUFBVSxFQUFFO1FBQ3RFLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZ0NBQWdCLENBQUMsQ0FBQztRQUNuRCxPQUFPLFlBQVksQ0FBQyxHQUFHLENBQUMscUNBQXdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUMzRDtTQUFNO1FBQ0wsT0FBTyxrQkFBa0IsQ0FDdkIsTUFBTSxFQUNOLE9BQU8sRUFDUCxNQUFNLEVBQ04sTUFBTSxFQUNOLElBQUksRUFDSixTQUFTLEVBQ1QsS0FBSyxFQUNMLFdBQVcsRUFDWCxVQUFVLENBQ1gsQ0FBQztLQUNIO0FBQ0gsQ0FBQztBQTlFRCxnREE4RUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBCb29tIGZyb20gJ2Jvb20nO1xuaW1wb3J0IHsgU2VhcmNoUGFyYW1zIH0gZnJvbSAnZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQgKiBhcyBKb2kgZnJvbSAnam9pJztcblxuaW1wb3J0IHtcbiAgQWRqYWNlbnRTZWFyY2hSZXN1bHRzQXBpUG9zdFBheWxvYWQsXG4gIEFkamFjZW50U2VhcmNoUmVzdWx0c0FwaVBvc3RSZXNwb25zZSxcbn0gZnJvbSAnLi4vLi4vY29tbW9uL2h0dHBfYXBpJztcbmltcG9ydCB7IExvZ0VudHJ5RmllbGRzTWFwcGluZywgTG9nRW50cnlUaW1lIH0gZnJvbSAnLi4vLi4vY29tbW9uL2xvZ19lbnRyeSc7XG5pbXBvcnQgeyBTZWFyY2hSZXN1bHQgfSBmcm9tICcuLi8uLi9jb21tb24vbG9nX3NlYXJjaF9yZXN1bHQnO1xuaW1wb3J0IHtcbiAgSW5mcmFCYWNrZW5kRnJhbWV3b3JrQWRhcHRlcixcbiAgSW5mcmFEYXRhYmFzZVNlYXJjaFJlc3BvbnNlLFxuICBJbmZyYVdyYXBwYWJsZVJlcXVlc3QsXG59IGZyb20gJy4uL2xpYi9hZGFwdGVycy9mcmFtZXdvcmsnO1xuaW1wb3J0IHsgY29udmVydEhpdFRvU2VhcmNoUmVzdWx0IH0gZnJvbSAnLi9jb252ZXJ0ZXJzJztcbmltcG9ydCB7IGlzSGlnaGxpZ2h0ZWRIaXQsIFNvcnRlZEhpdCB9IGZyb20gJy4vZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQgeyBmZXRjaExhdGVzdFRpbWUgfSBmcm9tICcuL2xhdGVzdF9sb2dfZW50cmllcyc7XG5pbXBvcnQgeyBpbmRpY2VzU2NoZW1hLCBsb2dFbnRyeUZpZWxkc01hcHBpbmdTY2hlbWEsIGxvZ0VudHJ5VGltZVNjaGVtYSB9IGZyb20gJy4vc2NoZW1hcyc7XG5cbmNvbnN0IElOSVRJQUxfSE9SSVpPTl9PRkZTRVQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuY29uc3QgTUFYX0hPUklaT04gPSA5OTk5OTk5OTk5OTk5O1xuXG5leHBvcnQgY29uc3QgaW5pdEFkamFjZW50U2VhcmNoUmVzdWx0c1JvdXRlcyA9IChmcmFtZXdvcms6IEluZnJhQmFja2VuZEZyYW1ld29ya0FkYXB0ZXIpID0+IHtcbiAgY29uc3QgY2FsbFdpdGhSZXF1ZXN0ID0gZnJhbWV3b3JrLmNhbGxXaXRoUmVxdWVzdDtcblxuICBmcmFtZXdvcmsucmVnaXN0ZXJSb3V0ZTxcbiAgICBJbmZyYVdyYXBwYWJsZVJlcXVlc3Q8QWRqYWNlbnRTZWFyY2hSZXN1bHRzQXBpUG9zdFBheWxvYWQ+LFxuICAgIFByb21pc2U8QWRqYWNlbnRTZWFyY2hSZXN1bHRzQXBpUG9zdFJlc3BvbnNlPlxuICA+KHtcbiAgICBvcHRpb25zOiB7XG4gICAgICB2YWxpZGF0ZToge1xuICAgICAgICBwYXlsb2FkOiBKb2kub2JqZWN0KCkua2V5cyh7XG4gICAgICAgICAgYWZ0ZXI6IEpvaS5udW1iZXIoKVxuICAgICAgICAgICAgLm1pbigwKVxuICAgICAgICAgICAgLmRlZmF1bHQoMCksXG4gICAgICAgICAgYmVmb3JlOiBKb2kubnVtYmVyKClcbiAgICAgICAgICAgIC5taW4oMClcbiAgICAgICAgICAgIC5kZWZhdWx0KDApLFxuICAgICAgICAgIGZpZWxkczogbG9nRW50cnlGaWVsZHNNYXBwaW5nU2NoZW1hLnJlcXVpcmVkKCksXG4gICAgICAgICAgaW5kaWNlczogaW5kaWNlc1NjaGVtYS5yZXF1aXJlZCgpLFxuICAgICAgICAgIHF1ZXJ5OiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgICAgICAgICB0YXJnZXQ6IGxvZ0VudHJ5VGltZVNjaGVtYS5yZXF1aXJlZCgpLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBoYW5kbGVyOiBhc3luYyAocmVxdWVzdCwgaCkgPT4ge1xuICAgICAgY29uc3QgdGltaW5ncyA9IHtcbiAgICAgICAgZXNSZXF1ZXN0U2VudDogRGF0ZS5ub3coKSxcbiAgICAgICAgZXNSZXNwb25zZVByb2Nlc3NlZDogMCxcbiAgICAgIH07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHNlYXJjaCA9IDxIaXQ+KHBhcmFtczogU2VhcmNoUGFyYW1zKSA9PlxuICAgICAgICAgIGNhbGxXaXRoUmVxdWVzdDxIaXQsIGFueT4ocmVxdWVzdCwgJ3NlYXJjaCcsIHBhcmFtcyk7XG5cbiAgICAgICAgY29uc3QgbGF0ZXN0VGltZSA9IGF3YWl0IGZldGNoTGF0ZXN0VGltZShcbiAgICAgICAgICBzZWFyY2gsXG4gICAgICAgICAgcmVxdWVzdC5wYXlsb2FkLmluZGljZXMsXG4gICAgICAgICAgcmVxdWVzdC5wYXlsb2FkLmZpZWxkcy50aW1lXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHNlYXJjaFJlc3VsdHNBZnRlclRhcmdldCA9IGF3YWl0IGZldGNoU2VhcmNoUmVzdWx0cyhcbiAgICAgICAgICBzZWFyY2gsXG4gICAgICAgICAgcmVxdWVzdC5wYXlsb2FkLmluZGljZXMsXG4gICAgICAgICAgcmVxdWVzdC5wYXlsb2FkLmZpZWxkcyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0aWVicmVha2VyOiByZXF1ZXN0LnBheWxvYWQudGFyZ2V0LnRpZWJyZWFrZXIgLSAxLFxuICAgICAgICAgICAgdGltZTogcmVxdWVzdC5wYXlsb2FkLnRhcmdldC50aW1lLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVxdWVzdC5wYXlsb2FkLmFmdGVyLFxuICAgICAgICAgICdhc2MnLFxuICAgICAgICAgIHJlcXVlc3QucGF5bG9hZC5xdWVyeSxcbiAgICAgICAgICByZXF1ZXN0LnBheWxvYWQudGFyZ2V0LnRpbWUgKyBJTklUSUFMX0hPUklaT05fT0ZGU0VULFxuICAgICAgICAgIGxhdGVzdFRpbWVcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0c0JlZm9yZVRhcmdldCA9IChhd2FpdCBmZXRjaFNlYXJjaFJlc3VsdHMoXG4gICAgICAgICAgc2VhcmNoLFxuICAgICAgICAgIHJlcXVlc3QucGF5bG9hZC5pbmRpY2VzLFxuICAgICAgICAgIHJlcXVlc3QucGF5bG9hZC5maWVsZHMsXG4gICAgICAgICAgcmVxdWVzdC5wYXlsb2FkLnRhcmdldCxcbiAgICAgICAgICByZXF1ZXN0LnBheWxvYWQuYmVmb3JlLFxuICAgICAgICAgICdkZXNjJyxcbiAgICAgICAgICByZXF1ZXN0LnBheWxvYWQucXVlcnksXG4gICAgICAgICAgcmVxdWVzdC5wYXlsb2FkLnRhcmdldC50aW1lIC0gSU5JVElBTF9IT1JJWk9OX09GRlNFVFxuICAgICAgICApKS5yZXZlcnNlKCk7XG5cbiAgICAgICAgdGltaW5ncy5lc1Jlc3BvbnNlUHJvY2Vzc2VkID0gRGF0ZS5ub3coKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlc3VsdHM6IHtcbiAgICAgICAgICAgIGFmdGVyOiBzZWFyY2hSZXN1bHRzQWZ0ZXJUYXJnZXQsXG4gICAgICAgICAgICBiZWZvcmU6IHNlYXJjaFJlc3VsdHNCZWZvcmVUYXJnZXQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0aW1pbmdzLFxuICAgICAgICB9O1xuICAgICAgfSBjYXRjaCAocmVxdWVzdEVycm9yKSB7XG4gICAgICAgIHRocm93IEJvb20uYm9vbWlmeShyZXF1ZXN0RXJyb3IpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgcGF0aDogJy9hcGkvbG9nZ2luZy9hZGphY2VudC1zZWFyY2gtcmVzdWx0cycsXG4gIH0pO1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoU2VhcmNoUmVzdWx0cyhcbiAgc2VhcmNoOiA8SGl0PihwYXJhbXM6IFNlYXJjaFBhcmFtcykgPT4gUHJvbWlzZTxJbmZyYURhdGFiYXNlU2VhcmNoUmVzcG9uc2U8SGl0Pj4sXG4gIGluZGljZXM6IHN0cmluZ1tdLFxuICBmaWVsZHM6IExvZ0VudHJ5RmllbGRzTWFwcGluZyxcbiAgdGFyZ2V0OiBMb2dFbnRyeVRpbWUsXG4gIHNpemU6IG51bWJlcixcbiAgZGlyZWN0aW9uOiAnYXNjJyB8ICdkZXNjJyxcbiAgcXVlcnk6IHN0cmluZyxcbiAgaG9yaXpvbjogbnVtYmVyLFxuICBtYXhIb3Jpem9uOiBudW1iZXIgPSBNQVhfSE9SSVpPTlxuKTogUHJvbWlzZTxTZWFyY2hSZXN1bHRbXT4ge1xuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgcmVxdWVzdCA9IHtcbiAgICBhbGxvd05vSW5kaWNlczogdHJ1ZSxcbiAgICBib2R5OiB7XG4gICAgICBfc291cmNlOiBmYWxzZSxcbiAgICAgIGhpZ2hsaWdodDoge1xuICAgICAgICBib3VuZGFyeV9zY2FubmVyOiAnd29yZCcsXG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIFtmaWVsZHMubWVzc2FnZV06IHt9LFxuICAgICAgICB9LFxuICAgICAgICBmcmFnbWVudF9zaXplOiAxLFxuICAgICAgICBudW1iZXJfb2ZfZnJhZ21lbnRzOiAxMDAsXG4gICAgICAgIHBvc3RfdGFnczogWycnXSxcbiAgICAgICAgcHJlX3RhZ3M6IFsnJ10sXG4gICAgICB9LFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgYm9vbDoge1xuICAgICAgICAgIGZpbHRlcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBxdWVyeV9zdHJpbmc6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0X2ZpZWxkOiBmaWVsZHMubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0X29wZXJhdG9yOiAnQU5EJyxcbiAgICAgICAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgW2ZpZWxkcy50aW1lXToge1xuICAgICAgICAgICAgICAgICAgW2RpcmVjdGlvbiA9PT0gJ2FzYycgPyAnZ3RlJyA6ICdsdGUnXTogdGFyZ2V0LnRpbWUsXG4gICAgICAgICAgICAgICAgICBbZGlyZWN0aW9uID09PSAnYXNjJyA/ICdsdGUnIDogJ2d0ZSddOiBob3Jpem9uLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc2VhcmNoX2FmdGVyOiBbdGFyZ2V0LnRpbWUsIHRhcmdldC50aWVicmVha2VyXSxcbiAgICAgIHNpemUsXG4gICAgICBzb3J0OiBbeyBbZmllbGRzLnRpbWVdOiBkaXJlY3Rpb24gfSwgeyBbZmllbGRzLnRpZWJyZWFrZXJdOiBkaXJlY3Rpb24gfV0sXG4gICAgfSxcbiAgICBpZ25vcmVVbmF2YWlsYWJsZTogdHJ1ZSxcbiAgICBpbmRleDogaW5kaWNlcyxcbiAgfTtcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZWFyY2g8U29ydGVkSGl0PihyZXF1ZXN0KTtcblxuICBjb25zdCBoaXRzID0gcmVzcG9uc2UuaGl0cy5oaXRzIGFzIFNvcnRlZEhpdFtdO1xuICBjb25zdCBuZXh0SG9yaXpvbiA9IGhvcml6b24gKyAoaG9yaXpvbiAtIHRhcmdldC50aW1lKTtcblxuICBpZiAoaGl0cy5sZW5ndGggPj0gc2l6ZSB8fCBuZXh0SG9yaXpvbiA8IDAgfHwgbmV4dEhvcml6b24gPiBtYXhIb3Jpem9uKSB7XG4gICAgY29uc3QgZmlsdGVyZWRIaXRzID0gaGl0cy5maWx0ZXIoaXNIaWdobGlnaHRlZEhpdCk7XG4gICAgcmV0dXJuIGZpbHRlcmVkSGl0cy5tYXAoY29udmVydEhpdFRvU2VhcmNoUmVzdWx0KGZpZWxkcykpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmZXRjaFNlYXJjaFJlc3VsdHMoXG4gICAgICBzZWFyY2gsXG4gICAgICBpbmRpY2VzLFxuICAgICAgZmllbGRzLFxuICAgICAgdGFyZ2V0LFxuICAgICAgc2l6ZSxcbiAgICAgIGRpcmVjdGlvbixcbiAgICAgIHF1ZXJ5LFxuICAgICAgbmV4dEhvcml6b24sXG4gICAgICBtYXhIb3Jpem9uXG4gICAgKTtcbiAgfVxufVxuIl19