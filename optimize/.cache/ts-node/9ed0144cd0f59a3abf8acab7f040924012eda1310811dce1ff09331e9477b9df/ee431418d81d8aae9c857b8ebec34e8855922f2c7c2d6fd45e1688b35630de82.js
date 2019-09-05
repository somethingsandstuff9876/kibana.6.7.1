"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../../../common/constants");
const get_bucket_size_1 = require("../../../helpers/get_bucket_size");
function timeseriesFetcher({ serviceName, transactionType, transactionName, setup }) {
    const { start, end, esFilterQuery, client, config } = setup;
    const { intervalString } = get_bucket_size_1.getBucketSize(start, end, 'auto');
    const filter = [
        { term: { [constants_1.PROCESSOR_EVENT]: 'transaction' } },
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
    if (transactionType) {
        filter.push({ term: { [constants_1.TRANSACTION_TYPE]: transactionType } });
    }
    if (esFilterQuery) {
        filter.push(esFilterQuery);
    }
    const params = {
        index: config.get('apm_oss.transactionIndices'),
        body: {
            size: 0,
            query: { bool: { filter } },
            aggs: {
                response_times: {
                    date_histogram: {
                        field: '@timestamp',
                        interval: intervalString,
                        min_doc_count: 0,
                        extended_bounds: { min: start, max: end }
                    },
                    aggs: {
                        avg: { avg: { field: constants_1.TRANSACTION_DURATION } },
                        pct: {
                            percentiles: { field: constants_1.TRANSACTION_DURATION, percents: [95, 99] }
                        }
                    }
                },
                overall_avg_duration: { avg: { field: constants_1.TRANSACTION_DURATION } },
                transaction_results: {
                    terms: { field: constants_1.TRANSACTION_RESULT, missing: '' },
                    aggs: {
                        timeseries: {
                            date_histogram: {
                                field: '@timestamp',
                                interval: intervalString,
                                min_doc_count: 0,
                                extended_bounds: { min: start, max: end }
                            }
                        }
                    }
                }
            }
        }
    };
    if (transactionName) {
        params.body.query.bool.must = [
            { term: { [`${constants_1.TRANSACTION_NAME}.keyword`]: transactionName } }
        ];
    }
    return client('search', params);
}
exports.timeseriesFetcher = timeseriesFetcher;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvdHJhbnNhY3Rpb25zL2NoYXJ0cy9nZXRfdGltZXNlcmllc19kYXRhL2ZldGNoZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2FwbS9zZXJ2ZXIvbGliL3RyYW5zYWN0aW9ucy9jaGFydHMvZ2V0X3RpbWVzZXJpZXNfZGF0YS9mZXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUdILCtEQU95QztBQUN6QyxzRUFBaUU7QUFvRGpFLFNBQWdCLGlCQUFpQixDQUFDLEVBQ2hDLFdBQVcsRUFDWCxlQUFlLEVBQ2YsZUFBZSxFQUNmLEtBQUssRUFNTjtJQUNDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQzVELE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRywrQkFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFN0QsTUFBTSxNQUFNLEdBQWU7UUFDekIsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLDJCQUFlLENBQUMsRUFBRSxhQUFhLEVBQUUsRUFBRTtRQUM5QyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsd0JBQVksQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFO1FBQ3pDO1lBQ0UsS0FBSyxFQUFFO2dCQUNMLFlBQVksRUFBRTtvQkFDWixHQUFHLEVBQUUsS0FBSztvQkFDVixHQUFHLEVBQUUsR0FBRztvQkFDUixNQUFNLEVBQUUsY0FBYztpQkFDdkI7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUVGLElBQUksZUFBZSxFQUFFO1FBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLDRCQUFnQixDQUFDLEVBQUUsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ2hFO0lBRUQsSUFBSSxhQUFhLEVBQUU7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUM1QjtJQUVELE1BQU0sTUFBTSxHQUFRO1FBQ2xCLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDO1FBQy9DLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxDQUFDO1lBQ1AsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDM0IsSUFBSSxFQUFFO2dCQUNKLGNBQWMsRUFBRTtvQkFDZCxjQUFjLEVBQUU7d0JBQ2QsS0FBSyxFQUFFLFlBQVk7d0JBQ25CLFFBQVEsRUFBRSxjQUFjO3dCQUN4QixhQUFhLEVBQUUsQ0FBQzt3QkFDaEIsZUFBZSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO3FCQUMxQztvQkFDRCxJQUFJLEVBQUU7d0JBQ0osR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLGdDQUFvQixFQUFFLEVBQUU7d0JBQzdDLEdBQUcsRUFBRTs0QkFDSCxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsZ0NBQW9CLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO3lCQUNqRTtxQkFDRjtpQkFDRjtnQkFDRCxvQkFBb0IsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxnQ0FBb0IsRUFBRSxFQUFFO2dCQUM5RCxtQkFBbUIsRUFBRTtvQkFDbkIsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLDhCQUFrQixFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUU7b0JBQ2pELElBQUksRUFBRTt3QkFDSixVQUFVLEVBQUU7NEJBQ1YsY0FBYyxFQUFFO2dDQUNkLEtBQUssRUFBRSxZQUFZO2dDQUNuQixRQUFRLEVBQUUsY0FBYztnQ0FDeEIsYUFBYSxFQUFFLENBQUM7Z0NBQ2hCLGVBQWUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTs2QkFDMUM7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUVGLElBQUksZUFBZSxFQUFFO1FBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDNUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsNEJBQWdCLFVBQVUsQ0FBQyxFQUFFLGVBQWUsRUFBRSxFQUFFO1NBQy9ELENBQUM7S0FDSDtJQUVELE9BQU8sTUFBTSxDQUFhLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBakZELDhDQWlGQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEFnZ3JlZ2F0aW9uU2VhcmNoUmVzcG9uc2UsIEVTRmlsdGVyIH0gZnJvbSAnZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQge1xuICBQUk9DRVNTT1JfRVZFTlQsXG4gIFNFUlZJQ0VfTkFNRSxcbiAgVFJBTlNBQ1RJT05fRFVSQVRJT04sXG4gIFRSQU5TQUNUSU9OX05BTUUsXG4gIFRSQU5TQUNUSU9OX1JFU1VMVCxcbiAgVFJBTlNBQ1RJT05fVFlQRVxufSBmcm9tICcuLi8uLi8uLi8uLi8uLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IGdldEJ1Y2tldFNpemUgfSBmcm9tICcuLi8uLi8uLi9oZWxwZXJzL2dldF9idWNrZXRfc2l6ZSc7XG5pbXBvcnQgeyBTZXR1cCB9IGZyb20gJy4uLy4uLy4uL2hlbHBlcnMvc2V0dXBfcmVxdWVzdCc7XG5cbmludGVyZmFjZSBSZXNwb25zZVRpbWVCdWNrZXQge1xuICBrZXlfYXNfc3RyaW5nOiBzdHJpbmc7XG4gIGtleTogbnVtYmVyO1xuICBkb2NfY291bnQ6IG51bWJlcjtcbiAgYXZnOiB7XG4gICAgdmFsdWU6IG51bWJlciB8IG51bGw7XG4gIH07XG4gIHBjdDoge1xuICAgIHZhbHVlczoge1xuICAgICAgJzk1LjAnOiBudW1iZXIgfCAnTmFOJztcbiAgICAgICc5OS4wJzogbnVtYmVyIHwgJ05hTic7XG4gICAgfTtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIFRyYW5zYWN0aW9uUmVzdWx0QnVja2V0IHtcbiAgLyoqXG4gICAqIHRyYW5zYWN0aW9uIHJlc3VsdCBlZy4gMnh4XG4gICAqL1xuICBrZXk6IHN0cmluZztcbiAgZG9jX2NvdW50OiBudW1iZXI7XG4gIHRpbWVzZXJpZXM6IHtcbiAgICBidWNrZXRzOiBBcnJheTx7XG4gICAgICBrZXlfYXNfc3RyaW5nOiBzdHJpbmc7XG4gICAgICAvKipcbiAgICAgICAqIHRpbWVzdGFtcCBpbiBtc1xuICAgICAgICovXG4gICAgICBrZXk6IG51bWJlcjtcbiAgICAgIGRvY19jb3VudDogbnVtYmVyO1xuICAgIH0+O1xuICB9O1xufVxuXG5pbnRlcmZhY2UgQWdncyB7XG4gIHJlc3BvbnNlX3RpbWVzOiB7XG4gICAgYnVja2V0czogUmVzcG9uc2VUaW1lQnVja2V0W107XG4gIH07XG4gIHRyYW5zYWN0aW9uX3Jlc3VsdHM6IHtcbiAgICBkb2NfY291bnRfZXJyb3JfdXBwZXJfYm91bmQ6IG51bWJlcjtcbiAgICBzdW1fb3RoZXJfZG9jX2NvdW50OiBudW1iZXI7XG4gICAgYnVja2V0czogVHJhbnNhY3Rpb25SZXN1bHRCdWNrZXRbXTtcbiAgfTtcbiAgb3ZlcmFsbF9hdmdfZHVyYXRpb246IHtcbiAgICB2YWx1ZTogbnVtYmVyO1xuICB9O1xufVxuXG5leHBvcnQgdHlwZSBFU1Jlc3BvbnNlID0gQWdncmVnYXRpb25TZWFyY2hSZXNwb25zZTx2b2lkLCBBZ2dzPjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRpbWVzZXJpZXNGZXRjaGVyKHtcbiAgc2VydmljZU5hbWUsXG4gIHRyYW5zYWN0aW9uVHlwZSxcbiAgdHJhbnNhY3Rpb25OYW1lLFxuICBzZXR1cFxufToge1xuICBzZXJ2aWNlTmFtZTogc3RyaW5nO1xuICB0cmFuc2FjdGlvblR5cGU/OiBzdHJpbmc7XG4gIHRyYW5zYWN0aW9uTmFtZT86IHN0cmluZztcbiAgc2V0dXA6IFNldHVwO1xufSk6IFByb21pc2U8RVNSZXNwb25zZT4ge1xuICBjb25zdCB7IHN0YXJ0LCBlbmQsIGVzRmlsdGVyUXVlcnksIGNsaWVudCwgY29uZmlnIH0gPSBzZXR1cDtcbiAgY29uc3QgeyBpbnRlcnZhbFN0cmluZyB9ID0gZ2V0QnVja2V0U2l6ZShzdGFydCwgZW5kLCAnYXV0bycpO1xuXG4gIGNvbnN0IGZpbHRlcjogRVNGaWx0ZXJbXSA9IFtcbiAgICB7IHRlcm06IHsgW1BST0NFU1NPUl9FVkVOVF06ICd0cmFuc2FjdGlvbicgfSB9LFxuICAgIHsgdGVybTogeyBbU0VSVklDRV9OQU1FXTogc2VydmljZU5hbWUgfSB9LFxuICAgIHtcbiAgICAgIHJhbmdlOiB7XG4gICAgICAgICdAdGltZXN0YW1wJzoge1xuICAgICAgICAgIGd0ZTogc3RhcnQsXG4gICAgICAgICAgbHRlOiBlbmQsXG4gICAgICAgICAgZm9ybWF0OiAnZXBvY2hfbWlsbGlzJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBdO1xuXG4gIGlmICh0cmFuc2FjdGlvblR5cGUpIHtcbiAgICBmaWx0ZXIucHVzaCh7IHRlcm06IHsgW1RSQU5TQUNUSU9OX1RZUEVdOiB0cmFuc2FjdGlvblR5cGUgfSB9KTtcbiAgfVxuXG4gIGlmIChlc0ZpbHRlclF1ZXJ5KSB7XG4gICAgZmlsdGVyLnB1c2goZXNGaWx0ZXJRdWVyeSk7XG4gIH1cblxuICBjb25zdCBwYXJhbXM6IGFueSA9IHtcbiAgICBpbmRleDogY29uZmlnLmdldCgnYXBtX29zcy50cmFuc2FjdGlvbkluZGljZXMnKSxcbiAgICBib2R5OiB7XG4gICAgICBzaXplOiAwLFxuICAgICAgcXVlcnk6IHsgYm9vbDogeyBmaWx0ZXIgfSB9LFxuICAgICAgYWdnczoge1xuICAgICAgICByZXNwb25zZV90aW1lczoge1xuICAgICAgICAgIGRhdGVfaGlzdG9ncmFtOiB7XG4gICAgICAgICAgICBmaWVsZDogJ0B0aW1lc3RhbXAnLFxuICAgICAgICAgICAgaW50ZXJ2YWw6IGludGVydmFsU3RyaW5nLFxuICAgICAgICAgICAgbWluX2RvY19jb3VudDogMCxcbiAgICAgICAgICAgIGV4dGVuZGVkX2JvdW5kczogeyBtaW46IHN0YXJ0LCBtYXg6IGVuZCB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZ2dzOiB7XG4gICAgICAgICAgICBhdmc6IHsgYXZnOiB7IGZpZWxkOiBUUkFOU0FDVElPTl9EVVJBVElPTiB9IH0sXG4gICAgICAgICAgICBwY3Q6IHtcbiAgICAgICAgICAgICAgcGVyY2VudGlsZXM6IHsgZmllbGQ6IFRSQU5TQUNUSU9OX0RVUkFUSU9OLCBwZXJjZW50czogWzk1LCA5OV0gfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb3ZlcmFsbF9hdmdfZHVyYXRpb246IHsgYXZnOiB7IGZpZWxkOiBUUkFOU0FDVElPTl9EVVJBVElPTiB9IH0sXG4gICAgICAgIHRyYW5zYWN0aW9uX3Jlc3VsdHM6IHtcbiAgICAgICAgICB0ZXJtczogeyBmaWVsZDogVFJBTlNBQ1RJT05fUkVTVUxULCBtaXNzaW5nOiAnJyB9LFxuICAgICAgICAgIGFnZ3M6IHtcbiAgICAgICAgICAgIHRpbWVzZXJpZXM6IHtcbiAgICAgICAgICAgICAgZGF0ZV9oaXN0b2dyYW06IHtcbiAgICAgICAgICAgICAgICBmaWVsZDogJ0B0aW1lc3RhbXAnLFxuICAgICAgICAgICAgICAgIGludGVydmFsOiBpbnRlcnZhbFN0cmluZyxcbiAgICAgICAgICAgICAgICBtaW5fZG9jX2NvdW50OiAwLFxuICAgICAgICAgICAgICAgIGV4dGVuZGVkX2JvdW5kczogeyBtaW46IHN0YXJ0LCBtYXg6IGVuZCB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgaWYgKHRyYW5zYWN0aW9uTmFtZSkge1xuICAgIHBhcmFtcy5ib2R5LnF1ZXJ5LmJvb2wubXVzdCA9IFtcbiAgICAgIHsgdGVybTogeyBbYCR7VFJBTlNBQ1RJT05fTkFNRX0ua2V5d29yZGBdOiB0cmFuc2FjdGlvbk5hbWUgfSB9XG4gICAgXTtcbiAgfVxuXG4gIHJldHVybiBjbGllbnQ8dm9pZCwgQWdncz4oJ3NlYXJjaCcsIHBhcmFtcyk7XG59XG4iXX0=