"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const invert_1 = tslib_1.__importDefault(require("lodash/fp/invert"));
const mapKeys_1 = tslib_1.__importDefault(require("lodash/fp/mapKeys"));
const elasticsearch_1 = require("./elasticsearch");
exports.convertHitToSearchResult = (fields) => {
    const invertedFields = invert_1.default(fields);
    return (hit) => {
        const matches = mapKeys_1.default(key => invertedFields[key], hit.highlight || {});
        return {
            fields: {
                tiebreaker: hit.sort[1],
                time: hit.sort[0],
            },
            gid: getHitGid(hit),
            matches,
        };
    };
};
exports.convertDateHistogramToSearchSummaryBuckets = (fields, end) => (buckets) => buckets.reduceRight(({ previousStart, aggregatedBuckets }, bucket) => {
    const representative = elasticsearch_1.isBucketWithAggregation(bucket, 'top_entries') &&
        bucket.top_entries.hits.hits.length > 0
        ? exports.convertHitToSearchResult(fields)(bucket.top_entries.hits.hits[0])
        : null;
    return {
        aggregatedBuckets: [
            ...(representative
                ? [
                    {
                        count: bucket.doc_count,
                        end: previousStart,
                        representative,
                        start: bucket.key,
                    },
                ]
                : []),
            ...aggregatedBuckets,
        ],
        previousStart: bucket.key,
    };
}, { previousStart: end, aggregatedBuckets: [] }).aggregatedBuckets;
const getHitGid = (hit) => `${hit._index}:${hit._type}:${hit._id}`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvaW5mcmEvc2VydmVyL2xvZ2dpbmdfbGVnYWN5L2NvbnZlcnRlcnMudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2luZnJhL3NlcnZlci9sb2dnaW5nX2xlZ2FjeS9jb252ZXJ0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCxzRUFBc0M7QUFDdEMsd0VBQXdDO0FBS3hDLG1EQU15QjtBQUVaLFFBQUEsd0JBQXdCLEdBQUcsQ0FBQyxNQUE2QixFQUFFLEVBQUU7SUFDeEUsTUFBTSxjQUFjLEdBQUcsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QyxPQUFPLENBQUMsR0FBbUIsRUFBZ0IsRUFBRTtRQUMzQyxNQUFNLE9BQU8sR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLENBQUM7UUFDekUsT0FBTztZQUNMLE1BQU0sRUFBRTtnQkFDTixVQUFVLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNsQjtZQUNELEdBQUcsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDO1lBQ25CLE9BQU87U0FDUixDQUFDO0lBQ0osQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRVcsUUFBQSwwQ0FBMEMsR0FBRyxDQUN4RCxNQUE2QixFQUM3QixHQUFXLEVBQ1gsRUFBRSxDQUFDLENBQUMsT0FBeUMsRUFBeUIsRUFBRSxDQUN4RSxPQUFPLENBQUMsV0FBVyxDQUNqQixDQUFDLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDL0MsTUFBTSxjQUFjLEdBQ2xCLHVDQUF1QixDQUE0QixNQUFNLEVBQUUsYUFBYSxDQUFDO1FBQ3pFLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQztRQUNyQyxDQUFDLENBQUMsZ0NBQXdCLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDWCxPQUFPO1FBQ0wsaUJBQWlCLEVBQUU7WUFDakIsR0FBRyxDQUFDLGNBQWM7Z0JBQ2hCLENBQUMsQ0FBQztvQkFDRTt3QkFDRSxLQUFLLEVBQUUsTUFBTSxDQUFDLFNBQVM7d0JBQ3ZCLEdBQUcsRUFBRSxhQUFhO3dCQUNsQixjQUFjO3dCQUNkLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRztxQkFDbEI7aUJBQ0Y7Z0JBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNQLEdBQUcsaUJBQWlCO1NBQ3JCO1FBQ0QsYUFBYSxFQUFFLE1BQU0sQ0FBQyxHQUFHO0tBQzFCLENBQUM7QUFDSixDQUFDLEVBQ0QsRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsRUFHMUMsQ0FDRixDQUFDLGlCQUFpQixDQUFDO0FBRXRCLE1BQU0sU0FBUyxHQUFHLENBQUMsR0FBUSxFQUFVLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgaW52ZXJ0IGZyb20gJ2xvZGFzaC9mcC9pbnZlcnQnO1xuaW1wb3J0IG1hcEtleXMgZnJvbSAnbG9kYXNoL2ZwL21hcEtleXMnO1xuXG5pbXBvcnQgeyBMb2dFbnRyeUZpZWxkc01hcHBpbmcgfSBmcm9tICcuLi8uLi9jb21tb24vbG9nX2VudHJ5JztcbmltcG9ydCB7IFNlYXJjaFJlc3VsdCB9IGZyb20gJy4uLy4uL2NvbW1vbi9sb2dfc2VhcmNoX3Jlc3VsdCc7XG5pbXBvcnQgeyBTZWFyY2hTdW1tYXJ5QnVja2V0IH0gZnJvbSAnLi4vLi4vY29tbW9uL2xvZ19zZWFyY2hfc3VtbWFyeSc7XG5pbXBvcnQge1xuICBEYXRlSGlzdG9ncmFtUmVzcG9uc2UsXG4gIEhpZ2hsaWdodGVkSGl0LFxuICBIaXQsXG4gIEhpdHNCdWNrZXQsXG4gIGlzQnVja2V0V2l0aEFnZ3JlZ2F0aW9uLFxufSBmcm9tICcuL2VsYXN0aWNzZWFyY2gnO1xuXG5leHBvcnQgY29uc3QgY29udmVydEhpdFRvU2VhcmNoUmVzdWx0ID0gKGZpZWxkczogTG9nRW50cnlGaWVsZHNNYXBwaW5nKSA9PiB7XG4gIGNvbnN0IGludmVydGVkRmllbGRzID0gaW52ZXJ0KGZpZWxkcyk7XG4gIHJldHVybiAoaGl0OiBIaWdobGlnaHRlZEhpdCk6IFNlYXJjaFJlc3VsdCA9PiB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IG1hcEtleXMoa2V5ID0+IGludmVydGVkRmllbGRzW2tleV0sIGhpdC5oaWdobGlnaHQgfHwge30pO1xuICAgIHJldHVybiB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgdGllYnJlYWtlcjogaGl0LnNvcnRbMV0sIC8vIHVzZSB0aGUgc29ydCBwcm9wZXJ0eSB0byBnZXQgdGhlIG5vcm1hbGl6ZWQgdmFsdWVzXG4gICAgICAgIHRpbWU6IGhpdC5zb3J0WzBdLFxuICAgICAgfSxcbiAgICAgIGdpZDogZ2V0SGl0R2lkKGhpdCksXG4gICAgICBtYXRjaGVzLFxuICAgIH07XG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgY29udmVydERhdGVIaXN0b2dyYW1Ub1NlYXJjaFN1bW1hcnlCdWNrZXRzID0gKFxuICBmaWVsZHM6IExvZ0VudHJ5RmllbGRzTWFwcGluZyxcbiAgZW5kOiBudW1iZXJcbikgPT4gKGJ1Y2tldHM6IERhdGVIaXN0b2dyYW1SZXNwb25zZVsnYnVja2V0cyddKTogU2VhcmNoU3VtbWFyeUJ1Y2tldFtdID0+XG4gIGJ1Y2tldHMucmVkdWNlUmlnaHQoXG4gICAgKHsgcHJldmlvdXNTdGFydCwgYWdncmVnYXRlZEJ1Y2tldHMgfSwgYnVja2V0KSA9PiB7XG4gICAgICBjb25zdCByZXByZXNlbnRhdGl2ZSA9XG4gICAgICAgIGlzQnVja2V0V2l0aEFnZ3JlZ2F0aW9uPEhpdHNCdWNrZXQsICd0b3BfZW50cmllcyc+KGJ1Y2tldCwgJ3RvcF9lbnRyaWVzJykgJiZcbiAgICAgICAgYnVja2V0LnRvcF9lbnRyaWVzLmhpdHMuaGl0cy5sZW5ndGggPiAwXG4gICAgICAgICAgPyBjb252ZXJ0SGl0VG9TZWFyY2hSZXN1bHQoZmllbGRzKShidWNrZXQudG9wX2VudHJpZXMuaGl0cy5oaXRzWzBdKVxuICAgICAgICAgIDogbnVsbDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGFnZ3JlZ2F0ZWRCdWNrZXRzOiBbXG4gICAgICAgICAgLi4uKHJlcHJlc2VudGF0aXZlXG4gICAgICAgICAgICA/IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBjb3VudDogYnVja2V0LmRvY19jb3VudCxcbiAgICAgICAgICAgICAgICAgIGVuZDogcHJldmlvdXNTdGFydCxcbiAgICAgICAgICAgICAgICAgIHJlcHJlc2VudGF0aXZlLFxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IGJ1Y2tldC5rZXksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgOiBbXSksXG4gICAgICAgICAgLi4uYWdncmVnYXRlZEJ1Y2tldHMsXG4gICAgICAgIF0sXG4gICAgICAgIHByZXZpb3VzU3RhcnQ6IGJ1Y2tldC5rZXksXG4gICAgICB9O1xuICAgIH0sXG4gICAgeyBwcmV2aW91c1N0YXJ0OiBlbmQsIGFnZ3JlZ2F0ZWRCdWNrZXRzOiBbXSB9IGFzIHtcbiAgICAgIHByZXZpb3VzU3RhcnQ6IG51bWJlcjtcbiAgICAgIGFnZ3JlZ2F0ZWRCdWNrZXRzOiBTZWFyY2hTdW1tYXJ5QnVja2V0W107XG4gICAgfVxuICApLmFnZ3JlZ2F0ZWRCdWNrZXRzO1xuXG5jb25zdCBnZXRIaXRHaWQgPSAoaGl0OiBIaXQpOiBzdHJpbmcgPT4gYCR7aGl0Ll9pbmRleH06JHtoaXQuX3R5cGV9OiR7aGl0Ll9pZH1gO1xuIl19