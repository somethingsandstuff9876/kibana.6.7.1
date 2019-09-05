"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../../common/constants");
async function getBuckets({ serviceName, groupId, bucketSize, setup }) {
    const { start, end, esFilterQuery, client, config } = setup;
    const filter = [
        { term: { [constants_1.PROCESSOR_EVENT]: 'error' } },
        { term: { [constants_1.SERVICE_NAME]: serviceName } },
        {
            range: {
                '@timestamp': {
                    gte: start,
                    lte: end,
                    format: 'epoch_millis'
                }
            }
        }
    ];
    if (groupId) {
        filter.push({ term: { [constants_1.ERROR_GROUP_ID]: groupId } });
    }
    if (esFilterQuery) {
        filter.push(esFilterQuery);
    }
    const params = {
        index: config.get('apm_oss.errorIndices'),
        body: {
            size: 0,
            query: {
                bool: {
                    filter
                }
            },
            aggs: {
                distribution: {
                    histogram: {
                        field: '@timestamp',
                        min_doc_count: 0,
                        interval: bucketSize,
                        extended_bounds: {
                            min: start,
                            max: end
                        }
                    }
                }
            }
        }
    };
    const resp = await client('search', params);
    const buckets = resp.aggregations.distribution.buckets.map(bucket => ({
        key: bucket.key,
        count: bucket.doc_count
    }));
    return {
        totalHits: resp.hits.total,
        buckets
    };
}
exports.getBuckets = getBuckets;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvZXJyb3JzL2Rpc3RyaWJ1dGlvbi9nZXRfYnVja2V0cy50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvZXJyb3JzL2Rpc3RyaWJ1dGlvbi9nZXRfYnVja2V0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFHSCw0REFJc0M7QUFHL0IsS0FBSyxVQUFVLFVBQVUsQ0FBQyxFQUMvQixXQUFXLEVBQ1gsT0FBTyxFQUNQLFVBQVUsRUFDVixLQUFLLEVBTU47SUFDQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztJQUM1RCxNQUFNLE1BQU0sR0FBZTtRQUN6QixFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsMkJBQWUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQ3hDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyx3QkFBWSxDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUU7UUFDekM7WUFDRSxLQUFLLEVBQUU7Z0JBQ0wsWUFBWSxFQUFFO29CQUNaLEdBQUcsRUFBRSxLQUFLO29CQUNWLEdBQUcsRUFBRSxHQUFHO29CQUNSLE1BQU0sRUFBRSxjQUFjO2lCQUN2QjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBRUYsSUFBSSxPQUFPLEVBQUU7UUFDWCxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQywwQkFBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ3REO0lBRUQsSUFBSSxhQUFhLEVBQUU7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUM1QjtJQUVELE1BQU0sTUFBTSxHQUFHO1FBQ2IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQVMsc0JBQXNCLENBQUM7UUFDakQsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLENBQUM7WUFDUCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFO29CQUNKLE1BQU07aUJBQ1A7YUFDRjtZQUNELElBQUksRUFBRTtnQkFDSixZQUFZLEVBQUU7b0JBQ1osU0FBUyxFQUFFO3dCQUNULEtBQUssRUFBRSxZQUFZO3dCQUNuQixhQUFhLEVBQUUsQ0FBQzt3QkFDaEIsUUFBUSxFQUFFLFVBQVU7d0JBQ3BCLGVBQWUsRUFBRTs0QkFDZixHQUFHLEVBQUUsS0FBSzs0QkFDVixHQUFHLEVBQUUsR0FBRzt5QkFDVDtxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBUUYsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQWEsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRXhELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRztRQUNmLEtBQUssRUFBRSxNQUFNLENBQUMsU0FBUztLQUN4QixDQUFDLENBQUMsQ0FBQztJQUVKLE9BQU87UUFDTCxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO1FBQzFCLE9BQU87S0FDUixDQUFDO0FBQ0osQ0FBQztBQTVFRCxnQ0E0RUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBCdWNrZXRBZ2csIEVTRmlsdGVyIH0gZnJvbSAnZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQge1xuICBFUlJPUl9HUk9VUF9JRCxcbiAgUFJPQ0VTU09SX0VWRU5ULFxuICBTRVJWSUNFX05BTUVcbn0gZnJvbSAnLi4vLi4vLi4vLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBTZXR1cCB9IGZyb20gJy4uLy4uL2hlbHBlcnMvc2V0dXBfcmVxdWVzdCc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRCdWNrZXRzKHtcbiAgc2VydmljZU5hbWUsXG4gIGdyb3VwSWQsXG4gIGJ1Y2tldFNpemUsXG4gIHNldHVwXG59OiB7XG4gIHNlcnZpY2VOYW1lOiBzdHJpbmc7XG4gIGdyb3VwSWQ/OiBzdHJpbmc7XG4gIGJ1Y2tldFNpemU6IG51bWJlcjtcbiAgc2V0dXA6IFNldHVwO1xufSkge1xuICBjb25zdCB7IHN0YXJ0LCBlbmQsIGVzRmlsdGVyUXVlcnksIGNsaWVudCwgY29uZmlnIH0gPSBzZXR1cDtcbiAgY29uc3QgZmlsdGVyOiBFU0ZpbHRlcltdID0gW1xuICAgIHsgdGVybTogeyBbUFJPQ0VTU09SX0VWRU5UXTogJ2Vycm9yJyB9IH0sXG4gICAgeyB0ZXJtOiB7IFtTRVJWSUNFX05BTUVdOiBzZXJ2aWNlTmFtZSB9IH0sXG4gICAge1xuICAgICAgcmFuZ2U6IHtcbiAgICAgICAgJ0B0aW1lc3RhbXAnOiB7XG4gICAgICAgICAgZ3RlOiBzdGFydCxcbiAgICAgICAgICBsdGU6IGVuZCxcbiAgICAgICAgICBmb3JtYXQ6ICdlcG9jaF9taWxsaXMnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIF07XG5cbiAgaWYgKGdyb3VwSWQpIHtcbiAgICBmaWx0ZXIucHVzaCh7IHRlcm06IHsgW0VSUk9SX0dST1VQX0lEXTogZ3JvdXBJZCB9IH0pO1xuICB9XG5cbiAgaWYgKGVzRmlsdGVyUXVlcnkpIHtcbiAgICBmaWx0ZXIucHVzaChlc0ZpbHRlclF1ZXJ5KTtcbiAgfVxuXG4gIGNvbnN0IHBhcmFtcyA9IHtcbiAgICBpbmRleDogY29uZmlnLmdldDxzdHJpbmc+KCdhcG1fb3NzLmVycm9ySW5kaWNlcycpLFxuICAgIGJvZHk6IHtcbiAgICAgIHNpemU6IDAsXG4gICAgICBxdWVyeToge1xuICAgICAgICBib29sOiB7XG4gICAgICAgICAgZmlsdGVyXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhZ2dzOiB7XG4gICAgICAgIGRpc3RyaWJ1dGlvbjoge1xuICAgICAgICAgIGhpc3RvZ3JhbToge1xuICAgICAgICAgICAgZmllbGQ6ICdAdGltZXN0YW1wJyxcbiAgICAgICAgICAgIG1pbl9kb2NfY291bnQ6IDAsXG4gICAgICAgICAgICBpbnRlcnZhbDogYnVja2V0U2l6ZSxcbiAgICAgICAgICAgIGV4dGVuZGVkX2JvdW5kczoge1xuICAgICAgICAgICAgICBtaW46IHN0YXJ0LFxuICAgICAgICAgICAgICBtYXg6IGVuZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBpbnRlcmZhY2UgQWdncyB7XG4gICAgZGlzdHJpYnV0aW9uOiB7XG4gICAgICBidWNrZXRzOiBBcnJheTxCdWNrZXRBZ2c8bnVtYmVyPj47XG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHJlc3AgPSBhd2FpdCBjbGllbnQ8dm9pZCwgQWdncz4oJ3NlYXJjaCcsIHBhcmFtcyk7XG5cbiAgY29uc3QgYnVja2V0cyA9IHJlc3AuYWdncmVnYXRpb25zLmRpc3RyaWJ1dGlvbi5idWNrZXRzLm1hcChidWNrZXQgPT4gKHtcbiAgICBrZXk6IGJ1Y2tldC5rZXksXG4gICAgY291bnQ6IGJ1Y2tldC5kb2NfY291bnRcbiAgfSkpO1xuXG4gIHJldHVybiB7XG4gICAgdG90YWxIaXRzOiByZXNwLmhpdHMudG90YWwsXG4gICAgYnVja2V0c1xuICB9O1xufVxuIl19