"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
async function anomalySeriesFetcher({ serviceName, transactionType, intervalString, mlBucketSize, setup }) {
    const { client, start, end } = setup;
    // move the start back with one bucket size, to ensure to get anomaly data in the beginning
    // this is required because ML has a minimum bucket size (default is 900s) so if our buckets are smaller, we might have several null buckets in the beginning
    const newStart = start - mlBucketSize * 1000;
    const params = {
        index: `.ml-anomalies-${serviceName}-${transactionType}-high_mean_response_time`.toLowerCase(),
        body: {
            size: 0,
            query: {
                bool: {
                    must: {
                        exists: {
                            field: 'bucket_span'
                        }
                    },
                    filter: [
                        {
                            range: {
                                timestamp: {
                                    gte: newStart,
                                    lte: end,
                                    format: 'epoch_millis'
                                }
                            }
                        }
                    ]
                }
            },
            aggs: {
                ml_avg_response_times: {
                    date_histogram: {
                        field: 'timestamp',
                        interval: intervalString,
                        min_doc_count: 0,
                        extended_bounds: {
                            min: newStart,
                            max: end
                        }
                    },
                    aggs: {
                        anomaly_score: { max: { field: 'anomaly_score' } },
                        lower: { min: { field: 'model_lower' } },
                        upper: { max: { field: 'model_upper' } }
                    }
                }
            }
        }
    };
    try {
        return await client('search', params);
    }
    catch (err) {
        const isHttpError = 'statusCode' in err;
        if (isHttpError) {
            return;
        }
        throw err;
    }
}
exports.anomalySeriesFetcher = anomalySeriesFetcher;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvYXBtL3NlcnZlci9saWIvdHJhbnNhY3Rpb25zL2NoYXJ0cy9nZXRfYW5vbWFseV9kYXRhL2ZldGNoZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL2FwbS9zZXJ2ZXIvbGliL3RyYW5zYWN0aW9ucy9jaGFydHMvZ2V0X2Fub21hbHlfZGF0YS9mZXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQTRCSSxLQUFLLFVBQVUsb0JBQW9CLENBQUMsRUFDekMsV0FBVyxFQUNYLGVBQWUsRUFDZixjQUFjLEVBQ2QsWUFBWSxFQUNaLEtBQUssRUFPTjtJQUNDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQztJQUVyQywyRkFBMkY7SUFDM0YsNkpBQTZKO0lBQzdKLE1BQU0sUUFBUSxHQUFHLEtBQUssR0FBRyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBRTdDLE1BQU0sTUFBTSxHQUFHO1FBQ2IsS0FBSyxFQUFFLGlCQUFpQixXQUFXLElBQUksZUFBZSwwQkFBMEIsQ0FBQyxXQUFXLEVBQUU7UUFDOUYsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLENBQUM7WUFDUCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRTt3QkFDSixNQUFNLEVBQUU7NEJBQ04sS0FBSyxFQUFFLGFBQWE7eUJBQ3JCO3FCQUNGO29CQUNELE1BQU0sRUFBRTt3QkFDTjs0QkFDRSxLQUFLLEVBQUU7Z0NBQ0wsU0FBUyxFQUFFO29DQUNULEdBQUcsRUFBRSxRQUFRO29DQUNiLEdBQUcsRUFBRSxHQUFHO29DQUNSLE1BQU0sRUFBRSxjQUFjO2lDQUN2Qjs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1lBQ0QsSUFBSSxFQUFFO2dCQUNKLHFCQUFxQixFQUFFO29CQUNyQixjQUFjLEVBQUU7d0JBQ2QsS0FBSyxFQUFFLFdBQVc7d0JBQ2xCLFFBQVEsRUFBRSxjQUFjO3dCQUN4QixhQUFhLEVBQUUsQ0FBQzt3QkFDaEIsZUFBZSxFQUFFOzRCQUNmLEdBQUcsRUFBRSxRQUFROzRCQUNiLEdBQUcsRUFBRSxHQUFHO3lCQUNUO3FCQUNGO29CQUNELElBQUksRUFBRTt3QkFDSixhQUFhLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLEVBQUU7d0JBQ2xELEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsRUFBRTt3QkFDeEMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxFQUFFO3FCQUN6QztpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBRUYsSUFBSTtRQUNGLE9BQU8sTUFBTSxNQUFNLENBQWEsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ25EO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixNQUFNLFdBQVcsR0FBRyxZQUFZLElBQUksR0FBRyxDQUFDO1FBQ3hDLElBQUksV0FBVyxFQUFFO1lBQ2YsT0FBTztTQUNSO1FBQ0QsTUFBTSxHQUFHLENBQUM7S0FDWDtBQUNILENBQUM7QUF6RUQsb0RBeUVDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQWdncmVnYXRpb25TZWFyY2hSZXNwb25zZSB9IGZyb20gJ2VsYXN0aWNzZWFyY2gnO1xuaW1wb3J0IHsgU2V0dXAgfSBmcm9tICcuLi8uLi8uLi9oZWxwZXJzL3NldHVwX3JlcXVlc3QnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVTQnVja2V0IHtcbiAga2V5X2FzX3N0cmluZzogc3RyaW5nOyAvLyB0aW1lc3RhbXAgYXMgc3RyaW5nXG4gIGtleTogbnVtYmVyOyAvLyB0aW1lc3RhbXBcbiAgZG9jX2NvdW50OiBudW1iZXI7XG4gIGFub21hbHlfc2NvcmU6IHtcbiAgICB2YWx1ZTogbnVtYmVyIHwgbnVsbDtcbiAgfTtcbiAgbG93ZXI6IHtcbiAgICB2YWx1ZTogbnVtYmVyIHwgbnVsbDtcbiAgfTtcbiAgdXBwZXI6IHtcbiAgICB2YWx1ZTogbnVtYmVyIHwgbnVsbDtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIEFnZ3Mge1xuICBtbF9hdmdfcmVzcG9uc2VfdGltZXM6IHtcbiAgICBidWNrZXRzOiBFU0J1Y2tldFtdO1xuICB9O1xufVxuXG5leHBvcnQgdHlwZSBFU1Jlc3BvbnNlID0gQWdncmVnYXRpb25TZWFyY2hSZXNwb25zZTx2b2lkLCBBZ2dzPjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFub21hbHlTZXJpZXNGZXRjaGVyKHtcbiAgc2VydmljZU5hbWUsXG4gIHRyYW5zYWN0aW9uVHlwZSxcbiAgaW50ZXJ2YWxTdHJpbmcsXG4gIG1sQnVja2V0U2l6ZSxcbiAgc2V0dXBcbn06IHtcbiAgc2VydmljZU5hbWU6IHN0cmluZztcbiAgdHJhbnNhY3Rpb25UeXBlOiBzdHJpbmc7XG4gIGludGVydmFsU3RyaW5nOiBzdHJpbmc7XG4gIG1sQnVja2V0U2l6ZTogbnVtYmVyO1xuICBzZXR1cDogU2V0dXA7XG59KTogUHJvbWlzZTxFU1Jlc3BvbnNlIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IHsgY2xpZW50LCBzdGFydCwgZW5kIH0gPSBzZXR1cDtcblxuICAvLyBtb3ZlIHRoZSBzdGFydCBiYWNrIHdpdGggb25lIGJ1Y2tldCBzaXplLCB0byBlbnN1cmUgdG8gZ2V0IGFub21hbHkgZGF0YSBpbiB0aGUgYmVnaW5uaW5nXG4gIC8vIHRoaXMgaXMgcmVxdWlyZWQgYmVjYXVzZSBNTCBoYXMgYSBtaW5pbXVtIGJ1Y2tldCBzaXplIChkZWZhdWx0IGlzIDkwMHMpIHNvIGlmIG91ciBidWNrZXRzIGFyZSBzbWFsbGVyLCB3ZSBtaWdodCBoYXZlIHNldmVyYWwgbnVsbCBidWNrZXRzIGluIHRoZSBiZWdpbm5pbmdcbiAgY29uc3QgbmV3U3RhcnQgPSBzdGFydCAtIG1sQnVja2V0U2l6ZSAqIDEwMDA7XG5cbiAgY29uc3QgcGFyYW1zID0ge1xuICAgIGluZGV4OiBgLm1sLWFub21hbGllcy0ke3NlcnZpY2VOYW1lfS0ke3RyYW5zYWN0aW9uVHlwZX0taGlnaF9tZWFuX3Jlc3BvbnNlX3RpbWVgLnRvTG93ZXJDYXNlKCksXG4gICAgYm9keToge1xuICAgICAgc2l6ZTogMCxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIGJvb2w6IHtcbiAgICAgICAgICBtdXN0OiB7XG4gICAgICAgICAgICBleGlzdHM6IHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdidWNrZXRfc3BhbidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpbHRlcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgIHRpbWVzdGFtcDoge1xuICAgICAgICAgICAgICAgICAgZ3RlOiBuZXdTdGFydCxcbiAgICAgICAgICAgICAgICAgIGx0ZTogZW5kLFxuICAgICAgICAgICAgICAgICAgZm9ybWF0OiAnZXBvY2hfbWlsbGlzJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGFnZ3M6IHtcbiAgICAgICAgbWxfYXZnX3Jlc3BvbnNlX3RpbWVzOiB7XG4gICAgICAgICAgZGF0ZV9oaXN0b2dyYW06IHtcbiAgICAgICAgICAgIGZpZWxkOiAndGltZXN0YW1wJyxcbiAgICAgICAgICAgIGludGVydmFsOiBpbnRlcnZhbFN0cmluZyxcbiAgICAgICAgICAgIG1pbl9kb2NfY291bnQ6IDAsXG4gICAgICAgICAgICBleHRlbmRlZF9ib3VuZHM6IHtcbiAgICAgICAgICAgICAgbWluOiBuZXdTdGFydCxcbiAgICAgICAgICAgICAgbWF4OiBlbmRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGFnZ3M6IHtcbiAgICAgICAgICAgIGFub21hbHlfc2NvcmU6IHsgbWF4OiB7IGZpZWxkOiAnYW5vbWFseV9zY29yZScgfSB9LFxuICAgICAgICAgICAgbG93ZXI6IHsgbWluOiB7IGZpZWxkOiAnbW9kZWxfbG93ZXInIH0gfSxcbiAgICAgICAgICAgIHVwcGVyOiB7IG1heDogeyBmaWVsZDogJ21vZGVsX3VwcGVyJyB9IH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgY2xpZW50PHZvaWQsIEFnZ3M+KCdzZWFyY2gnLCBwYXJhbXMpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zdCBpc0h0dHBFcnJvciA9ICdzdGF0dXNDb2RlJyBpbiBlcnI7XG4gICAgaWYgKGlzSHR0cEVycm9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRocm93IGVycjtcbiAgfVxufVxuIl19